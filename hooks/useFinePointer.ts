"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(pointer: fine)";

/**
 * True only on devices with a precise pointer (mouse/trackpad). False on touch
 * and during SSR/hydration — the safe default, since the follow-cursor is a
 * pointer-only enhancement. Reactive to hybrid devices toggling input type.
 * useSyncExternalStore keeps this lint-clean (no setState in an effect).
 */
export function useFinePointer(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
