import { onMounted, onUnmounted, provide, inject, type InjectionKey, shallowRef } from 'vue';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const LenisKey: InjectionKey<() => Lenis | null> = Symbol('lenis');

/**
 * Initialise Lenis smooth scrolling at the app root.
 * Call once in App.vue — child components use `useLenisInstance()` to
 * access the running instance (e.g. for `scrollTo`).
 */
export function useLenis() {
  const lenisRef = shallowRef<Lenis | null>(null);

  /* Expose a getter so injected code never holds a stale reference. */
  provide(LenisKey, () => lenisRef.value);

  onMounted(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // touchMultiplier: 2,  // uncomment if mobile inertia feels too weak
    });

    /* Keep ScrollTrigger in sync with Lenis's virtual scroll position. */
    lenis.on('scroll', ScrollTrigger.update);

    /* Drive Lenis from GSAP's ticker so both share the same RAF loop. */
    gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    lenisRef.value = lenis;
  });

  onUnmounted(() => {
    const lenis = lenisRef.value;
    if (lenis) {
      lenis.destroy();
      lenisRef.value = null;
    }
    /* ScrollTrigger instances clean themselves up when their triggers
       leave the DOM, but a blanket refresh after route change is cheap. */
    ScrollTrigger.getAll().forEach((st) => st.kill());
  });

  return lenisRef;
}

/**
 * Access the Lenis instance from any descendant component.
 * Returns a getter — call it to get the current instance (may be null
 * before mount or after destroy).
 */
export function useLenisInstance(): () => Lenis | null {
  return inject(LenisKey, () => null);
}
