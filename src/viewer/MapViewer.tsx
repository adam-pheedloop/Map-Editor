import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type { FloorPlanData } from "../types";
import type { Exhibitor } from "./types";
import { ViewerCanvas } from "./components/ViewerCanvas";
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

  // Track container width for responsive layout
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

  const handlePopoverClose = useCallback(() => {
    setPopover(null);
    setSelectedBoothCode(null);
  }, []);

  return (
    <div ref={containerRef} className="flex h-full relative">
      <ViewerCanvas
        data={data}
        highlightedBoothCode={selectedBoothCode}
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
  );
}
