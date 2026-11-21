import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Play } from 'lucide-react';
import Page from '../components/site/Page';
import PhotoGallery from '../components/creator/PhotoGallery';
import CraftCollage from '../components/creator/CraftCollage';
import SpotifyPlayer from '../components/creator/SpotifyPlayer';
import Vinyl from '../components/creator/Vinyl';
import WritingsBook from '../components/creator/WritingsBook';
import { creatorIntro, musicSection as music, photographyMeta, poetryMeta } from '../content/novel';

function Out({ href, children, className = '' }: { href?: string; children: ReactNode; className?: string }) {
  if (!href) return null;
  return <a href={href} target="_blank" rel="noopener noreferrer" className={`link inline-flex min-h-11 items-center gap-1.5 ${className}`}>
    {children}<ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
    <span className="sr-only"> (opens in a new tab)</span>
  </a>;
}

/** Hand-written kicker, the title in caps over a highlighter stroke, a drawn underline. */
function CraftHead({ id, kicker, title, craft, children }: { id: string; kicker: string; title: string; craft: string; children?: ReactNode }) {
  return (
    <div className={`craft-head ${craft}`}>
      <p className="creator-hand">{kicker}</p>
      <h2 id={id} className="craft-title">{title}</h2>
      <svg viewBox="0 0 240 14" fill="none" aria-hidden="true" preserveAspectRatio="none">
        <path d="M2 9 C 40 3, 80 12, 120 7 S 200 3, 238 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {children}
    </div>
  );
}

/* The 16-beat taal cycle as an ornament: four groups of four, the first beat in
   colour, the ninth left open. Decorative only; it pulses in time. */
const TAAL = [0, 1, 2, 3].map((g) => [0, 1, 2, 3].map((b) => g * 4 + b));

