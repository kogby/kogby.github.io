"use client";

import { motion } from "framer-motion";
import Container from "./ui/Container";

export default function Hero() {
	return (
		<section id="home" className="pt-20 pb-32 md:pt-32 md:pb-48">
			<Container>
				<div className="max-w-3xl space-y-8">
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="text-5xl md:text-7xl font-bold tracking-tight text-primary leading-tight"
					>
						Building scalable <br />
						<motion.span
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							className="text-gray-400"
						>
							intelligent systems.
						</motion.span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl"
					>
						Hi, I'm <span className="text-black font-semibold">Jerry Chen</span>.
						I engineer minimal, high-performance backend infrastructure & ML systems for scalable applications.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.5 }}
						className="pt-8 flex gap-4"
					>
						<a
							href="#projects"
							className="px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors hover:scale-105 active:scale-95 duration-200"
						>
							View Work
						</a>
						<a
							href="#contact"
							className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-full hover:border-black hover:text-black transition-colors hover:scale-105 active:scale-95 duration-200"
						>
							Contact Me
						</a>
					</motion.div>
				</div>
			</Container>
		</section>
	);
}
