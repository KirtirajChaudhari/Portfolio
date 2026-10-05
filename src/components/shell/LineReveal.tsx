import { useLayoutEffect, useRef, useState, type ElementType } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/** Heading that rises into view one line at a time, each line clipped by its own
 *  mask. Lines are measured from the real layout (so the break matches whatever
 *  the width gives), and re-measured on resize. Plays once.
 *  The full text stays one string for assistive tech; the split spans are hidden. */
export default function LineReveal({
  text, as: Tag = 'h2', className, delay = 0,
}: { text: string; as?: ElementType; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  /* Once the first reveal has finished, a re-measure (resize) must not replay it. */
  const played = useRef(false);
  const words = text.split(' ');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const measure = () => {
      const spans = Array.from(el.querySelectorAll<HTMLElement>('[data-w]'));
      if (!spans.length) return;
      const out: string[] = [];
      let top = spans[0].offsetTop;
      let line: string[] = [];
      for (const s of spans) {
        if (Math.abs(s.offsetTop - top) > 2) { out.push(line.join(' ')); line = []; top = s.offsetTop; }
        line.push(s.textContent ?? '');
      }
      out.push(line.join(' '));
      setLines((prev) => (prev && prev.join('|') === out.join('|') ? prev : out));
    };
    measure();
    /* Re-measure from a fresh word layout when the width changes. */
    let w = el.clientWidth;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth !== w) { w = el.clientWidth; setLines(null); }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, reduce, lines === null]);

  if (reduce) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {lines
        ? lines.map((l, i) => (
          <span key={i} aria-hidden="true" className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <motion.span
              className="block"
              initial={played.current ? false : { y: '110%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1, delay: delay + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={() => { played.current = true; }}
            >
              {l}
            </motion.span>
          </span>
        ))
        : (
          /* Measuring pass: plain words, laid out exactly as the final text will be. */
          <span aria-hidden="true">
            {words.map((w, i) => (
              <span key={i}>
                <span data-w>{w}</span>{i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        )}
    </Tag>
  );
}
