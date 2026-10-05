import type { SkillGroup, Project, TimelineEntry, ExpertiseArea } from "./types";
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
 * "What I'm good at" on the Work page. This is the single source for that section:
 * the page renders `description` and `tools` as written. Every figure here comes
 * from the 2026 resume (RasaCare, DrishtiManas, Pravaas, PCI LLP).
 */
export const professionalExpertise: ExpertiseArea[] = [
  {
    id: "ml",
    index: "01",
    title: "Machine Learning",
    cursorLabel: "Reviewable",
    description:
      "Classifiers for clinical decisions that can be reviewed: an XGBoost Prakriti classifier (88% CV accuracy) behind RasaCare, and a DenseNet121 multi-label model (0.81 weighted F1 on 37,649 fundus images) behind DrishtiManas.",
    tools: ["XGBoost", "PyTorch", "TensorFlow", "scikit-learn"],
  },
  {
    id: "cv",
    index: "02",
    title: "Computer Vision",
    cursorLabel: "Detection",
    description:
      "Detection and explainability: YOLO11s track-hazard detection under 200 ms on a Jetson Orin Nano with 30% fewer false negatives than a YOLOv5 baseline, a YOLOv8-nano rail-defect second stage, and Grad-CAM heatmaps on medical images.",
    tools: ["OpenCV", "YOLO", "DenseNet121", "Grad-CAM"],
  },
  {
    id: "kg",
    index: "03",
    title: "Knowledge Graphs & Clinical Decision Support",
    cursorLabel: "Traceable",
    description:
      "LLM-free clinical inference over a Neo4j knowledge graph (23K+ nodes, 538 rules, 31 conditions), with rules extracted from primary clinical PDFs, non-suppressible disclaimers and immutable audit logging.",
    tools: ["Neo4j", "XGBoost", "Python"],
  },
  {
    id: "data-science",
    index: "04",
    title: "Data Science & Analysis",
    cursorLabel: "Clean data",
    description:
      "Cleaning, EDA and feature work that catch bad data before training. At PCI LLP I cleaned a 10K-row student dataset, resolving missing values in 5 columns.",
    tools: ["pandas", "NumPy", "Matplotlib", "scikit-learn"],
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
  /** Shown as a small label next to the title, e.g. "On-going". */
  status?: string;
  /** Path under /public/certificates/. Empty → text-only. */
  image: string;
  blurb: string;
}

/*
 * Union of the two resumes, in resume wording. `blurb` stays factual: it only
 * says what the programme covers, never what it led to.
 * Certificate images: drop files into `public/certificates/` and set `image`.
 */
export const professionalCertifications: Certification[] = [
  {
    id: "iitk-genai",
    title: "Generative AI & Machine Learning",
    provider: "IIT Kanpur",
    tier: "program",
    image: "",
    blurb: "Cohort programme in generative AI and applied machine learning.",
  },
  {
    id: "meta-fullstack",
    title: "Meta Full-Stack Developer",
    provider: "Coursera · Meta",
    tier: "program",
    status: "On-going",
    image: "",
    blurb: "Professional certificate covering front-end, back-end, databases and deployment.",
  },
  {
    id: "iitg-cs",
    title: "Micro-Credit Program in Computer Science",
    provider: "IIT Guwahati",
    tier: "program",
    image: "",
    blurb: "Computer-science fundamentals as a credited micro-programme.",
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
    blurb: "Generative AI services on Oracle Cloud Infrastructure.",
  },
  {
    id: "aws-ml",
    title: "Introduction to Machine Learning on AWS",
    provider: "Coursera · AWS",
    tier: "platform",
    image: "",
    blurb: "Machine learning services on AWS.",
  },
  {
    id: "deloitte-forage",
    title: "Data Analytics Job Simulation",
    provider: "Forage · Deloitte Australia",
    tier: "simulation",
    image: "",
    blurb: "Virtual job simulation in data analytics.",
  },
  {
    id: "tata-forage",
    title: "GenAI-Powered Data Analytics Job Simulation",
    provider: "Forage · Tata",
    tier: "simulation",
    image: "",
    blurb: "Virtual job simulation in GenAI-powered data analytics.",
  },
];

export interface AchievementCard {
  id: string;
  category: "Research" | "Recognition" | "IP";
  /** Omit when the source gives no year. */
  year?: string;
  /** Short label shown beside the year, e.g. "Under review". */
  status?: string;
  title: string;
  institution: string;
  description: string;
  /** Path under /public/achievements/. Empty → text only. */
  image: string;
}

/*
 * Only source-verified entries (2026 resume + the user's own confirmations).
 * Statuses are literal: "Under review" is not "accepted", "Registered" carries
 * no date, diary number or placement beyond what is written here.
 */
export const professionalAchievementCards: AchievementCard[] = [
  {
    id: "rtcsa-2026",
    category: "Recognition",
    year: "2026",
    title: "1st Position, RTCSA-2026",
    institution:
      "Dept. of Computer Science, K K Wagh Arts, Commerce, Science and Computer Science College, Nashik",
    description:
      "Presented the RasaCare research paper at the one-day research conference “Recent Trends in Computer Science and Application (RTCSA-2026)” and placed first.",
    image: "",
  },
  {
    id: "icccmla-2026",
    category: "Research",
    year: "2026",
    status: "Under review",
    title: "Research paper submitted, ICCCMLA 2026",
    institution:
      "2026 IEEE 8th International Conference on Cybernetics, Cognition & Machine Learning Applications",
    description:
      "“RasaCare: A Neuro-Symbolic Clinical Decision-Support System for Constitution-Aware Ayurvedic Diet Recommendation”.",
    image: "",
  },
  {
    id: "copyright-rasacare",
    category: "IP",
    year: "2025",
    status: "Registered",
    title: "Copyright registered, Government of India",
    institution: "Copyright Office, Government of India",
    description: "The RasaCare software was registered with the Copyright Office.",
    image: "",
  },
  {
    id: "incubate-2025",
    category: "Recognition",
    year: "2025",
    title: "Finalist, InCubate 2025 (National MedTech Hackathon)",
    institution: "JIPMER × IIT Bombay",
    description:
      "Team shortlisted to the offline finals at JIPMER, Puducherry (5 October 2025) in the inaugural national MedTech hackathon, supported by KCDH, JUSRC and the IIT Bombay Institute Technical Council.",
    image: "",
  },
];

export const achievementsSubheading =
  "Research, IP and recognition outside the coursework.";

export const professionalProjects: Project[] = [
  {
    id: "rasacare",
    title: "RasaCare",
    oneLiner: "Ayurvedic Clinical Diet Intelligence Platform",
    description: "A HIPAA-aligned clinical platform generating Prakriti-aware Ayurvedic diet prescriptions. A knowledge graph of 700 herbs, 741 recipes, and 25K+ triples — with classical Rasa/Guna/Virya/Vipaka properties — powers condition-aware diet generation across 10 clinical conditions at 89.1% overall clinical accuracy. Doctors review, prescribe, and version diet charts through a dedicated portal; patients access and download prescribed plans as PDF — all behind audit logging, role-based access, and encrypted transit.",
    role: "Full-Stack AI Developer",
    techStack: ["React", "Django", "MongoDB"],
    metrics: ["89.1% clinical accuracy", "25K+ graph nodes", "10 clinical conditions"],
    outcome: "Live at rasacare.app",
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

