import { Rect, Line, Text, Group } from "react-konva";
import type { Geometry, ElementProperties } from "../../../../types";
import { getLabelXY, getLabelFontStyle, getLabelRenderProps } from "./labelUtils";
import { LabelWithBackground } from "./LabelWithBackground";
import { getGeometryBounds } from "../../../utils/bounds";

interface BoothShapeProps {
  geo: Geometry;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  boothCode: string;
  properties: ElementProperties;
}

export function BoothShape({ geo, color, strokeColor, strokeWidth, boothCode, properties }: BoothShapeProps) {
  const lp = getLabelRenderProps(properties);
  const bounds = getGeometryBounds(geo);
  const labelPos = getLabelXY(lp.labelPositionV, lp.labelPositionH, bounds.width, bounds.height);
  const fontStyle = getLabelFontStyle(lp.labelBold, lp.labelItalic);

  return (
    <>
      {geo.shape === "rect" && (
        <Rect
          width={geo.width}
          height={geo.height}
          fill={color}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          cornerRadius={2}
          opacity={0.9}
        />
      )}
      {geo.shape === "polygon" && (
        <Line
          points={[...geo.points]}
          closed
          fill={color}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          opacity={0.9}
        />
      )}
      <Text
        text="🏪"
        x={3}
        y={2}
        fontSize={10}
        listening={false}
      />
      {boothCode && (
        <Group opacity={lp.labelVisible ? 1 : 0.35} listening={false}>
          <LabelWithBackground
            text={lp.labelVisible ? boothCode : `${boothCode} ⊘`}
            labelPos={labelPos}
            fontSize={lp.labelFontSize}
            fill={lp.labelColor}
            fontStyle={fontStyle}
            underline={lp.labelUnderline}
            background={lp.labelBackground}
          />
        </Group>
      )}
    </>
  );
}
