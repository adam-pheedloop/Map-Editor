import { useRef, useState } from "react";
import { PiMagnifyingGlass, PiX } from "react-icons/pi";
import type { SearchResult } from "../hooks/useSearch";

interface SearchBarProps {
  query: string;
  results: SearchResult[];
  onQueryChange: (query: string) => void;
  onResultSelect: (boothCode: string) => void;
}

export function SearchBar({ query, results, onQueryChange, onResultSelect }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const showDropdown = focused && query.trim().length > 0;

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-gray-200">
        <PiMagnifyingGlass size={16} className="text-gray-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            // Delay to allow dropdown click to register
            setTimeout(() => setFocused(false), 150);
          }}
          placeholder="Search booths or exhibitors..."
          className="flex-1 text-sm text-gray-800 placeholder:text-gray-400 outline-none bg-transparent"
        />
        {query && (
          <button
            onClick={() => {
              onQueryChange("");
              inputRef.current?.focus();
            }}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <PiX size={14} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 border-t-0 rounded-b-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-3 py-3 text-xs text-gray-400">
              No results found
            </div>
          ) : (
            results.map((result) => (
              <button
                key={result.boothCode}
                onClick={() => {
                  onResultSelect(result.boothCode);
                  onQueryChange("");
                  inputRef.current?.blur();
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-800">
                    {result.exhibitorName || result.boothName || "Booth"}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {result.boothCode}
                  </span>
                </div>
                {result.exhibitorName && result.boothName && (
                  <div className="text-[11px] text-gray-400">
                    {result.boothName}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
