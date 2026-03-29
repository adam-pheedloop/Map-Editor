export type OptionsBarField = "fill" | "stroke" | "strokeWidth";
export type PropertiesPanelField = "name" | "width" | "height" | "length" | "rotation" | "boothCode" | "area";
export type ContextMenuAction = "delete" | "convertToBooth";

export interface ShapeConfig {
  optionsBar: OptionsBarField[];
  propertiesPanel: PropertiesPanelField[];
  contextMenu: ContextMenuAction[];
}
