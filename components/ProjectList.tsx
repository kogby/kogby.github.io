"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "./ui/Container";
import { projects } from "@/lib/data";

export default function ProjectList() {
	const [filter, setFilter] = useState("All");

	// Extract unique tags from all projects
	const allTags = ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags)))];

	const filteredProjects = filter === "All"
		? projects
		: projects.filter((p) => p.tags.includes(filter));

	return (
		<section id="projects" className="py-20 border-t border-gray-50 bg-gray-[50]/50">
			<Container>
				<div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl font-bold tracking-tight mb-4">Projects</h2>
						<div className="h-1 w-20 bg-black"></div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className="flex flex-wrap gap-2"
					>
						{allTags.map((tag) => (
							<button
								key={tag}
								onClick={() => setFilter(tag)}
								className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${filter === tag
										? "bg-black text-white shadow-md scale-105"
										: "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
									}`}
							>
								{tag}
							</button>
						))}
					</motion.div>
				</div>

				<motion.div layout className="grid md:grid-cols-2 gap-8">
					<AnimatePresence mode='popLayout'>
						{filteredProjects.map((project) => (
							<motion.div
								layout
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								transition={{ duration: 0.3 }}
								key={project.id}
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
										className="text-gray-400 hover:text-black transition-colors"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
										</svg>
									</a>
								</div>

								<p className="text-gray-600 mb-6 text-sm leading-relaxed">
									{project.summary}
								</p>

								<div className="space-y-4">
									<div className="flex flex-wrap gap-2">
										{project.tags.map(tag => (
											<span key={tag} className="text-xs font-semibold px-2 py-1 bg-gray-50 text-gray-600 rounded">
												{tag}
											</span>
										))}
									</div>

									<div className="pt-4 border-t border-gray-50">
										<p className="text-xs font-mono text-gray-500">
											<span className="font-bold text-black">Metrics:</span> {project.metrics}
										</p>
									</div>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>
			</Container>
		</section>
	);
}
