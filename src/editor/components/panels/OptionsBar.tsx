import { Button, ColorSwatch, IconButton, NumberInput } from "../ui";
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
  onAlignLeft?: () => void;
  onAlignCenterH?: () => void;
  onAlignRight?: () => void;
  onAlignTop?: () => void;
  onAlignCenterV?: () => void;
  onAlignBottom?: () => void;
  onDistributeH?: () => void;
  onDistributeV?: () => void;
  onArrangeAsGrid?: () => void;
}

export function OptionsBar({
  defaults,
  config,
  onDefaultsChange,
  onGroup,
  onUngroup,
  onEnterGroup,
  onExitGroup,
  onAlignLeft,
  onAlignCenterH,
  onAlignRight,
  onAlignTop,
  onAlignCenterV,
  onAlignBottom,
  onDistributeH,
  onDistributeV,
  onArrangeAsGrid,
}: OptionsBarProps) {
  const fields = new Set<OptionsBarField>(config.optionsBar);
  const groupActions = [onGroup, onUngroup, onEnterGroup, onExitGroup].filter(Boolean);
  const alignActions = [
    onAlignLeft, onAlignCenterH, onAlignRight,
    onAlignTop, onAlignCenterV, onAlignBottom,
    onDistributeH, onDistributeV, onArrangeAsGrid,
  ].filter(Boolean);

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
      {alignActions.length > 0 && (
        <>
          <div className="w-px h-4 bg-gray-200 shrink-0" />
          <div className="flex items-center gap-0.5">
            {onAlignLeft && (
              <IconButton size="sm" title="Align left edges" onClick={onAlignLeft}>
                <AlignLeftIcon />
              </IconButton>
            )}
            {onAlignCenterH && (
              <IconButton size="sm" title="Align horizontal centers" onClick={onAlignCenterH}>
                <AlignCenterHIcon />
              </IconButton>
            )}
            {onAlignRight && (
              <IconButton size="sm" title="Align right edges" onClick={onAlignRight}>
                <AlignRightIcon />
              </IconButton>
            )}
            <div className="w-px h-3.5 bg-gray-200 shrink-0 mx-0.5" />
            {onAlignTop && (
              <IconButton size="sm" title="Align top edges" onClick={onAlignTop}>
                <AlignTopIcon />
              </IconButton>
            )}
            {onAlignCenterV && (
              <IconButton size="sm" title="Align vertical centers" onClick={onAlignCenterV}>
                <AlignCenterVIcon />
              </IconButton>
            )}
            {onAlignBottom && (
              <IconButton size="sm" title="Align bottom edges" onClick={onAlignBottom}>
                <AlignBottomIcon />
              </IconButton>
            )}
            {(onDistributeH || onDistributeV) && (
              <div className="w-px h-3.5 bg-gray-200 shrink-0 mx-0.5" />
            )}
            {onDistributeH && (
              <IconButton size="sm" title="Distribute horizontally" onClick={onDistributeH}>
                <DistributeHIcon />
              </IconButton>
            )}
            {onDistributeV && (
              <IconButton size="sm" title="Distribute vertically" onClick={onDistributeV}>
                <DistributeVIcon />
              </IconButton>
            )}
            {onArrangeAsGrid && (
              <>
                <div className="w-px h-3.5 bg-gray-200 shrink-0 mx-0.5" />
                <Button variant="outline" color="neutral" size="sm" onClick={onArrangeAsGrid}>
                  Grid
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function AlignLeftIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
      <line x1="2" y1="1.5" x2="2" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="3.5" y="2.5" width="7" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
      <rect x="3.5" y="8" width="4.5" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function AlignCenterHIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
      <line x1="7" y1="1.5" x2="7" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="3.5" y="2.5" width="7" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
      <rect x="4.75" y="8" width="4.5" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function AlignRightIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="1.5" x2="12" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="3.5" y="2.5" width="7" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
      <rect x="6" y="8" width="4.5" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function AlignTopIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
      <line x1="1.5" y1="2" x2="12.5" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="2.5" y="3.5" width="3.5" height="7" rx="0.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
      <rect x="8" y="3.5" width="3.5" height="4.5" rx="0.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function AlignCenterVIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
      <line x1="1.5" y1="7" x2="12.5" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="2.5" y="3.5" width="3.5" height="7" rx="0.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
      <rect x="8" y="4.75" width="3.5" height="4.5" rx="0.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function AlignBottomIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
      <line x1="1.5" y1="12" x2="12.5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="2.5" y="3.5" width="3.5" height="7" rx="0.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
      <rect x="8" y="6" width="3.5" height="4.5" rx="0.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function DistributeHIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
      <line x1="1.5" y1="1.5" x2="1.5" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12.5" y1="1.5" x2="12.5" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="3.5" y="4" width="2.5" height="6" rx="0.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
      <rect x="8" y="4" width="2.5" height="6" rx="0.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function DistributeVIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
      <line x1="1.5" y1="1.5" x2="12.5" y2="1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1.5" y1="12.5" x2="12.5" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="4" y="3.5" width="6" height="2.5" rx="0.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
      <rect x="4" y="8" width="6" height="2.5" rx="0.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
