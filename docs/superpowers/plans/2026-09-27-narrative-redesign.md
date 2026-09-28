# Narrative Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the site into one long professional page anchored by a Systems × ML Venn map (ML Infra in the overlap), with a graph-paper background, and move Life List + a new Writings index into a quieter personal area.

**Architecture:** A pure `regionOf(domains)` rule in `lib/venn.ts` places every experience/project into one of three regions; `lib/data.ts` attaches that region, and both the Venn SVG and the grouped Projects list read it. The home page composes existing section components in order; old per-section routes are deleted. Personal pages live in an `app/(personal)` route group with a shared subnav.

**Tech Stack:** Next.js 16 (static export), React 19, Tailwind 4, framer-motion, Node 24 (runs `.ts` check script directly).

**Spec:** `docs/superpowers/specs/2026-09-27-narrative-redesign-design.md`

## Global Constraints

- Static export (`output: "export"`) must keep building; no server-only features.
- No new npm dependencies.
- Line-art style: outline-only circles, single-color lines, no fills/shadows on the Venn.
- `data/career.json` is shared with the resume: only fill the existing `logoUrl` field; never rename/remove fields.
- Region rule: `mlinfra` present, or ({backend, distributed} and {ds, mle}) → ML Infra; else {ds, mle} → ML; else Systems. `de` never pulls an item into the overlap.
- Systems sub-labels: `Distributed Systems · Cloud Infra · Data Engineering`; ML sub-labels: `Data Science · ML Engineering`.
- Summary copy = existing text only (Hero "Recent work spans…" paragraph + `Bio.tsx`), no new claims.
- Background glow hidden under `(hover: none)` and `prefers-reduced-motion: reduce`.

## Review Focus

- Nav link clicked from `/writings` → must land on the right home section, not stay on `/writings`.
- Venn dot clicked for an item far down the page → card scrolls to center and flashes after arriving (repeat clicks re-flash).
- Narrow phone width (~400px) → Venn text still legible, nav scrolls horizontally, no page-level horizontal scroll.
- Page scrolled by a non-multiple of 24px → glow grid must stay aligned with base grid (both `fixed`).
- Missing/corrupt logo file → initial-letter fallback, never a broken image icon.

Each is exercised in Task 9's screenshot/verification steps.

---

### Task 1: Region rule + check script

**Files:**
- Create: `lib/venn.ts`
- Create: `scripts/check-venn.ts`
- Modify: `tsconfig.json` (exclude `scripts`), `package.json` (add `check` script)

**Interfaces:**
- Produces: `type Region = "mlinfra" | "systems" | "ml"`, `regionOf(domains: string[]): Region`, `REGIONS: { id: Region; label: string }[]` (order: mlinfra, systems, ml).

- [ ] **Step 1: Write the check script (fails: module missing)**

```ts
// scripts/check-venn.ts
// Run: npm run check. Asserts every career.json item lands in the Venn region the spec expects.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { regionOf } from "../lib/venn.ts";

const career = JSON.parse(readFileSync(new URL("../data/career.json", import.meta.url), "utf8"));

const expected: Record<string, string> = {
  "amazon-swe": "mlinfra",
  "flashinfer-gpu-kernels": "mlinfra",
  "loadshift-scheduling": "mlinfra",
  "line-backend": "systems",
  "trend-micro-swe": "systems",
  "distributed-miner": "systems",
  "memory-allocator": "systems",
  "online-judge": "systems",
  "ntu-rating": "systems",
  "eva-air-mle": "ml",
  "data-quality-trust-ai": "ml",
  "cathay-ds": "ml",
  "ntu-productivity-lab": "ml",
  "ntu-decision-optimization-lab": "ml",
  "house-price-prediction": "ml",
};

const items = [
  ...career.experiences.filter((e: { category: string }) => e.category !== "Leadership"),
  ...career.projects,
];
for (const it of items) assert.equal(regionOf(it.domains), expected[it.slug], it.slug);
assert.equal(items.length, Object.keys(expected).length);

// Rule edges
assert.equal(regionOf(["de", "ds"]), "ml");
assert.equal(regionOf(["de"]), "systems");
assert.equal(regionOf(["backend", "mle"]), "mlinfra");
assert.equal(regionOf([]), "systems");

console.log(`venn ok: ${items.length} items`);
```

