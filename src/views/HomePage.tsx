import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import Page from '../components/site/Page';
import Stack from '../components/site/Stack';
import OutLink from '../components/site/OutLink';
import { siteMeta } from '../content/shared';
import { caseFigures, leadCases } from '../content/projects';
import { workJourney } from '../content/journey';
import { professionalAchievementCards as recognition } from '../content/professional';

/* The figure loads after first paint: it is illustration, and the headline is the LCP element. */
const Field = lazy(() => import('../components/field/Field'));

const range = (dates: string) => dates.replace(' – ', ' to ');

export default function HomePage() {
  const stage = useRef<HTMLElement>(null);
  const [figure, setFigure] = useState(false);

  useEffect(() => {
    const start = () => setFigure(true);
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(start, { timeout: 1200 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(start, 300);
    return () => clearTimeout(id);
  }, []);

  return (
    <Page>
      <section ref={stage} className="stage" data-step="0">
        {/* The field covers the whole stage; its pin is sticky inside it, so the
            figure is released with the last panel instead of drifting over the
            sections that follow. */}
        <div className="stage-field">
          <div className="stage-pin">
            <div className="stage-window" aria-hidden="true" />
            {figure && (
              <Suspense fallback={null}>
                <Field stage={stage} />
              </Suspense>
            )}
            <p className="stage-caption t-data" data-for="0" aria-hidden="true">
              23,756 points, the node count of RasaCare's knowledge graph. The layout is illustrative.
            </p>
            <p className="stage-caption t-data" data-for="2" aria-hidden="true">
              2,788 inputs, 256 hidden units, 4 classes: the real layer sizes. Connections are sampled.
            </p>
            <p className="stage-caption t-data" data-for="3" aria-hidden="true">
              An illustrative length of track, with the frame a detector draws round an obstacle.
            </p>
          </div>
        </div>

        <div data-panel className="panel panel-hero">
          <div className="wrap">
            <div className="panel-copy intro">
              <h1 className="home-title" style={{ '--i': 0 } as React.CSSProperties}>
                Machine learning that shows its reasoning.
              </h1>
              <p className="t-lede mt-7 max-w-[30em]" style={{ '--i': 1 } as React.CSSProperties}>
                I'm Kirtiraj Chaudhari, an AI/ML engineer in Pune. I build models for clinical nutrition, retinal
                screening and railway safety.
              </p>
              <div className="mt-9 flex flex-wrap gap-3" style={{ '--i': 2 } as React.CSSProperties}>
                <a href="#work" className="button">
                  See the work
                  <ArrowDown size={17} strokeWidth={1.75} aria-hidden="true" />
                </a>
                <a href={siteMeta.resumeUrl} target="_blank" rel="noopener" className="button button-line">
                  Résumé
                  <ArrowUpRight size={17} strokeWidth={1.75} aria-hidden="true" />
                  <span className="sr-only"> (downloads from Google Drive)</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {leadCases.map((c, i) => (
          <article key={c.slug} data-panel id={i === 0 ? 'work' : undefined} className="panel">
            <div className="wrap">
              <div className="panel-copy">
                <h2 className="t-display panel-title">{c.title}</h2>
                <p className="t-lede mt-5">{c.oneLiner}</p>
                <ul className="mt-7 grid gap-1.5 border-l border-rule-2 pl-4 font-data text-[0.9375rem] text-fg">
                  {caseFigures(c.slug).map((f) => <li key={f}>{f}</li>)}
                </ul>
                <Stack line={c.techLine} className="mt-5" />
                <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
                  <Link to={`/projects/${c.slug}`} viewTransition className="go" aria-label={`Read the ${c.title} case`}>
                    Read the case
                    <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
                  </Link>
                  {c.live && (
                    <a href={c.live} target="_blank" rel="noopener" className="link inline-flex items-center gap-1 text-fg-2">
                      {c.live.replace('https://', '')}
                      <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="band-tight rule-top relative z-[1] bg-paper">
        <div className="wrap flex flex-wrap items-end justify-between gap-6">
          <p className="t-h3 max-w-[26em] text-fg-2">
            Six more builds are on the Work page, from a restaurant point-of-sale system to ID-card segmentation.
          </p>
          <Link to="/work" viewTransition className="go">
            All work
            <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="band rule-top" aria-labelledby="recognition-title">
        <div className="wrap">
          <h2 id="recognition-title" className="t-h2">Recognition</h2>
          <ul className="mt-12 grid gap-x-16 md:grid-cols-2">
            {recognition.map((r) => (
              <li key={r.id} className="border-t border-rule py-7">
                <p className="t-data flex items-center gap-3">
                  {r.year}
                  {r.status && <span className="tag-status">{r.status}</span>}
                </p>
                <h3 className="t-h3 mt-3">{r.title}</h3>
                <p className="mt-2 text-[0.9375rem] text-fg-2">{r.institution}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band rule-top" aria-labelledby="experience-title">
        <div className="wrap">
          <h2 id="experience-title" className="t-h2">Experience</h2>
          <ol className="ledger mt-12">
            {workJourney.map((j) => (
              <li key={j.id} className="grid gap-x-10 gap-y-3 py-7 lg:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1.5fr)]">
                <p className="t-data lg:pt-1.5">{range(j.dateRange)}</p>
                <div>
                  <h3 className="t-h3">{j.heading}</h3>
                  <p className="mt-1.5 text-[0.9375rem] text-fg-2"><OutLink href={j.url}>{j.organization}</OutLink></p>
                </div>
                <p className="t-body">{j.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </Page>
  );
}
