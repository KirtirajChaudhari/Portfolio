<template>
  <section id="epilogue" class="section">
    <div class="container epilogue">
      <div class="epilogue__content">
        <span class="attribution reveal" :class="{ 'is-visible': vis }">Epilogue</span>
        <h2 class="display-lg reveal" :class="{ 'is-visible': vis }" style="transition-delay:60ms">
          Let's write the<br>next chapter together.
        </h2>
        <p class="reveal" :class="{ 'is-visible': vis }" style="transition-delay:120ms">
          I'm looking for a team where explainable ML meets real products. If that's yours, the next page is blank.
        </p>
        <div class="epilogue__actions reveal" :class="{ 'is-visible': vis }" style="transition-delay:180ms">
          <a :href="siteMeta.resumeUrl" target="_blank" rel="noopener" class="btn btn--primary shimmer">
            Download Resume
          </a>
        </div>
        <div class="social-row reveal" :class="{ 'is-visible': vis }" style="transition-delay:240ms">
          <a v-if="siteMeta.socials.github" :href="siteMeta.socials.github" target="_blank" rel="noopener" class="social-icon" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          </a>
          <a v-if="siteMeta.socials.linkedin" :href="siteMeta.socials.linkedin" target="_blank" rel="noopener" class="social-icon" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <a :href="`mailto:${siteMeta.email}`" class="social-icon" aria-label="Email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </a>
        </div>

        <RouterLink to="/creator" class="btn epilogue__creator-btn reveal" :class="{ 'is-visible': vis }" style="transition-delay:300ms">
          Meet the Creator →
        </RouterLink>
      </div>

      <div class="epilogue__name reveal" :class="{ 'is-visible': vis }" style="transition-delay:360ms">
        <span>KIRTIRAJ</span>
      </div>

      <p class="epilogue__closing mono-xs reveal" :class="{ 'is-visible': vis }" style="transition-delay:420ms">
        — The End. (Until the next commit.)
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { siteMeta } from '../../content/shared';

const vis = ref(false);
onMounted(() => {
  const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) vis.value = true; }, { threshold: 0.15 });
  const el = document.getElementById('epilogue');
  if (el) observer.observe(el);
});
</script>

<style scoped>
.epilogue {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
}
.epilogue__content h2 {
  margin-bottom: var(--sp-5);
  text-transform: none;
}
.epilogue__content p {
  color: var(--text-muted);
  max-width: 48ch;
  margin: 0 auto var(--sp-7);
}
.epilogue__actions {
  margin-bottom: var(--sp-6);
}
.epilogue__creator-btn {
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end));
  color: #fff;
  padding: 14px 32px;
  border-radius: var(--r-pill);
  font-family: var(--font-mono);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-top: var(--sp-7);
  transition: transform var(--dur-fast);
}
.epilogue__creator-btn:active { transform: scale(0.95); }
.epilogue__creator-btn:hover { filter: brightness(1.1); }
.epilogue__name {
  margin-top: var(--sp-9);
}
.epilogue__name span {
  font-family: var(--font-display);
  font-size: clamp(4rem, 12vw, 10rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: transparent;
  -webkit-text-stroke: 1px var(--border);
  user-select: none;
}
.epilogue__closing {
  color: var(--text-faint);
  margin-top: var(--sp-4);
  padding-bottom: var(--sp-8);
}
</style>
