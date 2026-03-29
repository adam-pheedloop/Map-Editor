import { useCallback } from "react";
import { Stage, Layer, Rect } from "react-konva";
import type Konva from "konva";
import type { FloorPlanData } from "../../types";
import type { ActiveTool } from "../types";
import { isEmptySpaceClick } from "../utils/canvas";
import { useDrawingTool } from "../hooks/useDrawingTool";
import { ElementShape } from "./ElementShape";
import { SelectionTransformer } from "./SelectionTransformer";
import { DrawingPreview } from "./DrawingPreview";

interface CanvasProps {
  data: FloorPlanData;
  activeTool: ActiveTool;
  selectedId: string | null;
  scale: number;
  position: { x: number; y: number };
  stageSize: { width: number; height: number };
  stageRef: React.RefObject<Konva.Stage | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onWheel: (e: Konva.KonvaEventObject<WheelEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDrawEnd: (x: number, y: number, width: number, height: number) => void;
  onSelect: (id: string | null) => void;
  onElementMove: (id: string, x: number, y: number) => void;
  onElementResize: (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) => void;
}

export function Canvas({
  data,
  activeTool,
  selectedId,
  scale,
  position,
  stageSize,
  stageRef,
  containerRef,
  onWheel,
  onDragEnd,
  onDrawEnd,
  onSelect,
  onElementMove,
  onElementResize,
}: CanvasProps) {
  const isSelectMode = activeTool === "select";
  const isDrawing = !isSelectMode;

  const drawing = useDrawingTool(
    stageRef,
    position,
    scale,
    isDrawing,
    onDrawEnd
  );

  const sortedElements = [...data.elements].sort(
    (a, b) => (a.properties.zIndex ?? 0) - (b.properties.zIndex ?? 0)
  );

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isSelectMode) {
      if (isEmptySpaceClick(e)) {
        onSelect(null);
      }
      return;
    }
    drawing.handleMouseDown(e);
  };

  const handleElementDragEnd = useCallback(
    (id: string, x: number, y: number) => {
      onElementMove(id, x, y);
    },
    [onElementMove]
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-gray-200 overflow-hidden"
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
        draggable={isSelectMode}
        onWheel={onWheel}
        onDragEnd={onDragEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={drawing.handleMouseMove}
        onMouseUp={drawing.handleMouseUp}
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
        </Layer>

        <Layer>
          {sortedElements.map((element) => (
            <ElementShape
              key={element.id}
              element={element}
              isSelectMode={isSelectMode}
              onSelect={onSelect}
              onDragEnd={handleElementDragEnd}
            />
          ))}
          <SelectionTransformer
            selectedId={selectedId}
            stageRef={stageRef}
            elements={data.elements}
            onTransformEnd={onElementResize}
          />
        </Layer>

        <Layer>
          <DrawingPreview preview={drawing.preview} activeTool={activeTool} />
        </Layer>
      </Stage>
    </div>
  );
}
