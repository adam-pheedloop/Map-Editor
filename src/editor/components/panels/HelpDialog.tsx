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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-[520px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800">Help</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

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
      </div>
    </div>
  );
}
