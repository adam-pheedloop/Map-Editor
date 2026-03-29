import type Konva from "konva";

/**
 * Convert screen pointer position to canvas coordinates,
 * accounting for pan (position) and zoom (scale).
 */
export function getCanvasPoint(
  stage: Konva.Stage,
  position: { x: number; y: number },
  scale: number
): { x: number; y: number } | null {
  const pointer = stage.getPointerPosition();
  if (!pointer) return null;
  return {
    x: (pointer.x - position.x) / scale,
    y: (pointer.y - position.y) / scale,
  };
}

/**
 * Check if a Konva event target is empty space (stage or background),
 * as opposed to an interactive element.
 */
export function isEmptySpaceClick(e: Konva.KonvaEventObject<MouseEvent>): boolean {
  const clickedOnStage = e.target === e.target.getStage();
  const clickedOnBackground = e.target.attrs?.id === "background";
  return clickedOnStage || clickedOnBackground;
}
