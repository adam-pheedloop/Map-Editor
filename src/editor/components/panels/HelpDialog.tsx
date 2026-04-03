import { useState } from "react";
import { Dialog, TabBar } from "../ui";

const isMac = navigator.platform.toUpperCase().includes("MAC");
const mod = isMac ? "⌘" : "Ctrl";

type HelpTab = "start" | "shortcuts" | "menus";

const shortcuts: { category: string; items: { keys: string; description: string }[] }[] = [
  {
    category: "Tools",
    items: [
      { keys: "V", description: "Select tool" },
      { keys: "R", description: "Rectangle tool" },
      { keys: "O", description: "Ellipse tool" },
      { keys: "L", description: "Line tool" },
      { keys: "A", description: "Arrow tool" },
      { keys: "C", description: "Arc tool" },
      { keys: "P", description: "Polygon tool" },
      { keys: "B", description: "Booth tool" },
      { keys: "T", description: "Text tool" },
      { keys: "I", description: "Icon tool" },
      { keys: "M", description: "Measure tool" },
    ],
  },
  {
    category: "Pathing Tools (Pathing layer active)",
    items: [
      { keys: "V", description: "Select / pan" },
      { keys: "W", description: "Paint walkable" },
      { keys: "E", description: "Paint impassable (erase)" },
      { keys: "R", description: "Rectangle fill" },
    ],
  },
  {
    category: "Edit",
    items: [
      { keys: `${mod}+Z`, description: "Undo" },
      { keys: `${mod}+Shift+Z`, description: "Redo" },
      { keys: `${mod}+C`, description: "Copy" },
      { keys: `${mod}+V`, description: "Paste" },
      { keys: `${mod}+D`, description: "Duplicate" },
      { keys: `${mod}+A`, description: "Select all" },
      { keys: "Delete", description: "Delete selected" },
      { keys: "Escape", description: "Deselect / cancel" },
    ],
  },
  {
    category: "Canvas",
    items: [
      { keys: "Scroll", description: "Zoom in/out" },
      { keys: "Space + Drag", description: "Pan canvas" },
      { keys: "Shift + Drag", description: "Constrain proportions (square/circle)" },
      { keys: "Shift + Rotate", description: "Snap rotation to 15°" },
      { keys: "Shift + Line/Arrow", description: "Snap to 45° angles" },
      { keys: "Shift + Polygon", description: "Snap edges to 45° angles" },
      { keys: "Shift + Measure", description: "Snap to horizontal/vertical/45°" },
      { keys: "Shift + Calibrate", description: "Snap calibration line to horizontal/vertical/45°" },
    ],
  },
  {
    category: "Selection",
    items: [
      { keys: "Click", description: "Select element" },
      { keys: "Shift + Click", description: "Add/remove from selection" },
      { keys: "Drag (empty space)", description: "Drag-select rectangle" },
      { keys: "Right-click", description: "Context menu" },
    ],
  },
];

const menus: { name: string; items: string[] }[] = [
  {
    name: "File",
    items: ["Export as PNG", "Export as JSON", "Import JSON"],
  },
  {
    name: "Edit",
    items: ["Undo", "Redo", "Copy", "Paste", "Duplicate"],
  },
  {
    name: "View",
    items: ["Show Rulers", "Show Grid", "Snap to Grid", "Snap to Objects"],
  },
  {
    name: "Tools",
    items: ["Configure Grid...", "Canvas Size...", "Set Scale..."],
  },
];

interface HelpDialogProps {
  onClose: () => void;
}

