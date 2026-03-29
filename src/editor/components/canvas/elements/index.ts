export { RectShape, rectConfig } from "./RectShape";
export { EllipseShape, ellipseConfig } from "./EllipseShape";
export { LineShape, lineConfig } from "./LineShape";
export { BoothShape, boothConfig } from "./BoothShape";
export type { ShapeConfig, OptionsBarField, PropertiesPanelField } from "./types";

import type { ShapeConfig } from "./types";
import { rectConfig } from "./RectShape";
import { ellipseConfig } from "./EllipseShape";
import { lineConfig } from "./LineShape";
import { boothConfig } from "./BoothShape";

// Configs keyed by element type (takes priority)
const elementTypeConfigs: Record<string, ShapeConfig> = {
  booth: boothConfig,
};

// Configs keyed by geometry shape (fallback)
const geometryConfigs: Record<string, ShapeConfig> = {
  rect: rectConfig,
  ellipse: ellipseConfig,
  line: lineConfig,
};

/**
 * Get the shape config for an element. Checks element type first,
 * then falls back to geometry shape.
 */
export function getShapeConfig(
  geometryShape: string,
  elementType?: string
): ShapeConfig {
  if (elementType && elementTypeConfigs[elementType]) {
    return elementTypeConfigs[elementType];
  }
  return geometryConfigs[geometryShape] ?? rectConfig;
}
