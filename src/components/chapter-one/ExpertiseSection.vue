<template>
  <section id="expertise" class="section tile--dark-2">
    <div class="container container--text">
      <p class="eyebrow-label eyebrow reveal" :class="{ 'is-visible': vis }">Expertise</p>
      <div class="section-head reveal" :class="{ 'is-visible': vis }">
        <h2 class="display-md">What I build</h2>
        <p>Four areas where models meet real products — and where I spend most of my time.</p>
      </div>
      <div class="expertise-list reveal-stagger" :class="{ 'is-visible': vis }">
        <div v-for="area in expertise" :key="area.id" class="expertise-row glass-card">
          <span class="expertise-row__index mono-sm">{{ area.index }}</span>
          <div class="expertise-row__body">
            <h3>{{ area.title }}</h3>
            <p>{{ area.description }}</p>
            <div class="expertise-row__tools">
              <span v-for="tool in area.tools" :key="tool" class="skill-tag">{{ tool }}</span>
            </div>
          </div>
          <span class="expertise-row__cursor-label mono-xs">{{ area.cursorLabel }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { professionalExpertise as expertise } from '../../content/professional';

const vis = ref(false);
onMounted(() => {
  const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) vis.value = true; }, { threshold: 0.1 });
  const el = document.getElementById('expertise');
  if (el) observer.observe(el);
});
</script>

<style scoped>
.expertise-list { display: flex; flex-direction: column; gap: var(--sp-4); }
.expertise-row {
  display: flex;
  gap: var(--sp-5);
  align-items: flex-start;
  position: relative;
}
.expertise-row__index {
  color: var(--accent);
  flex-shrink: 0;
  padding-top: 4px;
  font-variant-numeric: tabular-nums;
}
.expertise-row__body { flex: 1; }
.expertise-row__body h3 {
  font-family: var(--font-body);
  font-size: 1.3125rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: var(--sp-2);
  letter-spacing: 0.011em;
  line-height: 1.19;
}
.expertise-row__body p {
  color: var(--text-muted);
  font-size: 17px;
  line-height: 1.47;
  margin-bottom: var(--sp-4);
}
.expertise-row__tools {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.expertise-row__cursor-label {
  position: absolute;
  top: var(--sp-4);
  right: var(--sp-5);
  color: var(--text-faint);
  opacity: 0;
  transition: opacity var(--dur-ui);
}
.expertise-row:hover .expertise-row__cursor-label { opacity: 1; }
@media (max-width: 640px) {
  .expertise-row { flex-direction: column; }
  .expertise-row__cursor-label { display: none; }
}
</style>
