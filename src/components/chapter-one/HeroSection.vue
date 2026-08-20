<template>
  <!-- Layered hero: contour field → portrait figure → optional 3D overlay →
       type and UI. A GSAP boot timeline reveals each layer in sequence once
       the curtain clears; scroll then parallaxes them apart at different rates. -->
  <section ref="heroRef" class="section hero tile--dark">
    <div ref="patternRef" class="hero__pattern" aria-hidden="true" />
    <div class="hero__gradient" aria-hidden="true" />

    <div class="container hero__grid">
      <!-- ── Type column ─────────────────────────────── -->
      <div ref="contentRef" class="hero__content">
        <p ref="eyebrowRef" class="hero__eyebrow gsap-reveal">
          <span
            v-for="(word, i) in eyebrowWords"
            :key="i"
            class="hero__word"
          >{{ word }}&nbsp;</span>
        </p>

        <h1 ref="nameRef" class="display-hero gsap-reveal">
          <span
            v-for="(char, i) in nameChars"
            :key="i"
            class="hero__char"
            :class="{ 'hero__char--space': char === ' ' }"
          >{{ char === ' ' ? '\u00A0' : char }}</span>
        </h1>

        <p ref="taglineRef" class="lead hero__tagline gsap-reveal">
          {{ hero.tagline }}
        </p>

        <div ref="actionsRef" class="hero__actions gsap-reveal">
          <a href="#about" class="btn btn--primary hero__cta" :class="{ 'is-yielded': splitOpen }">
            Learn more
          </a>
          <SplitButton v-model:open="splitOpen" main-label="Get in touch" :options="contactOptions" />
        </div>

        <div ref="socialsRef" class="social-row hero__socials gsap-reveal">
          <a v-if="siteMeta.socials.github" :href="siteMeta.socials.github" target="_blank" rel="noopener" class="social-icon" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          </a>
          <a v-if="siteMeta.socials.linkedin" :href="siteMeta.socials.linkedin" target="_blank" rel="noopener" class="social-icon" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <a :href="`mailto:${siteMeta.email}`" class="social-icon" aria-label="Email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </a>
          <a v-if="siteMeta.socials.youtube" :href="siteMeta.socials.youtube" target="_blank" rel="noopener" class="social-icon" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
          </a>
        </div>
      </div>

      <!-- ── Figure column ───────────────────────────── -->
      <div ref="figureRef" class="hero__figure gsap-reveal">
        <img
          src="/avatars/professional-full.png"
          :alt="`Illustrated portrait of ${hero.name}`"
          class="hero__portrait"
          fetchpriority="high"
        />
        <HeroOverlay3D v-if="has3D" :src="MODEL_SRC" />
      </div>
    </div>

    <!-- ── Status rail ───────────────────────────────── -->
    <div ref="railRef" class="hero__rail gsap-reveal">
      <HeroWidgets />
    </div>

    <div ref="scrollHintRef" class="hero__scroll-hint gsap-reveal">
      <span class="fine-print">Scroll</span>
      <span class="hero__scroll-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteMeta } from '../../content/shared';
import { professionalHero as hero } from '../../content/professional';
import SplitButton from '../ui/SplitButton.vue';
import HeroWidgets from './HeroWidgets.vue';
import { bootDone } from '../../composables/useBoot';

/* three + Tres are ~250kB gzipped. Async so they only ship to a visitor whose
   browser actually asks for them — see the probe in onMounted. */
const HeroOverlay3D = defineAsyncComponent(() => import('../three/HeroOverlay3D.vue'));
const MODEL_SRC = '/models/hero.glb';
const has3D = ref(false);

gsap.registerPlugin(ScrollTrigger);

const splitOpen = ref(false);

const contactOptions = [
  { label: 'Email', href: `mailto:${siteMeta.email}` },
  { label: 'LinkedIn', href: siteMeta.socials.linkedin ?? '#', external: true },
  { label: 'Résumé', href: siteMeta.resumeUrl, external: true },
];

