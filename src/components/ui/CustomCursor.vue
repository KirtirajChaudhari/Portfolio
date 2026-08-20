<template>
  <!-- The cursor is two concentric circles: an outer ring and a tiny inner dot.
       Both follow the mouse with different lag amounts for a trailing effect. -->
  <div
    v-if="!isTouchDevice"
    ref="cursorOuter"
    class="cursor-outer"
    :class="{ 'is-hovering': hovering, 'has-label': !!cursorLabel }"
  >
    <span v-if="cursorLabel" class="cursor-label">{{ cursorLabel }}</span>
  </div>
  <div v-if="!isTouchDevice" ref="cursorDot" class="cursor-dot" :class="{ 'is-hovering': hovering }" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';

const cursorOuter = ref<HTMLElement | null>(null);
const cursorDot = ref<HTMLElement | null>(null);
const hovering = ref(false);
const cursorLabel = ref('');
const isTouchDevice = ref(false);

/* Magnetic pull radius in pixels. */
const MAGNET_RADIUS = 100;
const MAGNET_STRENGTH = 0.35;

let quickX: gsap.QuickToFunc;
let quickY: gsap.QuickToFunc;
let dotQuickX: gsap.QuickToFunc;
let dotQuickY: gsap.QuickToFunc;

/* Selectors that trigger the hover-expand state. */
const INTERACTIVE = 'a, button, .btn, [data-cursor-hover], input[type="submit"]';
const LABELED = '[data-cursor-label]';

function onMouseMove(e: MouseEvent) {
  const { clientX: x, clientY: y } = e;

  /* Check for magnetic targets nearby. */
  const magnetTarget = findMagnetTarget(x, y);
  if (magnetTarget) {
    const rect = magnetTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const pull = Math.max(0, 1 - dist / MAGNET_RADIUS) * MAGNET_STRENGTH;

    quickX(x - dx * pull);
    quickY(y - dy * pull);
  } else {
    quickX(x);
    quickY(y);
  }

  dotQuickX(x);
  dotQuickY(y);
}

function findMagnetTarget(x: number, y: number): Element | null {
  const els = document.querySelectorAll('.btn, button, [data-cursor-magnet]');
  for (const el of els) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    if (dist < MAGNET_RADIUS) return el;
  }
  return null;
}

function onMouseOver(e: MouseEvent) {
  const target = (e.target as HTMLElement)?.closest?.(INTERACTIVE);
  if (target) {
    hovering.value = true;
    const labeled = (e.target as HTMLElement)?.closest?.(LABELED);
    cursorLabel.value = labeled?.getAttribute('data-cursor-label') ?? '';
  }
}

function onMouseOut(e: MouseEvent) {
  const target = (e.target as HTMLElement)?.closest?.(INTERACTIVE);
  if (target) {
    hovering.value = false;
    cursorLabel.value = '';
  }
}

function onMouseDown() {
  if (cursorOuter.value) gsap.to(cursorOuter.value, { scale: 0.85, duration: 0.15 });
  if (cursorDot.value) gsap.to(cursorDot.value, { scale: 0.7, duration: 0.15 });
}

function onMouseUp() {
  if (cursorOuter.value) gsap.to(cursorOuter.value, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
  if (cursorDot.value) gsap.to(cursorDot.value, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
}

onMounted(() => {
  /* Detect touch-only devices. */
  isTouchDevice.value = 'ontouchstart' in window && !window.matchMedia('(hover: hover)').matches;
  if (isTouchDevice.value) return;

  /* Hide the native cursor globally. */
  document.documentElement.classList.add('custom-cursor-active');

  const outer = cursorOuter.value!;
  const dot = cursorDot.value!;

  /* Position both offscreen initially. */
  gsap.set([outer, dot], { xPercent: -50, yPercent: -50 });

  /* quickTo gives us a performant, interruptible tween per axis. */
  quickX = gsap.quickTo(outer, 'x', { duration: 0.5, ease: 'power3.out' });
  quickY = gsap.quickTo(outer, 'y', { duration: 0.5, ease: 'power3.out' });
  dotQuickX = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power2.out' });
  dotQuickY = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power2.out' });

  window.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseover', onMouseOver);
  document.addEventListener('mouseout', onMouseOut);
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
});

onUnmounted(() => {
  if (isTouchDevice.value) return;
  document.documentElement.classList.remove('custom-cursor-active');
  window.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseover', onMouseOver);
  document.removeEventListener('mouseout', onMouseOut);
  window.removeEventListener('mousedown', onMouseDown);
  window.removeEventListener('mouseup', onMouseUp);
});
</script>

<style>
/* Global: hide native cursor when custom cursor is active. */
html.custom-cursor-active,
html.custom-cursor-active * {
  cursor: none !important;
}

/* Restore native cursor on touch devices (safety net). */
@media (hover: none) {
  html.custom-cursor-active,
  html.custom-cursor-active * {
    cursor: auto !important;
  }
}
</style>

<style scoped>
.cursor-outer {
  position: fixed;
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--accent, #0066cc);
  pointer-events: none;
  z-index: 99999;
  transition: width 0.4s cubic-bezier(0.23, 1, 0.32, 1),
              height 0.4s cubic-bezier(0.23, 1, 0.32, 1),
              border-color 0.3s,
              background 0.3s;
  mix-blend-mode: difference;
  will-change: transform;
  display: grid;
  place-items: center;
}

.cursor-outer.is-hovering {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.5);
}

.cursor-outer.has-label {
  width: 88px;
  height: 88px;
}

.cursor-label {
  font-family: var(--font-body, system-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  white-space: nowrap;
  opacity: 0.9;
}

.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent, #0066cc);
  pointer-events: none;
  z-index: 99999;
  mix-blend-mode: difference;
  will-change: transform;
  transition: opacity 0.3s;
}

.cursor-dot.is-hovering {
  opacity: 0;
}
</style>
