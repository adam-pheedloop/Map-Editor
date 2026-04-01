import { IconButton } from "./ui";

interface StatusBarProps {
  scale: number;
  onZoomReset: () => void;
}

export function StatusBar({ scale, onZoomReset }: StatusBarProps) {
  return (
    <div className="flex items-center justify-end px-3 py-1.5 bg-white border-t border-gray-200 text-xs text-gray-500">
      <IconButton
        size="sm"
        onClick={onZoomReset}
        className="px-2 w-auto text-xs text-gray-500"
        title="Click to reset zoom"
      >
        {Math.round(scale * 100)}%
      </IconButton>
    </div>
  );
}
