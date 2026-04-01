export type Unit = "ft" | "m" | "px";

// --- Layer system ---

export type LayerId = "background" | "content" | "pathing" | "markup";

export interface LayerDefinition {
  id: LayerId;
  name: string;
  order: number;
  visible: boolean;
  /** Whether this layer accepts arbitrary elements (false = special-purpose layer) */
  special: boolean;
}

export const DEFAULT_LAYERS: LayerDefinition[] = [
  { id: "background", name: "Background", order: 0, visible: true, special: true },
  { id: "content", name: "Content", order: 1, visible: true, special: false },
  { id: "pathing", name: "Pathing", order: 2, visible: true, special: true },
  { id: "markup", name: "Markup", order: 3, visible: true, special: false },
];

// --- Element types ---

export type ElementType =
  | "booth"
  | "session_area"
  | "meeting_room"
  | "stage"
  | "walkway"
  | "wall"
  | "label"
  | "icon"
  | "shape";

/** Default layer assignment per element type. Elements can be moved to other non-special layers. */
export const ELEMENT_TYPE_TO_LAYER: Record<ElementType, LayerId> = {
  booth: "content",
  session_area: "content",
  meeting_room: "content",
  stage: "content",
  walkway: "pathing",
  wall: "pathing",
  label: "markup",
  icon: "markup",
  shape: "markup",
};

export type ShapeType = "rect" | "polygon" | "circle" | "ellipse";

export interface Point {
  x: number;
  y: number;
}

export interface RectGeometry {
  shape: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export interface PolygonGeometry {
  shape: "polygon";
  coordinates: Point[];
}

export interface CircleGeometry {
  shape: "circle";
  x: number;
  y: number;
  radius: number;
}

export interface EllipseGeometry {
  shape: "ellipse";
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation?: number;
}

export interface LineGeometry {
  shape: "line";
  x: number;
  y: number;
  points: [number, number, number, number]; // [x1, y1, x2, y2] relative to anchor
}

export type Geometry =
  | RectGeometry
  | PolygonGeometry
  | CircleGeometry
  | EllipseGeometry
  | LineGeometry;

export interface ElementProperties {
  name?: string;
  color: string;
  strokeColor?: string;
  strokeWidth?: number;
  zIndex: number;
  // Booth-specific
  boothCode?: string;
  boothSlug?: string;
  exhibitorId?: string | null;
  capacity?: number | null;
  area?: number;
  // Session-specific
  sessionId?: string | null;
  // Meeting room-specific
  meetingRoomId?: string | null;
  // Label-specific
  text?: string;
  fontSize?: number;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline";
  textAlign?: "left" | "center" | "right";
  // Icon-specific
  iconName?: string;
}

export interface FloorPlanElement {
  id: string;
  type: ElementType;
  layer?: LayerId;
  geometry: Geometry;
  properties: ElementProperties;
}

export interface LegendEntry {
  label: string;
  color: string;
}

export interface Legend {
  entries: LegendEntry[];
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  visible: boolean;
}

export interface BackgroundImage {
  url: string;
  width: number;
  height: number;
  opacity: number;
}

export interface Dimensions {
  width: number;
  height: number;
  unit: Unit;
  pixelsPerUnit: number;
}

export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  scale: number;
}

export interface FloorPlanData {
  version: string;
  id: string;
  name: string;
  dimensions: Dimensions;
  elements: FloorPlanElement[];
  legend: Legend;
  backgroundImage?: BackgroundImage;
  backgroundColor?: string;
  metadata: FloorPlanMetadata;
}
