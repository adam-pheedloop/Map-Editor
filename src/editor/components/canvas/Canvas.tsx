import { useCallback, useState, useRef } from "react";
import { Stage, Layer, Rect } from "react-konva";
import type Konva from "konva";
import type { FloorPlanData, LineGeometry } from "../../../types";
import type { ActiveTool } from "../../types";
import { isEmptySpaceClick, getCanvasPoint } from "../../utils/canvas";
import { useDrawingTool } from "../../hooks/useDrawingTool";
import { useLineTool } from "../../hooks/useLineTool";
import { ElementShape } from "./ElementShape";
import { SelectionTransformer } from "./SelectionTransformer";
import { LineEndpointHandles } from "./LineEndpointHandles";
import { DrawingPreview } from "./DrawingPreview";
import { BackgroundImage } from "./BackgroundImage";
import { AlignmentGuides } from "./AlignmentGuides";
import { SelectionRect } from "./SelectionRect";
import { useAlignmentGuides } from "../../hooks/useAlignmentGuides";
import { getElementBounds } from "../../utils/bounds";

interface CanvasProps {
  data: FloorPlanData;
  activeTool: ActiveTool;
  selectedIds: Set<string>;
  scale: number;
  position: { x: number; y: number };
  stageSize: { width: number; height: number };
  stageRef: React.RefObject<Konva.Stage | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onWheel: (e: Konva.KonvaEventObject<WheelEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDrawEnd: (x: number, y: number, width: number, height: number) => void;
  onLineDrawEnd: (x1: number, y1: number, x2: number, y2: number) => void;
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
  onEndpointMove: (id: string, pointIndex: 0 | 1, x: number, y: number) => void;
  onElementContextMenu: (id: string, screenX: number, screenY: number) => void;
}

export function Canvas({
  data,
  activeTool,
  selectedIds,
  scale,
  position,
  stageSize,
  stageRef,
  containerRef,
  onWheel,
  onDragEnd,
  onDrawEnd,
  onLineDrawEnd,
  onSelect,
  onDragSelect,
  onElementMove,
  onMultiMove,
  onEndpointMove,
  onElementResize,
  onElementContextMenu,
}: CanvasProps) {
  const isSelectMode = activeTool === "select";
  const isDrawing = !isSelectMode;
  const isLineTool = activeTool === "line";

  // Drag-select rectangle state
  const [dragSelectRect, setDragSelectRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const dragSelectOrigin = useRef<{ x: number; y: number } | null>(null);

  // Multi-drag tracking
  const dragStartPositions = useRef<Map<string, { x: number; y: number }>>(new Map());

  const shapeDrawing = useDrawingTool(
    stageRef,
    position,
    scale,
    isDrawing && !isLineTool,
    onDrawEnd
  );

  const lineDrawing = useLineTool(
    stageRef,
    position,
    scale,
    isLineTool,
    onLineDrawEnd
  );

  const { activeGuides, startDrag, endDrag, snapPosition } = useAlignmentGuides(data.elements);

  const sortedElements = [...data.elements].sort(
    (a, b) => (a.properties.zIndex ?? 0) - (b.properties.zIndex ?? 0)
  );

  const selectedElement = selectedIds.size === 1
    ? data.elements.find((el) => selectedIds.has(el.id))
    : undefined;
  const isSelectedLine = selectedElement?.geometry.shape === "line";

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isSelectMode) {
      if (isEmptySpaceClick(e)) {
        // Start drag-select rectangle
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
    if (isLineTool) {
      lineDrawing.handleMouseDown(e);
    } else {
      shapeDrawing.handleMouseDown(e);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
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

    if (isLineTool) {
      lineDrawing.handleMouseMove(e);
    } else {
      shapeDrawing.handleMouseMove(e);
    }
  };

  const handleMouseUp = () => {
    // Complete drag-select
    if (dragSelectOrigin.current && dragSelectRect) {
      if (dragSelectRect.width > 5 && dragSelectRect.height > 5) {
        const rect = dragSelectRect;
        const enclosed = data.elements.filter((el) => {
          const bounds = getElementBounds(el);
          return (
            bounds.left >= rect.x &&
            bounds.right <= rect.x + rect.width &&
            bounds.top >= rect.y &&
            bounds.bottom <= rect.y + rect.height
          );
        });
        if (enclosed.length > 0) {
          onDragSelect(enclosed.map((el) => el.id));
        }
      }
      dragSelectOrigin.current = null;
      setDragSelectRect(null);
      return;
    }

    if (isLineTool) {
      lineDrawing.handleMouseUp();
    } else {
      shapeDrawing.handleMouseUp();
    }
  };

  const handleElementDragStart = useCallback(
    (id: string) => {
      startDrag(id);

      // Record start positions for all selected elements (for multi-drag)
      if (selectedIds.has(id) && selectedIds.size > 1) {
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
      const element = data.elements.find((el) => el.id === id);
      if (!element) return;

      const geo = element.geometry;
      const proposedBounds = getElementBounds({
        ...element,
        geometry: { ...geo, x, y } as typeof geo,
      });

      const snapped = snapPosition(id, proposedBounds);

      const stage = stageRef.current;
      if (!stage) return;

      const node = stage.findOne(`.${id}`);
      if (!node) return;

      // Apply snap to the dragged element
      node.x(snapped.x);
      node.y(snapped.y);

      // Multi-drag: move other selected elements by the same delta
      if (selectedIds.has(id) && selectedIds.size > 1 && dragStartPositions.current.size > 0) {
        const startPos = dragStartPositions.current.get(id);
        if (startPos) {
          const dx = snapped.x - startPos.x;
          const dy = snapped.y - startPos.y;
          for (const sid of selectedIds) {
            if (sid === id) continue;
            const sStart = dragStartPositions.current.get(sid);
            const sNode = stage.findOne(`.${sid}`);
            if (sStart && sNode) {
              sNode.x(sStart.x + dx);
              sNode.y(sStart.y + dy);
            }
          }
        }
      }
    },
    [data.elements, snapPosition, stageRef, selectedIds]
  );

  const handleElementDragEnd = useCallback(
    (id: string, x: number, y: number) => {
      endDrag();

      // Multi-drag: persist all positions
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
      } else {
        onElementMove(id, x, y);
      }
    },
    [endDrag, selectedIds, stageRef, onMultiMove, onElementMove]
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 min-w-0 bg-gray-200 overflow-hidden"
      style={{ cursor: isDrawing ? "crosshair" : "default" }}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable={isSelectMode && !dragSelectOrigin.current}
        onWheel={onWheel}
        onDragEnd={onDragEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <Rect
            id="background"
            x={0}
            y={0}
            width={data.dimensions.width}
            height={data.dimensions.height}
            fill="#ffffff"
            stroke="#d1d5db"
            strokeWidth={1}
          />
          {data.backgroundImage && (
            <BackgroundImage config={data.backgroundImage} />
          )}
        </Layer>

        <Layer>
          {sortedElements.map((element) => (
            <ElementShape
              key={element.id}
              element={element}
              isSelectMode={isSelectMode}
              isSelected={selectedIds.has(element.id)}
              onSelect={onSelect}
              onDragStart={handleElementDragStart}
              onDragMove={handleElementDragMove}
              onDragEnd={handleElementDragEnd}
              onContextMenu={onElementContextMenu}
            />
          ))}
          <SelectionTransformer
            selectedIds={selectedIds}
            stageRef={stageRef}
            elements={data.elements}
            onTransformEnd={onElementResize}
          />
          {isSelectedLine && selectedElement && (
            <LineEndpointHandles
              elementId={selectedElement.id}
              geometry={selectedElement.geometry as LineGeometry}
              onEndpointMove={onEndpointMove}
            />
          )}
        </Layer>

        <Layer>
          <DrawingPreview
            rectPreview={shapeDrawing.preview}
            linePreview={lineDrawing.preview}
            activeTool={activeTool}
          />
          <AlignmentGuides
            guides={activeGuides}
            canvasWidth={data.dimensions.width}
            canvasHeight={data.dimensions.height}
          />
          <SelectionRect rect={dragSelectRect} />
        </Layer>
      </Stage>
    </div>
  );
}
