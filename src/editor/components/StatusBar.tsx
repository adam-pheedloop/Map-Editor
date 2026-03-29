interface StatusBarProps {
  scale: number;
  onZoomReset: () => void;
}

export function StatusBar({ scale, onZoomReset }: StatusBarProps) {
  return (
    <div className="flex items-center justify-end px-3 py-1.5 bg-white border-t border-gray-200 text-xs text-gray-500">
      <button
        onClick={onZoomReset}
        className="hover:text-gray-800 cursor-pointer"
        title="Click to reset zoom"
      >
        {Math.round(scale * 100)}%
      </button>
    </div>
  );
}
