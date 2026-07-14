"use client";

import { motion } from "framer-motion";
import Container from "./ui/Container";
import { skills } from "@/lib/data";

export default function Skills() {
	return (
		<section id="skills" className="py-20 border-t border-gray-200">
			<Container>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					className="mb-16"
				>
					<h2 className="text-3xl font-bold tracking-tight mb-4">Skills</h2>
					<div className="h-1 w-20 bg-black"></div>
				</motion.div>

				<div className="space-y-10">
					{skills.map((group, gi) => (
						<motion.div
							key={group.category}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: gi * 0.1 }}
						>
							<h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4">
								{group.category}
							</h3>
							<div className="flex flex-wrap gap-2.5">
								{group.items.map((item) => (
									<span
										key={item}
										className="rounded-full border border-gray-300 px-3.5 py-1.5 text-sm text-gray-700 transition-colors hover:border-black hover:text-black"
									>
										{item}
									</span>
								))}
							</div>
						</motion.div>
					))}
				</div>
			</Container>
		</section>
	);
}
