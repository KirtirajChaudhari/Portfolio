import { siteMeta } from "./shared";
import { artisticDisciplines } from "./artistic";

/*
 * "My Life as a Novel" — copy and data for the cinematic single-scroll page.
 * All numbers derive from real content in professional.ts / artistic.ts.
 */

export const novelHero = {
  name: "KIRTIRAJ",
  surname: "CHAUDHARI",
  // Spec v2 copy — verbatim, do not "improve".
  subtitle:
    "I build machine learning for places where a wrong prediction has real consequences — clinical nutrition, disease screening, railway safety. My focus is models that explain their reasoning to the people who have to trust them.",
  swipeHint: "Swipe for Chapter Two",
  /*
   * Four identity clips (Seedance 2.0, std, 1080p, 16:9, silent, ~8s).
   * Wardrobe locked across all four: charcoal smart-casual shirt, round
   * wire-rim glasses. Cool studio/rim light only — amber belongs to /creator.
   * Missing files render a bg-zinc-800 animate-pulse placeholder (never a
   * stock avatar or reused asset).
   */
  phases: [
    { id: "boot", label: "HERO", video: "/videos/hero-boot.mp4" },
    { id: "builder", label: "THE BUILDER", video: "/videos/hero-builder.mp4" },
    { id: "explainer", label: "THE EXPLAINER", video: "/videos/hero-explainer.mp4" },
    { id: "closer", label: "THE CLOSER", video: "/videos/hero-closer.mp4" },
  ],
};

export const chapterOneMeta = {
  kicker: "Chapter One",
  title: "The Engineer",
  epigraph:
    "Every story starts with a problem worth solving. Mine start with the ones where a wrong answer has a cost.",
};

// Spec v2 copy — verbatim, do not "improve".
export const engineerBeats = [
  {
    id: "about",
    heading: "About Me",
    body: "B.E. Computer Engineering with Honours in AI & ML, Batch 2026. I'm now in my first year of an M.Tech in AI & ML at MIT-WPU, Pune. Most of my work sits in applied ML for domains like clinical nutrition, disease screening, and railway safety, where I care more about a model explaining its reasoning than just getting the right answer.",
  },
];

export const techMarquee = [
  "Python", "PyTorch", "TensorFlow", "XGBoost", "scikit-learn",
  "FastAPI", "Django", "Next.js", "React", "TypeScript",
  "PostgreSQL", "Neo4j", "MongoDB", "MySQL",
  "OpenCV", "YOLOv5", "Grad-CAM", "pandas", "NumPy", "Git",
];

export const chapterTwoMeta = {
  kicker: "Chapter Two",
  title: "The Creator",
  epigraph:
    "Same person, off the clock. Rhythm, frames, and words — the things I make because I can't not make them.",
};

// Spec v2 copy — verbatim, do not "improve".
export const creatorIntro =
  "Same person, off the clock. When I'm not training models, I'm keeping taal on the tabla, chasing light through a camera lens, or filling notebooks with lines that mostly stay in the notebook. None of this is a case study — it's just the part of me that doesn't show up on a resume.";

/*
 * Photography polaroids — static assets by design (no Instagram scraping).
 * TODO(kirtiraj): supply exported images + the matching post URLs.
 * Leave `src` empty to render an intentional film-frame placeholder.
 */
export interface Polaroid {
  id: string;
  src: string;
  caption: string;
  href: string;
  rotate: number;
}

/*
 * Real post URLs supplied 2026-07-16. `src` stays empty until the user
 * hands over the exported images (no scraping); placeholders render
 * film frames in the meantime. TODO(kirtiraj): captions are neutral
 * numbering — rename them to match each photo when the images arrive.
 */
export const photographyWall: Polaroid[] = [
  { id: "photo-1", src: "", caption: "frame 01", href: "https://www.instagram.com/p/DSBgSSnCrPE/?igsh=MXU4eGM2b3h2enVheg==", rotate: -4 },
  { id: "photo-2", src: "", caption: "frame 02", href: "https://www.instagram.com/p/DRvv--ACj0M/?igsh=MTF5Y3hsYWwxYmh5Yg==", rotate: 2.5 },
  { id: "photo-3", src: "", caption: "frame 03", href: "https://www.instagram.com/p/DLxZ2Oesblr/?igsh=MXRmYzVjZ216ZGc4eg==", rotate: -1.5 },
  { id: "photo-4", src: "", caption: "frame 04", href: "https://www.instagram.com/p/DEWNAx4qoIL/?igsh=MTM5NzhxMXc0Ym1wNA==", rotate: 3.5 },
  { id: "photo-5", src: "", caption: "frame 05", href: "https://www.instagram.com/p/DBTDq7yyvhu/?igsh=dHE1OGF6dW5jcnlr", rotate: -2.5 },
  { id: "photo-6", src: "", caption: "frame 06", href: "https://www.instagram.com/p/DA7a_M1oU0R/?img_index=4&igsh=OWE0N2hlbmk1dGgy", rotate: 1.8 },
  { id: "photo-7", src: "", caption: "frame 07", href: "https://www.instagram.com/p/C_GKzuoIMYA/?igsh=cXJyOHE4MXVwYnpl", rotate: -3.2 },
  { id: "photo-8", src: "", caption: "frame 08", href: "https://www.instagram.com/p/C9QQx8uokiv/?igsh=amJrY295MG1tcXJp", rotate: 2.2 },
  { id: "photo-9", src: "", caption: "frame 09", href: "https://www.instagram.com/p/C9rUfgvoZ80/?igsh=MTR2aDZwYTRtbmlrYQ==", rotate: -1.2 },
  { id: "photo-10", src: "", caption: "frame 10", href: "https://www.instagram.com/p/CpzHlDEpyax/?igsh=NjBiYjJ5cmlweXQw", rotate: 3.8 },
];

