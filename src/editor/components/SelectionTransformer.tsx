import { useRef, useEffect, useCallback } from "react";
import { Transformer } from "react-konva";
import type Konva from "konva";
import type { FloorPlanElement } from "../../types";

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

  // Re-run whenever selectedId changes OR the selected element's geometry updates
  const selectedElement = selectedId
    ? elements.find((el) => el.id === selectedId)
    : null;
  const geoKey = selectedElement
    ? JSON.stringify(selectedElement.geometry)
    : null;

  useEffect(() => {
    const tr = trRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;

    if (!selectedId) {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
      return;
    }

    const node = stage.findOne(`.${selectedId}`);
    if (node) {
      tr.nodes([node]);
      tr.getLayer()?.batchDraw();
    }
  }, [selectedId, stageRef, geoKey]);

  const handleTransformEnd = useCallback(() => {
    const tr = trRef.current;
    if (!tr || !selectedId) return;

    const node = tr.nodes()[0];
    if (!node) return;

    // Konva applies scale during transform — convert to width/height
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Find the rect child to get its dimensions
    const rect = (node as Konva.Group).findOne("Rect");
    if (!rect) return;

    const newWidth = rect.width() * scaleX;
    const newHeight = rect.height() * scaleY;

    // Reset scale and apply new dimensions directly on the node
    // so the Transformer matches immediately (before React re-renders)
    node.scaleX(1);
    node.scaleY(1);
    rect.width(newWidth);
    rect.height(newHeight);

    // Also update the text label dimensions if present
    const text = (node as Konva.Group).findOne("Text");
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
      borderStroke="#3b82f6"
      borderStrokeWidth={1.5}
      anchorFill="#fff"
      anchorStroke="#3b82f6"
      anchorSize={8}
      anchorCornerRadius={2}
      boundBoxFunc={(_oldBox, newBox) => {
        if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
          return _oldBox;
        }
        return newBox;
      }}
      onTransformEnd={handleTransformEnd}
    />
  );
}
