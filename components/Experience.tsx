"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { motion } from "framer-motion";
import Container from "./ui/Container";
import { highlightMetrics } from "./ui/Metric";
import CompanyLogo from "./ui/CompanyLogo";
import SlideToggle from "./ui/SlideToggle";
import { experiences } from "@/lib/data";

const TABS = ["Work", "Research", "Leadership"] as const;
type Tab = (typeof TABS)[number];


export default function Experience() {
	const [tab, setTab] = useState<Tab>("Work");

	// The venn map fires "venn:reveal" before jumping; switch tabs synchronously so the target exists.
	useEffect(() => {
		const onReveal = (e: Event) => {
			const exp = experiences.find((x) => `exp-${x.slug}` === (e as CustomEvent<string>).detail);
			if (exp) flushSync(() => setTab(exp.category as Tab));
		};
		window.addEventListener("venn:reveal", onReveal);
		return () => window.removeEventListener("venn:reveal", onReveal);
	}, []);

	return (
		<section id="experience" className="py-20">
			<Container>
				<div className="mb-16 flex flex-wrap items-end justify-between gap-6">
					<motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
						<h2 className="text-3xl font-bold tracking-tight mb-4">Experience</h2>
						<div className="h-1 w-20 bg-black"></div>
					</motion.div>

					<SlideToggle id="experienceTab" options={TABS.map((t) => ({ value: t, label: t }))} value={tab} onChange={setTab} />
				</div>

				<motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
					{experiences.filter((e) => e.category === tab).map((exp) => (
						<motion.div
							key={exp.id}
							id={`exp-${exp.slug}`}
							tabIndex={-1}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="group grid grid-cols-[1fr] md:grid-cols-[170px_48px_1fr] gap-4 md:gap-6 p-6 md:p-8 border border-gray-200 hover:border-black/20 hover:shadow-xl transition-all duration-300 rounded-xl"
						>
							<div className="md:text-right">
								<p className="text-sm font-medium text-gray-500 font-mono tracking-tight whitespace-nowrap">{exp.period}</p>
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
										{exp.bullets.map((bullet, i) => (
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
				</motion.div>
			</Container>
		</section>
	);
}
