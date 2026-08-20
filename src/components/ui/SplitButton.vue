<template>
  <!-- split-button: the main pill blurs and scales out, the option row scales in. -->
  <div class="split" :class="{ 'is-open': open }">
    <button type="button" class="split__main" :tabindex="open ? -1 : 0" @click="open = true">
      {{ mainLabel }}
    </button>

    <div class="split__row">
      <button type="button" class="split__back" aria-label="Back" :tabindex="open ? 0 : -1" @click="open = false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
      </button>
      <a
        v-for="o in options"
        :key="o.label"
        :href="o.href"
        :target="o.external ? '_blank' : undefined"
        :rel="o.external ? 'noopener' : undefined"
        class="split__opt"
        :tabindex="open ? 0 : -1"
        @click="open = false"
      >{{ o.label }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  mainLabel: string;
  options: { label: string; href: string; external?: boolean }[];
}>();

/* Exposed so a parent can yield room while the row is out. */
const open = defineModel<boolean>('open', { default: false });
</script>

<style scoped>
/* bounce 0.55 in motion terms — a pronounced overshoot. */
/* Both states are absolutely positioned, so the box has no intrinsic width —
   without an explicit one it stretches and wraps out of any flex row. */
.split {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  min-height: 46px;
  width: var(--split-w, 190px);
  transition: width 620ms cubic-bezier(0.34, 1.4, 0.64, 1);
}
.split.is-open { width: var(--split-w-open, 400px); }

.split__main,
.split__row {
  transition: transform 620ms cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 380ms var(--ease-out),
              filter 380ms var(--ease-out);
}

/* The ghost pill — the second CTA when two sit together. */
.split__main {
  position: absolute;
  z-index: 1;
  white-space: nowrap;
  border: 1px solid var(--accent);
  border-radius: var(--r-pill);
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  padding: 11px 22px;
  min-height: 44px;
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 400;
  letter-spacing: -0.022em;
  text-transform: none;
}
.split__main:hover { background: var(--accent-glass); }
.split__main:active { transform: scale(0.95); }
.split.is-open .split__main {
  transform: scaleX(1.5) scaleY(0.9);
  opacity: 0;
  filter: blur(8px);
  pointer-events: none;
}

.split__row {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  transform: scaleX(0.2) scaleY(0.9);
  opacity: 0;
  filter: blur(8px);
  pointer-events: none;
}
.split.is-open .split__row {
  transform: none;
  opacity: 1;
  filter: blur(0);
  pointer-events: auto;
}

.split__back,
.split__opt {
  border: 1px solid var(--accent);
  border-radius: var(--r-pill);
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  white-space: nowrap;
  font-family: var(--font-body);
  font-size: 14px;
  letter-spacing: -0.016em;
  text-transform: none;
  transition: background 240ms var(--ease-out), transform 200ms var(--ease-out);
}
.split__back {
  display: grid;
  place-items: center;
  width: 44px; height: 44px;
  flex-shrink: 0;
}
.split__back svg { width: 16px; height: 16px; }
.split__opt { padding: 11px 20px; min-height: 44px; display: inline-flex; align-items: center; }

.split__back:hover,
.split__opt:hover { background: var(--accent-glass); }
.split__back:active,
.split__opt:active { transform: scale(0.95); }

@media (max-width: 560px) {
  .split,
  .split.is-open { width: 100%; }
  .split__row { flex-wrap: wrap; justify-content: center; }
  .split__opt { padding: 10px 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .split__main, .split__row { transition: opacity 200ms ease; filter: none; transform: none; }
  .split.is-open .split__main { transform: none; filter: none; }
}
</style>
