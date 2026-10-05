export interface SiteMeta {
  /** Legal name — document titles, the contact card, image alt text. */
  fullName: string;
  /** How the name is set in display type, e.g. the hero headline. */
  displayName: string;
  role: string;
  location: string;
  email: string;
  resumeUrl: string;
  phone: string;
  socials: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    other?: { label: string; url: string }[];
  };
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
  metrics?: string[];
  outcome?: string;
  links: { github?: string; live?: string; demo?: string };
  thumbnail: string;
  featured: boolean;
  badge?: string;
}

export interface ProjectCase {
  slug: string;
  title: string;
  oneLiner: string;
  techLine: string;
  screenshot: string;
  github?: string;
  live?: string;
  extraLinks?: { label: string; href: string }[];
  problem: string;
  approach: string;
  stack: { name: string; role: string }[];
  decisions: string[];
  outcome?: string;
}

export interface TimelineEntry {
  id: string;
  type: 'education' | 'internship' | 'certification';
  title: string;
  organization: string;
  dateRange: string;
  description?: string;
  tier?: 'program' | 'platform' | 'simulation';
}

export interface JourneyEntry {
  id: string;
  heading: string;
  organization: string;
  url: string;
  dateRange: string;
  description: string;
  skills: string[];
  logo: string;
  badgeLabel?: string;
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
  spotifyProfile?: string;
  spotifyEmbedUrl?: string;
  youtubeChannel?: string;
  instaHandle?: string;
  instaLink?: string;
  poemContent?: string;
  works: CreativeWork[];
}

export interface CreativeWork {
  id: string;
  title?: string;
  description?: string;
  media: string;
  mediaType: 'image' | 'audio' | 'video';
}

export interface ExpertiseArea {
  id: string;
  index: string;
  title: string;
  cursorLabel: string;
  description: string;
  tools: string[];
  /** Numbers lifted verbatim from `description`, shown large in the bento tile. */
  figures?: { value: string; label: string }[];
}

export interface Stat {
  value: number;
  label: string;
  decimals?: number;
}
