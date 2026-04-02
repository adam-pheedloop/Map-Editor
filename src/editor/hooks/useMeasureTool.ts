import { useState, useCallback, useEffect, useRef } from "react";
import type Konva from "konva";
import type { Point } from "../../types";
import { getCanvasPoint, snapToAngle } from "../utils/canvas";

export interface MeasureState {
  p1: Point | null;
  p2: Point | null;
  measuring: boolean;
}

const INITIAL_STATE: MeasureState = {
  p1: null,
  p2: null,
  measuring: false,
};

interface UseMeasureToolOptions {
  stageRef: React.RefObject<Konva.Stage | null>;
  position: { x: number; y: number };
  scale: number;
  isActive: boolean;
}

export function useMeasureTool({
  stageRef,
  position,
  scale,
  isActive,
}: UseMeasureToolOptions) {
  const [state, setState] = useState<MeasureState>(INITIAL_STATE);
  const measuringRef = useRef(false);

  // Reset when tool deactivates
  useEffect(() => {
    if (!isActive) {
      setState(INITIAL_STATE);
      measuringRef.current = false;
    }
  }, [isActive]);

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = stageRef.current;
      if (!stage) return;
      const point = getCanvasPoint(stage, position, scale);
      if (!point) return;

      e.evt.preventDefault();
      measuringRef.current = true;
      setState({ p1: point, p2: point, measuring: true });
    },
    [stageRef, position, scale],
  );

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!measuringRef.current) return;
      const stage = stageRef.current;
      if (!stage) return;
      let point = getCanvasPoint(stage, position, scale);
      if (!point) return;

      setState((prev) => {
        if (!prev.p1 || !prev.measuring) return prev;
        // Shift-snap to horizontal/vertical/45°
        if (e.evt.shiftKey) {
          point = snapToAngle(prev.p1, point!);
        }
        return { ...prev, p2: point };
      });
    },
    [stageRef, position, scale],
  );

  const handleMouseUp = useCallback(() => {
    measuringRef.current = false;
    setState((prev) => ({ ...prev, measuring: false }));
  }, []);

  return {
    state,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
