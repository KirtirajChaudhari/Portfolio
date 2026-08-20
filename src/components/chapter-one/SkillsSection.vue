<template>
  <section id="skills" class="section tile--parchment">
    <div class="container container--text">
      <!-- integrations-1: centred heading, diamond lattice of logo tiles,
           closing line underneath. -->
      <header class="sk__head rise" :class="{ 'is-in': vis }">
        <h2 class="display-md">The stack I actually reach for</h2>
      </header>

      <div class="sk__lattice" :class="{ 'is-in': vis }">
        <!-- Desktop: column-per-diagonal so the tiles read as a diamond. -->
        <div class="sk__columns">
          <div v-for="(col, ci) in columnLayout" :key="ci" class="sk__col">
            <div
              v-for="idx in col"
              :key="tools[idx].name"
              class="sk__tile"
              :style="{ '--d': `${ci * 70 + 120}ms` }"
              :title="tools[idx].name"
            >
              <img :src="tools[idx].icon" :alt="tools[idx].name" loading="lazy" />
            </div>
          </div>
        </div>

        <!-- Mobile: a plain wrap; a diamond at phone width is unreadable. -->
        <div class="sk__wrap">
          <div
            v-for="(t, i) in tools"
            :key="t.name"
            class="sk__tile"
            :style="{ '--d': `${i * 30 + 100}ms` }"
            :title="t.name"
          >
            <img :src="t.icon" :alt="t.name" loading="lazy" />
          </div>
        </div>
      </div>

      <p class="sk__foot rise" :class="{ 'is-in': vis }" style="--d: 220ms">
        {{ tools.length }} tools in rotation across four internships and nine shipped projects —
        no logo here that I haven't put into production or a graded build.
      </p>

      <!-- Proficiency detail, kept below the lattice. -->
      <div class="sk__groups" :class="{ 'is-in': vis }">
        <div
          v-for="(group, gi) in groups"
          :key="group.category"
          class="glass-card sk__group"
          :style="{ '--wave': `${waveDelay(gi)}ms` }"
        >
          <h4>{{ group.category }}</h4>
          <div v-for="(item, ii) in group.items" :key="item.name" class="bar">
            <div class="bar__head">
              <span class="bar__name">{{ item.name }}</span>
              <span class="bar__pct mono-sm">{{ Math.round(shown[gi][ii]) }}%</span>
            </div>
            <div class="bar__track">
              <div
                class="bar__fill"
                :style="{ width: vis ? `${item.level}%` : '0%', transitionDelay: `${waveDelay(gi) + ii * 80}ms` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { professionalSkillLevels as groups } from '../../content/professional';
import { useReveal, countUp } from '../../composables/motion';

const vis = useReveal('skills', 0.06);

/* Real logo files from public/skills — nothing stock. */
const tools = [
  { name: 'Python', icon: '/skills/Python-logo.png' },
  { name: 'C++', icon: '/skills/ISO_C++_Logo.svg.webp' },
  { name: 'JavaScript', icon: '/skills/javascript.png' },
  { name: 'TypeScript', icon: '/skills/typescript.png' },
  { name: 'React', icon: '/skills/react.png' },
  { name: 'Next.js', icon: '/skills/nextjs.png' },
  { name: 'Django', icon: '/skills/django.jpeg' },
  { name: 'FastAPI', icon: '/skills/fastapi.png' },
  { name: 'pandas', icon: '/skills/pandas.png' },
  { name: 'NumPy', icon: '/skills/numpy.png' },
  { name: 'scikit-learn', icon: '/skills/scikit learn.webp' },
  { name: 'PyTorch', icon: '/skills/pytorch.png' },
  { name: 'TensorFlow', icon: '/skills/Tensorflow_logo.svg.webp' },
  { name: 'XGBoost', icon: '/skills/66d8691e2943609aef09f8ee_xgboost.png' },
  { name: 'OpenCV', icon: '/skills/38-384674_opencv-logo-png-transparent-png.png' },
  { name: 'YOLO', icon: '/skills/yolo.jpg' },
  { name: 'Grad-CAM', icon: '/skills/gradcam.png' },
  { name: 'Neo4j', icon: '/skills/neo4j.png' },
  { name: 'MongoDB', icon: '/skills/mongodb-logo-png_seeklogo-481256.png' },
  { name: 'PostgreSQL', icon: '/skills/postgresql.png' },
  { name: 'MySQL', icon: '/skills/logo-mysql-mysql-logo-png-images-are-download-crazypng-21.png' },
  { name: 'Git', icon: '/skills/git.png' },
];

