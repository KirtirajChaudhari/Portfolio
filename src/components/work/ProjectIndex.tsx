import { useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { projectCases, type ProjectCase } from '../../content/projects';

function Detail({ p }: { p: ProjectCase }) {
  return (
    <div>
      <div className="overflow-hidden rounded-[1.25rem] border border-white/12 bg-[#1d0e10]">
        {p.screenshot
          ? <img src={p.screenshot} alt={`${p.title} interface`} loading="lazy" className="aspect-[16/10] w-full object-cover object-top" />
          : <div className="grid aspect-[16/10] place-items-center text-7xl font-semibold text-white/10">{p.title.charAt(0)}</div>}
      </div>
      <p className="mt-5 font-mono text-xs uppercase tracking-[0.12em] text-[#ff7a66]">{p.techLine}</p>
      <p className="mt-2 max-w-[52ch] text-lg leading-snug text-white">{p.oneLiner}</p>
      {p.outcome && <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-[#f7ece7]/70">{p.outcome}</p>}
      <Link
        to={`/projects/${p.slug}`}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-white py-2 pl-5 pr-2 text-sm font-semibold text-neutral-900 transition-transform duration-300 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Open the case
        <span className="grid h-8 w-8 place-items-center rounded-full bg-neutral-900 text-white"><ArrowUpRight size={15} strokeWidth={1.75} /></span>
      </Link>
    </div>
  );
}

/** An index of the work: a ruled list on one side, a detail pane on the other (inline on phones).
 *  Arrow keys move through the list; selecting never navigates, only "Open the case" does. */
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
    <div className="mt-10 grid gap-x-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <ol className="divide-y divide-dashed divide-white/20 border-y border-dashed border-white/20" aria-label="Projects">
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
                className="group grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-3 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className={`font-mono text-xs transition-colors duration-300 ${on ? 'text-[#ff7a66]' : 'text-[#f7ece7]/55'}`}>{String(i + 1).padStart(2, '0')}</span>
                <span className={`text-xl font-semibold leading-tight tracking-tight transition-[color,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:text-2xl ${on ? 'translate-x-2 text-white' : 'text-[#f7ece7]/70 group-hover:text-white'}`}>
                  {p.title}
                </span>
                <ArrowUpRight size={18} strokeWidth={1.5} className={`transition-opacity duration-300 ${on ? 'text-[#ff7a66] opacity-100' : 'opacity-0'}`} aria-hidden />
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
          <AnimatePresence mode="wait">
            <motion.div
              key={projectCases[sel].slug}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              aria-live="polite"
            >
              <Detail p={projectCases[sel]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
