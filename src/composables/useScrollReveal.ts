import { onMounted, onUnmounted, type Ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type RevealMode = 'fade-up' | 'blur-in' | 'slide-left' | 'slide-right' | 'scale-up';

interface ScrollRevealOptions {
  /** Animation variant. Default `'fade-up'`. */
  mode?: RevealMode;
  /** ScrollTrigger start string. Default `'top 85%'`. */
  start?: string;
  /** Duration in seconds. Default `0.9`. */
  duration?: number;
  /** Stagger children if the ref is a container. Default `0`. */
  stagger?: number;
  /** If true, target the element's direct children instead of itself. */
  children?: boolean;
  /** Additional delay in seconds. Default `0`. */
  delay?: number;
}

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getFromVars(mode: RevealMode): gsap.TweenVars {
  switch (mode) {
    case 'fade-up':
      return { opacity: 0, y: 32 };
    case 'blur-in':
      return { opacity: 0, filter: 'blur(10px)', y: 12 };
    case 'slide-left':
      return { opacity: 0, x: -60 };
    case 'slide-right':
      return { opacity: 0, x: 60 };
    case 'scale-up':
      return { opacity: 0, scale: 0.88 };
    default:
      return { opacity: 0, y: 32 };
  }
}

function getToVars(mode: RevealMode): gsap.TweenVars {
  switch (mode) {
    case 'blur-in':
      return { opacity: 1, filter: 'blur(0px)', y: 0 };
    default:
      return { opacity: 1, x: 0, y: 0, scale: 1 };
  }
}

/**
 * Attach a GSAP ScrollTrigger reveal to a template ref.
 *
 * ```vue
 * <div ref="sectionRef">…</div>
 *
 * <script setup>
 * const sectionRef = ref<HTMLElement | null>(null);
 * useScrollReveal(sectionRef, { mode: 'fade-up', stagger: 0.06, children: true });
 * </script>
 * ```
 */
export function useScrollReveal(
  target: Ref<HTMLElement | null>,
  opts: ScrollRevealOptions = {},
) {
  const {
    mode = 'fade-up',
    start = 'top 85%',
    duration = 0.9,
    stagger = 0,
    children = false,
    delay = 0,
  } = opts;

  let ctx: gsap.Context | null = null;

  onMounted(() => {
    const el = target.value;
    if (!el) return;

    /* Reduced motion: snap to final state immediately. */
    if (reduced()) {
      const targets = children ? Array.from(el.children) : [el];
      targets.forEach((t) => {
        (t as HTMLElement).style.opacity = '1';
        (t as HTMLElement).style.transform = 'none';
        (t as HTMLElement).style.filter = 'none';
      });
      return;
    }

    ctx = gsap.context(() => {
      const targets = children ? el.children : el;

      gsap.fromTo(
        targets,
        getFromVars(mode),
        {
          ...getToVars(mode),
          duration,
          delay,
          stagger: stagger > 0 ? stagger : undefined,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: 'play none none none', // play once
          },
        },
      );
    }, el);
  });

  onUnmounted(() => {
    ctx?.revert();
  });
}
