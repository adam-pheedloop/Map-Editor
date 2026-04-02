import { useCallback, useEffect } from "react";
import type { FloorPlanData, FloorPlanElement, ElementType, Geometry, ElementProperties, BackgroundImage, Dimensions, WalkableGrid, ScaleCalibration, Unit } from "../../types";
import { ELEMENT_TYPE_TO_LAYER } from "../../types";
import { createWalkableGrid } from "../utils/walkableGrid";
import { derivePixelsPerUnit } from "../../utils/unitConversion";
import { useHistory } from "./useHistory";

const STORAGE_KEY = "map-editor:floorplan";

function loadFromStorage(): FloorPlanData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FloorPlanData;
  } catch {
    return null;
  }
}

/** Ensures every element has a `layer` property, assigning from type mapping if missing. */
function backfillLayers(data: FloorPlanData): FloorPlanData {
  const needsBackfill = data.elements.some((el) => !el.layer);
  if (!needsBackfill) return data;
  return {
    ...data,
    elements: data.elements.map((el) =>
      el.layer ? el : { ...el, layer: ELEMENT_TYPE_TO_LAYER[el.type] }
    ),
  };
}

interface UseEditorStateOptions {
  persist?: boolean;
}

export function useEditorState(
  initialData: FloorPlanData,
  { persist = false }: UseEditorStateOptions = {}
) {
  const loadedData = backfillLayers(persist ? loadFromStorage() ?? initialData : initialData);
  const { present: data, set: setData, undo, redo, canUndo, canRedo } = useHistory<FloorPlanData>(loadedData);

  // Auto-save to localStorage
  useEffect(() => {
    if (!persist) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, persist]);

  const addElement = useCallback((element: FloorPlanElement) => {
    const withLayer = element.layer
      ? element
      : { ...element, layer: ELEMENT_TYPE_TO_LAYER[element.type] };
    setData((prev) => ({
      ...prev,
      elements: [...prev.elements, withLayer],
    }));
  }, []);

  const updateElement = useCallback(
    (id: string, geometry: Partial<Geometry>) => {
      setData((prev) => ({
        ...prev,
        elements: prev.elements.map((el) =>
          el.id === id
            ? { ...el, geometry: { ...el.geometry, ...geometry } as Geometry }
            : el
        ),
      }));
    },
    []
  );

  const updateProperties = useCallback(
    (id: string, properties: Partial<ElementProperties>) => {
      setData((prev) => ({
        ...prev,
        elements: prev.elements.map((el) =>
          el.id === id
            ? { ...el, properties: { ...el.properties, ...properties } }
            : el
        ),
      }));
    },
    []
  );

  const deleteElement = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
    }));
  }, []);

  const deleteElements = useCallback((ids: Set<string>) => {
    setData((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => !ids.has(el.id)),
    }));
  }, []);

  const moveElements = useCallback(
    (updates: Array<{ id: string; x: number; y: number }>) => {
      setData((prev) => {
        const updateMap = new Map(updates.map((u) => [u.id, u]));
        return {
          ...prev,
          elements: prev.elements.map((el) => {
            const update = updateMap.get(el.id);
            if (!update) return el;
            return { ...el, geometry: { ...el.geometry, x: update.x, y: update.y } as Geometry };
          }),
        };
      });
    },
    []
  );

  const updateElementType = useCallback((id: string, newType: ElementType) => {
    setData((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === id ? { ...el, type: newType } : el
      ),
    }));
  }, []);

  const setBackgroundImage = useCallback((bg: BackgroundImage | undefined) => {
    setData((prev) => ({ ...prev, backgroundImage: bg }));
  }, []);

  const updateDimensions = useCallback((dims: Partial<Dimensions>) => {
    setData((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, ...dims },
    }));
  }, []);

  const reorderElement = useCallback(
    (id: string, direction: "forward" | "backward" | "front" | "back") => {
      setData((prev) => {
        const element = prev.elements.find((el) => el.id === id);
        if (!element) return prev;

        const elLayer = element.layer ?? ELEMENT_TYPE_TO_LAYER[element.type];
        const sameLayer = prev.elements.filter(
          (el) => (el.layer ?? ELEMENT_TYPE_TO_LAYER[el.type]) === elLayer
        );
        const zValues = sameLayer.map((el) => el.properties.zIndex);

        let newZ: number;
        const curZ = element.properties.zIndex;

        switch (direction) {
          case "front":
            newZ = Math.max(...zValues) + 1;
            break;
          case "back":
            newZ = Math.min(...zValues) - 1;
            break;
          case "forward": {
            const above = zValues.filter((z) => z > curZ).sort((a, b) => a - b);
            newZ = above.length > 0 ? above[0] + 1 : curZ;
            break;
          }
          case "backward": {
            const below = zValues.filter((z) => z < curZ).sort((a, b) => b - a);
            newZ = below.length > 0 ? below[0] - 1 : curZ;
            break;
          }
        }

        if (newZ === curZ) return prev;

        return {
          ...prev,
          elements: prev.elements.map((el) =>
            el.id === id ? { ...el, properties: { ...el.properties, zIndex: newZ } } : el
          ),
        };
      });
    },
    []
  );

  const setBackgroundColor = useCallback((color: string) => {
    setData((prev) => ({ ...prev, backgroundColor: color }));
  }, []);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // --- Walkable grid mutations ---

  /** Initialize or get walkable grid, creating it lazily if needed. */
  const initWalkableGrid = useCallback(() => {
    setData((prev) => {
      if (prev.walkableLayer) return prev;
      return {
        ...prev,
        walkableLayer: createWalkableGrid(prev.dimensions.width, prev.dimensions.height),
      };
    });
  }, []);

  /** Set a single cell value. */
  const setWalkableCell = useCallback((col: number, row: number, value: 0 | 1) => {
    setData((prev) => {
      const grid = prev.walkableLayer;
      if (!grid || row < 0 || row >= grid.rows || col < 0 || col >= grid.cols) return prev;
      if (grid.cells[row][col] === value) return prev;
      const newCells = grid.cells.map((r, ri) =>
        ri === row ? r.map((c, ci) => (ci === col ? value : c)) : r
      );
      return { ...prev, walkableLayer: { ...grid, cells: newCells } };
    });
  }, []);

  /** Set a rectangular range of cells. Pushes a single undo entry. */
  const setWalkableCellRange = useCallback(
    (startCol: number, startRow: number, endCol: number, endRow: number, value: 0 | 1) => {
      setData((prev) => {
        const grid = prev.walkableLayer;
        if (!grid) return prev;
        const minCol = Math.max(0, Math.min(startCol, endCol));
        const maxCol = Math.min(grid.cols - 1, Math.max(startCol, endCol));
        const minRow = Math.max(0, Math.min(startRow, endRow));
        const maxRow = Math.min(grid.rows - 1, Math.max(startRow, endRow));
        const newCells = grid.cells.map((r, ri) => {
          if (ri < minRow || ri > maxRow) return r;
          return r.map((c, ci) => (ci >= minCol && ci <= maxCol ? value : c));
        });
        return { ...prev, walkableLayer: { ...grid, cells: newCells } };
      });
    },
    []
  );

  /** Apply a batch of cell changes as a single undo entry (used for paint strokes). */
  const setWalkableCells = useCallback(
    (changes: Array<{ col: number; row: number; value: 0 | 1 }>) => {
      setData((prev) => {
        const grid = prev.walkableLayer;
        if (!grid) return prev;
        const newCells = grid.cells.map((r) => [...r]);
        for (const { col, row, value } of changes) {
          if (row >= 0 && row < grid.rows && col >= 0 && col < grid.cols) {
            newCells[row][col] = value;
          }
        }
        return { ...prev, walkableLayer: { ...grid, cells: newCells } };
      });
    },
    []
  );

  /** Clear the entire grid (all impassable). */
  const clearWalkableGrid = useCallback(() => {
    setData((prev) => {
      const grid = prev.walkableLayer;
      if (!grid) return prev;
      return {
        ...prev,
        walkableLayer: createWalkableGrid(prev.dimensions.width, prev.dimensions.height, grid.cellSize),
      };
    });
  }, []);

  /** Change grid resolution — reinitializes the grid. */
  const setWalkableGridResolution = useCallback((cellSize: number) => {
    setData((prev) => ({
      ...prev,
      walkableLayer: createWalkableGrid(prev.dimensions.width, prev.dimensions.height, cellSize),
    }));
  }, []);

  /** Replace the entire walkable grid (for auto-generation). */
  const setWalkableGrid = useCallback((grid: WalkableGrid) => {
    setData((prev) => ({ ...prev, walkableLayer: grid }));
  }, []);

  // --- Scale calibration ---

  const setCalibration = useCallback((cal: ScaleCalibration) => {
    const ppu = derivePixelsPerUnit(cal.p1, cal.p2, cal.distance);
    setData((prev) => ({
      ...prev,
      scaleCalibration: cal,
      dimensions: { ...prev.dimensions, pixelsPerUnit: ppu, unit: cal.unit },
    }));
  }, []);

  const clearCalibration = useCallback(() => {
    setData((prev) => ({
      ...prev,
      scaleCalibration: undefined,
      dimensions: { ...prev.dimensions, pixelsPerUnit: 1, unit: "px" },
    }));
  }, []);

  /** Change the display unit while keeping calibration intact. Recomputes pixelsPerUnit for the new unit. */
  const setDisplayUnit = useCallback((newUnit: Unit) => {
    setData((prev) => {
      const cal = prev.scaleCalibration;
      if (!cal || newUnit === "px") return prev;

      // Pixel distance from the calibration reference points
      const dx = cal.p2.x - cal.p1.x;
      const dy = cal.p2.y - cal.p1.y;
      const pxDist = Math.sqrt(dx * dx + dy * dy);

      // Convert calibration distance to the new display unit
      const FEET_PER_METER = 3.28084;
      let calDistInNewUnit: number;
      if (cal.unit === newUnit) {
        calDistInNewUnit = cal.distance;
      } else if (cal.unit === "ft" && newUnit === "m") {
        calDistInNewUnit = cal.distance / FEET_PER_METER;
      } else {
        // cal.unit === "m" && newUnit === "ft"
        calDistInNewUnit = cal.distance * FEET_PER_METER;
      }

      return {
        ...prev,
        dimensions: {
          ...prev.dimensions,
          unit: newUnit,
          pixelsPerUnit: pxDist / calDistInNewUnit,
        },
      };
    });
  }, []);

  return {
    data,
    addElement,
    updateElement,
    updateProperties,
    deleteElement,
    deleteElements,
    moveElements,
    updateElementType,
    setBackgroundImage,
    reorderElement,
    setBackgroundColor,
    updateDimensions,
    clearStorage,
    // Walkable grid
    initWalkableGrid,
    setWalkableCell,
    setWalkableCellRange,
    setWalkableCells,
    clearWalkableGrid,
    setWalkableGridResolution,
    setWalkableGrid,
    // Scale calibration
    setCalibration,
    clearCalibration,
    setDisplayUnit,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
