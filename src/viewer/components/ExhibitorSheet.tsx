import { useState, useMemo } from "react";
import { PiCaretUp, PiCaretDown } from "react-icons/pi";
import type { Exhibitor } from "../types";

interface ExhibitorSheetProps {
  exhibitors: Exhibitor[];
  selectedId: string | null;
  onSelect: (exhibitor: Exhibitor) => void;
}

export function ExhibitorSheet({ exhibitors, selectedId, onSelect }: ExhibitorSheetProps) {
  const [expanded, setExpanded] = useState(false);
  const sorted = useMemo(
    () => [...exhibitors].sort((a, b) => a.name.localeCompare(b.name)),
    [exhibitors]
  );

  return (
    <div
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 z-50"
      style={{ maxHeight: expanded ? "60%" : 48 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-4 py-3 cursor-pointer"
      >
        <span className="text-xs font-medium text-gray-600">
          Exhibitors ({exhibitors.length})
        </span>
        {expanded ? (
          <PiCaretDown size={14} className="text-gray-400" />
        ) : (
          <PiCaretUp size={14} className="text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="overflow-y-auto" style={{ maxHeight: "calc(60vh - 48px)" }}>
          {sorted.map((exhibitor) => (
            <button
              key={exhibitor.id}
              onClick={() => onSelect(exhibitor)}
              className={`w-full text-left px-4 py-2.5 border-t border-gray-100 cursor-pointer transition-colors ${
                selectedId === exhibitor.id
                  ? "bg-primary-100"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                {exhibitor.logo && (
                  <img src={exhibitor.logo} alt="" className="w-7 h-7 rounded shrink-0" />
                )}
                <div>
                  <div className="text-xs font-medium text-gray-800">
                    {exhibitor.name}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Booth {exhibitor.boothCode}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
