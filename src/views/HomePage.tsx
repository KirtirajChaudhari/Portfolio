import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import Page from '../components/site/Page';
import CharacterCanvas from '../components/character/CharacterCanvas';
import PinnedCard from '../components/about/PinnedCard';
import ToolsKeyboard from '../components/about/ToolsKeyboard';
import { siteMeta } from '../content/shared';
import { aboutBio } from '../content/professional';
import { glance } from '../content/facts';
import { caseFigures, leadCases, otherCases } from '../content/projects';

/* The figure loads after first paint: it is illustration, and the hero name is the LCP element. */
const Field = lazy(() => import('../components/field/Field'));

/* Real facts only, from content/professional.ts and content/projects.ts. */
const BIO = 'I build machine learning that shows its reasoning: clinical nutrition, retinal screening, railway safety. M.Tech AI & ML at MIT-WPU, Pune.';

const TOUR = [
  { href: '#about', n: '01', label: 'About me' },
  { href: '#work', n: '02', label: 'Projects in 3D' },
  { to: '/creator', n: '03', label: 'The artistic side' },
];

export default function HomePage() {
  const stage = useRef<HTMLElement>(null);
  const [figure, setFigure] = useState(false);

  /* Building 23,756 points is a long task: do it only once the stage is within a
     screen of the viewport, never during the first load of the hero. */
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setFigure(true); io.disconnect(); }
    }, { rootMargin: '100% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Page band>
      {/* ---- Hero: the head-tracking avatar on its own red. ---- */}
      <section className="hero" aria-labelledby="hero-title">
        <CharacterCanvas contained />
        <div className="wrap hero-copy grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="intro max-w-[30rem]">
            <p className="hero-hi" style={{ '--i': 0 } as React.CSSProperties}>Hi, I'm</p>
            <h1 id="hero-title" className="hero-name mt-1" style={{ '--i': 1 } as React.CSSProperties}>
              Kirtiraj<span className="sr-only"> Chaudhari, AI/ML engineer</span>
            </h1>
            <p className="mt-5 text-[1rem] leading-relaxed text-white/90 sm:text-[1.0625rem]" style={{ '--i': 2 } as React.CSSProperties}>{BIO}</p>
            <div className="mt-8 flex flex-wrap gap-3" style={{ '--i': 3 } as React.CSSProperties}>
              <a href="#about" className="button button-disc">
                Explore
                <span className="disc"><ArrowDown size={15} strokeWidth={1.75} aria-hidden="true" /></span>
              </a>
              <a href={siteMeta.resumeUrl} target="_blank" rel="noopener" className="button button-line">
                Résumé
                <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
          <nav aria-label="Explore the site" className="hero-tour hidden gap-2 lg:grid lg:justify-items-end">
            {TOUR.map((t) => t.to
              ? <Link key={t.n} to={t.to} viewTransition><span>{t.n}</span>{t.label}<ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" /></Link>
              : <a key={t.n} href={t.href}><span>{t.n}</span>{t.label}<ArrowDown size={14} strokeWidth={1.75} aria-hidden="true" /></a>)}
          </nav>
        </div>
        <a href="#about" className="hero-explore absolute bottom-5 left-1/2 hidden -translate-x-1/2 md:grid" aria-label="Scroll to explore">
          <span className="hero-cue" aria-hidden="true" />
          <span className="t-kicker" aria-hidden="true">Scroll</span>
        </a>
      </section>

      {/* ---- About: the ID card and the keyboard. ---- */}
      <section id="about" className="band" aria-labelledby="about-title">
        <div className="wrap grid items-start gap-x-16 gap-y-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <div className="mx-auto w-full max-w-[17rem]">
            <PinnedCard />
          </div>
          <div className="lg:pt-24">
            <p className="t-kicker">About</p>
            <h2 id="about-title" className="t-h2 mt-5 max-w-[14em]">Machine learning that shows its reasoning.</h2>
            <p className="t-lede mt-7">{aboutBio[0]}</p>
            <p className="t-body mt-4">{aboutBio[1]}</p>
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-rule pt-8">
              {glance.map((f) => (
                <div key={f.label}>
                  <dt className="t-kicker !gap-0 before:!hidden">{f.label}</dt>
                  <dd className="mt-2 font-[560]">{f.value}</dd>
                </div>
              ))}
            </dl>
            <Link to="/about" viewTransition className="button button-line button-disc mt-10">
              The full story
              <span className="disc"><ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" /></span>
            </Link>
          </div>
        </div>

        <div className="wrap mt-24 grid items-center gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <p className="t-kicker">Tools</p>
            <h3 className="t-h2 mt-5">The stack, typed out.</h3>
            <p className="t-body mt-5">
              Python for the models, FastAPI and Django for the services around them, React and Next.js for the
              people who use them, and Neo4j when the problem is a graph.
            </p>
          </div>
          <ToolsKeyboard />
        </div>
      </section>

      {/* ---- Projects: the 3D figure. Renderer, formations and easing unchanged. ---- */}
      <section ref={stage} id="work" className="stage" data-step="0" aria-labelledby="work-title">
        <div className="stage-field">
          <div className="stage-pin">
            <div className="stage-window" aria-hidden="true" />
            {figure && (
              <Suspense fallback={null}>
                <Field stage={stage} />
              </Suspense>
            )}
            <p className="stage-caption t-data" data-for="1" aria-hidden="true">
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

        <div data-panel className="panel panel-intro">
          <div className="wrap">
            <div className="panel-copy">
              <p className="t-kicker">Selected work</p>
              <h2 id="work-title" className="t-h2 mt-5">Three builds, drawn in one figure.</h2>
              <p className="t-lede mt-6">
                Scroll on and 23,756 points rearrange themselves: a knowledge graph, a neural network at its real
                layer sizes, a length of railway track.
              </p>
            </div>
          </div>
        </div>

        {leadCases.map((c, i) => (
          <article key={c.slug} data-panel className="panel">
            <div className="wrap">
              <div className="panel-copy">
                <p className="panel-index">{String(i + 1).padStart(2, '0')} / {String(leadCases.length).padStart(2, '0')}</p>
                <h3 className="t-display panel-title mt-4">{c.title}</h3>
                <p className="t-lede mt-5">{c.oneLiner}</p>
                <ul className="mt-7 grid gap-1.5 border-l border-signal/60 pl-4 font-data text-[0.9375rem] text-fg">
                  {caseFigures(c.slug).map((f) => <li key={f}>{f}</li>)}
                </ul>
                <ul aria-label="Built with" className="mt-6 flex flex-wrap gap-2">
                  {c.techLine.split(' · ').map((t) => <li key={t} className="chip">{t}</li>)}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link to={`/projects/${c.slug}`} viewTransition className="button button-disc" aria-label={`Read the ${c.title} case`}>
                    Read the case
                    <span className="disc"><ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" /></span>
                  </Link>
                  {c.live && (
                    <a href={c.live} target="_blank" rel="noopener" className="link inline-flex min-h-11 items-center gap-1 text-fg-2">
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

      <section className="relative z-[1] band-tight">
        <div className="wrap">
          <div className="card flex flex-wrap items-center justify-between gap-6 px-6 py-8 sm:px-10">
            <p className="t-h3 max-w-[30em] text-fg-2">
              {otherCases.length} more builds are on the Work page, from a restaurant point-of-sale system to ID-card
              segmentation.
            </p>
            <Link to="/work" viewTransition className="button button-disc">
              All work
              <span className="disc"><ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" /></span>
            </Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
