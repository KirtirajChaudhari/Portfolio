import { workJourney } from '../../content/journey';
import OutLink from '../site/OutLink';

const range = (dates: string) => dates.replace(' – ', ' to ');

/** The internships as one rule with the entries hung off it, alternating sides on
 *  desktop (from f03c96b). Newest first, like the content. A single column with the
 *  rule on the left below `lg`. */
export default function InternshipTimeline() {
  return (
    <ol className="timeline timeline-split mt-12">
      {workJourney.map((r, i) => {
        const left = i % 2 === 0;
        return (
          <li key={r.id} className="relative pb-14 pl-9 last:pb-0 lg:grid lg:grid-cols-2 lg:gap-x-20 lg:pl-0">
            <span aria-hidden="true" className="timeline-dot" />
            {/* The date sits on the other side of the rule from the story. */}
            <p className={`font-data text-xs uppercase tracking-[0.14em] text-signal lg:pt-1 ${left ? 'lg:order-2' : 'lg:text-right'}`}>{range(r.dateRange)}</p>
            <div className={`enter mt-3 lg:mt-0 ${left ? 'lg:order-1 lg:text-right' : ''}`}>
              <div className={left ? 'lg:ml-auto lg:max-w-[34rem]' : 'lg:max-w-[34rem]'}>
                <div className={`flex items-center gap-3 ${left ? 'lg:flex-row-reverse' : ''}`}>
                  {r.logo
                    ? <span className="logo-tile"><img src={encodeURI(r.logo)} alt="" loading="lazy" /></span>
                    : <span className="logo-tile font-[600] text-[#1c0c0d]">{r.organization.charAt(0)}</span>}
                  <h3 className="t-h3">{r.heading}</h3>
                </div>
                <p className="mt-2 text-[0.9375rem] text-fg-2"><OutLink href={r.url}>{r.organization}</OutLink></p>
                <p className="t-body mt-3 text-[0.9375rem]">{r.description}</p>
                <ul aria-label="Skills" className={`mt-4 flex flex-wrap gap-2 ${left ? 'lg:justify-end' : ''}`}>
                  {r.skills.map((s) => <li key={s} className="chip">{s}</li>)}
                </ul>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
