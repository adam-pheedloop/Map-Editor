import { Circle } from "react-konva";
import type Konva from "konva";
import type { PolygonGeometry } from "../../../types";

interface PolygonVertexHandlesProps {
  elementId: string;
  geometry: PolygonGeometry;
  onVertexMove: (id: string, vertexIndex: number, x: number, y: number) => void;
}

const HANDLE_RADIUS = 5;

export function PolygonVertexHandles({
  elementId,
  geometry,
  onVertexMove,
}: PolygonVertexHandlesProps) {
  const vertices: Array<{ x: number; y: number; index: number }> = [];
  for (let i = 0; i < geometry.points.length; i += 2) {
    vertices.push({
      x: geometry.x + geometry.points[i],
      y: geometry.y + geometry.points[i + 1],
      index: i / 2,
    });
  }

  const handleDrag = (
    vertexIndex: number,
    e: Konva.KonvaEventObject<DragEvent>
  ) => {
    e.cancelBubble = true;
    onVertexMove(elementId, vertexIndex, e.target.x(), e.target.y());
  };

  return (
    <>
      {vertices.map((v) => (
        <Circle
          key={v.index}
          x={v.x}
          y={v.y}
          radius={HANDLE_RADIUS}
          fill="#fff"
          stroke="#007bff"
          strokeWidth={1.5}
          draggable
          onDragMove={(e) => handleDrag(v.index, e)}
        />
      ))}
    </>
  );
}
