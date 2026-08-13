/**
 * Central content file — edit everything about the portfolio here.
 */

export const site = {
  name: "Amir",
  fullName: "Abdisa Ketema",
  role: "Full-Stack Developer",
  tagline: "I craft immersive digital experiences where design, code and motion meet.",
  email: "amir@betwotech.com",
  company: "BetwoTech",
  availability: "Available for freelance & collaborations",
  socials: [
    { label: "GitHub", href: "https://github.com/Amir3356" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/amir-siraj-7a304b329/" },
    { label: "Email", href: "mailto:amirsiraj1995@gmail.com" },
    { label: "Telegram", href: "https://t.me/AEHJSS" },
  ],
};

export const hero = {
  headingStart: "Building Performance and ",
  /** Rotated by the typewriter effect in the hero heading */
  headingHighlights: ["scalable products", "secure products"],
  intro:
    "Hi, I'm Amir Siraj, a full-stack developer who transforms ideas into powerful and scalable software solutions. I focus on building high-quality applications with clean code, strong performance, and intuitive user experiences.",
  /** Drop your CV file at client/public/cv.pdf (or change this path). */
  cvUrl: "/cv.pdf",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Project", href: "#work" },
  { label: "Experiences", href: "#journey" },
  { label: "Techstack", href: "#skills" },
  { label: "Contact Us", href: "#contact" },
];

export const about = {};

export const marqueeWords = [
  "WebGL",
  "GSAP",
  "Three.js",
  "React",
  "Next.js",
  "TypeScript",
  "Creative Coding",
  "Motion Design",
  "Node.js",
  "Shaders",
];

export const skillGroups = [
  {
    title: "Frontend",
    icon: "◈",
    skills: ["React (Vite)", "React Native (Expo)", "Next.js"],
  },
  {
    title: "Backend Development",
    icon: "◆",
    skills: ["Express.js", "Laravel", "REST API", "WebSocket"],
  },
  {
    title: "Databases, Caching & Queues",
    icon: "▤",
    skills: ["PostgreSQL", "MongoDB", "Redis"],
  },
  {
    title: "Object Storage",
    icon: "▣",
    skills: ["MinIO", "Amazon S3"],
  },
  {
    title: "DevOps & Infrastructure",
    icon: "◉",
    skills: ["Docker", "Nginx", "Linux"],
  },
  {
    title: "Version Control & Collaboration",
    icon: "◇",
    skills: ["GitHub"],
  },
];

export const projects = [
  {
    index: "01",
    title: "Pharmacy Management System",
    description:
      "Pharmacy operations suite covering medicine stock, expiry tracking, sales and supplier management with clear reporting.",
    tags: [
      "Next.js",
      "Laravel",
      "REST API",
      "Nginx",
      "PostgreSQL",
      "Redis",
      "Amazon S3",
      "Docker",
    ],
    image: "/images/projects/pharmacy-management-system.jpg",
    gradient: "from-fuchsia-600/60 via-violet-500/40 to-indigo-400/50",
    href: "https://github.com/Amir3356/pharmacy-management-system",
  },
  {
    index: "02",
    title: "Garage Management System",
    description:
      "Workshop operations platform handling vehicle intake, job cards, spare-part inventory, mechanic assignment and invoicing.",
    tags: ["Laravel", "REST API", "PostgreSQL", "Docker"],
    image: "/images/projects/garage-management-system.jpg",
    gradient: "from-cyan-500/60 via-sky-500/40 to-indigo-400/50",
    href: "https://github.com/Amir3356/garage-management-system",
  },
  {
    index: "03",
    title: "Restaurant Management System",
    description:
      "Restaurant suite covering menu management, table orders, kitchen tickets, billing and daily sales reporting.",
    tags: ["Laravel", "REST API", "PostgreSQL", "Docker"],
    image: "/images/projects/restaurant-management-system.png",
    gradient: "from-amber-500/60 via-orange-500/40 to-rose-400/50",
    href: "https://github.com/Amir3356/restaurant-management-system",
  },
];



/**
 * `kind` picks the node icon on the timeline ("work" | "education").
 * `tags` render as chips under each card — optional.
 */
export const experience = [
  {
    period: "Summer 2026",
    role: "Contributor",
    company: "Betwo Tech PLC",
    kind: "work",
    description:
      "Contributed to the Paxpia social media app and E-learning platform — built the Admin Dashboard. Tech Stack: React, Golang, PostgreSQL, Docker, MinIO, Nginx (API Gateway, Reverse Proxy, Caching), Redis (Caching, Session, Queues), Microservices Architecture, REST API, WebSocket API.",
    tags: [],
  },
  {
    period: "2026 · 1 month",
    role: "Frontend Web Developer",
    company: "Yanol Tech PLC",
    kind: "work",
    description:
      "Built modern, responsive user interfaces — translating designs into clean, reusable components with attention to detail and performance.",
    tags: [],
  },
  {
    period: "2026 · 2 months",
    role: "Full-Stack Web Developer",
    company: "Arriva System Solution PLC",
    kind: "work",
    description:
      "Worked across the stack — implementing features from database to UI and strengthening my skills in building complete, production-ready web applications.",
    tags: [],
  },
];
