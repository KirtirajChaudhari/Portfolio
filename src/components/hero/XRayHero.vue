<template>
  <!-- Loop 2: structure only. The artistic layer sits at opacity .35 with NO
       mask so registration is checkable with the naked eye. The lens arrives
       in Loop 3; the ink spill in Loop 4. -->
  <section ref="heroRef" class="hero" data-lens>
    <!--
      REGISTRATION IS THE WHOLE TRICK, so both layers come out of ONE template.
      A second hand-written layer would drift the first time someone edits one
      side and not the other. Every box below is sized from custom properties
      declared once on .hero — no layer may hardcode a geometry value.
    -->
    <div
      v-for="layer in layers"
      :key="layer.variant"
      class="hero__layer"
      :class="`hero__layer--${layer.variant}`"
      :aria-hidden="layer.variant === 'art' || undefined"
      :inert="layer.variant === 'art' || undefined"
    >
      <div class="hero__stack">
        <p class="hero__eyebrow">{{ layer.copy.eyebrow }}</p>

        <h1 v-if="layer.variant === 'pro'" class="hero__title">{{ layer.copy.title }}</h1>
        <!-- The artistic twin is a <p>, not an <h1>: two h1s in one section is a
             document-outline bug even when one of them is aria-hidden. -->
        <p v-else class="hero__title">{{ layer.copy.title }}</p>

        <p class="hero__lead">{{ layer.copy.lead }}</p>

        <div class="hero__actions">
          <a v-if="layer.variant === 'pro'" class="hero__cta" href="#projects">
            {{ layer.copy.action }}
          </a>
          <!-- Decorative twin. Holds the slot open so the layers stay
               registered; inert, so it can never take focus. -->
          <span v-else class="hero__cta hero__cta--ghost">{{ layer.copy.action }}</span>
        </div>

        <ul class="hero__tags">
          <li v-for="tag in heroTags" :key="tag.label">
            <span class="hero__tag-label">{{ tag.label }}</span>
            <span class="hero__tag-detail">{{ tag.detail }}</span>
          </li>
          <li>
            <RouterLink v-if="layer.variant === 'pro'" class="hero__chapter-link" to="/creator">
              Chapter Two — the other half
            </RouterLink>
            <span v-else class="hero__chapter-link">Chapter Two — the other half</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Loop 3 mounts the cursor ring here. Empty and inert until then. -->
    <div class="hero__lens-ui" aria-hidden="true"></div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { heroPro, heroArt, heroTags } from '../../content/xray';

const heroRef = ref<HTMLElement | null>(null);

const layers = [
  { variant: 'pro' as const, copy: heroPro },
  { variant: 'art' as const, copy: heroArt },
];
</script>

<style scoped>
/* ============================================================
   THE REGISTRATION CONTRACT

   Every geometry value lives here, on .hero, and is consumed by both layers.
   Slot heights are explicit grid rows rather than content-driven, so the two
   stacks are identical by construction: a longer headline on one side can
   never push that side's lead, CTA or tags out of alignment with the other.
   ============================================================ */
.hero {
  /* — type scale. 44 → 96px display; leading lands on 112px (4 × 28px baseline)
       at the top of the ramp and holds a ~1.166 ratio all the way down. */
  --hero-fs: clamp(2.75rem, 7.2vw, 6rem);
  --hero-lh: clamp(3.2rem, 8.4vw, 7rem);
  --hero-track: -0.035em;
  --hero-title-lines: 2;

  --lead-fs: 1.0625rem;   /* 17px */
  --lead-lh: 1.75rem;     /* 28px — the shared baseline unit */
  --lead-lines: 4;
  --lead-measure: 46ch;

  --eyebrow-lh: 1.25rem;
  --cta-h: 3rem;
  /* The tag row is fixed too. Every grid row is now a pure function of these
     properties, so .hero__stack has one deterministic height and
     `align-content: center` cannot leak a content-length difference from the
     last row upward into every slot above it — which is exactly what it did
     at 2560px when this row was `auto`. */
  --tags-lines: 1;
  --tags-h: calc(var(--eyebrow-lh) * var(--tags-lines) + 0.5rem * (var(--tags-lines) - 1));

  /* — origin. Both layers anchor their stack to exactly these. */
  --hero-x: max(var(--sp-6), calc((100vw - var(--maxw-grid)) / 2));
  --hero-y: clamp(4.5rem, 11vh, 8rem);
  --hero-gap: 1.75rem;    /* 28px */

  /* — Clean Room (professional). docs/xray-plan.md §4 */
  --cr-ground: #f2f4f6;
  --cr-ink: #14161a;
  --cr-mute: #5a6068;
  --cr-signal: #0b63e5;
  --cr-hair: rgba(20, 22, 26, 0.1);

  /* — Safelight (artistic). One accent each, never two. */
  --sl-ground: #140a0c;
  --sl-print: #f0e4d9;
  --sl-mute: #b39c90;
  --sl-safelight: #e4465a;

  /* Shared display face. BOTH layers use it — that is what lets the two
     headlines hold the same box, and what makes a font swap harmless. */
  --hero-display: 'Inter Tight', 'Inter', system-ui, sans-serif;

  position: relative;
  min-height: 100svh;
  overflow: hidden;
  isolation: isolate;
}

