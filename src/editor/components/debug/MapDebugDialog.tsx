import { useState } from "react";
import { Button, Dialog, TabBar } from "../ui";
import type { FloorPlanData } from "../../../types";
import { JsonDebugView } from "./JsonDebugView";

interface MapDebugDialogProps {
  data: FloorPlanData;
  onClose: () => void;
}

export function MapDebugDialog({ data, onClose }: MapDebugDialogProps) {
  const [tab, setTab] = useState<"tree" | "raw">("tree");

  const tabs = (
    <TabBar
      tabs={[{ id: "tree", label: "Tree" }, { id: "raw", label: "JSON" }]}
      value={tab}
      onChange={(id) => setTab(id as typeof tab)}
      itemClassName="px-2 py-1"
    />
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
