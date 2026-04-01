import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { PiPath } from "react-icons/pi";
import type { FloorPlanData } from "../types";
import type { Exhibitor, ViewerMode } from "./types";
import { useSearch } from "./hooks/useSearch";
import { useDirections } from "./hooks/useDirections";
import { ViewerCanvas } from "./components/ViewerCanvas";
import { SearchBar } from "./components/SearchBar";
import { ExhibitorList } from "./components/ExhibitorList";
import { ExhibitorSheet } from "./components/ExhibitorSheet";
import { BoothPopover } from "./components/BoothPopover";
import { DirectionsPanel } from "./components/DirectionsPanel";

interface MapViewerProps {
  data: FloorPlanData;
  exhibitors: Exhibitor[];
  mode?: ViewerMode;
}

const MOBILE_BREAKPOINT = 640;

export function MapViewer({ data, exhibitors, mode = "attendee" }: MapViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedBoothCode, setSelectedBoothCode] = useState<string | null>(null);
  const [popover, setPopover] = useState<{ boothCode: string; x: number; y: number } | null>(null);

  const { query, setQuery, results, matchedBoothCodes, isSearching } = useSearch(
    data.elements,
    exhibitors
  );

  const directions = useDirections(data, exhibitors);

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

  const occupiedBoothCodes = useMemo(
    () => new Set(exhibitors.map((ex) => ex.boothCode)),
    [exhibitors]
  );

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

  const handleDirectionsStart = useCallback(
    (result: unknown) => {
      if (!result) {
        directions.setStartLocation(null);
        return;
      }
      directions.setStartLocation(
        directions.locationFromResult(result as Parameters<typeof directions.locationFromResult>[0])
      );
    },
    [directions]
  );

  const handleDirectionsEnd = useCallback(
    (result: unknown) => {
      if (!result) {
        directions.setEndLocation(null);
        return;
      }
      directions.setEndLocation(
        directions.locationFromResult(result as Parameters<typeof directions.locationFromResult>[0])
      );
    },
    [directions]
  );

  const handleGetDirections = useCallback(
    (boothCode: string) => {
      directions.navigateTo(boothCode);
      setPopover(null);
    },
    [directions]
  );

  const showDirectionsButton = mode === "attendee" && directions.hasGrid && !directions.active;

  return (
    <div ref={containerRef} className="flex flex-col h-full relative">
      <div className="flex items-center gap-0 bg-white">
        <div className="flex-1 min-w-0">
          <SearchBar
            query={query}
            results={results}
            onQueryChange={setQuery}
            onResultSelect={handleResultSelect}
          />
        </div>
        {showDirectionsButton && (
          <button
            onClick={directions.open}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors shrink-0 border-l border-gray-200"
          >
            <PiPath size={16} />
            <span className="hidden sm:inline">Directions</span>
          </button>
        )}
      </div>
      <div className="flex flex-1 overflow-hidden relative">
        <ViewerCanvas
          data={data}
          mode={mode}
          occupiedBoothCodes={occupiedBoothCodes}
          highlightedBoothCode={selectedBoothCode}
          searchMatchCodes={isSearching ? matchedBoothCodes : null}
          routePath={directions.routePath}
          onBoothClick={handleBoothClick}
        />
        {!isMobile && directions.active && (
          <div className="w-64 shrink-0 bg-white border-l border-gray-200 flex flex-col">
            <DirectionsPanel
              startLocation={directions.startLocation}
              endLocation={directions.endLocation}
              routeStatus={directions.routeStatus}
              onSearch={directions.searchLocations}
              onSelectStart={handleDirectionsStart}
              onSelectEnd={handleDirectionsEnd}
              onSwap={directions.swap}
              onClose={directions.close}
            />
          </div>
        )}
        {!isMobile && !directions.active && (
          <ExhibitorList
            exhibitors={exhibitors}
            selectedId={selectedExhibitor?.id ?? null}
            onSelect={handleExhibitorSelect}
          />
        )}
        {isMobile && !directions.active && (
          <ExhibitorSheet
            exhibitors={exhibitors}
            selectedId={selectedExhibitor?.id ?? null}
            onSelect={handleExhibitorSelect}
          />
        )}
        {isMobile && directions.active && (
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-50">
            <DirectionsPanel
              startLocation={directions.startLocation}
              endLocation={directions.endLocation}
              routeStatus={directions.routeStatus}
              onSearch={directions.searchLocations}
              onSelectStart={handleDirectionsStart}
              onSelectEnd={handleDirectionsEnd}
              onSwap={directions.swap}
              onClose={directions.close}
            />
          </div>
        )}
        {popover && !isMobile && (
          <BoothPopover
            boothCode={popover.boothCode}
            exhibitor={exhibitorsByBooth.get(popover.boothCode) ?? null}
            x={popover.x}
            y={popover.y}
            onClose={handlePopoverClose}
            onGetDirections={
              mode === "attendee" && directions.hasGrid
                ? handleGetDirections
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
