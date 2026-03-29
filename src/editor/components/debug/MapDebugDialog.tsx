import { useState } from "react";
import type { FloorPlanData } from "../../../types";
import { JsonDebugView } from "./JsonDebugView";

interface MapDebugDialogProps {
  data: FloorPlanData;
  onClose: () => void;
}

export function MapDebugDialog({ data, onClose }: MapDebugDialogProps) {
  const [tab, setTab] = useState<"tree" | "raw">("tree");

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-[640px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800">Map Debug</h2>
          <div className="flex items-center gap-2">
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
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none cursor-pointer"
            >
              &times;
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {tab === "tree" ? (
            <JsonDebugView data={data} label="FloorPlanData" />
          ) : (
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
        <div className="px-4 py-2 border-t border-gray-200 text-right">
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            }}
            className="text-xs text-primary-600 hover:text-primary-700 cursor-pointer"
          >
            Copy to clipboard
          </button>
        </div>
      </div>
    </div>
  );
}
