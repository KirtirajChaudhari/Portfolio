"use client";

import { useEffect, useRef, type RefObject } from "react";

export interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  /** Horizontal travel (px) that always counts as a swipe. */
  minDistance?: number;
  /** A shorter gesture still counts as a flick above this speed (px/ms). */
  flickVelocity?: number;
  /** Travel (px) before the gesture is committed to an axis. */
  axisLockThreshold?: number;
  enabled?: boolean;
}

type Axis = "undecided" | "horizontal" | "vertical";

interface GestureState {
  active: boolean;
  axis: Axis;
  startX: number;
  startY: number;
  startTime: number;
}

const IDLE: GestureState = {
  active: false,
  axis: "undecided",
  startX: 0,
  startY: 0,
  startTime: 0,
};

/**
 * Horizontal swipe detection that structurally CANNOT hijack vertical scroll.
 *
 * Two mechanisms guarantee that:
 *
 * 1. Every listener is registered with { passive: true } and preventDefault
 *    is never called anywhere. The browser is therefore free to begin native
 *    scrolling on the very first frame of the gesture — this hook only
 *    observes; it has no power to interfere.
 *
 * 2. Scroll-vs-swipe disambiguation is an AXIS LOCK, decided exactly once:
 *    the gesture stays "undecided" inside a small slop radius (taps and
 *    finger jitter never lock), and at the moment the finger leaves that
 *    radius the dominant axis is committed and never revisited. Horizontal
 *    must beat vertical by a 1.2× ratio, so diagonal-ish gestures resolve to
 *    "vertical" — ties go to the scroller. A gesture locked vertical can
 *    never fire a mode change, even if it drifts sideways later.
 *
 * Trigger rule on release: a deliberate drag past `minDistance`, OR a short,
 * fast flick (≥ 2× slop AND ≥ `flickVelocity`) — thumbs rarely travel 56px.
 *
 * Usage:
 *   const ref = useSwipe<HTMLDivElement>({ onSwipeLeft, onSwipeRight });
 *   <div ref={ref}>…</div>
 */
export function useSwipe<T extends HTMLElement>(
  options: UseSwipeOptions,
): RefObject<T | null> {
  const {
    minDistance = 56,
    flickVelocity = 0.5,
    axisLockThreshold = 12,
    enabled = true,
  } = options;

  const ref = useRef<T | null>(null);

  // Latest callbacks live in a ref (synced post-render) so the listener
  // effect below never re-binds just because the caller passes fresh
  // closures on every render.
  const callbacks = useRef({
    onSwipeLeft: options.onSwipeLeft,
    onSwipeRight: options.onSwipeRight,
  });
  useEffect(() => {
    callbacks.current = {
      onSwipeLeft: options.onSwipeLeft,
      onSwipeRight: options.onSwipeRight,
    };
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let gesture: GestureState = { ...IDLE };

    const onTouchStart = (e: TouchEvent) => {
      // A second finger means pinch/zoom, not a swipe — abandon the gesture.
      if (e.touches.length !== 1) {
        gesture = { ...IDLE };
        return;
      }
      const t = e.touches[0];
      if (!t) return;
      gesture = {
        active: true,
        axis: "undecided",
        startX: t.clientX,
        startY: t.clientY,
        startTime: performance.now(),
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      // Once an axis is locked there is nothing left to decide mid-gesture.
      if (!gesture.active || gesture.axis !== "undecided") return;
      const t = e.touches[0];
      if (!t) return;

      const dx = t.clientX - gesture.startX;
      const dy = t.clientY - gesture.startY;

      // Inside the slop radius: stay undecided (filters taps and jitter).
      if (Math.max(Math.abs(dx), Math.abs(dy)) < axisLockThreshold) return;

      // The one-shot axis decision. 1.2× bias → ties go to vertical scroll.
      gesture.axis =
        Math.abs(dx) > Math.abs(dy) * 1.2 ? "horizontal" : "vertical";
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!gesture.active) return;
      const { axis, startX, startTime } = gesture;
      gesture = { ...IDLE };

      if (axis !== "horizontal") return;

      const t = e.changedTouches[0];
      if (!t) return;

      const dx = t.clientX - startX;
      const elapsed = Math.max(performance.now() - startTime, 1);
      const velocity = Math.abs(dx) / elapsed; // px per ms

      const isSwipe =
        Math.abs(dx) >= minDistance ||
        (Math.abs(dx) >= axisLockThreshold * 2 && velocity >= flickVelocity);
      if (!isSwipe) return;

      // Finger moving left pushes content left → reveals the RIGHT panel.
      if (dx < 0) callbacks.current.onSwipeLeft?.();
      else callbacks.current.onSwipeRight?.();
    };

    const onTouchCancel = () => {
      gesture = { ...IDLE };
    };

    // passive: true everywhere is the "never hijack scroll" guarantee.
    const opts: AddEventListenerOptions = { passive: true };
    el.addEventListener("touchstart", onTouchStart, opts);
    el.addEventListener("touchmove", onTouchMove, opts);
    el.addEventListener("touchend", onTouchEnd, opts);
    el.addEventListener("touchcancel", onTouchCancel, opts);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [enabled, minDistance, flickVelocity, axisLockThreshold]);

  return ref;
}
