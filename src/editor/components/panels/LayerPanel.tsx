import { useState, useRef, useEffect } from "react";
import { PiStack, PiEye, PiEyeSlash } from "react-icons/pi";
import type { LayerDefinition, LayerId } from "../../../types";

interface LayerPanelProps {
  layers: LayerDefinition[];
  activeLayerId: LayerId;
  onSetActiveLayer: (id: LayerId) => void;
  onToggleVisibility: (id: LayerId) => void;
}

const LAYER_COLORS: Record<LayerId, string> = {
  background: "#9ca3af",
  content: "#007bff",
  pathing: "#f59e0b",
  markup: "#10b981",
};

export function LayerPanel({
  layers,
  activeLayerId,
  onSetActiveLayer,
  onToggleVisibility,
}: LayerPanelProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const activeLayer = layers.find((l) => l.id === activeLayerId);

  return (
    <div ref={panelRef} className="absolute top-2 right-2 z-[9001]">
      <div className="flex items-center gap-1.5">
        {activeLayer && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded-lg shadow-md text-xs text-gray-600">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: LAYER_COLORS[activeLayer.id] }}
            />
            {activeLayer.name}
          </div>
        )}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`flex items-center justify-center w-9 h-9 rounded-lg shadow-md border transition-colors ${
            open
              ? "bg-primary-600 text-white border-primary-600"
              : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700"
          }`}
          title="Layers"
        >
          <PiStack size={18} />
        </button>
      </div>

      {open && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-[180px]">
          {layers.map((layer) => {
            const isActive = layer.id === activeLayerId;
            return (
              <div
                key={layer.id}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs cursor-pointer transition-colors ${
                  isActive ? "bg-gray-100 font-semibold text-gray-800" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => onSetActiveLayer(layer.id)}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: LAYER_COLORS[layer.id] }}
                />
                <span className="flex-1">{layer.name}</span>
                <button
                  className="p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(layer.id);
                  }}
                  title={layer.visible ? "Hide layer" : "Show layer"}
                >
                  {layer.visible ? <PiEye size={14} /> : <PiEyeSlash size={14} />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
