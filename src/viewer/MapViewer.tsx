import { useState, useCallback, useMemo } from "react";
import type { FloorPlanData } from "../types";
import type { Exhibitor } from "./types";
import { ViewerCanvas } from "./components/ViewerCanvas";
import { ExhibitorList } from "./components/ExhibitorList";
import { BoothPopover } from "./components/BoothPopover";

interface MapViewerProps {
  data: FloorPlanData;
  exhibitors: Exhibitor[];
}

export function MapViewer({ data, exhibitors }: MapViewerProps) {
  const [selectedBoothCode, setSelectedBoothCode] = useState<string | null>(null);
  const [popover, setPopover] = useState<{ boothCode: string; x: number; y: number } | null>(null);

  // Index exhibitors by booth code for fast lookup
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
    <div className="flex h-full">
      <ViewerCanvas
        data={data}
        highlightedBoothCode={selectedBoothCode}
        onBoothClick={handleBoothClick}
      />
      <ExhibitorList
        exhibitors={exhibitors}
        selectedId={selectedExhibitor?.id ?? null}
        onSelect={handleExhibitorSelect}
      />
      {popover && (
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
