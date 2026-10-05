import type { CSSProperties } from 'react';
import { musicSection as music } from '../../content/novel';
import SectionHeader from './SectionHeader';
import Tape from './Tape';
import './MusicSection.css';

const reelHues = ['blue', 'sun', 'leaf'];

export default function MusicSection({ vis }: { vis?: boolean }) {
  const inClass = vis ? ' is-in' : '';
  return (
    <section id="music" className="music">
      <div className="container">
        <SectionHeader note="keeping taal…" title="The Musician" highlight="Musician" hue="peach" vis={vis} />

        <p className={`music__body${inClass}`}>{music.body}</p>

        <div className={`music__cards${inClass}`}>
          {/* Spotify artist */}
          <a href={music.spotifyArtistUrl} target="_blank" rel="noopener" className="mcard">
            <Tape hue="leaf" rotate={-6} />
            <img src={music.artistImage} alt={music.artistName} className="mcard__art" />
            <div>
              <span className="mcard__kicker mono-xs">Spotify artist</span>
              <h3>{music.artistName}</h3>
              <p>{music.artistBio}</p>
            </div>
          </a>

          {/* YouTube channel */}
          <a href={music.youtubeChannelUrl || 'https://www.youtube.com/@MusicalKirtiraj'} target="_blank" rel="noopener" className="mcard">
            <Tape hue="pink" rotate={7} flip />
            <img src={music.youtubeImage} alt={music.youtubeName} className="mcard__art" />
            <div>
              <span className="mcard__kicker mono-xs">{music.youtubeStats}</span>
              <h3>{music.youtubeName}</h3>
              <p>{music.youtubeTagline}</p>
            </div>
          </a>
        </div>

        {/* Debut single */}
        <div className={`debut${inClass}`}>
          <div className="debut__copy">
            <span className="debut__label hand">{music.debutLabel}</span>
            <h3>{music.debutTitle}</h3>
            <p>{music.debutStory}</p>
            <a href={music.spotifyTrackUrl} target="_blank" rel="noopener" className="debut__link hand">
              listen on Spotify ↗
            </a>
          </div>

          <div className="debut__player">
            <iframe
              src={music.spotifyEmbedUrl}
              title="Spotify player — Invisible Available Replaceable"
              width="100%"
              height="152"
              frameBorder="0"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            ></iframe>
          </div>
        </div>

        {/* Tabla reels: link out; embeds would pull in Meta's script. */}
        <div className={`reels${inClass}`}>
          {music.reels.map((r, i) => (
            <a
              key={r.id}
              href={r.href}
              target="_blank"
              rel="noopener"
              className="reel"
              style={{ '--tilt': `${i % 2 === 0 ? -1.6 : 1.8}deg`, '--d': `${i * 90}ms` } as CSSProperties}
            >
              <Tape hue={reelHues[i % reelHues.length]} rotate={i % 2 === 0 ? -8 : 9} flip={i % 2 === 1} />
              <span className="reel__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m10 15 5-3-5-3z" /><rect width="20" height="20" x="2" y="2" rx="5" /></svg>
              </span>
              <span className="reel__label hand">{r.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
