import { Group, Rect, Ellipse, Text } from "react-konva";
import type {
  FloorPlanElement,
  RectGeometry,
  EllipseGeometry,
} from "../../types";

interface ElementShapeProps {
  element: FloorPlanElement;
  isSelectMode: boolean;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
}

function getLabel(element: FloorPlanElement): string {
  if (element.type === "booth" && element.properties.boothCode) {
    return element.properties.boothCode;
  }
  return element.properties.name || "";
}

function RectShape({
  geo,
  color,
  label,
}: {
  geo: RectGeometry;
  color: string;
  label: string;
}) {
  return (
    <>
      <Rect
        width={geo.width}
        height={geo.height}
        fill={color}
        stroke="#888"
        strokeWidth={0.5}
        cornerRadius={2}
        opacity={0.9}
      />
      {label && (
        <Text
          text={label}
          width={geo.width}
          height={geo.height}
          align="center"
          verticalAlign="middle"
          fontSize={12}
          fill="#fff"
          fontStyle="bold"
          listening={false}
        />
      )}
    </>
  );
}

function EllipseShape({
  geo,
  color,
  label,
}: {
  geo: EllipseGeometry;
  color: string;
  label: string;
}) {
  return (
    <>
      <Ellipse
        x={geo.radiusX}
        y={geo.radiusY}
        radiusX={geo.radiusX}
        radiusY={geo.radiusY}
        fill={color}
        stroke="#888"
        strokeWidth={0.5}
        opacity={0.9}
      />
      {label && (
        <Text
          text={label}
          x={0}
          y={0}
          width={geo.radiusX * 2}
          height={geo.radiusY * 2}
          align="center"
          verticalAlign="middle"
          fontSize={12}
          fill="#fff"
          fontStyle="bold"
          listening={false}
        />
      )}
    </>
  );
}

export function ElementShape({
  element,
  isSelectMode,
  onSelect,
  onDragEnd,
}: ElementShapeProps) {
  const geo = element.geometry;
  const label = getLabel(element);
  const color = element.properties.color;

  // All supported shapes have x/y except polygon (not yet supported)
  const x = "x" in geo ? geo.x : 0;
  const y = "y" in geo ? geo.y : 0;

  return (
    <Group
      name={element.id}
      x={x}
      y={y}
      draggable={isSelectMode}
      onClick={(e) => {
        if (!isSelectMode) return;
        e.cancelBubble = true;
        onSelect(element.id);
      }}
      onDragEnd={(e) => {
        onDragEnd(element.id, e.target.x(), e.target.y());
      }}
    >
      {geo.shape === "rect" && (
        <RectShape geo={geo} color={color} label={label} />
      )}
      {geo.shape === "ellipse" && (
        <EllipseShape geo={geo} color={color} label={label} />
      )}
    </Group>
  );
}
