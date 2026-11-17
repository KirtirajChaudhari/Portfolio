import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Page from '../components/site/Page';

export default function NotFoundPage() {
  return (
    <Page title="Page not found" close={false} index={false}>
      <section className="wrap intro flex min-h-[70svh] flex-col justify-center py-20">
        <p className="t-data" style={{ '--i': 0 } as React.CSSProperties}>404</p>
        <h1 className="t-display mt-4" style={{ '--i': 1 } as React.CSSProperties}>Nothing at this address.</h1>
        <p className="t-lede mt-6" style={{ '--i': 2 } as React.CSSProperties}>
          The page may have moved, or the link was mistyped.
        </p>
        <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3" style={{ '--i': 3 } as React.CSSProperties}>
          <Link to="/" viewTransition className="go">Home <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" /></Link>
          <Link to="/work" viewTransition className="go">Work <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" /></Link>
        </div>
      </section>
    </Page>
  );
}
