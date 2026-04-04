import type { ToolDefinition, OptionsBarField, PropertiesPanelField, ContextMenuAction } from "./types";
import { rectangleTool } from "./rectangle";
import { ellipseTool } from "./ellipse";
import { boothTool } from "./booth";
import { lineTool } from "./line";
import { arrowTool } from "./arrow";
import { arcTool } from "./arc";
import { polygonTool } from "./polygon";
import { textTool } from "./text";
import { iconTool } from "./icon";
import { measureTool } from "./measure";
import { sessionAreaTool } from "./sessionArea";
import { meetingRoomTool } from "./meetingRoom";

// Order determines toolbar display order.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TOOL_REGISTRY: ToolDefinition<any>[] = [
  rectangleTool,
  ellipseTool,
  lineTool,
  arrowTool,
  arcTool,
  polygonTool,
  boothTool,
  sessionAreaTool,
  meetingRoomTool,
  textTool,
  iconTool,
  measureTool,
];

/** Tool IDs that belong in the "Locations" tool group. */
export const LOCATION_TOOL_IDS: readonly string[] = ["booth", "session_area", "meeting_room"];

// O(1) lookup by tool id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TOOL_MAP = new Map<string, ToolDefinition<any>>(
  TOOL_REGISTRY.map((t) => [t.id, t])
);

// ---------------------------------------------------------------------------
// Lookup helpers — replace the old getShapeConfig() function
// ---------------------------------------------------------------------------

export interface ShapeUIConfig {
  optionsBar: OptionsBarField[];
  propertiesPanel: PropertiesPanelField[];
  contextMenu: ContextMenuAction[];
}

/**
 * Find the tool definition that owns a given element.
 * Checks ownsElementType first (booth, label, icon), then ownsGeometry.
 */
export function findToolForElement(
  geometryShape: string,
  elementType?: string
): ToolDefinition | undefined {
  if (elementType) {
    const byType = TOOL_REGISTRY.find((t) => t.ownsElementType === elementType);
    if (byType) return byType;
  }
  return TOOL_REGISTRY.find((t) => t.ownsGeometry?.includes(geometryShape));
}

/**
 * Get UI config (options bar, properties panel, context menu) for an element.
 * Replacement for the old getShapeConfig().
 */
export function getToolUIConfig(
  geometryShape: string,
  elementType?: string
): ShapeUIConfig {
  const tool = findToolForElement(geometryShape, elementType);
  if (tool) {
    return {
      optionsBar: tool.optionsBar,
      propertiesPanel: tool.propertiesPanel,
      contextMenu: tool.contextMenu,
    };
  }
  // Fallback for unknown elements — minimal config
  return {
    optionsBar: [],
    propertiesPanel: ["name"],
    contextMenu: ["delete"],
  };
}
