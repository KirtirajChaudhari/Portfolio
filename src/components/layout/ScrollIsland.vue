<template>
  <!-- Logo pill stays put; the island carries navigation. -->
  <RouterLink to="/" class="island-logo" :class="{ 'is-dimmed': isOpen }">
    <span class="island-logo__dot"></span>KC
  </RouterLink>

  <div class="island-rail">
    <div class="island" :class="{ 'is-open': isOpen }">
      <button
        class="island__bar"
        :aria-expanded="isOpen"
        aria-controls="island-index"
        @click="isOpen = !isOpen"
      >
        <span class="island__lead">
          <!-- Conic ring = read progress; inner disc punches out the centre. -->
          <span class="island__ring" :style="{ background: `conic-gradient(var(--accent) ${progress}%, var(--track) 0)` }">
            <span class="island__ring-core"></span>
          </span>
          <span class="island__label">Index</span>
          <span class="island__chev" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </span>
        </span>
        <span class="island__pct">{{ Math.round(progress) }}%</span>
      </button>

      <!-- Single inner child: the grid-rows 0fr→1fr collapse only works with one. -->
      <div id="island-index" class="island__panel">
        <div class="island__panel-inner">
          <div class="island__rule"></div>
          <!-- RouterLink, not a bare #hash: from /creator these must navigate
               home first, then let scrollBehavior handle the anchor. -->
          <RouterLink
            v-for="s in sections"
            :key="s.id"
            :to="{ path: '/', hash: `#${s.id}` }"
            class="island__item"
            :class="{ 'is-active': activeId === s.id }"
            :tabindex="isOpen ? 0 : -1"
            @click="isOpen = false"
          >
            <span class="island__item-dot"></span>
            {{ s.label }}
          </RouterLink>
          <div class="island__rule"></div>
          <div class="island__chapter">
            <span class="mono-xs">Chapter</span>
            <ChapterSwitch @click="isOpen = false" />
          </div>
          <a
            :href="`mailto:${siteMeta.email}`"
            class="island__cta"
            :tabindex="isOpen ? 0 : -1"
            @click="isOpen = false"
          >
            Say hello
            <span class="island__cta-pip" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 11.5 11.5 4.5" /><path d="M5.75 4.5h5.75v5.75" /></svg>
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="isOpen" class="island-scrim" @click="isOpen = false"></div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { siteMeta } from '../../content/shared';
import ChapterSwitch from '../ui/ChapterSwitch.vue';
import { useLenisInstance } from '../../composables/useLenis';

const getLenis = useLenisInstance();

const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Work Experience' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'expertise', label: 'What I Build' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

const isOpen = ref(false);
const progress = ref(0);
const activeId = ref<string | null>(null);

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const doc = document.documentElement;
    /* Lenis keeps scrollTop on the document, so this still works. */
    const max = doc.scrollHeight - doc.clientHeight;
    progress.value = max > 0 ? Math.min(100, Math.max(0, (doc.scrollTop / max) * 100)) : 0;

    // Active = last section whose top has crossed the upper third.
    const line = doc.clientHeight / 3;
    let current: string | null = null;
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el && el.getBoundingClientRect().top <= line) current = s.id;
    }
    activeId.value = current;
    ticking = false;
  });
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') isOpen.value = false;
}

let unsubLenis: (() => void) | null = null;

onMounted(() => {
  /* Try to subscribe to Lenis scroll events for best accuracy.
     Falls back to native scroll if Lenis isn't ready yet. */
  const lenis = getLenis();
  if (lenis) {
    lenis.on('scroll', onScroll);
    unsubLenis = () => lenis.off('scroll', onScroll);
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('keydown', onKey);
  onScroll();
});
onUnmounted(() => {
  if (unsubLenis) {
    unsubLenis();
  } else {
    window.removeEventListener('scroll', onScroll);
  }
  window.removeEventListener('resize', onScroll);
  window.removeEventListener('keydown', onKey);
});
</script>

<style scoped>
.island-logo {
  position: fixed;
  top: 22px;
  left: var(--sp-6);
  z-index: var(--z-nav);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 18px;
  border-radius: var(--r-pill);
  background: var(--chrome-soft);
  backdrop-filter: saturate(180%) blur(16px);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
  border: 1px solid var(--border);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text);
  transition: opacity 400ms var(--ease-out), border-color 300ms var(--ease-out);
}
.island-logo.is-dimmed { opacity: 0; pointer-events: none; }
.island-logo:hover { border-color: var(--border-accent); }
.island-logo__dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent-glow);
}

