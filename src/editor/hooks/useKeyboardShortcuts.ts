import { useEffect } from "react";
import type { ActiveTool, PathingTool } from "../types";

interface KeyboardShortcutActions {
  setActiveTool: (tool: ActiveTool) => void;
  onDeselect: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDuplicate: () => void;
  onSelectAll: () => void;
  onUndo: () => void;
  onRedo: () => void;
  isPathingMode?: boolean;
  setPathingTool?: (tool: PathingTool) => void;
}

export function useKeyboardShortcuts({
  setActiveTool,
  onDeselect,
  onDelete,
  onCopy,
  onPaste,
  onDuplicate,
  onSelectAll,
  onUndo,
  onRedo,
  isPathingMode,
  setPathingTool,
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
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              onRedo();
            } else {
              onUndo();
            }
            return;
          case "y":
            e.preventDefault();
            onRedo();
            return;
        }
      }

      // Pathing mode shortcuts
      if (isPathingMode && setPathingTool) {
        switch (e.key.toLowerCase()) {
          case "v":
            setPathingTool("select");
            return;
          case "w":
            setPathingTool("paintWalkable");
            return;
          case "e":
            setPathingTool("paintImpassable");
            return;
          case "r":
            setPathingTool("rectFill");
            return;
          case "escape":
            setPathingTool("select");
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
        case "a":
          setActiveTool("arrow");
          break;
        case "b":
          setActiveTool("booth");
          break;
        case "t":
          setActiveTool("text");
          break;
        case "i":
          setActiveTool("icon");
          break;
        case "m":
          setActiveTool("measure");
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
  }, [setActiveTool, onDeselect, onDelete, onCopy, onPaste, onDuplicate, onSelectAll, onUndo, onRedo, isPathingMode, setPathingTool]);
}
