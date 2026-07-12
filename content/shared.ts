import { AvatarSet, SiteMeta, ModeToggleCopy } from "./types";

export const avatarSet: AvatarSet = {
  professional: {
    hero: "/avatars/professional-full.png",
    icon: "/avatars/professional-icon.png",
    alt: "Kirtiraj Chaudhari - Professional",
  },
  artistic: {
    hero: "/avatars/artistic-full.png",
    icon: "/avatars/artistic-icon.png",
    alt: "Kirtiraj Chaudhari - Artistic",
  },
};

export const siteMeta: SiteMeta = {
  fullName: "Kirtiraj Nitin Chaudhari",
  role: "AI/ML Engineer",
  location: "Remote",
  email: "mrkirtirajchaudhari@gmail.com",
  resumeUrl: "/resume/Kirtiraj_Chaudhari_Resume.pdf",
  socials: {
    github: "https://github.com/KirtirajChaudhari",
    linkedin: "https://linkedin.com/in/kirtirajchaudhari",
    instagram: "",
    other: [
      { label: "Youtube", url: "" },
      { label: "Phone", url: "tel:+919730100346" },
    ],
  },
};

export const modeToggleCopy: ModeToggleCopy = {
  professionalLabel: "Professional",
  artisticLabel: "Artistic",
  ariaLiveOnSwitchToProfessional: "Professional side shown",
  ariaLiveOnSwitchToArtistic: "Artistic side shown",
};
