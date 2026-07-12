import { SectionReveal } from "@/components/ui/SectionReveal";
import { siteMeta } from "@/content/shared";
import { Mail, ArrowUpRight } from "lucide-react";

export function Contact() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <SectionReveal>
        <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.25em] text-accent">
          Reach out
        </span>
        <h2 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Want to collaborate?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-text-muted">
          Whether it&apos;s a creative project, a jam session, or just a conversation —
          I&apos;d love to hear from you.
        </p>
      </SectionReveal>

      <SectionReveal delay={0.15}>
        <div className="mt-10">
          <a
            href={`mailto:${siteMeta.email}`}
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-bg transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
          >
            <Mail className="h-4 w-4" />
            Drop me a line
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </a>
        </div>
      </SectionReveal>
    </section>
  );
}
