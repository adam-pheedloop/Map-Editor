import { useCallback, useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";
import type Konva from "konva";
import type { FloorPlanData, LayerDefinition, LayerId } from "../../../types";
import { ELEMENT_TYPE_TO_LAYER } from "../../../types";
import type { ToolDefinition, ToolInteraction, ToolContext } from "../../tools/types";
import { findToolForElement } from "../../tools/registry";
import { isEmptySpaceClick, getCanvasPoint } from "../../utils/canvas";
import { ElementShape } from "./ElementShape";
import { SelectionTransformer } from "./SelectionTransformer";
import { BackgroundImage } from "./BackgroundImage";
import { AlignmentGuides } from "./AlignmentGuides";
import { SelectionRect } from "./SelectionRect";
import { MultiSelectBounds } from "./MultiSelectBounds";
import { GridLayer } from "./GridLayer";
import { WalkableGridOverlay } from "./WalkableGridOverlay";
import { CalibrationPreview } from "./CalibrationPreview";
import type { CalibrationState } from "../../hooks/useCalibration";
import { useAlignmentGuides } from "../../hooks/useAlignmentGuides";
import { getElementBounds, lineIntersectsRect } from "../../utils/bounds";
import { PolygonVertexHandles } from "../../tools/handles/PolygonVertexHandles";

// ---------------------------------------------------------------------------
// ToolHost — mounts/unmounts with key={tool.id} to manage hook lifecycle
// ---------------------------------------------------------------------------

function ToolHost({
  tool,
  context,
  onInteraction,
}: {
  tool: ToolDefinition;
  context: ToolContext;
  onInteraction: (interaction: ToolInteraction) => void;
}) {
  const interaction = tool.useInteraction(context);

  useEffect(() => {
    onInteraction(interaction);
  });

  // Key listener for tools that need it (e.g. arc Escape to cancel)
  useEffect(() => {
    if (!interaction.handleKeyDown) return;
    const handler = interaction.handleKeyDown;
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [interaction.handleKeyDown]);

  // Render preview if the tool has one
  const Preview = tool.PreviewComponent;
  return Preview ? (
    <Preview
      state={interaction.state}
      scale={context.scale}
      dimensions={context.data.dimensions}
    />
  ) : null;
}

// ---------------------------------------------------------------------------
// Canvas
// ---------------------------------------------------------------------------

interface CanvasProps {
  data: FloorPlanData;
  /** null = select mode (built-in), otherwise the active registry tool */
  activeTool: ToolDefinition | null;
  toolContext: ToolContext;
  selectedIds: Set<string>;
  scale: number;
  position: { x: number; y: number };
  stageSize: { width: number; height: number };
  stageRef: React.RefObject<Konva.Stage | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onWheel: (e: Konva.KonvaEventObject<WheelEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onSelect: (id: string | null, shiftKey?: boolean) => void;
  onDragSelect: (ids: string[]) => void;
  onElementMove: (id: string, x: number, y: number) => void;
  onMultiMove: (updates: Array<{ id: string; x: number; y: number }>) => void;
  onElementResize: (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number
  ) => void;
  onGeometryUpdate: (id: string, updates: Partial<import("../../../types").Geometry>) => void;
  onElementContextMenu: (id: string, screenX: number, screenY: number) => void;
  gridSettings: {
    showGrid: boolean;
    gridSpacing: number;
    snapToGrid: boolean;
    gridColor: string;
    gridOpacity: number;
  };
  snapToObjects: boolean;
  layers: LayerDefinition[];
  activeLayerId: LayerId;
  walkableGridOpacity?: number;
  walkableHoverCell?: { col: number; row: number } | null;
  onPathingMouseDown?: () => void;
  onPathingMouseMove?: () => void;
  onPathingMouseUp?: () => void;
  isPathingMode?: boolean;
  pathingRectPreview?: { startCol: number; startRow: number; endCol: number; endRow: number } | null;
  pendingCells?: Set<string>;
  pendingValue?: 0 | 1;
  // Scale calibration
  isCalibrating?: boolean;
  calibrationState?: CalibrationState;
  existingCalibration?: FloorPlanData["scaleCalibration"];
  onCalibrationClick?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onCalibrationMouseMove?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  unlinkedElementIds?: Set<string>;
}

export function Canvas({
  data,
  activeTool,
  toolContext,
  selectedIds,
  scale,
  position,
  stageSize,
  stageRef,
  containerRef,
  onWheel,
  onDragEnd,
  onSelect,
  onDragSelect,
  onElementMove,
  onMultiMove,
  onElementResize,
  onGeometryUpdate,
  onElementContextMenu,
  gridSettings,
  snapToObjects,
  layers,
  activeLayerId,
  walkableGridOpacity = 0.3,
  walkableHoverCell,
  onPathingMouseDown,
  onPathingMouseMove,
  onPathingMouseUp,
  isPathingMode,
  pathingRectPreview,
  pendingCells,
  pendingValue,
  isCalibrating,
  calibrationState,
  existingCalibration,
  onCalibrationClick,
  onCalibrationMouseMove,
  unlinkedElementIds,
}: CanvasProps) {
  const isSelectMode = activeTool === null;

  // Track Space key for pan mode
  const [spaceHeld, setSpaceHeld] = useState(false);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSpaceHeld(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") setSpaceHeld(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const isPanMode = spaceHeld;

  // Drag-select rectangle state
  const [dragSelectRect, setDragSelectRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const dragSelectOrigin = useRef<{ x: number; y: number } | null>(null);

  // Multi-drag tracking
  const [isMultiDragging, setIsMultiDragging] = useState(false);
  const dragStartPositions = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Tool interaction ref — updated by ToolHost on each render
  const toolInteractionRef = useRef<ToolInteraction | null>(null);

  const handleToolInteraction = useCallback((interaction: ToolInteraction) => {
    toolInteractionRef.current = interaction;
  }, []);

  // Clear interaction ref when switching to select mode
  useEffect(() => {
    if (isSelectMode) {
      toolInteractionRef.current = null;
    }
  }, [isSelectMode]);

  const { activeGuides, startDrag, endDrag, snapPosition } = useAlignmentGuides(data.elements);

  const sortedElements = [...data.elements].sort(
    (a, b) => (a.properties.zIndex ?? 0) - (b.properties.zIndex ?? 0)
  );

  // Build a visibility lookup from layers prop
  const layerVisibility = new Map(layers.map((l) => [l.id, l.visible]));

  // Group sorted elements by layer
  const elementsByLayer = new Map<LayerId, typeof sortedElements>();
  for (const el of sortedElements) {
    const lid = el.layer ?? ELEMENT_TYPE_TO_LAYER[el.type];
    const group = elementsByLayer.get(lid);
    if (group) {
      group.push(el);
    } else {
      elementsByLayer.set(lid, [el]);
    }
  }

  // Ordered layer IDs for rendering (excluding background — handled separately)
  const elementLayerOrder: LayerId[] = ["content", "pathing", "markup"];

  // Selected element + handle lookup from registry
  const selectedElement = selectedIds.size === 1
    ? data.elements.find((el) => selectedIds.has(el.id))
    : undefined;
  const handleDef = selectedElement
    ? findToolForElement(selectedElement.geometry.shape, selectedElement.type)
    : undefined;
  // Polygon vertex handles apply to any polygon element regardless of its type
  // (booth, session_area, meeting_room, or plain shape).
  const HandleComponent =
    selectedElement?.geometry.shape === "polygon"
      ? PolygonVertexHandles
      : handleDef?.HandleComponent;

  // --- Mouse event handlers ---

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isPanMode) return;

    // Calibration mode: intercept before everything else
    if (isCalibrating && onCalibrationClick) {
      onCalibrationClick(e);
      return;
    }

    // Pathing mode: delegate to pathing handlers
    if (isPathingMode && onPathingMouseDown) {
      onPathingMouseDown();
      return;
    }

    // Select mode: built-in selection behavior
    if (isSelectMode) {
      if (isEmptySpaceClick(e)) {
        const stage = stageRef.current;
        if (!stage) return;
        const point = getCanvasPoint(stage, position, scale);
        if (point) {
          dragSelectOrigin.current = point;
          setDragSelectRect({ x: point.x, y: point.y, width: 0, height: 0 });
        }
        onSelect(null);
      }
      return;
    }

    // Active tool: delegate to tool interaction
    toolInteractionRef.current?.handleMouseDown(e);
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Calibration mode
    if (isCalibrating && onCalibrationMouseMove) {
      onCalibrationMouseMove(e);
      return;
    }

    // Pathing mode
    if (isPathingMode && onPathingMouseMove) {
      onPathingMouseMove();
      if (!dragSelectOrigin.current) return;
    }

    // Drag-select rectangle
    if (dragSelectOrigin.current && isSelectMode) {
      const stage = stageRef.current;
      if (!stage) return;
      const point = getCanvasPoint(stage, position, scale);
      if (!point) return;
      const o = dragSelectOrigin.current;
      setDragSelectRect({
        x: Math.min(o.x, point.x),
        y: Math.min(o.y, point.y),
        width: Math.abs(point.x - o.x),
        height: Math.abs(point.y - o.y),
      });
      return;
    }

    // Active tool: delegate to tool interaction
    toolInteractionRef.current?.handleMouseMove(e);
  };

  const handleMouseUp = () => {
    // Pathing mode
    if (isPathingMode && onPathingMouseUp) {
      onPathingMouseUp();
      return;
    }

    // Complete drag-select
    if (dragSelectOrigin.current && dragSelectRect) {
      if (dragSelectRect.width > 5 && dragSelectRect.height > 5) {
        const rect = dragSelectRect;
        const OVERLAP_THRESHOLD = 0.9;
        const enclosed = data.elements.filter((el) => {
          const elLayer = el.layer ?? ELEMENT_TYPE_TO_LAYER[el.type];
          if (elLayer !== activeLayerId) return false;

          const b = getElementBounds(el);

          if (el.geometry.shape === "line") {
            const geo = el.geometry;
            const [x1, y1, x2, y2] = geo.points;
            return lineIntersectsRect(
              geo.x + x1, geo.y + y1, geo.x + x2, geo.y + y2,
              rect.x, rect.y, rect.width, rect.height
            );
          }

          const elWidth = b.right - b.left;
          const elHeight = b.bottom - b.top;
          if (elWidth <= 0 || elHeight <= 0) return false;

          const overlapX = Math.max(0, Math.min(b.right, rect.x + rect.width) - Math.max(b.left, rect.x));
          const overlapY = Math.max(0, Math.min(b.bottom, rect.y + rect.height) - Math.max(b.top, rect.y));
          const overlapArea = overlapX * overlapY;
          const elArea = elWidth * elHeight;

          return overlapArea / elArea >= OVERLAP_THRESHOLD;
        });
        if (enclosed.length > 0) {
          onDragSelect(enclosed.map((el) => el.id));
        }
      }
      dragSelectOrigin.current = null;
      setDragSelectRect(null);
      return;
    }

    // Active tool: delegate to tool interaction
    toolInteractionRef.current?.handleMouseUp();
  };

  const handleDoubleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    toolInteractionRef.current?.handleDoubleClick?.(e);
  };

  // --- Element drag handlers (unchanged) ---

  const handleElementDragStart = useCallback(
    (id: string) => {
      startDrag(id);

      if (selectedIds.has(id) && selectedIds.size > 1) {
        setIsMultiDragging(true);
        const stage = stageRef.current;
        if (!stage) return;
        const positions = new Map<string, { x: number; y: number }>();
        for (const sid of selectedIds) {
          const node = stage.findOne(`.${sid}`);
          if (node) {
            positions.set(sid, { x: node.x(), y: node.y() });
          }
        }
        dragStartPositions.current = positions;
      } else {
        dragStartPositions.current = new Map();
      }
    },
    [startDrag, selectedIds, stageRef]
  );

  const handleElementDragMove = useCallback(
    (id: string, x: number, y: number) => {
      const isMulti = selectedIds.has(id) && selectedIds.size > 1;
      const stage = stageRef.current;
      if (!stage) return;

      if (isMulti) {
        const startPos = dragStartPositions.current.get(id);
        if (!startPos) return;

        const dx = x - startPos.x;
        const dy = y - startPos.y;

        for (const sid of selectedIds) {
          if (sid === id) continue;
          const sStart = dragStartPositions.current.get(sid);
          const sNode = stage.findOne(`.${sid}`);
          if (sStart && sNode) {
            sNode.x(sStart.x + dx);
            sNode.y(sStart.y + dy);
          }
        }
      } else {
        const element = data.elements.find((el) => el.id === id);
        if (!element) return;

        let finalX = x;
        let finalY = y;
        let guidesSnappedX = false;
        let guidesSnappedY = false;

        if (snapToObjects) {
          const geo = element.geometry;
          const proposedBounds = getElementBounds({
            ...element,
            geometry: { ...geo, x, y } as typeof geo,
          });

          const anchorOffsetX = x - proposedBounds.left;
          const anchorOffsetY = y - proposedBounds.top;

          const snapped = snapPosition(id, proposedBounds);
          if (snapped.x !== proposedBounds.left) {
            finalX = snapped.x + anchorOffsetX;
            guidesSnappedX = true;
          }
          if (snapped.y !== proposedBounds.top) {
            finalY = snapped.y + anchorOffsetY;
            guidesSnappedY = true;
          }
        }

        if (gridSettings.snapToGrid) {
          const gs = gridSettings.gridSpacing;
          const gridSnapThreshold = gs * 0.25;
          if (!guidesSnappedX) {
            const nearestGridX = Math.round(x / gs) * gs;
            if (Math.abs(x - nearestGridX) < gridSnapThreshold) {
              finalX = nearestGridX;
            }
          }
          if (!guidesSnappedY) {
            const nearestGridY = Math.round(y / gs) * gs;
            if (Math.abs(y - nearestGridY) < gridSnapThreshold) {
              finalY = nearestGridY;
            }
          }
        }

        const node = stage.findOne(`.${id}`);
        if (node) {
          node.x(finalX);
          node.y(finalY);
        }
      }
    },
    [data.elements, snapPosition, stageRef, selectedIds, gridSettings, snapToObjects]
  );

  const handleElementDragEnd = useCallback(
    (id: string, _x: number, _y: number) => {
      endDrag();

      if (selectedIds.has(id) && selectedIds.size > 1) {
        const stage = stageRef.current;
        if (!stage) return;
        const updates: Array<{ id: string; x: number; y: number }> = [];
        for (const sid of selectedIds) {
          const node = stage.findOne(`.${sid}`);
          if (node) {
            updates.push({ id: sid, x: node.x(), y: node.y() });
          }
        }
        onMultiMove(updates);
        dragStartPositions.current = new Map();
        setIsMultiDragging(false);
      } else {
        const stage = stageRef.current;
        const node = stage?.findOne(`.${id}`);
        if (node) {
          onElementMove(id, node.x(), node.y());
        } else {
          onElementMove(id, _x, _y);
        }
      }
    },
    [endDrag, selectedIds, stageRef, onMultiMove, onElementMove]
  );

  // --- Cursor ---
  const cursor = isPanMode
    ? "grab"
    : isCalibrating
      ? "crosshair"
      : isPathingMode
        ? "crosshair"
        : activeTool
          ? activeTool.cursor
          : "default";

  return (
    <div
      ref={containerRef}
      className="flex-1 min-w-0 bg-gray-200 overflow-hidden"
      style={{ cursor }}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable={isPanMode || (!isPathingMode && isSelectMode && !dragSelectOrigin.current)}
        onWheel={onWheel}
        onDragEnd={onDragEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDblClick={handleDoubleClick}
      >
        {/* Background layer: color fill, image, grid */}
        <Layer>
          <Rect
            id="background"
            x={0}
            y={0}
            width={data.dimensions.width}
            height={data.dimensions.height}
            fill={data.backgroundColor ?? "#ffffff"}
            stroke="#d1d5db"
            strokeWidth={1}
          />
          {data.backgroundImage && layerVisibility.get("background") !== false && (
            <BackgroundImage config={data.backgroundImage} />
          )}
          {gridSettings.showGrid && (
            <GridLayer
              width={data.dimensions.width}
              height={data.dimensions.height}
              spacing={gridSettings.gridSpacing}
              color={gridSettings.gridColor}
              opacity={gridSettings.gridOpacity}
            />
          )}
        </Layer>

        {/* Element layers: one Konva Layer per floor plan layer */}
        {elementLayerOrder.map((layerId) => {
          const isActiveLayer = layerId === activeLayerId;
          return (
            <Layer key={layerId} visible={layerVisibility.get(layerId) !== false} listening={isActiveLayer}>
              {layerId === "pathing" && data.walkableLayer && (
                <WalkableGridOverlay
                  grid={data.walkableLayer}
                  showGridLines={activeLayerId === "pathing"}
                  opacity={walkableGridOpacity}
                  hoverCell={activeLayerId === "pathing" ? walkableHoverCell : null}
                  pendingCells={pendingCells}
                  pendingValue={pendingValue}
                />
              )}
              {(elementsByLayer.get(layerId) ?? []).map((element) => (
                <ElementShape
                  key={element.id}
                  element={element}
                  isSelectMode={isSelectMode && isActiveLayer}
                  isSelected={selectedIds.has(element.id)}
                  isLinked={!unlinkedElementIds?.has(element.id)}
                  onSelect={onSelect}
                  onDragStart={handleElementDragStart}
                  onDragMove={handleElementDragMove}
                  onDragEnd={handleElementDragEnd}
                  onContextMenu={onElementContextMenu}
                />
              ))}
            </Layer>
          );
        })}

        {/* Selection overlay: transformer, multi-select bounds, handles */}
        <Layer>
          <SelectionTransformer
            selectedIds={selectedIds}
            stageRef={stageRef}
            elements={data.elements}
            onTransformEnd={onElementResize}
          />
          {!isMultiDragging && (
            <MultiSelectBounds
              elements={data.elements}
              selectedIds={selectedIds}
            />
          )}
          {HandleComponent && selectedElement && (
            <HandleComponent
              element={selectedElement}
              onGeometryUpdate={onGeometryUpdate}
            />
          )}
        </Layer>

        {/* Drawing overlay: tool preview, guides, drag-select rect */}
        <Layer>
          {/* Tool preview is rendered inside ToolHost */}
          {activeTool && (
            <ToolHost
              key={activeTool.id}
              tool={activeTool}
              context={toolContext}
              onInteraction={handleToolInteraction}
            />
          )}
          <AlignmentGuides
            guides={activeGuides}
            canvasWidth={data.dimensions.width}
            canvasHeight={data.dimensions.height}
          />
          <SelectionRect rect={dragSelectRect} />
          {isCalibrating && calibrationState && (
            <CalibrationPreview
              calibrationState={calibrationState}
              existingCalibration={existingCalibration}
              scale={scale}
            />
          )}
          {pathingRectPreview && data.walkableLayer && (
            <Rect
              x={Math.min(pathingRectPreview.startCol, pathingRectPreview.endCol) * data.walkableLayer.cellSize}
              y={Math.min(pathingRectPreview.startRow, pathingRectPreview.endRow) * data.walkableLayer.cellSize}
              width={(Math.abs(pathingRectPreview.endCol - pathingRectPreview.startCol) + 1) * data.walkableLayer.cellSize}
              height={(Math.abs(pathingRectPreview.endRow - pathingRectPreview.startRow) + 1) * data.walkableLayer.cellSize}
              fill="rgba(34, 197, 94, 0.2)"
              stroke="rgba(34, 197, 94, 0.8)"
              strokeWidth={1}
              dash={[4, 4]}
              listening={false}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
