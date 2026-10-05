"use client";

/*
 * Adapted from VengeanceUI "research-bento-grid" (registry item, installed unmodified in the
 * commit "Install research-bento-grid"). The registry component is a SaaS pricing demo: three
 * fixed panels (brand logos, an invoice, a pause toggle) that cannot carry anything else.
 * What is kept: the bezelled grain Panel, FeatureCopy, the labelled arrow cursor, the grid-field
 * texture and the spring. The demo panels, brands, react-icons and framer-motion are gone; the
 * panels are now four tiles fed from `ExpertiseArea[]` (src/content/professional.ts).
 * Dark palette only (the site has no light mode). Animations are transform/opacity only and pause
 * off-screen and under reduced motion.
 */
import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import type { ExpertiseArea } from "@/content/types";

const spring = { type: "spring", stiffness: 230, damping: 24 } as const;

export function Panel({ className, children, ...props }: React.ComponentProps<"section">) {
  const grainId = React.useId().replace(/:/g, "");
  return (
    <section
      {...props}
      className={cn(
        "relative isolate overflow-hidden rounded-[22px] border border-white/12 bg-[#150b0d]",
        "shadow-[inset_0_1px_rgba(255,255,255,0.06),0_16px_40px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_50%)]" />
      {children}
      <svg aria-hidden className="pointer-events-none absolute inset-0 z-50 size-full opacity-[0.1] mix-blend-soft-light">
        <filter id={grainId} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="11" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.55" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>
    </section>
  );
}

function ArrowCursor({ label, className, delay = 0, play }: { label: string; className?: string; delay?: number; play: boolean }) {
  return (
    <motion.div
      aria-hidden
      className={cn("absolute z-30 flex flex-col items-start", className)}
      animate={play ? { x: 0, y: [0, -3, 0], rotate: [0, 1.5, 0] } : { x: 0, y: 0, rotate: 0 }}
      transition={play ? { duration: 4.6, delay, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
    >
      <svg width="26" height="30" viewBox="0 0 26 30" fill="none" className="h-auto w-[18px] sm:w-[22px]">
        <path d="M2.2 2.5 22 15.1l-9.4 2.1-4.1 9.1L2.2 2.5Z" className="fill-[#ff7a66] stroke-white/70" strokeWidth="2.1" strokeLinejoin="round" />
      </svg>
      <span className="ml-2.5 -mt-1 rounded-[22px] border border-white/30 bg-[#ff7a66] px-3 py-1 text-[12px] font-semibold tracking-[-0.02em] text-black sm:text-[13px]">
        {label}
      </span>
    </motion.div>
  );
}

/* A fixed handful of lit cells on a drawn grid: the texture of the original tile field, without 250 nodes. */
const LIT = [[2, 1], [9, 2], [14, 0], [5, 3], [18, 3], [22, 1], [11, 4], [25, 2], [7, 5], [20, 5]] as const;

function GridField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[70%] overflow-hidden"
      style={{ maskImage: "linear-gradient(to bottom,black 0%,black 55%,transparent 100%)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(255 255 255 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {LIT.map(([c, r]) => (
        <span key={`${c}-${r}`} className="absolute bg-white/[0.045]" style={{ left: c * 32, top: r * 32, width: 32, height: 32 }} />
      ))}
    </div>
  );
}

function Tile({ area, className, play, delay }: { area: ExpertiseArea; className?: string; play: boolean; delay: number }) {
  return (
    <Panel className={cn("flex min-h-[22rem] flex-col justify-end", className)} aria-labelledby={`bento-${area.id}`}>
      <GridField />
      {area.figures && (
        <dl className="relative z-10 flex flex-wrap gap-x-8 gap-y-3 px-5 pt-6 sm:px-7 sm:pt-8">
          {area.figures.map((f) => (
            <div key={f.label}>
              <dd className="order-first text-3xl font-semibold leading-none tracking-[-0.04em] text-white sm:text-5xl">{f.value}</dd>
              <dt className="mt-2 max-w-[16ch] text-[12px] leading-snug text-[#f7ece7]/70">{f.label}</dt>
            </div>
          ))}
        </dl>
      )}
      

      <div className="relative z-20 mt-8 px-5 pb-5 sm:px-7 sm:pb-7">
        <ArrowCursor label={area.cursorLabel} play={play} delay={delay} className="right-5 top-0 sm:right-7" />
        <p className="font-mono text-xs text-[#ff7a66]">{area.index}</p>
        <h3 id={`bento-${area.id}`} className="mt-1 text-lg font-semibold leading-tight tracking-[-0.03em] text-white sm:text-xl">{area.title}</h3>
        <p className="mt-3 max-w-[56ch] text-[13px] leading-relaxed text-[#f7ece7]/75 sm:text-sm">{area.description}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {area.tools.map((t) => (
            <li key={t} className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-[#f7ece7]/80">{t}</li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

/* Spans on the 12-column desktop grid: the two longer stories get the wide slots, and each row pairs 7 + 5. */
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

export function ResearchBentoGrid({ areas, className }: { areas: readonly ExpertiseArea[]; className?: string }) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "50px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("grid gap-4 lg:grid-cols-12", className)}>
      {areas.map((a, i) => (
        <motion.div
          key={a.id}
          className={cn("flex", SPANS[i % SPANS.length])}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ...spring, delay: (i % 2) * 0.08 }}
        >
          <Tile area={a} play={visible && !reduce} delay={i * 0.4} className="w-full" />
        </motion.div>
      ))}
    </div>
  );
}

export default ResearchBentoGrid;
