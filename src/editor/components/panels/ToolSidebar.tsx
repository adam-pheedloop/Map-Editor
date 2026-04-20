import { useState } from "react";
import { PiCursorFill, PiPaintBrush, PiEraser, PiSquare } from "react-icons/pi";
import type { ActiveTool, PathingTool } from "../../types";
import { TOOL_REGISTRY } from "../../tools/registry";
import { IconButton } from "../ui";
import { IconPicker } from "./IconPicker";
import { getIconEntry } from "../../utils/iconRegistry";

interface ToolDef<T extends string> {
  id: T;
  label: string;
  shortcut: string;
  icon: React.ReactNode;
}

// Select is not in the registry — it's built into Canvas
const selectDef: ToolDef<ActiveTool> = {
  id: "select",
  label: "Select",
  shortcut: "V",
  icon: <PiCursorFill size={20} />,
};

// Derive tool list from registry
const toolDefs: ToolDef<ActiveTool>[] = TOOL_REGISTRY.map((t) => ({
  id: t.id as ActiveTool,
  label: t.label,
  shortcut: t.shortcut ?? "",
  icon: t.icon,
}));

const pathingTools: ToolDef<PathingTool>[] = [
  { id: "select", label: "Select", shortcut: "V", icon: <PiCursorFill size={20} /> },
  { id: "paintWalkable", label: "Paint Walkable", shortcut: "W", icon: <PiPaintBrush size={20} /> },
  { id: "paintImpassable", label: "Erase (Impassable)", shortcut: "E", icon: <PiEraser size={20} /> },
  { id: "rectFill", label: "Rectangle Fill", shortcut: "R", icon: <PiSquare size={20} /> },
];

function ToolButton<T extends string>({
  tool,
  isActive,
  onClick,
}: {
  tool: ToolDef<T>;
  isActive: boolean;
  onClick: () => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <IconButton
        active={isActive}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {tool.icon}
      </IconButton>
      {showTooltip && !isActive && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none">
          {tool.label} ({tool.shortcut})
        </div>
      )}
    </div>
  );
}

interface ToolSidebarProps {
  activeTool: ActiveTool;
  activeIconName: string | null;
  onToolChange: (tool: ActiveTool) => void;
  onIconSelect?: (iconId: string) => void;
  isPathingMode?: boolean;
  activePathingTool?: PathingTool;
  onPathingToolChange?: (tool: PathingTool) => void;
}

export function ToolSidebar({
  activeTool,
  activeIconName,
  onToolChange,
  onIconSelect,
  isPathingMode,
  activePathingTool,
  onPathingToolChange,
}: ToolSidebarProps) {
  if (isPathingMode && onPathingToolChange && activePathingTool) {
    return (
      <div className="flex flex-col items-center gap-1 py-2 w-12 shrink-0 bg-white border-r border-gray-200">
        {pathingTools.map((tool) => (
          <ToolButton
            key={tool.id}
            tool={tool}
            isActive={activePathingTool === tool.id}
            onClick={() => onPathingToolChange(tool.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 py-2 w-12 shrink-0 bg-white border-r border-gray-200">
      {/* Select tool */}
      <ToolButton
        tool={selectDef}
        isActive={activeTool === "select"}
        onClick={() => onToolChange("select")}
      />

      {/* All drawing tools */}
      {toolDefs.map((tool) => {
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
