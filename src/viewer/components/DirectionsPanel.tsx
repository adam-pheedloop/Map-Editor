import { useState, useRef } from "react";
import { PiMagnifyingGlass, PiX, PiArrowsDownUp } from "react-icons/pi";
import type { SearchResult } from "../hooks/useSearch";
import type { DirectionsLocation, RouteStatus } from "../hooks/useDirections";

interface DirectionsPanelProps {
  startLocation: DirectionsLocation | null;
  endLocation: DirectionsLocation | null;
  routeStatus: RouteStatus;
  onSearch: (query: string) => SearchResult[];
  onSelectStart: (result: SearchResult) => void;
  onSelectEnd: (result: SearchResult) => void;
  onSwap: () => void;
  onClose: () => void;
}

function LocationField({
  label,
  placeholder,
  value,
  onSearch,
  onSelect,
  onClear,
}: {
  label: string;
  placeholder: string;
  value: DirectionsLocation | null;
  onSearch: (query: string) => SearchResult[];
  onSelect: (result: SearchResult) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = focused ? onSearch(query) : [];
  const showDropdown = focused && query.trim().length > 0;

  if (value) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-[10px] font-semibold text-gray-400 uppercase w-8 shrink-0">
          {label}
        </span>
        <span className="flex-1 text-xs font-medium text-gray-800 truncate">
          {value.label}
        </span>
        <button
          onClick={() => {
            onClear();
            setQuery("");
          }}
          className="text-gray-400 hover:text-gray-600 cursor-pointer shrink-0"
        >
          <PiX size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 focus-within:border-blue-400">
        <span className="text-[10px] font-semibold text-gray-400 uppercase w-8 shrink-0">
          {label}
        </span>
        <PiMagnifyingGlass size={12} className="text-gray-300 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={placeholder}
          className="flex-1 text-xs text-gray-800 placeholder:text-gray-400 outline-none bg-transparent"
        />
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-44 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-3 py-2 text-xs text-gray-400">No results</div>
          ) : (
            results.map((result) => (
              <button
                key={result.boothCode}
                onClick={() => {
                  onSelect(result);
                  setQuery("");
                  inputRef.current?.blur();
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-800">
                    {result.exhibitorName || result.boothName || "Booth"}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {result.boothCode}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function DirectionsPanel({
  startLocation,
  endLocation,
  routeStatus,
  onSearch,
  onSelectStart,
  onSelectEnd,
  onSwap,
  onClose,
}: DirectionsPanelProps) {
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700">Directions</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <PiX size={16} />
        </button>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <LocationField
            label="From"
            placeholder="Where are you?"
            value={startLocation}
            onSearch={onSearch}
            onSelect={onSelectStart}
            onClear={() => onSelectStart(null as unknown as SearchResult)}
          />
          <LocationField
            label="To"
            placeholder="Where do you want to go?"
            value={endLocation}
            onSearch={onSearch}
            onSelect={onSelectEnd}
            onClear={() => onSelectEnd(null as unknown as SearchResult)}
          />
        </div>

        <button
          onClick={onSwap}
          className="self-center p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer shrink-0"
          title="Swap start and end"
        >
          <PiArrowsDownUp size={16} />
        </button>
      </div>

      {routeStatus === "no-route" && (
        <div className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
          No route available — the walkable areas may not be fully connected.
        </div>
      )}
      {routeStatus === "same-location" && (
        <div className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          You&apos;re already there!
        </div>
      )}
    </div>
  );
}
