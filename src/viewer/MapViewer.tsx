import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type { FloorPlanData } from "../types";
import type { Exhibitor } from "./types";
import { useSearch } from "./hooks/useSearch";
import { ViewerCanvas } from "./components/ViewerCanvas";
import { SearchBar } from "./components/SearchBar";
import { ExhibitorList } from "./components/ExhibitorList";
import { ExhibitorSheet } from "./components/ExhibitorSheet";
import { BoothPopover } from "./components/BoothPopover";

interface MapViewerProps {
  data: FloorPlanData;
  exhibitors: Exhibitor[];
}

const MOBILE_BREAKPOINT = 640;

export function MapViewer({ data, exhibitors }: MapViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedBoothCode, setSelectedBoothCode] = useState<string | null>(null);
  const [popover, setPopover] = useState<{ boothCode: string; x: number; y: number } | null>(null);

  const { query, setQuery, results, matchedBoothCodes, isSearching } = useSearch(
    data.elements,
    exhibitors
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setIsMobile(width < MOBILE_BREAKPOINT);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const exhibitorsByBooth = useMemo(() => {
    const map = new Map<string, Exhibitor>();
    for (const ex of exhibitors) {
      map.set(ex.boothCode, ex);
    }
    return map;
  }, [exhibitors]);

  const selectedExhibitor = selectedBoothCode
    ? exhibitorsByBooth.get(selectedBoothCode) ?? null
    : null;

  const handleExhibitorSelect = useCallback((exhibitor: Exhibitor) => {
    setSelectedBoothCode((prev) =>
      prev === exhibitor.boothCode ? null : exhibitor.boothCode
    );
    setPopover(null);
  }, []);

  const handleBoothClick = useCallback(
    (boothCode: string, screenX: number, screenY: number) => {
      setSelectedBoothCode((prev) => (prev === boothCode ? null : boothCode));
      setPopover((prev) =>
        prev?.boothCode === boothCode ? null : { boothCode, x: screenX, y: screenY }
      );
    },
    []
  );

  const handleResultSelect = useCallback((boothCode: string) => {
    setSelectedBoothCode(boothCode);
    setPopover(null);
  }, []);

  const handlePopoverClose = useCallback(() => {
    setPopover(null);
    setSelectedBoothCode(null);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col h-full relative">
      <SearchBar
        query={query}
        results={results}
        onQueryChange={setQuery}
        onResultSelect={handleResultSelect}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <ViewerCanvas
          data={data}
          highlightedBoothCode={selectedBoothCode}
          searchMatchCodes={isSearching ? matchedBoothCodes : null}
          onBoothClick={handleBoothClick}
        />
        {!isMobile && (
          <ExhibitorList
            exhibitors={exhibitors}
            selectedId={selectedExhibitor?.id ?? null}
            onSelect={handleExhibitorSelect}
          />
        )}
        {isMobile && (
          <ExhibitorSheet
            exhibitors={exhibitors}
            selectedId={selectedExhibitor?.id ?? null}
            onSelect={handleExhibitorSelect}
          />
        )}
        {popover && !isMobile && (
          <BoothPopover
            boothCode={popover.boothCode}
            exhibitor={exhibitorsByBooth.get(popover.boothCode) ?? null}
            x={popover.x}
            y={popover.y}
            onClose={handlePopoverClose}
          />
        )}
      </div>
    </div>
  );
}