export const photographyMeta = {
  handle: "@kirtiraj_chaudhari",
  profileUrl: "https://instagram.com/kirtiraj_chaudhari",
};

/*
 * Poetry — set as type, polaroid-framed, each linking to @introvert.balak.
 * First piece is real (from artistic.ts); TODO(kirtiraj): replace the
 * remaining pieces with your own published lines + per-post URLs.
 */
export interface PoemCard {
  id: string;
  title: string;
  lines: string[];
  href: string;
  rotate: number;
}

export const poetryWall: PoemCard[] = [
  {
    id: "poem-1",
    title: "Between Words",
    lines: [
      "There is a quiet rhythm in the space between words,",
      "Where logic ends and the abstract begins.",
      "A subtle hum of creation,",
      "Echoing through the pixels and the silence.",
    ],
    href: "https://instagram.com/introvert.balak",
    rotate: -2,
  },
  {
    id: "poem-2",
    title: "Taal",
    lines: [
      "The tabla knows before I do —",
      "which thoughts want structure,",
      "which want to breathe.",
    ],
    href: "https://instagram.com/introvert.balak",
    rotate: 3,
  },
  {
    id: "poem-3",
    title: "Draft",
    lines: [
      "Some lines never become poems.",
      "They stay in the notebook,",
      "holding the page open",
      "for the ones that will.",
    ],
    href: "https://instagram.com/introvert.balak",
    rotate: -3.5,
  },
];

export const poetryMeta = {
  handle: "@introvert.balak",
  profileUrl: "https://instagram.com/introvert.balak",
};

const musicDiscipline = artisticDisciplines.find((d) => d.id === "music");

export const musicSection = {
  heading: "The Musician",
  body: "Tabla first — years of keeping taal before ever writing a line of code. The same discipline that debugging demands: listen closely, find the pattern, stay in rhythm.",
  spotifyArtistUrl: musicDiscipline?.spotifyProfile ?? "https://open.spotify.com/artist/3zAV56brdo1aaVpR5WReag",
  spotifyTrackUrl: "https://open.spotify.com/track/4VkfpcwdnNnzNWVlCRupxY",
  spotifyEmbedUrl: "https://open.spotify.com/embed/track/4VkfpcwdnNnzNWVlCRupxY?utm_source=generator&theme=0",

  /* — YouTube channel block — profile fetched live 2026-07-16 (og:title,
     og:image avatar, subscriber count from the channel page) and stored as
     a local asset so the card never depends on a hotlink. */
  youtubeChannelUrl: siteMeta.socials.other?.find((s) => s.label === "Youtube")?.url ?? "",
  youtubeName: "Musical Kirtiraj",
  youtubeHandle: "@MusicalKirtiraj",
  youtubeStats: "370 subscribers",
  youtubeTagline: "Tabla performances, one taal at a time.",
  youtubeImage: "/creator/youtube-profile.jpg",

  /* — Spotify artist profile block — name + artwork from Spotify's public
     oEmbed endpoint, stored locally. */
  artistName: "Kirtiraj Nitin Chaudhari",
  artistBio: "Tabla player turned songwriter — rhythm first, everything else after.",
  artistImage: "/creator/spotify-artist.jpg",

  /* — Debut song block — */
  debutLabel: "Debut single",
  debutTitle: "Invisible Available Replaceable",
  // TODO(kirtiraj): rewrite this in your own words if you want a different story beat.
  debutStory:
    "After years of keeping taal for other people's melodies, this is the first track with my own name on it. It went from a notebook line to a released song — the same notebook the poems live in.",

  /** Tabla performance reels — rendered as live Instagram embeds. */
  reels: [
    { id: "reel-1", label: "taal, take one", href: "https://www.instagram.com/reel/C5Z3F-uy0fR/?igsh=MXV2aGllY3RuczgyOA==" },
    { id: "reel-2", label: "taal, take two", href: "https://www.instagram.com/reel/DYzedDGsn7v/?igsh=NXgyMHowMnl6YW0=" },
    { id: "reel-3", label: "taal, take three", href: "https://www.instagram.com/reel/Cx5x690ylbT/?igsh=MTVlZTE5am53djVpZA==" },
  ],
};

export const finale = {
  kicker: "Epilogue",
  headline: "Let's write the next chapter together.",
  body: "I'm looking for a team where explainable ML meets real products. If that's yours, the next page is blank.",
  primaryCta: { label: "Download Resume", href: siteMeta.resumeUrl },
  secondaryCtas: [
    { label: "GitHub", href: siteMeta.socials.github },
    { label: "LinkedIn", href: siteMeta.socials.linkedin },
    { label: "Email", href: `mailto:${siteMeta.email}` },
  ],
  closing: "— The End. (Until the next commit.)",
};
