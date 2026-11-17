import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { routeMeta } from '../../content/meta';
import Footer from './Footer';

/** Frame for every professional page: keeps the document title, description and
 *  robots tag in step with the route (content/meta.ts), and renders the main
 *  landmark and the footer. */
export default function Page({ close = true, children }: { close?: boolean; children: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = routeMeta(pathname);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    const path = meta.canonicalPath ?? (pathname.replace(/\/+$/, '') || '/');
    const url = `https://kirtiraj-chaudhari.vercel.app${path}`;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
      document.querySelector(selector)?.setAttribute('content', meta.title);
    }
    for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      document.querySelector(selector)?.setAttribute('content', meta.description);
    }
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (meta.index) robots?.remove();
    else {
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        document.head.appendChild(robots);
      }
      robots.content = 'noindex';
    }
  }, [pathname]);

  return (
    <>
      <main id="main" tabIndex={-1} className="outline-none">{children}</main>
      <Footer close={close} />
    </>
  );
}