/* Split hero text into individual characters/words for granular animation. */
const eyebrowWords = hero.eyebrow.split(' ');
const nameChars = hero.name.split('');

const heroRef = ref<HTMLElement | null>(null);
const patternRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const eyebrowRef = ref<HTMLElement | null>(null);
const nameRef = ref<HTMLElement | null>(null);
const taglineRef = ref<HTMLElement | null>(null);
const actionsRef = ref<HTMLElement | null>(null);
const socialsRef = ref<HTMLElement | null>(null);
const figureRef = ref<HTMLElement | null>(null);
const railRef = ref<HTMLElement | null>(null);
const scrollHintRef = ref<HTMLElement | null>(null);

let ctx: gsap.Context | null = null;
let detachPointer: (() => void) | null = null;

onMounted(async () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    /* Skip all animation — show everything immediately. */
    document.querySelectorAll('.gsap-reveal').forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.visibility = 'visible';
    });
    return;
  }

  /* Only pull the 3D bundle if a model is actually there to render. Runs
     alongside the boot curtain, so it costs no visible time. */
  fetch(MODEL_SRC, { method: 'HEAD' })
    .then((r) => { has3D.value = r.ok; })
    .catch(() => { /* no model shipped — the hero is complete without it */ });

  /* Hold until the boot curtain clears so the reveal isn't spent behind it. */
  await bootDone;
  if (!heroRef.value) return;

  ctx = gsap.context(() => {
    /* ──────────────────────────────────────────
       BOOT TIMELINE — fires as the curtain lifts
       ────────────────────────────────────────── */
    const tl = gsap.timeline({
      defaults: { ease: 'power4.out' },
      onComplete: () => {
        setupScrollParallax();
        setupPointerDepth();
      },
    });

    /* 0.0s — Contour field settles in behind everything */
    tl.fromTo(
      patternRef.value,
      { opacity: 0, scale: 1.08 },
      { opacity: 1, scale: 1, duration: 1.6, ease: 'power2.out' },
      0,
    );

    /* 0.1s — Figure rises and unblurs; the slowest layer, so it reads as depth */
    tl.set(figureRef.value, { visibility: 'visible' }, 0.1);
    tl.fromTo(
      figureRef.value,
      { opacity: 0, y: 48, scale: 1.06, filter: 'blur(14px)' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' },
      0.1,
    );

    /* 0.2s — Eyebrow: word-by-word rise from below */
    tl.set(eyebrowRef.value, { visibility: 'visible', opacity: 1 }, 0.2);
    tl.fromTo(
      eyebrowRef.value!.children,
      { y: '110%', opacity: 0, rotateX: 45 },
      { y: '0%', opacity: 1, rotateX: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out' },
      0.2,
    );

    /* 0.4s — Name: character-by-character clip reveal */
    tl.set(nameRef.value, { visibility: 'visible', opacity: 1 }, 0.35);
    tl.fromTo(
      nameRef.value!.children,
      { y: '100%', opacity: 0, rotateX: 80, transformOrigin: 'bottom center' },
      { y: '0%', opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.018, ease: 'power4.out' },
      0.4,
    );

    /* 0.9s — Tagline: blur-fade */
    tl.set(taglineRef.value, { visibility: 'visible' }, 0.85);
    tl.fromTo(
      taglineRef.value,
      { opacity: 0, y: 24, filter: 'blur(12px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
      0.9,
    );

    /* 1.15s — CTA buttons: spring up */
    tl.set(actionsRef.value, { visibility: 'visible', opacity: 1 }, 1.1);
    tl.fromTo(
      actionsRef.value!.children,
      { opacity: 0, y: 20, scale: 0.85 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: 'back.out(1.7)' },
      1.15,
    );

    /* 1.35s — Social icons: pop in with rotation */
    tl.set(socialsRef.value, { visibility: 'visible', opacity: 1 }, 1.3);
    tl.fromTo(
      socialsRef.value!.children,
      { opacity: 0, scale: 0, rotation: -45 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.5, stagger: 0.06, ease: 'back.out(2)' },
      1.35,
    );

    /* 1.5s — Status rail slides in from the edge */
    tl.set(railRef.value, { visibility: 'visible' }, 1.45);
    tl.fromTo(
      railRef.value!.querySelectorAll('.rail__card'),
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
      1.5,
    );
    tl.set(railRef.value, { opacity: 1 }, 1.45);

    /* 2.0s — Scroll hint fade in + start float */
    tl.set(scrollHintRef.value, { visibility: 'visible' }, 2.0);
    tl.fromTo(
      scrollHintRef.value,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      2.0,
    );
    tl.add(() => {
      scrollHintRef.value?.querySelector('.hero__scroll-arrow')?.classList.add('float');
    }, 2.5);
  }, heroRef.value);

  /* ──────────────────────────────────────────
     POINTER DEPTH — layers drift against the cursor at different rates.
     ────────────────────────────────────────── */
  function setupPointerDepth() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const figX = gsap.quickTo(figureRef.value, 'x', { duration: 0.9, ease: 'power3.out' });
    const figY = gsap.quickTo(figureRef.value, 'y', { duration: 0.9, ease: 'power3.out' });
    const patX = gsap.quickTo(patternRef.value, 'x', { duration: 1.4, ease: 'power3.out' });
    const patY = gsap.quickTo(patternRef.value, 'y', { duration: 1.4, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      /* Nearest layer moves most; the field behind barely shifts. */
      figX(nx * 18); figY(ny * 12);
      patX(nx * -7); patY(ny * -5);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    detachPointer = () => window.removeEventListener('pointermove', onMove);
  }

  /* ──────────────────────────────────────────
     SCROLL PARALLAX — deferred until the boot timeline completes so GSAP
     captures the correct starting values (opacity 1, y 0).
     ────────────────────────────────────────── */
  function setupScrollParallax() {
    /* Type drifts up fastest, figure trails it, field trails both. */
    gsap.to(contentRef.value, {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.value, start: 'top top', end: 'bottom top', scrub: true },
    });

    gsap.to(figureRef.value, {
      yPercent: -8,
      scale: 1.04,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.value, start: 'top top', end: 'bottom top', scrub: true },
    });

    gsap.to(patternRef.value, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.value, start: 'top top', end: 'bottom top', scrub: true },
    });

    /* Differential opacity: eyebrow + tagline fade faster */
    gsap.to([eyebrowRef.value, taglineRef.value], {
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.value, start: '20% top', end: '50% top', scrub: true },
    });

    gsap.to(railRef.value, {
      opacity: 0,
      x: -30,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.value, start: '10% top', end: '35% top', scrub: true },
    });

    /* Scroll hint disappears quickly */
    gsap.to(scrollHintRef.value, {
      opacity: 0,
      y: -10,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.value, start: '5% top', end: '15% top', scrub: true },
    });
  }
});

