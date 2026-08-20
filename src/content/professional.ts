import type { SkillGroup, Project, TimelineEntry, Achievement } from "./types";
import { siteMeta } from "./shared";

/*
 * The hero tile carries exactly three lines: the role above the name, the name
 * itself, and a one-line tagline under it. Author-supplied — do not expand.
 */
export const professionalHero = {
  eyebrow: siteMeta.role,
  name: siteMeta.displayName,
  tagline: "Building Intelligent Solutions for Healthcare, Society & the Future",
};

export const professionalMission =
  "To build machine learning that explains itself — models a doctor, a reviewer, or an operator can interrogate before they act on it. Accuracy is the entry fee; accountability is the product.";

export const professionalVision =
  "A world where high-stakes AI is auditable by default: every prediction traceable to its evidence, every override logged, and every system built so the people it serves can question it.";

export const professionalAbout = {
  heading: "About",
  /*
   * Author-supplied, verbatim. The section headline is the plain word "About"
   * because the statement line it used to carry now opens the hero.
   */
  detail:
    "I am an AI/ML Engineer and a Computer Engineering graduate currently pursuing my M.Tech in Artificial Intelligence and Machine Learning at MIT WPU, Pune. My core passion lies at the intersection of HealthTech, Computer Vision, and Generative AI—building intelligent systems that create a tangible impact on society. Backed by a technical foundation spanning deep learning frameworks (PyTorch, TensorFlow), modern backends (FastAPI, Django), and graph databases (Neo4j), I focus on turning complex models into real-world solutions. Recently, I developed RasaCare, a comprehensive cloud-based practice management and nutrient analysis software tailored specifically for Ayurvedic dietitians.",
  stats: [
    { value: 4, label: "Internships" },
    { value: 9, label: "Projects shipped" },
    { value: 7.86, label: "B.E. CGPA", decimals: 2 },
    { value: 22, label: "Tools in rotation" },
  ] as { value: number; label: string; decimals?: number }[],
};

export const professionalPrinciples = [
  {
    num: "01",
    title: "Explainable by Default",
    text: "Models that show their reasoning to the doctors, reviewers, and operators who rely on them."
  },
  {
    num: "02",
    title: "Production Reality",
    text: "Building for production, not for the notebook. Focus on role-based access, audit logging, and data layers."
  },
  {
    num: "03",
    title: "Accountable Engineering",
    text: "Building ML systems for domains where a wrong answer has a cost. Accuracy matters, but safety is paramount."
  }
];

export const professionalFacts: {
  label: string;
  value: string;
  href?: string;
}[] = [
  { label: "Location", value: "Pune, India" },
  { label: "Education", value: "M.Tech AI & ML — MIT-WPU" },
  { label: "Experience", value: "4 internships" },
  {
    label: "GitHub",
    value: "github.com/KirtirajChaudhari",
    href: "https://github.com/KirtirajChaudhari",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/kirtirajchaudhari",
    href: "https://linkedin.com/in/kirtirajchaudhari",
  },
];

/** "My Story" primary button target — in-page anchor to the journey (Experience & Education). */
export const professionalMyStoryHref = "#timeline";

/**
 * Service section, reframed from the template's billable services into
 * areas of expertise (Kirtiraj is a student/fresher, not freelancing).
 * Each row drives a distinct follow-cursor label per the spec.
 */
