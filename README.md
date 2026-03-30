# EventMaps Editor

Interactive map editor and viewer for PheedLoop events. Standalone package built with Konva.js + React + TypeScript — will be consumed by raichu (editor) and Charmander (viewer) once integrated.

See [.planning/EventMaps-Redevelopment-Reference.md](.planning/EventMaps-Redevelopment-Reference.md) for the full project context and architecture decisions.

## Quick Start

```bash
nvm use           # Node 24 (see .nvmrc)
npm install
npm run dev       # http://localhost:5173
```

The dev app has two routes:
- `#editor` — full map editor with drawing tools, selection, properties
- `#viewer` — attendee/exhibitor-facing read-only map viewer

Toggle between desktop/mobile viewport and attendee/exhibitor mode in the viewer nav bar.

## Project Structure

```
src/
├── editor/                      # Map editor (consumed by raichu)
│   ├── MapEditor.tsx            # Main orchestrator
│   ├── types.ts                 # ActiveTool
│   ├── hooks/                   # State, controls, clipboard, guides
│   ├── utils/                   # Canvas math, bounds
│   └── components/
│       ├── canvas/              # Konva stage, elements, transformer
│       │   └── elements/        # Per-shape components + configs
│       ├── panels/              # Sidebar, options bar, properties
│       ├── ui/                  # Reusable primitives
│       └── debug/               # JSON tree viewer (dev only)
├── viewer/                      # Map viewer (consumed by Charmander)
│   ├── MapViewer.tsx            # Main orchestrator
│   ├── types.ts                 # ViewerMode, Exhibitor
│   ├── hooks/                   # Search
│   └── components/              # Canvas, search, exhibitor list/sheet, popover
├── types/
│   └── FloorPlanData.ts         # Core data schema (shared by editor + viewer)
└── sample-data/                 # Mock data + logos for development
```

## Technology

| Layer | Tech |
|-------|------|
| Editor canvas | [Konva.js](https://konvajs.org/) + [react-konva](https://github.com/konvajs/react-konva) |
| Viewer canvas | Konva.js (read-only, shares rendering code) |
| UI framework | React 19 + TypeScript |
| Styling | Tailwind CSS v4 with PheedLoop design tokens |
| Build | Vite |
| Icons | react-icons (Phosphor set) |

## Data Format

The editor and viewer both consume `FloorPlanData` — a renderer-agnostic JSON schema. The editor writes it, the viewer reads it. See [types/FloorPlanData.ts](src/types/FloorPlanData.ts) for the full type definition.

During development, data persists to localStorage (controlled via `persist` prop on `<MapEditor>`).

## Editor Features

- **Drawing tools:** Rectangle, Ellipse, Line, Booth (dedicated tool)
- **Selection:** Click, Shift+click, drag-select rectangle, Ctrl+A
- **Transform:** Move, resize, rotate with Shift constraints (equal proportions, 15° snap, 45° line snap)
- **Alignment guides:** Dynamic snap lines when dragging near other elements
- **Properties panel:** Name, dimensions, rotation, booth code, area
- **Options bar:** Fill, stroke color, stroke width (context-aware per shape config)
- **Background images:** Upload with fit-to-canvas or resize-canvas options, opacity control
- **Copy/paste:** Ctrl+C/V/D, multi-element support, booth codes cleared on paste
- **Context menu:** Right-click for element-specific actions (convert to booth, delete)
- **Debug tools:** JSON tree viewer for elements and full map data (dev only)

## Viewer Features

- **Modes:** Attendee (occupied booths only) and Exhibitor (all booths, availability visible)
- **Interactivity:** Pan, zoom, booth hover/click with popover
- **Exhibitor list:** Desktop sidebar / mobile bottom sheet, sorted alphabetically
- **Search:** Real-time search across booth codes, names, and exhibitor names
- **Responsive:** Container-query based — desktop sidebar, mobile bottom sheet

## Shape Config System

Each element type declares what shows in the options bar, properties panel, and context menu:

```typescript
// Co-located with the shape component
export const boothConfig: ShapeConfig = {
  optionsBar: ["fill", "stroke", "strokeWidth"],
  propertiesPanel: ["name", "boothCode", "width", "height", "rotation", "area"],
  contextMenu: ["delete"],
};
```

Adding a new element type = new component file with its config. The UI adapts automatically.

## Development Phases

| Phase | Status | Focus |
|-------|--------|-------|
| [Phase 1](.planning/PHASE-1.md) | Complete | Core editor — canvas, drawing tools, selection, properties |
| [Phase 2](.planning/PHASE-2.md) | Complete | Exhibitor booths as first-class elements |
| [Phase 3](.planning/PHASE-3.md) | Complete | Attendee-facing viewer with search, exhibitor list, modes |
| [Phase 4](.planning/PHASE-4.md) | In progress | Editor polish — copy/paste, alignment guides, multi-select |

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Type-check + production build
npm run lint      # ESLint
npm run preview   # Preview production build
```
