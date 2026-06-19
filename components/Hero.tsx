"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Container from "./ui/Container";
import SocialLinks from "./SocialLinks";

export default function Hero() {
	return (
		<section id="home" className="pt-20 pb-32 md:pt-32 md:pb-48">
			<Container>
				<div className="max-w-3xl space-y-8">
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight"
					>
						Turning ambiguity into <br />
						<motion.span
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							className="text-gray-400"
						>
							scalable systems.
						</motion.span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl"
					>
						Hi, I'm <span className="text-black font-semibold">Jerry Chen</span>.
						I focus on translating ambiguous requirements into concrete
						architectures, providing large-scale, data-intensive AI/ML system
						solutions.
					</motion.p>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.55, duration: 0.5 }}
						className="text-base md:text-lg text-gray-500 leading-relaxed max-w-2xl"
					>
						Recent work spans LLM inference serving, distributed systems, and
						cloud infrastructure. Currently researching production-scale job
						scheduling with the{" "}
						<span className="text-gray-700 font-medium">CMU Parallel Data Lab</span>{" "}
						in collaboration with Uber.
					</motion.p>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.65, duration: 0.5 }}
						className="text-sm md:text-base text-gray-400 font-mono"
					>
						Graduating Dec 2026 · Open to AI/Cloud Infra, MLE &amp; Solutions
						Architect roles.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.75, duration: 0.5 }}
						className="pt-8 flex gap-4"
					>
						<Link
							href="/projects"
							className="px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors hover:scale-105 active:scale-95 duration-200"
						>
							View Work
						</Link>
						<Link
							href="/contact"
							className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-full hover:border-black hover:text-black transition-colors hover:scale-105 active:scale-95 duration-200"
						>
							Contact Me
						</Link>
					</motion.div>

					<SocialLinks />
				</div>
			</Container>
		</section>
	);
}
