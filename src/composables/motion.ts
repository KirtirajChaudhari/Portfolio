import { ref, onMounted, type Ref } from 'vue';

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Flips true the first time `#id` scrolls into view. Drives the `.reveal` classes. */
export function useReveal(id: string, threshold = 0.12): Ref<boolean> {
  const visible = ref(false);
  onMounted(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true;
        observer.disconnect();
      }
    }, { threshold });
    observer.observe(el);
  });
  return visible;
}

/** Eased 0 → `to` tween. Snaps straight to the value under reduced motion. */
export function countUp(to: number, duration: number, onFrame: (v: number) => void) {
  if (reduced()) return onFrame(to);
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    onFrame(to * (1 - Math.pow(1 - t, 3))); // ease-out cubic
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
