<template>
  <!-- Fanned card layout: five project mockups spread from a shared bottom origin.
       GSAP drives the entrance; CSS handles the hover-spread for instant response. -->
  <div ref="fanRef" class="fan" :class="{ 'is-interactive': played }" aria-hidden="true">
    <figure
      v-for="c in cards"
      :key="c.src"
      class="fan__card"
      :style="{
        '--k': c.k,
        '--r': `${c.rotate}deg`,
        '--s': c.scale,
        '--o': c.opacity,
        '--blur': `${c.blur}px`,
        zIndex: c.z,
      }"
    >
      <img :src="c.src" :alt="c.alt" loading="lazy" />
    </figure>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const props = defineProps<{
  /** Delay in seconds before the fan entrance starts. Lets HeroSection
      sequence this into its boot timeline. */
  delay?: number;
}>();

/* k = lateral step from centre; the outer pair sits back via scale, dim and blur. */
const cards = [
  { src: '/project/Sales Forecasting.png', alt: 'Sales Forecasting', k: -2, rotate: -24, scale: 0.86, opacity: 0.62, blur: 1.6, z: 20 },
  { src: '/project/DrishtiManas.png',      alt: 'DrishtiManas',      k: -1, rotate: -12, scale: 0.94, opacity: 0.86, blur: 0.4, z: 30 },
  // RasaCare centre-stage: the SIH finalist is the flagship.
  { src: '/project/RasaCare.png',          alt: 'RasaCare',          k:  0, rotate:   0, scale: 1.08, opacity: 1,    blur: 0,   z: 40 },
  { src: '/project/PRAVAAS.png',           alt: 'PRAVAAS',           k:  1, rotate:  12, scale: 0.94, opacity: 0.86, blur: 0.4, z: 30 },
  { src: '/project/BhojanSetu.png',        alt: 'BhojanSetu',        k:  2, rotate:  24, scale: 0.86, opacity: 0.62, blur: 1.6, z: 20 },
];

const fanRef = ref<HTMLElement | null>(null);
const played = ref(false);

let ctx: gsap.Context | null = null;

/** Expose play() so the parent hero timeline can call it. */
function play() {
  if (!fanRef.value || played.value) return;
  const cardEls = fanRef.value.querySelectorAll('.fan__card');

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      onComplete: () => { played.value = true; },
    });

    /* All cards start stacked at centre with zero rotation and opacity. */
    tl.fromTo(
      cardEls,
      {
        opacity: 0,
        scale: 0.72,
        x: 0,
        rotation: 0,
        filter: 'blur(4px)',
      },
      {
        opacity: (i: number) => cards[i].opacity,
        scale: (i: number) => cards[i].scale,
        x: (i: number) => `calc(${cards[i].k} * var(--step))`,
        rotation: (i: number) => cards[i].rotate,
        filter: (i: number) => `blur(${cards[i].blur}px)`,
        duration: 1.1,
        stagger: {
          each: 0.08,
          from: 'center',
        },
        ease: 'back.out(1.4)',
      },
    );
  }, fanRef.value);
}

/** Also set up scroll-triggered parallax: cards drift at a different rate. */
function setupParallax() {
  if (!fanRef.value) return;

  gsap.to(fanRef.value, {
    yPercent: 25,
    ease: 'none',
    scrollTrigger: {
      trigger: fanRef.value,
      start: 'top 60%',
      end: 'bottom top',
      scrub: true,
    },
  });
}

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    /* Skip animation — show final state immediately. */
    played.value = true;
    return;
  }

  /* The fan plays after a delay (coordinated by the hero boot timeline)
     or immediately if no delay is specified. */
  const delayMs = (props.delay ?? 0) * 1000;
  setTimeout(() => {
    play();
    setupParallax();
  }, delayMs);
});

onUnmounted(() => {
  ctx?.revert();
});

defineExpose({ play });
</script>

<style scoped>
.fan {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  --step: clamp(52px, 7vw, 104px);
  --card-w: clamp(136px, 15.5vw, 230px);
  min-height: calc(var(--card-w) * 0.9);
  isolation: isolate;
}

.fan__card {
  position: absolute;
  width: var(--card-w);
  border-radius: var(--r-sm);
  overflow: hidden;
  background: var(--surface-solid);
  box-shadow: var(--product-shadow);
  transform-origin: bottom center;
  /* Start invisible — GSAP handles entrance. */
  opacity: 0;
  will-change: transform, opacity;
}

/* After GSAP plays, re-enable the CSS hover transitions for instant feedback. */
.fan.is-interactive .fan__card {
  transition: transform 500ms cubic-bezier(0.34, 1.32, 0.64, 1),
              opacity 400ms cubic-bezier(0.32, 0.72, 0, 1),
              filter 400ms cubic-bezier(0.32, 0.72, 0, 1);
}

/* Hovering the fan spreads it wider and clears the outer blur. */
.fan.is-interactive:hover .fan__card {
  transform: translateX(calc(var(--k) * var(--step) * 1.22)) rotate(calc(var(--r) * 1.1)) scale(var(--s)) !important;
  opacity: 1 !important;
  filter: blur(0) !important;
}

.fan__card img {
  width: 100%;
  display: block;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top center;
}

@media (max-width: 640px) {
  .fan {
    --step: clamp(28px, 8vw, 40px);
    --card-w: clamp(88px, 24vw, 116px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fan__card {
    opacity: var(--o) !important;
    transform: translateX(calc(var(--k) * var(--step))) rotate(var(--r)) scale(var(--s)) !important;
    filter: blur(var(--blur)) !important;
  }
  .fan.is-interactive:hover .fan__card {
    transform: translateX(calc(var(--k) * var(--step))) rotate(var(--r)) scale(var(--s)) !important;
    filter: blur(var(--blur)) !important;
  }
}
</style>
