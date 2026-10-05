import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import SiteNav from './components/shell/SiteNav';

const CharacterPage = lazy(() => import('./views/CharacterPage'));
const AboutPage = lazy(() => import('./views/AboutPage'));
const WorkPage = lazy(() => import('./views/WorkPage'));
const ContactPage = lazy(() => import('./views/ContactPage'));
const CreatorPage = lazy(() => import('./views/CreatorPage'));
const ProjectCasePage = lazy(() => import('./views/ProjectCasePage'));
const XRayPage = lazy(() => import('./views/XRayPage'));

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

/* Set on <html> so every page, including portalled bits, inherits the
   chapter's tokens. Only the Creator page (profile 2) uses chapter two. */
function ChapterTheme() {
  const { pathname } = useLocation();
  useEffect(() => {
    const two = pathname.startsWith('/creator') || pathname.startsWith('/profile-2');
    document.documentElement.dataset.chapter = two ? 'two' : 'one';
    document.documentElement.style.colorScheme = two ? 'light' : 'dark';
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ChapterTheme />
      <ScrollManager />
      <SiteNav />
      <main>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<CharacterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/creator" element={<CreatorPage />} />
            <Route path="/profile-2" element={<CreatorPage />} />
            <Route path="/projects/:slug" element={<ProjectCasePage />} />
            <Route path="/xray" element={<XRayPage />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}
