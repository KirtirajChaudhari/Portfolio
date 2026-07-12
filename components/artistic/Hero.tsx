import Image from "next/image";
import { siteMeta } from "@/content/shared";
import { artisticTagline } from "@/content/artistic";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Warm gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-amber-950/20 via-bg to-orange-950/10"
        aria-hidden="true"
      />

      {/* Flowing accent orbs */}
      <div
        className="absolute top-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/8 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/3 h-[300px] w-[300px] rounded-full bg-orange-500/6 blur-[80px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Avatar */}
        <div className="mb-8 flex justify-center">
          <div className="relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-accent/30 ring-offset-4 ring-offset-bg">
            <Image
              src="/avatars/artistic-full.png"
              alt={`${siteMeta.fullName} — Artist`}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Overline */}
        <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-accent">
          The Other Side
        </span>

        {/* Name */}
        <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-text sm:text-5xl lg:text-6xl">
          Beyond the code
        </h1>

        {/* Tagline */}
        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-text-muted italic">
          {artisticTagline}
        </p>

        {/* Scroll hint */}
        <div className="mt-12 flex justify-center">
          <a
            href="#creative-work"
            className="text-xs font-medium uppercase tracking-widest text-text-muted transition-colors hover:text-accent"
          >
            Explore ↓
          </a>
        </div>
      </div>
    </section>
  );
}
