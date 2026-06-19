"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "./ui/Container";
import { domains, projectsWithDomains } from "@/lib/data";

function computeLayout(width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const domainRadius = Math.min(width, height) * 0.28;

  const domainPositions = domains.map((d, i) => {
    const angle = (i / domains.length) * Math.PI * 2 - Math.PI / 2;
    return {
      ...d,
      x: cx + domainRadius * Math.cos(angle),
      y: cy + domainRadius * Math.sin(angle),
      angle,
    };
  });

  return { domainPositions, cx, cy, domainRadius };
}

// Compute project positions that fan out from a selected domain
function computeProjectPositions(
  domainId: string,
  domainPositions: ReturnType<typeof computeLayout>["domainPositions"],
  cx: number,
  cy: number,
  domainRadius: number,
) {
  const related = projectsWithDomains.filter((p) => p.domains.includes(domainId));
  const domain = domainPositions.find((d) => d.id === domainId)!;
  const projectRadius = domainRadius * 1.7;
  const count = related.length;
  // Fan spread: total arc that the projects span
  const fanArc = Math.min(count * 0.32, 1.2); // radians

  return related.map((p, i) => {
    const offset = count === 1 ? 0 : (i - (count - 1) / 2) * (fanArc / (count - 1));
    const angle = domain.angle + offset;
    return {
      ...p,
      x: cx + projectRadius * Math.cos(angle),
      y: cy + projectRadius * Math.sin(angle),
      angle,
    };
  });
}

// Convert radians to degrees, and flip text if on the left side so it reads L→R
function labelTransform(x: number, y: number, angle: number, offset: number) {
  const lx = x + Math.cos(angle) * offset;
  const ly = y + Math.sin(angle) * offset;
  let deg = (angle * 180) / Math.PI;
  let anchor: "start" | "end" = "start";
  // If label is on the left half, flip 180 so text isn't upside down
  if (deg > 90 || deg < -90) {
    deg += 180;
    anchor = "end";
  }
  return { lx, ly, deg, anchor };
}