In `package.json` scripts add `"check": "node scripts/check-venn.ts"`. In `tsconfig.json` change `exclude` to `["node_modules", "career-ops", "resume-swe", "scripts"]` (the `.ts` import extension is Node-only).

- [ ] **Step 2: Run to confirm failure**

Run: `npm run check` → Expected: FAIL, cannot find module `lib/venn.ts`.

- [ ] **Step 3: Implement**

```ts
// lib/venn.ts
// Venn regions for the home-page map: Systems × ML, with ML Infra as the overlap.
// Derived from career.json `domains` so the resume data stays untouched.
export type Region = "mlinfra" | "systems" | "ml";

const SYSTEMS = ["backend", "distributed"]; // "de" alone never pulls an item into the overlap
const ML = ["ds", "mle"];

export function regionOf(domains: string[]): Region {
  const has = (set: string[]) => domains.some((d) => set.includes(d));
  if (domains.includes("mlinfra") || (has(SYSTEMS) && has(ML))) return "mlinfra";
  if (has(ML)) return "ml";
  return "systems";
}

export const REGIONS: { id: Region; label: string }[] = [
  { id: "mlinfra", label: "ML Infra" },
  { id: "systems", label: "Systems" },
  { id: "ml", label: "Machine Learning" },
];
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm run check` → Expected: `venn ok: 15 items`.

- [ ] **Step 5: Commit** — `git add lib/venn.ts scripts/check-venn.ts tsconfig.json package.json && git commit -m "feat: venn region rule with check script"`

---

### Task 2: Data shape

**Files:** Modify `lib/data.ts`

**Interfaces:**
- Consumes: `regionOf` from Task 1.
- Produces: `experiences[i]` gains `slug: string`, `region: Region`, sorted by start date desc; `projects[i]` gains `slug`, `region`; new `writings: Writing[]`, `writingProfiles: { name: string; href: string }[]`; `studyingNow[].imageUrl` filled in Task 8.

- [ ] **Step 1: Edit `lib/data.ts`**

Add at top: `import { regionOf } from "@/lib/venn";`

Add before `experiences`:

```ts
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// "May 2026 - Present" → sortable month number. Parsed by hand: Date("May 2026") is not
// portable (Safari), and this module runs on both server and client.
const startKey = (period: string) => {
  const [m, y] = period.split(" - ")[0].split(" ");
  return Number(y) * 12 + MONTHS.indexOf(m);
};
```

In the `experiences` map add `slug: e.slug,` and `region: regionOf(e.domains),`, then chain `.sort((a, b) => startKey(b.period) - startKey(a.period))`.
In the `projects` map add `slug: p.slug,` and `region: regionOf(p.domains),`.

Add after `socialLinks`:

```ts
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
```

- [ ] **Step 2: Verify** — `npx tsc --noEmit` → no errors. `npm run check` still passes.
- [ ] **Step 3: Commit** — `git commit -am "feat: region, slug and writings in site data"`

---

### Task 3: One-page structure, nav, summary; delete old routes

**Files:**
- Modify: `app/page.tsx`, `components/Navbar.tsx`, `components/Hero.tsx`, `components/Bio.tsx`, `app/layout.tsx` (html class), `app/globals.css` (scroll margin), `lib/data.ts` (drop `domains`, `projectsWithDomains`)
- Delete: `app/experience/`, `app/projects/`, `app/skills/`, `app/studying/`, `app/contact/`, `components/ProjectsView.tsx`, `components/ConstellationGraph.tsx`

**Interfaces:** Section ids used by nav and Venn: `about`, `map`, `experience`, `projects`, `skills`, `coursework`, `studying`, `contact`.

- [ ] **Step 1: `app/page.tsx`** (full replacement; `VennMap` import added in Task 5, leave the line out until then)

```tsx
import Hero from "@/components/Hero";
import Bio from "@/components/Bio";
import Experience from "@/components/Experience";
import ProjectList from "@/components/ProjectList";
import Skills from "@/components/Skills";
import CourseworkList from "@/components/CourseworkList";
import Studying from "@/components/Studying";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Bio />
      <Experience />
      <ProjectList />
      <Skills />
      <CourseworkList />
      <Studying />
      <Contact />
    </>
  );
}
```

