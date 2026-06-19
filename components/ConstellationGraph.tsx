"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "./ui/Container";
import { domains, projectsWithDomains } from "@/lib/data";

// Mirrors --accent-primary (Midnight Violet) from globals.css.
const ACCENT = "#4C1D95";

// Canvas. Wider than tall leaves room for outer labels without clipping.
const W = 1000;
const H = 820;
const CX = W / 2;
const CY = H / 2;
const DOMAIN_R = 190; // inner ring (domains)
const PROJECT_R = 330; // outer ring (projects)

const DEG = Math.PI / 180;

// Greedy word-wrap so long project titles render on multiple lines instead of
// overflowing the viewBox and getting clipped at the canvas edge.
function wrapLabel(text: string, max: number): string[] {
  const lines: string[] = [];
  let cur = "";
  for (const word of text.split(" ")) {
    if (!cur) cur = word;
    else if ((cur + " " + word).length <= max) cur += " " + word;
    else {
      lines.push(cur);
      cur = word;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export default function ConstellationGraph() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  // ── Inner ring: domains evenly spaced, starting at top ──────────────────
  const domainPos = useMemo(
    () =>
      domains.map((d, i) => {
        const angle = (i / domains.length) * Math.PI * 2 - Math.PI / 2;
        return {
          ...d,
          angle,
          x: CX + DOMAIN_R * Math.cos(angle),
          y: CY + DOMAIN_R * Math.sin(angle),
        };
      }),
    []
  );

  const domainById = useMemo(() => {
    const m = new Map<string, (typeof domainPos)[number]>();
    domainPos.forEach((d) => m.set(d.id, d));
    return m;
  }, [domainPos]);

  // ── Outer ring: each project sits in the average direction of its domains,
  // so its connecting threads stay short and the cluster reflects real focus.
  // Projects sharing an identical domain set land on the same angle, so we
  // fan exact ties apart deterministically (no overlap, no randomness).
  const projectPos = useMemo(() => {
    const withIdeal = projectsWithDomains.map((p) => {
      let sx = 0;
      let sy = 0;
      p.domains.forEach((id) => {
        const d = domainById.get(id);
        if (d) {
          sx += Math.cos(d.angle);
          sy += Math.sin(d.angle);
        }
      });
      const ideal = p.domains.length ? Math.atan2(sy, sx) : -Math.PI / 2;
      return { p, ideal };
    });

    const groups = new Map<number, typeof withIdeal>();
    withIdeal.forEach((w) => {
      const key = Math.round((w.ideal * 180) / Math.PI);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(w);
    });

    const out: ((typeof projectsWithDomains)[number] & {
      angle: number;
      x: number;
      y: number;
    })[] = [];
    groups.forEach((arr) => {
      const n = arr.length;
      arr.forEach((w, i) => {
        const angle = w.ideal + (i - (n - 1) / 2) * 15 * DEG;
        out.push({
          ...w.p,
          angle,
          x: CX + PROJECT_R * Math.cos(angle),
          y: CY + PROJECT_R * Math.sin(angle),
        });
      });
    });
    return out;
  }, [domainById]);

  // ── Project ↔ domain threads (the real connections) ─────────────────────
  const projEdges = useMemo(() => {
    const r: {
      projectId: number;
      domainId: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }[] = [];
    projectPos.forEach((p) =>
      p.domains.forEach((id) => {
        const d = domainById.get(id);
        if (d) r.push({ projectId: p.id, domainId: id, x1: p.x, y1: p.y, x2: d.x, y2: d.y });
      })
    );
    return r;
  }, [projectPos, domainById]);

  // ── Domain ↔ domain edges: only when two domains co-occur in a project ──
  const domEdges = useMemo(() => {
    const seen = new Set<string>();
    const r: { id1: string; id2: string; x1: number; y1: number; x2: number; y2: number }[] = [];
    projectsWithDomains.forEach((p) => {
      const ds = p.domains;
      for (let i = 0; i < ds.length; i++) {
        for (let j = i + 1; j < ds.length; j++) {
          const key = [ds[i], ds[j]].sort().join("-");
          if (seen.has(key)) continue;
          seen.add(key);
          const a = domainById.get(ds[i]);
          const b = domainById.get(ds[j]);
          if (a && b) r.push({ id1: ds[i], id2: ds[j], x1: a.x, y1: a.y, x2: b.x, y2: b.y });
        }
      }
    });
    return r;
  }, [domainById]);

  // ── Highlight state. Hover wins over click; both fall back to resting. ──
  const focusDomain = hoveredDomain ?? selectedDomain;
  const detail = selectedProject !== null ? projectPos.find((p) => p.id === selectedProject) ?? null : null;
  const anyActive = focusDomain !== null || selectedProject !== null;

  const edgeLit = (projectId: number, domainId: string) =>
    (focusDomain !== null && domainId === focusDomain) || selectedProject === projectId;
  const projectLit = (p: { id: number; domains: string[] }) =>
    (focusDomain !== null && p.domains.includes(focusDomain)) || selectedProject === p.id;
  const domainLit = (id: string) =>
    (focusDomain === null && selectedProject === null) ||
    id === focusDomain ||
    (detail?.domains.includes(id) ?? false);

  // Horizontal label placed just outside a node; flips side so it never overlaps.
  function outwardLabel(x: number, y: number, offset: number) {
    const dx = x - CX;
    const dy = y - CY;
    const dist = Math.hypot(dx, dy) || 1;
    return {
      lx: x + (dx / dist) * offset,
      ly: y + (dy / dist) * offset,
      anchor: (dx > 12 ? "start" : dx < -12 ? "end" : "middle") as "start" | "end" | "middle",
    };
  }

  return (
    <section id="projects-overview" className="pt-10 pb-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-4">Project Map</h2>
          <div className="h-1 w-20 bg-black"></div>
          <p className="text-sm text-gray-500 mt-4 max-w-xl">
            How my work connects across domains. Hover or tap a domain to trace its
            projects; tap a project node for details.
          </p>
        </motion.div>

        {/* Domain filter pills — explicit affordance, works on touch */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => {
              setSelectedDomain(null);
              setSelectedProject(null);
            }}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
              !selectedDomain
                ? "bg-black text-white shadow-md scale-105"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
            }`}
          >
            All
          </button>
          {domains.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDomain(selectedDomain === d.id ? null : d.id);
                setSelectedProject(null);
              }}
              onMouseEnter={() => setHoveredDomain(d.id)}
              onMouseLeave={() => setHoveredDomain(null)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                selectedDomain === d.id
                  ? "text-white shadow-md scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
              }`}
              style={selectedDomain === d.id ? { backgroundColor: ACCENT } : undefined}
            >
              {d.label}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-4xl mx-auto"
        >
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible" role="img" aria-label="Project domain map">
            {/* Faint orbit guides */}
            <circle cx={CX} cy={CY} r={DOMAIN_R} fill="none" stroke="#eee" strokeWidth={0.6} />
            <circle cx={CX} cy={CY} r={PROJECT_R} fill="none" stroke="#f1f1f1" strokeWidth={0.6} strokeDasharray="3 9" />

            {/* Domain ↔ domain web (real co-occurrence only) */}
            {domEdges.map((e, i) => {
              const lit = focusDomain === e.id1 || focusDomain === e.id2;
              return (
                <line
                  key={`de-${i}`}
                  x1={e.x1}
                  y1={e.y1}
                  x2={e.x2}
                  y2={e.y2}
                  stroke={lit ? ACCENT : "#d9d9d9"}
                  strokeWidth={lit ? 1.4 : 0.7}
                  opacity={anyActive && !lit ? 0.15 : 0.55}
                  style={{ transition: "all 0.35s ease" }}
                />
              );
            })}

            {/* Project ↔ domain threads — the constellation, visible at rest */}
            {projEdges.map((e, i) => {
              const lit = edgeLit(e.projectId, e.domainId);
              return (
                <line
                  key={`pe-${i}`}
                  x1={e.x1}
                  y1={e.y1}
                  x2={e.x2}
                  y2={e.y2}
                  stroke={lit ? ACCENT : "#cfcfcf"}
                  strokeWidth={lit ? 1.5 : 0.7}
                  opacity={!anyActive ? 0.3 : lit ? 0.7 : 0.08}
                  style={{ transition: "all 0.35s ease" }}
                />
              );
            })}

            {/* Domain nodes */}
            {domainPos.map((d) => {
              const lit = domainLit(d.id);
              const sel = d.id === selectedDomain;
              const { lx, ly, anchor } = outwardLabel(d.x, d.y, 26);
              return (
                <g
                  key={d.id}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredDomain(d.id)}
                  onMouseLeave={() => setHoveredDomain(null)}
                  onClick={() => {
                    setSelectedDomain(selectedDomain === d.id ? null : d.id);
                    setSelectedProject(null);
                  }}
                >
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r={15}
                    fill="white"
                    stroke={lit ? ACCENT : "#cfcfcf"}
                    strokeWidth={sel ? 2.5 : lit ? 1.6 : 1}
                    opacity={lit ? 1 : 0.4}
                    style={{ transition: "all 0.35s ease" }}
                  />
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r={4}
                    fill={lit ? ACCENT : "#bbb"}
                    opacity={lit ? 1 : 0.4}
                    style={{ transition: "all 0.35s ease" }}
                  />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={anchor}
                    dominantBaseline="central"
                    fontSize={14}
                    fontWeight={sel ? 700 : 600}
                    fill={lit ? "#111" : "#c4c4c4"}
                    style={{ transition: "fill 0.35s ease", fontFamily: "var(--font-sans)" }}
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}

            {/* Project nodes */}
            {projectPos.map((p) => {
              const lit = projectLit(p);
              const sel = selectedProject === p.id;
              const { lx, ly, anchor } = outwardLabel(p.x, p.y, 14);
              return (
                <g
                  key={p.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedProject(selectedProject === p.id ? null : p.id)}
                >
                  {sel && <circle cx={p.x} cy={p.y} r={12} fill="none" stroke={ACCENT} strokeWidth={1} opacity={0.4} />}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={sel ? 8 : 6}
                    fill={lit ? ACCENT : "#9a9a9a"}
                    opacity={!anyActive ? 0.85 : lit ? 1 : 0.25}
                    style={{ transition: "all 0.35s ease" }}
                  />
                  {(() => {
                    const lines = wrapLabel(p.title, 18);
                    const lh = 13;
                    const y0 = ly - ((lines.length - 1) * lh) / 2;
                    return (
                      <text
                        x={lx}
                        textAnchor={anchor}
                        fontSize={11}
                        fontWeight={sel ? 600 : 400}
                        fill={lit ? "#111" : "#bdbdbd"}
                        opacity={!anyActive ? 0.85 : lit ? 1 : 0.3}
                        style={{ transition: "all 0.35s ease", fontFamily: "var(--font-sans)" }}
                      >
                        {lines.map((line, li) => (
                          <tspan key={li} x={lx} y={y0 + li * lh}>
                            {line}
                          </tspan>
                        ))}
                      </text>
                    );
                  })()}
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Project detail card */}
        <AnimatePresence mode="wait">
          {detail && (
            <motion.div
              key={detail.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="max-w-2xl mx-auto mt-6 p-6 border border-gray-200 rounded-xl bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold">{detail.title}</h3>
                <a
                  href={detail.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${detail.title}`}
                  className="text-gray-400 hover:text-[#4C1D95] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{detail.summary}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {detail.tags.map((tag) => (
                  <span key={tag} className="text-xs font-semibold px-2 py-1 bg-gray-50 text-gray-600 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {detail.domains.map((dId) => (
                  <span key={dId} className="text-xs font-medium px-2 py-1 border border-gray-200 text-gray-500 rounded-full">
                    {domainById.get(dId)?.label}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
