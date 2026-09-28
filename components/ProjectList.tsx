"use client";

import { motion } from "framer-motion";
import Container from "./ui/Container";
import { highlightMetrics } from "./ui/Metric";
import { projects } from "@/lib/data";
import { REGIONS } from "@/lib/venn";

export default function ProjectList() {
	return (
		<section id="projects" className="py-20 border-t border-gray-200">
			<Container>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					className="mb-12"
				>
					<h2 className="text-3xl font-bold tracking-tight mb-4">Projects</h2>
					<div className="h-1 w-20 bg-black"></div>
				</motion.div>

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
				</div>
			</Container>
		</section>
	);
}
