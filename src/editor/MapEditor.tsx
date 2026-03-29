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
import type { FloorPlanData } from "../types";

const INITIAL_DEFAULTS: DrawingDefaults = {
  fill: "#94a3b8",
  stroke: "#888888",
  strokeWidth: 1,
};

interface MapEditorProps {
  initialData: FloorPlanData;
}

export function MapEditor({ initialData }: MapEditorProps) {
  const { data, addElement, updateElement, updateProperties, deleteElement } =
    useEditorState(initialData);
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [defaults, setDefaults] = useState<DrawingDefaults>(INITIAL_DEFAULTS);
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
    (id: string, x: number, y: number, width: number, height: number) => {
      const element = data.elements.find((el) => el.id === id);
      if (element?.geometry.shape === "ellipse") {
        updateElement(id, { x, y, radiusX: width / 2, radiusY: height / 2 });
      } else {
        updateElement(id, { x, y, width, height });
      }
    },
    [data.elements, updateElement]
  );

  const handleToolChange = useCallback((tool: ActiveTool) => {
    setActiveTool(tool);
    if (tool !== "select") {
      setSelectedId(null);
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <ToolSidebar activeTool={activeTool} onToolChange={handleToolChange} />
        <div className="flex flex-col flex-1">
          <OptionsBar
            defaults={activeDefaults}
            config={getShapeConfig(
              selectedElement?.geometry.shape
                ?? (activeTool === "line" ? "line" : activeTool === "ellipse" ? "ellipse" : "rect")
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
              />
              <StatusBar scale={scale} onZoomReset={zoomReset} />
            </div>
            <PropertiesPanel
              element={selectedElement}
              onUpdateProperties={updateProperties}
              onUpdateGeometry={updateElement}
              onDelete={(id) => {
                deleteElement(id);
                setSelectedId(null);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
