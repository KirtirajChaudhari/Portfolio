<template>
  <!-- Photography-first: the screenshots are the product, so the tile stays
       white and the UI recedes around them. -->
  <section id="projects" class="section tile--light">
    <div class="container container--grid">
      <p class="eyebrow-label eyebrow rise" :class="{ 'is-in': vis }">Projects</p>
      <div class="section-head rise" :class="{ 'is-in': vis }" style="--d: 90ms">
        <h2 class="display-md">Selected work</h2>
        <p>{{ projects.length }} builds — each solving a real problem, not filling a portfolio. Open one to read the case.</p>
      </div>
    </div>

    <!-- expandable-profile-card: image tile with a bottom-anchored caption that
         lifts on hover; clicking expands it into the case sheet. -->
    <div class="container container--grid">
      <div class="grid" :class="{ 'is-in': vis }">
        <article
          v-for="(p, i) in projects"
          :key="p.slug"
          class="grid__cell"
          :style="{ '--d': `${(i % 3) * 90 + Math.floor(i / 3) * 120}ms` }"
        >
          <button class="card" :aria-label="`Open case study: ${p.title}`" @click="open(i)">
            <img v-if="p.screenshot" :src="p.screenshot" :alt="p.title" class="card__img" loading="lazy" />
            <div v-else class="card__fallback"><span>{{ p.title.charAt(0) }}</span></div>

            <div class="card__scrim"></div>

            <span v-if="p.outcome" class="card__flag metric-chip">{{ p.outcome.split('·')[0].trim() }}</span>

            <div class="card__caption">
              <p class="card__sub">{{ p.techLine }}</p>
              <h3>{{ p.title }}</h3>
              <p class="card__oneliner">{{ p.oneLiner }}</p>
            </div>
          </button>
        </article>
      </div>
    </div>

    <!-- Expanded case study -->
    <Teleport to="body">
      <div v-if="active !== null" class="sheet" role="dialog" aria-modal="true" :aria-label="activeProject!.title">
        <div class="sheet__scrim" @click="close"></div>
        <div class="sheet__panel" @keydown.esc="close">
          <button ref="closeBtn" class="sheet__close" aria-label="Close case study" @click="close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>

          <div class="sheet__media">
            <img v-if="activeProject!.screenshot" :src="activeProject!.screenshot" :alt="activeProject!.title" />
            <div v-else class="card__fallback"><span>{{ activeProject!.title.charAt(0) }}</span></div>
          </div>

          <div class="sheet__content">
            <p class="eyebrow-label eyebrow">{{ activeProject!.techLine }}</p>
            <h3>{{ activeProject!.title }}</h3>
            <p class="sheet__oneliner">{{ activeProject!.oneLiner }}</p>

            <div class="sheet__block">
              <h4>Problem</h4>
              <p>{{ activeProject!.problem }}</p>
            </div>
            <div class="sheet__block">
              <h4>Approach</h4>
              <p>{{ activeProject!.approach }}</p>
            </div>
            <div v-if="activeProject!.stack?.length" class="sheet__block">
              <h4>Stack</h4>
              <ul class="sheet__stack">
                <li v-for="s in activeProject!.stack" :key="s.name">
                  <strong>{{ s.name }}</strong><span>{{ s.role }}</span>
                </li>
              </ul>
            </div>
            <div v-if="activeProject!.outcome" class="sheet__block">
              <h4>Outcome</h4>
              <p>{{ activeProject!.outcome }}</p>
            </div>

            <div class="sheet__actions">
              <RouterLink :to="`/projects/${activeProject!.slug}`" class="btn btn--primary" @click="close">Full case study</RouterLink>
              <a v-if="activeProject!.live" :href="activeProject!.live" target="_blank" rel="noopener" class="btn btn--ghost">Live site</a>
              <a v-if="activeProject!.github" :href="activeProject!.github" target="_blank" rel="noopener" class="btn btn--ghost">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { projectCases as projects } from '../../content/projects';
