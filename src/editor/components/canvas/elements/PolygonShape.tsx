import { Line } from "react-konva";
import type { PolygonGeometry } from "../../../../types";
import type { ShapeConfig } from "./types";

export const polygonConfig: ShapeConfig = {
  optionsBar: ["fill", "stroke", "strokeWidth"],
  propertiesPanel: ["name"],
  contextMenu: ["delete"],
};

interface PolygonShapeProps {
  geo: PolygonGeometry;
  color: string;
  strokeColor: string;
  strokeWidth: number;
}

export function PolygonShape({ geo, color, strokeColor, strokeWidth }: PolygonShapeProps) {
  return (
    <Line
      points={[...geo.points]}
      closed
      fill={color}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      hitStrokeWidth={12}
    />
  );
}
