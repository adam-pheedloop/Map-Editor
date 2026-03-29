import { Rect, Text } from "react-konva";
import type { RectGeometry } from "../../../../types";
import type { ShapeConfig } from "./types";

export const rectConfig: ShapeConfig = {
  optionsBar: ["fill", "stroke", "strokeWidth"],
  propertiesPanel: ["name", "width", "height", "rotation"],
  contextMenu: ["convertToBooth", "delete"],
};

interface RectShapeProps {
  geo: RectGeometry;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  label: string;
}

export function RectShape({ geo, color, strokeColor, strokeWidth, label }: RectShapeProps) {
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
    </>
  );
}
