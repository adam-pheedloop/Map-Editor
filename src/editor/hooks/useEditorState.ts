import { useCallback, useEffect } from "react";
import type { FloorPlanData, FloorPlanElement, ElementType, Geometry, ElementProperties, BackgroundImage, Dimensions } from "../../types";
import { ELEMENT_TYPE_TO_LAYER } from "../../types";
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
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
