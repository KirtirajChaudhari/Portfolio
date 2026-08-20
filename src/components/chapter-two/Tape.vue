<template>
  <!-- Washi tape holding a frame to the board. One hue per item across a
       section, per the chapter-two application rule. -->
  <span
    class="tape"
    :class="{ 'tape--right': flip }"
    :style="{ '--hue': `var(--crayon-${hue})`, '--rot': `${rotate}deg` }"
    aria-hidden="true"
  ></span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{ hue: string; rotate?: number; flip?: boolean }>(),
  { rotate: -8, flip: false },
);
</script>

<style scoped>
.tape {
  position: absolute;
  top: -10px;
  left: 22%;
  width: 54px;
  height: 20px;
  transform: rotate(var(--rot));
  background: var(--hue);
  opacity: 0.55;
  /* Torn edges. */
  clip-path: polygon(0 12%, 6% 0, 100% 6%, 96% 100%, 4% 92%);
  pointer-events: none;
}
.tape--right { left: auto; right: 22%; }
</style>
