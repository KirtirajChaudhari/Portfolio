import { siteMeta } from './shared';
import { getProjectCase, projectCases } from './projects';

export interface RouteMeta {
  title: string;
  description: string;
  /** False for pages search engines should skip. */
  index: boolean;
  /** Aliases keep their route but identify the original page to search engines. */
  canonicalPath?: string;
}

const HOME =
  'Kirtiraj Chaudhari is an AI/ML engineer in Pune building machine learning that shows its reasoning: clinical nutrition, retinal screening and railway safety.';

const PAGES: Record<string, { title: string; description: string }> = {
  '/work': {
    title: 'Work',
    description: 'Nine builds by Kirtiraj Chaudhari: a clinical diet engine, a retinal classifier written by hand, a railway safety detector, and six more.',
  },
  '/about': {
    title: 'About',
    description: 'About Kirtiraj Nitin Chaudhari: AI/ML engineer, M.Tech student at MIT-WPU Pune, builder of RasaCare.',
  },
  '/contact': {
    title: 'Contact',
    description: 'Contact Kirtiraj Chaudhari: open to AI/ML roles and to research or product collaborations.',
  },
  '/creator': {
    title: 'Creator',
    description: 'Photography, music and writing by Kirtiraj Nitin Chaudhari.',
  },
};

const titled = (title: string) => `${title} · ${siteMeta.displayName}`;

/** Title and description for a professional route. One source for the running
 *  page (components/site/Page) and for the build-time prerender. */
export function routeMeta(pathname: string): RouteMeta {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/profile-2') return { ...routeMeta('/creator'), canonicalPath: '/creator' };
  if (path === '/') return { title: `${siteMeta.displayName} · ${siteMeta.role}`, description: HOME, index: true };
  if (PAGES[path]) return { title: titled(PAGES[path].title), description: PAGES[path].description, index: true };
  const project = path.startsWith('/projects/') ? getProjectCase(path.slice('/projects/'.length)) : undefined;
  if (project) return { title: titled(project.title), description: project.oneLiner, index: true };
  return { title: titled('Page not found'), description: HOME, index: false };
}

/** Every route that is rendered to static HTML at build time. */
export const PRERENDERED = ['/', '/work', '/about', '/contact', '/creator', '/profile-2', ...projectCases.map((p) => `/projects/${p.slug}`)];
