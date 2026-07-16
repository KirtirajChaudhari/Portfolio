export interface AvatarSet {
  professional: {
    hero: string;
    icon: string;
    alt: string;
  };
  artistic: {
    hero: string;
    icon: string;
    alt: string;
  };
}

export interface SiteMeta {
  fullName: string;
  role: string;
  location: string;
  email: string;
  resumeUrl: string;
  socials: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
    other?: { label: string; url: string }[];
  };
}

export interface ModeToggleCopy {
  professionalLabel: string;
  artisticLabel: string;
  ariaLiveOnSwitchToProfessional: string;
  ariaLiveOnSwitchToArtistic: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  oneLiner: string;
  description: string;
  role: string;
  techStack: string[];
  outcome?: string;
  links: { github?: string; live?: string; demo?: string };
  thumbnail: string;
  featured: boolean;
  badge?: string;
}

export interface TimelineEntry {
  id: string;
  type: "education" | "internship" | "certification" | "hackathon";
  title: string;
  organization: string;
  dateRange: string;
  description?: string;
  link?: string;
  /** Visual-weight bucket for certifications */
  tier?: "program" | "platform" | "simulation";
}

export interface Achievement {
  label: string;
  value: number;
  suffix?: string;
}

export interface CreativeDiscipline {
  id: string;
  name: string;
  icon: string;
  works: CreativeWork[];
  // Bespoke fields for the artistic mode redesign
  spotifyProfile?: string;
  spotifyEmbedUrl?: string;
  youtubeChannel?: string;
  instaHandle?: string;
  instaLink?: string;
  poemContent?: string;
}

export interface CreativeWork {
  id: string;
  title?: string;
  description?: string;
  media: string;
  mediaType: "image" | "audio" | "video";
  date?: string;
}
