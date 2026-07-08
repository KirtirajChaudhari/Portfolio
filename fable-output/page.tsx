import { PortfolioShell } from "@/components/PortfolioShell";

/**
 * Demo page — a Server Component.
 *
 * The two dummy views are plain server-rendered JSX slotted through the
 * client PortfolioShell as ReactNode props, demonstrating that real portfolio
 * content never needs "use client". Replace the DummyViews with your actual
 * <ProfessionalView /> and <ArtisticView /> sections.
 */
export default function Page() {
  return (
    <PortfolioShell
      professional={
        <DummyView
          title="PROFESSIONAL VIEW"
          accent="border-sky-400/40"
          blurb="Stand-in for the recruiter-facing side: CV, selected work, contact. This block is server-rendered."
        />
      }
      artistic={
        <DummyView
          title="ARTISTIC VIEW"
          accent="border-fuchsia-400/40"
          blurb="Stand-in for the creative side: experiments, visuals, play. This block is server-rendered."
        />
      }
    />
  );
}

/**
 * Tall on purpose: on a phone this makes the page vertically scrollable, so
 * you can verify that vertical scrolling is completely untouched while
 * horizontal swipes (and ← / → keys, and the toggle) flip modes.
 */
function DummyView({
  title,
  accent,
  blurb,
}: {
  title: string;
  accent: string;
  blurb: string;
}) {
  return (
    <section className={`rounded-2xl border ${accent} bg-white/[0.03] p-8`}>
      <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 max-w-prose text-white/60">{blurb}</p>
      <div className="mt-8 space-y-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-16 rounded-xl bg-white/[0.05]" />
        ))}
      </div>
    </section>
  );
}
