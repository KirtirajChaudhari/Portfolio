import { AnimeReveal } from "@/components/ui/AnimeReveal";
import { siteMeta } from "@/content/shared";
import { Mail, ArrowUpRight, FileDown } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-24">
      {/* Background accent */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/3 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <AnimeReveal>
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.25em] text-accent">
            Get in touch
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">
            {"Let's work together"}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-text-muted">
            Open to remote internships and research collaborations in applied ML.
            {"Drop me an email or connect on LinkedIn."}
          </p>
        </AnimeReveal>

        <AnimeReveal delay={150}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${siteMeta.email}`}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-bg transition-all duration-300 hover:shadow-[0_0_30px_rgba(88,166,255,0.4)] hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
            >
              <Mail className="h-4 w-4" />
              {siteMeta.email}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </a>
            <a
              href={siteMeta.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download="Kirtiraj_Chaudhari_Resume.pdf"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-7 py-3 text-sm font-semibold text-text transition-all duration-300 hover:border-accent/40 hover:bg-surface-2 motion-reduce:transition-none"
            >
              <FileDown className="h-4 w-4" />
              Download Resume
            </a>
          </div>
        </AnimeReveal>
      </div>
    </section>
  );
}
