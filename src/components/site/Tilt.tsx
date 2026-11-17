import { useRef, type PointerEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';

/** Leans its content toward the pointer, a few degrees, on a spring. Decorative:
 *  it does nothing on touch screens or under reduced motion. Values live in
 *  motion values, so moving the pointer never re-renders React. */
export default function Tilt({ children, className = '', max = 5 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 140, damping: 16, mass: 0.6 };
  const rotateY = useSpring(useTransform(x, [-1, 1], [-max, max]), spring);
  const rotateX = useSpring(useTransform(y, [-1, 1], [max, -max]), spring);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse' || !box.current) return;
    const r = box.current.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width) * 2 - 1);
    y.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const leave = () => { x.set(0); y.set(0); };

  return (
    <div ref={box} className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave}>
      <motion.div style={{ rotateX, rotateY }}>{children}</motion.div>
    </div>
  );
}
