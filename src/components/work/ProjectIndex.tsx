import { useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { projectCases, type ProjectCase } from '../../content/projects';
import Shot from '../site/Shot';
import FormationFigure from '../site/FormationFigure';

function Preview({ p }: { p: ProjectCase }) {
  /* The first project's capture is the page's largest image: fetched at once, not lazily. */
  if (p.shot) return <div className="plate"><Shot shot={p.shot} name={p.slug} sizes="(min-width: 1024px) 40vw, 92vw" eager={p.slug === projectCases[0].slug} /></div>;
  if (p.figure) return <div className="plate aspect-[16/10]" style={{ viewTransitionName: `shot-${p.slug}` }}><FormationFigure formation={p.figure} /></div>;
  /* No capture and no figure: the stack as a typographic plate, nothing invented. */
  return (
    <div className="plate grid aspect-[16/10] place-items-center p-8">
      <p className="text-center font-data text-sm leading-relaxed text-fg-3">{p.techLine}</p>
    </div>
  );
}

function Detail({ p }: { p: ProjectCase }) {
  return (
    <div>
      <Preview p={p} />
      <p className="mt-5 font-data text-xs uppercase tracking-[0.12em] text-signal">{p.techLine}</p>
      <p className="mt-2 max-w-[52ch] text-lg leading-snug text-fg">{p.oneLiner}</p>
      {p.outcome && <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-fg-2">{p.outcome}</p>}
      <Link to={`/projects/${p.slug}`} viewTransition className="button button-disc mt-6" aria-label={`Read the ${p.title} case`}>
        Open the case
        <span className="disc"><ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" /></span>
      </Link>
    </div>
  );
}

/** An index of the work, from f03c96b: a ruled list on one side, a detail pane on the
 *  other (inline under its row on phones). Arrow keys move through the list; selecting
 *  never navigates, only "Open the case" does. */
export default function ProjectIndex() {
  const [sel, setSel] = useState(0);
  const reduce = useReducedMotion();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = projectCases.length;
    const next = e.key === 'ArrowDown' ? (i + 1) % n : e.key === 'ArrowUp' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    setSel(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="mt-12 grid gap-x-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <ol className="divide-y divide-dashed divide-rule-2 border-y border-dashed border-rule-2" aria-label="Projects">
        {projectCases.map((p, i) => {
          const on = sel === i;
          return (
            <li key={p.slug}>
              <button
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                aria-expanded={on}
                aria-controls={`proj-pane-${i}`}
                onClick={() => setSel(i)}
                onFocus={() => setSel(i)}
                onMouseEnter={() => { if (window.matchMedia('(hover: hover)').matches) setSel(i); }}
                onKeyDown={(e) => onKey(e, i)}
                className="group grid min-h-14 w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-3 py-4 text-left"
              >
                <span className={`font-data text-xs transition-colors duration-300 ${on ? 'text-signal' : 'text-fg-3'}`}>{String(i + 1).padStart(2, '0')}</span>
                <span className={`text-xl font-[600] leading-tight tracking-tight transition-[color,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:text-2xl ${on ? 'translate-x-2 text-fg' : 'text-fg-2 group-hover:text-fg'}`}>
                  {p.title}
                </span>
                <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" className={`transition-opacity duration-300 ${on ? 'text-signal opacity-100' : 'opacity-0'}`} />
              </button>
              {/* Phones: the detail opens inline under its row. */}
              <div id={`proj-pane-${i}`} className="lg:hidden" hidden={!on}>
                {on && <div className="pb-8 pt-2"><Detail p={p} /></div>}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="hidden lg:block">
        <div className="sticky top-28">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={projectCases[sel].slug}
              initial={reduce ? false : { opacity: 0.4, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0.4 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              <Detail p={projectCases[sel]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
