import { useState } from "react";
import type { FloorPlanElement, ElementProperties, Geometry } from "../../../types";
import { getShapeConfig } from "../canvas/elements";
import type { PropertiesPanelField } from "../canvas/elements";
import { SectionLabel, FieldRow, NumberInput } from "../ui";
import { JsonDebugView } from "../debug";

interface PropertiesPanelProps {
  element: FloorPlanElement | null;
  debug: boolean;
  onUpdateProperties: (id: string, updates: Partial<ElementProperties>) => void;
  onUpdateGeometry: (id: string, updates: Partial<Geometry>) => void;
  onDelete: (id: string) => void;
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
  debug,
  onUpdateProperties,
  onUpdateGeometry,
  onDelete,
}: PropertiesPanelProps) {
  const [tab, setTab] = useState<"properties" | "debug">("properties");

  if (!element) {
    return (
      <div className="w-60 border-l border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-400">No selection</p>
      </div>
    );
  }

  const geo = element.geometry;
  const config = getShapeConfig(geo.shape);
  const fields = new Set<PropertiesPanelField>(config.propertiesPanel);
  const dims = getDimensions(element);

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
    <div className="w-60 border-l border-gray-200 bg-white flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-600 capitalize">
          {geo.shape}
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

      <div className="p-3 border-t border-gray-200">
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
