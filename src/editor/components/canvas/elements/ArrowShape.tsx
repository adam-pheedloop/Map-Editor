import { Arrow } from "react-konva";
import type { LineGeometry, ArrowGeometry } from "../../../../types";

interface ArrowShapeProps {
  geo: LineGeometry | ArrowGeometry;
  color: string;
  strokeWidth: number;
  arrowHead: { style: "triangle" | "chevron"; size: number };
}

export function ArrowShape({ geo, color, strokeWidth, arrowHead }: ArrowShapeProps) {
  return (
    <Arrow
      points={[...geo.points]}
      stroke={color}
      strokeWidth={strokeWidth}
      fill={arrowHead.style === "triangle" ? color : ""}
      pointerLength={arrowHead.size}
      pointerWidth={arrowHead.size * 0.8}
      hitStrokeWidth={12}
      lineCap="round"
    />
  );
}
