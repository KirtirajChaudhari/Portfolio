<template>
  <!-- product-tile-parchment: the first surface change after the hero.
       The tile's colour is the divider — no rule, no border. -->
  <section id="about" class="section tile--parchment">
    <div class="container container--text">
      <h2 class="about-lede display-lg rise" :class="{ 'is-in': vis }">
        {{ about.heading }}
      </h2>

      <!-- Narrative left, portrait + counters right. -->
      <div class="bento">
        <div class="bento__copy">
          <p class="lead-airy rise" :class="{ 'is-in': vis }" style="--d: 120ms">
            {{ about.detail }}
          </p>
        </div>

        <aside class="bento__aside">
          <figure class="portrait rise" :class="{ 'is-in': vis }" style="--d: 220ms">
            <img src="/avatars/professional-full.png" :alt="`Portrait of ${fullName}`" />
          </figure>

          <div class="counters rise" :class="{ 'is-in': vis }" style="--d: 320ms">
            <div v-for="s in about.stats" :key="s.label" class="stat-card">
              <div class="stat-card__value">{{ formatStat(s) }}</div>
              <div class="stat-card__label">{{ s.label }}</div>
            </div>
          </div>
        </aside>
      </div>

      <!-- Operating principles -->
      <div class="principles">
        <article
          v-for="(p, i) in principles"
          :key="p.num"
          class="principle rise"
          :class="{ 'is-in': vis }"
          :style="`--d: ${240 + i * 110}ms`"
        >
          <span class="principle__num">{{ p.num }}</span>
          <h3 class="body-strong">{{ p.title }}</h3>
          <p>{{ p.text }}</p>
        </article>
      </div>

      <!-- Mission / Vision -->
      <div class="mv-grid">
        <div class="glass-card mv-card rise" :class="{ 'is-in': vis }" style="--d: 140ms">
          <p class="eyebrow-label eyebrow">Mission</p>
          <p>{{ mission }}</p>
        </div>
        <div class="glass-card mv-card rise" :class="{ 'is-in': vis }" style="--d: 240ms">
          <p class="eyebrow-label eyebrow">Vision</p>
          <p>{{ vision }}</p>
        </div>
      </div>

      <!-- View My Work -->
      <nav class="work-nav" aria-label="Jump to portfolio sections">
        <p class="work-nav__title rise" :class="{ 'is-in': vis }">View my work</p>
        <div class="work-nav__links" :class="{ 'is-in': vis }">
          <a v-for="l in workLinks" :key="l.href" :href="l.href" class="work-link">
            {{ l.label }}
            <span class="work-link__pip" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4.5 11.5 11.5 4.5" /><path d="M5.75 4.5h5.75v5.75" />
              </svg>
            </span>
          </a>
        </div>
      </nav>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  professionalAbout as about,
  professionalPrinciples as principles,
  professionalMission as mission,
  professionalVision as vision,
} from '../../content/professional';
import { siteMeta } from '../../content/shared';
import { useReveal } from '../../composables/motion';
import type { Stat } from '../../content/types';

const vis = useReveal('about', 0.12);
const fullName = siteMeta.fullName;

const workLinks = [
  { label: 'Work Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Certifications', href: '#certifications' },
];

function formatStat(s: Stat) {
  return s.decimals ? s.value.toFixed(s.decimals) : s.value.toString();
}
</script>

<style scoped>
/* Content arrives; it doesn't perform. Opacity and a short rise, nothing else. */
.rise {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--dur-reveal) var(--ease-out),
              transform var(--dur-reveal) var(--ease-out);
  transition-delay: var(--d, 0ms);
}
.rise.is-in { opacity: 1; transform: none; }

.about-lede { margin-bottom: var(--sp-7); }

/* --- Bento --- */
.bento {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: var(--sp-8);
  align-items: start;
}
@media (max-width: 900px) { .bento { grid-template-columns: 1fr; gap: var(--sp-7); } }

/* One long paragraph, so it gets the airy 300-weight lead treatment rather
   than body copy — that's what the weight is reserved for. */
.bento__copy p {
  color: var(--text-muted);
  max-width: var(--maxw-prose);
}

.bento__aside {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
  position: sticky;
  top: calc(52px + var(--sp-5));
}
@media (max-width: 900px) { .bento__aside { position: static; } }

/* A portrait is photography resting on a surface, so it takes the one
   documented drop-shadow. */
.portrait {
  border-radius: var(--r-lg);
  overflow: hidden;
  background: var(--surface-2);
  box-shadow: var(--product-shadow);
}
.portrait img { width: 100%; display: block; }

.counters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
}
.counters .stat-card {
  padding: var(--sp-5) var(--sp-3);
  background: var(--surface-solid);
}

/* --- Principles --- */
.principles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-6);
  margin-top: var(--sp-9);
  padding-top: var(--sp-7);
  border-top: 1px solid var(--border);
}
@media (max-width: 820px) { .principles { grid-template-columns: 1fr; gap: var(--sp-5); } }

.principle__num {
  display: block;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.016em;
  color: var(--accent);
  margin-bottom: var(--sp-3);
  font-variant-numeric: tabular-nums;
}
.principle h3 { color: var(--text); margin-bottom: var(--sp-2); }
.principle p {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: -0.016em;
}

/* --- Mission / Vision --- */
.mv-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-5);
  margin-top: var(--sp-9);
}
@media (max-width: 768px) { .mv-grid { grid-template-columns: 1fr; } }

.mv-card p:last-child {
  color: var(--text-muted);
  font-size: 17px;
  line-height: 1.47;
}

/* --- View My Work --- */
.work-nav {
  margin-top: var(--sp-9);
  padding-top: var(--sp-7);
  border-top: 1px solid var(--border);
}
.work-nav__title {
  font-size: 14px;
  letter-spacing: -0.016em;
  color: var(--text-faint);
  margin-bottom: var(--sp-5);
}
.work-nav__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
}
.work-nav__links > * {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 560ms var(--ease-out),
              transform 560ms var(--ease-out),
              background var(--dur-ui) var(--ease-out),
              border-color var(--dur-ui) var(--ease-out);
}
.work-nav__links.is-in > * { opacity: 1; transform: none; }
.work-nav__links.is-in > *:nth-child(1) { transition-delay: 180ms; }
.work-nav__links.is-in > *:nth-child(2) { transition-delay: 260ms; }
.work-nav__links.is-in > *:nth-child(3) { transition-delay: 340ms; }
.work-nav__links.is-in > *:nth-child(4) { transition-delay: 420ms; }
.work-nav__links.is-in > *:nth-child(5) { transition-delay: 500ms; }

/* Pill, because it reads as an action. */
.work-link {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  min-height: 44px;
  padding: 8px var(--sp-4);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  background: var(--surface-solid);
  color: var(--accent);
  font-size: 14px;
  letter-spacing: -0.016em;
}
.work-link__pip {
  display: grid;
  place-items: center;
  transition: transform var(--dur-ui) var(--ease-out);
}
.work-link__pip svg { width: 13px; height: 13px; }
.work-link:hover { border-color: var(--accent); }
.work-link:hover .work-link__pip { transform: translate(2px, -2px); }
.work-link:active { transform: scale(0.95); }

@media (prefers-reduced-motion: reduce) {
  .rise, .work-nav__links > * { transform: none; transition: opacity 300ms ease; }
  .work-nav__links.is-in > * { transform: none; }
}
</style>
