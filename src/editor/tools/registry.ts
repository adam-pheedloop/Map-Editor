import type { ToolDefinition, OptionsBarField, PropertiesPanelField, ContextMenuAction } from "./types";

// Tools are added here as they are migrated (Steps 3-4).
// Order determines toolbar display order.
export const TOOL_REGISTRY: ToolDefinition[] = [];

// O(1) lookup by tool id
export const TOOL_MAP = new Map<string, ToolDefinition>(
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