export const professionalExpertise: {
  id: string;
  index: string;
  title: string;
  cursorLabel: string;
  description: string;
  tools: string[];
}[] = [
  {
    id: "ml",
    index: "01",
    title: "Machine Learning",
    cursorLabel: "Explainable",
    description:
      "Explainable, auditable models for high-stakes decisions — patient-constitution classification at 89% accuracy, Grad-CAM overlays that show clinicians why a prediction was made, and pipelines built to be reviewed, not just run.",
    tools: ["PyTorch", "TensorFlow", "XGBoost", "scikit-learn"],
  },
  {
    id: "fullstack",
    index: "02",
    title: "Full-Stack Development",
    cursorLabel: "Production",
    description:
      "Shipping ML behind real products — FastAPI and Django backends, Next.js and React frontends, role-based access, audit logging, and PostgreSQL/Neo4j data layers. Four internships spent building for production, not for the notebook.",
    tools: ["FastAPI", "Django", "Next.js", "React", "PostgreSQL"],
  },
  {
    id: "data-science",
    index: "03",
    title: "Data Science & Analysis",
    cursorLabel: "Insight",
    description:
      "Turning raw data into decisions — cleaning, feature engineering, EDA that catches bad data before training, and forecasting that compares models on held-out error rather than trusting one.",
    tools: ["pandas", "NumPy", "Matplotlib", "XGBoost"],
  },
  {
    id: "cv-nlp",
    index: "04",
    title: "Computer Vision & NLP",
    cursorLabel: "Perception",
    description:
      "Real-time perception where latency and safety matter — YOLOv5 obstacle detection at 81% mAP and 28 FPS for railway safety, plus classification and knowledge-graph work spanning medical imaging and language.",
    tools: ["OpenCV", "YOLOv5", "Grad-CAM", "Neo4j"],
  },
];

export const professionalSkills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Python", "C++", "JavaScript", "SQL"],
  },
  {
    category: "Web Dev & Tools",
    items: ["HTML5", "CSS3", "React", "Django", "FastAPI", "REST APIs", "Git", "GitHub"],
  },
  {
    category: "Databases",
    items: ["MySQL", "PostgreSQL", "MongoDB", "Neo4j"],
  },
  {
    category: "DS & ML",
    items: ["pandas", "NumPy", "Matplotlib", "scikit-learn", "PyTorch", "TensorFlow", "XGBoost", "Pydantic"],
  },
  {
    category: "CV & NLP",
    items: ["OpenCV", "YOLOv5", "Grad-CAM"],
  },
];

/**
 * Skills with proficiency levels for the animated progress bars.
 * Levels are self-assessed against depth of use across the four internships
 * and nine projects — not a benchmark score.
 */
export const professionalSkillLevels: { category: string; icon: string; items: { name: string; level: number }[] }[] = [
  {
    category: "Languages",
    icon: "code",
    items: [
      { name: "Python", level: 92 },
      { name: "SQL", level: 85 },
      { name: "JavaScript", level: 80 },
      { name: "C++", level: 75 },
    ],
  },
  {
    category: "Data Science & ML",
    icon: "brain",
    items: [
      { name: "pandas", level: 90 },
      { name: "NumPy", level: 88 },
      { name: "scikit-learn", level: 87 },
      { name: "XGBoost", level: 85 },
      { name: "PyTorch", level: 84 },
      { name: "TensorFlow", level: 80 },
    ],
  },
  {
    category: "Web & Backend",
    icon: "server",
    items: [
      { name: "Django", level: 88 },
      { name: "FastAPI", level: 86 },
      { name: "REST APIs", level: 85 },
      { name: "React", level: 82 },
      { name: "Next.js", level: 78 },
    ],
  },
  {
    category: "Databases",
    icon: "database",
    items: [
      { name: "MySQL", level: 85 },
      { name: "PostgreSQL", level: 82 },
      { name: "MongoDB", level: 80 },
      { name: "Neo4j", level: 76 },
    ],
  },
  {
    category: "Computer Vision & NLP",
    icon: "eye",
    items: [
      { name: "OpenCV", level: 84 },
      { name: "YOLO (v5 / v8 / 11)", level: 82 },
      { name: "Grad-CAM", level: 78 },
    ],
  },
  {
    category: "Tools & Workflow",
    icon: "git",
    items: [
      { name: "Git & GitHub", level: 88 },
      { name: "Docker", level: 76 },
      { name: "Streamlit", level: 80 },
      { name: "Pydantic", level: 82 },
    ],
  },
];

