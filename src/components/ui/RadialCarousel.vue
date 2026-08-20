<template>
  <div class="rc" :class="{ 'is-expanded': expanded }">
    <!-- Collapsed: one framed card. Click the badge to fan the ring out. -->
    <div v-show="!expanded" class="rc__center" :style="{ '--size': `${size.centre}px` }">
      <img v-if="items[activeIndex].url" :src="items[activeIndex].url" :alt="items[activeIndex].title || ''" draggable="false" />
      <!-- No exported image yet: an intentional film frame, never a stand-in photo. -->
      <FilmFrame v-else :index="activeIndex + 1" :total="items.length" large />

      <button type="button" class="rc__toggle" aria-label="Show all photos" @click="expanded = true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3" /><circle cx="12" cy="4" r="1.6" /><circle cx="12" cy="20" r="1.6" /><circle cx="4" cy="12" r="1.6" /><circle cx="20" cy="12" r="1.6" /></svg>
      </button>

      <a
        v-if="items[activeIndex].href"
        :href="items[activeIndex].href"
        target="_blank"
        rel="noopener"
        class="rc__link hand"
      >{{ items[activeIndex].title || 'View' }} ↗</a>
      <p v-else-if="items[activeIndex].title" class="rc__caption">{{ items[activeIndex].title }}</p>
    </div>

    <!-- Expanded: thumbnails on a ring you can drag to spin. -->
    <div
      v-show="expanded"
      class="rc__ring"
      :class="{ 'is-dragging': dragging }"
      @pointerdown="onDown"
    >
      <button
        v-for="(item, i) in items"
        :key="item.id"
        type="button"
        class="rc__thumb"
        :style="thumbStyle(i)"
        :aria-label="`Show ${item.title || 'photo ' + (i + 1)}`"
        @click="pick(i)"
      >
        <img v-if="item.url" :src="item.url" :alt="item.title || ''" draggable="false" />
        <FilmFrame v-else :index="i + 1" :total="items.length" />
        <Tape v-if="tape" :hue="hues[i % hues.length]" :rotate="i % 2 === 0 ? -8 : 9" :flip="i % 2 === 1" />
      </button>

      <button type="button" class="rc__close" aria-label="Close gallery" @click="expanded = false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
      </button>
      <p class="rc__hint mono-xs">Drag to spin · tap a frame</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import FilmFrame from '../chapter-two/FilmFrame.vue';
import Tape from '../chapter-two/Tape.vue';

interface GalleryItem { id: string | number; url: string; title?: string; href?: string }

const props = withDefaults(
  defineProps<{
    items: GalleryItem[];
    radius?: number;
    thumbnailSize?: number;
    centreSize?: number;
    /** Chapter-two treatment: washi tape across each pinned frame. */
    tape?: boolean;
    hues?: string[];
  }>(),
  /* radius*2 + thumbnail must stay inside .rc's height or the ring spills
     over the surrounding copy. */
  {
    radius: 176,
    thumbnailSize: 100,
    centreSize: 340,
    tape: false,
    hues: () => ['blue', 'sun', 'pink', 'leaf', 'peach', 'violet'],
  },
);

const hues = props.hues;

const expanded = ref(false);
const activeIndex = ref(0);
const rotation = ref(0);
const dragging = ref(false);

const size = reactive({ radius: props.radius, thumb: props.thumbnailSize, centre: props.centreSize });

function resize() {
  const w = window.innerWidth;
  const cap = (a: number, b: number) => Math.min(a, b);
  if (w < 400)       Object.assign(size, { radius: cap(props.radius, 108), thumb: cap(props.thumbnailSize, 66), centre: cap(props.centreSize, 244) });
  else if (w < 640)  Object.assign(size, { radius: cap(props.radius, 136), thumb: cap(props.thumbnailSize, 78), centre: cap(props.centreSize, 288) });
  else if (w < 1024) Object.assign(size, { radius: cap(props.radius, 194), thumb: cap(props.thumbnailSize, 88), centre: cap(props.centreSize, 330) });
  else               Object.assign(size, { radius: props.radius, thumb: props.thumbnailSize, centre: props.centreSize });
}

function thumbStyle(i: number) {
  const base = (i / props.items.length) * Math.PI * 2 - Math.PI / 2;
  const angle = base + (rotation.value * Math.PI) / 180;
  return {
    '--x': `${Math.cos(angle) * size.radius}px`,
    '--y': `${Math.sin(angle) * size.radius}px`,
    '--r': `${(angle * 180) / Math.PI + 90}deg`,
    '--s': `${size.thumb}px`,
    '--d': `${i * 34}ms`,
  } as Record<string, string>;
}

