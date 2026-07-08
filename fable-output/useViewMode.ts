import { create } from "zustand";

/**
 * The two sides of the portfolio.
 *
 * Spatial model used consistently everywhere (transition offsets, swipe
 * direction, arrow keys, hint dots):
 *
 *     professional = LEFT panel        artistic = RIGHT panel
 */
export type ViewMode = "professional" | "artistic";

/**
 * Direction of the LAST mode change. This is what makes the transition
 * directional: ModeSwitcher reads it to decide which side each view
 * enters from / exits to.
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
 * Design decisions:
 *
 * - Deliberately NOT wrapped in zustand's `persist` middleware. A recruiter
 *   opening any link must always land on the professional side, so the
 *   default survives reloads by simply never being saved. This also
 *   guarantees SSR markup and first client render agree (mode is
 *   deterministic), so there is no hydration flicker to paper over.
 *
 * - `direction` lives IN the store rather than being derived in the
 *   transition layer, so every input path — toggle click, swipe, arrow key,
 *   any future programmatic setMode — produces the same directional
 *   animation with zero extra wiring at the call site.
 */
export const useViewMode = create<ViewModeState>()((set, get) => ({
  mode: "professional",

  // Placeholder until the first switch. It is never animated: ModeSwitcher
  // mounts inside <AnimatePresence initial={false}>, so the first paint is
  // static and this value only matters from the first real change onward.
  direction: "toArtistic",

  setMode: (next) => {
    // No-op guard: repeated swipes / arrow presses in the same direction
    // must not restart the animation or flip `direction` incorrectly.
    if (get().mode === next) return;
    set({ mode: next, direction: directionFor(next) });
  },

  toggle: () => {
    const { mode, setMode } = get();
    setMode(mode === "professional" ? "artistic" : "professional");
  },
}));