export interface Certification {
  id: string;
  title: string;
  provider: string;
  tier: "program" | "platform" | "simulation";
  /** Path under /public/certificates/. Empty → text-only card. */
  image: string;
  blurb: string;
}

/*
 * Certificate images: drop files into `public/certificates/` and set `image`
 * to "/certificates/<filename>" — the card renders it automatically.
 */
export const professionalCertifications: Certification[] = [
  {
    id: "iitk-genai",
    title: "Gen. AI & Machine Learning",
    provider: "IIT Kanpur",
    tier: "program",
    image: "",
    blurb: "Full program in generative AI and applied ML, closed out with three capstone builds.",
  },
  {
    id: "meta-fullstack",
    title: "Meta Full-Stack Developer",
    provider: "Coursera · Meta",
    tier: "program",
    image: "",
    blurb: "Professional certificate covering front-end, back-end, databases, and deployment.",
  },
  {
    id: "iitg-cs",
    title: "Micro-Credit Program in Computer Science",
    provider: "IIT Guwahati",
    tier: "program",
    image: "",
    blurb: "Core computer-science fundamentals delivered as a credited micro-program.",
  },
  {
    id: "oci-ds",
    title: "OCI Data Science Professional",
    provider: "Oracle",
    tier: "platform",
    image: "",
    blurb: "Model development and deployment on Oracle Cloud Infrastructure.",
  },
  {
    id: "oci-genai",
    title: "OCI Generative AI Professional",
    provider: "Oracle",
    tier: "platform",
    image: "",
    blurb: "LLM services, retrieval augmentation, and generative workloads on OCI.",
  },
  {
    id: "aws-ml",
    title: "Introduction to Machine Learning on AWS",
    provider: "Coursera · AWS",
    tier: "platform",
    image: "",
    blurb: "ML services and managed training/inference on the AWS stack.",
  },
  {
    id: "deloitte-forage",
    title: "Deloitte Australia Data Analytics Job Simulation",
    provider: "Forage",
    tier: "simulation",
    image: "",
    blurb: "Client-style analytics engagement — forensic data analysis and reporting.",
  },
  {
    id: "tata-forage",
    title: "Tata GenAI Powered Data Analytics Job Simulation",
    provider: "Forage",
    tier: "simulation",
    image: "",
    blurb: "GenAI-assisted analytics workflow, from exploration through recommendation.",
  },
];

export interface AchievementCard {
  id: string;
  category: "Professional" | "Academic";
  year: string;
  title: string;
  institution: string;
  description: string;
  /** Path under /public/achievements/. Empty → icon-only card. */
  image: string;
}

/*
 * Only source-verified achievements. Add more by appending here; drop matching
 * images into `public/achievements/` and set `image` to "/achievements/<file>".
 */
export const professionalAchievementCards: AchievementCard[] = [
  {
    id: "sih-2025",
    category: "Professional",
    year: "2025",
    title: "Smart India Hackathon — 5th Place, Grand Finale",
    institution: "Ministry of Education, Govt. of India",
    description:
      "Built RasaCare, an Ayurvedic clinical diet platform, in partnership with a practicing physician — a 23K-node Neo4j knowledge graph, an XGBoost Prakriti classifier at 88% CV accuracy, and a 6-layer diet engine under full clinical audit. Placed 5th in the national finals; now live at rasacare.app.",
    image: "",
  },
  {
    id: "iitk-capstones",
    category: "Academic",
    year: "2024",
    title: "Three Capstone Projects — Gen AI & ML Program",
    institution: "IIT Kanpur",
    description:
      "Completed the program's capstone track with three independent builds: CNN vehicle detection with an autopilot-fatality data study, transfer-learning classification of 11 heritage-architecture categories with a tourism recommender, and multi-restaurant demand forecasting benchmarked across Linear Regression, Random Forest, and XGBoost.",
    image: "",
  },
  {
    id: "be-hons",
    category: "Academic",
    year: "2026",
    title: "B.E. Computer Engineering with Honours in AI & ML",
    institution: "MVPS's KBT College of Engineering, Nashik",
    description:
      "Four-year degree carrying an additional Honours track in AI & ML on top of the core Computer Engineering curriculum. Graduated with a CGPA of 7.86/10.",
    image: "",
  },
  {
    id: "cbse-x",
    category: "Academic",
    year: "2020",
    title: "92.8% — CBSE Class X",
    institution: "Shree Swaminarayan Gurukul C.B.S.E. School, Savda",
    description:
      "Top-band secondary result that opened the Science stream and, from there, the path into computer engineering.",
    image: "",
  },
];

