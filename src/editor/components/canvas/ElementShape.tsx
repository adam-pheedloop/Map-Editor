import { Group } from "react-konva";
import type { FloorPlanElement } from "../../../types";
import { RectShape } from "./elements/RectShape";
import { EllipseShape } from "./elements/EllipseShape";
import { LineShape } from "./elements/LineShape";
import { BoothShape } from "./elements/BoothShape";

interface ElementShapeProps {
  element: FloorPlanElement;
  isSelectMode: boolean;
  isSelected: boolean;
  onSelect: (id: string, shiftKey?: boolean) => void;
  onDragStart: (id: string) => void;
  onDragMove: (id: string, x: number, y: number) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onContextMenu: (elementId: string, screenX: number, screenY: number) => void;
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
  isSelected: _isSelected,
  onSelect,
  onDragStart,
  onDragMove,
  onDragEnd,
  onContextMenu,
}: ElementShapeProps) {
  const geo = element.geometry;
  const label = getLabel(element);
  const color = element.properties.color;
  const strokeColor = element.properties.strokeColor || "#888888";
  const strokeWidth = element.properties.strokeWidth ?? (geo.shape === "line" ? 2 : 1);

  const x = "x" in geo ? geo.x : 0;
  const y = "y" in geo ? geo.y : 0;
  const rotation = "rotation" in geo ? (geo.rotation ?? 0) : 0;

  return (
    <Group
      name={element.id}
      x={x}
      y={y}
      rotation={rotation}
      draggable={isSelectMode}
      onClick={(e) => {
        if (!isSelectMode) return;
        e.cancelBubble = true;
        onSelect(element.id, e.evt.shiftKey);
      }}
      onDragStart={() => {
        onDragStart(element.id);
      }}
      onDragMove={(e) => {
        onDragMove(element.id, e.target.x(), e.target.y());
      }}
      onDragEnd={(e) => {
        onDragEnd(element.id, e.target.x(), e.target.y());
      }}
      onContextMenu={(e) => {
        e.evt.preventDefault();
        e.cancelBubble = true;
        onContextMenu(element.id, e.evt.clientX, e.evt.clientY);
      }}
    >
      {element.type === "booth" && geo.shape === "rect" && (
        <BoothShape
          geo={geo}
          color={color}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          boothCode={element.properties.boothCode || element.id.slice(0, 6)}
        />
      )}
      {element.type !== "booth" && geo.shape === "rect" && (
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
