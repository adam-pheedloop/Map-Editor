import { useState } from "react";
import type { FloorPlanElement, ElementProperties, Geometry, BackgroundImage, LayerId } from "../../../types";
import { getShapeConfig } from "../canvas/elements";
import type { PropertiesPanelField } from "../canvas/elements";
import { SectionLabel, FieldRow, NumberInput, ColorSwatch } from "../ui";
import { JsonDebugView } from "../debug";

interface PropertiesPanelProps {
  element: FloorPlanElement | null;
  selectedCount: number;
  backgroundImage?: BackgroundImage;
  backgroundColor?: string;
  activeLayerId: LayerId;
  debug: boolean;
  onUpdateProperties: (id: string, updates: Partial<ElementProperties>) => void;
  onUpdateGeometry: (id: string, updates: Partial<Geometry>) => void;
  onDelete: (id: string) => void;
  onConvertToBooth?: (id: string) => void;
  onBackgroundOpacityChange?: (opacity: number) => void;
  onRemoveBackground?: () => void;
  onUploadBackground?: () => void;
  onBackgroundColorChange?: (color: string) => void;
}

function getDimensions(element: FloorPlanElement): { width: number; height: number; length: number } {
  const geo = element.geometry;
  if (geo.shape === "rect") return { width: geo.width, height: geo.height, length: 0 };
  if (geo.shape === "ellipse") return { width: geo.radiusX * 2, height: geo.radiusY * 2, length: 0 };
  if (geo.shape === "line") {
    const [x1, y1, x2, y2] = geo.points;
    const dx = x2 - x1;
    const dy = y2 - y1;
    return { width: 0, height: 0, length: Math.round(Math.sqrt(dx * dx + dy * dy)) };
  }
  return { width: 0, height: 0, length: 0 };
}

