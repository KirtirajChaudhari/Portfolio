import { useEffect, type ReactNode } from 'react';
import { siteMeta } from '../../content/shared';
import Footer from './Footer';

const DEFAULT_DESCRIPTION =
  'Kirtiraj Chaudhari is an AI/ML engineer in Pune building machine learning that shows its reasoning: clinical nutrition, retinal screening and railway safety.';

/** Frame for every professional page: sets the document title and description,
 *  renders the main landmark and the footer. */
export default function Page({
  title,
  description = DEFAULT_DESCRIPTION,
  close = true,
  index = true,
  children,
}: {
  /** Omit on the home page. */
  title?: string;
  description?: string;
  close?: boolean;
  index?: boolean;
  children: ReactNode;
}) {
  useEffect(() => {
    document.title = title ? `${title} · ${siteMeta.displayName}` : `${siteMeta.displayName} · ${siteMeta.role}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!index && !robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      robots.content = 'noindex';
      document.head.appendChild(robots);
    }
    return () => { if (!index) robots?.remove(); };
  }, [title, description, index]);

  return (
    <>
      <main id="main" tabIndex={-1} className="outline-none">{children}</main>
      <Footer close={close} />
    </>
  );
}
