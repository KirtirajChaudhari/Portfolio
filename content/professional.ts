import { SkillGroup, Project, TimelineEntry, Achievement } from "./types";
import { siteMeta } from "./shared";

/*
 * Editorial hero (spec: two columns, a big word ending the left column and a
 * big word starting the right, with the name as the label and the tagline
 * absolutely positioned under the right word). The template's "Duncan Robert"
 * + "digital / designer" become Kirtiraj's real name and field.
 */
export const professionalHero = {
  label: siteMeta.fullName.split(" ").slice(0, 2).join(" "), // "Kirtiraj Nitin" → shown as name label
  bigWordLeft: "Machine",
  bigWordRight: "Learning",
  tagline:
    "I build explainable, auditable ML for high-stakes domains — clinical nutrition, disease screening, railway safety.",
};

export const professionalAbout = {
  heading: "About",
  description:
    "I'm a first-year M.Tech (AI & ML) student at MIT-WPU, building ML systems for domains where a wrong answer has a cost. Everything I ship is explainable and auditable — models that show their reasoning to the doctors, reviewers, and operators who rely on them.",
  lede:
    "I'm a first-year M.Tech (AI & ML) student at MIT-WPU, building ML systems for domains where a wrong answer has a cost.",
  detail:
    "Everything I ship is explainable and auditable — models that show their reasoning to the doctors, reviewers, and operators who rely on them. Four internships across Python, Django, MERN, and cybersecurity have taught me that production code is never just about the model.",
};

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

export const professionalProjects: Project[] = [
  {
    id: "rasacare",
    title: "RasaCare",
    oneLiner: "Ayurvedic Clinical Diet Intelligence Platform",
    description: "A HIPAA-aligned clinical platform generating Prakriti-aware Ayurvedic diet prescriptions. A knowledge graph of 700 herbs, 741 recipes, and 25K+ triples — with classical Rasa/Guna/Virya/Vipaka properties — powers condition-aware diet generation across 10 clinical conditions at 89.1% overall clinical accuracy. Doctors review, prescribe, and version diet charts through a dedicated portal; patients access and download prescribed plans as PDF — all behind audit logging, role-based access, and encrypted transit.",
    role: "Full-Stack AI Developer",
    techStack: ["React", "Django", "MongoDB"],
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
