import { useState } from "react";
import { PiCursorFill, PiPaintBrush, PiEraser, PiSquare } from "react-icons/pi";
import type { ActiveTool, PathingTool } from "../../types";
import { TOOL_REGISTRY, LOCATION_TOOL_IDS } from "../../tools/registry";
import { IconButton } from "../ui";
import { IconPicker } from "./IconPicker";
import { getIconEntry } from "../../utils/iconRegistry";
import { ToolGroup } from "./ToolGroup";
import type { ToolGroupEntry } from "./ToolGroup";

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

// Derive tool list from registry, separating location tools from standalone tools
const locationToolEntries: ToolGroupEntry[] = [];
const standaloneDefs: ToolDef<ActiveTool>[] = [];

for (const t of TOOL_REGISTRY) {
  const def: ToolDef<ActiveTool> = {
    id: t.id as ActiveTool,
    label: t.label,
    shortcut: t.shortcut ?? "",
    icon: t.icon,
  };
  if (LOCATION_TOOL_IDS.includes(t.id)) {
    locationToolEntries.push(def);
  } else {
    standaloneDefs.push(def);
  }
}

// Position where the first location tool appeared in the registry
const locationInsertIndex = TOOL_REGISTRY.findIndex((t) =>
  LOCATION_TOOL_IDS.includes(t.id)
);

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
  const [lastLocationTool, setLastLocationTool] = useState<ActiveTool>("booth");

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

  // Build the toolbar items: select → standalone tools with ToolGroup inserted at the right position
  const handleLocationToolChange = (tool: ActiveTool) => {
    setLastLocationTool(tool);
    onToolChange(tool);
  };

  // Figure out where to insert the ToolGroup among standalone tools.
  // We insert it at the position of the first location tool in the original registry order.
  // Count how many standalone tools appear before that index.
  const standaloneBeforeGroup = TOOL_REGISTRY
    .slice(0, locationInsertIndex)
    .filter((t) => !LOCATION_TOOL_IDS.includes(t.id)).length;

  const toolsBefore = standaloneDefs.slice(0, standaloneBeforeGroup);
  const toolsAfter = standaloneDefs.slice(standaloneBeforeGroup);

  // Keep lastLocationTool in sync when a location tool is activated via keyboard shortcut
  const effectiveLastLocation = LOCATION_TOOL_IDS.includes(activeTool)
    ? activeTool
    : lastLocationTool;

  return (
    <div className="flex flex-col items-center gap-1 py-2 w-12 shrink-0 bg-white border-r border-gray-200">
      {/* Select tool */}
      <ToolButton
        tool={selectDef}
        isActive={activeTool === "select"}
        onClick={() => onToolChange("select")}
      />

      {/* Standalone tools before the location group */}
      {toolsBefore.map((tool) => renderTool(tool))}

      {/* Location tools group */}
      {locationToolEntries.length > 1 ? (
        <ToolGroup
          tools={locationToolEntries}
          activeTool={activeTool}
          lastSelectedId={effectiveLastLocation}
          onToolChange={handleLocationToolChange}
        />
      ) : locationToolEntries.length === 1 ? (
        // Single location tool — no group needed, render as a normal button
        renderTool(locationToolEntries[0])
      ) : null}

      {/* Standalone tools after the location group */}
      {toolsAfter.map((tool) => renderTool(tool))}
    </div>
  );

  function renderTool(tool: ToolDef<ActiveTool>) {
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
  }
}
