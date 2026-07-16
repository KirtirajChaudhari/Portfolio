/*
 * Education & Experience slider data (spec v3 §1).
 * Education logos live in `public/education logos/`; none of the four
 * work organizations have a local logo yet — `logo: ""` renders a
 * clearly-marked monogram badge until a real file is dropped in.
 */

export interface JourneyEntry {
  id: string;
  heading: string;
  organization: string;
  url: string;
  dateRange: string;
  description: string;
  skills: string[];
  /** Path under /public. Empty → monogram placeholder badge. */
  logo: string;
}

export const workJourney: JourneyEntry[] = [
  {
    id: "quasar",
    heading: "Software Developer Intern",
    organization: "QuasarCyberTech Private Limited, Nashik",
    url: "https://quasarcybertech.com/",
    dateRange: "Apr 2026 – May 2026",
    description:
      "Wrote the report-generation module for QRGT, the firm's internal penetration-testing platform — FastAPI endpoints and ReportLab-driven PDF generation turning raw findings into Web PT, API PT, and Network PT reports, with CVSS v3.1 scoring and OWASP Top 10 mapping.",
    skills: ["FastAPI", "ReportLab", "CVSS v3.1", "OWASP Top 10"],
    logo: "/experience logo/quasarcybertech_logo_icon.png",
  },
  {
    id: "edunet",
    heading: "MERN Full-Stack Developer Intern",
    organization: "Edunet Foundation (AICTE)",
    url: "https://edunetfoundation.org/",
    dateRange: "Feb 2025 – Mar 2025",
    description:
      "Built a full MERN-stack application (React, Express, Node.js, MongoDB) on an MVC architecture, delivered across weekly sprints.",
    skills: ["React", "Express", "Node.js", "MongoDB"],
    logo: "/experience logo/edunet-logo.svg",
  },
  {
    id: "bitspark",
    heading: "Python Developer Intern",
    organization: "BitSpark Technologies",
    url: "https://bitsparktechnologies.com/",
    dateRange: "Aug 2024 – Feb 2025",
    description:
      "Built and maintained live Django full-stack applications — shipped new features, fixed bugs, and sped up several slow-loading pages by reworking their database queries.",
    skills: ["Django", "Python", "SQL Optimization"],
    logo: "/experience logo/bitspark_logo.png",
  },
  {
    id: "pci",
    heading: "Data Science Trainee",
    organization: "PCI LLP",
    url: "https://www.projectcontest.com/",
    dateRange: "Jan 2024 – Feb 2024",
    description:
      "Handled data cleaning and feature engineering for the team's models, and built the EDA visualizations used to catch bad data before training.",
    skills: ["pandas", "EDA", "Feature Engineering"],
    logo: "/experience logo/PCI Logo.avif",
  },
];

export const educationJourney: JourneyEntry[] = [
  {
    id: "mtech",
    heading: "M.Tech, AI & ML — First Year, Semester I",
    organization: "MIT WPU School of Engineering and Technology",
    url: "https://mitwpu.edu.in/",
    dateRange: "Current",
    description:
      "Postgraduate specialization deepening the applied ML foundation — model explainability, systems thinking, and research method.",
    skills: ["AI & ML", "Research"],
    logo: "/education logos/mit logo.jpeg",
  },
  {
    id: "be",
    heading: "B.E. Computer Engineering (Hons. AI & ML)",
    organization: "MVPS's KBT College of Engineering, Nashik",
    url: "https://kbtcoe.org/",
    dateRange: "Nov 2022 – Jun 2026",
    description:
      "Bachelor of Engineering in Computer Engineering with Honours in AI & ML — CGPA 7.86.",
    skills: ["Hons. AI & ML", "CGPA 7.86"],
    logo: "/education logos/kbtcoe logo.jpeg",
  },
  {
    id: "hsc",
    heading: "Class XII",
    organization: "M.J. College, Jalgaon",
    url: "https://mjcollege.kces.in/",
    dateRange: "Jun 2022",
    description: "Higher secondary — 73.33%.",
    skills: ["Science", "73.33%"],
    logo: "/education logos/mjc logo.png",
  },
  {
    id: "ssc",
    heading: "Class X",
    organization: "Shree Swaminarayan Gurukul C.B.S.E. School, Savda",
    url: "https://swaminarayaneducation.org/",
    dateRange: "May 2020",
    description: "Secondary school — 92.8%.",
    skills: ["CBSE", "92.8%"],
    logo: "/education logos/Swaminarayan gurukul.jpg",
  },
];
