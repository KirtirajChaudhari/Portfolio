import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Page from '../components/site/Page';

export default function NotFoundPage() {
  return (
    <Page close={false}>
      <section className="wrap intro page-top flex min-h-[80svh] flex-col justify-center pb-20">
        <p className="t-kicker" style={{ '--i': 0 } as React.CSSProperties}>404</p>
        <h1 className="t-display mt-6" style={{ '--i': 1 } as React.CSSProperties}>Nothing at this address.</h1>
        <p className="t-lede mt-6" style={{ '--i': 2 } as React.CSSProperties}>
          The page may have moved, or the link was mistyped.
        </p>
        <div className="mt-9 flex flex-wrap gap-3" style={{ '--i': 3 } as React.CSSProperties}>
          <Link to="/" viewTransition className="button button-disc">Home <span className="disc"><ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" /></span></Link>
          <Link to="/work" viewTransition className="button button-line">Work <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" /></Link>
        </div>
      </section>
    </Page>
  );
}