let lastX = 0;
let moved = 0;

/*
 * Deliberately no setPointerCapture: capturing on the ring retargets the
 * following `click`, so tapping a thumbnail would never select it. Window
 * listeners give the same drag-outside-the-element behaviour without that.
 */
function onDown(e: PointerEvent) {
  dragging.value = true;
  moved = 0;
  lastX = e.clientX;
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
}
function onMove(e: PointerEvent) {
  if (!dragging.value) return;
  const dx = e.clientX - lastX;
  lastX = e.clientX;
  moved += Math.abs(dx);
  rotation.value += dx * 0.5;
}
function onUp() {
  dragging.value = false;
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerup', onUp);
  window.removeEventListener('pointercancel', onUp);
}

// A drag that ends over a thumb shouldn't also select it.
function pick(i: number) {
  if (moved > 6) return;
  activeIndex.value = i;
  expanded.value = false;
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') expanded.value = false;
}

onMounted(() => {
  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('keydown', onKey);
});
onUnmounted(() => {
  window.removeEventListener('resize', resize);
  window.removeEventListener('keydown', onKey);
  onUp();
});
</script>

<style scoped>
.rc {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 380px;
  touch-action: pan-y;
  user-select: none;
}
@media (min-width: 640px) { .rc { height: 500px; } }

/* --- Centre card --- */
.rc__center {
  position: relative;
  width: var(--size);
  height: var(--size);
  padding: 14px;
  border-radius: 42px;
  border: 1px solid var(--border);
  background: var(--surface-solid);
  box-shadow: var(--shadow-lift);
  animation: centre-in 460ms cubic-bezier(0.34, 1.35, 0.64, 1);
}
@keyframes centre-in {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: none; }
}
.rc__center img {
  width: 100%;
  height: 100%;
  border-radius: 30px;
  object-fit: cover;
}
.rc__link {
  position: absolute;
  left: 0; right: 0;
  bottom: 22px;
  text-align: center;
  font-size: 1.25rem;
  color: var(--text-muted);
  transition: color 240ms var(--ease-out);
}
.rc__link:hover { color: var(--accent); }

.rc__caption {
  position: absolute;
  left: 0; right: 0;
  bottom: 26px;
  text-align: center;
  font-family: var(--font-body);
  font-style: italic;
  font-size: 0.9rem;
  color: var(--caption-color);
  text-shadow: var(--caption-shadow);
}

.rc__toggle,
.rc__close {
  position: absolute;
  display: grid;
  place-items: center;
  width: 38px; height: 38px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--chrome-soft);
  backdrop-filter: blur(10px);
  color: var(--text);
  cursor: pointer;
  transition: background 240ms, transform 240ms var(--ease-out), border-color 240ms;
}
.rc__toggle { top: 26px; right: 26px; }
.rc__close { top: 0; right: 0; }
.rc__toggle:hover,
.rc__close:hover { background: var(--accent); border-color: var(--accent); color: var(--bg); transform: scale(1.06); }
.rc__toggle:active,
.rc__close:active { transform: scale(0.94); }
.rc__toggle svg, .rc__close svg { width: 17px; height: 17px; }

/* --- Ring --- */
.rc__ring {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: grab;
}
.rc__ring.is-dragging { cursor: grabbing; touch-action: none; }

.rc__thumb {
  position: absolute;
  width: var(--s);
  height: var(--s);
  padding: 5px;
  border: 1px solid var(--border);
  border-radius: 24px;
  background: var(--surface-solid);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  /* Position is driven per-frame by the drag, so only opacity/scale animate in. */
  transform: translate(var(--x), var(--y)) rotate(var(--r));
  animation: thumb-in 500ms cubic-bezier(0.34, 1.45, 0.64, 1) both;
  animation-delay: var(--d);
  transition: box-shadow 240ms var(--ease-out), border-color 240ms;
}
@keyframes thumb-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.rc__thumb:hover { border-color: var(--accent); box-shadow: 0 20px 50px rgba(88, 166, 255, 0.28); }
.rc__thumb:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.rc__thumb img {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  object-fit: cover;
  pointer-events: none;
}

.rc__hint {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  border-radius: var(--r-pill);
  background: var(--chrome-soft);
  backdrop-filter: blur(6px);
  color: var(--text-faint);
  white-space: nowrap;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .rc__center, .rc__thumb { animation: none; }
}
</style>
