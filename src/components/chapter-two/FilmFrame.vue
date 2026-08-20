<template>
  <!-- Deliberate placeholder: the exported photographs aren't in the repo and
       nothing is scraped from Instagram, so an empty `src` renders a film
       frame rather than a stand-in image. -->
  <span class="frame" :class="{ 'frame--lg': large }" aria-hidden="true">
    <span class="frame__perf frame__perf--top"></span>
    <span class="frame__body">
      <span class="frame__num">{{ String(index).padStart(2, '0') }}</span>
      <span class="frame__of">/ {{ String(total).padStart(2, '0') }}</span>
    </span>
    <span class="frame__perf frame__perf--bottom"></span>
  </span>
</template>

<script setup lang="ts">
defineProps<{ index: number; total: number; large?: boolean }>();
</script>

<style scoped>
.frame {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  overflow: hidden;
  /* Stepped down from --surface-2 so the frame still reads as a frame when
     it sits inside a white polaroid rather than on the page ground. */
  background: color-mix(in srgb, var(--text) 9%, var(--surface-2));
}
/* Sprocket holes, drawn as a repeating gradient rather than 12 elements. */
.frame__perf {
  height: 9px;
  flex-shrink: 0;
  background:
    repeating-linear-gradient(
      to right,
      transparent 0 4px,
      color-mix(in srgb, var(--text) 22%, transparent) 4px 9px,
      transparent 9px 13px
    );
}
.frame--lg .frame__perf { height: 16px; }

.frame__body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: var(--font-mono);
  color: var(--text-faint);
  letter-spacing: 0.08em;
}
.frame__num { font-size: 13px; }
.frame__of { font-size: 9px; opacity: 0.7; }
.frame--lg .frame__num { font-size: 30px; }
.frame--lg .frame__of { font-size: 14px; }
</style>
