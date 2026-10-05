import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { siteMeta } from '../../content/shared';
import GradientBackdrop from './GradientBackdrop';

/** Dark, red-lit frame shared by About, Work, Contact and the case studies. */
export default function PageShell({ title, children }: { title: string; children: ReactNode }) {
  useEffect(() => {
    document.title = `${title} · ${siteMeta.displayName}`;
    const prev = document.body.style.background;
    document.body.style.background = '#12090a';
    return () => { document.body.style.background = prev; };
  }, [title]);

  return (
    <div className="relative isolate min-h-dvh text-[#f7ece7]">
      <GradientBackdrop />
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-24 pt-28 sm:px-8 sm:pt-36 lg:px-12">
        {children}
      </div>
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-[#f7ece7]/65 sm:px-8 lg:px-12">
          <p>{siteMeta.fullName}. Pune, India.</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link className="hover:text-white" to="/">Home</Link>
            <Link className="hover:text-white" to="/work">Work</Link>
            <Link className="hover:text-white" to="/about">About</Link>
            <Link className="hover:text-white" to="/contact">Contact</Link>
            <Link className="hover:text-white" to="/creator">Profile 2</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
