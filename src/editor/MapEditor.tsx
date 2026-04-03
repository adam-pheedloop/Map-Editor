import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import type { ActiveTool, PathingTool } from "./types";
import type { DrawingDefaults } from "./components/panels/OptionsBar";
import { useCanvasControls } from "./hooks/useCanvasControls";
import { useEditorState } from "./hooks/useEditorState";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useClipboard } from "./hooks/useClipboard";
import { usePathingTool } from "./hooks/usePathingTool";
import { useCalibration } from "./hooks/useCalibration";
import { useMeasureTool } from "./hooks/useMeasureTool";
import { Canvas } from "./components/canvas/Canvas";
import { ToolSidebar } from "./components/panels/ToolSidebar";
import { TopBar } from "./components/TopBar";
import { OptionsBar } from "./components/panels/OptionsBar";
import { PathingOptionsBar } from "./components/panels/PathingOptionsBar";
import { StatusBar } from "./components/StatusBar";
import { PropertiesPanel } from "./components/panels/PropertiesPanel";
import { getShapeConfig } from "./components/canvas/elements";
import { ContextMenu, type ContextMenuItem } from "./components/canvas/ContextMenu";
import { modKey } from "./components/TopBar";
import { MapDebugDialog } from "./components/debug";
import { BackgroundImageDialog } from "./components/panels/BackgroundImageDialog";
import { GridSettingsDialog } from "./components/panels/GridSettingsDialog";
import { HelpDialog } from "./components/panels/HelpDialog";
import { CanvasResizeDialog } from "./components/panels/CanvasResizeDialog";
import { CalibrationDialog } from "./components/panels/CalibrationDialog";
import { LayerPanel } from "./components/panels/LayerPanel";
import { Rulers } from "./components/Rulers";
import type { FloorPlanData, LayerId, LayerDefinition } from "../types";
import { DEFAULT_LAYERS, ELEMENT_TYPE_TO_LAYER } from "../types";

const INITIAL_DEFAULTS: DrawingDefaults = {
  fill: "#94a3b8",
  stroke: "#888888",
  strokeWidth: 1,
};

interface MapEditorProps {
  initialData: FloorPlanData;
  debug?: boolean;
  persist?: boolean;
}

