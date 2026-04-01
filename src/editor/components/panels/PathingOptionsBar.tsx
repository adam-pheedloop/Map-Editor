import { PiMagicWand, PiPath } from "react-icons/pi";

interface PathingOptionsBarProps {
  cellSize: number;
  opacity: number;
  onCellSizeChange: (size: number) => void;
  onOpacityChange: (opacity: number) => void;
  onAutoMarkObstacles: () => void;
  onAutoMarkWalkable: () => void;
  onClearGrid: () => void;
}

const CELL_SIZE_OPTIONS = [10, 15, 20, 25, 30, 40];

export function PathingOptionsBar({
  cellSize,
  opacity,
  onCellSizeChange,
  onOpacityChange,
  onAutoMarkObstacles,
  onAutoMarkWalkable,
  onClearGrid,
}: PathingOptionsBarProps) {
  return (
    <div className="flex items-center gap-4 px-3 py-2 bg-white border-b border-gray-200">
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-gray-500">Cell Size</span>
        <select
          value={cellSize}
          onChange={(e) => onCellSizeChange(Number(e.target.value))}
          className="px-2 py-1 text-xs border border-gray-200 rounded bg-white"
        >
          {CELL_SIZE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}px
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-gray-500">Opacity</span>
        <input
          type="range"
          min={0.1}
          max={0.8}
          step={0.05}
          value={opacity}
          onChange={(e) => onOpacityChange(Number(e.target.value))}
          className="w-16 h-1 accent-green-500"
        />
        <span className="text-[10px] text-gray-400 w-7">{Math.round(opacity * 100)}%</span>
      </div>

      <div className="h-4 w-px bg-gray-200" />

      <button
        onClick={onAutoMarkWalkable}
        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-green-50 hover:text-green-700 rounded transition-colors cursor-pointer"
        title="Mark all non-booth space as walkable"
      >
        <PiPath size={14} />
        Auto-mark aisles
      </button>

      <button
        onClick={onAutoMarkObstacles}
        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-amber-50 hover:text-amber-700 rounded transition-colors cursor-pointer"
        title="Mark all booth footprints as impassable"
      >
        <PiMagicWand size={14} />
        Auto-mark obstacles
      </button>

      <div className="h-4 w-px bg-gray-200" />

      <button
        onClick={onClearGrid}
        className="px-2 py-1 text-xs text-gray-500 hover:bg-red-50 hover:text-red-600 rounded transition-colors cursor-pointer"
        title="Reset all cells to impassable"
      >
        Clear grid
      </button>
    </div>
  );
}