import { useReveal } from '../../composables/motion';

const vis = useReveal('projects', 0.05);
const active = ref<number | null>(null);
const closeBtn = ref<HTMLButtonElement>();

const activeProject = computed(() => (active.value === null ? null : projects[active.value]));

function open(i: number) { active.value = i; }
function close() { active.value = null; }

// Lock the page behind the sheet, and move focus into it.
watch(active, async (v) => {
  document.body.style.overflow = v === null ? '' : 'hidden';
  if (v !== null) {
    await nextTick();
    closeBtn.value?.focus();
  }
});

function onKey(e: KeyboardEvent) { if (e.key === 'Escape') close(); }
window.addEventListener('keydown', onKey);
onUnmounted(() => {
  window.removeEventListener('keydown', onKey);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.rise {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--dur-reveal) var(--ease-out),
              transform var(--dur-reveal) var(--ease-out);
  transition-delay: var(--d, 0ms);
}
.rise.is-in { opacity: 1; transform: none; }

.eyebrow-label { margin-bottom: var(--sp-3); }

/* ============================================================
   Expandable profile cards
   ============================================================ */
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-5);
}
@media (max-width: 1000px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 620px)  { .grid { grid-template-columns: minmax(0, 1fr); } }

.grid__cell {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--dur-reveal) var(--ease-out),
              transform var(--dur-reveal) var(--ease-out);
  transition-delay: var(--d);
}
.grid.is-in .grid__cell { opacity: 1; transform: none; }

/* The card is edge-to-edge photography, so it takes the system product
   shadow — the one case where a drop-shadow is allowed. */
.card {
  position: relative;
  display: block;
  width: 100%;
  height: 280px;
  overflow: hidden;
  border-radius: var(--r-lg);
  background: var(--surface-2);
  box-shadow: var(--product-shadow);
  cursor: pointer;
  text-align: left;
  transition: transform 420ms var(--ease-out);
}
.card:hover { transform: translateY(-4px); }
.card:active { transform: scale(0.98); }
.card:focus-visible { outline: 2px solid var(--accent-focus); outline-offset: 3px; }

.card__img {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 900ms cubic-bezier(0.32, 0.72, 0, 1);
}
.card:hover .card__img { transform: scale(1.05); }

.card__fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}
.card__fallback span {
  font-family: var(--font-display);
  font-size: 5rem;
  font-weight: 600;
  color: var(--text-faint);
  opacity: 0.4;
}

.card__scrim {
  position: absolute;
  inset: 0;
  /* Opaque enough at the base that captions read over light screenshots too. */
  background: linear-gradient(to top, rgba(6, 6, 12, 0.97) 0%, rgba(6, 6, 12, 0.88) 26%, rgba(6, 6, 12, 0.45) 52%, rgba(6, 6, 12, 0.12) 78%, transparent 100%);
  opacity: 0.92;
  transition: opacity 380ms var(--ease-out);
}
.card:hover .card__scrim { opacity: 1; }

/* One line, ellipsed — outcome strings vary wildly in length and a wrapping
   chip covered the screenshot underneath. */
