import { Rect } from "react-konva";
import type { DrawingRect } from "../hooks/useDrawingTool";

interface DrawingPreviewProps {
  preview: DrawingRect | null;
}

export function DrawingPreview({ preview }: DrawingPreviewProps) {
  if (!preview) return null;

  return (
    <Rect
      x={preview.x}
      y={preview.y}
      width={preview.width}
      height={preview.height}
      fill="#94a3b8"
      opacity={0.5}
      stroke="#475569"
      strokeWidth={1}
      dash={[4, 4]}
      listening={false}
    />
  );
}
