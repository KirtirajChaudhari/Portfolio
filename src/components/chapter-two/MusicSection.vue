<template>
  <section id="music" class="music">
    <div class="container">
      <SectionHeader
        note="keeping taal…"
        title="The Musician"
        highlight="Musician"
        hue="peach"
        :vis="vis"
      />

      <p class="music__body" :class="{ 'is-in': vis }">{{ music.body }}</p>

      <div class="music__cards" :class="{ 'is-in': vis }">
        <!-- Spotify artist -->
        <a :href="music.spotifyArtistUrl" target="_blank" rel="noopener" class="card">
          <Tape hue="leaf" :rotate="-6" />
          <img :src="music.artistImage" :alt="music.artistName" class="card__art" />
          <div>
            <span class="card__kicker mono-xs">Spotify artist</span>
            <h3>{{ music.artistName }}</h3>
            <p>{{ music.artistBio }}</p>
          </div>
        </a>

        <!-- YouTube channel -->
        <a :href="music.youtubeChannelUrl || 'https://www.youtube.com/@MusicalKirtiraj'" target="_blank" rel="noopener" class="card">
          <Tape hue="pink" :rotate="7" flip />
          <img :src="music.youtubeImage" :alt="music.youtubeName" class="card__art" />
          <div>
            <span class="card__kicker mono-xs">{{ music.youtubeStats }}</span>
            <h3>{{ music.youtubeName }}</h3>
            <p>{{ music.youtubeTagline }}</p>
          </div>
        </a>
      </div>

      <!-- Debut single -->
      <div class="debut" :class="{ 'is-in': vis }">
        <div class="debut__copy">
          <span class="debut__label hand">{{ music.debutLabel }}</span>
          <h3>{{ music.debutTitle }}</h3>
          <p>{{ music.debutStory }}</p>
          <a :href="music.spotifyTrackUrl" target="_blank" rel="noopener" class="debut__link hand">
            listen on Spotify ↗
          </a>
        </div>

        <div class="debut__player">
          <iframe
            :src="music.spotifyEmbedUrl"
            title="Spotify player — Invisible Available Replaceable"
            width="100%"
            height="152"
            frameborder="0"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          ></iframe>
        </div>
      </div>

      <!-- Tabla reels — link out; embeds would pull in Meta's script. -->
      <div class="reels" :class="{ 'is-in': vis }">
        <a
          v-for="(r, i) in music.reels"
          :key="r.id"
          :href="r.href"
          target="_blank"
          rel="noopener"
          class="reel"
          :style="{ '--tilt': `${i % 2 === 0 ? -1.6 : 1.8}deg`, '--d': `${i * 90}ms` }"
        >
          <Tape :hue="reelHues[i % reelHues.length]" :rotate="i % 2 === 0 ? -8 : 9" :flip="i % 2 === 1" />
          <span class="reel__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m10 15 5-3-5-3z" /><rect width="20" height="20" x="2" y="2" rx="5" /></svg>
          </span>
          <span class="reel__label hand">{{ r.label }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { musicSection as music } from '../../content/novel';
import SectionHeader from './SectionHeader.vue';
import Tape from './Tape.vue';

defineProps<{ vis?: boolean }>();

const reelHues = ['blue', 'sun', 'leaf'];
</script>

<style scoped>
.music { padding: var(--sp-9) 0; }

.music__body,
.music__cards,
.debut,
.reels {
  opacity: 0;
  transform: translateY(26px);
  transition: opacity 720ms cubic-bezier(0.32, 0.72, 0, 1),
              transform 780ms cubic-bezier(0.32, 0.72, 0, 1);
}
.music__body.is-in,
.music__cards.is-in,
.debut.is-in,
.reels.is-in { opacity: 1; transform: none; }
.music__cards { transition-delay: 90ms; }
.debut { transition-delay: 170ms; }
.reels { transition-delay: 240ms; }

.music__body {
  max-width: 56ch;
  margin-top: var(--sp-6);
  font-family: var(--font-body);
  font-size: 1.05rem;
  line-height: 1.75;
  color: var(--text-muted);
}

.music__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--sp-6);
  margin-top: var(--sp-8);
}
@media (max-width: 760px) { .music__cards { grid-template-columns: minmax(0, 1fr); } }

.card {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-5);
  border: 1px solid var(--border);
  background: var(--surface-solid);
  border-radius: 3px;
  transition: transform 380ms cubic-bezier(0.34, 1.3, 0.64, 1), box-shadow 320ms var(--ease-out);
}
.card:nth-child(1) { transform: rotate(-1.2deg); }
.card:nth-child(2) { transform: rotate(1.4deg); }
.card:hover { transform: rotate(0deg) translateY(-4px); box-shadow: var(--shadow-card); }
.card__art {
  width: 72px; height: 72px;
  border-radius: 3px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid var(--border);
}
.card__kicker { display: block; color: var(--text-faint); margin-bottom: 3px; }
.card h3 {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  text-transform: none;
  letter-spacing: 0;
}
.card p { font-size: 0.88rem; line-height: 1.55; color: var(--text-muted); margin-top: 3px; }

.debut {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.95fr);
  gap: var(--sp-7);
  align-items: center;
  margin-top: var(--sp-8);
  padding-top: var(--sp-7);
  border-top: 1px solid var(--border);
}
@media (max-width: 860px) { .debut { grid-template-columns: minmax(0, 1fr); gap: var(--sp-5); } }

.debut__label { display: block; font-size: 1.35rem; color: var(--accent); }
.debut__copy h3 {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.4vw, 2.4rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--text);
  margin: var(--sp-2) 0 var(--sp-3);
}
.debut__copy p {
  font-family: var(--font-body);
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--text-muted);
  max-width: 52ch;
}
.debut__link {
  display: inline-block;
  margin-top: var(--sp-4);
  font-size: 1.25rem;
  color: var(--text);
  text-decoration: underline;
  text-decoration-color: var(--crayon-leaf);
  text-decoration-thickness: 2px;
  text-underline-offset: 6px;
}
.debut__link:hover { color: var(--text-muted); }
.debut__player iframe { border-radius: 12px; display: block; }

.reels {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-5);
  margin-top: var(--sp-8);
}
@media (max-width: 640px) { .reels { grid-template-columns: minmax(0, 1fr); } }

.reel {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-5);
  border: 1px solid var(--border);
  background: var(--surface-solid);
  border-radius: 3px;
  transform: rotate(var(--tilt));
  transition: transform 380ms cubic-bezier(0.34, 1.3, 0.64, 1), box-shadow 320ms var(--ease-out);
}
.reel:hover { transform: rotate(0deg) translateY(-4px); box-shadow: var(--shadow-card); }
.reel__icon {
  display: grid;
  place-items: center;
  width: 34px; height: 34px;
  border-radius: 50%;
  background: var(--accent-glass);
  color: var(--accent);
  flex-shrink: 0;
}
.reel__icon svg { width: 17px; height: 17px; }
.reel__label { font-size: 1.2rem; color: var(--text); }

@media (prefers-reduced-motion: reduce) {
  .music__body, .music__cards, .debut, .reels { transform: none; transition: opacity 300ms ease; }
  .card, .reel { transition: none; }
}
</style>
