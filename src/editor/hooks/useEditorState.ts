import { useState, useCallback, useEffect } from "react";
import type { FloorPlanData, FloorPlanElement, ElementType, Geometry, ElementProperties, BackgroundImage, Dimensions } from "../../types";

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

interface UseEditorStateOptions {
  persist?: boolean;
}

export function useEditorState(
  initialData: FloorPlanData,
  { persist = false }: UseEditorStateOptions = {}
) {
  const [data, setData] = useState<FloorPlanData>(() => {
    if (persist) {
      const stored = loadFromStorage();
      if (stored) return stored;
    }
    return initialData;
  });

  // Auto-save to localStorage
  useEffect(() => {
    if (!persist) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, persist]);

  const addElement = useCallback((element: FloorPlanElement) => {
    setData((prev) => ({
      ...prev,
      elements: [...prev.elements, element],
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

  const clearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    data,
    addElement,
    updateElement,
    updateProperties,
    deleteElement,
    updateElementType,
    setBackgroundImage,
    updateDimensions,
    clearStorage,
  };
}
