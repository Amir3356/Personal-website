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
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "X / Twitter", href: "https://x.com/" },
  ],
};

export const hero = {
  headingStart: "Building performant and ",
  headingHighlight: "scalable products.",
  intro:
    "Hi, I'm Abdisa Ketema, a full-stack developer focused on React, Next.js, TypeScript and Expo. I build scalable, high-performance products with clean code and great user experience.",
  /** Drop your CV file at client/public/cv.pdf (or change this path). */
  cvUrl: "/cv.pdf",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Project", href: "#work" },
  { label: "Experiences", href: "#journey" },
  { label: "Techstack", href: "#skills" },
  { label: "Approach", href: "#approach" },
  { label: "Contact Us", href: "#contact" },
];

export const about = {
  title: "Coding with purpose, teaching with passion.",
  paragraphs: [
    "I'm a skilled and passionate full-stack developer who helps businesses get a fresh, creative start through well-built web applications. I'm detail-oriented, committed, and strong in problem-solving, time management, and organization.",
    "I've developed and deployed real-world web applications using clean coding principles and test-driven development. Beyond development, I teach programming on the @ethiopandatech and @tntethiopia YouTube channels.",
  ],
  quote:
    "I aim to build products that feel good to use, scale reliably, and remain enjoyable to maintain as they grow",
  values: [
    {
      icon: "</>",
      title: "Clean Code",
      description:
        "I write clean, maintainable code that's easy to understand and extend.",
    },
    {
      icon: "⚡",
      title: "Performance",
      description:
        "Performance-first development to ensure fast load times and smooth UX.",
    },
    {
      icon: "◎",
      title: "Collaboration",
      description:
        "Strong communicator who works well with teams and stakeholders.",
    },
    {
      icon: "✦",
      title: "Innovation",
      description:
        "Always exploring new technologies to build better and smarter solutions.",
    },
  ],
};

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
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux / Zustand"],
  },
  {
    title: "Creative / 3D",
    icon: "◉",
    skills: ["Three.js", "GSAP", "WebGL / GLSL", "React Three Fiber", "Framer Motion"],
  },
  {
    title: "Backend",
    icon: "◆",
    skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST / GraphQL"],
  },
  {
    title: "Tools & Craft",
    icon: "◇",
    skills: ["Git / CI-CD", "Docker", "Figma", "Performance Tuning", "Testing"],
  },
];

export const projects = [
  {
    index: "01",
    title: "School Voting System",
    description:
      "A secure school election platform with candidate management, one-vote-per-student integrity and instant, transparent result tallies.",
    tags: ["Laravel", "PHP", "JavaScript"],
    category: "EdTech",
    image: "/images/projects/school-voting-system.jpg",
    gradient: "from-violet-600/60 via-fuchsia-500/40 to-cyan-400/50",
    href: "https://github.com/Amir3356/School-Voting-System",
  },
  {
    index: "02",
    title: "Garage Management System",
    description:
      "End-to-end garage workflow tool — vehicle intake, job cards, mechanic assignment, inventory and billing in one dashboard.",
    tags: ["Laravel", "JavaScript", "PHP"],
    category: "Automotive",
    image: "/images/projects/garage-management-system.jpg",
    gradient: "from-cyan-500/60 via-sky-500/40 to-violet-500/50",
    href: "https://github.com/Amir3356/Garage-Management-System",
  },
  {
    index: "03",
    title: "Pharmacy Management System",
    description:
      "Pharmacy operations suite covering medicine stock, expiry tracking, sales and supplier management with clear reporting.",
    tags: ["Laravel", "Blade", "JavaScript"],
    category: "Healthcare",
    image: "/images/projects/pharmacy-management-system.jpg",
    gradient: "from-fuchsia-600/60 via-violet-500/40 to-indigo-400/50",
    href: "https://github.com/Amir3356/pharmacy-management-system",
  },
  {
    index: "04",
    title: "Restaurant Management System",
    description:
      "Full restaurant toolkit — menu management, table orders, kitchen coordination and billing built for busy service hours.",
    tags: ["PHP", "JavaScript", "CSS"],
    category: "Food & Dining",
    image: "/images/projects/restaurant-management-system.png",
    gradient: "from-indigo-500/60 via-blue-500/40 to-emerald-400/50",
    href: "https://github.com/Amir3356/Restaurant-Management-System",
  },
  {
    index: "05",
    title: "Job Portal System",
    description:
      "A modern job marketplace connecting employers and candidates with postings, applications and profile management.",
    tags: ["Full-Stack", "Web App"],
    category: "Careers",
    image: "",
    gradient: "from-violet-600/60 via-indigo-500/40 to-cyan-400/50",
    href: "https://github.com/Amir3356",
  },
];

export const approach = [
  {
    step: "01",
    title: "Discover",
    description:
      "Deep-dive into your goals, audience and constraints. Strategy before pixels — every decision traces back to a purpose.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Prototype the look, motion and feel. Interaction concepts are tested early so the vision is validated before a line of production code.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Engineered with clean architecture, 60fps animation budgets and accessibility baked in — never bolted on.",
  },
  {
    step: "04",
    title: "Ship & Refine",
    description:
      "Launch, measure, iterate. Performance audits and real-user feedback drive continuous polish after release.",
  },
];

export const experience = [
  {
    period: "2024 — Present",
    role: "Creative Developer",
    company: "BetwoTech",
    description:
      "Leading interactive frontend work — 3D product experiences, design systems and motion language across client projects.",
  },
  {
    period: "2022 — 2024",
    role: "Full-Stack Developer",
    company: "Freelance",
    description:
      "Shipped 20+ products end-to-end for startups: from database schema to shader — owning performance, DX and polish.",
  },
  {
    period: "2021 — 2022",
    role: "Frontend Developer",
    company: "Early Career",
    description:
      "Cut my teeth building production React apps, falling in love with animation and the craft of interface engineering.",
  },
];
