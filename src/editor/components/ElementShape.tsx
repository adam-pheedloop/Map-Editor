import { Group, Rect, Text } from "react-konva";
import type { FloorPlanElement, RectGeometry } from "../../types";

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
  const geo = element.geometry as RectGeometry;
  const label = getLabel(element);

  return (
    <Group
      name={element.id}
      x={geo.x}
      y={geo.y}
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
      <Rect
        width={geo.width}
        height={geo.height}
        fill={element.properties.color}
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
    </Group>
  );
}
