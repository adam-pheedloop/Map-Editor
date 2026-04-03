import { Ellipse, Text } from "react-konva";
import type { EllipseGeometry } from "../../../../types";
import type { ShapeConfig } from "./types";
import { getLabelXY } from "./labelUtils";

export const ellipseConfig: ShapeConfig = {
  optionsBar: ["fill", "stroke", "strokeWidth"],
  propertiesPanel: ["name", "width", "height", "rotation"],
  contextMenu: ["delete"],
};

interface EllipseShapeProps {
  geo: EllipseGeometry;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  label: string;
  labelPositionV?: "top" | "middle" | "bottom";
  labelPositionH?: "left" | "center" | "right";
}

export function EllipseShape({ geo, color, strokeColor, strokeWidth, label, labelPositionV, labelPositionH }: EllipseShapeProps) {
  const labelPos = getLabelXY(
    labelPositionV ?? "middle",
    labelPositionH ?? "center",
    geo.radiusX * 2,
    geo.radiusY * 2
  );

  return (
    <>
      <Ellipse
        x={geo.radiusX}
        y={geo.radiusY}
        radiusX={geo.radiusX}
        radiusY={geo.radiusY}
        fill={color}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        opacity={0.9}
      />
      {label && (
        <Text
          text={label}
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
