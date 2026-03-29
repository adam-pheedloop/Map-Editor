import { useState, useRef, useCallback } from "react";
import type Konva from "konva";
import { getCanvasPoint, isEmptySpaceClick, snapToAngle } from "../utils/canvas";

export interface LinePreview {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const MIN_LENGTH = 5;

export function useLineTool(
  stageRef: React.RefObject<Konva.Stage | null>,
  position: { x: number; y: number },
  scale: number,
  isActive: boolean,
  onComplete: (x1: number, y1: number, x2: number, y2: number) => void
) {
  const [preview, setPreview] = useState<LinePreview | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isActive) return;
      if (!isEmptySpaceClick(e)) return;

      const stage = stageRef.current;
      if (!stage) return;

      const point = getCanvasPoint(stage, position, scale);
      if (!point) return;

      origin.current = point;
      setPreview({ x1: point.x, y1: point.y, x2: point.x, y2: point.y });
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

      const end = e.evt.shiftKey
        ? snapToAngle(origin.current, point)
        : point;

      setPreview({
        x1: origin.current.x,
        y1: origin.current.y,
        x2: end.x,
        y2: end.y,
      });
    },
    [stageRef, position, scale]
  );

  const handleMouseUp = useCallback(() => {
    if (!preview || !origin.current) return;

    const dx = preview.x2 - preview.x1;
    const dy = preview.y2 - preview.y1;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length > MIN_LENGTH) {
      onComplete(preview.x1, preview.y1, preview.x2, preview.y2);
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
