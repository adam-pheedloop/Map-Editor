import type { FloorPlanElement, ElementProperties, Geometry } from "../../types";

interface PropertiesPanelProps {
  element: FloorPlanElement | null;
  onUpdateProperties: (id: string, updates: Partial<ElementProperties>) => void;
  onUpdateGeometry: (id: string, updates: Partial<Geometry>) => void;
  onDelete: (id: string) => void;
}

function getDimensions(element: FloorPlanElement): { width: number; height: number } | null {
  const geo = element.geometry;
  if (geo.shape === "rect") return { width: geo.width, height: geo.height };
  if (geo.shape === "ellipse") return { width: geo.radiusX * 2, height: geo.radiusY * 2 };
  if (geo.shape === "line") {
    const [x1, y1, x2, y2] = geo.points;
    const dx = x2 - x1;
    const dy = y2 - y1;
    return { width: Math.round(Math.sqrt(dx * dx + dy * dy)), height: 0 };
  }
  return null;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
      {children}
    </span>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-10 shrink-0">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <input
      type="number"
      value={Math.round(value)}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
      className="w-full px-2 py-1 text-xs border border-gray-200 rounded bg-white disabled:bg-gray-50 disabled:text-gray-400"
    />
  );
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6 border border-gray-200 rounded cursor-pointer p-0"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded bg-white font-mono"
      />
    </div>
  );
}

export function PropertiesPanel({
  element,
  onUpdateProperties,
  onUpdateGeometry,
  onDelete,
}: PropertiesPanelProps) {
  if (!element) {
    return (
      <div className="w-60 border-l border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-400">No selection</p>
      </div>
    );
  }

  const dims = getDimensions(element);
  const geo = element.geometry;
  const isLine = geo.shape === "line";

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
      <div className="px-3 py-2 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-600 capitalize">
          {geo.shape}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-3 overflow-y-auto flex-1">
        {/* Name */}
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

        {/* Dimensions */}
        {dims && (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>{isLine ? "Length" : "Size"}</SectionLabel>
            {isLine ? (
              <FieldRow label="L">
                <NumberInput value={dims.width} onChange={() => {}} disabled />
              </FieldRow>
            ) : (
              <>
                <FieldRow label="W">
                  <NumberInput value={dims.width} onChange={handleWidthChange} />
                </FieldRow>
                <FieldRow label="H">
                  <NumberInput value={dims.height} onChange={handleHeightChange} />
                </FieldRow>
              </>
            )}
          </div>
        )}

        {/* Fill */}
        {!isLine && (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>Fill</SectionLabel>
            <ColorInput
              value={element.properties.color}
              onChange={(c) => onUpdateProperties(element.id, { color: c })}
            />
          </div>
        )}

        {/* Stroke */}
        <div className="flex flex-col gap-1.5">
          <SectionLabel>{isLine ? "Color" : "Stroke"}</SectionLabel>
          <ColorInput
            value={isLine ? element.properties.color : (element.properties.strokeColor || "#888888")}
            onChange={(c) =>
              isLine
                ? onUpdateProperties(element.id, { color: c })
                : onUpdateProperties(element.id, { strokeColor: c })
            }
          />
        </div>
      </div>

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
