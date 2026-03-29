export { RectShape, rectConfig } from "./RectShape";
export { EllipseShape, ellipseConfig } from "./EllipseShape";
export { LineShape, lineConfig } from "./LineShape";
export type { ShapeConfig, OptionsBarField, PropertiesPanelField } from "./types";

import type { ShapeConfig } from "./types";
import { rectConfig } from "./RectShape";
import { ellipseConfig } from "./EllipseShape";
import { lineConfig } from "./LineShape";

export const shapeConfigs: Record<string, ShapeConfig> = {
  rect: rectConfig,
  ellipse: ellipseConfig,
  line: lineConfig,
};

export function getShapeConfig(geometryShape: string): ShapeConfig {
  return shapeConfigs[geometryShape] ?? rectConfig;
}
