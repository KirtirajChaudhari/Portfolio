import { professionalProjects } from "./professional";

/*
 * Dedicated project-page content — ground truth: the "Project Portfolio —
 * Technical Deep-Dive" PDF (source-verified from the GitHub repos, Kaggle
 * notebooks, and the live rasacare.app deployment).
 * `screenshot` is empty until the user supplies real captures — cards
 * render a styled placeholder, never a stock image.
 */

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

const bySlug = Object.fromEntries(professionalProjects.map((p) => [p.id, p]));

export const projectCases: ProjectCase[] = [
  {
    slug: "rasacare",
    title: "RasaCare",
    oneLiner: "Ayurvedic Clinical Diet & Nutrition Portal",
    techLine: "Next.js 14 · FastAPI · Neo4j · XGBoost",
    screenshot: "/project/RasaCare.png",
    github: "https://github.com/KirtirajChaudhari/RasaCare",
    live: "https://rasacare.app",
    problem:
      "Ayurvedic diet prescription depends on bridging traditional medicine with modern ML-driven clinical decision support. Generic diet apps lack the rigorous clinical constraints, multi-layered Ayurvedic rules, and doctor-prescribable audit trails required for real-world clinical use.",
    approach:
      "RasaCare is a cloud-based clinical portal built in partnership with a practicing Ayurvedic physician. A doctor selects a patient, and the system generates a personalized meal plan through an 11-phase, non-skippable recommendation pipeline. This pipeline uses an XGBoost model for Prakriti classification (86.74% five-fold CV accuracy, 85.6% on a 1,000-sample holdout) based on 18 physiological features. It then runs through a 6-layer diet engine that evaluates a Neo4j knowledge graph (23,756 nodes), a 31-condition clinical constraint engine (with allergen and CKD/ADA thresholds), and 538 pathya-apathya rules. Designed for strict clinical governance: no LLMs are used for clinical inference, every generated plan includes a non-suppressible clinical disclaimer, and all overrides and prescriptions are immutably audited.",
    stack: [
      { name: "Next.js 14 & TailwindCSS", role: "Frontend portals for Doctors and Patients with Supabase Auth" },
      { name: "FastAPI & PostgreSQL", role: "Application tier (12 routers) and relational data via SQLAlchemy" },
      { name: "Neo4j V2", role: "Ayurvedic knowledge graph (23,756 nodes) with a 10-phase deterministic rebuild pipeline" },
      { name: "XGBoost", role: "Prakriti classification (86.74% five-fold CV accuracy) and 7-signal composite diet scoring" },
    ],
    decisions: [
      "Total LLM isolation for clinical inference — 538 pathya-apathya rules were extracted directly from primary clinical PDFs, preventing hallucination.",
      "Implemented a 7-signal composite scoring system weighting ML models, Dosha rules, and KG triples to rank meal candidates.",
      "Enforced clinical governance through non-suppressible disclaimers, doctor-only prescribing, and immutable audit logging.",
    ],
    outcome: "Live at rasacare.app · 86.74% Prakriti CV accuracy · 23,756 graph nodes",
  },
  {
    slug: "drishtimanas",
    title: "Drishti Manas",
    oneLiner: "Retinal OCT classification with a neural network written from scratch",
    techLine: "NumPy · FastAPI · React · TypeScript · Tailwind",
    screenshot: "/project/DrishtiManas.png",
    github: "https://github.com/KirtirajChaudhari/DrishtiManas",
    live: "https://drishtimanas-mu.vercel.app",
    problem:
      "Retinal OCT scans are read by specialists, and two of the four classes need urgent referral: CNV (wet age-related macular degeneration) and DME (diabetic macular edema). Drusen means routine follow-up and a normal retina means nothing. The project asks how far a small, fully transparent neural network can go at sorting these scans.",
    approach:
      "The app classifies OCTMNIST scans (109,309 B-scans, 4 classes) with a multilayer perceptron written in NumPy. Each image is cropped, resized to 64x64, and turned into raw-pixel and HOG features (2,788 dimensions). The network is 256 ReLU units with 40% dropout and a 4-way softmax, trained with SGD and momentum on all 97,477 training images. The served model averages three networks and applies a per-class bias correction tuned on a class-balanced validation subsample. A FastAPI service runs the model, and a React and TypeScript app shows predictions next to a model report page with the curves and tuning runs.",
    stack: [
      { name: "NumPy", role: "The MLP itself: forward pass, backpropagation, optimizers (SGD, momentum, Adam), L2 and early stopping, in about 300 lines" },
      { name: "scikit-learn", role: "Baseline models and a cross-check of the hand-written metrics only" },
      { name: "FastAPI", role: "Prediction API that also serves the built frontend" },
      { name: "React, Vite, TypeScript, Tailwind", role: "Upload, results and model-report pages" },
    ],
    decisions: [
      "Wrote the network by hand instead of using PyTorch, and verified backpropagation with a numerical gradient check (max relative error 1.4e-9).",
      "Dropout and class-prior calibration helped; the three-model ensemble did not move the test score. It stayed, because it was chosen on validation, and dropping it after seeing the test result would be choosing on the test set.",
      "Tuned the calibration on a class-balanced subsample, because tuning on the full imbalanced validation split raised validation F1 but lowered test macro-F1 (66.1% to 60.6%).",
    ],
    outcome: "69.1% test accuracy · 67.9% macro-F1 on 1,000 balanced OCTMNIST images · live on Vercel",
  },
  {
    slug: "pravaas",
    title: "PRAVAAS",
    oneLiner: "AI-based railway track safety system — obstacle detection and rail surface defect detection",
    techLine: "YOLO11s · YOLOv8-nano · PyTorch · Streamlit",
    screenshot: "/project/PRAVAAS.png",
    github: "https://github.com/KirtirajChaudhari/RailwayObjectDetectionProject",
    extraLinks: [
      { label: "Rail-Defect Repo", href: "https://github.com/pradeepxkumar/Rail-defect-detection" },
    ],
    problem:
      "Two distinct but related hazards threaten railway track safety: unauthorized objects or beings on the track (animals, people, debris, fallen trees) and physical defects in the rail surface itself (cracks, wear, joint failures). Both are traditionally caught through manual patrols and visual inspection, which cannot scale across thousands of kilometres of track and are prone to human fatigue and inconsistency.",
    approach:
      "PRAVAAS pairs two YOLO-based systems into one conceptual safety pipeline. Component 1 (my build) watches for track obstructions: a YOLO11s object detector trained on a custom-annotated dataset covering six classes (Animal, Debris, Human, Object, Stone, Tree). It was trained for 40 epochs at 640px on a Tesla T4 GPU and reached 67.3% mAP50 (51.8% mAP50-95) on a 26-image validation split, resulting in portable weights for downstream inference on images, video, or a live USB camera feed. Component 2 watches for structural rail defects: a YOLOv8-nano model trained on public Kaggle and Roboflow railway-fault datasets, wrapped in a Streamlit web application. The app supports folder-based batch image upload, session-level caching, a manual accuracy-validation calculator, and a detection summary table.",
    stack: [
      { name: "YOLO11s (Ultralytics)", role: "Obstacle detection model (6 custom classes)" },
      { name: "YOLOv8-nano (Ultralytics)", role: "Rail surface defect detection model" },
      { name: "PyTorch & CUDA", role: "Model training and inference via Tesla T4 GPU" },
      { name: "Streamlit & OpenCV", role: "Batch upload interface with caching and summary tables" },
    ],
    decisions: [
      "Obstacle detector framed as a proof-of-concept pipeline (dataset -> training -> deployable weights) on a small dataset (about 150 images), rather than claiming production-grade accuracy.",
      "Combined two deployable local inference applications rather than heavyweight cloud services to align with real-world trackside hardware constraints.",
    ],
    outcome: "67.3% mAP50 on the obstacle detector · two-model safety prototype",
  },
  {
    slug: "bhojansetu",
    title: "BhojanSetu",
    oneLiner: "Role-based point-of-sale system for full-service Indian restaurants",
    techLine: "React 18.2 · Django 5.2 · DRF · SQLite/PostgreSQL",
    screenshot: "/project/BhojanSetu.png",
    github: "https://github.com/KirtirajChaudhari/BhojanSetu",
    problem:
      "Coordinating orders across waitstaff, kitchen, and front-desk billing in a busy restaurant is error-prone on paper or across disconnected tools — orders get miscommunicated, table status goes stale, and billing becomes a manual reconciliation task.",
    approach:
      "Three role-scoped portals share one backend: a Waiter portal for creating and editing orders against a categorized menu of 50+ Indian dishes (with vegetarian/vegan and spice-level indicators); a Kitchen portal showing a live order queue with preparation-status updates; and a Reception portal with real-time table-occupancy stats, an active-vs-closed order breakdown, and PDF bill generation with a preview step before a table is closed out. The backend is Django + Django REST Framework with token authentication and a custom User model carrying Waiter / Chef / Reception roles for permissioning. Invoices are generated server-side with ReportLab, and the React frontend polls for near-real-time updates on the kitchen and reception views.",
    stack: [
      { name: "React 18.2", role: "Three role-scoped frontend portals with polling for near-real-time updates" },
      { name: "Django 5.2 + DRF", role: "Backend API with token auth and custom role-based User model" },
      { name: "ReportLab", role: "Server-side PDF bill generation with preview" },
      { name: "Docker Compose", role: "Containerized deployment with database seeding" },
    ],
    decisions: [
      "Included a bill generation preview step on the Reception portal before a table is closed out to prevent costly billing errors.",
      "Roles are strictly enforced in the data model — a custom User model gates endpoints via Waiter / Chef / Reception permissions.",
      "Demo-ready by design: ships with a Docker Compose setup and a management command that seeds the database with sample users and the full menu.",
    ],
    outcome: "End-to-end POS system supporting Waiter, Kitchen, and Reception roles",
  },
  {
    slug: "id-boundary",
    title: "IdBoundaryDetection (RefurbEdge)",
    oneLiner: "ID card segmentation and geometric rectification — built as an AI Trainee (Computer Vision) skills demonstration",
    techLine: "PyTorch · U-Net · DeepLabV3+ · Shapely",
    screenshot: "/project/IdBoundaryDetection.png",
    github: "https://github.com/KirtirajChaudhari/IdBoundaryDetection",
    problem:
      "Document-verification and KYC pipelines need a clean, standardized, top-down crop of an ID card — but real photos come in at angles, under inconsistent lighting, and against cluttered backgrounds. This project was built under a deliberate, self-imposed constraint: solve it without YOLO, SAM, or heuristic-only OpenCV shortcuts, to demonstrate a from-first-principles computer-vision pipeline for an AI Trainee role application.",
    approach:
      "Two comparable solutions were developed. Approach A (primary): A U-Net with a ResNet-18 encoder performs binary segmentation to isolate the card from the background. The largest connected region's polygon is extracted and reduced to a minimum rotated rectangle via Shapely to estimate the four corners, then a projective transform warps the card into a standardized top-down crop. Approach B (alternative): A DeepLabV3+ model with a ResNet-34 encoder performs semantic segmentation for cleaner boundary quality on noisier images. Both pipelines support GPU training with mixed precision, merge datasets across multiple annotation formats (pre-generated masks, MIDV-500 JSON quadrilaterals, COCO), and are evaluated with IoU, Dice, and Normalized Corner Distance (NCD).",
    stack: [
      { name: "U-Net (ResNet-18)", role: "Primary binary segmentation → geometry → projective rectification" },
      { name: "DeepLabV3+ (ResNet-34)", role: "Alternative semantic segmentation for noisy images" },
      { name: "Shapely & scikit-image", role: "Minimum rotated rectangle corner estimation and projective warp" },
      { name: "PyTorch, AMP, Albumentations", role: "Mixed-precision training with heavy augmentation" },
    ],
    decisions: [
      "Segment first, then apply simple geometry — more stable and more explainable than regression-based corner prediction.",
      "Tuned to train on a limited-VRAM GPU (GTX 1650), representing a real hardware constraint rather than an assumed cloud GPU.",
      "Two full pipelines built for honest comparison, scored on IoU, Dice, and Normalized Corner Distance.",
    ],
    outcome: "Two comparable segmentation pipelines evaluated on IoU, Dice, and NCD",
  },
  {
    slug: "lab-complaint",
    title: "Lab Complaint Management System",
    oneLiner: bySlug["lab-complaint"]?.oneLiner || "",
    techLine: "Django · MySQL · REST APIs",
    screenshot: "/project/Lab Complaint Management System.png",
    github: bySlug["lab-complaint"]?.links.github,
    problem:
      "Lab-equipment complaints across 3 college labs lived in paper registers — no visibility into what was broken, who was fixing it, or how long anything took.",
    approach:
      "A Django ticketing system with 4 user roles: staff raise tickets, admins move them through open → in-progress → resolved, with 8 complaint categories for reporting.",
    stack: [
      { name: "Django", role: "Ticket lifecycle, roles, and admin workflows" },
      { name: "MySQL", role: "Ticket and equipment data" },
      { name: "REST APIs", role: "Status updates and integrations" },
    ],
    decisions: [
      "Deployed to real users early — 200+ tickets processed since launch shaped the category set and workflows.",
    ],
    outcome: "Deployed and in active use — 200+ tickets processed.",
  },
  {
    slug: "autonomous-driving",
    title: "Autonomous Driving",
    oneLiner: bySlug["autonomous-driving"]?.oneLiner || "",
    techLine: "Python · TensorFlow/PyTorch · OpenCV · pandas",
    screenshot: "/project/Autonomous Driving.png",
    github: bySlug["autonomous-driving"]?.links.github,
    problem:
      "Two sides of one question: can a model reliably detect vehicles in road imagery, and what do real autopilot-involved fatalities say about where these systems fail?",
    approach:
      "A CNN-based detector that classifies and localizes vehicles, paired with a data-science investigation of the Tesla-Deaths dataset — cleaning, EDA across year, country, and model, and analysis of verified autopilot-involved fatalities.",
    stack: [
      { name: "TensorFlow / PyTorch", role: "CNN vehicle detection and localization" },
      { name: "OpenCV", role: "Image pipeline" },
      { name: "pandas", role: "Tesla-Deaths dataset cleaning and EDA" },
    ],
    decisions: [
      "Paired the build with the failure analysis — the dataset work grounds the detector in why detection reliability matters.",
    ],
    outcome: "IIT-Kanpur capstone.",
  },
  {
    slug: "preserving-heritage",
    title: "Preserving Heritage",
    oneLiner: bySlug["preserving-heritage"]?.oneLiner || "",
    techLine: "Python · TensorFlow · OpenCV · pandas",
    screenshot: "/project/Preserving Heritage.png",
    github: bySlug["preserving-heritage"]?.links.github,
    problem:
      "Classifying 11 categories of historical architecture from photos, and recommending tourism destinations — with a training set too small to train from scratch.",
    approach:
      "Transfer learning on a pretrained CNN backbone, trained with and without augmentation and monitored for overfitting, plus a collaborative-filtering engine recommending Indonesian destinations from a tourist's location.",
    stack: [
      { name: "TensorFlow", role: "Transfer-learning classifier over 11 architecture categories" },
      { name: "pandas", role: "Collaborative-filtering recommendation engine" },
    ],
    decisions: [
      "Ran augmented vs. non-augmented training as a controlled comparison rather than assuming augmentation helps.",
    ],
    outcome: "IIT-Kanpur capstone.",
  },
  {
    slug: "sales-forecasting",
    title: "Sales Forecasting",
    oneLiner: bySlug["sales-forecasting"]?.oneLiner || "",
    techLine: "Python · scikit-learn · XGBoost · pandas",
    screenshot: "/project/Sales Forecasting.png",
    github: bySlug["sales-forecasting"]?.links.github,
    problem:
      "Item-level demand across a multi-restaurant chain — order too little and shelves run empty, too much and it's waste.",
    approach:
      "Merged sales, item, and store data, engineered temporal features, then compared Linear Regression, Random Forest, and XGBoost scored by RMSE on a held-out six months to produce a next-year forecast.",
    stack: [
      { name: "XGBoost", role: "Best-scoring forecast model" },
      { name: "scikit-learn", role: "Baselines and evaluation harness" },
      { name: "pandas", role: "Feature engineering across sales/item/store joins" },
    ],
    decisions: [
      "Models compete on held-out RMSE — no model is trusted by default.",
      "Temporal features engineered explicitly rather than relying on raw dates.",
    ],
    outcome: "IIT-Kanpur capstone.",
  }
];

export const getProjectCase = (slug: string) =>
  projectCases.find((p) => p.slug === slug);
