"use client";

import { motion } from "framer-motion";
import Container from "./ui/Container";
import { coursework } from "@/lib/data";

// Theme titles only; the individual courses are listed per school under Education.
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

				<div className="grid sm:grid-cols-2 gap-4">
					{coursework.map((theme) => (
						<div key={theme.id} className="bg-white px-5 py-4 border border-gray-200 rounded-xl font-semibold">
							{theme.title}
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
