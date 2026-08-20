<template>
  <!-- Left rail: the reference's stacked status cards, carrying real
       standing facts rather than decorative stats. -->
  <aside class="rail" aria-label="At a glance">
    <div class="rail__card">
      <span class="rail__label">Currently</span>
      <span class="rail__value">{{ siteMeta.role }}</span>
      <span class="rail__meta">{{ city }}</span>
      <span class="rail__clock">
        <span class="rail__pip" aria-hidden="true"></span>
        <time :datetime="isoTime">{{ localTime }} IST</time>
      </span>
    </div>

    <div class="rail__card">
      <span class="rail__label">{{ headline.label }}</span>
      <span class="rail__stat">{{ headline.value }}</span>
      <span class="rail__meta">{{ headline.note }}</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { siteMeta } from '../../content/shared';
import { professionalAbout } from '../../content/professional';

/* "Pune, India (IST)" — the rail shows the place, the clock shows the zone. */
const city = computed(() => siteMeta.location.replace(/\s*\(.*\)$/, ''));

const shipped = professionalAbout.stats.find((s) => s.label === 'Projects shipped');
const headline = {
  label: 'Shipped',
  value: shipped ? String(shipped.value) : '—',
  note: 'builds, each solving a real problem',
};

const now = ref(new Date());
const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const localTime = computed(() => fmt.format(now.value));
const isoTime = computed(() => now.value.toISOString());

let timer: number;
onMounted(() => {
  timer = window.setInterval(() => { now.value = new Date(); }, 30_000);
});
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
.rail {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  width: 148px;
}

.rail__card {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: var(--sp-4);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  background: var(--surface);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.rail__label {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--text-faint);
}

.rail__value {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text);
  line-height: 1.3;
}

.rail__stat {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--accent);
}

.rail__meta {
  font-size: 11px;
  line-height: 1.35;
  color: var(--text-muted);
}

.rail__clock {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}

/* Steady dot, not a blinker — it marks a live zone, not an alert. */
.rail__pip {
  width: 5px;
  height: 5px;
  border-radius: var(--r-pill);
  background: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glass);
}

@media (max-width: 900px) {
  .rail { display: none; }
}
</style>
