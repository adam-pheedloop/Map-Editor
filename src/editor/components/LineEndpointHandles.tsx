import { Circle } from "react-konva";
import type Konva from "konva";
import type { LineGeometry } from "../../types";
import { snapToAngle } from "../utils/canvas";

interface LineEndpointHandlesProps {
  elementId: string;
  geometry: LineGeometry;
  onEndpointMove: (
    id: string,
    pointIndex: 0 | 1,
    x: number,
    y: number
  ) => void;
}

const HANDLE_RADIUS = 5;

export function LineEndpointHandles({
  elementId,
  geometry,
  onEndpointMove,
}: LineEndpointHandlesProps) {
  const [x1, y1, x2, y2] = geometry.points;

  // Absolute positions of each endpoint
  const abs1 = { x: geometry.x + x1, y: geometry.y + y1 };
  const abs2 = { x: geometry.x + x2, y: geometry.y + y2 };

  const handleDrag = (
    pointIndex: 0 | 1,
    e: Konva.KonvaEventObject<DragEvent>
  ) => {
    e.cancelBubble = true;

    let pos = { x: e.target.x(), y: e.target.y() };

    if (e.evt.shiftKey) {
      // Snap relative to the opposite endpoint
      const anchor = pointIndex === 0 ? abs2 : abs1;
      pos = snapToAngle(anchor, pos);
      // Move the handle to the snapped position
      e.target.x(pos.x);
      e.target.y(pos.y);
    }

    onEndpointMove(elementId, pointIndex, pos.x, pos.y);
  };

  return (
    <>
      <Circle
        x={abs1.x}
        y={abs1.y}
        radius={HANDLE_RADIUS}
        fill="#fff"
        stroke="#3b82f6"
        strokeWidth={1.5}
        draggable
        onDragMove={(e) => handleDrag(0, e)}
      />
      <Circle
        x={abs2.x}
        y={abs2.y}
        radius={HANDLE_RADIUS}
        fill="#fff"
        stroke="#3b82f6"
        strokeWidth={1.5}
        draggable
        onDragMove={(e) => handleDrag(1, e)}
      />
    </>
  );
}
