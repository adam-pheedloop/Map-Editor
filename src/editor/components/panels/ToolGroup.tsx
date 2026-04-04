import { useState, useRef, useEffect } from "react";
import type { ActiveTool } from "../../types";
import { IconButton } from "../ui";

export interface ToolGroupEntry {
  id: ActiveTool;
  label: string;
  shortcut: string;
  icon: React.ReactNode;
}

interface ToolGroupProps {
  tools: ToolGroupEntry[];
  activeTool: ActiveTool;
  lastSelectedId: ActiveTool;
  onToolChange: (tool: ActiveTool) => void;
}

export function ToolGroup({
  tools,
  activeTool,
  lastSelectedId,
  onToolChange,
}: ToolGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const groupRef = useRef<HTMLDivElement>(null);
  const isGroupActive = tools.some((t) => t.id === activeTool);
  const displayTool = tools.find((t) => t.id === lastSelectedId) ?? tools[0];

  // Close flyout on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        groupRef.current &&
        !groupRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div ref={groupRef} className="relative">
      <IconButton
        active={isGroupActive}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else if (isGroupActive) {
            // Already on a tool in this group — open flyout to switch
            setIsOpen(true);
          } else {
            // Activate the last-selected tool
            onToolChange(displayTool.id);
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {displayTool.icon}
        {/* Small triangle indicator */}
        <span className="absolute bottom-0.5 right-0.5 text-[6px] leading-none text-gray-400">
          ▶
        </span>
      </IconButton>

      {/* Tooltip */}
      {showTooltip && !isGroupActive && !isOpen && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none">
          {displayTool.label} ({displayTool.shortcut})
        </div>
      )}

      {/* Horizontal flyout */}
      {isOpen && (
        <div className="absolute left-full ml-1 top-0 flex flex-row gap-1 bg-white border border-gray-200 rounded-md shadow-lg p-1 z-50">
          {tools.map((tool) => (
            <div key={tool.id} className="relative group">
              <IconButton
                active={activeTool === tool.id}
                onClick={() => {
                  onToolChange(tool.id);
                  setIsOpen(false);
                }}
              >
                {tool.icon}
              </IconButton>
              {/* Sub-tool tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                {tool.label} ({tool.shortcut})
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
