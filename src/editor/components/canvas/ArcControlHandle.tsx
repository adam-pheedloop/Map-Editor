import { Circle } from "react-konva";
import type Konva from "konva";
import type { ArcGeometry } from "../../../types";

interface ArcControlHandleProps {
  elementId: string;
  geometry: ArcGeometry;
  onControlPointMove: (
    id: string,
    pointIndex: 0 | 1 | 2,
    x: number,
    y: number
  ) => void;
}

const HANDLE_RADIUS = 5;
const CONTROL_HANDLE_RADIUS = 4;

export function ArcControlHandle({
  elementId,
  geometry,
  onControlPointMove,
}: ArcControlHandleProps) {
  const [x1, y1, cx, cy, x2, y2] = geometry.points;

  // Absolute positions
  const absStart = { x: geometry.x + x1, y: geometry.y + y1 };
  const absControl = { x: geometry.x + cx, y: geometry.y + cy };
  const absEnd = { x: geometry.x + x2, y: geometry.y + y2 };

  const handleDrag = (
    pointIndex: 0 | 1 | 2,
    e: Konva.KonvaEventObject<DragEvent>
  ) => {
    e.cancelBubble = true;
    onControlPointMove(elementId, pointIndex, e.target.x(), e.target.y());
  };

  return (
    <>
      {/* Start endpoint */}
      <Circle
        x={absStart.x}
        y={absStart.y}
        radius={HANDLE_RADIUS}
        fill="#fff"
        stroke="#007bff"
        strokeWidth={1.5}
        draggable
        onDragMove={(e) => handleDrag(0, e)}
      />
      {/* End endpoint */}
      <Circle
        x={absEnd.x}
        y={absEnd.y}
        radius={HANDLE_RADIUS}
        fill="#fff"
        stroke="#007bff"
        strokeWidth={1.5}
        draggable
        onDragMove={(e) => handleDrag(1, e)}
      />
      {/* Control point (curvature handle) */}
      <Circle
        x={absControl.x}
        y={absControl.y}
        radius={CONTROL_HANDLE_RADIUS}
        fill="#007bff"
        stroke="#fff"
        strokeWidth={1.5}
        draggable
        onDragMove={(e) => handleDrag(2, e)}
      />
    </>
  );
}
