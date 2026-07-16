import type Lenis from "lenis";

/**
 * Module-level handle to the live Lenis instance so any component
 * (hero toggle, chapter CTAs) can smooth-scroll without prop drilling.
 */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function scrollToTarget(target: string | number, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.6 });
    return;
  }
  if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
}
