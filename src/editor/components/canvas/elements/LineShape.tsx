import { Line } from "react-konva";
import type { LineGeometry } from "../../../../types";
import type { ShapeConfig } from "./types";

export const lineConfig: ShapeConfig = {
  optionsBar: ["stroke", "strokeWidth"],
  propertiesPanel: ["name", "length"],
  contextMenu: ["delete"],
};

interface LineShapeProps {
  geo: LineGeometry;
  color: string;
  strokeWidth: number;
}

export function LineShape({ geo, color, strokeWidth }: LineShapeProps) {
  return (
    <Line
      points={[...geo.points]}
      stroke={color}
      strokeWidth={strokeWidth}
      hitStrokeWidth={12}
      lineCap="round"
    />
  );
}
