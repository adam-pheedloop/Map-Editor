import { useState, useCallback } from "react";
import type { FloorPlanData } from "../types";
import type { Exhibitor } from "./types";
import { ViewerCanvas } from "./components/ViewerCanvas";
import { ExhibitorList } from "./components/ExhibitorList";

interface MapViewerProps {
  data: FloorPlanData;
  exhibitors: Exhibitor[];
}

export function MapViewer({ data, exhibitors }: MapViewerProps) {
  const [selectedExhibitor, setSelectedExhibitor] = useState<Exhibitor | null>(null);

  const handleExhibitorSelect = useCallback((exhibitor: Exhibitor) => {
    setSelectedExhibitor((prev) =>
      prev?.id === exhibitor.id ? null : exhibitor
    );
  }, []);

  const highlightedBoothCode = selectedExhibitor?.boothCode ?? null;

  return (
    <div className="flex h-full">
      <ViewerCanvas data={data} highlightedBoothCode={highlightedBoothCode} />
      <ExhibitorList
        exhibitors={exhibitors}
        selectedId={selectedExhibitor?.id ?? null}
        onSelect={handleExhibitorSelect}
      />
    </div>
  );
}
