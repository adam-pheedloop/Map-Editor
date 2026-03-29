import { PiMapTrifold, PiBug, PiImage } from "react-icons/pi";

interface TopBarProps {
  debug?: boolean;
  onDebugClick?: () => void;
  onBackgroundImageClick?: () => void;
}

export function TopBar({ debug, onDebugClick, onBackgroundImageClick }: TopBarProps) {
  return (
    <div className="flex items-center bg-white border-b border-gray-200">
      <div className="flex items-center justify-center w-12 shrink-0 h-10 border-r border-gray-200 text-gray-400">
        <PiMapTrifold size={20} />
      </div>
      <span className="px-3 text-sm text-gray-400 cursor-default">File</span>
      <button
        onClick={onBackgroundImageClick}
        className="flex items-center gap-1 px-3 h-10 text-sm text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
      >
        <PiImage size={16} />
        <span>Background</span>
      </button>
      <div className="flex-1" />
      {debug && (
        <button
          onClick={onDebugClick}
          className="flex items-center gap-1 px-3 h-10 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
          title="Debug: View Map JSON"
        >
          <PiBug size={16} />
          <span className="text-[11px]">Debug</span>
        </button>
      )}
    </div>
  );
}
