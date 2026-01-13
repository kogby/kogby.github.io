"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "./ui/Container";
import { experiences } from "@/lib/data";

export default function Experience() {
	const [activeTab, setActiveTab] = useState<"Work" | "Research">("Work");

	const filteredExperiences = experiences.filter(
		(exp) => exp.category === activeTab
	);

	return (
		<section id="about" className="py-20 border-t border-gray-50">
			<Container>
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl font-bold tracking-tight mb-4">Experience</h2>
						<div className="h-1 w-20 bg-black"></div>
					</motion.div>

					<div className="flex bg-gray-100 p-1 rounded-full w-fit">
						{["Work", "Research"].map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab as "Work" | "Research")}
								className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? "text-white" : "text-gray-600 hover:text-gray-900"
									}`}
							>
								{activeTab === tab && (
									<motion.div
										layoutId="activeTab"
										className="absolute inset-0 bg-black rounded-full"
										transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
									/>
								)}
								<span className="relative z-10">{tab}</span>
							</button>
						))}
					</div>
				</div>

				<div className="space-y-12 min-h-[400px]">
					<AnimatePresence mode="wait">
						<motion.div
							key={activeTab}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="space-y-12"
						>
							{filteredExperiences.map((exp, index) => (
								<motion.div
									key={exp.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									className="grid grid-cols-[1fr] md:grid-cols-[150px_60px_1fr] gap-4 md:gap-8 border-b border-gray-50 pb-8 last:border-0"
								>
									<div className="md:text-right">
										<p className="text-sm font-medium text-gray-500 font-mono tracking-tight">{exp.period}</p>
									</div>

									<div className="hidden md:flex justify-center">
										{/* <div className="w-12 h-12 relative bg-white rounded-full border border-gray-100 p-2 shadow-sm overflow-hidden flex items-center justify-center">
											<img
												src={exp.logoUrl}
												alt={`${exp.company} logo`}
												className="w-full h-full object-contain"
											/>
										</div> */}
									</div>

									<div className="space-y-2 relative">
										{/* Mobile Logo View */}
										<div className="md:hidden flex items-center gap-3 mb-2">
											{/* <div className="w-10 h-10 relative bg-white rounded-full border border-gray-100 p-1.5 shadow-sm overflow-hidden flex items-center justify-center">
												<img
													src={exp.logoUrl}
													alt={`${exp.company} logo`}
													className="w-full h-full object-contain"
												/>
											</div> */}
											<h3 className="text-lg font-semibold">{exp.role}</h3>
										</div>

										<h3 className="hidden md:block text-lg font-semibold">{exp.role}</h3>
										<p className="text-black font-medium">{exp.company}</p>
										<p className="text-gray-600 leading-relaxed text-sm">{exp.description}</p>
									</div>
								</motion.div>
							))}
						</motion.div>
					</AnimatePresence>
				</div>
			</Container>
		</section>
	);
}
