import { useState } from "react";
import { Button, Dialog } from "../ui";
import type { FloorPlanData } from "../../../types";
import { JsonDebugView } from "./JsonDebugView";

interface MapDebugDialogProps {
  data: FloorPlanData;
  onClose: () => void;
}

export function MapDebugDialog({ data, onClose }: MapDebugDialogProps) {
  const [tab, setTab] = useState<"tree" | "raw">("tree");

  const tabs = (
    <div className="flex">
      <Button variant="outline" color="neutral" active={tab === "tree"} className="px-2 py-1 rounded-r-none" onClick={() => setTab("tree")}>Tree</Button>
      <Button variant="outline" color="neutral" active={tab === "raw"} className="px-2 py-1 rounded-l-none border-l-0" onClick={() => setTab("raw")}>JSON</Button>
    </div>
  );

  return (
    <Dialog
      title="Map Debug"
      onClose={onClose}
      width="640px"
      maxHeight="80vh"
      headerActions={tabs}
      footer={
        <Button variant="ghost" color="primary" className="px-0" onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}>
          Copy to clipboard
        </Button>
      }
    >
      <div className="flex-1 overflow-auto p-4">
        {tab === "tree" ? (
          <JsonDebugView data={data} label="FloorPlanData" />
        ) : (
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </Dialog>
  );
}
