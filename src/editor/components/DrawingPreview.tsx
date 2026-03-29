import { Rect, Ellipse } from "react-konva";
import type { DrawingRect } from "../hooks/useDrawingTool";
import type { ActiveTool } from "../types";

interface DrawingPreviewProps {
  preview: DrawingRect | null;
  activeTool: ActiveTool;
}

const previewStyle = {
  fill: "#94a3b8",
  opacity: 0.5,
  stroke: "#475569",
  strokeWidth: 1,
  dash: [4, 4] as number[],
  listening: false,
} as const;

export function DrawingPreview({ preview, activeTool }: DrawingPreviewProps) {
  if (!preview) return null;

  if (activeTool === "ellipse") {
    return (
      <Ellipse
        x={preview.x + preview.width / 2}
        y={preview.y + preview.height / 2}
        radiusX={preview.width / 2}
        radiusY={preview.height / 2}
        {...previewStyle}
      />
    );
  }

  return (
    <Rect
      x={preview.x}
      y={preview.y}
      width={preview.width}
      height={preview.height}
      {...previewStyle}
    />
  );
}
