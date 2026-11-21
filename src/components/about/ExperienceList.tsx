import { workJourney } from '../../content/journey';
import OutLink from '../site/OutLink';

export const experienceRange = (dates: string) => dates.replace(' – ', ' to ');

/** The organisation's logo, or its initial on the same tile when none is supplied. */
export function OrgMark({ logo, organization }: { logo: string; organization: string }) {
  return logo
    ? <span className="logo-tile"><img src={encodeURI(logo)} alt="" loading="lazy" /></span>
    : <span className="logo-tile font-[600] text-[#1c0c0d]" aria-hidden="true">{organization.charAt(0)}</span>;
}

/** Experience on About, newest first: the same rule-and-dot timeline as Education,
 *  from the same data as the Work page's timeline. Role, organisation and location,
 *  then the tenure above them; detail only where a confirmed one exists. */
export default function ExperienceList() {
  return (
    <ol className="timeline">
      {workJourney.map((r) => (
        <li key={r.id} className="relative pb-12 pl-9 last:pb-0">
          <span aria-hidden="true" className="timeline-dot" />
          <p className="font-data text-xs uppercase tracking-[0.14em] text-signal">{experienceRange(r.dateRange)}</p>
          <div className="mt-3 flex items-start gap-4">
            <OrgMark logo={r.logo} organization={r.organization} />
            <div className="min-w-0">
              <h3 className="t-h3">{r.heading}</h3>
              <p className="mt-1 text-[0.9375rem] text-fg-2">
                <OutLink href={r.url}>{r.organization}</OutLink>
                {r.location && <span className="text-fg-3"> · {r.location}</span>}
              </p>
              {r.description && <p className="t-body mt-3 text-[0.9375rem]">{r.description}</p>}
              {r.skills && r.skills.length > 0 && (
                <ul aria-label="Skills" className="mt-4 flex flex-wrap gap-2">
                  {r.skills.map((s) => <li key={s} className="chip">{s}</li>)}
                </ul>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
