import { useState, useMemo } from "react";
import { Dialog, SectionLabel, NumberInput } from "../ui";
import type { FloorPlanElement } from "../../../types";
import { getElementBounds } from "../../utils/bounds";

interface CanvasResizeDialogProps {
  width: number;
  height: number;
  elements: FloorPlanElement[];
  onConfirm: (width: number, height: number, mode: "preserve" | "scale") => void;
  onClose: () => void;
}

export function CanvasResizeDialog({
  width,
  height,
  elements,
  onConfirm,
  onClose,
}: CanvasResizeDialogProps) {
  const [newWidth, setNewWidth] = useState(width);
  const [newHeight, setNewHeight] = useState(height);
  const [mode, setMode] = useState<"preserve" | "scale">("preserve");

  const clippedCount = useMemo(() => {
    if (newWidth >= width && newHeight >= height) return 0;
    return elements.filter((el) => {
      const b = getElementBounds(el);
      return b.right > newWidth || b.bottom > newHeight;
    }).length;
  }, [elements, newWidth, newHeight, width, height]);

  return (
    <Dialog
      title="Canvas Size"
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(newWidth, newHeight, mode);
              onClose();
            }}
            className="px-3 py-1.5 text-xs text-white bg-primary-600 rounded hover:bg-primary-700 cursor-pointer transition-colors"
          >
            Apply
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1.5">
          <SectionLabel>Width (px)</SectionLabel>
          <NumberInput
            value={newWidth}
            onChange={(v) => setNewWidth(Math.max(100, v))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <SectionLabel>Height (px)</SectionLabel>
          <NumberInput
            value={newHeight}
            onChange={(v) => setNewHeight(Math.max(100, v))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <SectionLabel>Elements</SectionLabel>
          <div className="flex gap-2">
            <button
              onClick={() => setMode("preserve")}
              className={`flex-1 px-2 py-1.5 text-xs border rounded cursor-pointer transition-colors ${
                mode === "preserve"
                  ? "bg-gray-700 text-white border-gray-700"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Keep positions
            </button>
            <button
              onClick={() => setMode("scale")}
              className={`flex-1 px-2 py-1.5 text-xs border rounded cursor-pointer transition-colors ${
                mode === "scale"
                  ? "bg-gray-700 text-white border-gray-700"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Scale to fit
            </button>
          </div>
        </div>

        {clippedCount > 0 && mode === "preserve" && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
            {clippedCount} element{clippedCount > 1 ? "s" : ""} will be outside the new canvas bounds.
          </p>
        )}
      </div>
    </Dialog>
  );
}
