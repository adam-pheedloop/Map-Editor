import { Button, ColorSwatch, NumberInput } from "../ui";
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
  onGroup?: () => void;
  onUngroup?: () => void;
  onEnterGroup?: () => void;
  onExitGroup?: () => void;
}

export function OptionsBar({
  defaults,
  config,
  onDefaultsChange,
  onGroup,
  onUngroup,
  onEnterGroup,
  onExitGroup,
}: OptionsBarProps) {
  const fields = new Set<OptionsBarField>(config.optionsBar);
  const groupActions = [onGroup, onUngroup, onEnterGroup, onExitGroup].filter(Boolean);

  return (
    <div className="flex items-center gap-4 px-3 py-2 bg-white border-b border-gray-200 h-[43px]">
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
      {groupActions.length > 0 && (
        <>
          <div className="w-px h-4 bg-gray-200 shrink-0" />
          <div className="flex items-center gap-1">
            {onExitGroup && (
              <Button variant="outline" color="primary" size="sm" onClick={onExitGroup}>
                Exit Group
              </Button>
            )}
            {onEnterGroup && (
              <Button variant="outline" color="neutral" size="sm" onClick={onEnterGroup}>
                Enter Group
              </Button>
            )}
            {onUngroup && (
              <Button variant="outline" color="neutral" size="sm" onClick={onUngroup}>
                Ungroup
              </Button>
            )}
            {onGroup && (
              <Button variant="outline" color="neutral" size="sm" onClick={onGroup}>
                Group
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
