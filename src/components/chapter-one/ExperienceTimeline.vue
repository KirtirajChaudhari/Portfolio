<template>
  <section id="experience" class="section tile--light">
    <div class="container container--text exp">
      <!-- career-2: centred head, filter tab group, then stacked role rows. -->
      <header class="exp__head rise" :class="{ 'is-in': vis }">
        <span class="exp__badge">Where I've worked</span>
        <h2 class="display-md">
          Four internships across <span class="exp__accent">engineering &amp; data</span>
        </h2>
        <p>Two years of shipping inside real teams — security tooling, production Django, MERN, and the data work under all of it.</p>
      </header>

      <div class="exp__tabs rise" :class="{ 'is-in': vis }" style="--d: 100ms" role="tablist" aria-label="Role categories">
        <button
          v-for="c in categories"
          :key="c.value"
          type="button"
          role="tab"
          class="exp__tab"
          :class="{ 'is-active': active === c.value }"
          :aria-selected="active === c.value"
          @click="active = c.value"
        >
          {{ c.label }}
          <span class="exp__tab-count">{{ countFor(c.value) }}</span>
        </button>
      </div>

      <div class="exp__list">
        <a
          v-for="(r, i) in filtered"
          :key="r.id"
          :href="r.url"
          target="_blank"
          rel="noopener"
          class="exp__row"
          :style="{ '--d': `${i * 80}ms` }"
        >
          <img v-if="r.logo" :src="r.logo" :alt="r.organization" class="exp__logo" />
          <span v-else class="exp__logo exp__logo--mono">{{ r.organization.charAt(0) }}</span>

          <div class="exp__main">
            <h3>{{ r.heading }}</h3>
            <p class="exp__org">{{ r.organization }}</p>
            <p class="exp__desc">{{ r.description }}</p>

            <div class="exp__meta">
              <span class="exp__pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                {{ r.location }}
              </span>
              <span class="exp__dot" aria-hidden="true"></span>
              <span class="exp__pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Internship
              </span>
              <span class="exp__dot" aria-hidden="true"></span>
              <span class="exp__pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                {{ r.dateRange }}
              </span>
            </div>

            <div class="exp__tags">
              <span v-for="s in r.skills" :key="s" class="skill-tag">{{ s }}</span>
            </div>
          </div>

          <span class="exp__cta" aria-hidden="true">
            Visit
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 11.5 11.5 4.5" /><path d="M5.75 4.5h5.75v5.75" /></svg>
          </span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { workJourney } from '../../content/journey';
import { useReveal } from '../../composables/motion';

const vis = useReveal('experience', 0.08);

/* Company city isn't on JourneyEntry — map it here rather than widen the type. */
const locations: Record<string, string> = {
  quasar: 'Nashik, India',
  edunet: 'Remote, India',
  bitspark: 'Nashik, India',
  pci: 'Nashik, India',
};

const groups: Record<string, string> = {
  quasar: 'engineering',
  edunet: 'engineering',
  bitspark: 'engineering',
  pci: 'data',
};

const categories = [
  { label: 'All roles', value: 'all' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Data & ML', value: 'data' },
];

const active = ref('all');

const roles = workJourney.map((r) => ({
  ...r,
  location: locations[r.id] ?? 'India',
  group: groups[r.id] ?? 'engineering',
}));

const filtered = computed(() =>
  active.value === 'all' ? roles : roles.filter((r) => r.group === active.value),
);

const countFor = (v: string) => (v === 'all' ? roles.length : roles.filter((r) => r.group === v).length);
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

.exp__head {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: var(--sp-7);
}
.exp__badge {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.016em;
  color: var(--accent);
  margin-bottom: var(--sp-3);
}
.exp__head h2 { text-wrap: balance; margin-bottom: var(--sp-4); }
.exp__accent { color: var(--accent); }
.exp__head p {
  color: var(--text-muted);
  font-size: 17px;
  line-height: 1.47;
  max-width: 52ch;
}

/* Segmented tab tray. Pill radius because these are actions; the selected
   segment is a plain white capsule, not a raised one — no shadow on chrome. */
.exp__tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: fit-content;
  margin: 0 auto var(--sp-6);
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  background: var(--wash);
}
.exp__tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: var(--r-pill);
  padding: 8px 18px;
  background: none;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 14px;
  letter-spacing: -0.016em;
  color: var(--text-muted);
  transition: background var(--dur-ui) var(--ease-out), color var(--dur-ui), border-color var(--dur-ui);
}
.exp__tab:hover { color: var(--text); }
.exp__tab:active { transform: scale(0.95); }
.exp__tab.is-active {
  color: var(--text);
  background: var(--surface-solid);
  border-color: var(--border);
}
.exp__tab-count {
  font-size: 12px;
  color: var(--text-faint);
  font-variant-numeric: tabular-nums;
}
.exp__tab.is-active .exp__tab-count { color: var(--accent); }
@media (max-width: 560px) {
  .exp__tabs { flex-direction: column; width: 100%; }
  .exp__tab { width: 100%; justify-content: space-between; }
}

.exp__list { display: flex; flex-direction: column; gap: var(--sp-3); }

/* store-utility-card grammar: white, one hairline, 18px radius, no shadow. */
.exp__row {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-5);
  padding: var(--sp-5);
  border-radius: var(--r-lg);
  border: 1px solid var(--border);
  background: var(--surface-solid);
  transition: border-color 300ms var(--ease-out);
  animation: row-in 620ms var(--ease-out) both;
  animation-delay: var(--d);
}
@keyframes row-in {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: none; }
}
.exp__row:hover { border-color: var(--accent); }
.exp__row:active { transform: scale(0.995); }

.exp__logo {
  width: 44px; height: 44px;
  border-radius: var(--r-sm);
  object-fit: contain;
  background: var(--surface-2);
  padding: 5px;
  flex-shrink: 0;
}
.exp__logo--mono {
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--accent);
}

.exp__main { flex: 1; min-width: 0; }
.exp__main h3 {
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.022em;
  line-height: 1.24;
}
.exp__org {
  font-size: 14px;
  letter-spacing: -0.016em;
  color: var(--accent);
  margin-top: 2px;
}
.exp__desc {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: -0.016em;
  margin-top: var(--sp-3);
}

.exp__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: var(--sp-4);
}
.exp__pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  letter-spacing: -0.01em;
  color: var(--text-faint);
}
.exp__pill svg { width: 12px; height: 12px; flex-shrink: 0; }
.exp__dot {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--border);
  flex-shrink: 0;
}
@media (max-width: 560px) { .exp__dot { display: none; } }

.exp__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--sp-4);
}

/* Reads as an action, so it takes the pill and the single accent. */
.exp__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  align-self: center;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: var(--r-pill);
  font-size: 14px;
  letter-spacing: -0.016em;
  color: var(--accent);
  transition: background 250ms, border-color 250ms;
}
.exp__cta svg { width: 12px; height: 12px; }
.exp__row:hover .exp__cta {
  background: var(--accent-glass);
  border-color: var(--accent);
}
@media (max-width: 760px) {
  .exp__row { flex-wrap: wrap; padding: var(--sp-5); }
  .exp__cta { align-self: flex-start; }
}

@media (prefers-reduced-motion: reduce) {
  .rise { transform: none; transition: opacity 300ms ease; }
  .exp__row { animation: none; transition: none; }
}
</style>
