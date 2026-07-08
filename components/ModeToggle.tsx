"use client";

import { useViewMode, type ViewMode } from "@/store/useViewMode";

/**
 * Accessibility decision — a plain <button>, not role="switch", not aria-pressed
 * ------------------------------------------------------------------------------
 * The brief asked to choose between aria-pressed and role="switch". For THIS
 * control, the defensible answer is neither — and the reason is the labelling
 * strategy, which shows the TARGET side:
 *
 * - role="switch" announces a boolean on/off. Neither "professional" nor
 *   "artistic" is the "on" state — they are two peer modes, so aria-checked
 *   would map one side to "off" arbitrarily. Worse, a switch needs a STABLE
 *   accessible name (with only aria-checked flipping), while our visible
 *   label flips to name the target. Keeping a stable hidden name that
 *   contradicts the visible label violates WCAG 2.5.3 (Label in Name) and
 *   breaks voice-control users who say what they see.
 *
 * - aria-pressed has the same conflict: "Artistic side, toggle button, not
 *   pressed" double-signals against a label that already changed. The
 *   long-standing guidance is: if a toggle communicates state by CHANGING
 *   ITS LABEL, do not also expose a pressed state.
 *
 * - So: an action button. Its accessible name (from visible text) is exactly
 *   what activation does — "Switch to Artistic side" — and the resulting
 *   state is announced by the aria-live region in ModeSwitcher. The button
 *   lives in the stable hero frame and never unmounts, so keyboard focus is
 *   preserved across activations.
 *
 * If you later restyle this into a control that displays the CURRENT mode
 * (segmented control, labelled track), flip the semantics with it:
 * role="switch" + stable name + aria-checked, or a two-item radiogroup.
 */

const TARGET_LABEL: Record<ViewMode, string> = {
  professional: "Professional side",
  artistic: "Artistic side",
};

/** Placeholder avatar treatment per TARGET side. Swap for that side's <Image>. */
const TARGET_AVATAR_CLASS: Record<ViewMode, string> = {
  professional: "bg-gradient-to-br from-sky-400/80 to-slate-600",
  artistic: "bg-gradient-to-br from-fuchsia-400/80 to-amber-500/80",
};

export function ModeToggle() {
  const mode = useViewMode((s) => s.mode);
  const setMode = useViewMode((s) => s.setMode);

  // The pill always advertises the side you'd switch TO, not the current one.
  const target: ViewMode = mode === "professional" ? "artistic" : "professional";

  return (
    <button
      type="button"
      onClick={() => setMode(target)}
      className="group flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] py-1.5 pl-1.5 pr-4 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0C0C] motion-reduce:transition-none"
    >
      {/* Avatar slot for the TARGET side — replace with that side's image. */}
      <span
        aria-hidden="true"
        className={`h-8 w-8 shrink-0 rounded-full ${TARGET_AVATAR_CLASS[target]}`}
      />
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">
          Switch to
        </span>
        {/* Visible text forms the accessible name: "Switch to Artistic side". */}
        <span className="text-sm font-medium text-white/90">
          {TARGET_LABEL[target]}
        </span>
      </span>
      {/* Hover nudge uses transform only — never a layout property. */}
      <span
        aria-hidden="true"
        className="text-white/40 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
      >
        &rarr;
      </span>
    </button>
  );
}
