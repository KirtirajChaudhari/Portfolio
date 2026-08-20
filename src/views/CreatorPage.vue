<template>
  <div class="creator">
    <div class="container">
      <header class="creator__head" :class="{ 'is-in': vis }">
        <div class="creator__meta mono-xs">
          <span>{{ meta.kicker }}</span>
          <span>/ TABLA · LENS · INK</span>
        </div>

        <h1 class="creator__title">
          <span>Beyond</span><br>
          <span class="creator__title-accent">the Code</span>
        </h1>

        <p class="creator__hey hand">Hey —</p>
        <!-- Spec v2 copy, verbatim. -->
        <p class="creator__intro">{{ intro }}</p>
        <p class="creator__epigraph">{{ meta.epigraph }}</p>

        <div class="creator__switch">
          <ChapterSwitch />
          <span class="mono-xs">Back to the professional chapter</span>
        </div>
      </header>
    </div>

    <PhotographyWall :vis="vis" />
    <MusicSection :vis="vis" />
    <PoetryNotebook :vis="vis" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { chapterTwoMeta as meta, creatorIntro as intro } from '../content/novel';
import ChapterSwitch from '../components/ui/ChapterSwitch.vue';
import PhotographyWall from '../components/chapter-two/PhotographyWall.vue';
import MusicSection from '../components/chapter-two/MusicSection.vue';
import PoetryNotebook from '../components/chapter-two/PoetryNotebook.vue';

const vis = ref(false);

onMounted(() => {
  document.title = 'Beyond the Code — Kirtiraj Nitin Chaudhari';
  requestAnimationFrame(() => { vis.value = true; });
});
</script>

<style scoped>
.creator { padding: calc(56px + var(--sp-8)) 0 var(--sp-9); }

.creator__head {
  max-width: 780px;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 780ms cubic-bezier(0.32, 0.72, 0, 1),
              transform 840ms cubic-bezier(0.32, 0.72, 0, 1);
}
.creator__head.is-in { opacity: 1; transform: none; }

.creator__meta {
  display: flex;
  justify-content: space-between;
  color: var(--text-faint);
  padding-bottom: var(--sp-6);
  border-bottom: 1px solid var(--border);
  margin-bottom: var(--sp-7);
}

.creator__title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 9vw, 6.5rem);
  font-weight: 700;
  line-height: 0.92;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: var(--text);
  margin-bottom: var(--sp-6);
}
.creator__title-accent {
  background: linear-gradient(100deg, var(--gradient-start), var(--gradient-mid) 55%, var(--gradient-end));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding-bottom: 0.08em;
}

/* Caveat is the chapter-two voice — the crayon annotation over the paper. */
.creator__hey {
  display: block;
  font-size: 1.9rem;
  line-height: 1;
  color: var(--accent);
  margin-bottom: var(--sp-3);
  transform: rotate(-2deg);
  transform-origin: left center;
}
.creator__intro {
  font-family: var(--font-body);
  font-size: 1.08rem;
  line-height: 1.75;
  color: var(--text);
  max-width: 62ch;
}
.creator__epigraph {
  font-family: var(--font-body);
  font-style: italic;
  color: var(--text-muted);
  font-size: 0.98rem;
  line-height: 1.7;
  max-width: 58ch;
  margin-top: var(--sp-4);
  padding-left: var(--sp-5);
  border-left: 2px solid var(--crayon-peach);
}

.creator__switch {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  margin-top: var(--sp-7);
}
.creator__switch span { color: var(--text-faint); }

.photos {
  padding: var(--sp-9) 0 0;
  margin-top: var(--sp-8);
  border-top: 1px solid var(--border);
}
.photos__lede {
  color: var(--text-muted);
  font-size: 0.95rem;
  max-width: 44ch;
  margin-top: var(--sp-5);
}
.photos__out { text-align: center; margin-top: var(--sp-5); }
.photos__link {
  font-size: 1.35rem;
  color: var(--text-muted);
  text-decoration: underline;
  text-decoration-color: var(--crayon-blue);
  text-decoration-thickness: 2px;
  text-underline-offset: 6px;
  transition: color 240ms var(--ease-out);
}
.photos__link:hover { color: var(--text); }

@media (max-width: 560px) {
  .creator__switch { flex-direction: column; align-items: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  .creator__head { transform: none; transition: opacity 300ms ease; }
}
</style>
