import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    /* Hash scrolling is handled by the afterEach hook below so Lenis
       controls the animation instead of the browser's native jump. */
    if (to.hash) return false;
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePage.vue'),
    },
    {
      path: '/creator',
      name: 'creator',
      component: () => import('../views/CreatorPage.vue'),
    },
    {
      path: '/projects/:slug',
      name: 'project',
      component: () => import('../views/ProjectCasePage.vue'),
      props: true,
    },
  ],
});

/* After navigation, scroll to hash target via Lenis (if available) or
   native fallback. A small delay lets the DOM settle after route change. */
router.afterEach((to) => {
  if (!to.hash) return;
  requestAnimationFrame(() => {
    const el = document.querySelector(to.hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

export default router;

