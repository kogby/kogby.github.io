import career from "@/data/career.json";
import courseworkData from "@/data/coursework.json";
import { regionOf } from "@/lib/venn";

// ── Central source of truth ──────────────────────────────────────────────
// data/career.json is the single source of truth, shared by this website and
// the Resume-SWE submodule. The exports below derive the website-facing shapes
// from it; edit career.json, not these.

export type Bullet = { text: string; tags: string[]; priority: string };
export type ExperienceFull = (typeof career.experiences)[number];
export type ProjectFull = (typeof career.projects)[number];

// Order bullets high-priority first (stable), so components can show the strongest first.
const byPriority = (bullets: Bullet[]): Bullet[] =>
  [...bullets].sort(
    (a, b) => (a.priority === "high" ? 0 : 1) - (b.priority === "high" ? 0 : 1)
  );

// Rich entries (bullets + domains + tech) — for resume selection / future use
export const experiencesFull = career.experiences;
export const projectsFull = career.projects;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// "May 2026 - Present" → sortable month number. Parsed by hand: Date("May 2026") is not
// portable (Safari), and this module runs on both server and client.
const startKey = (period: string) => {
  const [m, y] = period.split(" - ")[0].split(" ");
  return Number(y) * 12 + MONTHS.indexOf(m);
};

// Website shape, newest first
export const experiences = career.experiences
  .map((e) => ({
    id: e.id,
    slug: e.slug,
    role: e.role,
    company: e.org,
    period: e.period,
    description: e.summary,
    category: e.category,
    logoUrl: e.logoUrl,
    bullets: byPriority(e.bullets),
    region: regionOf(e.domains),
  }))
  .sort((a, b) => startKey(b.period) - startKey(a.period));

export const projects = career.projects.map((p) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  summary: p.summary,
  tags: p.tech,
  description: p.bullets.map((b) => b.text).join(" "),
  bullets: byPriority(p.bullets),
  link: p.link,
  metrics: p.metrics,
  region: regionOf(p.domains),
}));

// Coursework grouped into themes, ordered by importance. Website-only (not in
// the resume-facing career.json). Each course carries its school so CMU slots
// in later by adding entries.
export type CourseworkTheme = (typeof courseworkData.coursework)[number];
export const coursework = courseworkData.coursework;

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

export type Writing = {
  title: string;
  date: string; // "2026-10"
  platform: "Substack" | "Medium";
  url: string;
  blurb: string;
};

// Newest first. Posts live on Substack / Medium; the site only keeps the index.
export const writings: Writing[] = [];

export const writingProfiles = [{ name: "Medium", href: "https://medium.com/@kogby0507" }];

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
    imageUrl: "/studying/cmu15445.png",

    link: "https://15445.courses.cs.cmu.edu/",
  },
];
