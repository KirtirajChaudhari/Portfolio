"use client";

import Image from "next/image";
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

/** Icon headshot per TARGET side. */
const TARGET_AVATAR_SRC: Record<ViewMode, string> = {
  professional: "/avatars/professional-icon.png",
  artistic: "/avatars/artistic-icon.png",
};

const TARGET_AVATAR_ALT: Record<ViewMode, string> = {
  professional: "Professional avatar",
  artistic: "Artistic avatar",
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
      className="group flex items-center gap-3 rounded-full border border-foreground/15 bg-foreground/[0.04] py-1.5 pl-1.5 pr-4 transition-colors duration-200 hover:border-foreground/30 hover:bg-foreground/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
    >
      {/*
        Target-side icon headshot. Stays aria-hidden (decorative) so the button's
        accessible name remains exactly the visible "Switch to … side" text — see
        the semantics rationale above; alt is set only for robustness.
      */}
      <Image
        src={TARGET_AVATAR_SRC[target]}
        alt={TARGET_AVATAR_ALT[target]}
        aria-hidden="true"
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">
          Switch to
        </span>
        {/* Visible text forms the accessible name: "Switch to Artistic side". */}
        <span className="text-sm font-medium text-foreground/90">
          {TARGET_LABEL[target]}
        </span>
      </span>
      {/* Hover nudge uses transform only — never a layout property. */}
      <span
        aria-hidden="true"
        className="text-foreground/40 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
      >
        &rarr;
      </span>
    </button>
  );
}
