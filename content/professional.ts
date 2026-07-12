import { SkillGroup, Project, TimelineEntry, Achievement } from "./types";
import { siteMeta } from "./shared";

export const professionalHeadline = `${siteMeta.role}`;
export const professionalValueProposition = "Open to remote internships and research collaborations in applied ML.";

export const professionalAbout = `Currently pursuing an M.Tech in AI & ML at MIT WPU (First Year), following a B.E. in Computer Engineering with Honours in AI & ML from MVPS's KBT College of Engineering, Nashik. My work sits at the intersection of applied AI and systems that matter in the real world — from RasaCare, a HIPAA-aligned clinical platform generating Ayurvedic diet prescriptions at 89.1% accuracy, to DrishtiManas, an explainable ocular and neurological screening tool, to PRAVAAS, a real-time obstacle-detection system for railway safety. I'm drawn to AI that earns trust — explainable, auditable, and built to be reviewed by the humans who rely on it. Open to internships and research collaborations in applied ML.`;

export const professionalSkills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Python", "C++", "JavaScript", "SQL"],
  },
  {
    category: "Version Control",
    items: ["Git", "GitHub"],
  },
  {
    category: "Web Dev",
    items: ["HTML5", "CSS3", "React", "Django", "FastAPI", "REST APIs"],
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
    oneLiner: "Ayurvedic Clinical Diet & Nutrition Portal",
    description: "A HIPAA-aligned clinical platform generating Prakriti-aware Ayurvedic diet prescriptions. An XGBoost model classifies patient constitution (Vata/Pitta/Kapha) at 89.1% overall clinical accuracy; a Neo4j knowledge graph of 700 herbs, 741 recipes, and 25K+ triples powers condition-aware diet generation across 10 clinical conditions. Doctors review, prescribe, and version diet charts through a dedicated portal; patients access and download prescribed plans as PDF — all behind audit logging, role-based access, and encrypted transit.",
    role: "Full-Stack AI Developer",
    techStack: ["Python", "FastAPI", "PostgreSQL", "Next.js", "Neo4j", "XGBoost"],
    outcome: "89.1% classification accuracy",
    links: { live: "https://rasacare.app", github: "https://github.com/KirtirajChaudhari/rasacare" },
    thumbnail: "", // Placeholder - uses lucide-react icon gradient if missing
    featured: true,
  },
  {
    id: "drishtimanas",
    title: "DrishtiManas",
    oneLiner: "Ocular & Neurological Disease Screening",
    description: "An AI-powered screening platform analyzing fundus, retinal, and OCT images for ocular and neurological conditions. PyTorch handles classification while Grad-CAM overlays highlight which image region drove each prediction, giving clinicians an explainable basis to confirm or override the call. Role-based workflows separate technician (upload, QC), doctor (review, sign-off), and admin (audit, model versioning) responsibilities.",
    role: "AI Developer",
    techStack: ["PyTorch", "TensorFlow", "FastAPI", "React"],
    outcome: "In Development",
    links: { github: "https://github.com/KirtirajChaudhari/drishtimanas" },
    thumbnail: "", // Placeholder
    featured: true,
  },
  {
    id: "pravaas",
    title: "PRAVAAS",
    oneLiner: "Obstacle Detection on Railway Tracks",
    description: "A real-time obstacle-detection pipeline for railway safety. A YOLOv5 model trained on 400 labelled frames across 5 obstacle classes (people, animals, debris, vehicles, fallen objects) reaches 81% mAP@0.5 at 28 FPS on a mid-range GPU — fast enough for near-real-time track monitoring.",
    role: "ML Engineer",
    techStack: ["Python", "YOLOv5", "OpenCV"],
    outcome: "81% mAP@0.5 at 28 FPS",
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
    description: "A two-part project. Part one trains a CNN-based object-detection model to classify and localize vehicles in road imagery with bounding boxes. Part two is a data-science investigation of the Tesla-Deaths dataset — cleaning, EDA across year, country, state, and model, and analysis of verified autopilot-involved fatalities and collision types. [PENDING: architecture used + mAP/accuracy achieved; one headline finding from the autopilot safety analysis]",
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
    description: "A two-part project. Part one uses transfer learning on a pretrained CNN backbone to classify 11 categories of historical architectural structure, trained with and without augmentation and monitored for overfitting. Part two builds a collaborative-filtering recommendation engine over Indonesian tourism data to suggest destinations from a tourist's current location. [PENDING: backbone used + validation accuracy; headline EDA finding from the tourism data]",
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
    description: "Forecasts item-level demand across a multi-restaurant chain. Merges sales, item, and store data, engineers temporal features, then builds and compares Linear Regression, Random Forest, and XGBoost models — holding out the last six months as the test set and scoring by RMSE — to produce a next-year forecast. [PENDING: winning model + its RMSE; one headline EDA finding]",
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
  },
  {
    id: "cert-2",
    type: "certification",
    title: "Meta Full-Stack Developer",
    organization: "Coursera",
    dateRange: "Completed",
  },
  {
    id: "cert-3",
    type: "certification",
    title: "Micro-Credit Program in Computer Science",
    organization: "IIT-Guwahati",
    dateRange: "Completed",
  },
  {
    id: "cert-4",
    type: "certification",
    title: "OCI Data Science",
    organization: "Oracle",
    dateRange: "Completed",
  },
  {
    id: "cert-5",
    type: "certification",
    title: "OCI Generative AI",
    organization: "Oracle",
    dateRange: "Completed",
  },
  {
    id: "cert-6",
    type: "certification",
    title: "Introduction to Machine Learning on AWS",
    organization: "Coursera",
    dateRange: "Completed",
  },
  {
    id: "cert-7",
    type: "certification",
    title: "Deloitte Australia Data Analytics Job Simulation",
    organization: "Forage",
    dateRange: "Completed",
  },
  {
    id: "cert-8",
    type: "certification",
    title: "Tata GenAI Powered Data Analytics Job Simulation",
    organization: "Forage",
    dateRange: "Completed",
  }
];

export const professionalAchievements: Achievement[] = [
  { label: "Projects Shipped", value: 7 },
  { label: "Certifications", value: 8 },
  { label: "Internships", value: 4 },
];
