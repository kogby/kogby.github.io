"use client";

import { motion } from "framer-motion";
import Container from "./ui/Container";
import { coursework } from "@/lib/data";

// Theme title + its courses (CMU and NTU); no theme descriptions.
export default function CourseworkList() {
	return (
		<section id="coursework" className="py-20 border-t border-gray-200">
			<Container>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					className="mb-12"
				>
					<h2 className="text-3xl font-bold tracking-tight mb-4">Coursework</h2>
					<div className="h-1 w-20 bg-black"></div>
				</motion.div>

				<div className="grid md:grid-cols-2 gap-6 items-start">
					{coursework.map((theme) => (
						<div key={theme.id} className="bg-white p-6 border border-gray-200 rounded-xl">
							<h3 className="font-bold mb-4">{theme.title}</h3>
							<ul className="space-y-2">
								{theme.courses.map((course) => (
									<li key={course.school + course.name} className="flex items-baseline gap-2.5 text-sm">
										<span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 border border-gray-300 rounded text-gray-500 tracking-wide">
											{course.school}
										</span>
										<span className="text-gray-700">{course.name}</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
