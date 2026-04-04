import { ColorSwatch, NumberInput } from "../ui";
import type { OptionsBarField } from "../canvas/elements/types";

export interface DrawingDefaults {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

interface OptionsBarProps {
  defaults: DrawingDefaults;
  config: { optionsBar: OptionsBarField[] };
  onDefaultsChange: (updates: Partial<DrawingDefaults>) => void;
}

export function OptionsBar({ defaults, config, onDefaultsChange }: OptionsBarProps) {
  const fields = new Set<OptionsBarField>(config.optionsBar);

  return (
    <div className="flex items-center gap-4 px-3 py-2 bg-white border-b border-gray-200">
      {fields.has("fill") && (
        <ColorSwatch
          label="Fill"
          value={defaults.fill}
          onChange={(fill) => onDefaultsChange({ fill })}
        />
      )}
      {fields.has("stroke") && (
        <ColorSwatch
          label="Stroke"
          value={defaults.stroke}
          onChange={(stroke) => onDefaultsChange({ stroke })}
        />
      )}
      {fields.has("strokeWidth") && (
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-500">Stroke</span>
          <div className="w-14">
            <NumberInput
              value={defaults.strokeWidth}
              onChange={(strokeWidth) => onDefaultsChange({ strokeWidth: Math.max(0, strokeWidth) })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
