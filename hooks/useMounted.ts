"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * False during SSR/hydration, true once mounted on the client. Lint-clean
 * (no setState in an effect) and the flip after hydration is what lets a
 * presence-nested `animate` play an entrance — `initial` is skipped inside
 * ViewTransition's AnimatePresence.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