onUnmounted(() => {
  detachPointer?.();
  ctx?.revert();
});
</script>

<style scoped>
.hero {
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding-top: calc(52px + var(--sp-6));
  padding-bottom: var(--sp-7);
  overflow: hidden;
  position: relative;
}

/* Contour field — a tiling topographic motif, generated rather than an asset
   so it inherits the tile's ink instead of shipping a second PNG. */
.hero__pattern {
  position: absolute;
  /* Overscan so the parallax drift never exposes an edge. */
  inset: -12%;
  z-index: 0;
  opacity: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='0.055'%3E%3Cellipse cx='90' cy='90' rx='20' ry='14'/%3E%3Cellipse cx='90' cy='90' rx='38' ry='27'/%3E%3Cellipse cx='90' cy='90' rx='56' ry='40'/%3E%3Cellipse cx='90' cy='90' rx='74' ry='53'/%3E%3Cellipse cx='0' cy='0' rx='34' ry='24'/%3E%3Cellipse cx='180' cy='180' rx='34' ry='24'/%3E%3Cellipse cx='180' cy='0' rx='34' ry='24'/%3E%3Cellipse cx='0' cy='180' rx='34' ry='24'/%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.hero__gradient {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: radial-gradient(ellipse 70% 55% at 62% 45%, var(--accent-glass) 0%, transparent 70%);
  pointer-events: none;
}

.hero__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
  align-items: center;
  gap: var(--sp-7);
  width: 100%;
}

