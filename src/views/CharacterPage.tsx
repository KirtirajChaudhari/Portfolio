import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { siteMeta } from '../content/shared';
import CharacterCanvas from '../components/character/CharacterCanvas';
import GlowCursor from '../components/character/GlowCursor';

/* Real facts only, from content/xray.ts and content/professional.ts. */
const BIO = 'I build machine learning that shows its reasoning: clinical nutrition, disease screening, railway safety. M.Tech AI & ML at MIT-WPU, Pune. Currently building RasaCare.';

const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap';

export default function CharacterPage() {
  const reduce = useReducedMotion();
  /* Page ground = the video's own border colour, so the canvas has no seam on
     any viewport. Defaults to the value measured by extract_frames.py. */
  const [bg, setBg] = useState('#b41d1c');

  useEffect(() => {
    document.title = 'Kirtiraj Nitin Chaudhari — AI/ML Engineer';
    let link = document.querySelector<HTMLLinkElement>(`link[href="${FONT_HREF}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = FONT_HREF;
      document.head.appendChild(link);
    }
    const prev = document.body.style.background;
    document.body.style.background = bg;
    return () => { document.body.style.background = prev; };
  }, [bg]);

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.32, 0.72, 0, 1] as const },
  });

  return (
    <div className="relative min-h-dvh overflow-hidden text-white" style={{ background: bg }}>
      <CharacterCanvas onReady={setBg} />
      <GlowCursor />

      {/* Static scrim: keeps the bottom-left copy legible without touching the canvas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 h-2/5"
        style={{ background: 'linear-gradient(to top, rgb(60 6 8 / 0.55), transparent)' }}
      />

      <div className="relative flex min-h-dvh items-end px-6 pb-12 sm:px-10 sm:pb-16 lg:px-16">
        <section className="max-w-[340px]">
          <motion.p {...rise(0.1)} className="text-sm uppercase tracking-[0.32em] text-white/80">
            Hi, I&apos;m
          </motion.p>

          <motion.h1
            {...rise(0.2)}
            className="mt-1 text-7xl leading-none sm:text-8xl"
            style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 600, textShadow: '0 8px 30px rgb(0 0 0 / 0.28)' }}
          >
            Kirtiraj
          </motion.h1>

          <motion.p {...rise(0.3)} className="mt-5 text-[15px] leading-relaxed text-white/90">
            {BIO}
          </motion.p>

          <motion.div {...rise(0.4)} className="mt-7 flex flex-wrap gap-3">
            <a
              href={siteMeta.resumeUrl}
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition-transform duration-300 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
            >
              Resume
              <ArrowUpRight
                size={16}
                strokeWidth={1.75}
                className="transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-0.5"
              />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full border border-white/70 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-[background-color,transform] duration-300 hover:bg-white/20 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
            >
              Let&apos;s Talk
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
