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
		.map((e) => ({
			key: `e${e.id}`,
			anchor: `exp-${e.slug}`,
			label: `${e.company} · ${e.role}`,
			kind: "experience" as const,
			region: e.region,
		})),
	...projects.map((p) => ({
		key: `p${p.id}`,
		anchor: `project-${p.slug}`,
		label: p.title,
		kind: "project" as const,
		region: p.region,
	})),
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
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					className="mb-10"
				>
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
					<circle
						cx={LX}
						cy={CY}
						r={R}
						fill="transparent"
						stroke={lineColor("systems")}
						strokeOpacity={0.7}
						strokeWidth={1.25}
						onPointerEnter={() => setActive("systems")}
						style={{ transition: "stroke .3s" }}
					/>
					<circle
						cx={RX}
						cy={CY}
						r={R}
						fill="transparent"
						stroke={lineColor("ml")}
						strokeOpacity={0.7}
						strokeWidth={1.25}
						onPointerEnter={() => setActive("ml")}
						style={{ transition: "stroke .3s" }}
					/>
					<path
						d={LENS}
						fill="transparent"
						stroke={active === "mlinfra" ? ACCENT : "none"}
						strokeWidth={1.25}
						onPointerEnter={() => setActive("mlinfra")}
					/>

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
					{hovered
						? `${hovered.kind === "project" ? "●" : "○"} ${hovered.label}`
						: "Hover a dot to see what it is. Click to jump to it."}
				</p>
				<p className="mt-1 text-center text-xs text-gray-400">● project&nbsp;&nbsp;&nbsp;○ experience</p>
			</Container>
		</section>
	);
}
