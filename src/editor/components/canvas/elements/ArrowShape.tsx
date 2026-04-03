import { Arrow } from "react-konva";
import type { LineGeometry } from "../../../../types";
import type { ShapeConfig } from "./types";

export const arrowConfig: ShapeConfig = {
  optionsBar: ["stroke", "strokeWidth"],
  propertiesPanel: ["name", "length", "arrowHeadStyle", "arrowHeadSize"],
  contextMenu: ["delete"],
};

interface ArrowShapeProps {
  geo: LineGeometry;
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
