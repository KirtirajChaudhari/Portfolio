<template>
  <!-- switch-mode: track + spring-sliding knob. Toggles chapter, not theme. -->
  <button
    type="button"
    class="chsw"
    :class="{ 'is-creator': isCreator }"
    role="switch"
    :aria-checked="isCreator"
    :aria-label="isCreator ? 'Switch to the professional chapter' : 'Switch to the creator chapter'"
    :title="isCreator ? 'Back to Professional' : 'Meet the Creator'"
    @click="toggle"
  >
    <span class="chsw__track"></span>
    <span class="chsw__knob"></span>

    <span class="chsw__slot">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect width="20" height="14" x="2" y="7" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    </span>

    <span class="chsw__slot">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <path d="M12 2a10 10 0 0 0 0 20 2 2 0 0 0 2-2v-1a2 2 0 0 1 2-2h2a4 4 0 0 0 4-4 10 10 0 0 0-10-10" />
      </svg>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isCreator = computed(() => route.path.startsWith('/creator'));
const toggle = () => router.push(isCreator.value ? '/' : '/creator');
</script>

<style scoped>
.chsw {
  position: relative;
  display: flex;
  align-items: center;
  width: 116px;
  height: 56px;
  padding: 0;
  border: 2px solid var(--border);
  border-radius: var(--r-pill);
  background: none;
  cursor: pointer;
  transition: border-color 400ms var(--ease-out);
}
.chsw:hover { border-color: var(--border-accent); }
.chsw:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

.chsw__track {
  position: absolute;
  inset: 0;
  border-radius: var(--r-pill);
  background: #0b0b12;
  transition: background 400ms var(--ease-out);
}
.chsw.is-creator .chsw__track { background: #f4f2ee; }

/* Knob slides the full track width; spring curve stands in for stiffness/damping. */
.chsw__knob {
  position: absolute;
  top: -2px;
  left: -2px;
  width: 56px;
  height: 56px;
  z-index: 2;
  border: 2px solid var(--border);
  border-radius: 50%;
  background: #24242b;
  transition: transform 520ms cubic-bezier(0.34, 1.45, 0.64, 1),
              background 400ms var(--ease-out),
              border-color 400ms var(--ease-out);
}
.chsw.is-creator .chsw__knob {
  transform: translateX(60px);
  background: #ffffff;
  border-color: #ddd9d0;
}

.chsw__slot {
  position: relative;
  z-index: 3;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  color: var(--text-faint);
  transition: color 400ms var(--ease-out), transform 520ms var(--ease-out);
}
.chsw__slot svg { width: 22px; height: 22px; }

/* Whichever slot the knob is under reads as active. */
.chsw:not(.is-creator) .chsw__slot:first-of-type { color: var(--accent); }
.chsw.is-creator .chsw__slot:last-of-type { color: #b4622f; transform: rotate(-8deg); }
.chsw.is-creator .chsw__slot:first-of-type { color: #8a8a8f; }

@media (prefers-reduced-motion: reduce) {
  .chsw__knob, .chsw__slot, .chsw__track { transition-duration: 1ms; }
}
</style>
