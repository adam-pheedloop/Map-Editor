import { Dialog } from "../ui";

const isMac = navigator.platform.toUpperCase().includes("MAC");
const mod = isMac ? "⌘" : "Ctrl";

const shortcuts: { category: string; items: { keys: string; description: string }[] }[] = [
  {
    category: "Tools",
    items: [
      { keys: "V", description: "Select tool" },
      { keys: "R", description: "Rectangle tool" },
      { keys: "O", description: "Ellipse tool" },
      { keys: "L", description: "Line tool" },
      { keys: "B", description: "Booth tool" },
      { keys: "T", description: "Text tool" },
      { keys: "I", description: "Icon tool" },
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
      { keys: "Shift + Line", description: "Snap line to 45° angles" },
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

interface HelpDialogProps {
  onClose: () => void;
}

export function HelpDialog({ onClose }: HelpDialogProps) {
  return (
    <Dialog title="Help" onClose={onClose} width="520px" maxHeight="80vh">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Quick start */}
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-gray-800 mb-2">Quick Start</h3>
          <ul className="text-xs text-gray-600 space-y-1.5">
            <li>Select a tool from the <strong>left sidebar</strong> to start drawing</li>
            <li><strong>Click and drag</strong> on the canvas to draw shapes</li>
            <li>Click an element to <strong>select</strong> it — resize, rotate, or edit properties in the right panel</li>
            <li>Use the <strong>options bar</strong> above the canvas to change fill, stroke, and stroke width</li>
            <li>Upload a background floor plan via <strong>Background</strong> in the menu bar</li>
            <li>Use <strong>Tools → Configure Grid</strong> to customize the grid overlay</li>
            <li>Hold <strong>Space</strong> and drag to pan the canvas</li>
          </ul>

          <h3 className="text-xs font-semibold text-gray-800 mt-4 mb-2">Layers</h3>
          <ul className="text-xs text-gray-600 space-y-1.5">
            <li>Click the <strong>layer icon</strong> (top-right of canvas) to open the layer panel</li>
            <li>Four layers: <strong>Background</strong>, <strong>Content</strong>, <strong>Pathing</strong>, and <strong>Markup</strong></li>
            <li>Click a layer to make it <strong>active</strong> — only elements on the active layer are selectable</li>
            <li>Toggle the <strong>eye icon</strong> to show/hide a layer</li>
            <li>Booths and rooms live on <strong>Content</strong>; labels, icons, and shapes on <strong>Markup</strong></li>
          </ul>

          <h3 className="text-xs font-semibold text-gray-800 mt-4 mb-2">Wayfinding (Pathing Layer)</h3>
          <ul className="text-xs text-gray-600 space-y-1.5">
            <li>Switch to the <strong>Pathing layer</strong> to define walkable areas for attendee wayfinding</li>
            <li>The sidebar swaps to pathing tools: <strong>Paint Walkable</strong> (W), <strong>Erase</strong> (E), <strong>Rectangle Fill</strong> (R)</li>
            <li>Green cells = walkable, empty = impassable. Unset areas default to impassable.</li>
            <li>Use <strong>Auto-mark aisles</strong> to quickly mark all open space as walkable</li>
            <li>Use <strong>Auto-mark obstacles</strong> to block booth footprints</li>
            <li>Adjust <strong>cell size</strong> and <strong>opacity</strong> in the options bar</li>
          </ul>
        </div>

        {/* Keyboard shortcuts */}
        <h3 className="text-xs font-semibold text-gray-800 mb-3">Keyboard Shortcuts</h3>
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
      </div>
    </Dialog>
  );
}