.card__flag {
  position: absolute;
  top: var(--sp-4);
  left: var(--sp-4);
  max-width: calc(100% - 2 * var(--sp-4));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Caption sits low and lifts into place on hover. */
.card__caption {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  padding: var(--sp-5);
  transform: translateY(16px);
  transition: transform 380ms cubic-bezier(0.32, 0.72, 0, 1);
}
.card:hover .card__caption { transform: translateY(0); }

/* Caption sits over photography, so it stays light-on-dark regardless of
   which tile the grid landed on. */
.card__sub {
  font-size: 12px;
  letter-spacing: -0.01em;
  color: #2997ff;
  margin-bottom: 6px;
  /* Stack strings run long; one line keeps every caption the same height. */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card__caption h3 {
  font-family: var(--font-display);
  font-size: 1.3125rem;
  font-weight: 600;
  letter-spacing: -0.011em;
  color: #ffffff;
  line-height: 1.19;
}
.card__oneliner {
  color: #cccccc;
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: -0.016em;
  margin-top: 6px;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 420ms cubic-bezier(0.32, 0.72, 0, 1),
              opacity 320ms var(--ease-out);
}
.card:hover .card__oneliner,
.card:focus-visible .card__oneliner { max-height: 4.5rem; opacity: 1; }

/* ============================================================
   Expanded case sheet
   ============================================================ */
.sheet {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: var(--sp-5);
}
.sheet__scrim {
  position: absolute;
  inset: 0;
  background: var(--scrim);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: fade-in 300ms var(--ease-out);
}
/* A sheet floating over the page is the one place elevation is structural
   rather than decorative. */
.sheet__panel {
  position: relative;
  z-index: 1;
  display: flex;
  width: min(1040px, 100%);
  max-height: 86vh;
  background: var(--surface-solid);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lift);
  animation: sheet-in 520ms var(--ease-out);
}
@media (max-width: 860px) {
  .sheet__panel { flex-direction: column; max-height: 90vh; overflow-y: auto; }
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes sheet-in {
  from { opacity: 0; transform: translateY(28px) scale(0.96); }
  to   { opacity: 1; transform: none; }
}

/* button-icon-circular: 44px, translucent gray chip over imagery. */
.sheet__close {
  position: absolute;
  top: var(--sp-3);
  right: var(--sp-3);
  z-index: 2;
  width: 44px; height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--text);
  background: rgba(210, 210, 215, 0.64);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  cursor: pointer;
  transition: background 250ms, transform var(--dur-fast) var(--ease-out);
}
.sheet__close:hover { background: rgba(210, 210, 215, 0.85); }
.sheet__close:active { transform: scale(0.95); }
.sheet__close svg { width: 16px; height: 16px; }

.sheet__media {
  flex: 0 0 44%;
  background: var(--surface-2);
  overflow: hidden;
}
/* contain, not cover — these are UI screenshots; cropping hides the detail. */
.sheet__media img {
  width: 100%; height: 100%;
  object-fit: contain;
  padding: var(--sp-4);
}
@media (max-width: 860px) { .sheet__media { flex: 0 0 auto; aspect-ratio: 16 / 9; } }

.sheet__content {
  flex: 1;
  padding: var(--sp-7);
  overflow-y: auto;
  scrollbar-width: thin;
}
.sheet__content h3 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.8vw, 2.125rem);
  font-weight: 600;
  letter-spacing: -0.011em;
  color: var(--text);
  margin-bottom: var(--sp-2);
}
.sheet__oneliner {
  color: var(--text-muted);
  font-size: 17px;
  line-height: 1.47;
  padding-bottom: var(--sp-5);
  border-bottom: 1px solid var(--border);
}
.sheet__block { margin-top: var(--sp-5); }
.sheet__block h4 {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.016em;
  color: var(--accent);
  margin-bottom: var(--sp-2);
}
.sheet__block p {
  color: var(--text-muted);
  font-size: 17px;
  line-height: 1.47;
}
.sheet__stack { display: flex; flex-direction: column; gap: var(--sp-3); }
.sheet__stack li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: var(--sp-4);
  border-left: 1px solid var(--border);
}
.sheet__stack strong {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.022em;
  color: var(--text);
}
.sheet__stack span {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: -0.016em;
}
.sheet__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  margin-top: var(--sp-7);
  padding-top: var(--sp-5);
  border-top: 1px solid var(--border);
}

@media (prefers-reduced-motion: reduce) {
  .rise, .grid__cell { transform: none; transition: opacity 300ms ease; }
  .grid.is-in .grid__cell { transform: none; }
  .sheet__panel, .sheet__scrim { animation: none; }
  .card, .card__img, .card__caption, .card__oneliner { transition: none; }
  .card__oneliner { max-height: none; opacity: 1; }
  .card__caption { transform: none; }
}
</style>
