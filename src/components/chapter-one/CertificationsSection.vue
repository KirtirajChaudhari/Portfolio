<template>
  <!-- Utility-card grid, the store/accessories chassis: white cards, one
       hairline, 18px radius, no shadow. -->
  <section id="certifications" class="section tile--light">
    <div class="container container--grid">
      <p class="eyebrow-label eyebrow reveal" :class="{ 'is-visible': vis }">Certifications</p>
      <div class="section-head reveal" :class="{ 'is-visible': vis }">
        <h2 class="display-md">Credentials</h2>
        <p>Eight completed programs across universities, cloud platforms, and industry job simulations.</p>
      </div>

      <div class="cert-grid" :class="{ 'is-visible': vis }">
        <article
          v-for="(c, i) in certs"
          :key="c.id"
          class="glass-card cert-card"
          :style="{ '--cascade-delay': `${Math.floor(i / 4) * 120 + (i % 4) * 70}ms` }"
        >
          <div v-if="c.image" class="cert-card__shot">
            <img :src="c.image" :alt="c.title" loading="lazy" />
          </div>
          <span class="cert-card__badge" :data-tier="c.tier">{{ tierLabel[c.tier] }}</span>
          <h3>{{ c.title }}</h3>
          <span class="attribution">{{ c.provider }}</span>
          <p>{{ c.blurb }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { professionalCertifications as certs } from '../../content/professional';
import { useReveal } from '../../composables/motion';

const vis = useReveal('certifications', 0.1);

const tierLabel = {
  program: 'Program',
  platform: 'Platform',
  simulation: 'Job Simulation',
} as const;
</script>

<style scoped>
.eyebrow-label { margin-bottom: var(--sp-3); }

.cert-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--sp-5);
}
@media (max-width: 1068px) { .cert-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 834px)  { .cert-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px)  { .cert-grid { grid-template-columns: minmax(0, 1fr); } }

.cert-card {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--dur-reveal) var(--ease-out),
              transform var(--dur-reveal) var(--ease-out),
              border-color var(--dur-ui);
  transition-delay: var(--cascade-delay);
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
.cert-grid.is-visible .cert-card { opacity: 1; transform: none; }
.cert-card:hover { border-color: var(--accent); }

/* 1:1 crop at the inner image radius, per the accessories grid. */
.cert-card__shot {
  border-radius: var(--r-sm);
  overflow: hidden;
  aspect-ratio: 4/3;
  background: var(--surface-2);
  margin-bottom: var(--sp-2);
}
.cert-card__shot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--dur-scene) var(--ease-out);
}
.cert-card:hover .cert-card__shot img { transform: scale(1.04); }

.cert-card__badge {
  align-self: flex-start;
  font-size: 12px;
  letter-spacing: -0.01em;
  border-radius: var(--r-pill);
  padding: 3px 12px;
  color: var(--accent);
  border: 1px solid var(--border-accent);
}
.cert-card__badge[data-tier="simulation"] {
  color: var(--text-faint);
  border-color: var(--border);
}
.cert-card h3 {
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.24;
  letter-spacing: -0.022em;
}
.cert-card p {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: -0.016em;
  margin-top: auto;
  padding-top: var(--sp-2);
}

@media (prefers-reduced-motion: reduce) {
  .cert-card { transform: none; transition: opacity 0.3s ease; }
  .cert-grid.is-visible .cert-card { transform: none; }
  .cert-card__shot img { transition: none; }
}
</style>
