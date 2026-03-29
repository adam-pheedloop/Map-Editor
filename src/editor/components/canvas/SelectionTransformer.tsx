import { useRef, useEffect, useCallback } from "react";
import { Transformer } from "react-konva";
import type Konva from "konva";
import type { FloorPlanElement } from "../../../types";

interface SelectionTransformerProps {
  selectedId: string | null;
  stageRef: React.RefObject<Konva.Stage | null>;
  elements: FloorPlanElement[];
  onTransformEnd: (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) => void;
}

export function SelectionTransformer({
  selectedId,
  stageRef,
  elements,
  onTransformEnd,
}: SelectionTransformerProps) {
  const trRef = useRef<Konva.Transformer>(null);
  const shiftHeld = useRef(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") shiftHeld.current = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") shiftHeld.current = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Re-run whenever selectedId changes OR the selected element's geometry updates
  const selectedElement = selectedId
    ? elements.find((el) => el.id === selectedId)
    : null;
  const geoKey = selectedElement
    ? JSON.stringify(selectedElement.geometry)
    : null;

  const isLine = selectedElement?.geometry.shape === "line";

  useEffect(() => {
    const tr = trRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;

    // Lines use endpoint handles, not the Transformer
    if (!selectedId || isLine) {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
      return;
    }

    const node = stage.findOne(`.${selectedId}`);
    if (node) {
      tr.nodes([node]);
      tr.getLayer()?.batchDraw();
    }
  }, [selectedId, stageRef, geoKey, isLine]);

  const handleTransformEnd = useCallback(() => {
    const tr = trRef.current;
    if (!tr || !selectedId) return;

    const node = tr.nodes()[0];
    if (!node) return;

    const group = node as Konva.Group;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Find the primary shape child (Rect or Ellipse)
    const rect = group.findOne("Rect");
    const ellipse = group.findOne("Ellipse");
    const shape = rect || ellipse;
    if (!shape) return;

    let newWidth: number;
    let newHeight: number;

    if (ellipse) {
      const el = ellipse as Konva.Ellipse;
      const newRadiusX = el.radiusX() * scaleX;
      const newRadiusY = el.radiusY() * scaleY;
      el.radiusX(newRadiusX);
      el.radiusY(newRadiusY);
      newWidth = newRadiusX * 2;
      newHeight = newRadiusY * 2;
    } else {
      newWidth = (shape as Konva.Rect).width() * scaleX;
      newHeight = (shape as Konva.Rect).height() * scaleY;
      (shape as Konva.Rect).width(newWidth);
      (shape as Konva.Rect).height(newHeight);
    }

    // Reset scale so it doesn't compound
    node.scaleX(1);
    node.scaleY(1);

    // Update the text label dimensions if present
    const text = group.findOne("Text");
    if (text) {
      text.width(newWidth);
      text.height(newHeight);
    }

    onTransformEnd(selectedId, node.x(), node.y(), newWidth, newHeight);
  }, [selectedId, onTransformEnd]);

  return (
    <Transformer
      ref={trRef}
      rotateEnabled={false}
      borderStroke="#007bff"
      borderStrokeWidth={1.5}
      anchorFill="#fff"
      anchorStroke="#007bff"
      anchorSize={8}
      anchorCornerRadius={2}
      boundBoxFunc={(_oldBox, newBox) => {
        if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
          return _oldBox;
        }
        if (shiftHeld.current) {
          const size = Math.max(Math.abs(newBox.width), Math.abs(newBox.height));
          return {
            ...newBox,
            width: size * Math.sign(newBox.width),
            height: size * Math.sign(newBox.height),
          };
        }
        return newBox;
      }}
      onTransformEnd={handleTransformEnd}
    />
  );
}
