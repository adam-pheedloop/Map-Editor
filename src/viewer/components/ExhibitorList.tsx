import { useMemo } from "react";
import type { Exhibitor } from "../types";

interface ExhibitorListProps {
  exhibitors: Exhibitor[];
  selectedId: string | null;
  onSelect: (exhibitor: Exhibitor) => void;
}

export function ExhibitorList({ exhibitors, selectedId, onSelect }: ExhibitorListProps) {
  const sorted = useMemo(
    () => [...exhibitors].sort((a, b) => a.name.localeCompare(b.name)),
    [exhibitors]
  );

  return (
    <div className="w-64 shrink-0 bg-white border-l border-gray-200 flex flex-col">
      <div className="px-3 py-2 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-600">
          Exhibitors ({exhibitors.length})
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sorted.map((exhibitor) => (
          <button
            key={exhibitor.id}
            onClick={() => onSelect(exhibitor)}
            className={`w-full text-left px-3 py-2 border-b border-gray-100 cursor-pointer transition-colors ${
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
    </div>
  );
}
