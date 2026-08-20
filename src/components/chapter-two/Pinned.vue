<template>
  <!-- Two nodes on purpose: the wrapper carries the entrance, the inner
       .pinned carries the resting tilt and the hover lift. Keeping them
       apart means the two transforms never overwrite each other. -->
  <div
    data-pinned
    :style="{ '--settle-from': `${index % 2 === 0 ? -5 : 5}deg`, '--settle-delay': `${(index % 4) * 70}ms` }"
  >
    <div class="pinned" :class="innerClass" :style="{ '--tilt': `${tilt}deg` }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Resting rotation in degrees. Keep within ±5 to stay in grammar. */
    tilt?: number;
    /** Position in its group — drives the stagger and the overshoot side. */
    index?: number;
    innerClass?: string;
  }>(),
  { tilt: 0, index: 0, innerClass: '' },
);
</script>
