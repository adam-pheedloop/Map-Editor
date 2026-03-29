import { Rect, Ellipse, Line } from "react-konva";
import type { DrawingRect } from "../hooks/useDrawingTool";
import type { LinePreview } from "../hooks/useLineTool";
import type { ActiveTool } from "../types";

interface DrawingPreviewProps {
  rectPreview: DrawingRect | null;
  linePreview: LinePreview | null;
  activeTool: ActiveTool;
}

const shapePreviewStyle = {
  fill: "#94a3b8",
  opacity: 0.5,
  stroke: "#475569",
  strokeWidth: 1,
  dash: [4, 4] as number[],
  listening: false,
} as const;

const linePreviewStyle = {
  stroke: "#475569",
  strokeWidth: 2,
  dash: [4, 4] as number[],
  listening: false,
  lineCap: "round" as const,
} as const;

export function DrawingPreview({
  rectPreview,
  linePreview,
  activeTool,
}: DrawingPreviewProps) {
  if (activeTool === "line" && linePreview) {
    return (
      <Line
        points={[
          linePreview.x1,
          linePreview.y1,
          linePreview.x2,
          linePreview.y2,
        ]}
        {...linePreviewStyle}
      />
    );
  }

  if (!rectPreview) return null;

  if (activeTool === "ellipse") {
    return (
      <Ellipse
        x={rectPreview.x + rectPreview.width / 2}
        y={rectPreview.y + rectPreview.height / 2}
        radiusX={rectPreview.width / 2}
        radiusY={rectPreview.height / 2}
        {...shapePreviewStyle}
      />
    );
  }

  return (
    <Rect
      x={rectPreview.x}
      y={rectPreview.y}
      width={rectPreview.width}
      height={rectPreview.height}
      {...shapePreviewStyle}
    />
  );
}
