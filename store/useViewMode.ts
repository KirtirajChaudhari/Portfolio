import { create } from "zustand";

/**
 * The two sides of the portfolio.
 * professional = LEFT, artistic = RIGHT (spatial model for transitions).
 */
export type ViewMode = "professional" | "artistic";

/**
 * Direction of the LAST mode change — drives the transition animation.
 */
export type SwitchDirection = "toProfessional" | "toArtistic";

interface ViewModeState {
  mode: ViewMode;
  direction: SwitchDirection;
  setMode: (next: ViewMode) => void;
  toggle: () => void;
}

const directionFor = (next: ViewMode): SwitchDirection =>
  next === "artistic" ? "toArtistic" : "toProfessional";

/**
 * Not persisted — every load starts professional. SSR-safe because
 * the default is deterministic and matches the server render.
 */
export const useViewMode = create<ViewModeState>()((set, get) => ({
  mode: "professional",
  direction: "toArtistic",

  setMode: (next) => {
    if (get().mode === next) return;
    set({ mode: next, direction: directionFor(next) });
  },

  toggle: () => {
    const { mode, setMode } = get();
    setMode(mode === "professional" ? "artistic" : "professional");
  },
}));

/**
 * Side-effect subscriber: sync `data-mode` on <html> whenever mode changes.
 * This drives all CSS custom property switching. Runs only client-side.
 */
if (typeof window !== "undefined") {
  useViewMode.subscribe((state) => {
    document.documentElement.setAttribute("data-mode", state.mode);
  });
}