.hero__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.hero__eyebrow {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  margin-bottom: var(--sp-4);
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
}

.hero__word {
  display: inline-block;
  perspective: 400px;
}

.hero h1 {
  max-width: 14ch;
  text-wrap: balance;
  margin-bottom: var(--sp-5);
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  perspective: 600px;
}

.hero__char {
  display: inline-block;
  will-change: transform, opacity;
}
.hero__char--space { width: 0.3em; }

.hero__tagline {
  color: var(--text-muted);
  max-width: 34ch;
  text-wrap: balance;
  margin-bottom: var(--sp-6);
}

.hero__actions {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--sp-3);
  margin-bottom: var(--sp-5);
}

/* The open option row needs the whole width — the primary CTA steps aside
   rather than letting the row wrap and jump. */
.hero__cta {
  transition: opacity 320ms var(--ease-out),
              transform 480ms var(--ease-out),
              margin-left 560ms var(--ease-out);
}
.hero__cta.is-yielded {
  opacity: 0;
  transform: scale(0.9);
  margin-left: -180px;
  pointer-events: none;
}

/* ── Figure ─────────────────────────────────────────── */
.hero__figure {
  position: relative;
  justify-self: center;
  width: 100%;
  max-width: 520px;
  aspect-ratio: 1;
  will-change: transform;
}

/* The illustration ships with its own dark ground baked in; the radial mask
   feathers that square away so it sits on the tile instead of on top of it. */
.hero__portrait {
  width: 100%;
  height: 100%;
  object-fit: contain;
  -webkit-mask-image: radial-gradient(ellipse 62% 62% at 50% 48%, #000 55%, transparent 82%);
  mask-image: radial-gradient(ellipse 62% 62% at 50% 48%, #000 55%, transparent 82%);
}

/* ── Rail + hint ────────────────────────────────────── */
.hero__rail {
  position: absolute;
  left: var(--sp-6);
  bottom: var(--sp-7);
  z-index: 2;
}

.hero__scroll-hint {
  position: absolute;
  bottom: var(--sp-5);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: var(--text-faint);
  z-index: 2;
}
.hero__scroll-arrow svg { width: 18px; height: 18px; }

/* The rail needs the gutter the container doesn't leave below 1240px. */
@media (max-width: 1240px) {
  .hero__rail { display: none; }
}

@media (max-width: 900px) {
  .hero__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--sp-6);
  }
  .hero__content { align-items: center; text-align: center; }
  .hero h1 { justify-content: center; max-width: 16ch; }
  .hero__eyebrow { justify-content: center; }
  .hero__figure { max-width: 340px; order: -1; }
}

@media (max-width: 560px) {
  .hero__actions { flex-wrap: wrap; justify-content: center; }
  .hero__cta.is-yielded { display: none; margin-left: 0; }
}

/* Laptop-height screens: the tile still has to resolve inside one viewport,
   so the type steps down its own ladder rather than the layout reflowing. */
@media (max-height: 880px) and (min-width: 901px) {
  .hero { padding-top: calc(52px + var(--sp-5)); padding-bottom: var(--sp-5); }
  .hero h1 { font-size: clamp(1.75rem, 3.4vw, 2.5rem); margin-bottom: var(--sp-4); }
  .hero__tagline { font-size: 1.3125rem; margin-bottom: var(--sp-5); }
  .hero__eyebrow { margin-bottom: var(--sp-3); }
  .hero__figure { max-width: 400px; }
  .hero__scroll-hint { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .hero__char,
  .hero__word { transform: none !important; opacity: 1 !important; }
  .hero__pattern { opacity: 1; }
  .gsap-reveal { opacity: 1 !important; visibility: visible !important; }
}
</style>