- [ ] **Step 2: Navbar** — replace `navLinks` and the links container:

```tsx
const navLinks = [
  { name: "Experience", href: "/#experience" },
  { name: "Projects", href: "/#projects" },
  { name: "Skills", href: "/#skills" },
  { name: "Contact", href: "/#contact" },
];
```

```tsx
<div className="flex items-center gap-5 sm:gap-8 overflow-x-auto whitespace-nowrap">
  {navLinks.map((link) => (
    <Link key={link.name} href={link.href} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
      {link.name}
    </Link>
  ))}
  <span aria-hidden className="h-4 w-px shrink-0 bg-gray-300" />
  <Link href="/writings" className="text-lg text-gray-400 hover:text-black transition-colors" style={{ fontFamily: "var(--font-handwriting)" }}>
    personal
  </Link>
</div>
```

- [ ] **Step 3: Hero** — `id="home"` → `id="about"`; delete the "Recent work spans…" `motion.p` (moves to Bio); CTAs: `href="/projects"` → `href="#map"`, `href="/contact"` → `href="#contact"`.

- [ ] **Step 4: Bio** — insert as the second paragraph (existing copy, moved from Hero):

```tsx
<p>
  Recent work spans LLM inference serving, distributed systems, and cloud infrastructure.
  Currently researching production-scale job scheduling with the{" "}
  <span className="font-semibold text-black">CMU Parallel Data Lab</span> in collaboration with Uber.
</p>
```

- [ ] **Step 5: CSS + html** — `app/globals.css` append `section[id] { scroll-margin-top: 5rem; }`. `app/layout.tsx` html className → `"scroll-smooth motion-reduce:scroll-auto"`.

- [ ] **Step 6: Delete** — `git rm -r app/experience app/projects app/skills app/studying app/contact components/ProjectsView.tsx components/ConstellationGraph.tsx`; remove `domains` and `projectsWithDomains` exports from `lib/data.ts`.

- [ ] **Step 7: Verify** — `npm run build` succeeds; `out/` has no `experience/`, `projects/`, `skills/`, `studying/`, `contact/` dirs.
- [ ] **Step 8: Commit** — `git add -A app components lib && git commit -m "feat: single-page layout with anchor nav and personal link"`

---

### Task 4: Experience timeline + grouped Projects

**Files:** Modify `components/Experience.tsx`, `components/ProjectList.tsx`

**Interfaces:** Consumes `experiences[].slug/region/category`, `projects[].slug/region`, `REGIONS`. Produces DOM anchors `exp-<slug>` and `project-<slug>` (Task 5 targets these).

- [ ] **Step 1: Experience** — remove tabs state, `AnimatePresence`, tab buttons. Keep `CompanyLogo`, add grayscale to its `<img>`: `className="w-full h-full object-contain p-1.5 grayscale transition group-hover:grayscale-0"`. Body:

```tsx
const timeline = experiences.filter((e) => e.category !== "Leadership");
const leadership = experiences.filter((e) => e.category === "Leadership");
```

Header block = existing `motion.div` with h2 + bar (className `mb-16`). Timeline: existing row markup, but each row is

```tsx
<motion.div
  key={exp.id}
  id={`exp-${exp.slug}`}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="group grid grid-cols-[1fr] md:grid-cols-[150px_60px_1fr] gap-4 md:gap-8 border-b border-gray-100 pb-8 last:border-0"
>
  <div className="md:text-right">
    <p className="text-sm font-medium text-gray-500 font-mono tracking-tight">{exp.period}</p>
    <p className="text-xs text-gray-400 mt-1">{exp.category}</p>
  </div>
  {/* logo column + content column unchanged */}
</motion.div>
```

After the timeline:

```tsx
<h3 className="mt-16 mb-6 text-sm font-mono uppercase tracking-widest text-gray-500">Leadership</h3>
<ul className="space-y-4">
  {leadership.map((exp) => (
    <li key={exp.id} id={`exp-${exp.slug}`} className="group flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <CompanyLogo src={exp.logoUrl} name={exp.company} size="w-8 h-8" />
      <span className="font-medium text-black">{exp.company}</span>
      <span className="text-gray-500">· {exp.role}</span>
      <span className="ml-auto font-mono text-xs text-gray-400">{exp.period}</span>
    </li>
  ))}
</ul>
```

