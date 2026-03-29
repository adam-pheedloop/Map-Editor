import { Ellipse, Text } from "react-konva";
import type { EllipseGeometry } from "../../../../types";
import type { ShapeConfig } from "./types";

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
}

export function EllipseShape({ geo, color, strokeColor, strokeWidth, label }: EllipseShapeProps) {
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
          x={0}
          y={0}
          width={geo.radiusX * 2}
          height={geo.radiusY * 2}
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