export default function ConstellationGraph() {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<number | null>(null);

  const width = 1000;
  const height = 1000;

  const { domainPositions, cx, cy, domainRadius } = useMemo(
    () => computeLayout(width, height),
    []
  );

  const projectPositions = useMemo(() => {
    if (!activeDomain) return [];
    return computeProjectPositions(activeDomain, domainPositions, cx, cy, domainRadius);
  }, [activeDomain, domainPositions, cx, cy, domainRadius]);

  // Domain-to-domain web edges
  const domainEdges = useMemo(() => {
    const result: { x1: number; y1: number; x2: number; y2: number; id1: string; id2: string }[] = [];
    for (let i = 0; i < domainPositions.length; i++) {
      for (let j = i + 1; j < domainPositions.length; j++) {
        result.push({
          x1: domainPositions[i].x, y1: domainPositions[i].y,
          x2: domainPositions[j].x, y2: domainPositions[j].y,
          id1: domainPositions[i].id, id2: domainPositions[j].id,
        });
      }
    }
    return result;
  }, [domainPositions]);

  // Decorative rings & radials
  const rings = [domainRadius * 0.35, domainRadius * 0.65, domainRadius];
  const radialCount = 18;
  const radialLines = Array.from({ length: radialCount }, (_, i) => {
    const angle = (i / radialCount) * Math.PI * 2;
    return {
      x1: cx + rings[0] * 0.2 * Math.cos(angle),
      y1: cy + rings[0] * 0.2 * Math.sin(angle),
      x2: cx + domainRadius * 1.05 * Math.cos(angle),
      y2: cy + domainRadius * 1.05 * Math.sin(angle),
    };
  });

  // Project-to-domain edges (only when a domain is active)
  const projectEdges = useMemo(() => {
    if (!activeDomain) return [];
    const result: { px: number; py: number; dx: number; dy: number; projectId: number; domainId: string }[] = [];
    for (const p of projectPositions) {
      for (const dId of p.domains) {
        const d = domainPositions.find((dm) => dm.id === dId);
        if (d) {
          result.push({ px: p.x, py: p.y, dx: d.x, dy: d.y, projectId: p.id, domainId: dId });
        }
      }
    }
    return result;
  }, [activeDomain, projectPositions, domainPositions]);

  const isDomainActive = useCallback(
    (d: { id: string }) => {
      if (!activeDomain) return true;
      if (d.id === activeDomain) return true;
      // Also highlight domains that share projects with active domain
      if (activeProject !== null) {
        const proj = projectsWithDomains.find((p) => p.id === activeProject);
        return proj?.domains.includes(d.id) ?? false;
      }
      return false;
    },
    [activeDomain, activeProject]
  );

  const selectedProject = activeProject !== null
    ? projectsWithDomains.find((p) => p.id === activeProject)
    : null;

  // Domain label: positioned outward with smart anchor
  function domainLabelPos(x: number, y: number) {
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const lx = x + (dx / dist) * 30;
    const ly = y + (dy / dist) * 30;
    const nx = dx / dist;
    let anchor: "start" | "middle" | "end" = "middle";
    if (nx > 0.3) anchor = "start";
    else if (nx < -0.3) anchor = "end";
    return { lx, ly, anchor };
  }

  return (
    <section id="projects" className="py-20 border-t border-gray-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-4">Projects</h2>
          <div className="h-1 w-20 bg-black"></div>
          <p className="text-sm text-gray-500 mt-4">
            {activeDomain
              ? "Click a project node for details, or pick another domain."
              : "Select a domain to explore related projects."}
          </p>
        </motion.div>

        {/* Domain filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => { setActiveDomain(null); setActiveProject(null); }}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
              !activeDomain
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
                setActiveDomain(activeDomain === d.id ? null : d.id);
                setActiveProject(null);
              }}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                activeDomain === d.id
                  ? "bg-black text-white shadow-md scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* SVG Dreamcatcher */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-3xl mx-auto"
        >
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.12" />
              </filter>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#111" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#111" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Center glow */}
            <circle cx={cx} cy={cy} r={domainRadius * 1.3} fill="url(#centerGlow)" />

            {/* Concentric rings */}
            {rings.map((r, i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="#e0e0e0"
                strokeWidth={0.6}
                strokeDasharray={i === 0 ? "2 8" : i === 1 ? "4 10" : "none"}
                opacity={0.45}
              />
            ))}

            {/* Radial threads */}
            {radialLines.map((line, i) => (
              <line
                key={`r-${i}`}
                x1={line.x1} y1={line.y1}
                x2={line.x2} y2={line.y2}
                stroke="#eaeaea"
                strokeWidth={0.4}
                opacity={0.35}
              />
            ))}

            {/* Center dot */}
            <circle cx={cx} cy={cy} r={3.5} fill="#ddd" />

            {/* Domain-to-domain web */}
            {domainEdges.map((e, i) => {
              const active = !activeDomain || e.id1 === activeDomain || e.id2 === activeDomain;
              return (
                <line
                  key={`dw-${i}`}
                  x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                  stroke={active ? "#d0d0d0" : "#f0f0f0"}
                  strokeWidth={active ? 0.8 : 0.3}
                  style={{ transition: "all 0.5s ease" }}
                />
              );
            })}

            {/* Project-to-domain threads (animated in) */}
            {projectEdges.map((edge, i) => {
              const isActive = activeProject === null || edge.projectId === activeProject;
              return (
                <motion.line
                  key={`pe-${edge.projectId}-${edge.domainId}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: isActive ? 0.6 : 0.15 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  x1={edge.dx} y1={edge.dy}
                  x2={edge.px} y2={edge.py}
                  stroke="#111"
                  strokeWidth={isActive ? 1.2 : 0.5}
                  style={{ transition: "opacity 0.3s, stroke-width 0.3s" }}
                />
              );
            })}

            {/* Domain nodes */}
            {domainPositions.map((d) => {
              const active = isDomainActive(d);
              const isSelected = d.id === activeDomain;
              const { lx, ly, anchor } = domainLabelPos(d.x, d.y);
              return (
                <g
                  key={d.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setActiveDomain(activeDomain === d.id ? null : d.id);
                    setActiveProject(null);
                  }}
                >
                  {/* Pulse ring when selected */}
                  {isSelected && (
                    <circle
                      cx={d.x} cy={d.y} r={26}
                      fill="none" stroke="#111" strokeWidth={0.8}
                      opacity={0.15}
                    />
                  )}
                  <circle
                    cx={d.x} cy={d.y} r={18}
                    fill={active ? "white" : "#fafafa"}
                    stroke={isSelected ? "#111" : active ? "#bbb" : "#e0e0e0"}
                    strokeWidth={isSelected ? 2 : 1}
                    filter={isSelected ? "url(#shadow)" : undefined}
                    opacity={active ? 1 : 0.3}
                    style={{ transition: "all 0.4s ease" }}
                  />
                  <circle
                    cx={d.x} cy={d.y} r={3.5}
                    fill={isSelected ? "#111" : active ? "#888" : "#ccc"}
                    opacity={active ? 1 : 0.3}
                    style={{ transition: "all 0.4s ease" }}
                  />
                  <text
                    x={lx} y={ly}
                    textAnchor={anchor}
                    dominantBaseline="central"
                    fontSize={13}
                    fontWeight={isSelected ? 700 : 600}
                    letterSpacing={0.5}
                    fill={isSelected ? "#111" : active ? "#555" : "#ccc"}
                    opacity={active ? 1 : 0.35}
                    style={{ transition: "all 0.4s ease", fontFamily: "var(--font-sans)" }}
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}

            {/* Project nodes — only visible when a domain is selected */}
            <AnimatePresence>
              {activeDomain && projectPositions.map((p, i) => {
                const selected = activeProject === p.id;
                const dimmed = activeProject !== null && !selected;
                const { lx, ly, deg, anchor } = labelTransform(p.x, p.y, p.angle, 18);

                return (
                  <motion.g
                    key={p.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: dimmed ? 0.3 : 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.06, type: "spring", stiffness: 200 }}
                    style={{ cursor: "pointer", transformOrigin: `${p.x}px ${p.y}px` }}
                    onClick={() => setActiveProject(activeProject === p.id ? null : p.id)}
                  >
                    {/* Selection ring */}
                    {selected && (
                      <circle
                        cx={p.x} cy={p.y} r={18}
                        fill="none" stroke="#111" strokeWidth={1}
                        opacity={0.2} filter="url(#glow)"
                      />
                    )}
                    {/* Node */}
                    <circle
                      cx={p.x} cy={p.y}
                      r={selected ? 9 : 6}
                      fill="#111"
                      filter={selected ? "url(#glow)" : undefined}
                    />
                    {/* Highlight dot */}
                    <circle
                      cx={p.x - 1.5} cy={p.y - 1.5}
                      r={1.5} fill="white" opacity={0.45}
                    />
                    {/* Rotated label along radial */}
                    <text
                      x={lx} y={ly}
                      textAnchor={anchor}
                      dominantBaseline="central"
                      transform={`rotate(${deg}, ${lx}, ${ly})`}
                      fontSize={10}
                      fontWeight={selected ? 600 : 400}
                      fill={selected ? "#111" : "#555"}
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {p.title}
                    </text>
                  </motion.g>
                );
              })}
            </AnimatePresence>
          </svg>
        </motion.div>

        {/* Project detail card */}
        <AnimatePresence mode="wait">
          {selectedProject && (
            <motion.div
              key={selectedProject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="-mt-4 p-6 border border-gray-200 rounded-xl bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold">{selectedProject.title}</h3>
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{selectedProject.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedProject.tags.map((tag) => (
                  <span key={tag} className="text-xs font-semibold px-2 py-1 bg-gray-50 text-gray-600 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedProject.domains.map((dId) => {
                  const domain = domains.find((dm) => dm.id === dId);
                  return (
                    <span key={dId} className="text-xs font-medium px-2 py-1 border border-gray-200 text-gray-500 rounded-full">
                      {domain?.label}
                    </span>
                  );
                })}
              </div>
              <p className="text-xs font-mono text-gray-500">
                <span className="font-bold text-black">Metrics:</span> {selectedProject.metrics}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
