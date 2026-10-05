import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/** One calm fade-up the first time a block scrolls in. Transform and opacity only. */
export default function Reveal({
  children, delay = 0, className, as = 'div',
}: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'section' | 'article' }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </Tag>
  );
}