export const achievementsSubheading =
  "Recognition earned by shipping — hackathon finals, capstone builds, and results that held up outside the notebook.";

/**
 * Headline counters. Deliberately reports Internships rather than the template's
 * "Awards" slot — one verified award reads weaker than four real internships,
 * and inventing the rest was not an option.
 */
export const professionalStatCounters: { value: number; suffix?: string; label: string }[] = [
  { value: 2, suffix: "+", label: "Years Experience" },
  { value: 8, label: "Certifications" },
  { value: 9, label: "Projects" },
  { value: 4, label: "Internships" },
];

export const professionalProjects: Project[] = [
  {
    id: "rasacare",
    title: "RasaCare",
    oneLiner: "Ayurvedic Clinical Diet Intelligence Platform",
    description: "A HIPAA-aligned clinical platform generating Prakriti-aware Ayurvedic diet prescriptions. A knowledge graph of 700 herbs, 741 recipes, and 25K+ triples — with classical Rasa/Guna/Virya/Vipaka properties — powers condition-aware diet generation across 10 clinical conditions at 89.1% overall clinical accuracy. Doctors review, prescribe, and version diet charts through a dedicated portal; patients access and download prescribed plans as PDF — all behind audit logging, role-based access, and encrypted transit.",
    role: "Full-Stack AI Developer",
    techStack: ["React", "Django", "MongoDB"],
    metrics: ["89.1% clinical accuracy", "25K+ graph nodes", "10 clinical conditions", "SIH 2025"],
    outcome: "5th place, hackathon finals · live at rasacare.app",
    links: { live: "https://rasacare.app", github: "https://github.com/KirtirajChaudhari/rasacare" },
    thumbnail: "", // Placeholder - uses lucide-react icon gradient if missing
    featured: true,
  },
  {
    id: "drishtimanas",
    title: "DrishtiManas",
    oneLiner: "AI-Driven Ocular Disease Screening Platform",
    description: "An AI-driven screening platform for fundus images. A DenseNet121 multi-label classifier (8 conditions, 0.81 weighted F1 on ~7,530 test images) pairs with Grad-CAM overlays that highlight which image region drove each prediction, giving clinicians an explainable basis to confirm or override the call. Role-based workflows separate technician (upload, QC), doctor (review, sign-off), and admin (audit, model versioning) responsibilities across a Dockerized React + FastAPI + PostgreSQL platform.",
    role: "AI Developer",
    techStack: ["PyTorch", "DenseNet121", "FastAPI", "React", "PostgreSQL"],
    metrics: ["0.81 weighted F1", "7,530 test images", "8 conditions"],
    outcome: "0.81 weighted F1 · platform shipped",
    links: { github: "https://github.com/KirtirajChaudhari/drishtimanas" },
    thumbnail: "", // Placeholder
    featured: true,
  },
  {
    id: "pravaas",
    title: "PRAVAAS",
    oneLiner: "AI Railway Track Safety System",
    description: "A two-model railway safety pipeline: a YOLO11s obstacle detector trained on a custom-annotated set across 6 classes (Animal, Debris, Human, Object, Stone, Tree) as a proof-of-concept dataset → training → deployable-weights workflow, paired with a YOLOv8-nano rail-surface defect detection module in a Streamlit app. Both deploy as lightweight local inference rather than cloud services.",
    role: "ML Engineer",
    techStack: ["Python", "YOLO11s", "Ultralytics", "OpenCV"],
    metrics: ["81% mAP", "28 FPS inference", "6 obstacle classes"],
    outcome: "Working two-model safety prototype",
    links: { github: "https://github.com/KirtirajChaudhari/pravaas" },
    thumbnail: "", // Placeholder
    featured: true,
  },
  {
    id: "lab-complaint",
    title: "Lab Complaint Management System",
    oneLiner: "Ticketing system for lab equipment complaints",
    description: "A ticketing system tracking lab-equipment complaints across 3 labs and 4 user roles. Staff raise tickets, admins move them through open → in-progress → resolved. Deployed and in active use — 200+ tickets processed across 8 complaint categories since launch.",
    role: "Backend Developer",
    techStack: ["Django", "MySQL", "REST APIs"],
    metrics: ["200+ tickets processed", "8 complaint categories", "4 user roles"],
    outcome: "200+ tickets processed",
    links: { github: "https://github.com/KirtirajChaudhari/lab-complaint" },
    thumbnail: "", // Placeholder
    featured: true,
  },
  {
    id: "autonomous-driving",
    title: "Autonomous Driving",
    oneLiner: "Vehicle Detection & Autopilot Safety Analysis",
    description: "A CNN-based object-detection model that classifies and localizes vehicles in road imagery, paired with a data-science investigation of the Tesla-Deaths dataset — cleaning, EDA across year, country, and model, and analysis of verified autopilot-involved fatalities.",
    role: "ML/Data Science Engineer",
    techStack: ["Python", "TensorFlow/PyTorch", "OpenCV", "pandas"],
    links: { github: "https://github.com/KirtirajChaudhari/autonomous-driving" },
    thumbnail: "", // Placeholder
    featured: false,
    badge: "IIT-Kanpur Capstone",
  },
  {
    id: "preserving-heritage",
    title: "Preserving Heritage",
    oneLiner: "Structure Classification & Tourism Recommender",
    description: "Transfer learning on a pretrained CNN backbone to classify 11 categories of historical architecture — trained with and without augmentation and monitored for overfitting — plus a collaborative-filtering engine recommending Indonesian tourism destinations from a tourist's location.",
    role: "ML Engineer",
    techStack: ["Python", "TensorFlow", "OpenCV", "pandas"],
    links: { github: "https://github.com/KirtirajChaudhari/preserving-heritage" },
    thumbnail: "", // Placeholder
    featured: false,
    badge: "IIT-Kanpur Capstone",
  },
  {
    id: "sales-forecasting",
    title: "Sales Forecasting",
    oneLiner: "Multi-Restaurant Demand Prediction",
    description: "Item-level demand forecasting across a multi-restaurant chain. Merges sales, item, and store data, engineers temporal features, then compares Linear Regression, Random Forest, and XGBoost — scored by RMSE on a held-out six months — to produce a next-year forecast.",
    role: "Data Scientist",
    techStack: ["Python", "scikit-learn", "XGBoost", "pandas"],
    links: { github: "https://github.com/KirtirajChaudhari/sales-forecasting" },
    thumbnail: "", // Placeholder
    featured: false,
    badge: "IIT-Kanpur Capstone",
  }
];

