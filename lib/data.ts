import career from "@/data/career.json";

// ── Central source of truth ──────────────────────────────────────────────
// data/career.json is the single source of truth, shared by this website and
// the Resume-SWE submodule. The exports below derive the website-facing shapes
// from it; edit career.json, not these.

export type Bullet = { text: string; tags: string[]; priority: string };
export type ExperienceFull = (typeof career.experiences)[number];
export type ProjectFull = (typeof career.projects)[number];

// Rich entries (bullets + domains + tech) — for resume selection / future use
export const experiencesFull = career.experiences;
export const projectsFull = career.projects;

// Backward-compatible website shape (components keep working unchanged)
export const experiences = career.experiences.map((e) => ({
  id: e.id,
  role: e.role,
  company: e.org,
  period: e.period,
  description: e.summary,
  category: e.category,
  logoUrl: e.logoUrl,
}));

export const projects = career.projects.map((p) => ({
  id: p.id,
  title: p.title,
  summary: p.summary,
  tags: p.tech,
  description: p.bullets.map((b) => b.text).join(" "),
  link: p.link,
  metrics: p.metrics,
}));

export const skills = career.skills;

export type LifeListItem = {
  id: number;
  text: string;
  done?: boolean;
};

export const lifeList: LifeListItem[] = [
  { id: 1, text: "Watch a League of Legends World game" },
  { id: 2, text: "Get into one of my dream companies" },
  { id: 3, text: "Earn 1M (USD)" },
  { id: 4, text: "Have my own cafeteria" },
];

export const socialLinks = [
  { name: "Email", href: "mailto:chen.jerry.cj@gmail.com", icon: "mail" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/jerry-cj/", icon: "linkedin" },
  { name: "GitHub", href: "https://github.com/kogby", icon: "github" },
  { name: "Medium", href: "https://medium.com/@kogby0507", icon: "medium" },
  { name: "CV", href: "/resume_Jerry_Chen.pdf", icon: "file" },
];

export const studyingNow = [
  {
    id: 1,
    title: "Designing Data-Intensive Applications",
    type: "book" as const,
    author: "Martin Kleppmann",
    imageUrl: "/studying/ddia.jpg",
    link: "https://dataintensive.net/",
  },
  {
    id: 2,
    title: "CMU 15-445: Database Systems",
    type: "course" as const,
    author: "Andy Pavlo",
    imageUrl: "/studying/cmu15445.jpg",
    link: "https://15445.courses.cs.cmu.edu/",
  },
];

// Domain categories for the constellation graph
export const domains = career.domains;

// Projects with domain tags for constellation mapping
export const projectsWithDomains = career.projects.map((p) => ({
  id: p.id,
  title: p.title,
  summary: p.summary,
  tags: p.tech,
  domains: p.domains,
  description: p.bullets.map((b) => b.text).join(" "),
  link: p.link,
  metrics: p.metrics,
}));
