<template>
  <!-- Boot overlay: counts real load progress, then splits into vertical
       panels that wipe up and hand the stage to the hero timeline. -->
  <div v-if="mounted" class="boot" aria-hidden="true">
    <div class="boot__panels">
      <span v-for="i in PANELS" :key="i" class="boot__panel" />
    </div>

    <div ref="stageRef" class="boot__stage">
      <p class="boot__line"><span ref="markRef" class="boot__mark">{{ siteMeta.displayName }}</span></p>
      <p class="boot__line"><span ref="roleRef" class="boot__role">{{ siteMeta.role }}</span></p>

      <div class="boot__rule"><span ref="barRef" class="boot__bar" /></div>
    </div>

    <span ref="counterRef" class="boot__counter">{{ padded }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { gsap } from 'gsap';
import { siteMeta } from '../../content/shared';
import { useLenisInstance } from '../../composables/useLenis';
import { finishBoot } from '../../composables/useBoot';

const PANELS = 5;

const stageRef = ref<HTMLElement | null>(null);
const markRef = ref<HTMLElement | null>(null);
const roleRef = ref<HTMLElement | null>(null);
const barRef = ref<HTMLElement | null>(null);
const counterRef = ref<HTMLElement | null>(null);

const progress = ref(0);
const padded = computed(() => String(Math.round(progress.value)).padStart(3, '0'));

/* Reduced motion never mounts the overlay — nothing to skip past. */
const mounted = ref(
  typeof window === 'undefined' ||
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
);

const getLenis = useLenisInstance();

/* Resolves when fonts and subresources are actually in. */
function pageReady(): Promise<void> {
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const load = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise<void>((r) => window.addEventListener('load', () => r(), { once: true }));
  return Promise.all([fonts, load]).then(() => undefined);
}

onMounted(async () => {
  if (!mounted.value) {
    finishBoot();
    return;
  }

  /* The page must not move underneath the curtain, and a reload mid-page
     must not boot into the middle of the document. */
  document.documentElement.classList.add('is-booting');
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  /* Lenis is created in the parent's mounted hook, which runs after this one. */
  requestAnimationFrame(() => getLenis()?.stop());

  const counter = { v: 0 };

  /* Intro: masked lines rise, counter climbs to 90 on its own clock. */
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .fromTo([markRef.value, roleRef.value],
      { yPercent: 110 },
      { yPercent: 0, duration: 1, stagger: 0.09 }, 0.1)
    .fromTo(counterRef.value, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.1)
    .to(counter, {
      v: 90,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => { progress.value = counter.v; },
    }, 0)
    .fromTo(barRef.value, { scaleX: 0 }, { scaleX: 0.9, duration: 1.6, ease: 'power2.out' }, 0);

  await Promise.all([pageReady(), intro.then()]);

  /* Handoff: last 10% is the real one, then the curtain leaves. */
  await gsap.timeline({ defaults: { ease: 'power2.inOut' } })
    .to(counter, {
      v: 100,
      duration: 0.45,
      onUpdate: () => { progress.value = counter.v; },
    }, 0)
    .to(barRef.value, { scaleX: 1, duration: 0.45 }, 0)
    .to([stageRef.value, counterRef.value], {
      opacity: 0,
      y: -18,
      duration: 0.5,
      ease: 'power2.in',
    }, 0.5)
    .to('.boot__panel', {
      yPercent: -100,
      duration: 0.9,
      stagger: 0.055,
      ease: 'expo.inOut',
    }, 0.7)
    .then();

  document.documentElement.classList.remove('is-booting');
  getLenis()?.start();
  finishBoot();
  mounted.value = false;
});
</script>

<style scoped>
.boot {
  position: fixed;
  inset: 0;
  z-index: var(--z-boot);
  display: grid;
  place-items: center;
  pointer-events: none;
}

/* Each panel is its own curtain slice; the stagger makes the wipe read
   as a shutter rather than a single sheet. */
.boot__panels {
  position: absolute;
  inset: 0;
  display: flex;
}
.boot__panel {
  flex: 1;
  background: #0a0a0b;
  /* Overdraw downward so sub-pixel gaps never flash the page. */
  margin-bottom: -1px;
}

.boot__stage {
  position: relative;
  text-align: center;
  padding: 0 var(--sp-5);
}

/* Mask: the child slides inside this, so the type appears from nothing. */
.boot__line {
  overflow: hidden;
  line-height: 1.1;
}
.boot__mark,
.boot__role {
  display: block;
  color: #f5f5f0;
  will-change: transform;
}
.boot__mark {
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 4.25rem);
  font-weight: 600;
  letter-spacing: -0.03em;
}
.boot__role {
  margin-top: var(--sp-2);
  font-family: var(--font-mono);
  font-size: clamp(0.7rem, 1.3vw, 0.8125rem);
  text-transform: uppercase;
  letter-spacing: 0.24em;
  color: #8e8e93;
}

.boot__rule {
  margin: var(--sp-6) auto 0;
  width: min(280px, 52vw);
  height: 1px;
  background: rgba(255, 255, 255, 0.14);
}
.boot__bar {
  display: block;
  height: 100%;
  background: #f5f5f0;
  transform-origin: left center;
  transform: scaleX(0);
}

.boot__counter {
  position: absolute;
  right: var(--sp-6);
  bottom: var(--sp-5);
  font-family: var(--font-mono);
  font-size: clamp(2.5rem, 9vw, 5rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
  color: #f5f5f0;
  opacity: 0;
}

@media (max-width: 640px) {
  .boot__counter { right: var(--sp-5); }
}
</style>
