<template>
  <BootSequence />
  <CustomCursor />
  <ScrollIsland />
  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import ScrollIsland from './components/layout/ScrollIsland.vue';
import BootSequence from './components/layout/BootSequence.vue';
import CustomCursor from './components/ui/CustomCursor.vue';
import { useLenis } from './composables/useLenis';

/* Initialise smooth scrolling — every component can inject the instance. */
useLenis();

const route = useRoute();

/* Set on <html> rather than a wrapper so teleported chrome (island scrim,
   case sheet) inherits the chapter's tokens too. */
watch(
  () => route.path,
  (path) => {
    const two = path.startsWith('/creator');
    document.documentElement.dataset.chapter = two ? 'two' : 'one';
    document.documentElement.style.colorScheme = two ? 'light' : 'dark';
  },
  { immediate: true },
);
</script>

