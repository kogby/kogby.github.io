"use client";

import { motion } from "framer-motion";
import Container from "./ui/Container";
import { coursework } from "@/lib/data";

export default function CourseworkList() {
	return (
		<section id="coursework" className="pt-10 pb-20">
			<Container>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					className="mb-12"
				>
					<h2 className="text-3xl font-bold tracking-tight mb-4">Coursework</h2>
					<div className="h-1 w-20 bg-black"></div>
					<p className="mt-4 text-gray-600 text-sm max-w-2xl leading-relaxed">
						What I learned across my degree, grouped by theme and ordered by how central it is to my work.
					</p>
				</motion.div>

				<div className="grid md:grid-cols-2 gap-8 items-start">
					{coursework.map((theme) => (
						<motion.div
							key={theme.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.3 }}
							className="bg-white p-8 border border-gray-200 hover:border-black/20 hover:shadow-xl transition-all duration-300 rounded-xl"
						>
							<h3 className="text-xl font-bold mb-2">{theme.title}</h3>
							<p className="text-gray-600 mb-5 text-sm leading-relaxed">{theme.summary}</p>

							<ul className="mb-6 space-y-1.5">
								{theme.learnings.map((point, i) => (
									<li key={i} className="flex gap-2.5 text-sm text-gray-600 leading-relaxed">
										<span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
										<span>{point}</span>
									</li>
								))}
							</ul>

							<ul className="space-y-2 border-t border-gray-100 pt-5">
								{theme.courses.map((course) => (
									<li key={course.code} className="flex items-baseline gap-2.5 text-sm">
										<span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 border border-gray-300 rounded text-gray-500 tracking-wide">
											{course.school}
										</span>
										<span className="font-mono text-xs text-gray-400 flex-shrink-0">{course.code}</span>
										<span className="text-gray-700">{course.name}</span>
									</li>
								))}
							</ul>
						</motion.div>
					))}
				</div>
			</Container>
		</section>
	);
}
