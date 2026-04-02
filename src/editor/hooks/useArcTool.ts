import { useState, useCallback, useRef } from "react";
import type Konva from "konva";
import { getCanvasPoint, isEmptySpaceClick } from "../utils/canvas";

export type ArcToolPhase = "idle" | "pickEnd" | "setCurvature";

export interface ArcToolState {
  phase: ArcToolPhase;
  pointA: { x: number; y: number } | null;
  pointB: { x: number; y: number } | null;
  controlPoint: { x: number; y: number } | null;
}

const INITIAL_STATE: ArcToolState = {
  phase: "idle",
  pointA: null,
  pointB: null,
  controlPoint: null,
};

export function useArcTool(
  stageRef: React.RefObject<Konva.Stage | null>,
  position: { x: number; y: number },
  scale: number,
  isActive: boolean,
  onComplete: (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number) => void
) {
  const [state, setState] = useState<ArcToolState>(INITIAL_STATE);
  const stateRef = useRef(state);
  stateRef.current = state;

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isActive) return;
      if (!isEmptySpaceClick(e)) return;

      const stage = stageRef.current;
      if (!stage) return;
      const point = getCanvasPoint(stage, position, scale);
      if (!point) return;

      const current = stateRef.current;

      if (current.phase === "idle") {
        // First click: set start point
        setState({
          phase: "pickEnd",
          pointA: point,
          pointB: null,
          controlPoint: null,
        });
      } else if (current.phase === "pickEnd") {
        // Second click: set end point, transition to curvature mode
        const mid = {
          x: (current.pointA!.x + point.x) / 2,
          y: (current.pointA!.y + point.y) / 2,
        };
        setState({
          phase: "setCurvature",
          pointA: current.pointA,
          pointB: point,
          controlPoint: mid,
        });
      } else if (current.phase === "setCurvature") {
        // Third click: finalize the arc
        onComplete(
          current.pointA!.x,
          current.pointA!.y,
          current.controlPoint!.x,
          current.controlPoint!.y,
          current.pointB!.x,
          current.pointB!.y
        );
        setState(INITIAL_STATE);
      }
    },
    [isActive, stageRef, position, scale, onComplete]
  );

  const handleMouseMove = useCallback(
    (_e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isActive) return;

      const stage = stageRef.current;
      if (!stage) return;
      const point = getCanvasPoint(stage, position, scale);
      if (!point) return;

      const current = stateRef.current;

      if (current.phase === "pickEnd" && current.pointA) {
        // Show preview line from A to mouse
        setState((prev) => ({ ...prev, pointB: point }));
      } else if (current.phase === "setCurvature" && current.pointA && current.pointB) {
        // Calculate control point from mouse position
        // Project mouse onto perpendicular of the chord
        const a = current.pointA;
        const b = current.pointB;
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };

        // Chord direction
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const chordLen = Math.sqrt(dx * dx + dy * dy);

        if (chordLen < 1) {
          setState((prev) => ({ ...prev, controlPoint: point }));
          return;
        }

        // Perpendicular unit vector
        const perpX = -dy / chordLen;
        const perpY = dx / chordLen;

        // Project mouse-to-midpoint vector onto perpendicular
        const mx = point.x - mid.x;
        const my = point.y - mid.y;
        const projLen = mx * perpX + my * perpY;

        setState((prev) => ({
          ...prev,
          controlPoint: {
            x: mid.x + perpX * projLen,
            y: mid.y + perpY * projLen,
          },
        }));
      }
    },
    [isActive, stageRef, position, scale]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive) return;
      if (e.key === "Escape") {
        reset();
      }
    },
    [isActive, reset]
  );

  return {
    state,
    handleMouseDown,
    handleMouseMove,
    handleKeyDown,
    reset,
  };
}