/* Rail keeps the island centred without trapping pointer events. */
.island-rail {
  position: fixed;
  top: 22px;
  left: 0;
  right: 0;
  z-index: var(--z-nav);
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.island {
  pointer-events: auto;
  width: 264px;
  border-radius: 32px;
  background: var(--chrome);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-float);
  overflow: hidden;
  /* Spring-ish curve standing in for motion's `bounce: 0.2`. */
  transition: width 620ms cubic-bezier(0.34, 1.4, 0.64, 1),
              border-radius 520ms var(--ease-out),
              box-shadow 400ms var(--ease-out);
}
.island.is-open {
  width: 400px;
  border-radius: 24px;
  box-shadow: var(--shadow-lift);
}
@media (max-width: 480px) {
  .island { width: min(264px, calc(100vw - 2 * var(--sp-5))); }
  .island.is-open { width: calc(100vw - 2 * var(--sp-5)); }
  .island-logo { left: var(--sp-5); }
}

.island__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-5);
  width: 100%;
  height: 52px;
  padding: 0 10px 0 var(--sp-4);
  background: none;
  border: none;
  cursor: pointer;
  user-select: none;
}
.island__lead { display: inline-flex; align-items: center; gap: 10px; }

.island__ring {
  position: relative;
  width: 26px; height: 26px;
  border-radius: 50%;
  flex-shrink: 0;
}
.island__ring-core {
  position: absolute;
  inset: 2.5px;
  border-radius: 50%;
  background: var(--chrome-core);
}

.island__label {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text);
}
.island__chev {
  display: grid;
  place-items: center;
  color: var(--text-faint);
  transition: transform 520ms var(--ease-out), color 250ms;
}
.island__chev svg { width: 15px; height: 15px; }
.island.is-open .island__chev { transform: rotate(180deg); }
.island__bar:hover .island__chev { color: var(--text); }

.island__pct {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
  background: var(--accent-glass);
  border-radius: var(--r-pill);
  padding: 5px 11px;
}

/* Panel: collapses via grid-rows so height animates without a measure hook.
   Requires exactly one child — extra children would size as implicit auto rows. */
.island__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 560ms var(--ease-out);
}
.island__panel-inner {
  min-height: 0;
  overflow: hidden;
  visibility: hidden;
  opacity: 0;
  transition: opacity 300ms var(--ease-out), visibility 0s linear 560ms;
}
.island.is-open .island__panel { grid-template-rows: 1fr; }
.island.is-open .island__panel-inner {
  visibility: visible;
  opacity: 1;
  transition: opacity 320ms var(--ease-out) 120ms, visibility 0s;
  padding-bottom: 10px;
}

.island__rule {
  height: 1px;
  margin: 4px 14px;
  background: var(--border);
}
.island__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  margin: 0 6px;
  border-radius: var(--r-md);
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-muted);
  transition: background 220ms var(--ease-out), color 220ms var(--ease-out);
}
.island__item:hover { background: var(--hover-wash); color: var(--text); }
.island__item-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--text-faint);
  flex-shrink: 0;
  transition: background 220ms, box-shadow 220ms, transform 220ms;
}
.island__item.is-active { color: var(--accent); }
.island__item.is-active .island__item-dot {
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent-glow);
  transform: scale(1.3);
}

.island__chapter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
  padding: var(--sp-2) 14px var(--sp-3);
}
.island__chapter span { color: var(--text-faint); }

.island__cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  margin: 6px 6px 0;
  padding: 8px 8px 8px var(--sp-4);
  border-radius: var(--r-pill);
  background: var(--accent);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: background 250ms var(--ease-out);
}
.island__cta:hover { background: var(--accent-deep); }
.island__cta-pip {
  width: 26px; height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--chrome-inset);
  transition: transform 380ms var(--ease-out);
}
.island__cta-pip svg { width: 13px; height: 13px; }
.island__cta:hover .island__cta-pip { transform: translate(2px, -2px); }

.island-scrim {
  position: fixed;
  inset: 0;
  z-index: 39;
  background: var(--scrim);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  animation: scrim-in 320ms var(--ease-out);
}
@keyframes scrim-in { from { opacity: 0; } to { opacity: 1; } }

/* Chapter One speaks Apple: SF Pro Text at nav size, sentence case, negative
   tracking. Chapter Two keeps the mono-caps chrome it was built with. */
[data-chapter='one'] .island-logo {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: -0.015em;
  text-transform: none;
}
[data-chapter='one'] .island__label,
[data-chapter='one'] .island__pct {
  font-family: var(--font-body);
  font-size: 12px;
  letter-spacing: -0.01em;
  text-transform: none;
}
[data-chapter='one'] .island__item { font-size: 14px; letter-spacing: -0.016em; }
[data-chapter='one'] .island__cta {
  font-family: var(--font-body);
  font-size: 14px;
  letter-spacing: -0.016em;
  text-transform: none;
  color: #ffffff;
}

@media (prefers-reduced-motion: reduce) {
  .island, .island__panel, .island__chev, .island__cta-pip { transition-duration: 1ms; }
  .island-scrim { animation: none; }
}
</style>