function Taal() {
  return (
    <div className="taal" aria-hidden="true">
      {TAAL.map((group, g) => (
        <div key={g} className="taal-group">
          {group.map((b) => (
            <span key={b} className={`taal-beat ${b === 0 ? 'sam' : b === 8 ? 'khali' : ''}`} style={{ '--b': b } as React.CSSProperties} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Three things, each with its own name, destination and action: the debut single
 *  (a release, with the track player), the Spotify artist profile (with the artist
 *  player) and the YouTube channel. The performances follow as secondary links. */
function Music() {
  return (
    <section id="music" className="band" aria-labelledby="music-title">
      <div className="wrap">
        <div className="music-stage px-5 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
            <CraftHead id="music-title" kicker="keeping taal..." title={music.heading} craft="craft-music" />
            <Taal />
          </div>

          {/* 1. The debut single. */}
          <article aria-labelledby="single-title" className="mt-14 grid items-center gap-x-16 gap-y-12 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="flex justify-center lg:justify-start">
              <a href={music.spotifyTrackUrl} target="_blank" rel="noopener noreferrer" className="record block" aria-label={`Listen to ${music.debutTitle} on Spotify (opens in a new tab)`}>
                <span className="vinyl-slot" aria-hidden="true"><Vinyl className="vinyl" /></span>
                <img className="cover" src={music.debutCover} alt="" width={300} height={300} loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="min-w-0">
              <p className="creator-hand">{music.debutLabel.toLowerCase()}</p>
              <h3 id="single-title" className="release-title mt-3" aria-label={`${music.debutLabel}: ${music.debutTitle}`}>
                <span aria-hidden="true">Invisible.</span>
                <span aria-hidden="true">Available.</span>
                <span aria-hidden="true">Replaceable.</span>
              </h3>
              <p className="t-data mt-5">{music.artistName}</p>
              <div className="mt-8">
                <SpotifyPlayer
                  src={music.spotifyEmbedUrl}
                  title={`Spotify player: ${music.debutTitle}`}
                  height={152}
                  href={music.spotifyTrackUrl}
                  label="Debut single"
                  header={<p className="t-kicker !text-[0.6875rem]">Spotify track</p>}
                />
              </div>
              <a href={music.spotifyTrackUrl} target="_blank" rel="noopener noreferrer" className="button button-disc mt-6">
                Play the single on Spotify
                <span className="disc"><Play size={14} strokeWidth={2} aria-hidden="true" /></span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </article>

          <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            {/* 2. The Spotify artist profile. */}
            <article aria-labelledby="artist-title" className="card flex flex-col p-5 sm:p-8">
              <p className="t-kicker !text-[0.6875rem]">Spotify artist profile</p>
              <div className="mt-5">
                <SpotifyPlayer
                  src={music.spotifyArtistEmbedUrl}
                  title={`Spotify artist profile: ${music.artistName}`}
                  height={352}
                  href={music.spotifyArtistUrl}
                  label="Artist profile"
                  header={<h3 id="artist-title" className="text-xl font-[640] leading-tight">{music.artistName}</h3>}
                />
              </div>
              <a href={music.spotifyArtistUrl} target="_blank" rel="noopener noreferrer" className="button button-line mt-6 self-start">
                Open the artist profile
                <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </article>

            {/* 3. The YouTube channel. */}
            <article aria-labelledby="channel-title" className="card flex flex-col p-5 sm:p-8">
              <p className="t-kicker !text-[0.6875rem]">YouTube channel</p>
              <div className="flex flex-1 flex-col items-center justify-center gap-5 py-10 text-center">
                {/* The channel picture has white bars at its sides; a fixed zoom inside the
                    circle keeps them out and the face in. */}
                <span className="block h-28 w-28 overflow-hidden rounded-full ring-1 ring-white/15 sm:h-32 sm:w-32">
                  <img src={music.youtubeAvatar} alt="" width={128} height={128} loading="lazy" decoding="async" className="h-full w-full origin-[50%_28%] scale-[1.18] object-cover" />
                </span>
                <h3 id="channel-title" className="text-2xl font-[640] leading-tight">{music.youtubeName}</h3>
              </div>
              <a href={music.youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className="button button-line self-center">
                Visit the channel
                <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </article>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rule pt-8">
            <h3 className="t-kicker !text-[0.6875rem]">Tabla performances</h3>
            <ul className="flex flex-wrap gap-2">
              {music.reels.map((reel) => (
                <li key={reel.id}>
                  <a href={reel.href} target="_blank" rel="noopener noreferrer" className="button button-line !min-h-10 !px-4 !text-sm">
                    {reel.label}
                    <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
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
  return (
    <Page close={false}>
      <div className="creator">
        <header className="wrap creator-hero">
          <div className="intro">
            <p className="t-kicker" style={{ '--i': 0 } as React.CSSProperties}>Chapter two · Artistic profile</p>
            <h1 className="creator-title mt-6" style={{ '--i': 1 } as React.CSSProperties}>
              Beyond <span>the code</span>
            </h1>
            <p className="creator-hand mt-8" style={{ '--i': 2 } as React.CSSProperties}>Hey,</p>
            <p className="creator-intro mt-3" style={{ '--i': 3 } as React.CSSProperties}>{creatorIntro}</p>
            <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2" style={{ '--i': 4 } as React.CSSProperties}>
              <a className="button button-line !min-h-10 !text-sm" href="#photos">Photography</a>
              <a className="button button-line !min-h-10 !text-sm" href="#music">Music</a>
              <a className="button button-line !min-h-10 !text-sm" href="#poetry">Writing</a>
            </nav>
            <Link to="/" viewTransition className="go mt-6 text-[0.875rem] text-fg-2" style={{ '--i': 5 } as React.CSSProperties}>
              <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" className="back-arrow" />
              Back to the professional profile
            </Link>
          </div>
          <CraftCollage />
        </header>

        <div className="creator-marquee" aria-hidden="true">
          <ul>
            {Array.from({ length: 4 }).flatMap((_, k) => ['Lens', 'Tabla', 'Ink'].map((w) => <li key={`${k}-${w}`}>{w}</li>))}
          </ul>
        </div>

        <section id="photos" className="band" aria-labelledby="photos-title">
          <div className="wrap">
            <CraftHead id="photos-title" kicker="chasing light..." title="Photography" craft="craft-photo">
              <Out href={photographyMeta.profileUrl} className="mt-2 text-fg-2">{photographyMeta.handle}</Out>
            </CraftHead>
            <PhotoGallery />
          </div>
        </section>

        <Music />

        <section id="poetry" className="band" aria-labelledby="poetry-title">
          <div className="wrap grid grid-cols-[minmax(0,1fr)] items-center gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <CraftHead id="poetry-title" kicker="filling notebooks..." title="Writing" craft="craft-write">
                <Out href={poetryMeta.profileUrl} className="mt-2 text-fg-2">{poetryMeta.handle}</Out>
              </CraftHead>
              <p className="creator-read mt-8 max-w-[30em] text-[1.125rem] leading-relaxed text-fg-2">
                {poetryMeta.blurb} The ones that make it out are on Instagram.
              </p>
            </div>
            <WritingsBook />
          </div>
        </section>
      </div>
    </Page>
  );
}
