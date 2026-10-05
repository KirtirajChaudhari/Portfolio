import { motion, useReducedMotion } from 'motion/react';

/** Paragraph whose words drift up and fade in, a few milliseconds apart. Plays
 *  once. The text is also present as one plain string for assistive tech, and the
 *  per-word spans are hidden from it. Reduced motion shows ordinary text. */
export default function WordReveal({
  text, className, delay = 0,
}: { text: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <p className={className}>{text}</p>;

  const words = text.split(' ');
  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delayChildren: delay, staggerChildren: 0.01 }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            <motion.span
              className="inline-block"
              variants={{ hidden: { opacity: 0, y: '0.8rem' }, shown: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.72, ease: [0.165, 0.84, 0.44, 1] }}
            >
              {w}
            </motion.span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </motion.p>
  );
}
