<template>
  <article v-if="project" class="case">
    <div class="container case__inner">
      <RouterLink to="/#projects" class="case__back">
        <span class="case__back-pip" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3.5 5.5 8l4.5 4.5" /></svg>
        </span>
        All projects
      </RouterLink>

      <header class="case__head">
        <p class="eyebrow-label eyebrow">{{ project.techLine }}</p>
        <h1 class="display-lg">{{ project.title }}</h1>
        <p class="case__oneliner">{{ project.oneLiner }}</p>

        <div class="case__links">
          <a v-if="project.live" :href="project.live" target="_blank" rel="noopener" class="btn btn--primary">Visit live site</a>
          <a v-if="project.github" :href="project.github" target="_blank" rel="noopener" class="btn btn--ghost">View on GitHub</a>
          <a
            v-for="l in project.extraLinks || []"
            :key="l.href"
            :href="l.href"
            target="_blank"
            rel="noopener"
            class="btn btn--ghost"
          >{{ l.label }}</a>
        </div>
      </header>

      <figure v-if="project.screenshot" class="case__shot">
        <img :src="project.screenshot" :alt="`${project.title} interface`" />
      </figure>

      <div class="case__body">
        <section class="case__block">
          <h2>Problem</h2>
          <p>{{ project.problem }}</p>
        </section>

        <section class="case__block">
          <h2>Approach</h2>
          <p>{{ project.approach }}</p>
        </section>

        <section v-if="project.stack?.length" class="case__block">
          <h2>Stack</h2>
          <ul class="case__stack">
            <li v-for="s in project.stack" :key="s.name">
              <strong>{{ s.name }}</strong>
              <span>{{ s.role }}</span>
            </li>
          </ul>
        </section>

        <section v-if="project.decisions?.length" class="case__block">
          <h2>Key decisions</h2>
          <ul class="case__decisions">
            <li v-for="(d, i) in project.decisions" :key="i">
              <span class="case__num mono-xs">{{ String(i + 1).padStart(2, '0') }}</span>
              <p>{{ d }}</p>
            </li>
          </ul>
        </section>

        <section v-if="project.outcome" class="case__block case__block--outcome">
          <h2>Outcome</h2>
          <p>{{ project.outcome }}</p>
        </section>
      </div>

      <nav class="case__pager">
        <RouterLink v-if="prev" :to="`/projects/${prev.slug}`" class="case__pager-link">
          <span class="mono-xs">Previous</span>
          <strong>{{ prev.title }}</strong>
        </RouterLink>
        <span v-else></span>
        <RouterLink v-if="next" :to="`/projects/${next.slug}`" class="case__pager-link case__pager-link--next">
          <span class="mono-xs">Next</span>
          <strong>{{ next.title }}</strong>
        </RouterLink>
      </nav>
    </div>
  </article>

  <!-- Unknown slug: say so instead of rendering a blank page. -->
  <div v-else class="container case__missing">
    <h1 class="display-md">Project not found</h1>
    <p>No case study matches “{{ slug }}”.</p>
    <RouterLink to="/#projects" class="btn btn--primary">Back to projects</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { projectCases, getProjectCase } from '../content/projects';

const props = defineProps<{ slug?: string }>();

const project = computed(() => (props.slug ? getProjectCase(props.slug) : undefined));
const index = computed(() => projectCases.findIndex((p) => p.slug === props.slug));
const prev = computed(() => (index.value > 0 ? projectCases[index.value - 1] : null));
const next = computed(() =>
  index.value > -1 && index.value < projectCases.length - 1 ? projectCases[index.value + 1] : null,
);

// Router scrollBehavior handles route changes; this covers title only.
watch(
  project,
  (p) => {
    document.title = p ? `${p.title} — Kirtiraj Nitin Chaudhari` : 'Project not found';
  },
  { immediate: true },
);
</script>

<style scoped>
/* An editorial surface: ~980px measure, parchment ground, no chrome. */
.case {
  padding: calc(52px + var(--sp-8)) 0 var(--sp-9);
  background: var(--bg-parchment);
  min-height: 100svh;
}
.case__inner { max-width: var(--maxw-text); }

.case__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  letter-spacing: -0.022em;
  color: var(--accent);
  margin-bottom: var(--sp-7);
}
.case__back-pip {
  display: grid;
  place-items: center;
  transition: transform 340ms var(--ease-out);
}
.case__back-pip svg { width: 14px; height: 14px; }
.case__back:hover { text-decoration: underline; }
.case__back:hover .case__back-pip { transform: translateX(-3px); }

.eyebrow-label { margin-bottom: var(--sp-3); }

.case__head h1 { margin-bottom: var(--sp-4); }
.case__oneliner {
  font-family: var(--font-body);
  font-size: clamp(1.0625rem, 1.5vw, 1.5rem);
  font-weight: 300;
  line-height: 1.5;
  color: var(--text-muted);
  max-width: 60ch;
}
.case__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  margin-top: var(--sp-6);
}

/* The screenshot is the product; it takes the one system drop-shadow. */
.case__shot {
  margin: var(--sp-8) 0;
  border-radius: var(--r-lg);
  overflow: hidden;
  background: var(--surface-solid);
  box-shadow: var(--product-shadow);
}
.case__shot img { width: 100%; display: block; }

.case__block {
  padding-top: var(--sp-6);
  margin-top: var(--sp-6);
  border-top: 1px solid var(--border);
}
.case__block h2 {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.016em;
  color: var(--accent);
  margin-bottom: var(--sp-4);
}
.case__block p {
  color: var(--text-muted);
  font-size: 17px;
  line-height: 1.47;
  max-width: var(--maxw-prose);
}
.case__block--outcome p {
  color: var(--text);
  font-size: 1.3125rem;
  font-weight: 600;
  line-height: 1.19;
  letter-spacing: 0.011em;
}

.case__stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--sp-4);
}
.case__stack li {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: var(--sp-4);
  border-left: 1px solid var(--border-hair);
}
.case__stack strong {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.022em;
  color: var(--text);
}
.case__stack span {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: -0.016em;
}

.case__decisions { display: flex; flex-direction: column; gap: var(--sp-4); }
.case__decisions li { display: flex; gap: var(--sp-4); align-items: flex-start; }
.case__num {
  color: var(--accent);
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  padding-top: 3px;
  flex-shrink: 0;
}

.case__pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-4);
  margin-top: var(--sp-9);
  padding-top: var(--sp-6);
  border-top: 1px solid var(--border);
}
.case__pager-link {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: var(--sp-5);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  background: var(--surface-solid);
  transition: border-color 250ms;
}
.case__pager-link:hover { border-color: var(--accent); }
.case__pager-link:active { transform: scale(0.99); }
.case__pager-link span {
  color: var(--text-faint);
  font-size: 12px;
  letter-spacing: -0.01em;
}
.case__pager-link strong {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.022em;
  color: var(--accent);
}
.case__pager-link--next { text-align: right; }

.case__missing {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--sp-4);
}
.case__missing p { color: var(--text-muted); }

@media (max-width: 640px) {
  .case__pager { grid-template-columns: 1fr; }
  .case__pager-link--next { text-align: left; }
}
</style>
