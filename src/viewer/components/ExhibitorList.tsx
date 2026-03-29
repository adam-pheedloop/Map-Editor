import type { Exhibitor } from "../types";

interface ExhibitorListProps {
  exhibitors: Exhibitor[];
  selectedId: string | null;
  onSelect: (exhibitor: Exhibitor) => void;
}

export function ExhibitorList({ exhibitors, selectedId, onSelect }: ExhibitorListProps) {
  return (
    <div className="w-64 shrink-0 bg-white border-l border-gray-200 flex flex-col">
      <div className="px-3 py-2 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-600">
          Exhibitors ({exhibitors.length})
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {exhibitors.map((exhibitor) => (
          <button
            key={exhibitor.id}
            onClick={() => onSelect(exhibitor)}
            className={`w-full text-left px-3 py-2 border-b border-gray-100 cursor-pointer transition-colors ${
              selectedId === exhibitor.id
                ? "bg-primary-100"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="text-xs font-medium text-gray-800">
              {exhibitor.name}
            </div>
            <div className="text-[11px] text-gray-400">
              Booth {exhibitor.boothCode}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
