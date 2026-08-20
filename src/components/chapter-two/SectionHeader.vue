<template>
  <!-- Chapter-two section entry: handwritten lead-in, ink heading with a
       highlighter stroke behind one word, then a drawn underline in the
       lead hue. -->
  <header class="sh" :class="[`sh--${align}`, { 'is-in': vis }]">
    <span v-if="note" class="sh__note hand">{{ note }}</span>

    <h2 class="sh__title">
      <template v-for="(word, i) in words" :key="`${word}-${i}`">
        <span v-if="word === highlight" class="sh__mark" :style="{ '--hue': hueVar }">{{ word }}</span>
        <template v-else>{{ word }}</template>{{ i < words.length - 1 ? ' ' : '' }}
      </template>
    </h2>

    <svg class="sh__rule" viewBox="0 0 220 12" fill="none" aria-hidden="true">
      <path
        d="M2 8C38 3 74 2 110 4.5C146 7 182 9 218 5"
        :stroke="hueVar"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>

    <a v-if="handle && handleHref" :href="handleHref" target="_blank" rel="noopener" class="sh__handle">
      {{ handle }} ↗
    </a>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    note?: string;
    title: string;
    /** One word inside `title` to sit the highlighter stroke behind. */
    highlight?: string;
    hue: string;
    handle?: string;
    handleHref?: string;
    align?: 'left' | 'center' | 'right';
    vis?: boolean;
  }>(),
  { align: 'left', vis: true },
);

const words = computed(() => props.title.split(' '));
const hueVar = computed(() => `var(--crayon-${props.hue})`);
</script>

<style scoped>
.sh {
  opacity: 0;
  transform: translateY(26px);
  transition: opacity 760ms cubic-bezier(0.32, 0.72, 0, 1),
              transform 820ms cubic-bezier(0.32, 0.72, 0, 1);
}
.sh.is-in { opacity: 1; transform: none; }
.sh--center { text-align: center; }
.sh--right { text-align: right; }

.sh__note {
  display: block;
  font-size: 1.55rem;
  line-height: 1;
  color: var(--text-muted);
  transform: rotate(-1.5deg);
}
.sh--right .sh__note { transform: rotate(1.5deg); }

.sh__title {
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 8vw, 5rem);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--text);
  margin-top: var(--sp-2);
  text-wrap: balance;
}

/* Highlighter: a rough stroke sitting behind the word, not a clean box. */
.sh__mark {
  position: relative;
  display: inline-block;
  isolation: isolate;
}
.sh__mark::before {
  content: '';
  position: absolute;
  left: -0.08em;
  right: -0.08em;
  bottom: 0.06em;
  height: 0.52em;
  z-index: -1;
  background: var(--hue);
  opacity: 0.42;
  transform: rotate(-1.2deg) skewX(-6deg);
  border-radius: 3px 8px 5px 7px;
}

.sh__rule {
  display: block;
  width: 160px;
  height: 12px;
  margin-top: var(--sp-3);
}
.sh--center .sh__rule { margin-left: auto; margin-right: auto; }
.sh--right .sh__rule { margin-left: auto; }

.sh__handle {
  display: inline-block;
  margin-top: var(--sp-3);
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text);
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--text) 30%, transparent);
  text-underline-offset: 4px;
  transition: text-decoration-color 240ms var(--ease-out);
}
.sh__handle:hover { text-decoration-color: var(--text); }

@media (prefers-reduced-motion: reduce) {
  .sh { transform: none; transition: opacity 300ms ease; }
}
</style>