.hero__layer {
  position: absolute;
  inset: 0;
  display: grid;
  align-content: center;
}

.hero__layer--pro {
  z-index: 0;
  background: var(--cr-ground);
  color: var(--cr-ink);
}

/* Loop 2 ships this unmasked at .35 so misregistration is visible to the naked
   eye. Loop 3 replaces the opacity with the SVG mask chosen in §9. */
.hero__layer--art {
  z-index: 1;
  background: var(--sl-ground);
  color: var(--sl-print);
  opacity: 0.35;
}

.hero__lens-ui {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

/* ── The stack. Identical in both layers, by construction. ────────── */
/* --hero-x is the GUTTER, and the column is sized by subtracting it rather
   than by padding a max-width box: with border-box, `max-width: 1360px` plus
   `padding-inline: 600px` leaves a 160px column at 2560px, which is what broke
   registration the first time this ran. */
.hero__stack {
  width: min(calc(100% - 2 * var(--hero-x)), var(--maxw-grid));
  margin-inline: auto;
  padding-block: var(--hero-y) var(--hero-gap);

  display: grid;
  grid-template-rows:
    var(--eyebrow-lh)
    calc(var(--hero-lh) * var(--hero-title-lines))
    calc(var(--lead-lh) * var(--lead-lines))
    var(--cta-h)
    var(--tags-h);
  gap: var(--hero-gap);
  justify-items: start;
}

.hero__eyebrow {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: var(--eyebrow-lh);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin: 0;
}

.hero__title {
  font-family: var(--hero-display);
  font-size: var(--hero-fs);
  line-height: var(--hero-lh);
  letter-spacing: var(--hero-track);
  font-weight: 600;
  margin: 0;
  max-width: 15ch;
  text-wrap: balance;
}

.hero__lead {
  font-family: var(--font-body);
  font-size: var(--lead-fs);
  line-height: var(--lead-lh);
  margin: 0;
  max-width: var(--lead-measure);
}

.hero__actions {
  display: flex;
  align-items: center;
  height: var(--cta-h);
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  height: var(--cta-h);
  padding-inline: 1.75rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 1.0625rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.hero__tags {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.75rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: var(--eyebrow-lh);
}

.hero__tags li {
  display: flex;
  gap: 0.5rem;
}

.hero__tag-label { text-transform: uppercase; letter-spacing: 0.1em; }

.hero__chapter-link { text-decoration: none; border-bottom: 1px solid currentColor; }

/* ── Per-layer colour. Colour only — never geometry. ──────────────── */
.hero__layer--pro .hero__eyebrow,
.hero__layer--pro .hero__tag-label { color: var(--cr-signal); }
.hero__layer--pro .hero__lead,
.hero__layer--pro .hero__tag-detail { color: var(--cr-mute); }
.hero__layer--pro .hero__cta { background: var(--cr-signal); color: #fff; }
.hero__layer--pro .hero__chapter-link { color: var(--cr-ink); }
.hero__layer--pro .hero__cta:focus-visible,
.hero__layer--pro .hero__chapter-link:focus-visible {
  outline: 2px solid var(--cr-signal);
  outline-offset: 3px;
}

.hero__layer--art .hero__eyebrow,
.hero__layer--art .hero__tag-label { color: var(--sl-safelight); }
.hero__layer--art .hero__lead,
.hero__layer--art .hero__tag-detail { color: var(--sl-mute); }
.hero__layer--art .hero__cta { background: var(--sl-safelight); color: var(--sl-ground); }
.hero__layer--art .hero__chapter-link { color: var(--sl-print); }

/* ── Widths. Only the shared custom properties change — never a rule that
     applies to one layer and not the other. ────────────────────────── */
@media (max-width: 900px) {
  .hero { --tags-lines: 2; }
}

@media (max-width: 600px) {
  .hero {
    --hero-title-lines: 3;
    --lead-lines: 5;
    --hero-gap: 1.25rem;
    --hero-x: var(--sp-5);
    --tags-lines: 3;
  }
}

@media (max-width: 400px) {
  .hero { --lead-lines: 6; --tags-lines: 4; }
}
</style>
