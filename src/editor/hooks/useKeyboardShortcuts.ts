import { useEffect } from "react";
import type { ActiveTool } from "../types";

interface KeyboardShortcutActions {
  setActiveTool: (tool: ActiveTool) => void;
  onDeselect: () => void;
  onDelete: () => void;
}

export function useKeyboardShortcuts({
  setActiveTool,
  onDeselect,
  onDelete,
}: KeyboardShortcutActions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key.toLowerCase()) {
        case "v":
          setActiveTool("select");
          break;
        case "r":
          setActiveTool("rectangle");
          break;
        case "o":
          setActiveTool("ellipse");
          break;
        case "l":
          setActiveTool("line");
          break;
        case "b":
          setActiveTool("booth");
          break;
        case "escape":
          onDeselect();
          setActiveTool("select");
          break;
        case "delete":
        case "backspace":
          onDelete();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveTool, onDeselect, onDelete]);
}
