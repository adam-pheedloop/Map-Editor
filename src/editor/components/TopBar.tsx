import { useState } from "react";
import { PiMapTrifold, PiBug, PiImage, PiQuestion } from "react-icons/pi";
import { DropdownMenu } from "./ui";
import type { MenuEntry } from "./ui";

const isMac = navigator.platform.toUpperCase().includes("MAC");
const mod = isMac ? "⌘" : "Ctrl+";

interface TopBarProps {
  debug?: boolean;
  onDebugClick?: () => void;
  onHelpClick?: () => void;
  onBackgroundImageClick?: () => void;
  fileMenuItems?: MenuEntry[];
  editMenuItems?: MenuEntry[];
  toolsMenuItems?: MenuEntry[];
}

export function TopBar({
  debug,
  onDebugClick,
  onHelpClick,
  onBackgroundImageClick,
  fileMenuItems = [],
  editMenuItems = [],
  toolsMenuItems = [],
}: TopBarProps) {
  const [fileOpen, setFileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const closeAll = () => {
    setFileOpen(false);
    setEditOpen(false);
    setToolsOpen(false);
  };

  return (
    <div className="flex items-center bg-white border-b border-gray-200">
      <div className="flex items-center justify-center w-12 shrink-0 h-10 border-r border-gray-200 text-gray-400">
        <PiMapTrifold size={20} />
      </div>
      <div className="relative">
        <button
          onMouseDown={(e) => {
            e.stopPropagation();
            closeAll();
            setFileOpen((prev) => !prev);
          }}
          className={`px-3 h-10 text-sm cursor-pointer transition-colors ${
            fileOpen ? "text-gray-800 bg-gray-100" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          File
        </button>
        {fileOpen && (
          <DropdownMenu
            items={fileMenuItems}
            onClose={() => setFileOpen(false)}
          />
        )}
      </div>
      <div className="relative">
        <button
          onMouseDown={(e) => {
            e.stopPropagation();
            closeAll();
            setEditOpen((prev) => !prev);
          }}
          className={`px-3 h-10 text-sm cursor-pointer transition-colors ${
            editOpen ? "text-gray-800 bg-gray-100" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Edit
        </button>
        {editOpen && (
          <DropdownMenu
            items={editMenuItems}
            onClose={() => setEditOpen(false)}
          />
        )}
      </div>
      <div className="relative">
        <button
          onMouseDown={(e) => {
            e.stopPropagation();
            closeAll();
            setToolsOpen((prev) => !prev);
          }}
          className={`px-3 h-10 text-sm cursor-pointer transition-colors ${
            toolsOpen ? "text-gray-800 bg-gray-100" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Tools
        </button>
        {toolsOpen && (
          <DropdownMenu
            items={toolsMenuItems}
            onClose={() => setToolsOpen(false)}
          />
        )}
      </div>
      <button
        onClick={onBackgroundImageClick}
        className="flex items-center gap-1 px-3 h-10 text-sm text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
      >
        <PiImage size={16} />
        <span>Background</span>
      </button>
      <div className="flex-1" />
      <button
        onClick={onHelpClick}
        className="flex items-center gap-1 px-3 h-10 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
        title="Help & Shortcuts"
      >
        <PiQuestion size={16} />
      </button>
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

export { mod as modKey };
