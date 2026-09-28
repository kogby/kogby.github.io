"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { motion } from "framer-motion";
import Container from "./ui/Container";
import { highlightMetrics } from "./ui/Metric";
import SlideToggle from "./ui/SlideToggle";
import { projects } from "@/lib/data";
import type { Region } from "@/lib/venn";

// Projects use two groups: ML Infra folds into Systems here (the venn map keeps the overlap).
type Group = "systems" | "ml";
type Filter = Group | "all";
const GROUPS: { id: Group; label: string }[] = [
	{ id: "systems", label: "Systems" },
	{ id: "ml", label: "Machine Learning" },
];
const groupOf = (r: Region): Group => (r === "ml" ? "ml" : "systems");
const FILTERS: { value: Filter; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "systems", label: "Systems" },
	{ value: "ml", label: "ML" },
];

export default function ProjectList() {
	const [filter, setFilter] = useState<Filter>("all");

	// The venn map fires "venn:reveal" before jumping; show the target's region if it is filtered out.
	useEffect(() => {
		const onReveal = (e: Event) => {
			const p = projects.find((x) => `project-${x.slug}` === (e as CustomEvent<string>).detail);
			if (p) flushSync(() => setFilter((f) => (f === "all" || f === groupOf(p.region) ? f : groupOf(p.region))));
		};
		window.addEventListener("venn:reveal", onReveal);
		return () => window.removeEventListener("venn:reveal", onReveal);
	}, []);

	return (
		<section id="projects" className="py-20 border-t border-gray-200">
			<Container>
				<div className="mb-12 flex flex-wrap items-end justify-between gap-6">
					<motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
						<h2 className="text-3xl font-bold tracking-tight mb-4">Projects</h2>
						<div className="h-1 w-20 bg-black"></div>
					</motion.div>

					<SlideToggle id="projectFilter" options={FILTERS} value={filter} onChange={setFilter} />
				</div>

				<motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-14">
					{GROUPS.filter((g) => filter === "all" || g.id === filter).map((r) => {
						const list = projects.filter((p) => groupOf(p.region) === r.id);
						return (
							list.length > 0 && (
								<div key={r.id}>
									{filter === "all" && (
										<h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-6">{r.label}</h3>
									)}
									<div className="grid md:grid-cols-2 gap-8">
										{list.map((project) => (
											<motion.div
												key={project.id}
												id={`project-${project.slug}`}
												tabIndex={-1}
												initial={{ opacity: 0, y: 20 }}
												whileInView={{ opacity: 1, y: 0 }}
												viewport={{ once: true }}
												className="group bg-white p-8 border border-gray-200 hover:border-black/20 hover:shadow-xl transition-all duration-300 rounded-xl"
											>
												<div className="flex justify-between items-start mb-4">
													<h3 className="text-xl font-bold group-hover:text-blue-700 transition-colors">
														{project.title}
													</h3>
													<a
														href={project.link}
														target="_blank"
														rel="noopener noreferrer"
														aria-label={`Open ${project.title}`}
														className="text-gray-400 hover:text-black transition-colors"
													>
														<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
														</svg>
													</a>
												</div>

												<p className="text-gray-600 mb-4 text-sm leading-relaxed">
													{project.summary}
												</p>

												{project.bullets.length > 0 && (
													<ul className="mb-6 space-y-1.5">
														{project.bullets.map((bullet, i) => (
															<li key={i} className="flex gap-2.5 text-sm text-gray-600 leading-relaxed">
																<span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
																<span>{highlightMetrics(bullet.text)}</span>
															</li>
														))}
													</ul>
												)}

												<div className="flex flex-wrap gap-2">
													{project.tags.map((tag) => (
														<span key={tag} className="text-xs font-semibold px-2 py-1 bg-gray-50 text-gray-600 rounded">
															{tag}
														</span>
													))}
												</div>
											</motion.div>
										))}
									</div>
								</div>
							)
						);
					})}
				</motion.div>
			</Container>
		</section>
	);
}
