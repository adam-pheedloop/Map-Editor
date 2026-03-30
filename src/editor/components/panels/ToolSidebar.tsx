import { useState } from "react";
import { PiCursorFill, PiRectangle, PiCircle, PiLineSegment, PiStorefront, PiTextT, PiSticker } from "react-icons/pi";
import type { ActiveTool } from "../../types";
import { IconPicker } from "./IconPicker";
import { getIconEntry } from "../../utils/iconRegistry";

interface ToolSidebarProps {
  activeTool: ActiveTool;
  activeIconName: string | null;
  onToolChange: (tool: ActiveTool) => void;
  onIconSelect?: (iconId: string) => void;
}

const tools: {
  id: ActiveTool;
  label: string;
  shortcut: string;
  icon: React.ReactNode;
}[] = [
  { id: "select", label: "Select", shortcut: "V", icon: <PiCursorFill size={20} /> },
  { id: "rectangle", label: "Rectangle", shortcut: "R", icon: <PiRectangle size={20} /> },
  { id: "ellipse", label: "Ellipse", shortcut: "O", icon: <PiCircle size={20} /> },
  { id: "line", label: "Line", shortcut: "L", icon: <PiLineSegment size={20} /> },
  { id: "booth", label: "Booth", shortcut: "B", icon: <PiStorefront size={20} /> },
  { id: "text", label: "Text", shortcut: "T", icon: <PiTextT size={20} /> },
  { id: "icon", label: "Icon", shortcut: "I", icon: <PiSticker size={20} /> },
];

function ToolButton({
  tool,
  isActive,
  onClick,
}: {
  tool: (typeof tools)[number];
  isActive: boolean;
  onClick: () => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer transition-colors ${
          isActive
            ? "bg-primary-600 text-white"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        }`}
      >
        {tool.icon}
      </button>
      {showTooltip && !isActive && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none">
          {tool.label} ({tool.shortcut})
        </div>
      )}
    </div>
  );
}

export function ToolSidebar({ activeTool, activeIconName, onToolChange, onIconSelect }: ToolSidebarProps) {
  return (
    <div className="flex flex-col items-center gap-1 py-2 w-12 shrink-0 bg-white border-r border-gray-200">
      {tools.map((tool) => {
        // For the icon tool, show the selected icon on the button
        const displayTool =
          tool.id === "icon" && activeIconName
            ? (() => {
                const entry = getIconEntry(activeIconName);
                if (!entry) return tool;
                const ActiveIcon = entry.component;
                return { ...tool, icon: <ActiveIcon size={20} /> };
              })()
            : tool;

        return (
          <div key={tool.id} className="relative">
            <ToolButton
              tool={displayTool}
              isActive={activeTool === tool.id}
              onClick={() => onToolChange(tool.id)}
            />
            {tool.id === "icon" && activeTool === "icon" && onIconSelect && (
              <IconPicker
                selectedId={activeIconName}
                onSelect={(iconId) => {
                  onIconSelect(iconId);
                }}
                onClose={() => onToolChange("select")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
