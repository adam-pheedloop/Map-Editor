import { Rect, Text, Group } from "react-konva";
import type { RectGeometry, ElementProperties } from "../../../../types";
import type { ShapeConfig } from "./types";
import { getLabelXY, getLabelFontStyle, getLabelRenderProps } from "./labelUtils";
import { LabelWithBackground } from "./LabelWithBackground";

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
  properties: ElementProperties;
}

export function BoothShape({ geo, color, strokeColor, strokeWidth, boothCode, properties }: BoothShapeProps) {
  const lp = getLabelRenderProps(properties);
  const labelPos = getLabelXY(lp.labelPositionV, lp.labelPositionH, geo.width, geo.height);
  const fontStyle = getLabelFontStyle(lp.labelBold, lp.labelItalic);

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
