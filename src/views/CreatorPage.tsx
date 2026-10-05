import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { chapterTwoMeta as meta, creatorIntro as intro, musicSection as music, photographyMeta, poetryMeta } from '../content/novel';
import SectionHeader from '../components/chapter-two/SectionHeader';
import Tape from '../components/chapter-two/Tape';
import PhotoWall from '../components/creator/PhotoWall';
import WritingsBook from '../components/creator/WritingsBook';
import Reveal from '../components/shell/Reveal';
import './CreatorPage.css';

const TICKER = ['Tabla', 'Lens', 'Ink'];

/* The dark band for photography keeps the section header's own styling by overriding the chapter's tokens locally. */
const DARKROOM = {
  '--text': '#f7ece7',
  '--text-muted': 'rgb(247 236 231 / 0.72)',
  '--text-faint': 'rgb(247 236 231 / 0.55)',
  '--bg': '#12090a',
} as CSSProperties;

function Hero({ vis }: { vis: boolean }) {
  return (
    <header className="relative overflow-hidden pb-10 pt-32 sm:pt-40">
      <div className="mx-auto grid max-w-[1180px] items-end gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-16 lg:px-12">
        <div className={`transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${vis ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          <p className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">{meta.kicker} · Profile 2</p>
          <h1 className="mt-5 font-display text-[clamp(4rem,15vw,11rem)] font-bold uppercase leading-[0.84] tracking-[-0.02em]">
            Beyond
            <br />
            <span className="text-[var(--accent)]">the code</span>
          </h1>
          <p className="hand mt-9 text-3xl text-[var(--accent)]">Hey —</p>
          <p className="mt-2 max-w-[52ch] text-lg leading-relaxed">{intro}</p>
          <p className="mt-6 max-w-[44ch] border-l-2 border-[var(--accent)] pl-4 text-base italic opacity-75">{meta.epigraph}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-current/30 px-5 text-sm hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Back to the engineering profile
            </Link>
          </div>
        </div>

        <div className={`relative mx-auto w-full max-w-[22rem] transition-[opacity,transform] delay-150 duration-[1100ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${vis ? 'rotate-[-3deg] opacity-100' : 'translate-y-10 rotate-0 opacity-0'}`}>
          <div className="relative rounded-sm bg-white p-3 pb-12 shadow-[0_24px_50px_-24px_rgb(60_40_30/0.5)]">
            <Tape hue="peach" rotate={-6} />
            <img
              src="/avatars/artistic-full.png"
              alt="Illustrated portrait of Kirtiraj as a creator, surrounded by a tabla, a camera, headphones, a notebook and a keyboard"
              width={512}
              height={512}
              className="aspect-square w-full bg-[#faf7f2] object-contain"
            />
          </div>
        </div>
      </div>

      {/* A ticker of the three things. Static under reduced motion (see CreatorPage.css). */}
      <div className="mt-14 overflow-hidden border-y border-current/25 py-3" aria-hidden="true">
        <div className="creator-ticker flex w-max gap-10 font-display text-3xl uppercase tracking-[0.1em] sm:text-4xl">
          {Array.from({ length: 12 }, (_, i) => TICKER[i % TICKER.length]).map((w, i) => (
            <span key={i} className="flex items-center gap-10">{w}<span className="text-[var(--accent)]">✦</span></span>
          ))}
        </div>
      </div>
    </header>
  );
}

function Music({ vis }: { vis: boolean }) {
  return (
    <section id="music" className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <SectionHeader note="keeping taal…" title="The Musician" highlight="Musician" hue="peach" vis={vis} />
      <p className="mt-6 max-w-[56ch] text-xl leading-relaxed">{music.body}</p>

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-14">
        {/* The debut is the big moment: title, story, and the player. */}
        <Reveal className="rounded-sm bg-white p-6 shadow-[0_24px_50px_-28px_rgb(60_40_30/0.5)] sm:p-8">
          <p className="hand text-2xl text-[var(--accent)]">{music.debutLabel}</p>
          <h3 className="mt-2 font-display text-4xl uppercase leading-[0.95] sm:text-5xl">{music.debutTitle}</h3>
          <p className="mt-4 max-w-[52ch] leading-relaxed">{music.debutStory}</p>
          <div className="mt-6 overflow-hidden rounded-xl">
            <iframe
              src={music.spotifyEmbedUrl}
              title="Spotify player: Invisible Available Replaceable"
              width="100%"
              height="152"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="block border-0"
            />
          </div>
          <a href={music.spotifyTrackUrl} target="_blank" rel="noopener" className="mt-4 inline-flex min-h-11 items-center gap-1 underline underline-offset-4">
            Listen on Spotify <ArrowUpRight size={16} strokeWidth={1.75} />
          </a>
        </Reveal>

        <div className="space-y-6">
          {[
            { href: music.spotifyArtistUrl, img: music.artistImage, name: music.artistName, kicker: 'Spotify artist', text: music.artistBio, tilt: -1.4 },
            { href: music.youtubeChannelUrl || 'https://www.youtube.com/@MusicalKirtiraj', img: music.youtubeImage, name: music.youtubeName, kicker: music.youtubeStats, text: music.youtubeTagline, tilt: 1.2 },
          ].map((c, i) => (
            <Reveal key={c.name} delay={0.08 * i}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-5 rounded-sm bg-white p-4 shadow-[0_18px_40px_-26px_rgb(60_40_30/0.5)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:rotate-0 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ transform: `rotate(${c.tilt}deg)` }}
              >
                <img src={c.img} alt="" width={88} height={88} className="h-[5.5rem] w-[5.5rem] shrink-0 rounded-md object-cover" />
                <span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] opacity-60">{c.kicker}</span>
                  <span className="mt-0.5 block text-xl font-semibold leading-tight">{c.name}</span>
                  <span className="mt-1 block text-sm opacity-75">{c.text}</span>
                </span>
              </a>
            </Reveal>
          ))}

          <div>
            <p className="hand text-2xl text-[var(--accent)]">tabla reels</p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {music.reels.map((r) => (
                <li key={r.id}>
                  <a href={r.href} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-current/30 px-4 hand text-xl hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2">
                    {r.label} <ArrowUpRight size={14} strokeWidth={1.75} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CreatorPage() {
  const [vis, setVis] = useState(false);

  useEffect(() => {
    document.title = 'Beyond the Code · Kirtiraj Nitin Chaudhari';
    const id = requestAnimationFrame(() => setVis(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="text-[var(--text)]">
      <Hero vis={vis} />

      {/* Photography: a dark room in the middle of the paper page. */}
      <section id="photos" className="bg-[#12090a] py-20 sm:py-28" style={DARKROOM} aria-label="Photography">
        <div className="mx-auto max-w-[1180px] px-5 text-[#f7ece7] sm:px-8 lg:px-12">
          <SectionHeader
            note="chasing light…"
            title="Photography"
            highlight="Photography"
            hue="blue"
            handle={photographyMeta.handle}
            handleHref={photographyMeta.profileUrl}
            vis={vis}
          />
          <div className="mt-10"><PhotoWall /></div>
        </div>
      </section>

      <Music vis={vis} />

      <section id="poetry" className="mx-auto max-w-[1180px] px-5 pb-24 pt-8 sm:px-8 sm:pb-32 lg:px-12" aria-label="Poetry">
        <SectionHeader
          note="between the lines…"
          title="Poetry"
          highlight="Poetry"
          hue="violet"
          handle={poetryMeta.handle}
          handleHref={poetryMeta.profileUrl}
          vis={vis}
        />
        <div className="mt-10"><WritingsBook /></div>
      </section>

      <footer className="border-t border-current/20">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm opacity-80 sm:px-8 lg:px-12">
          <p>Kirtiraj Nitin Chaudhari. Pune, India.</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/work">Work</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
