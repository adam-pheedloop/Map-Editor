import { useState } from "react";
import { PiCursorFill, PiRectangle, PiCircle } from "react-icons/pi";
import type { ActiveTool } from "../types";

interface ToolSidebarProps {
  activeTool: ActiveTool;
  onToolChange: (tool: ActiveTool) => void;
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
            ? "bg-blue-600 text-white"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        }`}
      >
        {tool.icon}
      </button>
      {showTooltip && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none">
          {tool.label} ({tool.shortcut})
        </div>
      )}
    </div>
  );
}

export function ToolSidebar({ activeTool, onToolChange }: ToolSidebarProps) {
  return (
    <div className="flex flex-col items-center gap-1 py-2 w-12 bg-white border-r border-gray-200">
      {tools.map((tool) => (
        <ToolButton
          key={tool.id}
          tool={tool}
          isActive={activeTool === tool.id}
          onClick={() => onToolChange(tool.id)}
        />
      ))}
    </div>
  );
}
