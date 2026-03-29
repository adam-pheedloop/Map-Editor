import { PiCursorFill, PiRectangle } from "react-icons/pi";
import type { ActiveTool } from "../types";

interface ToolbarProps {
  activeTool: ActiveTool;
  onToolChange: (tool: ActiveTool) => void;
}

const tools: { id: ActiveTool; label: string; shortcut: string; icon: React.ReactNode }[] = [
  { id: "select", label: "Select", shortcut: "V", icon: <PiCursorFill size={18} /> },
  { id: "rectangle", label: "Rectangle", shortcut: "R", icon: <PiRectangle size={18} /> },
];

export function Toolbar({ activeTool, onToolChange }: ToolbarProps) {
  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-white border-b border-gray-200">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolChange(tool.id)}
          title={`${tool.label} (${tool.shortcut})`}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded cursor-pointer transition-colors ${
            activeTool === tool.id
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {tool.icon}
          {tool.label}
        </button>
      ))}
    </div>
  );
}
