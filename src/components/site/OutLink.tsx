import { ArrowUpRight } from 'lucide-react';

/** An inline link to another site. The arrow is glued to the last word, so a
 *  label that wraps never leaves its arrow stranded at the end of the column. */
export default function OutLink({ href, children, className = '' }: { href: string; children: string; className?: string }) {
  const cut = children.lastIndexOf(' ');
  const head = cut < 0 ? '' : children.slice(0, cut + 1);
  const tail = cut < 0 ? children : children.slice(cut + 1);
  return (
    <a href={href} target="_blank" rel="noopener" className={`link ${className}`}>
      {head}
      <span className="whitespace-nowrap">
        {tail}
        <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" className="ml-1 inline-block align-[-0.1em]" />
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
