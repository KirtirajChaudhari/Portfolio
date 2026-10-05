import './FilmFrame.css';

/* Deliberate placeholder: the exported photographs aren't in the repo and
   nothing is scraped from Instagram, so an empty `src` renders a film frame
   rather than a stand-in image. */
export default function FilmFrame({ index, total, large }: { index: number; total: number; large?: boolean }) {
  return (
    <span className={`frame${large ? ' frame--lg' : ''}`} aria-hidden="true">
      <span className="frame__perf frame__perf--top"></span>
      <span className="frame__body">
        <span className="frame__num">{String(index).padStart(2, '0')}</span>
        <span className="frame__of">/ {String(total).padStart(2, '0')}</span>
      </span>
      <span className="frame__perf frame__perf--bottom"></span>
    </span>
  );
}