export function PropertiesPanel({
  element,
  selectedCount,
  backgroundImage,
  backgroundColor,
  activeLayerId,
  debug,
  onUpdateProperties,
  onUpdateGeometry,
  onDelete,
  onConvertToBooth,
  onBackgroundOpacityChange,
  onRemoveBackground,
  onUploadBackground,
  onBackgroundColorChange,
}: PropertiesPanelProps) {
  const [tab, setTab] = useState<"properties" | "debug">("properties");

  if (!element && selectedCount > 1) {
    return (
      <div className="w-60 shrink-0 border-l border-gray-200 bg-white flex flex-col">
        <div className="px-3 py-2 border-b border-gray-200">
          <span className="text-xs font-medium text-gray-600">
            {selectedCount} elements selected
          </span>
        </div>
        <div className="flex-1 p-3">
          <p className="text-xs text-gray-400">
            Use the options bar to change shared properties.
          </p>
        </div>
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => onDelete("")}
            className="w-full px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer transition-colors"
          >
            Delete All ({selectedCount})
          </button>
        </div>
      </div>
    );
  }

  if (!element) {
    if (activeLayerId === "background") {
      return (
        <div className="w-60 shrink-0 border-l border-gray-200 bg-white flex flex-col">
          <div className="px-3 py-2 border-b border-gray-200">
            <span className="text-xs font-medium text-gray-600">Background</span>
          </div>
          <div className="flex flex-col gap-4 p-3 overflow-y-auto flex-1">
            <div className="flex flex-col gap-1.5">
              <SectionLabel>Background Color</SectionLabel>
              <ColorSwatch
                label=""
                value={backgroundColor ?? "#ffffff"}
                onChange={(c) => onBackgroundColorChange?.(c)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <SectionLabel>Background Image</SectionLabel>
              {backgroundImage ? (
                <div className="flex flex-col gap-2">
                  <div
                    className="w-full h-20 rounded border border-gray-200 bg-gray-50"
                    style={{
                      backgroundImage: `url(${backgroundImage.url})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">Opacity</span>
                      <span className="text-[11px] text-gray-400">
                        {Math.round(backgroundImage.opacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(backgroundImage.opacity * 100)}
                      onChange={(e) =>
                        onBackgroundOpacityChange?.(Number(e.target.value) / 100)
                      }
                      className="w-full accent-primary-600"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={onUploadBackground}
                      className="flex-1 text-xs text-gray-600 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      Replace
                    </button>
                    <button
                      onClick={onRemoveBackground}
                      className="flex-1 text-xs text-red-600 border border-red-200 rounded px-2 py-1 hover:bg-red-50 cursor-pointer transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onUploadBackground}
                  className="w-full text-xs text-gray-600 border border-gray-200 border-dashed rounded px-2 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  Upload Image
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-60 shrink-0 border-l border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-400">No Items Selected</p>
      </div>
    );
  }

  const geo = element.geometry;
  const config = getShapeConfig(geo.shape, element.type);
  const fields = new Set<PropertiesPanelField>(config.propertiesPanel);
  const dims = getDimensions(element);
  const canConvertToBooth = element.type === "shape" && geo.shape === "rect";

  const handleWidthChange = (w: number) => {
    if (w <= 0) return;
    if (geo.shape === "rect") {
      onUpdateGeometry(element.id, { width: w });
    } else if (geo.shape === "ellipse") {
      onUpdateGeometry(element.id, { radiusX: w / 2 });
    }
  };

  const handleHeightChange = (h: number) => {
    if (h <= 0) return;
    if (geo.shape === "rect") {
      onUpdateGeometry(element.id, { height: h });
    } else if (geo.shape === "ellipse") {
      onUpdateGeometry(element.id, { radiusY: h / 2 });
    }
  };

  return (
    <div className="w-60 shrink-0 border-l border-gray-200 bg-white flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-600 capitalize">
          {element.type === "shape" ? geo.shape : element.type}
        </span>
        {debug && (
          <div className="flex text-[10px]">
            <button
              onClick={() => setTab("properties")}
              className={`px-1.5 py-0.5 rounded-l border cursor-pointer ${
                tab === "properties"
                  ? "bg-gray-700 text-white border-gray-700"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              Props
            </button>
            <button
              onClick={() => setTab("debug")}
              className={`px-1.5 py-0.5 rounded-r border border-l-0 cursor-pointer ${
                tab === "debug"
                  ? "bg-gray-700 text-white border-gray-700"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              Debug
            </button>
          </div>
        )}
      </div>

      {tab === "debug" && debug ? (
        <div className="flex-1 overflow-auto p-2">
          <JsonDebugView data={element} />
        </div>
      ) : (
      <div className="flex flex-col gap-4 p-3 overflow-y-auto flex-1">
        {fields.has("name") && (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>Name</SectionLabel>
            <input
              type="text"
              value={element.properties.name || ""}
              onChange={(e) =>
                onUpdateProperties(element.id, { name: e.target.value })
              }
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded bg-white"
            />
          </div>
        )}

        {fields.has("boothCode") && (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>Booth Code</SectionLabel>
            <input
              type="text"
              value={element.properties.boothCode || ""}
              placeholder="e.g. A101"
              onChange={(e) =>
                onUpdateProperties(element.id, { boothCode: e.target.value || undefined })
              }
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded bg-white"
            />
          </div>
        )}

        {fields.has("text") && (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>Text</SectionLabel>
            <textarea
              value={element.properties.text || ""}
              onChange={(e) =>
                onUpdateProperties(element.id, { text: e.target.value })
              }
              rows={2}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded bg-white resize-none"
            />
          </div>
        )}

        {fields.has("fontSize") && (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>Font Size</SectionLabel>
            <NumberInput
              value={element.properties.fontSize ?? 16}
              onChange={(v) => onUpdateProperties(element.id, { fontSize: Math.max(1, v) })}
            />
          </div>
        )}

        {(fields.has("fontWeight") || fields.has("fontStyle") || fields.has("textDecoration")) && (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>Style</SectionLabel>
            <div className="flex gap-1">
              {fields.has("fontWeight") && (
                <button
                  onClick={() =>
                    onUpdateProperties(element.id, {
                      fontWeight: element.properties.fontWeight === "bold" ? "normal" : "bold",
                    })
                  }
                  className={`w-8 h-8 text-xs font-bold border rounded cursor-pointer transition-colors ${
                    element.properties.fontWeight === "bold"
                      ? "bg-gray-700 text-white border-gray-700"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  B
                </button>
              )}
              {fields.has("fontStyle") && (
                <button
                  onClick={() =>
                    onUpdateProperties(element.id, {
                      fontStyle: element.properties.fontStyle === "italic" ? "normal" : "italic",
                    })
                  }
                  className={`w-8 h-8 text-xs italic border rounded cursor-pointer transition-colors ${
                    element.properties.fontStyle === "italic"
                      ? "bg-gray-700 text-white border-gray-700"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  I
                </button>
              )}
              {fields.has("textDecoration") && (
                <button
                  onClick={() =>
                    onUpdateProperties(element.id, {
                      textDecoration: element.properties.textDecoration === "underline" ? "none" : "underline",
                    })
                  }
                  className={`w-8 h-8 text-xs underline border rounded cursor-pointer transition-colors ${
                    element.properties.textDecoration === "underline"
                      ? "bg-gray-700 text-white border-gray-700"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  U
                </button>
              )}
            </div>
          </div>
        )}

        {fields.has("textAlign") && (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>Alignment</SectionLabel>
            <div className="flex text-xs">
              {(["left", "center", "right"] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => onUpdateProperties(element.id, { textAlign: align })}
                  className={`flex-1 py-1 border cursor-pointer transition-colors capitalize ${
                    (element.properties.textAlign ?? "left") === align
                      ? "bg-gray-700 text-white border-gray-700"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  } ${align === "left" ? "rounded-l" : align === "right" ? "rounded-r" : "border-l-0 border-r-0"}`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        )}

        {(fields.has("width") || fields.has("height")) && (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>Size</SectionLabel>
            {fields.has("width") && (
              <FieldRow label="W">
                <NumberInput value={dims.width} onChange={handleWidthChange} />
              </FieldRow>
            )}
            {fields.has("height") && (
              <FieldRow label="H">
                <NumberInput value={dims.height} onChange={handleHeightChange} />
              </FieldRow>
            )}
          </div>
        )}

        {fields.has("rotation") && (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>Rotation</SectionLabel>
            <FieldRow label="°">
              <NumberInput
                value={"rotation" in geo ? (geo.rotation ?? 0) : 0}
                onChange={(r) => onUpdateGeometry(element.id, { rotation: r })}
              />
            </FieldRow>
          </div>
        )}

        {fields.has("area") && (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>Area</SectionLabel>
            <FieldRow label="sq">
              <NumberInput value={dims.width * dims.height} onChange={() => {}} disabled />
            </FieldRow>
          </div>
        )}

        {fields.has("length") && (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>Length</SectionLabel>
            <FieldRow label="L">
              <NumberInput value={dims.length} onChange={() => {}} disabled />
            </FieldRow>
          </div>
        )}

      </div>
      )}

      <div className="flex flex-col gap-2 p-3 border-t border-gray-200">
        {canConvertToBooth && (
          <button
            onClick={() => onConvertToBooth?.(element.id)}
            className="w-full px-3 py-1.5 text-xs text-primary-600 border border-primary-200 rounded hover:bg-primary-100 cursor-pointer transition-colors"
          >
            Convert to Booth
          </button>
        )}
        <button
          onClick={() => onDelete(element.id)}
          className="w-full px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
