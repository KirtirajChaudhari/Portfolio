<template>
  <!-- overflow-x: clip, not hidden — hidden would make this a scroll
       container and break sticky measurements elsewhere on the page. -->
  <section id="photos" class="wall" aria-label="Photography">
    <div class="container">
      <SectionHeader
        note="chasing light…"
        title="Photography"
        highlight="Photography"
        hue="blue"
        :handle="photoMeta.handle"
        :handle-href="photoMeta.profileUrl"
        :vis="vis"
      />
    </div>

    <!--
      CSS columns rather than absolute coordinates: the frames keep their
      overlap and varied depth without a fixed scatter that would tear apart
      if any card's height changed. Single column below md.
    -->
    <div ref="group" class="container wall__grid pinned-group" :class="{ 'is-in': vis }">
      <div
        v-for="(photo, i) in photos"
        :key="photo.id"
        class="wall__cell"
        :style="{
          marginTop: OFFSETS[i % OFFSETS.length],
          marginLeft: i % 3 === 1 ? '-0.75rem' : undefined,
        }"
      >
        <Pinned :tilt="photo.rotate" :index="i" inner-class="polaroid">
          <span
            class="tape"
            :class="i % 2 === 0 ? 'polaroid__tape--l' : 'polaroid__tape--r'"
            :style="{ '--tape-hue': `var(--crayon-${HUES[i % HUES.length]})`, rotate: `${i % 2 === 0 ? -8 : 9}deg` }"
          ></span>

          <a :href="photo.href" target="_blank" rel="noopener" class="polaroid__frame">
            <img v-if="photo.src" :src="photo.src" :alt="photo.caption" loading="lazy" />
            <FilmFrame v-else :index="i + 1" :total="photos.length" />
            <span class="polaroid__cta hand">View on Instagram ↗</span>
          </a>

          <!-- Contact-sheet index — the only caption the frame carries. -->
          <span class="polaroid__idx hand">{{ String(i + 1).padStart(2, '0') }}</span>
        </Pinned>
      </div>
    </div>

    <div class="container wall__out">
      <a :href="photoMeta.profileUrl" target="_blank" rel="noopener" class="wall__link hand">
        more frames on Instagram ↗
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { photographyWall as photos, photographyMeta as photoMeta } from '../../content/novel';
import SectionHeader from './SectionHeader.vue';
import FilmFrame from './FilmFrame.vue';
import Pinned from './Pinned.vue';

defineProps<{ vis?: boolean }>();

/* One hue per frame across the wall. */
const HUES = ['blue', 'sun', 'pink', 'leaf', 'peach', 'violet'];

/* Per-card vertical offset — breaks the column baselines so the wall reads
   as pinned by hand rather than laid out on a grid. */
const OFFSETS = ['0', '2.5rem', '1rem', '3.5rem', '1.5rem', '0.5rem'];
</script>

<style scoped>
.wall {
  overflow-x: clip;
  padding: var(--sp-9) 0 0;
  margin-top: var(--sp-8);
  border-top: 1px solid var(--border);
}

.wall__grid {
  margin-top: var(--sp-8);
  columns: 1;
}
@media (min-width: 760px)  { .wall__grid { columns: 2; column-gap: var(--sp-7); } }
@media (min-width: 1080px) { .wall__grid { columns: 3; column-gap: var(--sp-6); } }

.wall__cell {
  break-inside: avoid;
  margin-bottom: var(--sp-7);
}
/* The hand-placed offsets only make sense once there are columns to break. */
@media (max-width: 759px) {
  .wall__cell { margin-top: 0 !important; margin-left: 0 !important; }
}

.polaroid {
  border-radius: 3px;
  border: 1px solid var(--border);
  background: var(--surface-solid);
  /* Deep bottom lip — the polaroid chin. */
  padding: 8px 8px 34px;
}

.polaroid__tape--l { top: -12px; left: 1.75rem; }
.polaroid__tape--r { top: -12px; right: 1.75rem; }

.polaroid__frame {
  position: relative;
  display: block;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--surface-2);
}
.polaroid__frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.polaroid__cta {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 1.25rem;
  color: var(--caption-color);
  background: var(--scrim);
  opacity: 0;
  transition: opacity 300ms var(--ease-out);
}
.polaroid__frame:hover .polaroid__cta,
.polaroid__frame:focus-visible .polaroid__cta { opacity: 1; }

.polaroid__idx {
  position: absolute;
  right: 0.9rem;
  bottom: 0.15rem;
  font-size: 1.15rem;
  color: var(--text-muted);
}

.wall__out { text-align: center; margin-top: var(--sp-6); }
.wall__link {
  font-size: 1.35rem;
  color: var(--text-muted);
  text-decoration: underline;
  text-decoration-color: var(--crayon-blue);
  text-decoration-thickness: 2px;
  text-underline-offset: 6px;
  transition: color 240ms var(--ease-out);
}
.wall__link:hover { color: var(--text); }
</style>
