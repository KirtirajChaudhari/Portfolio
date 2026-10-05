import { ArrowUpRight } from 'lucide-react';
import { workJourney } from '../../content/journey';
import Reveal from '../shell/Reveal';

/** The internships as one rule with the entries hung off it, alternating sides on desktop.
 *  Newest first, like the content. A single column with the rule on the left below `lg`. */
export default function InternshipTimeline() {
  return (
    <ol className="relative mt-10">
      <span aria-hidden="true" className="absolute bottom-0 left-[0.4rem] top-1 border-l border-dashed border-white/25 lg:left-1/2" />
      {workJourney.map((r, i) => {
        const left = i % 2 === 0;
        return (
          <li key={r.id} className="relative pb-14 pl-9 last:pb-0 lg:grid lg:grid-cols-2 lg:gap-x-20 lg:pl-0">
            <span aria-hidden="true" className="absolute left-0 top-2 h-3.5 w-3.5 rounded-full border border-white/60 bg-[#12090a] lg:left-1/2 lg:-translate-x-1/2" />
            {/* The date mark sits on the other side of the rule from the story. */}
            <p className={`font-mono text-xs uppercase tracking-[0.14em] text-[#ff7a66] lg:pt-1.5 ${left ? 'lg:order-2 lg:text-left' : 'lg:text-right'}`}>{r.dateRange}</p>
            <Reveal className={`mt-3 lg:mt-0 ${left ? 'lg:order-1 lg:text-right' : ''}`}>
              <div className={left ? 'lg:ml-auto lg:max-w-[34rem]' : 'lg:max-w-[34rem]'}>
                <div className={`flex items-center gap-3 ${left ? 'lg:flex-row-reverse' : ''}`}>
                  {r.logo
                    ? <img src={r.logo} alt="" className="h-10 w-10 shrink-0 rounded-lg bg-white object-contain p-1" />
                    : <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10 font-semibold">{r.organization.charAt(0)}</span>}
                  <h3 className="text-lg font-semibold leading-snug text-white sm:text-xl">{r.heading}</h3>
                </div>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener"
                  className="mt-2 inline-flex items-center gap-1 text-[#f7ece7]/70 underline-offset-4 hover:text-white hover:underline"
                >
                  {r.organization}
                  <ArrowUpRight size={14} strokeWidth={1.75} />
                </a>
                <p className="mt-3 text-[15px] leading-relaxed text-[#f7ece7]/75">{r.description}</p>
                <ul className={`mt-4 flex flex-wrap gap-2 ${left ? 'lg:justify-end' : ''}`}>
                  {r.skills.map((s) => (
                    <li key={s} className="rounded-full border border-white/15 px-3 py-1 text-xs text-[#f7ece7]/80">{s}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
