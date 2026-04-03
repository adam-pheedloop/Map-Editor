type VPos = "top" | "middle" | "bottom";
type HPos = "left" | "center" | "right";

/**
 * Convert label position axes to Konva Text props.
 * Returns x, y, width, height, align, and verticalAlign for a Konva Text node
 * positioned within an element of the given dimensions.
 */
export function getLabelXY(
  v: VPos,
  h: HPos,
  elWidth: number,
  elHeight: number,
  padding: number = 4
) {
  // Konva Text with width+height uses align/verticalAlign to position text within the box.
  // We use a sub-region of the element based on the position axes.
  return {
    x: 0,
    y: 0,
    width: elWidth,
    height: elHeight,
    align: h as string,
    verticalAlign: v as string,
    padding,
  };
}
