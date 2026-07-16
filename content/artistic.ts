import { CreativeDiscipline } from "./types";

export const artisticTagline = "Exploring the intersection of code, sound, and visual storytelling."; // Placeholder

export const artisticHero = {
  headingTop: "BEYOND",
  headingBottom: "THE CODE",
  metaLeft: "© 2026",
  metaRight: "/ TABLA · LENS · INK",
  heyLabel: "Hey —",
  introParagraph:
    "Same Kirtiraj as the other side, just off the clock. When I'm not training models, I'm keeping taal on the tabla, chasing light with a camera, or filling notebooks with lines that may never become poems.",
  supportingCopy:
    "Nothing here is a case study. It's rhythm, frames, and words — the things I make because I can't not make them.",
  ctaLabel: "Explore the work",
  ctaHref: "#creative-work",
};

export const artisticStory = "My journey isn't just about logic and algorithms. It's about finding rhythm in code and harmony in pixels. Whether I'm capturing moments through a vintage lens or composing melodies, I believe true innovation happens when technical precision meets creative expression."; // Placeholder

export const artisticDisciplines: CreativeDiscipline[] = [
  {
    id: "music",
    name: "Music",
    icon: "tabla",
    spotifyProfile: "https://open.spotify.com/artist/3zAV56brdo1aaVpR5WReag",
    spotifyEmbedUrl: "https://open.spotify.com/embed/track/4VkfpcwdnNnzNWVlCRupxY?utm_source=generator&theme=0",
    youtubeChannel: "https://www.youtube.com/@MusicalKirtiraj",
    // inside content/artistic.ts
    works: [
      {
        id: "music-spotify",
        title: "Debut Single",
        media: "",
        mediaType: "audio",
      },
      {
        id: "reel-1",
        title: "Taal, Take One",
        media: "https://www.instagram.com/reel/C5Z3F-uy0fR/?igsh=MXV2aGllY3RuczgyOA==",
        mediaType: "video",
      },
      {
        id: "reel-2",
        title: "Taal, Take Two",
        media: "https://www.instagram.com/reel/DYzedDGsn7v/?igsh=NXgyMHowMnl6YW0=",
        mediaType: "video",
      },
      {
        id: "reel-3",
        title: "Taal, Take Three",
        media: "https://www.instagram.com/reel/Cx5x690ylbT/?igsh=MTVlZTE5am53djVpZA==",
        mediaType: "video",
      },
    ],
  },
  {
    id: "photography",
    name: "Photography",
    icon: "camera",
    instaHandle: "@kirtiraj_chaudhari",
    instaLink: "https://instagram.com/kirtiraj_chaudhari",
    works: [
      {
        id: "photo-1",
        title: "Urban Shadows",
        media: "/avatars/professional-full.png", // Replace with actual photo paths
        mediaType: "image",
      },
      {
        id: "photo-2",
        title: "Neon Nights",
        media: "/avatars/artistic-full.png", // Replace with actual photo paths
        mediaType: "image",
      },
      {
        id: "photo-3",
        title: "Minimalism",
        media: "/avatars/professional-full.png", // Replace with actual photo paths
        mediaType: "image",
      }
    ],
  },
  {
    id: "writing",
    name: "Writing",
    icon: "pen-notebook",
    instaHandle: "@introvert.balak",
    instaLink: "https://instagram.com/introvert.balak",
    poemContent: "There is a quiet rhythm in the space between words,\nWhere logic ends and the abstract begins.\nA subtle hum of creation,\nEchoing through the pixels and the silence.\n\nWe build worlds out of nothing,\nNot just with code,\nBut with the unseen poetry of thought.", // Replace with your short poem
    works: [
      {
        id: "writer-profile",
        title: "Writer Profile",
        media: "/avatars/professional-full.png", // Replace with actual profile screenshot
        mediaType: "image",
      }
    ],
  }
];

export const artisticFeaturedWork = {
  id: "featured-1",
  title: "The Sound of Silence", // Placeholder
  story: "This project started as a simple experiment but evolved into a full-fledged audio-visual experience...", // Placeholder
  media: "/artistic/featured/main.webp", // Placeholder
  mediaType: "image" as const,
};

export const artisticReflections = [
  {
    date: "July 12, 2026",
    content: "Sometimes the most elegant solution isn't the most efficient one, but the one that reads like poetry.", // Placeholder
  }
];
