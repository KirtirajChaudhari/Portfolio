<template>
  <!-- The first dark tile. Its surface tokens invert, so every card, chip and
       hairline below re-grounds without knowing it moved. -->
  <section id="education" class="section tile--dark">
    <div class="container container--text edu">
      <!-- career-3: centred head, pill tab group, grid of raised cards with a
           detached footer row carrying the result and institution. -->
      <header class="edu__head rise" :class="{ 'is-in': vis }">
        <span class="edu__badge">Academic journey</span>
        <h2 class="display-md">Education</h2>
        <p>From a CBSE gurukul in Savda to a postgraduate AI &amp; ML specialisation in Pune.</p>
      </header>

      <div class="edu__tabs rise" :class="{ 'is-in': vis }" style="--d: 100ms" role="tablist" aria-label="Education levels">
        <button
          v-for="d in departments"
          :key="d.value"
          type="button"
          role="tab"
          class="edu__tab"
          :class="{ 'is-active': active === d.value }"
          :aria-selected="active === d.value"
          @click="active = d.value"
        >
          {{ d.label }}
        </button>
      </div>

      <div class="edu__grid">
        <article v-for="(e, i) in filtered" :key="e.id" class="edu__card" :style="{ '--d': `${i * 90}ms` }">
          <div class="edu__card-top">
            <div class="edu__card-row">
              <span class="edu__type">{{ e.dateRange === 'Current' ? 'In progress' : 'Completed' }}</span>
              <a :href="e.url" target="_blank" rel="noopener" class="edu__ext" :aria-label="`Visit ${e.organization}`">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 11.5 11.5 4.5" /><path d="M5.75 4.5h5.75v5.75" /></svg>
              </a>
            </div>

            <div class="edu__card-id">
              <span class="edu__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" /><path d="m2 10 10-5 10 5-10 5z" /></svg>
              </span>
              <h3>{{ e.badgeLabel || e.heading }}</h3>
            </div>

            <p class="edu__desc">{{ e.description }}</p>

            <div class="edu__tags">
              <span v-for="s in e.skills" :key="s" class="edu__tag">{{ s }}</span>
            </div>
          </div>

          <div class="edu__card-foot">
            <div>
              <p class="edu__result">{{ e.dateRange }}</p>
              <p class="edu__where">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                {{ e.organization }}
              </p>
            </div>
            <img v-if="e.logo" :src="e.logo" :alt="e.organization" class="edu__logo" />
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { educationJourney } from '../../content/journey';
import { useReveal } from '../../composables/motion';

const vis = useReveal('education', 0.08);

const levels: Record<string, string> = {
  mtech: 'pg',
  be: 'ug',
  hsc: 'school',
  ssc: 'school',
};

const departments = [
  { label: 'All', value: 'all' },
  { label: 'Postgraduate', value: 'pg' },
  { label: 'Undergraduate', value: 'ug' },
  { label: 'School', value: 'school' },
];

const active = ref('all');

const entries = educationJourney.map((e) => ({ ...e, level: levels[e.id] ?? 'school' }));
const filtered = computed(() =>
  active.value === 'all' ? entries : entries.filter((e) => e.level === active.value),
);
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

.edu__head {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: var(--sp-7);
}
.edu__badge {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.016em;
  color: var(--accent);
  margin-bottom: var(--sp-3);
}
.edu__head h2 { margin-bottom: var(--sp-4); }
.edu__head p {
  color: var(--text-muted);
  font-size: 17px;
  line-height: 1.47;
  max-width: 52ch;
}

/* Fully-round tab tray. */
.edu__tabs {
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 4px;
  margin: 0 auto var(--sp-7);
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  background: var(--wash);
}
.edu__tab {
  border: none;
  background: none;
  cursor: pointer;
  border-radius: var(--r-pill);
  padding: 8px 20px;
  font-family: var(--font-body);
  font-size: 14px;
  letter-spacing: -0.016em;
  color: var(--text-muted);
  transition: background var(--dur-ui) var(--ease-out), color var(--dur-ui);
}
.edu__tab:hover { color: var(--text); }
.edu__tab:active { transform: scale(0.95); }
.edu__tab.is-active {
  background: var(--surface-solid);
  color: var(--text);
}
@media (max-width: 620px) {
  .edu__tabs { flex-wrap: wrap; justify-content: center; border-radius: var(--r-lg); }
}

.edu__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--sp-5);
}
@media (max-width: 820px) { .edu__grid { grid-template-columns: minmax(0, 1fr); } }

.edu__card {
  display: flex;
  flex-direction: column;
  border-radius: var(--r-lg);
  animation: card-in 640ms var(--ease-out) both;
  animation-delay: var(--d);
}
@keyframes card-in {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: none; }
}

/* The card body. One hairline does the work the old five-layer shadow stack
   did on the dark ground. */
.edu__card-top {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--sp-4);
  border-radius: var(--r-lg);
  padding: var(--sp-5) var(--sp-5) var(--sp-6);
  background: var(--surface-solid);
  border: 1px solid var(--border);
  transition: border-color 320ms var(--ease-out);
}
.edu__card:hover .edu__card-top { border-color: var(--accent); }

.edu__card-row { display: flex; align-items: center; justify-content: space-between; }
.edu__type {
  font-size: 12px;
  letter-spacing: -0.01em;
  color: var(--text-faint);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  padding: 3px 12px;
}
.edu__ext {
  display: grid;
  place-items: center;
  width: 22px; height: 22px;
  color: var(--text-faint);
  transition: color 240ms;
}
.edu__ext svg { width: 12px; height: 12px; }
.edu__card:hover .edu__ext { color: var(--accent); }

.edu__card-id { display: flex; align-items: center; gap: var(--sp-3); }
.edu__icon {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: var(--text);
  color: var(--bg);
}
.edu__icon svg { width: 17px; height: 17px; }
.edu__card-id h3 {
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.24;
  color: var(--text);
  letter-spacing: -0.022em;
}

.edu__desc {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: -0.016em;
}

.edu__tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; }
.edu__tag {
  font-size: 12px;
  letter-spacing: -0.01em;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  padding: 3px 12px;
}

/* Detached footer sits on the outer card, outside the raised plate. */
.edu__card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
  padding: var(--sp-4) var(--sp-5);
}
.edu__result {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.016em;
  color: var(--text);
}
.edu__where {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  letter-spacing: -0.01em;
  color: var(--text-faint);
  margin-top: 2px;
}
.edu__where svg { width: 11px; height: 11px; flex-shrink: 0; }
.edu__logo {
  width: 38px; height: 38px;
  border-radius: var(--r-sm);
  object-fit: contain;
  background: var(--wash);
  padding: 4px;
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .rise { transform: none; transition: opacity 300ms ease; }
  .edu__card { animation: none; }
}
</style>
