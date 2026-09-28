"use client";

import { motion } from "framer-motion";
import Container from "./ui/Container";
import VennMap from "./VennMap";

export default function About() {
	return (
		<section id="about" className="py-20 border-t border-gray-200">
			<Container>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					className="mb-10"
				>
					<h2 className="text-3xl font-bold tracking-tight mb-4">About me</h2>
					<div className="h-1 w-20 bg-black"></div>
				</motion.div>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="max-w-3xl mb-12 text-lg text-gray-700 leading-relaxed"
				>
					I&apos;m currently a graduate student at <span className="font-semibold text-black">Carnegie Mellon University</span>,
					focused on distributed systems and ML infrastructure. Recent work spans LLM inference serving, distributed
					systems, and cloud infrastructure. Currently researching production-scale job scheduling with the{" "}
					<span className="font-semibold text-black">CMU Parallel Data Lab</span> in collaboration with Uber.
				</motion.p>

				<VennMap />
			</Container>
		</section>
	);
}