- [ ] **Step 2: ProjectList** — remove filter state/buttons, `AnimatePresence`, `layout`. Section className → `"py-20 border-t border-gray-200"`. Body:

```tsx
<div className="space-y-14">
  {REGIONS.map((r) => {
    const list = projects.filter((p) => p.region === r.id);
    return (
      list.length > 0 && (
        <div key={r.id}>
          <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-6">{r.label}</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {list.map((project) => (
              <motion.div
                key={project.id}
                id={`project-${project.slug}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-white p-8 border border-gray-200 hover:border-black/20 hover:shadow-xl transition-all duration-300 rounded-xl"
              >
                {/* existing card body: title + link, summary, bullets, tags */}
              </motion.div>
            ))}
          </div>
        </div>
      )
    );
  })}
</div>
```

- [ ] **Step 3: Verify** — `npm run build` passes; `grep -c 'id="project-' out/index.html` = 7 and `grep -c 'id="exp-' out/index.html` = 12.
- [ ] **Step 4: Commit** — `git commit -am "feat: merged experience timeline, projects grouped by region"`

---

### Task 5: Venn map

**Files:** Create `components/VennMap.tsx`; modify `app/page.tsx` (insert after `<Bio />`), `app/globals.css` (flash)

**Interfaces:** Consumes `experiences`, `projects`, `Region`, DOM anchors from Task 4. Section id `map`.

- [ ] **Step 1: CSS** — append to `app/globals.css`:

```css
/* Venn-map jump target: violet outline fades after the smooth scroll lands. */
@keyframes flash {
  from { outline-color: var(--accent-primary); }
  to { outline-color: transparent; }
}
.flash {
  outline: 2px solid transparent;
  outline-offset: 6px;
  border-radius: 0.75rem;
  animation: flash 1.2s ease-out 0.4s backwards;
}
```

- [ ] **Step 2: Component**

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Container from "./ui/Container";
import { experiences, projects } from "@/lib/data";
import type { Region } from "@/lib/venn";

// Two circles r=190, centers 180 apart; the lens between them is ML Infra.
const R = 190;
const CY = 245;
const LX = 310;
const RX = 490;
const HALF = Math.sqrt(R * R - ((RX - LX) / 2) ** 2);
const LENS = `M 400 ${CY - HALF} A ${R} ${R} 0 0 1 400 ${CY + HALF} A ${R} ${R} 0 0 1 400 ${CY - HALF} Z`;

// Each region's dots stack in one column around COL_Y, zigzagging slightly.
const COL_X: Record<Region, number> = { systems: 225, mlinfra: 400, ml: 575 };
const COL_Y = 305;
const GAP = 34;
const ACCENT = "var(--accent-primary)";

const SIDES = [
  { region: "systems" as const, x: 235, title: "Systems", sub: ["Distributed Systems", "Cloud Infra", "Data Engineering"] },
  { region: "ml" as const, x: 565, title: "Machine Learning", sub: ["Data Science", "ML Engineering"] },
];

type Dot = { key: string; anchor: string; label: string; kind: "project" | "experience"; region: Region };

const dots: Dot[] = [
  ...experiences
    .filter((e) => e.category !== "Leadership")
    .map((e) => ({ key: `e${e.id}`, anchor: `exp-${e.slug}`, label: `${e.company} · ${e.role}`, kind: "experience" as const, region: e.region })),
  ...projects.map((p) => ({ key: `p${p.id}`, anchor: `project-${p.slug}`, label: p.title, kind: "project" as const, region: p.region })),
];

const placed = dots.map((d) => {
  const col = dots.filter((o) => o.region === d.region);
  const i = col.indexOf(d);
  return { ...d, x: COL_X[d.region] + (i % 2 ? 12 : -12), y: COL_Y + (i - (col.length - 1) / 2) * GAP };
});

function jump(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  el.classList.remove("flash");
  void el.offsetWidth; // restart the animation on repeat clicks
  el.classList.add("flash");
}

export default function VennMap() {
  const [active, setActive] = useState<Region | null>(null);
  const [hovered, setHovered] = useState<Dot | null>(null);

  const lineColor = (r: Region) => (active === r ? ACCENT : "#111");
  const focus = (d: Dot | null) => {
    setHovered(d);
    setActive(d?.region ?? null);
  };

  return (
    <section id="map" className="py-20 border-t border-gray-200">
      <Container>
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Systems × ML</h2>
          <div className="h-1 w-20 bg-black"></div>
        </motion.div>

        <svg
          viewBox="110 40 580 410"
          className="w-full max-w-2xl mx-auto h-auto select-none"
          style={{ fontFamily: "var(--font-sans)" }}
          onPointerLeave={() => focus(null)}
          role="group"
          aria-label="Venn diagram of experiences and projects across Systems and Machine Learning"
        >
          {/* Hit areas: circles first, lens on top so the overlap wins. */}
          <circle cx={LX} cy={CY} r={R} fill="transparent" stroke={lineColor("systems")} strokeOpacity={0.7} strokeWidth={1.25} onPointerEnter={() => setActive("systems")} style={{ transition: "stroke .3s" }} />
          <circle cx={RX} cy={CY} r={R} fill="transparent" stroke={lineColor("ml")} strokeOpacity={0.7} strokeWidth={1.25} onPointerEnter={() => setActive("ml")} style={{ transition: "stroke .3s" }} />
          <path d={LENS} fill="transparent" stroke={active === "mlinfra" ? ACCENT : "none"} strokeWidth={1.25} onPointerEnter={() => setActive("mlinfra")} />

          {SIDES.map((s) => (
            <g key={s.region} pointerEvents="none">
              <text x={s.x} y={140} textAnchor="middle" fontSize={18} fontWeight={600} fill={active === s.region ? ACCENT : "#111"}>
                {s.title}
              </text>
              {s.sub.map((t, i) => (
                <text key={t} x={s.x} y={160 + i * 16} textAnchor="middle" fontSize={12} fill="#888">
                  {t}
                </text>
              ))}
            </g>
          ))}
          <text x={400} y={235} textAnchor="middle" fontSize={16} fontWeight={700} fill={ACCENT} pointerEvents="none">
            ML Infra
          </text>

          {placed.map((d) => {
            const lit = active === null || active === d.region;
            const color = active !== null && lit ? ACCENT : "#111";
            return (
              <a
                key={d.key}
                href={`#${d.anchor}`}
                aria-label={d.label}
                onClick={(e) => {
                  e.preventDefault();
                  jump(d.anchor);
                }}
                onPointerEnter={() => focus(d)}
                onFocus={() => focus(d)}
                onBlur={() => focus(null)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={d.x} cy={d.y} r={13} fill="transparent" />
                <circle
                  cx={d.x}
                  cy={d.y}
                  r={hovered?.key === d.key ? 8.5 : 7}
                  fill={d.kind === "project" ? color : "var(--background)"}
                  stroke={color}
                  strokeWidth={1.5}
                  opacity={lit ? 1 : 0.2}
                  style={{ transition: "all .3s" }}
                />
              </a>
            );
          })}
        </svg>

        <p className="mt-4 text-center text-sm text-gray-600 min-h-5">
          {hovered ? `${hovered.kind === "project" ? "●" : "○"} ${hovered.label}` : "Hover a dot to see what it is. Click to jump to it."}
        </p>
        <p className="mt-1 text-center text-xs text-gray-400">● project&nbsp;&nbsp;&nbsp;○ experience</p>
      </Container>
    </section>
  );
}
```

Note: dots are SVG `<a href="#…">` rather than `<button>` — focusable, keyboard-activatable, and still jump without JS.

- [ ] **Step 3: Page** — in `app/page.tsx` add `import VennMap from "@/components/VennMap";` and render `<VennMap />` after `<Bio />`.
- [ ] **Step 4: Verify** — `npm run build` passes; `grep -o 'href="#exp-[^"]*"\|href="#project-[^"]*"' out/index.html | sort -u | wc -l` = 15 and each target id exists (script in Task 9).
- [ ] **Step 5: Commit** — `git add components/VennMap.tsx app/page.tsx app/globals.css && git commit -m "feat: Systems x ML venn map replaces constellation"`

---

### Task 6: Graph-paper background with cursor glow

**Files:** Create `components/GridBackground.tsx`; modify `app/globals.css`, `app/layout.tsx`

- [ ] **Step 1: CSS** — in `:root` set `--background: #fafaf8;` and add `--grid-line: rgb(0 0 0 / 0.045);` `--grid-glow: rgb(76 29 149 / 0.28);`. Replace `body { background: var(--background); }` with:

