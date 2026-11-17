import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Page from '../components/site/Page';
import PhotoGallery from '../components/creator/PhotoGallery';
import { creatorIntro, musicSection as music, photographyMeta, poetryMeta } from '../content/novel';
import { poemFragments } from '../content/poetry';
import { photographs } from '../content/photographs';

function Out({ href, children }: { href?: string; children: React.ReactNode }) {
  if (!href) return null;
  return <a href={href} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center gap-2">
    {children}<ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
    <span className="sr-only"> (opens in a new tab)</span>
  </a>;
}

function Music() {
  const player = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); observer.disconnect(); }
    }, { rootMargin: '240px' });
    observer.observe(player.current!);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="music" className="band rule-top" aria-labelledby="music-title">
      <div className="wrap grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
        <div>
          <p className="t-data">Tabla / Music</p>
          <h2 id="music-title" className="t-h2 mt-3">{music.heading}</h2>
        </div>
        <div>
          <p className="t-lede">{music.body}</p>
          <div className="creator-release mt-10">
            <p className="t-data">{music.debutLabel}</p>
            <h3 className="t-h3 mt-3">{music.debutTitle}</h3>
            <div ref={player} className="creator-player mt-6">
              {near && <iframe
                src={music.spotifyEmbedUrl}
                title="Spotify player: Invisible Available Replaceable"
                width="100%" height="152" loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />}
            </div>
            <div className="mt-4"><Out href={music.spotifyTrackUrl}>Listen on Spotify</Out></div>
          </div>
          <ul className="creator-music-links mt-6">
            <li><Out href={music.spotifyArtistUrl}>Spotify artist</Out><p className="text-sm text-fg-2">{music.artistName}</p></li>
            <li><Out href={music.youtubeChannelUrl}>YouTube</Out><p className="text-sm text-fg-2">{music.youtubeName}</p></li>
          </ul>
          <div className="rule-top mt-8 pt-6">
            <h3 className="t-data">Tabla performances</h3>
            <ul className="mt-2 flex flex-wrap gap-x-8 gap-y-1">
              {music.reels.map((reel) => <li key={reel.id}><Out href={reel.href}>{reel.label}</Out></li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CreatorPage() {
  const hero = photographs[0];
  return (
    <Page close={false}>
      <header className="wrap creator-hero">
        <div>
          <p className="t-data">Photography / Music / Writing</p>
          <h1 className="t-display mt-5">Beyond the code</h1>
          <p className="t-lede mt-8">{creatorIntro}</p>
          <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <a className="link inline-flex min-h-11 items-center" href="#photos">Photography</a>
            <a className="link inline-flex min-h-11 items-center" href="#music">Music</a>
            <a className="link inline-flex min-h-11 items-center" href="#poetry">Writing</a>
          </nav>
        </div>
        <figure className="creator-hero-photo plate">
          <img src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} fetchPriority="high" />
        </figure>
      </header>

      <section id="photos" className="band rule-top" aria-labelledby="photos-title">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="t-data">Camera</p><h2 id="photos-title" className="t-h2 mt-3">Photography</h2></div>
            <Out href={photographyMeta.profileUrl}>{photographyMeta.handle}</Out>
          </div>
          <PhotoGallery />
        </div>
      </section>

      <Music />

      <section id="poetry" className="band rule-top" aria-labelledby="poetry-title">
        <div className="wrap grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
          <div><p className="t-data">Notebook</p><h2 id="poetry-title" className="t-h2 mt-3">Writing</h2></div>
          <div>
            <p className="t-lede">{poetryMeta.blurb}</p>
            {poemFragments.map((fragment) => <article key={fragment.id} className="creator-poem rule-top mt-8 pt-8">
              <p className="t-lede whitespace-pre-line">{fragment.lines.join('\n')}</p>
              {fragment.note && <p className="t-data mt-4">{fragment.note}</p>}
              <Out href={fragment.href}>Read on Instagram</Out>
            </article>)}
            <div className="mt-6"><Out href={poetryMeta.profileUrl}>{poetryMeta.handle}</Out></div>
          </div>
        </div>
      </section>
    </Page>
  );
}
