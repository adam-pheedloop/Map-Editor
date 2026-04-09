import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Group, Text, Ellipse, Line, Arrow, Shape, Image as KonvaImage } from "react-konva";
import type {
  FloorPlanData,
  FloorPlanElement,
  RectGeometry,
  EllipseGeometry,
  LineGeometry,
  ArcGeometry,
  PolygonGeometry,
} from "../../types";
import { getIconEntry } from "../../editor/utils/iconRegistry";
import { iconToImage } from "../../editor/utils/iconToImage";
import { useCanvasControls } from "../../editor/hooks/useCanvasControls";
import { BackgroundImage } from "../../editor/components/canvas/BackgroundImage";
import type { ViewerMode, HoveredItem } from "../types";
import { RouteOverlay } from "./RouteOverlay";
import { ScaleBar } from "./ScaleBar";
import { ViewerLegend } from "./ViewerLegend";

interface ViewerCanvasProps {
  data: FloorPlanData;
  mode: ViewerMode;
  occupiedBoothCodes: Set<string>;
  highlightedElementId: string | null;
  searchMatchIds: Set<string> | null;
  routePath: { x: number; y: number }[] | null;
  onElementClick: (item: HoveredItem, screenX: number, screenY: number) => void;
}

function ViewerIcon({ iconName, color, width, height }: { iconName: string; color: string; width: number; height: number }) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    const entry = getIconEntry(iconName);
    if (!entry) return;
    iconToImage(entry.component, color, 128, setImage);
  }, [iconName, color]);
  if (!image) return null;
  return <KonvaImage image={image} width={width} height={height} />;
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
  const baseOpacity = element.properties.opacity ?? 1;
  const opacity = isDimmed ? baseOpacity * 0.4 : baseOpacity;

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
      {geo.shape === "rect" && element.type !== "icon" && (
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
          {label && element.properties.labelVisible !== false && (
            <Text
              text={label}
              width={geo.width}
              height={(geo as RectGeometry).height}
              align={element.properties.labelPositionH ?? "center"}
              verticalAlign={element.properties.labelPositionV ?? "middle"}
              padding={4}
              fontSize={element.properties.labelFontSize ?? 12}
              fill={element.properties.labelColor ?? "#fff"}
              fontStyle={`${element.properties.labelBold !== false ? "bold" : ""}${element.properties.labelItalic ? " italic" : ""}`.trim() || "normal"}
              textDecoration={element.properties.labelUnderline ? "underline" : ""}
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
          {label && element.properties.labelVisible !== false && (
            <Text
              width={(geo as EllipseGeometry).radiusX * 2}
              height={(geo as EllipseGeometry).radiusY * 2}
              align={element.properties.labelPositionH ?? "center"}
              verticalAlign={element.properties.labelPositionV ?? "middle"}
              padding={4}
              text={label}
              fontSize={element.properties.labelFontSize ?? 12}
              fill={element.properties.labelColor ?? "#fff"}
              fontStyle={`${element.properties.labelBold !== false ? "bold" : ""}${element.properties.labelItalic ? " italic" : ""}`.trim() || "normal"}
              textDecoration={element.properties.labelUnderline ? "underline" : ""}
              listening={false}
            />
          )}
        </>
      )}
      {geo.shape === "line" && !element.properties.arrowHead && (
        <Line
          points={[...(geo as LineGeometry).points]}
          stroke={color}
          strokeWidth={strokeWidth}
          lineCap="round"
        />
      )}
      {geo.shape === "line" && element.properties.arrowHead && (
        <Arrow
          points={[...(geo as LineGeometry).points]}
          stroke={color}
          strokeWidth={strokeWidth}
          pointerLength={element.properties.arrowHead.size}
          pointerWidth={element.properties.arrowHead.size * 0.8}
          fill={element.properties.arrowHead.style === "triangle" ? color : ""}
          lineCap="round"
        />
      )}
      {geo.shape === "arc" && (() => {
        const arcGeo = geo as ArcGeometry;
        const [x1, y1, cx, cy, x2, y2] = arcGeo.points;
        return (
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.quadraticCurveTo(cx, cy, x2, y2);
              ctx.fillStrokeShape(shape);
            }}
            stroke={color}
            strokeWidth={strokeWidth}
            lineCap="round"
          />
        );
      })()}
      {geo.shape === "polygon" && (
        <Line
          points={[...(geo as PolygonGeometry).points]}
          closed
          fill={color}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      )}
      {element.type === "icon" && geo.shape === "rect" && element.properties.iconName && (
        <ViewerIcon
          iconName={element.properties.iconName}
          color={color}
          width={geo.width}
          height={(geo as RectGeometry).height}
        />
      )}
    </Group>
  );
}

export function ViewerCanvas({ data, mode, occupiedBoothCodes, highlightedElementId, searchMatchIds, routePath, onElementClick }: ViewerCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const isSearching = !!searchMatchIds && searchMatchIds.size > 0;
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

  const hasHighlight = highlightedElementId !== null;

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0 bg-gray-200 overflow-hidden">
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
            const isSessionArea = element.type === "session_area";
            const isMeetingRoom = element.type === "meeting_room";
            const isInteractive = isBooth || isSessionArea || isMeetingRoom;
            const boothCode = element.properties.boothCode;
            const isOccupied = isBooth && boothCode ? occupiedBoothCodes.has(boothCode) : false;

            // In attendee mode, unoccupied booths are faded and non-interactive
            const isInert = mode === "attendee" && isBooth && !isOccupied;

            const isSelected = element.id === highlightedElementId;
            const isSearchMatch = isInteractive && isSearching && searchMatchIds!.has(element.id);
            const isHovered = element.id === hoveredElementId;
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

            const buildClickItem = (): HoveredItem | null => {
              if (isBooth && boothCode) {
                return { type: "booth", elementId: element.id, boothCode };
              }
              if (isSessionArea) {
                return { type: "session_area", elementId: element.id, sessionId: element.properties.sessionId ?? null };
              }
              if (isMeetingRoom) {
                return { type: "meeting_room", elementId: element.id, meetingRoomId: element.properties.meetingRoomId ?? null };
              }
              return null;
            };

            return (
              <ViewerElement
                key={element.id}
                element={element}
                isHighlighted={highlighted}
                isDimmed={dimmed}
                isHovered={isHovered && !highlighted && !isInert}
                overrideColor={overrideColor}
                onMouseEnter={!isInert && isInteractive ? () => setHoveredElementId(element.id) : undefined}
                onMouseLeave={!isInert && isInteractive ? () => setHoveredElementId(null) : undefined}
                onClick={!isInert && isInteractive ? (e) => {
                  const item = buildClickItem();
                  if (item) onElementClick(item, e.screenX, e.screenY);
                } : undefined}
              />
            );
          })}
        </Layer>

        {routePath && <RouteOverlay path={routePath} />}
      </Stage>
      <ScaleBar dimensions={data.dimensions} scale={scale} />
      <ViewerLegend legend={data.legend} />
    </div>
  );
}
