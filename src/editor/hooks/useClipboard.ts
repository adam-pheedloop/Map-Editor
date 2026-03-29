import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import type { FloorPlanElement } from "../../types";

const PASTE_OFFSET = 20;

export function useClipboard() {
  const [buffer, setBuffer] = useState<FloorPlanElement | null>(null);
  const pasteCount = useRef(0);

  const copy = useCallback((element: FloorPlanElement) => {
    setBuffer(structuredClone(element));
    pasteCount.current = 0;
  }, []);

  const paste = useCallback((): FloorPlanElement | null => {
    if (!buffer) return null;

    pasteCount.current += 1;
    const offset = PASTE_OFFSET * pasteCount.current;

    const newElement = structuredClone(buffer);
    newElement.id = uuidv4();

    // Offset position
    const geo = newElement.geometry;
    if ("x" in geo) {
      (geo as { x: number }).x += offset;
    }
    if ("y" in geo) {
      (geo as { y: number }).y += offset;
    }

    // Clear booth code for copied booths (new booth, needs code)
    if (newElement.type === "booth") {
      newElement.properties.boothCode = undefined;
    }

    return newElement;
  }, [buffer]);

  return { copy, paste, hasBuffer: buffer !== null };
}
