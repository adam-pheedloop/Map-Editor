import { useEffect } from "react";
import type { ActiveTool } from "../types";

interface KeyboardShortcutActions {
  setActiveTool: (tool: ActiveTool) => void;
  onDeselect: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDuplicate: () => void;
  onSelectAll: () => void;
}

export function useKeyboardShortcuts({
  setActiveTool,
  onDeselect,
  onDelete,
  onCopy,
  onPaste,
  onDuplicate,
  onSelectAll,
}: KeyboardShortcutActions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const mod = e.metaKey || e.ctrlKey;

      if (mod) {
        switch (e.key.toLowerCase()) {
          case "c":
            e.preventDefault();
            onCopy();
            return;
          case "v":
            e.preventDefault();
            onPaste();
            return;
          case "d":
            e.preventDefault();
            onDuplicate();
            return;
          case "a":
            e.preventDefault();
            onSelectAll();
            return;
        }
      }

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
  }, [setActiveTool, onDeselect, onDelete, onCopy, onPaste, onDuplicate, onSelectAll]);
}