export function HelpDialog({ onClose }: HelpDialogProps) {
  const [tab, setTab] = useState<HelpTab>("start");

  return (
    <Dialog title="Help" onClose={onClose} width="520px" maxHeight="80vh">
      <div className="px-4 pt-3 border-b border-gray-200">
        <TabBar
          tabs={[
            { id: "start", label: "Getting Started" },
            { id: "shortcuts", label: "Shortcuts" },
            { id: "menus", label: "Menus" },
          ]}
          value={tab}
          onChange={(id) => setTab(id as HelpTab)}
          itemClassName="px-3 py-1.5 text-xs"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "start" && (
          <>
            <h3 className="text-xs font-semibold text-gray-800 mb-2">Quick Start</h3>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li>Select a tool from the <strong>left sidebar</strong> to start drawing</li>
              <li><strong>Click and drag</strong> on the canvas to draw shapes</li>
              <li>Click an element to <strong>select</strong> it — resize, rotate, or edit properties in the right panel</li>
              <li>Use the <strong>options bar</strong> above the canvas to change fill, stroke, and stroke width</li>
              <li>Upload a background floor plan via <strong>Background</strong> in the menu bar</li>
              <li>Use <strong>Tools &gt; Configure Grid</strong> to customize the grid overlay</li>
              <li>Hold <strong>Space</strong> and drag to pan the canvas</li>
            </ul>

            <h3 className="text-xs font-semibold text-gray-800 mt-4 mb-2">Drawing Tools</h3>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li><strong>Arrow</strong> (A) — click and drag to draw an arrow. Select to change arrowhead style (triangle/chevron) and size in the properties panel</li>
              <li><strong>Arc</strong> (C) — click to set start point, click to set end point, then move mouse to bend the curve and click to finalize. Escape to cancel</li>
              <li><strong>Polygon</strong> (P) — click to place vertices. Close by clicking near the first vertex, pressing Enter, or double-clicking. Minimum 3 vertices. Escape to cancel</li>
              <li>Select any arrow, arc, or polygon to see <strong>control handles</strong> for reshaping</li>
              <li>Hold <strong>Shift</strong> while drawing lines, arrows, or polygon edges to snap to 45° angles</li>
            </ul>

            <h3 className="text-xs font-semibold text-gray-800 mt-4 mb-2">Layers</h3>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li>Click the <strong>layer icon</strong> (top-right of canvas) to open the layer panel</li>
              <li>Four layers: <strong>Background</strong>, <strong>Content</strong>, <strong>Pathing</strong>, and <strong>Markup</strong></li>
              <li>Click a layer to make it <strong>active</strong> — only elements on the active layer are selectable</li>
              <li>Toggle the <strong>eye icon</strong> to show/hide a layer</li>
              <li>Booths and rooms live on <strong>Content</strong>; labels, icons, and shapes on <strong>Markup</strong></li>
            </ul>

            <h3 className="text-xs font-semibold text-gray-800 mt-4 mb-2">Scale & Measurement</h3>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li>Use <strong>Tools &gt; Set Scale...</strong> to calibrate your floor plan — click two points and enter the real-world distance between them</li>
              <li>Supports <strong>feet</strong>, <strong>inches</strong>, and <strong>meters</strong> — inches auto-convert to feet</li>
              <li>Hold <strong>Shift</strong> while placing the second point to snap to horizontal or vertical</li>
              <li>Change display units (ft / m) anytime in the <strong>status bar</strong> without re-calibrating</li>
              <li>Toggle <strong>View &gt; Show Rulers</strong> to see rulers along the canvas edges — they show real-world units when calibrated</li>
              <li>Use the <strong>Measure tool</strong> (M) to measure distances — click and drag between two points</li>
              <li>Booth area, element dimensions, and canvas size all display in real-world units once calibrated</li>
            </ul>

            <h3 className="text-xs font-semibold text-gray-800 mt-4 mb-2">Wayfinding (Pathing Layer)</h3>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li>Switch to the <strong>Pathing layer</strong> to define walkable areas for attendee wayfinding</li>
              <li>The sidebar swaps to pathing tools: <strong>Paint Walkable</strong> (W), <strong>Erase</strong> (E), <strong>Rectangle Fill</strong> (R)</li>
              <li>Green cells = walkable, empty = impassable. Unset areas default to impassable.</li>
              <li>Use <strong>Auto-mark aisles</strong> to quickly mark all open space as walkable</li>
              <li>Use <strong>Auto-mark obstacles</strong> to block booth footprints</li>
              <li>Adjust <strong>cell size</strong> and <strong>opacity</strong> in the options bar</li>
              <li>When the map is calibrated, wayfinding routes show <strong>distance and estimated walking time</strong></li>
            </ul>
          </>
        )}

        {tab === "shortcuts" && (
          <>
            {shortcuts.map((section) => (
              <div key={section.category} className="mb-4">
                <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">
                  {section.category}
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <div
                      key={item.keys}
                      className="flex items-center justify-between py-0.5"
                    >
                      <span className="text-xs text-gray-600">{item.description}</span>
                      <kbd className="text-[10px] font-mono text-gray-500 bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5">
                        {item.keys}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {tab === "menus" && (
          <>
            <p className="text-xs text-gray-500 mb-4">
              Quick reference for the top menu bar.
            </p>
            {menus.map((menu) => (
              <div key={menu.name} className="mb-4">
                <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">
                  {menu.name}
                </div>
                <div className="space-y-1">
                  {menu.items.map((item) => (
                    <div key={item} className="text-xs text-gray-600 py-0.5 pl-2">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </Dialog>
  );
}
