"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useFinePointer } from "@/hooks/useFinePointer";

interface FollowCursorProps {
  /** Text shown in the pill that trails the pointer. Distinct per element. */
  label: string;
  children: ReactNode;
  className?: string;
}

const OFFSET = 20; // spec: pill sits +20 / +20 bottom-right of the pointer
const SPRING = { stiffness: 500, damping: 40, mass: 0.6 };

/**
 * Wraps interactive content and trails a small labelled pill from the pointer
 * while hovered. Shared by the Service accordion, contact cards, social icons,
 * and the My Story button.
 *
 * Decorative only: the follower is never the interaction surface, so keyboard
 * users operate the real children with no cursor involved. It is suppressed
 * under prefers-reduced-motion and on touch / coarse-pointer devices (there is
 * no pointer to follow). Presence-safe — state-driven `animate`, no `initial`
 * (which AnimatePresence would skip on first paint).
 */
export function FollowCursor({ label, children, className }: FollowCursorProps) {
  const prefersReducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const enabled = finePointer && !prefersReducedMotion;

  const [active, setActive] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);
  const firstMove = useRef(true);

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={className}
      onPointerEnter={() => {
        firstMove.current = true;
        setActive(true);
      }}
      onPointerLeave={() => setActive(false)}
      onPointerMove={(e) => {
        const px = e.clientX + OFFSET;
        const py = e.clientY + OFFSET;
        if (firstMove.current) {
          // Snap to the pointer on the first frame so it doesn't fly in from 0,0.
          x.jump(px);
          y.jump(py);
          firstMove.current = false;
        }
        rawX.set(px);
        rawY.set(py);
      }}
    >
      {children}

      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.6 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        style={{ x, y }}
        className="pointer-events-none fixed top-0 left-0 z-[60] rounded-full bg-accent px-3 py-1 text-[11px] font-semibold tracking-wide text-bg type-heading"
      >
        {label}
      </motion.span>
    </div>
  );
}
