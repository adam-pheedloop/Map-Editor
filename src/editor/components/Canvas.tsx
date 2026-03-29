import { useState, useRef, useEffect, useCallback } from "react";
import { Stage, Layer, Rect, Group, Text, Transformer } from "react-konva";
import type Konva from "konva";
import type { FloorPlanData, FloorPlanElement, RectGeometry } from "../../types";
import type { ActiveTool } from "../types";

interface DrawingRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

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

function getLabel(element: FloorPlanElement): string {
  if (element.type === "booth" && element.properties.boothCode) {
    return element.properties.boothCode;
  }
  return element.properties.name || "";
}

interface ElementShapeProps {
  element: FloorPlanElement;
  isSelectMode: boolean;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
}

function ElementShape({
  element,
  isSelectMode,
  onSelect,
  onDragEnd,
}: ElementShapeProps) {
  const geo = element.geometry as RectGeometry;
  const label = getLabel(element);

  return (
    <Group
      name={element.id}
      x={geo.x}
      y={geo.y}
      draggable={isSelectMode}
      onClick={(e) => {
        if (!isSelectMode) return;
        e.cancelBubble = true;
        onSelect(element.id);
      }}
      onDragEnd={(e) => {
        onDragEnd(element.id, e.target.x(), e.target.y());
      }}
    >
      <Rect
        width={geo.width}
        height={geo.height}
        fill={element.properties.color}
        stroke="#888"
        strokeWidth={0.5}
        cornerRadius={2}
        opacity={0.9}
      />
      {label && (
        <Text
          text={label}
          width={geo.width}
          height={geo.height}
          align="center"
          verticalAlign="middle"
          fontSize={12}
          fill="#fff"
          fontStyle="bold"
          listening={false}
        />
      )}
    </Group>
  );
}

function SelectionTransformer({
  selectedId,
  stageRef,
  elements,
  onTransformEnd,
}: {
  selectedId: string | null;
  stageRef: React.RefObject<Konva.Stage | null>;
  elements: FloorPlanElement[];
  onTransformEnd: (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) => void;
}) {
  const trRef = useRef<Konva.Transformer>(null);

  // Re-run whenever selectedId changes OR the selected element's geometry updates
  const selectedElement = selectedId
    ? elements.find((el) => el.id === selectedId)
    : null;
  const geoKey = selectedElement
    ? JSON.stringify(selectedElement.geometry)
    : null;

  useEffect(() => {
    const tr = trRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;

    if (!selectedId) {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
      return;
    }

    const node = stage.findOne(`.${selectedId}`);
    if (node) {
      tr.nodes([node]);
      tr.getLayer()?.batchDraw();
    }
  }, [selectedId, stageRef, geoKey]);

  const handleTransformEnd = useCallback(() => {
    const tr = trRef.current;
    if (!tr || !selectedId) return;

    const node = tr.nodes()[0];
    if (!node) return;

    // Konva applies scale during transform — convert to width/height
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Find the rect child to get its dimensions
    const rect = (node as Konva.Group).findOne("Rect");
    if (!rect) return;

    const newWidth = rect.width() * scaleX;
    const newHeight = rect.height() * scaleY;

    // Reset scale and apply new dimensions directly on the node
    // so the Transformer matches immediately (before React re-renders)
    node.scaleX(1);
    node.scaleY(1);
    rect.width(newWidth);
    rect.height(newHeight);

    // Also update the text label dimensions if present
    const text = (node as Konva.Group).findOne("Text");
    if (text) {
      text.width(newWidth);
      text.height(newHeight);
    }

    onTransformEnd(
      selectedId,
      node.x(),
      node.y(),
      newWidth,
      newHeight
    );
  }, [selectedId, onTransformEnd]);

  return (
    <Transformer
      ref={trRef}
      rotateEnabled={false}
      borderStroke="#3b82f6"
      borderStrokeWidth={1.5}
      anchorFill="#fff"
      anchorStroke="#3b82f6"
      anchorSize={8}
      anchorCornerRadius={2}
      boundBoxFunc={(_oldBox, newBox) => {
        // Enforce minimum size
        if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
          return _oldBox;
        }
        return newBox;
      }}
      onTransformEnd={handleTransformEnd}
    />
  );
}

function getCanvasPoint(
  stage: Konva.Stage,
  position: { x: number; y: number },
  scale: number
) {
  const pointer = stage.getPointerPosition();
  if (!pointer) return null;
  return {
    x: (pointer.x - position.x) / scale,
    y: (pointer.y - position.y) / scale,
  };
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
  const [drawingRect, setDrawingRect] = useState<DrawingRect | null>(null);
  const drawOrigin = useRef<{ x: number; y: number } | null>(null);

  const sortedElements = [...data.elements].sort(
    (a, b) => (a.properties.zIndex ?? 0) - (b.properties.zIndex ?? 0)
  );

  const isDrawing = activeTool !== "select";
  const isSelectMode = activeTool === "select";

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // In select mode, clicking empty space deselects
    if (isSelectMode) {
      const clickedOnStage = e.target === e.target.getStage();
      const clickedOnBackground = e.target.attrs?.id === "background";
      if (clickedOnStage || clickedOnBackground) {
        onSelect(null);
      }
      return;
    }

    // Drawing mode
    const clickedOnStage = e.target === e.target.getStage();
    const clickedOnBackground = e.target.attrs?.id === "background";
    if (!clickedOnStage && !clickedOnBackground) return;

    const stage = stageRef.current;
    if (!stage) return;

    const point = getCanvasPoint(stage, position, scale);
    if (!point) return;

    drawOrigin.current = point;
    setDrawingRect({ x: point.x, y: point.y, width: 0, height: 0 });
  };

  const handleMouseMove = () => {
    if (!drawOrigin.current) return;

    const stage = stageRef.current;
    if (!stage) return;

    const point = getCanvasPoint(stage, position, scale);
    if (!point) return;

    const origin = drawOrigin.current;

    setDrawingRect({
      x: Math.min(origin.x, point.x),
      y: Math.min(origin.y, point.y),
      width: Math.abs(point.x - origin.x),
      height: Math.abs(point.y - origin.y),
    });
  };

  const handleMouseUp = () => {
    if (!drawingRect || !drawOrigin.current) return;

    const MIN_SIZE = 5;
    if (drawingRect.width > MIN_SIZE && drawingRect.height > MIN_SIZE) {
      onDrawEnd(
        drawingRect.x,
        drawingRect.y,
        drawingRect.width,
        drawingRect.height
      );
    }

    drawOrigin.current = null;
    setDrawingRect(null);
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

        {/* Drawing preview layer */}
        <Layer>
          {drawingRect && (
            <Rect
              x={drawingRect.x}
              y={drawingRect.y}
              width={drawingRect.width}
              height={drawingRect.height}
              fill="#94a3b8"
              opacity={0.5}
              stroke="#475569"
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
