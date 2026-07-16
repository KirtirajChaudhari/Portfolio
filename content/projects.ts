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
    oneLiner: "Ayurvedic Clinical Diet Intelligence Platform",
    techLine: "React · Django · MongoDB",
    screenshot: "",
    github: bySlug.rasacare?.links.github,
    live: "https://rasacare.app",
    problem:
      "Ayurvedic diet prescription depends on a practitioner holding thousands of herb, food, and recipe interactions in memory — across a patient's constitution (Prakriti), active conditions, and classical preparation rules. That's hard to apply consistently and even harder to audit or hand off between practitioners.",
    approach:
      "RasaCare encodes Ayurvedic nutritional knowledge — 700 herbs and 741 recipes, along with Rasa (taste), Guna (quality), Virya (potency), and Vipaka (post-digestive effect) properties — into a structured knowledge graph of over 25,000 triples. A diet-generation engine reasons over that graph alongside a patient's Prakriti profile (Vata/Pitta/Kapha), active clinical conditions (10 supported), symptoms, and history to produce a ranked, condition-aware diet prescription, reporting 89.1% overall clinical accuracy. Two role-based portals split the workflow: doctors link patients, run Prakriti assessments, align conditions, and generate and prescribe diet charts; patients view their approved chart and download it as a PDF once the practitioner signs off.",
    stack: [
      { name: "React", role: "Doctor and patient portals" },
      { name: "Django", role: "Diet-generation engine, assessments, and prescription workflow" },
      { name: "MongoDB", role: "Knowledge graph (25K+ triples) and patient records" },
    ],
    decisions: [
      "Classical Ayurvedic properties (Rasa, Guna, Virya, Vipaka) encoded as first-class graph data, not free text.",
      "Doctor sign-off gates every patient-visible prescription — the engine proposes, the practitioner decides.",
      "HIPAA-aligned controls from the start: live audit logging, role-based access, minimum-necessary-access enforcement, a 15-minute inactivity timeout, and encrypted transit.",
    ],
    outcome: "5th place, hackathon finals · 89.1% overall clinical accuracy · live at rasacare.app",
  },
  {
    slug: "drishtimanas",
    title: "DrishtiManas",
    oneLiner: "AI-Driven Ocular Disease Screening Platform",
    techLine: "PyTorch · DenseNet121 · FastAPI · React · PostgreSQL",
    screenshot: "",
    github: "https://github.com/KirtirajChaudhari/DrishtiManas",
    problem:
      "Diseases such as diabetic retinopathy, glaucoma, and cataracts are leading causes of preventable blindness, but diagnosis still depends on manual fundus-image review by ophthalmologists — a role in chronic global shortage. Screening is slow, repetitive, and subject to fatigue-driven inconsistency, which delays detection precisely when early detection matters most.",
    approach:
      "Two pieces, now integrated into one platform. The research core: an 8-class multi-label classifier (a single eye can present several conditions at once) trained on the ODIR-5K dataset expanded to 37,649 fundus images — two-phase transfer learning on an ImageNet-pretrained DenseNet121, with per-class probability thresholds computed from precision-recall curves. It reached a 0.81 weighted F1 on a ~7,530-image test set (0.91 on cataract), after an exploratory EfficientNetB0 baseline hit 75.1% single-label accuracy. The platform: a React + Vite + Tailwind SPA over a FastAPI backend (async SQLAlchemy, Pydantic v2) and PostgreSQL, Dockerized end-to-end, with three role-based personas — technician upload wizard with image-quality checks, doctor worklist with Grad-CAM heatmap review, and admin audit/model-version governance. The trained DenseNet121 checkpoint serves as the production backbone, with Grad-CAM explainability shipping alongside every prediction.",
    stack: [
      { name: "DenseNet121", role: "8-class multi-label classifier — 0.81 weighted F1 (test), per-class threshold tuning" },
      { name: "PyTorch + Grad-CAM", role: "Training and visual explanations shipped with every prediction" },
      { name: "FastAPI", role: "Async backend (SQLAlchemy, Pydantic v2) behind role-based workflows" },
      { name: "React + Vite + Tailwind", role: "Technician, doctor, and admin portals" },
      { name: "PostgreSQL + Docker Compose", role: "Data layer and end-to-end containerization" },
    ],
    decisions: [
      "Multi-label over single-label — real patients present co-occurring conditions, so sigmoid heads with per-class thresholds beat a flat softmax.",
      "Image-quality auditing before training: blur detection flagged ~14.5% of images during data cleaning.",
      "Explainability is a feature, not a debug view — every prediction ships with its Grad-CAM justification.",
      "Platform and model research kept separable: the inference backbone is swappable, tracked in the project roadmap.",
    ],
    outcome: "0.81 weighted F1 on ~7,530 test images · full role-based platform shipped",
  },
  {
    slug: "pravaas",
    title: "PRAVAAS",
    oneLiner: "AI Railway Track Safety System",
    techLine: "Python · YOLO11s · Ultralytics · OpenCV · Streamlit",
    screenshot: "",
    github: "https://github.com/KirtirajChaudhari/RailwayObjectDetectionProject",
    extraLinks: [
      { label: "Rail-Defect Repo", href: "https://github.com/pradeepxkumar/Rail-defect-detection" },
    ],
    problem:
      "Two distinct hazards threaten railway track safety: unauthorized objects or beings on the track — animals, people, debris, fallen trees — and physical defects in the rail surface itself, like cracks, wear, and joint failures. Both are traditionally caught through manual patrols and visual inspection, which cannot scale across thousands of kilometres of track and are prone to human fatigue.",
    approach:
      "PRAVAAS pairs two YOLO-based systems into one safety pipeline, both deployable as lightweight local inference apps rather than cloud services. The obstacle detector (my build): a YOLO11s model trained on a custom-annotated railway-track set covering six classes — Animal, Debris, Human, Object, Stone, Tree — for 40 epochs at 640px on a Tesla T4, packaged as a portable checkpoint for image, video, or live USB-camera inference. It's honestly a proof-of-concept pipeline (41 annotated images so far) demonstrating the full dataset → training → deployable-weights workflow. The rail-surface defect module: a YOLOv8-nano model trained on public Kaggle/Roboflow railway-fault datasets inside a Streamlit app with batch upload, session caching, an accuracy-validation calculator, and a detection summary table — built by a team from Gati Shakti Vishwavidyalaya, Vadodara, and integrated here as PRAVAAS's companion defect-detection component.",
    stack: [
      { name: "YOLO11s", role: "Track obstacle detection across 6 custom-annotated classes (own build)" },
      { name: "YOLOv8-nano", role: "Rail-surface defect detection (Gati Shakti Vishwavidyalaya team's module)" },
      { name: "Ultralytics + PyTorch/CUDA", role: "Training pipeline — 40 epochs, 640px, Tesla T4" },
      { name: "Streamlit + OpenCV", role: "Batch-upload defect app with caching and summary tables" },
    ],
    decisions: [
      "Framed as a proof-of-concept pipeline, not a production-accuracy claim — the obstacle dataset is deliberately small while the workflow is proven end-to-end.",
      "Both models deploy as local lightweight inference, matching how trackside hardware actually gets used.",
      "Six obstacle classes chosen from what actually ends up on Indian tracks, not generic COCO labels.",
    ],
    outcome: "Working two-model safety prototype — obstacle detection + rail-defect detection.",
  },
  {
    slug: "bhojansetu",
    title: "BhojanSetu",
    oneLiner: "Role-Based Point-of-Sale for Indian Restaurants",
    techLine: "Django 5.2 · DRF · React 18 · ReportLab",
    screenshot: "",
    github: "https://github.com/KirtirajChaudhari/BhojanSetu",
    problem:
      "Coordinating orders across waitstaff, kitchen, and front-desk billing in a busy restaurant is error-prone on paper or across disconnected tools — orders get miscommunicated, table status goes stale, and billing becomes a manual reconciliation task.",
    approach:
      "Three role-scoped portals share one backend: a Waiter portal for creating and editing orders against a categorized menu of 50+ Indian dishes (with vegetarian/vegan and spice-level indicators); a Kitchen portal showing a live order queue with preparation-status updates; and a Reception portal with real-time table-occupancy stats, an active-vs-closed order breakdown, and PDF bill generation with a preview step before a table closes out. Django REST Framework with token auth and a custom User model carries Waiter/Chef/Reception roles; invoices are generated server-side with ReportLab; the React frontend polls for near-real-time kitchen and reception updates. Ships with Docker Compose and a seed command that loads sample users and the full menu for demos.",
    stack: [
      { name: "Django 5.2 + DRF", role: "Role-based API with token authentication and custom User model" },
      { name: "React 18", role: "Waiter, Kitchen, and Reception portals with polling updates" },
      { name: "ReportLab", role: "Server-side PDF bill generation with preview" },
      { name: "Docker Compose", role: "One-command dev/demo environment with database seeding" },
    ],
    decisions: [
      "Roles enforced in the data model, not just the UI — a custom User model gates every endpoint.",
      "Bill preview before table close-out, because billing mistakes are the costliest failure in a POS.",
      "Demo-ready by design: a management command seeds users and the full 50-dish menu.",
    ],
    outcome: "Complete three-portal POS — order lifecycle from table to kitchen to printed bill.",
  },
  {
    slug: "id-boundary",
    title: "RefurbEdge",
    oneLiner: "ID Card Segmentation & Rectification",
    techLine: "PyTorch · U-Net · DeepLabV3+ · Shapely",
    screenshot: "",
    github: "https://github.com/KirtirajChaudhari/IdBoundaryDetection",
    problem:
      "Document-verification and KYC pipelines need a clean, standardized, top-down crop of an ID card — but real photos come in at angles, under inconsistent lighting, against cluttered backgrounds. Built under a deliberate, self-imposed constraint: no YOLO, no SAM, no heuristic-only OpenCV shortcuts — a from-first-principles computer-vision pipeline.",
    approach:
      "Two comparable solutions. Approach A (primary): a U-Net with a ResNet-18 encoder segments the card from the background; the largest region's polygon reduces to a minimum rotated rectangle (Shapely) to estimate the four corners, and a projective transform warps the card into a standardized top-down crop — segment first, then simple geometry, more stable and explainable than regressing corners directly. Approach B: a DeepLabV3+ with a ResNet-34 encoder for cleaner boundary quality on noisier images. Both support mixed-precision GPU training, merge datasets across annotation formats (masks, MIDV-500 JSON quadrilaterals, COCO), and are evaluated with IoU, Dice, and Normalized Corner Distance — all tuned to train on a 4GB GTX 1650, a real hardware constraint.",
    stack: [
      { name: "U-Net (ResNet-18)", role: "Primary binary segmentation → geometry → projective rectification" },
      { name: "DeepLabV3+ (ResNet-34)", role: "Alternative semantic segmentation for noisy images" },
      { name: "Shapely + scikit-image", role: "Minimum rotated rectangle corner estimation and warping" },
      { name: "PyTorch + AMP + Albumentations", role: "Mixed-precision training with heavy augmentation" },
    ],
    decisions: [
      "Segment-then-geometry over corner regression — every intermediate step is inspectable and explainable.",
      "Two full pipelines built for honest comparison, scored on IoU, Dice, and Normalized Corner Distance.",
      "Tuned for a 4GB consumer GPU rather than assuming cloud hardware.",
    ],
    outcome: "Two working, explainable rectification pipelines built without YOLO or SAM.",
  },
  {
    slug: "lab-complaint",
    title: "Lab Complaint Management System",
    oneLiner: bySlug["lab-complaint"].oneLiner,
    techLine: "Django · MySQL · REST APIs",
    screenshot: "",
    github: bySlug["lab-complaint"].links.github,
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
    oneLiner: bySlug["autonomous-driving"].oneLiner,
    techLine: "Python · TensorFlow/PyTorch · OpenCV · pandas",
    screenshot: "",
    github: bySlug["autonomous-driving"].links.github,
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
    oneLiner: bySlug["preserving-heritage"].oneLiner,
    techLine: "Python · TensorFlow · OpenCV · pandas",
    screenshot: "",
    github: bySlug["preserving-heritage"].links.github,
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
    oneLiner: bySlug["sales-forecasting"].oneLiner,
    techLine: "Python · scikit-learn · XGBoost · pandas",
    screenshot: "",
    github: bySlug["sales-forecasting"].links.github,
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
  },
];

export const getProjectCase = (slug: string) =>
  projectCases.find((p) => p.slug === slug);
