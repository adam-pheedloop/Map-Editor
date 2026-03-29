import { Group } from "react-konva";
import type { FloorPlanElement } from "../../../types";
import { RectShape } from "./elements/RectShape";
import { EllipseShape } from "./elements/EllipseShape";
import { LineShape } from "./elements/LineShape";

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

export function ElementShape({
  element,
  isSelectMode,
  onSelect,
  onDragEnd,
}: ElementShapeProps) {
  const geo = element.geometry;
  const label = getLabel(element);
  const color = element.properties.color;
  const strokeColor = element.properties.strokeColor || "#888888";
  const strokeWidth = element.properties.strokeWidth ?? (geo.shape === "line" ? 2 : 1);

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
        <RectShape geo={geo} color={color} strokeColor={strokeColor} strokeWidth={strokeWidth} label={label} />
      )}
      {geo.shape === "ellipse" && (
        <EllipseShape geo={geo} color={color} strokeColor={strokeColor} strokeWidth={strokeWidth} label={label} />
      )}
      {geo.shape === "line" && (
        <LineShape geo={geo} color={color} strokeWidth={strokeWidth} />
      )}
    </Group>
  );
}
