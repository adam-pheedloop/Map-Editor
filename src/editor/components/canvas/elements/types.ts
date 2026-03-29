export type OptionsBarField = "fill" | "stroke" | "strokeWidth";
export type PropertiesPanelField = "name" | "width" | "height" | "length" | "rotation";

export interface ShapeConfig {
  optionsBar: OptionsBarField[];
  propertiesPanel: PropertiesPanelField[];
}
