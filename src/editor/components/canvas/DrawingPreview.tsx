import { Rect, Ellipse, Line, Arrow, Shape, Circle } from "react-konva";
import type { DrawingRect } from "../../hooks/useDrawingTool";
import type { LinePreview } from "../../hooks/useLineTool";
import type { ArcToolState } from "../../hooks/useArcTool";
import type { PolygonToolState } from "../../hooks/usePolygonTool";
import type { ActiveTool } from "../../types";

interface DrawingPreviewProps {
  rectPreview: DrawingRect | null;
  linePreview: LinePreview | null;
  arcState: ArcToolState;
  polygonState: PolygonToolState;
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

const VERTEX_RADIUS = 4;

export function DrawingPreview({
  rectPreview,
  linePreview,
  arcState,
  polygonState,
  activeTool,
}: DrawingPreviewProps) {
  // Polygon tool preview
  if (activeTool === "polygon" && polygonState.isDrawing && polygonState.vertices.length > 0) {
    const { vertices, previewPoint } = polygonState;
    const first = vertices[0];
    const last = vertices[vertices.length - 1];

    // Flat points for placed edges
    const placedPoints: number[] = [];
    for (const v of vertices) {
      placedPoints.push(v.x, v.y);
    }

    // Check if mouse is near first vertex (snap-to-close indicator)
    let nearFirst = false;
    if (previewPoint && vertices.length >= 3) {
      const dx = previewPoint.x - first.x;
      const dy = previewPoint.y - first.y;
      nearFirst = Math.sqrt(dx * dx + dy * dy) < 12;
    }

    return (
      <>
        {/* Placed edges */}
        {vertices.length >= 2 && (
          <Line points={placedPoints} {...linePreviewStyle} />
        )}
        {/* Next edge preview: last vertex to mouse */}
        {previewPoint && (
          <Line
            points={[last.x, last.y, previewPoint.x, previewPoint.y]}
            {...linePreviewStyle}
          />
        )}
        {/* Closing edge preview: mouse back to first vertex */}
        {previewPoint && vertices.length >= 2 && (
          <Line
            points={[previewPoint.x, previewPoint.y, first.x, first.y]}
            stroke="#475569"
            strokeWidth={1}
            dash={[3, 5]}
            opacity={0.5}
            listening={false}
          />
        )}
        {/* Vertex dots */}
        {vertices.map((v, i) => (
          <Circle
            key={i}
            x={v.x}
            y={v.y}
            radius={i === 0 && nearFirst ? 6 : VERTEX_RADIUS}
            fill={i === 0 && nearFirst ? "#007bff" : "#475569"}
            listening={false}
          />
        ))}
      </>
    );
  }

  // Arc tool preview
  if (activeTool === "arc" && arcState.phase !== "idle") {
    const { pointA, pointB, controlPoint, phase } = arcState;
    if (!pointA) return null;

    if (phase === "pickEnd" && pointB) {
      // Dashed line from A to mouse
      return (
        <>
          <Line
            points={[pointA.x, pointA.y, pointB.x, pointB.y]}
            {...linePreviewStyle}
          />
          <Circle x={pointA.x} y={pointA.y} radius={VERTEX_RADIUS} fill="#475569" listening={false} />
        </>
      );
    }

    if (phase === "setCurvature" && pointB && controlPoint) {
      // Dashed Bézier curve
      return (
        <>
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.moveTo(pointA.x, pointA.y);
              ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, pointB.x, pointB.y);
              ctx.fillStrokeShape(shape);
            }}
            {...linePreviewStyle}
          />
          <Circle x={pointA.x} y={pointA.y} radius={VERTEX_RADIUS} fill="#475569" listening={false} />
          <Circle x={pointB.x} y={pointB.y} radius={VERTEX_RADIUS} fill="#475569" listening={false} />
          <Circle x={controlPoint.x} y={controlPoint.y} radius={3} fill="#007bff" listening={false} />
        </>
      );
    }

    return null;
  }

  if ((activeTool === "line" || activeTool === "arrow") && linePreview) {
    const points = [linePreview.x1, linePreview.y1, linePreview.x2, linePreview.y2];
    if (activeTool === "arrow") {
      return (
        <Arrow
          points={points}
          pointerLength={12}
          pointerWidth={10}
          fill="#475569"
          {...linePreviewStyle}
        />
      );
    }
    return <Line points={points} {...linePreviewStyle} />;
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