export const professionalTimeline: TimelineEntry[] = [
  {
    id: "exp-1",
    type: "internship",
    title: "Software Developer Intern",
    organization: "QuasarCyberTech Private Limited, Nashik",
    dateRange: "Apr 2026 – May 2026",
    description: "Wrote the report-generation module for QRGT, the firm's internal penetration-testing platform — FastAPI endpoints and ReportLab-driven PDF generation turning raw findings into Web PT, API PT, and Network PT reports, with CVSS v3.1 scoring and OWASP Top 10 mapping.",
  },
  {
    id: "exp-2",
    type: "internship",
    title: "MERN Full-Stack Developer Intern",
    organization: "Edunet Foundation (AICTE)",
    dateRange: "Feb 2025 – Mar 2025",
    description: "Built a full MERN-stack application (React, Express, Node.js, MongoDB) on an MVC architecture, delivered across weekly sprints.",
  },
  {
    id: "exp-3",
    type: "internship",
    title: "Python Developer Intern",
    organization: "BitSpark Technologies",
    dateRange: "Aug 2024 – Feb 2025",
    description: "Built and maintained live Django full-stack applications — shipped new features, fixed bugs, and sped up several slow-loading pages by reworking their database queries.",
  },
  {
    id: "exp-4",
    type: "internship",
    title: "Data Science Trainee",
    organization: "PCI LLP",
    dateRange: "Jan 2024 – Feb 2024",
    description: "Handled data cleaning and feature engineering for the team's models, and built the EDA visualizations used to catch bad data before training.",
  },
  {
    id: "edu-1",
    type: "education",
    title: "M.Tech, AI & ML — First Year, Semester I",
    organization: "MIT WPU School of Engineering and Technology",
    dateRange: "Current",
  },
  {
    id: "edu-2",
    type: "education",
    title: "B.E. Computer Engineering (Hons. AI & ML)",
    organization: "MVPS's Karmaveer Adv. Baburao Ganpatrao Thakare College of Engineering, Nashik",
    dateRange: "Nov 2022 – Jun 2026",
    description: "GPA: 7.85/10",
  },
  {
    id: "edu-3",
    type: "education",
    title: "Class XII",
    organization: "M.J. College, Jalgaon",
    dateRange: "Jun 2022",
    description: "73.33%",
  },
  {
    id: "edu-4",
    type: "education",
    title: "Class X",
    organization: "Shree Swaminarayan Gurukul C.B.S.E. School, Savda",
    dateRange: "May 2020",
    description: "92.8%",
  },
  {
    id: "cert-1",
    type: "certification",
    title: "Gen. AI & Machine Learning",
    organization: "IIT-Kanpur",
    dateRange: "Completed",
    tier: "program",
  },
  {
    id: "cert-2",
    type: "certification",
    title: "Meta Full-Stack Developer",
    organization: "Coursera",
    dateRange: "Completed",
    tier: "program",
  },
  {
    id: "cert-3",
    type: "certification",
    title: "Micro-Credit Program in Computer Science",
    organization: "IIT-Guwahati",
    dateRange: "Completed",
    tier: "program",
  },
  {
    id: "cert-4",
    type: "certification",
    title: "OCI Data Science",
    organization: "Oracle",
    dateRange: "Completed",
    tier: "platform",
  },
  {
    id: "cert-5",
    type: "certification",
    title: "OCI Generative AI",
    organization: "Oracle",
    dateRange: "Completed",
    tier: "platform",
  },
  {
    id: "cert-6",
    type: "certification",
    title: "Introduction to Machine Learning on AWS",
    organization: "Coursera",
    dateRange: "Completed",
    tier: "platform",
  },
  {
    id: "cert-7",
    type: "certification",
    title: "Deloitte Australia Data Analytics Job Simulation",
    organization: "Forage",
    dateRange: "Completed",
    tier: "simulation",
  },
  {
    id: "cert-8",
    type: "certification",
    title: "Tata GenAI Powered Data Analytics Job Simulation",
    organization: "Forage",
    dateRange: "Completed",
    tier: "simulation",
  }
];

/*
 * About stat cards. These are REAL counts derived from the content above
 * (7 projects, 8 certifications, 4 internships) — deliberately NOT the
 * template's fabricated "12 years / 270 projects / 50 clients".
 * TODO(kirtiraj): confirm/adjust these numbers before shipping.
 */
export const professionalAchievements: Achievement[] = [
  { label: "Projects Shipped", value: 7, suffix: "+" },
  { label: "Certifications", value: 8 },
  { label: "Internships", value: 4 },
];
