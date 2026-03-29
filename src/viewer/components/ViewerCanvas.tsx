import { useRef, useState } from "react";
import { Stage, Layer, Rect, Group, Text, Ellipse, Line } from "react-konva";
import type {
  FloorPlanData,
  FloorPlanElement,
  RectGeometry,
  EllipseGeometry,
  LineGeometry,
} from "../../types";
import { useCanvasControls } from "../../editor/hooks/useCanvasControls";
import { BackgroundImage } from "../../editor/components/canvas/BackgroundImage";
import type { ViewerMode } from "../types";

interface ViewerCanvasProps {
  data: FloorPlanData;
  mode: ViewerMode;
  occupiedBoothCodes: Set<string>;
  highlightedBoothCode: string | null;
  searchMatchCodes: Set<string> | null;
  onBoothClick: (boothCode: string, screenX: number, screenY: number) => void;
}

function getLabel(element: FloorPlanElement): string {
  if (element.type === "booth" && element.properties.boothCode) {
    return element.properties.boothCode;
  }
  return element.properties.name || "";
}

function ViewerElement({
  element,
  isHighlighted,
  isDimmed,
  isHovered,
  overrideColor,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  element: FloorPlanElement;
  isHighlighted: boolean;
  isDimmed: boolean;
  isHovered: boolean;
  overrideColor?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: (e: { screenX: number; screenY: number }) => void;
}) {
  const geo = element.geometry;
  const label = getLabel(element);
  const color = overrideColor || element.properties.color;
  const active = isHighlighted || isHovered;
  const strokeColor = active ? "#007bff" : (element.properties.strokeColor || "#888888");
  const strokeWidth = active
    ? Math.max((element.properties.strokeWidth ?? 1) * 2, 3)
    : (element.properties.strokeWidth ?? (geo.shape === "line" ? 2 : 1));
  const opacity = isDimmed ? 0.4 : 0.9;

  const x = "x" in geo ? geo.x : 0;
  const y = "y" in geo ? geo.y : 0;
  const rotation = "rotation" in geo ? (geo.rotation ?? 0) : 0;

  return (
    <Group
      x={x}
      y={y}
      rotation={rotation}
      opacity={opacity}
      onMouseEnter={(e) => {
        if (onMouseEnter) {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = "pointer";
          onMouseEnter();
        }
      }}
      onMouseLeave={(e) => {
        if (onMouseLeave) {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = "default";
          onMouseLeave();
        }
      }}
      onClick={(e) => {
        if (onClick) {
          e.cancelBubble = true;
          onClick({ screenX: e.evt.clientX, screenY: e.evt.clientY });
        }
      }}
    >
      {geo.shape === "rect" && (
        <>
          <Rect
            width={geo.width}
            height={(geo as RectGeometry).height}
            fill={color}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            cornerRadius={2}
            opacity={0.9}
          />
          {label && (
            <Text
              text={label}
              width={geo.width}
              height={(geo as RectGeometry).height}
              align="center"
              verticalAlign="middle"
              fontSize={12}
              fill="#fff"
              fontStyle="bold"
              listening={false}
            />
          )}
        </>
      )}
      {geo.shape === "ellipse" && (
        <>
          <Ellipse
            x={(geo as EllipseGeometry).radiusX}
            y={(geo as EllipseGeometry).radiusY}
            radiusX={(geo as EllipseGeometry).radiusX}
            radiusY={(geo as EllipseGeometry).radiusY}
            fill={color}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity={0.9}
          />
          {label && (
            <Text
              width={(geo as EllipseGeometry).radiusX * 2}
              height={(geo as EllipseGeometry).radiusY * 2}
              align="center"
              verticalAlign="middle"
              text={label}
              fontSize={12}
              fill="#fff"
              fontStyle="bold"
              listening={false}
            />
          )}
        </>
      )}
      {geo.shape === "line" && (
        <Line
          points={[...(geo as LineGeometry).points]}
          stroke={color}
          strokeWidth={strokeWidth}
          lineCap="round"
        />
      )}
    </Group>
  );
}

export function ViewerCanvas({ data, mode, occupiedBoothCodes, highlightedBoothCode, searchMatchCodes, onBoothClick }: ViewerCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBoothCode, setHoveredBoothCode] = useState<string | null>(null);
  const isSearching = searchMatchCodes !== null && searchMatchCodes.size > 0;
  const {
    stageRef,
    scale,
    position,
    stageSize,
    handleWheel,
    handleDragEnd,
  } = useCanvasControls(containerRef);

  const sortedElements = [...data.elements].sort(
    (a, b) => (a.properties.zIndex ?? 0) - (b.properties.zIndex ?? 0)
  );

  const hasHighlight = highlightedBoothCode !== null;

  return (
    <div ref={containerRef} className="flex-1 min-w-0 bg-gray-200 overflow-hidden">
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable
        onWheel={handleWheel}
        onDragEnd={handleDragEnd}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={data.dimensions.width}
            height={data.dimensions.height}
            fill="#ffffff"
            stroke="#d1d5db"
            strokeWidth={1}
          />
          {data.backgroundImage && (
            <BackgroundImage config={data.backgroundImage} />
          )}
        </Layer>

        <Layer>
          {sortedElements.map((element) => {
            const isBooth = element.type === "booth";
            const boothCode = element.properties.boothCode;
            const isOccupied = isBooth && boothCode ? occupiedBoothCodes.has(boothCode) : false;

            // In attendee mode, unoccupied booths are faded and non-interactive
            const isInert = mode === "attendee" && isBooth && !isOccupied;

            const isSelected = isBooth && boothCode === highlightedBoothCode;
            const isSearchMatch = isBooth && boothCode && isSearching && searchMatchCodes!.has(boothCode);
            const isHovered = isBooth && boothCode === hoveredBoothCode;
            const highlighted = isSelected || !!isSearchMatch;
            const dimmed =
              isInert ||
              (hasHighlight && !isSelected) ||
              (isSearching && !isSearchMatch && !isSelected);

            // In exhibitor mode, occupied booths get a muted treatment when not highlighted
            const overrideColor =
              mode === "exhibitor" && isBooth && isOccupied && !highlighted
                ? "#6B7280"
                : undefined;

            return (
              <ViewerElement
                key={element.id}
                element={element}
                isHighlighted={highlighted}
                isDimmed={dimmed}
                isHovered={isHovered && !highlighted && !isInert}
                overrideColor={overrideColor}
                onMouseEnter={!isInert && isBooth && boothCode ? () => setHoveredBoothCode(boothCode) : undefined}
                onMouseLeave={!isInert && isBooth ? () => setHoveredBoothCode(null) : undefined}
                onClick={!isInert && isBooth && boothCode ? (e) => onBoothClick(boothCode, e.screenX, e.screenY) : undefined}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
