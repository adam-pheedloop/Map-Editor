import { useRef, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import type { ActiveTool } from "./types";
import { useCanvasControls } from "./hooks/useCanvasControls";
import { useEditorState } from "./hooks/useEditorState";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { Canvas } from "./components/Canvas";
import { ToolSidebar } from "./components/ToolSidebar";
import { TopBar } from "./components/TopBar";
import { StatusBar } from "./components/StatusBar";
import type { FloorPlanData } from "../types";

interface MapEditorProps {
  initialData: FloorPlanData;
}

export function MapEditor({ initialData }: MapEditorProps) {
  const { data, addElement, updateElement, deleteElement } =
    useEditorState(initialData);
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
          color: "#94a3b8",
          zIndex: 1,
        },
      });
      setSelectedId(id);
      setActiveTool("select");
    },
    [activeTool, addElement]
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
            onSelect={setSelectedId}
            onElementMove={handleElementMove}
            onElementResize={handleElementResize}
          />
          <StatusBar scale={scale} onZoomReset={zoomReset} />
        </div>
      </div>
    </div>
  );
}
