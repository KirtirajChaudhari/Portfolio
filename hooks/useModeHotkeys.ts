"use client";

import { useEffect } from "react";
import { useViewMode } from "@/store/useViewMode";

/**
 * Global ← / → mode switching.
 *
 * Spatial mapping matches every other input path:
 *   ArrowLeft  → professional (the left panel)
 *   ArrowRight → artistic     (the right panel)
 */

// Elements (or ancestors) whose own arrow-key behaviour must win.
const IGNORE_SELECTOR = [
  "input",
  "textarea",
  "select",
  "[contenteditable='true']",
  "[contenteditable='']",
  "[role='slider']",
  "[role='tablist']",
  "[role='tab']",
  "[role='listbox']",
  "[role='menu']",
  "[role='menubar']",
  "[role='radiogroup']",
].join(",");

function shouldIgnore(e: KeyboardEvent): boolean {
  // Modifier combos belong to the browser / OS (Alt+← is Back, ⌘+← is
  // line-start on macOS, etc.) — never intercept those.
  if (e.metaKey || e.ctrlKey || e.altKey) return true;
  // Something else on the page already claimed this keypress.
  if (e.defaultPrevented) return true;

  const target = e.target;
  if (!(target instanceof HTMLElement)) return false;

  // Never steal caret movement from text fields, or arrow-key navigation
  // from composite widgets (sliders, tabs, menus, …).
  return target.isContentEditable || target.closest(IGNORE_SELECTOR) !== null;
}

export function useModeHotkeys(enabled = true) {
  // setMode is referentially stable in zustand, so the effect binds once.
  const setMode = useViewMode((s) => s.setMode);

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (shouldIgnore(e)) return;

      // No preventDefault: the page has no horizontal overflow, so left/right
      // arrows have nothing else to do here — we stay out of the browser's way.
      setMode(e.key === "ArrowLeft" ? "professional" : "artistic");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, setMode]);
}
