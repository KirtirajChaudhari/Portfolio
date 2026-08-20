<template>
  <section id="poetry" class="poetry">
    <div class="container">
      <SectionHeader
        note="between the lines…"
        title="Poetry"
        highlight="Poetry"
        hue="violet"
        align="right"
        :handle="poetryMeta.handle"
        :handle-href="poetryMeta.profileUrl"
        :vis="vis"
      />

      <div class="poetry__row" :class="{ 'is-in': vis }">
        <!-- The notebook stays shut: the writing is published elsewhere and
             is not duplicated here. The ink on the curled page is illegible
             on purpose — suggestion, not invented body text. -->
        <div class="book">
          <span class="book__pin"></span>
          <span class="book__mat"></span>
          <div class="book__cover">
            <span class="book__spine"></span>
            <span class="book__seam"></span>
            <span class="book__edge"></span>
            <span class="book__elastic"></span>

            <div class="book__plate">
              <span class="book__handle hand">{{ poetryMeta.handle }}</span>
              <span class="book__blurb hand">{{ poetryMeta.blurb }}</span>
            </div>

            <div class="book__corner">
              <div class="book__page">
                <svg viewBox="0 0 120 60" fill="none" stroke="var(--text-muted)" stroke-width="1.6" stroke-linecap="round" opacity="0.5" aria-hidden="true">
                  <path d="M2 8c8-5 14 4 22 0s12-6 20-2 14 3 22-1" />
                  <path d="M2 24c10-4 16 3 26 0s14-5 24-1" />
                  <path d="M2 40c7-4 13 3 20 0s11-4 18-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="poetry__aside">
          <!-- Renders only when a real fragment lands in content/poetry.ts. -->
          <article v-if="fragment" class="fragment">
            <Tape hue="violet" :rotate="-7" />
            <p v-for="(line, i) in fragment.lines" :key="i">{{ line }}</p>
            <span v-if="fragment.note" class="fragment__note hand">{{ fragment.note }}</span>
            <a :href="fragment.href" target="_blank" rel="noopener" class="fragment__link hand">read it in full ↗</a>
          </article>

          <p class="poetry__copy">
            The notebook stays shut here. The lines that make it out live on Instagram.
          </p>
          <a :href="poetryMeta.profileUrl" target="_blank" rel="noopener" class="poetry__out hand">
            read them on Instagram ↗
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { poetryMeta } from '../../content/novel';
import { poemFragments } from '../../content/poetry';
import SectionHeader from './SectionHeader.vue';
import Tape from './Tape.vue';

defineProps<{ vis?: boolean }>();

const fragment = poemFragments[0];
</script>

<style scoped>
.poetry { padding: var(--sp-9) 0; }

.poetry__row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: var(--sp-9);
  margin-top: var(--sp-8);
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 760ms cubic-bezier(0.32, 0.72, 0, 1),
              transform 820ms cubic-bezier(0.32, 0.72, 0, 1) 120ms;
}
.poetry__row.is-in { opacity: 1; transform: none; }

/* --- Notebook --- */
.book {
  position: relative;
  width: 17rem;
  flex-shrink: 0;
  transform: rotate(-2.5deg);
}
.book__pin {
  position: absolute;
  top: -8px;
  left: 50%;
  width: 13px; height: 13px;
  margin-left: -6.5px;
  border-radius: 50%;
  background: var(--crayon-violet);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.28);
  z-index: 2;
}
/* Offset colour mat, tilted the other way. */
.book__mat {
  position: absolute;
  inset: 0;
  border-radius: 4px;
  background: var(--crayon-violet);
  transform: rotate(3deg) translate(7px, 9px);
  z-index: -1;
}
.book__cover {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 3px;
  border: 1px solid var(--border);
  background: var(--surface-solid);
}
.book__spine {
  position: absolute;
  inset-block: 0;
  left: 0;
  width: 28px;
  background: var(--crayon-violet);
}
.book__seam {
  position: absolute;
  inset-block: 0;
  left: 28px;
  width: 1px;
  background: var(--border);
}
/* Page block peeking along the fore edge. */
.book__edge {
  position: absolute;
  inset-block: 12px;
  right: 0;
  width: 10px;
  background: repeating-linear-gradient(to right, var(--border) 0 1px, transparent 1px 3px);
}
.book__elastic {
  position: absolute;
  inset-block: 0;
  right: 36px;
  width: 8px;
  background: color-mix(in srgb, var(--text) 70%, transparent);
}
.book__plate {
  position: absolute;
  inset-inline: 0;
  top: 0;
  padding: var(--sp-6) var(--sp-6) 0 40px;
}
.book__handle {
  display: block;
  font-size: 1.5rem;
  line-height: 1.1;
  color: var(--text);
}
.book__blurb {
  display: block;
  margin-top: var(--sp-2);
  font-size: 1.15rem;
  line-height: 1.25;
  color: var(--text-muted);
}
/* Curled corner — a glimpse of a page, illegible by design. */
.book__corner {
  position: absolute;
  right: 0; bottom: 0;
  width: 128px; height: 112px;
  overflow: hidden;
}
.book__page {
  position: absolute;
  right: -24px; bottom: -24px;
  width: 144px; height: 128px;
  transform: rotate(-8deg);
  border-radius: 3px;
  border: 1px solid var(--border);
  background: var(--surface-2);
}
.book__page svg { width: 96px; height: 40px; margin: 20px 0 0 16px; }

/* --- Aside --- */
.poetry__aside {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--sp-5);
  max-width: 24rem;
  padding-top: var(--sp-6);
}
.fragment {
  position: relative;
  width: 100%;
  padding: var(--sp-6) var(--sp-6) var(--sp-5);
  border: 1px solid var(--border);
  background: var(--surface-solid);
  transform: rotate(2deg);
}
.fragment p {
  font-family: var(--font-body);
  font-style: italic;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text);
}
.fragment__note { display: block; margin-top: var(--sp-3); font-size: 1.1rem; color: var(--text-muted); }
.fragment__link { display: inline-block; margin-top: var(--sp-2); font-size: 1.1rem; color: var(--text-muted); }
.fragment__link:hover { color: var(--text); text-decoration: underline; }

.poetry__copy {
  font-family: var(--font-body);
  font-style: italic;
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--text-muted);
}
.poetry__out {
  font-size: 1.45rem;
  color: var(--text);
  text-decoration: underline;
  text-decoration-color: var(--crayon-violet);
  text-decoration-thickness: 2px;
  text-underline-offset: 6px;
  transition: color 240ms var(--ease-out);
}
.poetry__out:hover { color: var(--text-muted); }

@media (max-width: 760px) {
  .poetry__row { gap: var(--sp-7); }
  .poetry__aside { padding-top: 0; align-items: center; text-align: center; }
}
@media (prefers-reduced-motion: reduce) {
  .poetry__row { transform: none; transition: opacity 300ms ease; }
}
</style>
