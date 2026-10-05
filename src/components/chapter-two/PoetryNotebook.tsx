import { poetryMeta } from '../../content/novel';
import { poemFragments } from '../../content/poetry';
import SectionHeader from './SectionHeader';
import Tape from './Tape';
import './PoetryNotebook.css';

const fragment = poemFragments[0];

export default function PoetryNotebook({ vis }: { vis?: boolean }) {
  return (
    <section id="poetry" className="poetry">
      <div className="container">
        <SectionHeader
          note="between the lines…"
          title="Poetry"
          highlight="Poetry"
          hue="violet"
          align="right"
          handle={poetryMeta.handle}
          handleHref={poetryMeta.profileUrl}
          vis={vis}
        />

        <div className={`poetry__row${vis ? ' is-in' : ''}`}>
          {/* The notebook stays shut: the writing is published elsewhere and
              is not duplicated here. The ink on the curled page is illegible
              on purpose: suggestion, not invented body text. */}
          <div className="book">
            <span className="book__pin"></span>
            <span className="book__mat"></span>
            <div className="book__cover">
              <span className="book__spine"></span>
              <span className="book__seam"></span>
              <span className="book__edge"></span>
              <span className="book__elastic"></span>

              <div className="book__plate">
                <span className="book__handle hand">{poetryMeta.handle}</span>
                <span className="book__blurb hand">{poetryMeta.blurb}</span>
              </div>

              <div className="book__corner">
                <div className="book__page">
                  <svg viewBox="0 0 120 60" fill="none" stroke="var(--text-muted)" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" aria-hidden="true">
                    <path d="M2 8c8-5 14 4 22 0s12-6 20-2 14 3 22-1" />
                    <path d="M2 24c10-4 16 3 26 0s14-5 24-1" />
                    <path d="M2 40c7-4 13 3 20 0s11-4 18-1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="poetry__aside">
            {/* Renders only when a real fragment lands in content/poetry.ts. */}
            {fragment && (
              <article className="fragment">
                <Tape hue="violet" rotate={-7} />
                {fragment.lines.map((line, i) => <p key={i}>{line}</p>)}
                {fragment.note && <span className="fragment__note hand">{fragment.note}</span>}
                <a href={fragment.href} target="_blank" rel="noopener" className="fragment__link hand">read it in full ↗</a>
              </article>
            )}

            <p className="poetry__copy">
              The notebook stays shut here. The lines that make it out live on Instagram.
            </p>
            <a href={poetryMeta.profileUrl} target="_blank" rel="noopener" className="poetry__out hand">
              read them on Instagram ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
