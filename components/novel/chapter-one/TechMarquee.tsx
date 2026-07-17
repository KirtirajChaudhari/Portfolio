import { techMarquee } from "@/content/novel";

/**
 * Bone-white skills on near-black, endlessly scrolling.
 * Pure CSS animation — pauses on hover, disabled for reduced motion.
 */
export function TechMarquee() {
  const row = (ariaHidden: boolean) => (
    <div aria-hidden={ariaHidden || undefined} className="flex items-center">
      {techMarquee.map((tech) => (
        <span
          key={tech}
          className="type-heading whitespace-nowrap px-8 text-3xl uppercase text-text/90 md:text-5xl"
        >
          {tech}
          <span className="ml-16 inline-block h-2 w-2 rounded-full bg-accent align-middle" />
        </span>
      ))}
    </div>
  );

  return (
    <section aria-label="Tech stack" className="overflow-hidden border-y border-border py-10 md:py-14">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
