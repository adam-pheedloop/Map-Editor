import type { FloorPlanData } from "../types";
import { ViewerCanvas } from "./components/ViewerCanvas";

interface MapViewerProps {
  data: FloorPlanData;
}

export function MapViewer({ data }: MapViewerProps) {
  return (
    <div className="flex flex-col h-full">
      <ViewerCanvas data={data} />
    </div>
  );
}
