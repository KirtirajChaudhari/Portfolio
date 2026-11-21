import { siteMeta } from "./shared";

// Creator copy and supplied links. No generated poems, captions or biographies.
// creatorIntro keeps every original word; only the em dash became a semicolon.
export const creatorIntro =
  "Same person, off the clock. When I'm not training models, I'm keeping taal on the tabla, chasing light through a camera lens, or filling notebooks with lines that mostly stay in the notebook. None of this is a case study; it's just the part of me that doesn't show up on a resume.";

export const photographyMeta = {
  handle: "@kirtiraj_chaudhari",
  profileUrl: "https://instagram.com/kirtiraj_chaudhari",
};

export const poetryMeta = {
  handle: "@introvert.balak",
  profileUrl: "https://instagram.com/introvert.balak",
  /** Verbatim from creatorIntro — his own description of the writing. */
  blurb: "Filling notebooks with lines that mostly stay in the notebook.",
};

export const musicSection = {
  heading: "The Musician",
  spotifyArtistUrl: "https://open.spotify.com/artist/3zAV56brdo1aaVpR5WReag",
  spotifyTrackUrl: "https://open.spotify.com/track/4VkfpcwdnNnzNWVlCRupxY",
  spotifyEmbedUrl: "https://open.spotify.com/embed/track/4VkfpcwdnNnzNWVlCRupxY?utm_source=generator&theme=0",
  spotifyArtistEmbedUrl: "https://open.spotify.com/embed/artist/3zAV56brdo1aaVpR5WReag?utm_source=generator&theme=0",

  // Channel identity from shared.ts; omit the stale subscriber count.
  youtubeChannelUrl: siteMeta.socials.youtube,
  youtubeName: "Musical Kirtiraj",

  // Supplied artist identity. Unconfirmed biography omitted.
  artistName: "Kirtiraj Nitin Chaudhari",

  // Supplied release title; the unconfirmed story is deliberately omitted.
  debutLabel: "Debut single",
  debutTitle: "Invisible Available Replaceable",
  /** The release artwork as published (it was saved as spotify-artist.jpg). 300x300. */
  debutCover: "/creator/debut-single-cover.jpg",
  youtubeAvatar: "/creator/youtube-profile.jpg",

  // Supplied reel URLs, with neutral labels until the owner supplies titles.
  reels: [
    { id: "reel-1", label: "Reel 1", href: "https://www.instagram.com/reel/C5Z3F-uy0fR/?igsh=MXV2aGllY3RuczgyOA==" },
    { id: "reel-2", label: "Reel 2", href: "https://www.instagram.com/reel/DYzedDGsn7v/?igsh=NXgyMHowMnl6YW0=" },
    { id: "reel-3", label: "Reel 3", href: "https://www.instagram.com/reel/Cx5x690ylbT/?igsh=MTVlZTE5am53djVpZA==" },
  ],
};
