/** A project's technologies, from its ` · `-separated `techLine`, set as a wrapping row. */
export default function Stack({ line, className = '' }: { line: string; className?: string }) {
  return (
    <ul aria-label="Built with" className={`t-data flex flex-wrap gap-x-4 gap-y-1 ${className}`}>
      {line.split(' · ').map((t) => <li key={t}>{t}</li>)}
    </ul>
  );
}
