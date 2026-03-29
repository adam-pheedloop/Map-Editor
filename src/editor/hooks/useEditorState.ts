import { useState, useCallback } from "react";
import type { FloorPlanData, FloorPlanElement, Geometry } from "../../types";

export function useEditorState(initialData: FloorPlanData) {
  const [data, setData] = useState<FloorPlanData>(initialData);

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

  const deleteElement = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
    }));
  }, []);

  return { data, addElement, updateElement, deleteElement };
}
