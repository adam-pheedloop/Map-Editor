import { useState, useRef, useCallback } from "react";
import type Konva from "konva";
import { getCanvasPoint, isEmptySpaceClick } from "../utils/canvas";

export interface DrawingRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const MIN_SIZE = 5;

export function useDrawingTool(
  stageRef: React.RefObject<Konva.Stage | null>,
  position: { x: number; y: number },
  scale: number,
  isActive: boolean,
  onComplete: (x: number, y: number, width: number, height: number) => void
) {
  const [preview, setPreview] = useState<DrawingRect | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const shiftHeld = useRef(false);

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isActive) return;
      if (!isEmptySpaceClick(e)) return;

      const stage = stageRef.current;
      if (!stage) return;

      const point = getCanvasPoint(stage, position, scale);
      if (!point) return;

      origin.current = point;
      setPreview({ x: point.x, y: point.y, width: 0, height: 0 });
    },
    [isActive, stageRef, position, scale]
  );

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!origin.current) return;

      const stage = stageRef.current;
      if (!stage) return;

      const point = getCanvasPoint(stage, position, scale);
      if (!point) return;

      shiftHeld.current = e.evt.shiftKey;

      const o = origin.current;
      let width = Math.abs(point.x - o.x);
      let height = Math.abs(point.y - o.y);

      // Shift constrains to square/circle
      if (e.evt.shiftKey) {
        const size = Math.max(width, height);
        width = size;
        height = size;
      }

      setPreview({
        x: point.x < o.x ? o.x - width : o.x,
        y: point.y < o.y ? o.y - height : o.y,
        width,
        height,
      });
    },
    [stageRef, position, scale]
  );

  const handleMouseUp = useCallback(() => {
    if (!preview || !origin.current) return;

    if (preview.width > MIN_SIZE && preview.height > MIN_SIZE) {
      onComplete(preview.x, preview.y, preview.width, preview.height);
    }

    origin.current = null;
    setPreview(null);
  }, [preview, onComplete]);

  return {
    preview,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
