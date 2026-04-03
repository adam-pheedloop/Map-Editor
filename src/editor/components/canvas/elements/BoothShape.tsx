import { Rect, Text } from "react-konva";
import type { RectGeometry } from "../../../../types";
import type { ShapeConfig } from "./types";
import { getLabelXY } from "./labelUtils";

export const boothConfig: ShapeConfig = {
  optionsBar: ["fill", "stroke", "strokeWidth"],
  propertiesPanel: ["name", "boothCode", "width", "height", "rotation", "area"],
  contextMenu: ["delete"],
};

interface BoothShapeProps {
  geo: RectGeometry;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  boothCode: string;
  labelPositionV?: "top" | "middle" | "bottom";
  labelPositionH?: "left" | "center" | "right";
}

export function BoothShape({ geo, color, strokeColor, strokeWidth, boothCode, labelPositionV, labelPositionH }: BoothShapeProps) {
  const labelPos = getLabelXY(
    labelPositionV ?? "middle",
    labelPositionH ?? "center",
    geo.width,
    geo.height
  );

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
          x={labelPos.x}
          y={labelPos.y}
          width={labelPos.width}
          height={labelPos.height}
          align={labelPos.align}
          verticalAlign={labelPos.verticalAlign}
          padding={labelPos.padding}
          fontSize={12}
          fill="#fff"
          fontStyle="bold"
          listening={false}
        />
      )}
    </>
  );
}
