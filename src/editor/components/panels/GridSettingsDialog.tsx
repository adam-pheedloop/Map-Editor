import { useState } from "react";
import { Dialog, SectionLabel, NumberInput, ColorSwatch } from "../ui";

export interface GridSettings {
  showGrid: boolean;
  gridSpacing: number;
  snapToGrid: boolean;
  gridColor: string;
  gridOpacity: number;
}

interface GridSettingsDialogProps {
  settings: GridSettings;
  onSave: (settings: GridSettings) => void;
  onClose: () => void;
}

export function GridSettingsDialog({ settings, onSave, onClose }: GridSettingsDialogProps) {
  const [local, setLocal] = useState<GridSettings>({ ...settings });

  return (
    <Dialog
      title="Grid Settings"
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
              onSave(local);
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
          <SectionLabel>Spacing (px)</SectionLabel>
          <NumberInput
            value={local.gridSpacing}
            onChange={(v) => setLocal((s) => ({ ...s, gridSpacing: Math.max(5, v) }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <SectionLabel>Color</SectionLabel>
          <ColorSwatch
            label=""
            value={local.gridColor}
            onChange={(c) => setLocal((s) => ({ ...s, gridColor: c }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <SectionLabel>Opacity</SectionLabel>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={5}
              max={100}
              value={Math.round(local.gridOpacity * 100)}
              onChange={(e) =>
                setLocal((s) => ({ ...s, gridOpacity: Number(e.target.value) / 100 }))
              }
              className="flex-1 accent-primary-600"
            />
            <span className="text-xs text-gray-400 w-8 text-right">
              {Math.round(local.gridOpacity * 100)}%
            </span>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
