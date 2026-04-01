import { useState } from "react";
import { Button, Dialog, Slider, SectionLabel, NumberInput, ColorSwatch } from "../ui";

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
          <Button variant="outline" color="neutral" onClick={onClose}>Cancel</Button>
          <Button variant="solid" color="primary" onClick={() => { onSave(local); onClose(); }}>Apply</Button>
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
            <Slider
              min={5}
              max={100}
              value={Math.round(local.gridOpacity * 100)}
              onChange={(e) => setLocal((s) => ({ ...s, gridOpacity: Number(e.target.value) / 100 }))}
              className="flex-1"
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
