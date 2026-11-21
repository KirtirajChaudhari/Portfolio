/*
 * Experience and education data. Logos live in `public/education logos/` and
 * `public/experience logo/`; `logo: ""` renders a monogram badge until a real
 * file is supplied.
 */

export interface JourneyEntry {
  id: string;
  heading: string;
  organization: string;
  url: string;
  dateRange: string;
  /** Secondary line beside the organisation; omitted when the source gives none. */
  location?: string;
  /** Omitted when no confirmed detail exists: nothing is written in its place. */
  description?: string;
  skills?: string[];
  /** Path under /public. Empty → monogram placeholder badge. */
  logo: string;
  /** Compact two-line badge label; `heading` is too long for a credential card. */
  badgeLabel?: string;
}

/*
 * Experience, newest first. The one source for /about and /work, so the two pages
 * cannot drift. Descriptions are the résumé's, not stronger: "contributed to" stays
 * "contributed to", and no performance claim appears without a source.
 * Inspira Enterprise: role, company, start month and current status are confirmed;
 * responsibilities are not yet supplied, so none are written.
 */
export const workJourney: JourneyEntry[] = [
  {
    id: "inspira",
    heading: "AI Intern",
    organization: "Inspira Enterprise",
    url: "https://inspiraenterprise.com/",
    dateRange: "Nov 2026 – Present",
    logo: "",
  },
  {
    id: "edunet",
    heading: "MERN Full-Stack Developer Intern",
    organization: "Edunet Foundation (AICTE)",
    url: "https://edunetfoundation.org/",
    dateRange: "Feb 2025 – Mar 2025",
    location: "Remote",
    description:
      "Contributed to a project-management task application during a structured AICTE internship. Built REST APIs and CRUD task workflows on an MVC architecture across weekly sprints.",
    skills: ["React", "Express", "Node.js", "MongoDB"],
    logo: "/experience logo/edunet-logo.svg",
  },
  {
    id: "bitspark",
    heading: "Python Developer Intern",
    organization: "BitSpark Technologies",
    url: "https://bitsparktechnologies.com/",
    dateRange: "Aug 2024 – Feb 2025",
    location: "Nashik",
    description:
      "Maintained and extended three Django full-stack web applications, and debugged URL-routing and dashboard data-fetching defects across them.",
    skills: ["Python", "Django"],
    logo: "/experience logo/bitspark_logo.png",
  },
  {
    id: "pci",
    heading: "Data Science Trainee",
    organization: "PCI LLP",
    url: "https://www.projectcontest.com/",
    dateRange: "Jan 2024 – Feb 2024",
    location: "Remote",
    description:
      "Cleaned a 10,000-row student dataset and resolved its missing values, then produced exploratory visualisations whose data-quality findings supported the team's models.",
    skills: ["pandas", "EDA"],
    logo: "/experience logo/PCI Logo.avif",
  },
];

export const educationJourney: JourneyEntry[] = [
  {
    id: "mtech",
    heading: "M.Tech, AI & ML (first year, semester I)",
    organization: "MIT WPU School of Engineering and Technology",
    url: "https://mitwpu.edu.in/",
    dateRange: "Current",
    description:
      "Postgraduate specialization deepening the applied ML foundation: model explainability, systems thinking, and research method.",
    skills: ["AI & ML", "Research"],
    logo: "/education logos/mit logo.jpeg",
    badgeLabel: "M.Tech, AI & ML",
  },
  {
    id: "be",
    heading: "B.E. Computer Engineering (Hons. AI & ML)",
    organization: "MVPS's KBT College of Engineering, Nashik",
    url: "https://kbtcoe.org/",
    dateRange: "Nov 2022 – Jun 2026",
    description:
      "Bachelor of Engineering in Computer Engineering with Honours in AI & ML. CGPA 7.86.",
    skills: ["Hons. AI & ML", "CGPA 7.86"],
    logo: "/education logos/kbtcoe logo.jpeg",
    badgeLabel: "B.E. Hons. AI & ML",
  },
  {
    id: "hsc",
    heading: "Class XII",
    organization: "M.J. College, Jalgaon",
    url: "https://mjcollege.kces.in/",
    dateRange: "Jun 2022",
    description: "Higher secondary, 73.33%.",
    skills: ["Science", "73.33%"],
    logo: "/education logos/mjc logo.png",
  },
  {
    id: "ssc",
    heading: "Class X",
    organization: "Shree Swaminarayan Gurukul C.B.S.E. School, Savda",
    url: "https://swaminarayaneducation.org/",
    dateRange: "May 2020",
    description: "Secondary school, 92.8%.",
    skills: ["CBSE", "92.8%"],
    logo: "/education logos/Swaminarayan gurukul.jpg",
  },
];
