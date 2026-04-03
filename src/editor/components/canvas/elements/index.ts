export { RectShape, rectConfig } from "./RectShape";
export { EllipseShape, ellipseConfig } from "./EllipseShape";
export { LineShape, lineConfig } from "./LineShape";
export { ArrowShape, arrowConfig } from "./ArrowShape";
export { ArcShape, arcConfig } from "./ArcShape";
export { PolygonShape, polygonConfig } from "./PolygonShape";
export { BoothShape, boothConfig } from "./BoothShape";
export { TextShape, textConfig } from "./TextShape";
export { IconShape, iconConfig } from "./IconShape";
export type { ShapeConfig, OptionsBarField, PropertiesPanelField, ContextMenuAction } from "./types";

import type { ShapeConfig } from "./types";
import { rectConfig } from "./RectShape";
import { ellipseConfig } from "./EllipseShape";
import { lineConfig } from "./LineShape";
import { arrowConfig } from "./ArrowShape";
import { arcConfig } from "./ArcShape";
import { polygonConfig } from "./PolygonShape";
import { boothConfig } from "./BoothShape";
import { textConfig } from "./TextShape";
import { iconConfig } from "./IconShape";

// Configs keyed by element type (takes priority)
const elementTypeConfigs: Record<string, ShapeConfig> = {
  booth: boothConfig,
  label: textConfig,
  icon: iconConfig,
};

// Configs keyed by geometry shape (fallback)
const geometryConfigs: Record<string, ShapeConfig> = {
  rect: rectConfig,
  ellipse: ellipseConfig,
  line: lineConfig,
  arc: arcConfig,
  polygon: polygonConfig,
};

/**
 * Get the shape config for an element. Checks element type first,
 * then falls back to geometry shape. Passes properties to disambiguate
 * arrows (lines with arrowHead) from plain lines.
 */
export function getShapeConfig(
  geometryShape: string,
  elementType?: string,
  properties?: { arrowHead?: unknown }
): ShapeConfig {
  if (elementType && elementTypeConfigs[elementType]) {
    return elementTypeConfigs[elementType];
  }
  if (geometryShape === "line" && properties?.arrowHead) {
    return arrowConfig;
  }
  return geometryConfigs[geometryShape] ?? rectConfig;
}
