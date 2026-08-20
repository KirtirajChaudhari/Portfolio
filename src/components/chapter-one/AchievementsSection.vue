<template>
  <section id="achievements" class="section tile--dark-3">
    <div class="container container--text">
      <p class="eyebrow-label eyebrow reveal" :class="{ 'is-visible': vis }">Achievements</p>
      <div class="section-head reveal" :class="{ 'is-visible': vis }">
        <h2 class="display-md">Achievements &amp; recognition</h2>
        <p>{{ subheading }}</p>
      </div>

      <div class="glass-card counters reveal" :class="{ 'is-visible': vis }" style="transition-delay:80ms">
        <div v-for="(c, i) in counters" :key="c.label" class="stat-card">
          <div class="stat-card__value">{{ Math.round(shown[i]) }}{{ c.suffix || '' }}</div>
          <div class="stat-card__label">{{ c.label }}</div>
        </div>
      </div>

      <div class="ach-grid" :class="{ 'is-visible': vis }">
        <article
          v-for="(a, i) in cards"
          :key="a.id"
          class="glass-card ach-card"
          :style="{ '--zoom-delay': `${i * 130}ms` }"
        >
          <div class="ach-card__top">
            <span class="ach-card__medal" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <template v-if="a.category === 'Professional'">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </template>
                <template v-else>
                  <path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                  <path d="m2 10 10-5 10 5-10 5z" />
                </template>
              </svg>
            </span>
            <div class="ach-card__tags">
              <span class="ach-card__cat">{{ a.category }}</span>
              <span class="ach-card__year">{{ a.year }}</span>
            </div>
          </div>

          <div v-if="a.image" class="ach-card__photo">
            <img :src="a.image" :alt="a.title" loading="lazy" />
          </div>

          <h3>{{ a.title }}</h3>
          <span class="attribution">{{ a.institution }}</span>
          <p>{{ a.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import {
  professionalStatCounters as counters,
  professionalAchievementCards as cards,
  achievementsSubheading as subheading,
} from '../../content/professional';
import { useReveal, countUp } from '../../composables/motion';

const vis = useReveal('achievements', 0.1);
const shown = reactive(counters.map(() => 0));

watch(vis, (v) => {
  if (!v) return;
  counters.forEach((c, i) => countUp(c.value, 1100, (n) => { shown[i] = n; }));
});
</script>

<style scoped>
.eyebrow-label { margin-bottom: var(--sp-3); }

.counters {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  padding: 0;
  overflow: hidden;
  margin-bottom: var(--sp-8);
}
.counters .stat-card {
  padding: var(--sp-6) var(--sp-4);
  border-right: 1px solid var(--border);
}
.counters .stat-card:last-child { border-right: none; }
@media (max-width: 700px) {
  .counters { grid-template-columns: 1fr 1fr; }
  .counters .stat-card:nth-child(2n) { border-right: none; }
  .counters .stat-card:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
}

.ach-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-5);
}
@media (max-width: 860px) { .ach-grid { grid-template-columns: 1fr; } }

.ach-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--dur-reveal) var(--ease-out),
              transform var(--dur-reveal) var(--ease-out),
              border-color var(--dur-ui);
  transition-delay: var(--zoom-delay);
}
.ach-grid.is-visible .ach-card { opacity: 1; transform: none; }
.ach-card:hover { border-color: var(--accent); }

.ach-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
  margin-bottom: var(--sp-2);
}
/* The medal used to run on its own gold palette. There is one accent in this
   system, so it uses that. */
.ach-card__medal {
  width: 44px; height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--accent);
  background: var(--accent-glass);
  flex-shrink: 0;
}
.ach-card__medal svg { width: 20px; height: 20px; }

.ach-card__tags { display: flex; align-items: center; gap: var(--sp-3); }
.ach-card__cat {
  font-size: 12px;
  letter-spacing: -0.01em;
  border-radius: var(--r-pill);
  padding: 3px 12px;
  color: var(--accent);
  border: 1px solid var(--border-accent);
}
.ach-card__year {
  font-size: 12px;
  letter-spacing: -0.01em;
  color: var(--text-faint);
  font-variant-numeric: tabular-nums;
}

.ach-card__photo {
  border-radius: var(--r-sm);
  overflow: hidden;
  aspect-ratio: 16/9;
  background: var(--surface-2);
  margin-bottom: var(--sp-2);
}
.ach-card__photo img {
  width: 100%; height: 100%;
  object-fit: cover;
}

.ach-card h3 {
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.24;
  letter-spacing: -0.022em;
}
.ach-card p {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: -0.016em;
  margin-top: var(--sp-2);
}

@media (prefers-reduced-motion: reduce) {
  .ach-card { transform: none; transition: opacity 0.3s ease; }
  .ach-grid.is-visible .ach-card { transform: none; }
}
</style>
