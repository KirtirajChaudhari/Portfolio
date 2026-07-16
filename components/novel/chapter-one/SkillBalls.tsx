"use client";

import dynamic from "next/dynamic";
import { Reveal } from "../Reveal";

/*
 * Skills as 3D physics balls (spec v3 §2): React Three Fiber + Rapier.
 * Dynamically imported to avoid SSR issues with WebGL.
 * Falls back to the static 2D layout if WebGL fails.
 */

const SkillBalls3D = dynamic(
  () => import("./SkillBalls3D").then((mod) => mod.SkillBalls3D),
  {
    ssr: false,
    loading: () => (
      <section aria-label="Skills" className="mx-auto max-w-6xl px-6 py-28 md:py-36">
        <Reveal className="mb-12">
          <span className="type-heading text-sm tracking-[0.4em] text-accent">THE TOOLKIT</span>
          <h3 className="type-heading mt-3 text-4xl uppercase text-text md:text-5xl">Skills</h3>
          <p className="mt-3 text-sm text-text-muted">Grab one. They bounce.</p>
        </Reveal>
        <div className="relative h-[55vh] min-h-[380px] overflow-hidden rounded-xl border border-border bg-surface/40 md:h-[65vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </section>
    ),
  }
);

export function SkillBalls() {
  return <SkillBalls3D />;
}
