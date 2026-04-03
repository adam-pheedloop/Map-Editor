import { useState, useCallback, useRef, useEffect } from "react";
import type Konva from "konva";
import { getCanvasPoint, isEmptySpaceClick, snapToAngle } from "../utils/canvas";

export interface PolygonToolState {
  vertices: Array<{ x: number; y: number }>;
  previewPoint: { x: number; y: number } | null;
  isDrawing: boolean;
}

const INITIAL_STATE: PolygonToolState = {
  vertices: [],
  previewPoint: null,
  isDrawing: false,
};

const SNAP_CLOSE_DISTANCE = 8;
const MIN_VERTICES = 3;

export function usePolygonTool(
  stageRef: React.RefObject<Konva.Stage | null>,
  position: { x: number; y: number },
  scale: number,
  isActive: boolean,
  onComplete: (points: number[], anchorX: number, anchorY: number) => void
) {
  const [state, setState] = useState<PolygonToolState>(INITIAL_STATE);
  const stateRef = useRef(state);
  stateRef.current = state;

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const closePolygon = useCallback(() => {
    const { vertices } = stateRef.current;
    if (vertices.length < MIN_VERTICES) return;

    const anchorX = vertices[0].x;
    const anchorY = vertices[0].y;
    const flatPoints: number[] = [];
    for (const v of vertices) {
      flatPoints.push(v.x - anchorX, v.y - anchorY);
    }
    onComplete(flatPoints, anchorX, anchorY);
    setState(INITIAL_STATE);
  }, [onComplete]);

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isActive) return;
      if (!isEmptySpaceClick(e)) return;

      const stage = stageRef.current;
      if (!stage) return;
      const point = getCanvasPoint(stage, position, scale);
      if (!point) return;

      const current = stateRef.current;

      // Snap to angle if shift held
      let finalPoint = point;
      if (e.evt.shiftKey && current.vertices.length > 0) {
        const lastVertex = current.vertices[current.vertices.length - 1];
        finalPoint = snapToAngle(lastVertex, point);
      }

      // Check snap-to-close: if clicking near first vertex and we have enough vertices
      if (current.vertices.length >= MIN_VERTICES) {
        const first = current.vertices[0];
        const dx = finalPoint.x - first.x;
        const dy = finalPoint.y - first.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < SNAP_CLOSE_DISTANCE / scale) {
          closePolygon();
          return;
        }
      }

      setState((prev) => ({
        vertices: [...prev.vertices, finalPoint],
        previewPoint: finalPoint,
        isDrawing: true,
      }));
    },
    [isActive, stageRef, position, scale, closePolygon]
  );

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isActive || !stateRef.current.isDrawing) return;

      const stage = stageRef.current;
      if (!stage) return;
      const point = getCanvasPoint(stage, position, scale);
      if (!point) return;

      let finalPoint = point;
      const current = stateRef.current;
      if (e.evt.shiftKey && current.vertices.length > 0) {
        const lastVertex = current.vertices[current.vertices.length - 1];
        finalPoint = snapToAngle(lastVertex, point);
      }

      setState((prev) => ({ ...prev, previewPoint: finalPoint }));
    },
    [isActive, stageRef, position, scale]
  );

  // Keyboard: Enter to close, Escape to cancel
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        reset();
      } else if (e.key === "Enter") {
        closePolygon();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, reset, closePolygon]);

  // Handle double-click to close
  const handleDoubleClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isActive) return;
      if (!isEmptySpaceClick(e)) return;
      // Remove the last vertex added by the second click of the double-click
      setState((prev) => ({
        ...prev,
        vertices: prev.vertices.slice(0, -1),
      }));
      // Close after state update
      setTimeout(() => closePolygon(), 0);
    },
    [isActive, closePolygon]
  );

  return {
    state,
    handleMouseDown,
    handleMouseMove,
    handleDoubleClick,
    reset,
  };
}
