import { Rect, Text } from "react-konva";
import type { RectGeometry } from "../../../../types";
import type { ShapeConfig } from "./types";

export const boothConfig: ShapeConfig = {
  optionsBar: ["fill", "stroke", "strokeWidth"],
  propertiesPanel: ["name", "boothCode", "width", "height", "rotation", "area"],
};

interface BoothShapeProps {
  geo: RectGeometry;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  boothCode: string;
}

export function BoothShape({ geo, color, strokeColor, strokeWidth, boothCode }: BoothShapeProps) {
  return (
    <>
      <Rect
        width={geo.width}
        height={geo.height}
        fill={color}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        cornerRadius={2}
        opacity={0.9}
      />
      <Text
        text="🏪"
        x={3}
        y={2}
        fontSize={10}
        listening={false}
      />
      {boothCode && (
        <Text
          text={boothCode}
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
    </>
  );
}
