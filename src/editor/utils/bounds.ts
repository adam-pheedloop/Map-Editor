import type { FloorPlanElement } from "../../types";

export interface ElementBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
}

export function getElementBounds(element: FloorPlanElement): ElementBounds {
  const geo = element.geometry;

  if (geo.shape === "rect") {
    return {
      left: geo.x,
      right: geo.x + geo.width,
      top: geo.y,
      bottom: geo.y + geo.height,
      centerX: geo.x + geo.width / 2,
      centerY: geo.y + geo.height / 2,
    };
  }

  if (geo.shape === "ellipse") {
    return {
      left: geo.x,
      right: geo.x + geo.radiusX * 2,
      top: geo.y,
      bottom: geo.y + geo.radiusY * 2,
      centerX: geo.x + geo.radiusX,
      centerY: geo.y + geo.radiusY,
    };
  }

  if (geo.shape === "line") {
    const [x1, y1, x2, y2] = geo.points;
    const absX1 = geo.x + x1;
    const absY1 = geo.y + y1;
    const absX2 = geo.x + x2;
    const absY2 = geo.y + y2;
    return {
      left: Math.min(absX1, absX2),
      right: Math.max(absX1, absX2),
      top: Math.min(absY1, absY2),
      bottom: Math.max(absY1, absY2),
      centerX: (absX1 + absX2) / 2,
      centerY: (absY1 + absY2) / 2,
    };
  }

  // Fallback
  const x = "x" in geo ? geo.x : 0;
  const y = "y" in geo ? geo.y : 0;
  return { left: x, right: x, top: y, bottom: y, centerX: x, centerY: y };
}