```css
  background-color: var(--background);
  /* 1px lines, not a visual gradient. Fixed so the glow layer's grid stays aligned while scrolling. */
  background-image:
    linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
  background-size: 24px 24px;
  background-attachment: fixed;
```

Append:

```css
/* Same grid in violet, revealed only in a soft circle around the cursor (GridBackground.tsx). */
.grid-glow {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image:
    linear-gradient(to right, var(--grid-glow) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-glow) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: radial-gradient(circle 200px at var(--mx, -999px) var(--my, -999px), #000, transparent);
}
@media (hover: none), (prefers-reduced-motion: reduce) {
  .grid-glow { display: none; }
}
```

- [ ] **Step 2: Component**

```tsx
"use client";

import { useEffect } from "react";

// Feeds the cursor position to .grid-glow (globals.css) via CSS variables.
export default function GridBackground() {
  useEffect(() => {
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const s = document.documentElement.style;
        s.setProperty("--mx", `${e.clientX}px`);
        s.setProperty("--my", `${e.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div aria-hidden className="grid-glow" />;
}
```

- [ ] **Step 3: Layout** — import and render `<GridBackground />` as the first child of `<body>`.
- [ ] **Step 4: Verify** — `npm run build` passes; glow checked by CDP screenshot in Task 9.
- [ ] **Step 5: Commit** — `git add components/GridBackground.tsx app/globals.css app/layout.tsx && git commit -m "feat: graph-paper background with cursor glow"`

---

### Task 7: Personal area

**Files:** Create `app/(personal)/layout.tsx`, `app/(personal)/writings/page.tsx`; move `app/life/page.tsx` → `app/(personal)/life/page.tsx`

- [ ] **Step 1: Move** — `mkdir -p "app/(personal)" && git mv app/life "app/(personal)/life"`
- [ ] **Step 2: Layout**

```tsx
import Link from "next/link";
import Container from "@/components/ui/Container";

