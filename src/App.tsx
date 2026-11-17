import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import Header from './components/site/Header';
import HomePage from './views/HomePage';

const WorkPage = lazy(() => import('./views/WorkPage'));
const ProjectCasePage = lazy(() => import('./views/ProjectCasePage'));
const AboutPage = lazy(() => import('./views/AboutPage'));
const ContactPage = lazy(() => import('./views/ContactPage'));
const NotFoundPage = lazy(() => import('./views/NotFoundPage'));

const CreatorPage = lazy(() => import('./views/CreatorPage'));
/* The two experiments keep their own nav and stylesheets in their lazy chunks. */
const XRayPage = lazy(() => import('./views/XRayPage'));
const CharacterPage = lazy(() => import('./views/CharacterPage'));
const LegacyNav = lazy(() => import('./components/shell/SiteNav'));

/** Which token set and stylesheet family a path belongs to. */
function chapterOf(pathname: string): 'pro' | 'one' {
  if (pathname.startsWith('/xray') || pathname.startsWith('/character')) return 'one';
  return 'pro';
}

/* Route changes scroll to top; hash links scroll to their target. Back/forward
   (POP) is left to the browser's own restoration. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const type = useNavigationType();

  useEffect(() => {
    if (hash) {
      /* Lazy routes: the target may not be in the DOM yet, so retry for ~1s. */
      let id = 0;
      let tries = 0;
      const seek = () => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else if (tries++ < 60) id = requestAnimationFrame(seek);
      };
      id = requestAnimationFrame(seek);
      return () => cancelAnimationFrame(id);
    }
    if (type !== 'POP') window.scrollTo(0, 0);
  }, [pathname, hash, type]);

  return null;
}

/* Set on <html> so every page, including portalled bits, inherits its chapter's
   tokens. Professional pages take their colour scheme from the stylesheet
   (system preference or the saved theme); the legacy pages pin theirs inline. */
function ChapterTheme({ chapter }: { chapter: 'pro' | 'one' }) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.chapter = chapter;
    root.style.colorScheme = chapter === 'pro' ? '' : 'dark';
  }, [chapter]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const chapter = chapterOf(pathname);

  return (
    <>
      <ChapterTheme chapter={chapter} />
      <ScrollManager />
      {chapter === 'pro' ? <Header /> : <Suspense fallback={null}><LegacyNav /></Suspense>}
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/projects/:slug" element={<ProjectCasePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/creator" element={<CreatorPage />} />
          <Route path="/profile-2" element={<CreatorPage />} />
          <Route path="/xray" element={<main><XRayPage /></main>} />
          <Route path="/character" element={<main><CharacterPage /></main>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
