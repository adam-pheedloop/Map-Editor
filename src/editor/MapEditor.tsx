import { useRef, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import type { ActiveTool } from "./types";
import type { DrawingDefaults } from "./components/panels/OptionsBar";
import { useCanvasControls } from "./hooks/useCanvasControls";
import { useEditorState } from "./hooks/useEditorState";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { Canvas } from "./components/canvas/Canvas";
import { ToolSidebar } from "./components/panels/ToolSidebar";
import { TopBar } from "./components/TopBar";
import { OptionsBar } from "./components/panels/OptionsBar";
import { StatusBar } from "./components/StatusBar";
import { PropertiesPanel } from "./components/panels/PropertiesPanel";
import { getShapeConfig } from "./components/canvas/elements";
import { ContextMenu, type ContextMenuItem } from "./components/canvas/ContextMenu";
import { MapDebugDialog } from "./components/debug";
import { BackgroundImageDialog } from "./components/panels/BackgroundImageDialog";
import type { FloorPlanData } from "../types";

const INITIAL_DEFAULTS: DrawingDefaults = {
  fill: "#94a3b8",
  stroke: "#888888",
  strokeWidth: 1,
};

interface MapEditorProps {
  initialData: FloorPlanData;
  debug?: boolean;
}

export function MapEditor({ initialData, debug: debugProp }: MapEditorProps) {
  const debug = debugProp || import.meta.env.DEV;

  const {
    data,
    addElement,
    updateElement,
    updateProperties,
    deleteElement,
    updateElementType,
    setBackgroundImage,
    updateDimensions,
  } = useEditorState(initialData);
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [defaults, setDefaults] = useState<DrawingDefaults>(INITIAL_DEFAULTS);
  const [showMapDebug, setShowMapDebug] = useState(false);
  const [showBgDialog, setShowBgDialog] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    elementId: string;
    x: number;
    y: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    stageRef,
    scale,
    position,
    stageSize,
    handleWheel,
    handleDragEnd,
    zoomReset,
  } = useCanvasControls(containerRef);

  const selectedElement = selectedId
    ? data.elements.find((el) => el.id === selectedId) ?? null
    : null;

  const handleDeselect = useCallback(() => {
    setSelectedId(null);
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedId) {
      deleteElement(selectedId);
      setSelectedId(null);
    }
  }, [selectedId, deleteElement]);

  useKeyboardShortcuts({
    setActiveTool,
    onDeselect: handleDeselect,
    onDelete: handleDelete,
  });

  // The colors shown in the options bar: selected element's colors or defaults
  const activeDefaults: DrawingDefaults = selectedElement
    ? {
        fill: selectedElement.properties.color,
        stroke:
          selectedElement.geometry.shape === "line"
            ? selectedElement.properties.color
            : selectedElement.properties.strokeColor || "#888888",
        strokeWidth:
          selectedElement.properties.strokeWidth ??
          (selectedElement.geometry.shape === "line" ? 2 : 1),
      }
    : defaults;

  const handleDefaultsChange = useCallback(
    (updates: Partial<DrawingDefaults>) => {
      // Always update defaults
      setDefaults((prev) => ({ ...prev, ...updates }));

      // If something is selected, also update the element
      if (selectedId && selectedElement) {
        const isLine = selectedElement.geometry.shape === "line";
        if (updates.fill !== undefined) {
          if (isLine) {
            // Lines use color as their stroke
            updateProperties(selectedId, { color: updates.fill });
          } else {
            updateProperties(selectedId, { color: updates.fill });
          }
        }
        if (updates.stroke !== undefined) {
          if (isLine) {
            updateProperties(selectedId, { color: updates.stroke });
          } else {
            updateProperties(selectedId, { strokeColor: updates.stroke });
          }
        }
        if (updates.strokeWidth !== undefined) {
          updateProperties(selectedId, { strokeWidth: updates.strokeWidth });
        }
      }
    },
    [selectedId, selectedElement, updateProperties]
  );

  const handleDrawEnd = useCallback(
    (x: number, y: number, width: number, height: number) => {
      const id = uuidv4();

      if (activeTool === "booth") {
        addElement({
          id,
          type: "booth",
          geometry: { shape: "rect" as const, x, y, width, height },
          properties: {
            name: "Booth",
            color: defaults.fill,
            strokeColor: defaults.stroke,
            strokeWidth: defaults.strokeWidth,
            zIndex: 1,
            area: width * height,
          },
        });
      } else {
        const geometry =
          activeTool === "ellipse"
            ? {
                shape: "ellipse" as const,
                x,
                y,
                radiusX: width / 2,
                radiusY: height / 2,
              }
            : { shape: "rect" as const, x, y, width, height };

        const name = activeTool === "ellipse" ? "Ellipse" : "Rectangle";

        addElement({
          id,
          type: "shape",
          geometry,
          properties: {
            name,
            color: defaults.fill,
            strokeColor: defaults.stroke,
            strokeWidth: defaults.strokeWidth,
            zIndex: 1,
          },
        });
      }
      setSelectedId(id);
      setActiveTool("select");
    },
    [activeTool, addElement, defaults]
  );

  const handleLineDrawEnd = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      const id = uuidv4();

      const anchorX = (x1 + x2) / 2;
      const anchorY = (y1 + y2) / 2;

      addElement({
        id,
        type: "shape",
        geometry: {
          shape: "line",
          x: anchorX,
          y: anchorY,
          points: [
            x1 - anchorX,
            y1 - anchorY,
            x2 - anchorX,
            y2 - anchorY,
          ],
        },
        properties: {
          name: "Line",
          color: defaults.stroke,
          strokeWidth: defaults.strokeWidth,
          zIndex: 1,
        },
      });
      setSelectedId(id);
      setActiveTool("select");
    },
    [addElement, defaults]
  );

  const handleEndpointMove = useCallback(
    (id: string, pointIndex: 0 | 1, x: number, y: number) => {
      const element = data.elements.find((el) => el.id === id);
      if (!element || element.geometry.shape !== "line") return;

      const geo = element.geometry;
      const relX = x - geo.x;
      const relY = y - geo.y;

      const newPoints = [...geo.points] as [number, number, number, number];
      if (pointIndex === 0) {
        newPoints[0] = relX;
        newPoints[1] = relY;
      } else {
        newPoints[2] = relX;
        newPoints[3] = relY;
      }

      updateElement(id, { points: newPoints });
    },
    [data.elements, updateElement]
  );

  const handleElementMove = useCallback(
    (id: string, x: number, y: number) => {
      updateElement(id, { x, y });
    },
    [updateElement]
  );

  const handleElementResize = useCallback(
    (id: string, x: number, y: number, width: number, height: number, rotation: number) => {
      const element = data.elements.find((el) => el.id === id);
      if (element?.geometry.shape === "ellipse") {
        updateElement(id, { x, y, radiusX: width / 2, radiusY: height / 2, rotation });
      } else {
        updateElement(id, { x, y, width, height, rotation });
      }
    },
    [data.elements, updateElement]
  );

  const handleBackgroundImage = useCallback(
    (dataUrl: string, imageWidth: number, imageHeight: number, mode: "resize-canvas" | "fit-image") => {
      if (mode === "resize-canvas") {
        updateDimensions({ width: imageWidth, height: imageHeight });
        setBackgroundImage({
          url: dataUrl,
          width: imageWidth,
          height: imageHeight,
          opacity: 0.3,
        });
      } else {
        setBackgroundImage({
          url: dataUrl,
          width: data.dimensions.width,
          height: data.dimensions.height,
          opacity: 0.3,
        });
      }
      setShowBgDialog(false);
    },
    [data.dimensions, setBackgroundImage, updateDimensions]
  );

  const handleElementContextMenu = useCallback(
    (elementId: string, screenX: number, screenY: number) => {
      setSelectedId(elementId);
      setContextMenu({ elementId, x: screenX, y: screenY });
    },
    []
  );

  const contextMenuItems: ContextMenuItem[] = (() => {
    if (!contextMenu) return [];
    const element = data.elements.find((el) => el.id === contextMenu.elementId);
    if (!element) return [];

    const config = getShapeConfig(element.geometry.shape, element.type);
    const items: ContextMenuItem[] = [];

    for (const action of config.contextMenu) {
      switch (action) {
        case "convertToBooth":
          items.push({
            label: "Convert to Booth",
            onClick: () => updateElementType(contextMenu.elementId, "booth"),
          });
          break;
        case "delete":
          items.push({
            label: "Delete",
            danger: true,
            onClick: () => {
              deleteElement(contextMenu.elementId);
              setSelectedId(null);
            },
          });
          break;
      }
    }
    return items;
  })();

  const handleToolChange = useCallback((tool: ActiveTool) => {
    setActiveTool(tool);
    if (tool !== "select") {
      setSelectedId(null);
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <TopBar
        debug={debug}
        onDebugClick={() => setShowMapDebug(true)}
        onBackgroundImageClick={() => setShowBgDialog(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <ToolSidebar activeTool={activeTool} onToolChange={handleToolChange} />
        <div className="flex flex-col flex-1">
          <OptionsBar
            defaults={activeDefaults}
            config={getShapeConfig(
              selectedElement?.geometry.shape
                ?? (activeTool === "line" ? "line" : activeTool === "ellipse" ? "ellipse" : "rect"),
              selectedElement?.type ?? (activeTool === "booth" ? "booth" : undefined)
            )}
            onDefaultsChange={handleDefaultsChange}
          />
          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-col flex-1">
              <Canvas
                data={data}
                activeTool={activeTool}
                selectedId={selectedId}
                scale={scale}
                position={position}
                stageSize={stageSize}
                stageRef={stageRef}
                containerRef={containerRef}
                onWheel={handleWheel}
                onDragEnd={handleDragEnd}
                onDrawEnd={handleDrawEnd}
                onLineDrawEnd={handleLineDrawEnd}
                onSelect={setSelectedId}
                onElementMove={handleElementMove}
                onEndpointMove={handleEndpointMove}
                onElementResize={handleElementResize}
                onElementContextMenu={handleElementContextMenu}
              />
              <StatusBar scale={scale} onZoomReset={zoomReset} />
            </div>
            <PropertiesPanel
              element={selectedElement}
              backgroundImage={data.backgroundImage}
              debug={debug}
              onUpdateProperties={updateProperties}
              onUpdateGeometry={updateElement}
              onDelete={(id) => {
                deleteElement(id);
                setSelectedId(null);
              }}
              onConvertToBooth={(id) => updateElementType(id, "booth")}
              onBackgroundOpacityChange={(opacity) =>
                data.backgroundImage &&
                setBackgroundImage({ ...data.backgroundImage, opacity })
              }
              onRemoveBackground={() => setBackgroundImage(undefined)}
            />
          </div>
        </div>
      </div>
      {showMapDebug && (
        <MapDebugDialog data={data} onClose={() => setShowMapDebug(false)} />
      )}
      {showBgDialog && (
        <BackgroundImageDialog
          canvasWidth={data.dimensions.width}
          canvasHeight={data.dimensions.height}
          onConfirm={handleBackgroundImage}
          onClose={() => setShowBgDialog(false)}
        />
      )}
      {contextMenu && contextMenuItems.length > 0 && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenuItems}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