/* Diamond: 1-3-4-6-4-3-1 across seven columns = 22 tiles, symmetric. */
const columnLayout = [
  [0],
  [1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17],
  [18, 19, 20],
  [21],
];

const COLS = 3;
const waveDelay = (i: number) => (Math.floor(i / COLS) + (i % COLS)) * 110;

const shown = reactive(groups.map((g) => g.items.map(() => 0)));
watch(vis, (v) => {
  if (!v) return;
  groups.forEach((g, gi) =>
    g.items.forEach((item, ii) => {
      setTimeout(
        () => countUp(item.level, 900, (n) => { shown[gi][ii] = n; }),
        waveDelay(gi) + ii * 80,
      );
    }),
  );
});
</script>

<style scoped>
.rise {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--dur-reveal) var(--ease-out),
              transform var(--dur-reveal) var(--ease-out);
  transition-delay: var(--d, 0ms);
}
.rise.is-in { opacity: 1; transform: none; }

.sk__head { text-align: center; margin-bottom: var(--sp-8); }
.sk__head h2 {
  max-width: 20ch;
  margin: 0 auto;
  text-wrap: balance;
}

.sk__lattice { margin-bottom: var(--sp-7); }

.sk__columns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-3);
}
.sk__col { display: flex; flex-direction: column; gap: var(--sp-3); }
.sk__wrap { display: none; }
@media (max-width: 860px) {
  .sk__columns { display: none; }
  .sk__wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--sp-3);
  }
}

/* Logo tile: a white utility cell on the parchment ground. The surface
   change carries it; no shadow, one hairline. */
.sk__tile {
  display: grid;
  place-items: center;
  width: clamp(56px, 7vw, 88px);
  height: clamp(56px, 7vw, 88px);
  border-radius: var(--r-md);
  background: var(--surface-solid);
  border: 1px solid var(--border);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 620ms var(--ease-out),
              transform 620ms var(--ease-out),
              border-color 300ms var(--ease-out);
  transition-delay: var(--d);
}
.sk__lattice.is-in .sk__tile { opacity: 1; transform: none; }
.sk__tile:hover { border-color: var(--accent); }
.sk__tile img {
  width: 52%;
  height: 52%;
  object-fit: contain;
  transition: transform 420ms var(--ease-out);
}
.sk__tile:hover img { transform: scale(1.08); }

.sk__foot {
  max-width: 56ch;
  margin: 0 auto;
  text-align: center;
  color: var(--text-muted);
  font-size: 17px;
  line-height: 1.47;
}

.sk__groups {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-5);
  margin-top: var(--sp-9);
  padding-top: var(--sp-8);
  border-top: 1px solid var(--border);
}
@media (max-width: 980px) { .sk__groups { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 620px) { .sk__groups { grid-template-columns: minmax(0, 1fr); } }

.sk__group {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 520ms var(--ease-out),
              transform 560ms var(--ease-out),
              border-color 240ms var(--ease-out);
  transition-delay: var(--wave);
}
.sk__groups.is-in .sk__group { opacity: 1; transform: none; }
.sk__group h4 {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 17px;
  line-height: 1.24;
  letter-spacing: -0.022em;
  color: var(--text);
  margin-bottom: var(--sp-5);
}

.bar + .bar { margin-top: var(--sp-4); }
.bar__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--sp-3);
  margin-bottom: 6px;
}
.bar__name { font-size: 14px; letter-spacing: -0.016em; color: var(--text-muted); }
.bar__pct { color: var(--accent); }
/* The empty track needs to read against a white card, so it takes the
   hairline tone rather than a wash that would vanish. */
.bar__track {
  height: 6px;
  border-radius: var(--r-pill);
  background: var(--border-hair);
  overflow: hidden;
}
/* Solid Action Blue — the system has no decorative gradients. */
.bar__fill {
  height: 100%;
  width: 0;
  border-radius: var(--r-pill);
  background: var(--accent);
  transition: width 1s var(--ease-out);
}

@media (prefers-reduced-motion: reduce) {
  .rise, .sk__tile, .sk__group { transform: none; transition: opacity 300ms ease; }
  .sk__lattice.is-in .sk__tile, .sk__groups.is-in .sk__group { transform: none; }
  .bar__fill, .sk__tile img { transition: none; }
}
</style>
