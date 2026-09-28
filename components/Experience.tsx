"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Container from "./ui/Container";
import { highlightMetrics } from "./ui/Metric";
import { experiences } from "@/lib/data";

// Logo with line-art fallback: missing files render as an initial in a circle,
// matching the site's geometric-minimalism style. Grayscale until the row is hovered.
function CompanyLogo({ src, name, size }: { src: string; name: string; size: string }) {
	const [failed, setFailed] = useState(false);
	return (
		<div
			className={`${size} relative shrink-0 bg-white rounded-full border border-gray-200 overflow-hidden flex items-center justify-center`}
		>
			{src && !failed ? (
				<img
					src={src}
					alt={`${name} logo`}
					onError={() => setFailed(true)}
					className="w-full h-full object-contain p-1.5 grayscale transition group-hover:grayscale-0"
				/>
			) : (
				<span className="text-sm font-semibold text-gray-400 select-none">
					{name.charAt(0)}
				</span>
			)}
		</div>
	);
}

const timeline = experiences.filter((e) => e.category !== "Leadership");
const leadership = experiences.filter((e) => e.category === "Leadership");

export default function Experience() {
	return (
		<section id="experience" className="py-20 border-t border-gray-200">
			<Container>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					className="mb-16"
				>
					<h2 className="text-3xl font-bold tracking-tight mb-4">Experience</h2>
					<div className="h-1 w-20 bg-black"></div>
				</motion.div>

				<div className="space-y-12">
					{timeline.map((exp) => (
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

							<div className="hidden md:flex justify-center">
								<CompanyLogo src={exp.logoUrl} name={exp.company} size="w-12 h-12" />
							</div>

							<div className="space-y-2 relative">
								{/* Mobile Logo View */}
								<div className="md:hidden flex items-center gap-3 mb-2">
									<CompanyLogo src={exp.logoUrl} name={exp.company} size="w-10 h-10" />
									<h3 className="text-lg font-semibold">{exp.company}</h3>
								</div>

								<h3 className="hidden md:block text-lg font-semibold">{exp.company}</h3>
								<p className="text-black font-medium">{exp.role}</p>

								{exp.bullets.length > 0 ? (
									<ul className="mt-2 space-y-1.5">
										{exp.bullets.slice(0, 3).map((bullet, i) => (
											<li key={i} className="flex gap-2.5 text-sm text-gray-600 leading-relaxed">
												<span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
												<span>{highlightMetrics(bullet.text)}</span>
											</li>
										))}
									</ul>
								) : (
									<p className="text-gray-600 leading-relaxed text-sm">{exp.description}</p>
								)}
							</div>
						</motion.div>
					))}
				</div>

				<h3 className="mt-16 mb-6 text-sm font-mono uppercase tracking-widest text-gray-500">Leadership</h3>
				<ul className="space-y-4">
					{leadership.map((exp) => (
						<li
							key={exp.id}
							id={`exp-${exp.slug}`}
							className="group flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
						>
							<CompanyLogo src={exp.logoUrl} name={exp.company} size="w-8 h-8" />
							<span className="font-medium text-black">{exp.company}</span>
							<span className="text-gray-500">· {exp.role}</span>
							<span className="ml-auto font-mono text-xs text-gray-400">{exp.period}</span>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
