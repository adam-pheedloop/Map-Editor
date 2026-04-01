import { useState } from "react";
import { Dialog } from "../ui";
import type { FloorPlanData } from "../../../types";
import { JsonDebugView } from "./JsonDebugView";

interface MapDebugDialogProps {
  data: FloorPlanData;
  onClose: () => void;
}

export function MapDebugDialog({ data, onClose }: MapDebugDialogProps) {
  const [tab, setTab] = useState<"tree" | "raw">("tree");

  const tabs = (
    <div className="flex text-xs">
      <button
        onClick={() => setTab("tree")}
        className={`px-2 py-1 rounded-l border cursor-pointer ${
          tab === "tree"
            ? "bg-primary-600 text-white border-primary-600"
            : "bg-white text-gray-600 border-gray-200"
        }`}
      >
        Tree
      </button>
      <button
        onClick={() => setTab("raw")}
        className={`px-2 py-1 rounded-r border border-l-0 cursor-pointer ${
          tab === "raw"
            ? "bg-primary-600 text-white border-primary-600"
            : "bg-white text-gray-600 border-gray-200"
        }`}
      >
        JSON
      </button>
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
        <button
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
          }}
          className="text-xs text-primary-600 hover:text-primary-700 cursor-pointer"
        >
          Copy to clipboard
        </button>
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