export function MapEditor({ initialData, debug: debugProp, persist }: MapEditorProps) {
  const debug = debugProp || import.meta.env.DEV;

  const {
    data,
    addElement,
    updateElement,
    updateProperties,
    deleteElement,
    deleteElements,
    moveElements,
    updateElementType,
    setBackgroundImage,
    setBackgroundColor,
    reorderElement,
    updateDimensions,
    initWalkableGrid,
    setWalkableCells,
    setWalkableCellRange,
    clearWalkableGrid,
    setWalkableGridResolution,
    setWalkableGrid,
    setCalibration,
    setDisplayUnit,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditorState(initialData, { persist });
  // Layer state (editor-only, not persisted in FloorPlanData)
  const [layers, setLayers] = useState<LayerDefinition[]>(() =>
    DEFAULT_LAYERS.map((l) => ({ ...l }))
  );
  const [activeLayerId, _setActiveLayerId] = useState<LayerId>("content");

  const setActiveLayerId = useCallback((id: LayerId) => {
    _setActiveLayerId(id);
    setSelectedIds(new Set());
    if (id === "pathing") {
      initWalkableGrid();
      setActivePathingTool("select");
    }
  }, [initWalkableGrid]);

  const toggleLayerVisibility = useCallback((id: LayerId) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  }, []);

  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  const [activePathingTool, setActivePathingTool] = useState<PathingTool>("select");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [defaults, setDefaults] = useState<DrawingDefaults>(INITIAL_DEFAULTS);
  const [showMapDebug, setShowMapDebug] = useState(false);
  const [showBgDialog, setShowBgDialog] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [activeIconName, setActiveIconName] = useState<string | null>(null);
  const [gridSettings, setGridSettings] = useState({
    showGrid: true,
    gridSpacing: 20,
    snapToGrid: true,
    gridColor: "#d1d5db",
    gridOpacity: 0.5,
  });
  const [snapToObjects, setSnapToObjects] = useState(true);
  const [walkableGridOpacity, setWalkableGridOpacity] = useState(0.3);
  const [showRulers, setShowRulers] = useState(false);
  const [showGridDialog, setShowGridDialog] = useState(false);
  const [showResizeDialog, setShowResizeDialog] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    elementId: string;
    x: number;
    y: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    stageRef,
    scale,
    position,
    stageSize,
    handleWheel,
    handleDragEnd,
    zoomReset,
  } = useCanvasControls(containerRef);

  // Derived selection helpers
  const selectedElements = useMemo(
    () => data.elements.filter((el) => selectedIds.has(el.id)),
    [data.elements, selectedIds]
  );
  const selectedElement = selectedElements.length === 1 ? selectedElements[0] : null;
  const hasSelection = selectedIds.size > 0;
  const isMultiSelect = selectedIds.size > 1;

  // Selection helpers
  const selectOne = useCallback((id: string) => {
    setSelectedIds(new Set([id]));
  }, []);

  const selectNone = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(
      data.elements
        .filter((el) => (el.layer ?? ELEMENT_TYPE_TO_LAYER[el.type]) === activeLayerId)
        .map((el) => el.id)
    ));
  }, [data.elements, activeLayerId]);

  const selectMany = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  // Clipboard
  const { copy, paste, hasBuffer } = useClipboard();

  // Pathing tool
  const isPathingMode = activeLayerId === "pathing";
  const pathingTool = usePathingTool({
    stageRef,
    position,
    scale,
    grid: data.walkableLayer,
    activePathingTool,
    onPaintStroke: setWalkableCells,
    onRectFill: setWalkableCellRange,
  });

  // Measure tool
  const measure = useMeasureTool({
    stageRef,
    position,
    scale,
    isActive: activeTool === "measure",
  });

  // Scale calibration
  const calibration = useCalibration({
    stageRef,
    position,
    scale,
    isActive: isCalibrating,
    onComplete: (cal) => {
      setCalibration(cal);
      setIsCalibrating(false);
    },
  });

  const handleStartCalibration = useCallback(() => {
    setIsCalibrating(true);
    calibration.start();
  }, [calibration]);

  const handleCancelCalibration = useCallback(() => {
    calibration.handleCancel();
    setIsCalibrating(false);
  }, [calibration]);

  // Escape key cancels calibration mode
  useEffect(() => {
    if (!isCalibrating) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancelCalibration();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCalibrating, handleCancelCalibration]);

  const handleCopy = useCallback(() => {
    if (selectedElements.length > 0) copy(selectedElements);
  }, [selectedElements, copy]);

  const handlePaste = useCallback(() => {
    const newElements = paste();
    if (newElements.length > 0) {
      for (const el of newElements) addElement(el);
      setSelectedIds(new Set(newElements.map((el) => el.id)));
    }
  }, [paste, addElement]);

  const handleDuplicate = useCallback(() => {
    if (selectedElements.length > 0) {
      copy(selectedElements);
      const newElements = paste();
      if (newElements.length > 0) {
        for (const el of newElements) addElement(el);
        setSelectedIds(new Set(newElements.map((el) => el.id)));
      }
    }
  }, [selectedElements, copy, paste, addElement]);

  const handleDeselect = useCallback(() => {
    selectNone();
  }, [selectNone]);

  const handleDelete = useCallback(() => {
    if (hasSelection) {
      deleteElements(selectedIds);
      selectNone();
    }
  }, [hasSelection, selectedIds, deleteElements, selectNone]);

  useKeyboardShortcuts({
    setActiveTool,
    onDeselect: handleDeselect,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onDuplicate: handleDuplicate,
    onSelectAll: selectAll,
    onUndo: undo,
    onRedo: redo,
    isPathingMode,
    setPathingTool: setActivePathingTool,
  });

  // Options bar: show selected element's colors or defaults
  const activeDefaults: DrawingDefaults = selectedElement
    ? {
        fill: selectedElement.properties.color,
        stroke:
          selectedElement.geometry.shape === "line"
            ? selectedElement.properties.color
            : selectedElement.properties.strokeColor || "#888888",
        strokeWidth:
          selectedElement.properties.strokeWidth ??
          (selectedElement.geometry.shape === "line" ? 2 : 1),
      }
    : defaults;

  const handleDefaultsChange = useCallback(
    (updates: Partial<DrawingDefaults>) => {
      setDefaults((prev) => ({ ...prev, ...updates }));

      // Update all selected elements
      for (const id of selectedIds) {
        const el = data.elements.find((e) => e.id === id);
        if (!el) continue;
        const isLine = el.geometry.shape === "line";
        if (updates.fill !== undefined) {
          updateProperties(id, { color: updates.fill });
        }
        if (updates.stroke !== undefined) {
          if (isLine) {
            updateProperties(id, { color: updates.stroke });
          } else {
            updateProperties(id, { strokeColor: updates.stroke });
          }
        }
        if (updates.strokeWidth !== undefined) {
          updateProperties(id, { strokeWidth: updates.strokeWidth });
        }
      }
    },
    [selectedIds, data.elements, updateProperties]
  );

  const handleDrawEnd = useCallback(
    (x: number, y: number, width: number, height: number) => {
      const id = uuidv4();

      if (activeTool === "booth") {
        addElement({
          id,
          type: "booth",
          geometry: { shape: "rect" as const, x, y, width, height },
          properties: {
            name: "Booth",
            color: defaults.fill,
            strokeColor: defaults.stroke,
            strokeWidth: defaults.strokeWidth,
            zIndex: 1,
            area: width * height,
          },
        });
      } else {
        const geometry =
          activeTool === "ellipse"
            ? { shape: "ellipse" as const, x, y, radiusX: width / 2, radiusY: height / 2 }
            : { shape: "rect" as const, x, y, width, height };

        addElement({
          id,
          type: "shape",
          geometry,
          properties: {
            name: "",
            color: defaults.fill,
            strokeColor: defaults.stroke,
            strokeWidth: defaults.strokeWidth,
            zIndex: 1,
          },
        });
      }
      selectOne(id);
      setActiveTool("select");
    },
    [activeTool, addElement, defaults, selectOne]
  );

  const handleLineDrawEnd = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      const id = uuidv4();
      const anchorX = (x1 + x2) / 2;
      const anchorY = (y1 + y2) / 2;

      addElement({
        id,
        type: "shape",
        geometry: {
          shape: "line",
          x: anchorX,
          y: anchorY,
          points: [x1 - anchorX, y1 - anchorY, x2 - anchorX, y2 - anchorY],
        },
        properties: {
          name: activeTool === "arrow" ? "Arrow" : "Line",
          color: defaults.stroke,
          strokeWidth: defaults.strokeWidth,
          zIndex: 1,
          ...(activeTool === "arrow" && {
            arrowHead: { style: "triangle" as const, size: 12 },
          }),
        },
      });
      selectOne(id);
      setActiveTool("select");
    },
    [activeTool, addElement, defaults, selectOne]
  );

  const handleClickPlace = useCallback(
    (x: number, y: number) => {
      if (activeTool === "text") {
        const id = uuidv4();
        addElement({
          id,
          type: "label",
          geometry: { shape: "rect" as const, x, y, width: 150, height: 30 },
          properties: {
            name: "Text",
            text: "Text",
            fontSize: 16,
            fontWeight: "normal",
            textAlign: "left",
            color: defaults.fill,
            zIndex: 2,
          },
        });
        selectOne(id);
        setActiveTool("select");
      } else if (activeTool === "icon" && activeIconName) {
        const id = uuidv4();
        addElement({
          id,
          type: "icon",
          geometry: { shape: "rect" as const, x: x - 20, y: y - 20, width: 40, height: 40 },
          properties: {
            name: "Icon",
            iconName: activeIconName,
            color: defaults.fill,
            zIndex: 2,
          },
        });
        selectOne(id);
        setActiveTool("select");
        setActiveIconName(null);
      }
    },
    [activeTool, activeIconName, addElement, defaults, selectOne]
  );

  const handleEndpointMove = useCallback(
    (id: string, pointIndex: 0 | 1, x: number, y: number) => {
      const element = data.elements.find((el) => el.id === id);
      if (!element || element.geometry.shape !== "line") return;
      const geo = element.geometry;
      const newPoints = [...geo.points] as [number, number, number, number];
      if (pointIndex === 0) {
        newPoints[0] = x - geo.x;
        newPoints[1] = y - geo.y;
      } else {
        newPoints[2] = x - geo.x;
        newPoints[3] = y - geo.y;
      }
      updateElement(id, { points: newPoints });
    },
    [data.elements, updateElement]
  );

  const handleArcDrawEnd = useCallback(
    (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number) => {
      const id = uuidv4();
      addElement({
        id,
        type: "shape",
        geometry: {
          shape: "arc",
          x: x1,
          y: y1,
          points: [0, 0, cx - x1, cy - y1, x2 - x1, y2 - y1],
        },
        properties: {
          name: "Arc",
          color: defaults.stroke,
          strokeWidth: defaults.strokeWidth,
          zIndex: 1,
        },
      });
      selectOne(id);
      setActiveTool("select");
    },
    [addElement, defaults, selectOne]
  );

  const handleArcControlPointMove = useCallback(
    (id: string, pointIndex: 0 | 1 | 2, x: number, y: number) => {
      const element = data.elements.find((el) => el.id === id);
      if (!element || element.geometry.shape !== "arc") return;
      const geo = element.geometry;
      const newPoints = [...geo.points] as [number, number, number, number, number, number];
      if (pointIndex === 0) {
        // Start point
        newPoints[0] = x - geo.x;
        newPoints[1] = y - geo.y;
      } else if (pointIndex === 1) {
        // End point
        newPoints[4] = x - geo.x;
        newPoints[5] = y - geo.y;
      } else {
        // Control point
        newPoints[2] = x - geo.x;
        newPoints[3] = y - geo.y;
      }
      updateElement(id, { points: newPoints });
    },
    [data.elements, updateElement]
  );

  const handlePolygonDrawEnd = useCallback(
    (points: number[], anchorX: number, anchorY: number) => {
      const id = uuidv4();
      addElement({
        id,
        type: "shape",
        geometry: {
          shape: "polygon",
          x: anchorX,
          y: anchorY,
          points,
        },
        properties: {
          name: "Polygon",
          color: defaults.fill,
          strokeColor: defaults.stroke,
          strokeWidth: defaults.strokeWidth,
          zIndex: 1,
        },
      });
      selectOne(id);
      setActiveTool("select");
    },
    [addElement, defaults, selectOne]
  );

  const handlePolygonVertexMove = useCallback(
    (id: string, vertexIndex: number, x: number, y: number) => {
      const element = data.elements.find((el) => el.id === id);
      if (!element || element.geometry.shape !== "polygon") return;
      const geo = element.geometry;
      const newPoints = [...geo.points];
      newPoints[vertexIndex * 2] = x - geo.x;
      newPoints[vertexIndex * 2 + 1] = y - geo.y;
      updateElement(id, { points: newPoints });
    },
    [data.elements, updateElement]
  );

  const handleElementMove = useCallback(
    (id: string, x: number, y: number) => {
      updateElement(id, { x, y });
    },
    [updateElement]
  );

  const handleMultiMove = useCallback(
    (updates: Array<{ id: string; x: number; y: number }>) => {
      moveElements(updates);
    },
    [moveElements]
  );

  const handleElementResize = useCallback(
    (id: string, x: number, y: number, width: number, height: number, rotation: number) => {
      const element = data.elements.find((el) => el.id === id);
      if (element?.geometry.shape === "ellipse") {
        updateElement(id, { x, y, radiusX: width / 2, radiusY: height / 2, rotation });
      } else {
        updateElement(id, { x, y, width, height, rotation });
      }
    },
    [data.elements, updateElement]
  );

  const handleCanvasResize = useCallback(
    (newWidth: number, newHeight: number, mode: "preserve" | "scale") => {
      if (mode === "scale") {
        const scaleX = newWidth / data.dimensions.width;
        const scaleY = newHeight / data.dimensions.height;
        for (const el of data.elements) {
          const geo = el.geometry;
          if ("x" in geo && "y" in geo) {
            const updates: Record<string, number> = {
              x: geo.x * scaleX,
              y: geo.y * scaleY,
            };
            if ("width" in geo) updates.width = geo.width * scaleX;
            if ("height" in geo) updates.height = geo.height * scaleY;
            if ("radiusX" in geo) updates.radiusX = geo.radiusX * scaleX;
            if ("radiusY" in geo) updates.radiusY = geo.radiusY * scaleY;
            if ("radius" in geo) updates.radius = geo.radius * Math.min(scaleX, scaleY);
            updateElement(el.id, updates);
          }
        }
      }
      updateDimensions({ width: newWidth, height: newHeight });
    },
    [data.dimensions, data.elements, updateElement, updateDimensions]
  );

  const handleBackgroundImage = useCallback(
    (dataUrl: string, imageWidth: number, imageHeight: number, mode: "resize-canvas" | "fit-image") => {
      if (mode === "resize-canvas") {
        updateDimensions({ width: imageWidth, height: imageHeight });
        setBackgroundImage({ url: dataUrl, width: imageWidth, height: imageHeight, opacity: 0.3 });
      } else {
        setBackgroundImage({ url: dataUrl, width: data.dimensions.width, height: data.dimensions.height, opacity: 0.3 });
      }
      setShowBgDialog(false);
    },
    [data.dimensions, setBackgroundImage, updateDimensions]
  );

  const handleElementContextMenu = useCallback(
    (elementId: string, screenX: number, screenY: number) => {
      selectOne(elementId);
      setContextMenu({ elementId, x: screenX, y: screenY });
    },
    [selectOne]
  );

  const contextMenuItems: ContextMenuItem[] = (() => {
    if (!contextMenu) return [];
    const element = data.elements.find((el) => el.id === contextMenu.elementId);
    if (!element) return [];

    const config = getShapeConfig(element.geometry.shape, element.type, element.properties);
    const items: ContextMenuItem[] = [];

    // Z-ordering actions
    items.push(
      { label: "Bring to Front", onClick: () => reorderElement(contextMenu.elementId, "front") },
      { label: "Bring Forward", onClick: () => reorderElement(contextMenu.elementId, "forward") },
      { label: "Send Backward", onClick: () => reorderElement(contextMenu.elementId, "backward") },
      { label: "Send to Back", onClick: () => reorderElement(contextMenu.elementId, "back") },
    );

    items.push({ type: "divider" as const });

    for (const action of config.contextMenu) {
      switch (action) {
        case "convertToBooth":
          items.push({
            label: "Convert to Booth",
            onClick: () => updateElementType(contextMenu.elementId, "booth"),
          });
          break;
        case "delete":
          items.push({
            label: "Delete",
            danger: true,
            onClick: () => {
              deleteElement(contextMenu.elementId);
              selectNone();
            },
          });
          break;
      }
    }
    return items;
  })();

  const handleToolChange = useCallback((tool: ActiveTool) => {
    setActiveTool(tool);
    if (tool !== "select") {
      selectNone();
    }
  }, [selectNone]);

  // Canvas selection handler: supports shift+click
  const handleSelect = useCallback(
    (id: string | null, shiftKey?: boolean) => {
      if (id === null) {
        selectNone();
      } else if (shiftKey) {
        toggleSelect(id);
      } else {
        selectOne(id);
      }
    },
    [selectNone, toggleSelect, selectOne]
  );

  // Drag-select complete: select all elements in the rectangle
  const handleDragSelect = useCallback(
    (ids: string[]) => {
      selectMany(ids);
    },
    [selectMany]
  );

  // --- Auto-generation handlers ---

  const handleAutoMarkObstacles = useCallback(() => {
    const grid = data.walkableLayer;
    if (!grid) return;
    const newCells = grid.cells.map((r) => [...r]);
    for (const el of data.elements) {
      const geo = el.geometry;
      if (!("x" in geo && "y" in geo && "width" in geo && "height" in geo)) continue;
      const g = geo as { x: number; y: number; width: number; height: number };
      const startCol = Math.floor(g.x / grid.cellSize);
      const startRow = Math.floor(g.y / grid.cellSize);
      const endCol = Math.ceil((g.x + g.width) / grid.cellSize) - 1;
      const endRow = Math.ceil((g.y + g.height) / grid.cellSize) - 1;
      for (let row = Math.max(0, startRow); row <= Math.min(grid.rows - 1, endRow); row++) {
        for (let col = Math.max(0, startCol); col <= Math.min(grid.cols - 1, endCol); col++) {
          newCells[row][col] = 0;
        }
      }
    }
    setWalkableGrid({ ...grid, cells: newCells });
  }, [data.walkableLayer, data.elements, setWalkableGrid]);

  const handleAutoMarkWalkable = useCallback(() => {
    const grid = data.walkableLayer;
    if (!grid) return;
    // Start with all walkable, then mark element footprints as impassable
    const newCells = Array.from({ length: grid.rows }, () => new Array(grid.cols).fill(1));
    for (const el of data.elements) {
      const geo = el.geometry;
      if (!("x" in geo && "y" in geo && "width" in geo && "height" in geo)) continue;
      const g = geo as { x: number; y: number; width: number; height: number };
      const startCol = Math.floor(g.x / grid.cellSize);
      const startRow = Math.floor(g.y / grid.cellSize);
      const endCol = Math.ceil((g.x + g.width) / grid.cellSize) - 1;
      const endRow = Math.ceil((g.y + g.height) / grid.cellSize) - 1;
      for (let row = Math.max(0, startRow); row <= Math.min(grid.rows - 1, endRow); row++) {
        for (let col = Math.max(0, startCol); col <= Math.min(grid.cols - 1, endCol); col++) {
          newCells[row][col] = 0;
        }
      }
    }
    setWalkableGrid({ ...grid, cells: newCells });
  }, [data.walkableLayer, data.elements, setWalkableGrid]);

  const handleCellSizeChange = useCallback((size: number) => {
    if (data.walkableLayer && data.walkableLayer.cells.some((r) => r.some((c) => c === 1))) {
      if (!window.confirm("Changing grid resolution will clear your current walkable areas. Continue?")) return;
    }
    setWalkableGridResolution(size);
  }, [data.walkableLayer, setWalkableGridResolution]);

  const handleClearGrid = useCallback(() => {
    if (!window.confirm("Clear all walkable areas? This cannot be undone except via undo.")) return;
    clearWalkableGrid();
  }, [clearWalkableGrid]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        debug={debug}
        onDebugClick={() => setShowMapDebug(true)}
        onHelpClick={() => setShowHelp(true)}
        fileMenuItems={[
          {
            label: "Export as PNG",
            onClick: () => {
              const stage = stageRef.current;
              if (!stage) return;
              const dataUrl = stage.toDataURL({ pixelRatio: 2 });
              const link = document.createElement("a");
              link.download = `${data.name || "map"}.png`;
              link.href = dataUrl;
              link.click();
            },
          },
          {
            label: "Export as JSON",
            onClick: () => {
              const json = JSON.stringify(data, null, 2);
              const blob = new Blob([json], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.download = `${data.name || "map"}.json`;
              link.href = url;
              link.click();
              URL.revokeObjectURL(url);
            },
          },
          {
            label: "Import JSON",
            onClick: () => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".json";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  try {
                    const imported = JSON.parse(reader.result as string);
                    if (imported.version && imported.elements) {
                      // Replace current data by adding/removing elements
                      // Simple approach: reload the page with new data in storage
                      localStorage.setItem("map-editor:floorplan", JSON.stringify(imported));
                      window.location.reload();
                    }
                  } catch {
                    // Invalid JSON — ignore
                  }
                };
                reader.readAsText(file);
              };
              input.click();
            },
          },
          ...(debug ? [
            { type: "divider" as const },
            {
              label: "Reset Demo",
              danger: true,
              onClick: () => {
                localStorage.removeItem("map-editor:floorplan");
                window.location.reload();
              },
            },
          ] : []),
        ]}
        editMenuItems={[
          { label: "Undo", shortcut: `${modKey}Z`, disabled: !canUndo, onClick: undo },
          { label: "Redo", shortcut: `${modKey}⇧Z`, disabled: !canRedo, onClick: redo },
          { type: "divider" as const },
          { label: "Copy", shortcut: `${modKey}C`, disabled: !hasSelection, onClick: handleCopy },
          { label: "Paste", shortcut: `${modKey}V`, disabled: !hasBuffer, onClick: handlePaste },
          { label: "Duplicate", shortcut: `${modKey}D`, disabled: !hasSelection, onClick: handleDuplicate },
        ]}
        viewMenuItems={[
          {
            label: `${showRulers ? "✓ " : "   "}Show Rulers`,
            onClick: () => setShowRulers((s) => !s),
          },
          {
            label: `${gridSettings.showGrid ? "✓ " : "   "}Show Grid`,
            onClick: () => setGridSettings((s) => ({ ...s, showGrid: !s.showGrid })),
          },
          {
            label: `${gridSettings.snapToGrid ? "✓ " : "   "}Snap to Grid`,
            onClick: () => setGridSettings((s) => ({ ...s, snapToGrid: !s.snapToGrid })),
          },
          {
            label: `${snapToObjects ? "✓ " : "   "}Snap to Objects`,
            onClick: () => setSnapToObjects((s) => !s),
          },
        ]}
        toolsMenuItems={[
          {
            label: "Configure Grid...",
            onClick: () => setShowGridDialog(true),
          },
          {
            label: "Canvas Size...",
            onClick: () => setShowResizeDialog(true),
          },
          {
            label: "Set Scale...",
            onClick: handleStartCalibration,
          },
        ]}
      />
      <div className="flex flex-1 overflow-hidden">
        <ToolSidebar
          activeTool={activeTool}
          activeIconName={activeIconName}
          onToolChange={handleToolChange}
          onIconSelect={(iconId) => setActiveIconName(iconId)}
          isPathingMode={activeLayerId === "pathing"}
          activePathingTool={activePathingTool}
          onPathingToolChange={setActivePathingTool}
        />
        <div className="flex flex-col flex-1 min-w-0 min-h-0">
          {isPathingMode ? (
            <PathingOptionsBar
              cellSize={data.walkableLayer?.cellSize ?? 20}
              opacity={walkableGridOpacity}
              onCellSizeChange={handleCellSizeChange}
              onOpacityChange={setWalkableGridOpacity}
              onAutoMarkObstacles={handleAutoMarkObstacles}
              onAutoMarkWalkable={handleAutoMarkWalkable}
              onClearGrid={handleClearGrid}
            />
          ) : (
            <OptionsBar
              defaults={activeDefaults}
              config={getShapeConfig(
                selectedElement?.geometry.shape
                  ?? (activeTool === "line" || activeTool === "arrow" ? "line" : activeTool === "arc" ? "arc" : activeTool === "polygon" ? "polygon" : activeTool === "ellipse" ? "ellipse" : "rect"),
                selectedElement?.type ?? (activeTool === "booth" ? "booth" : activeTool === "text" ? "label" : activeTool === "icon" ? "icon" : undefined),
                selectedElement?.properties
              )}
              onDefaultsChange={handleDefaultsChange}
            />
          )}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-col flex-1 min-w-0">
              <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
                <Canvas
                  data={data}
                  activeTool={activeTool}
                  selectedIds={selectedIds}
                  scale={scale}
                  position={position}
                  stageSize={stageSize}
                  stageRef={stageRef}
                  containerRef={containerRef}
                  onWheel={handleWheel}
                  onDragEnd={handleDragEnd}
                  onDrawEnd={handleDrawEnd}
                  onLineDrawEnd={handleLineDrawEnd}
                  onSelect={handleSelect}
                  onDragSelect={handleDragSelect}
                  onElementMove={handleElementMove}
                  onMultiMove={handleMultiMove}
                  onEndpointMove={handleEndpointMove}
                  onArcDrawEnd={handleArcDrawEnd}
                  onArcControlPointMove={handleArcControlPointMove}
                  onPolygonDrawEnd={handlePolygonDrawEnd}
                  onPolygonVertexMove={handlePolygonVertexMove}
                  onElementResize={handleElementResize}
                  onElementContextMenu={handleElementContextMenu}
                  onClickPlace={handleClickPlace}
                  gridSettings={gridSettings}
                  snapToObjects={snapToObjects}
                  layers={layers}
                  activeLayerId={activeLayerId}
                  isPathingMode={isPathingMode && activePathingTool !== "select"}
                  walkableGridOpacity={walkableGridOpacity}
                  walkableHoverCell={isPathingMode ? pathingTool.hoverCell : null}
                  onPathingMouseDown={pathingTool.handleMouseDown}
                  onPathingMouseMove={pathingTool.handleMouseMove}
                  onPathingMouseUp={pathingTool.handleMouseUp}
                  pathingRectPreview={pathingTool.rectPreview}
                  pendingCells={pathingTool.pendingCells}
                  pendingValue={pathingTool.pendingValue}
                  isCalibrating={isCalibrating}
                  calibrationState={calibration.state}
                  existingCalibration={data.scaleCalibration}
                  onCalibrationClick={calibration.handleMouseDown}
                  onCalibrationMouseMove={calibration.handleMouseMove}
                  measureState={measure.state}
                  onMeasureMouseDown={measure.handleMouseDown}
                  onMeasureMouseMove={measure.handleMouseMove}
                  onMeasureMouseUp={measure.handleMouseUp}
                />
                <Rulers
                  visible={showRulers}
                  scale={scale}
                  position={position}
                  stageSize={stageSize}
                  dimensions={data.dimensions}
                />
                <LayerPanel
                  layers={layers}
                  activeLayerId={activeLayerId}
                  onSetActiveLayer={setActiveLayerId}
                  onToggleVisibility={toggleLayerVisibility}
                  topOffset={showRulers ? 26 : 8}
                />
              </div>
              <StatusBar
                scale={scale}
                onZoomReset={zoomReset}
                unit={data.dimensions.unit}
                isCalibrated={data.dimensions.unit !== "px" && data.dimensions.pixelsPerUnit > 0}
                onUnitChange={setDisplayUnit}
              />
            </div>
            <PropertiesPanel
              element={selectedElement}
              selectedCount={selectedIds.size}
              dimensions={data.dimensions}
              backgroundImage={data.backgroundImage}
              backgroundColor={data.backgroundColor}
              activeLayerId={activeLayerId}
              debug={debug}
              onUpdateProperties={(id, updates) => {
                if (isMultiSelect) {
                  for (const sid of selectedIds) updateProperties(sid, updates);
                } else {
                  updateProperties(id, updates);
                }
              }}
              onUpdateGeometry={updateElement}
              onDelete={(id) => {
                if (isMultiSelect) {
                  deleteElements(selectedIds);
                } else {
                  deleteElement(id);
                }
                selectNone();
              }}
              onConvertToBooth={(id) => updateElementType(id, "booth")}
              onBackgroundOpacityChange={(opacity) =>
                data.backgroundImage &&
                setBackgroundImage({ ...data.backgroundImage, opacity })
              }
              onRemoveBackground={() => setBackgroundImage(undefined)}
              onUploadBackground={() => setShowBgDialog(true)}
              onBackgroundColorChange={setBackgroundColor}
            />
          </div>
        </div>
      </div>
      {showMapDebug && (
        <MapDebugDialog data={data} onClose={() => setShowMapDebug(false)} />
      )}
      {showBgDialog && (
        <BackgroundImageDialog
          canvasWidth={data.dimensions.width}
          canvasHeight={data.dimensions.height}
          onConfirm={handleBackgroundImage}
          onClose={() => setShowBgDialog(false)}
        />
      )}
      {showGridDialog && (
        <GridSettingsDialog
          settings={gridSettings}
          onSave={setGridSettings}
          onClose={() => setShowGridDialog(false)}
        />
      )}
      {showResizeDialog && (
        <CanvasResizeDialog
          width={data.dimensions.width}
          height={data.dimensions.height}
          dimensions={data.dimensions}
          elements={data.elements}
          onConfirm={handleCanvasResize}
          onClose={() => setShowResizeDialog(false)}
        />
      )}
      {showHelp && (
        <HelpDialog onClose={() => setShowHelp(false)} />
      )}
      {calibration.state.step === "confirming" && calibration.pixelDistance != null && (
        <CalibrationDialog
          pixelDistance={calibration.pixelDistance}
          existingUnit={data.dimensions.unit}
          onConfirm={calibration.handleConfirm}
          onClose={handleCancelCalibration}
        />
      )}
      {contextMenu && contextMenuItems.length > 0 && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenuItems}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