const links = [
  { name: "Writings", href: "/writings" },
  { name: "Life List", href: "/life" },
];

export default function PersonalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Container className="pt-10">
        <nav className="flex gap-6 text-xl text-gray-500" style={{ fontFamily: "var(--font-handwriting)" }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-black transition-colors">
              {l.name}
            </Link>
          ))}
        </nav>
      </Container>
      {children}
    </>
  );
}
```

- [ ] **Step 3: Writings page**

```tsx
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import { writings, writingProfiles } from "@/lib/data";

export const metadata: Metadata = { title: "Writings | kogby" };

const hand = { fontFamily: "var(--font-handwriting)" };

export default function WritingsPage() {
  return (
    <section className="py-16">
      <Container>
        <h1 className="text-5xl md:text-6xl tracking-tight mb-3" style={hand}>Writings</h1>
        <p className="text-xl text-gray-600 mb-12" style={hand}>notes on work, learning, and life ✎</p>

        {writings.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {writings.map((w) => (
              <li key={w.url}>
                <a href={w.url} target="_blank" rel="noopener noreferrer" className="group block py-6">
                  <p className="font-mono text-xs text-gray-400 mb-1">{w.date} · {w.platform}</p>
                  <h2 className="text-xl font-semibold group-hover:text-accent-primary transition-colors">{w.title} ↗</h2>
                  <p className="text-gray-600 mt-1">{w.blurb}</p>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-2xl text-gray-500" style={hand}>first post coming soon.</p>
        )}

        <p className="mt-12 text-sm text-gray-500">
          Also on{" "}
          {writingProfiles.map((p, i) => (
            <span key={p.name}>
              {i > 0 && " · "}
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-black">
                {p.name}
              </a>
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Verify** — `npm run build`; `out/writings/index.html` and `out/life/index.html` exist (or `writings.html`/`life.html`, whichever export style the repo uses).
- [ ] **Step 5: Commit** — `git add -A app && git commit -m "feat: personal area with writings index and life list"`

---

### Task 8: Logos and covers

**Files:** Add `public/logos/*.png`, `public/studying/*`; modify `data/career.json` (`logoUrl` only), `lib/data.ts` (`imageUrl`), `components/Studying.tsx` (course thumbnails `object-contain`)

- [ ] **Step 1: Fetch** — for each org try Google's favicon service first (square, fits the round frame), falling back to Wikimedia `Special:FilePath/<File>.svg?width=256`:

```bash
fav() { curl -sL "https://www.google.com/s2/favicons?domain=$1&sz=128" -o "public/logos/$2.png"; }
fav amazon.com amazon; fav evaair.com evaair; fav trendmicro.com trendmicro
fav cathayholdings.com cathay; fav ntu.edu.tw ntu; fav gdg.community.dev gdsc
curl -sL "https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg?default=false" -o public/studying/ddia.jpg
```

For 15-445 use the CMU Database Group logo (favicon of `db.cs.cmu.edu`, or the course site's image).

- [ ] **Step 2: Validate** — `file public/logos/* public/studying/*` must say PNG/JPEG (not HTML); `sips -g pixelWidth public/logos/*.png` ≥ 64px; view each with the image reader. Delete anything wrong-looking and leave that org on the initial fallback.
- [ ] **Step 3: Wire** — set `logoUrl` in `career.json` per slug: amazon-swe → `/logos/amazon.png`, eva-air-mle → `/logos/evaair.png`, trend-micro-swe → `/logos/trendmicro.png`, cathay-ds → `/logos/cathay.png`, ntu-productivity-lab / ntu-decision-optimization-lab / ntudac-* → `/logos/ntu.png`, ntu-gdsc-lead → `/logos/gdsc.png`. PDAO / Yilan / data-quality-trust-ai: org logo if found, else leave `""`. `studyingNow`: `imageUrl: "/studying/ddia.jpg"` and the 15-445 image path. In `Studying.tsx` img className → ``className={`w-full h-full ${item.type === "book" ? "object-cover" : "object-contain p-2 bg-white"}`}``.
- [ ] **Step 4: Verify** — `npm run build`; `npm run check` (career.json edit must not move regions).
- [ ] **Step 5: Commit** — `git add public data/career.json lib/data.ts components/Studying.tsx && git commit -m "feat: company logos and study covers"`

---

### Task 9: Verification, docs

**Files:** Modify `CLAUDE.md` (wishlist item 4 note). Scratch-only: CDP screenshot script.

- [ ] **Step 1: Static checks** — `npm run lint`, `npm run build`, `npm run check` all pass. Anchor integrity:

```bash
node -e 'const h=require("fs").readFileSync("out/index.html","utf8");const t=[...h.matchAll(/href="#((?:exp|project)-[^"]+)"/g)].map(m=>m[1]);const miss=t.filter(id=>!h.includes(`id="${id}"`));console.log(t.length,"targets, missing:",miss);process.exit(miss.length?1:0)'
```

- [ ] **Step 2: Screenshots** — serve `out/` (`python3 -m http.server 4173 -d out`, background), then a scratch Node CDP script (Node 24 global `WebSocket`) that launches headless Chrome with `--remote-debugging-port`, sets `Emulation.setDeviceMetricsOverride` (1440 and 400 wide), waits 2s for framer-motion, dispatches `Input.dispatchMouseEvent` at a point for the glow, and saves `Page.captureScreenshot` full-page. Check: Venn legible at 400px, no horizontal scroll (`document.documentElement.scrollWidth <= innerWidth`), glow visible and aligned after scrolling 37px, logos grayscale, `/writings` nav link → home section.
- [ ] **Step 3: CLAUDE.md** — append to wishlist item 4: `（2026-09-27 起改為 Systems × ML 文氏圖，見 docs/superpowers/specs/2026-09-27-narrative-redesign-design.md）`.
- [ ] **Step 4: Commit** — `git commit -am "docs: note venn map replaces constellation"`
