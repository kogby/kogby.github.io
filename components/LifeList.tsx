"use client";

import { motion } from "framer-motion";
import Container from "./ui/Container";
import { lifeList } from "@/lib/data";

export default function LifeList() {
	return (
		<section
			id="life"
			className="relative py-24 border-t border-gray-50 overflow-hidden"
		>
			{/* Drifting gradient blobs — only visible in this section */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				<motion.div
					aria-hidden
					className="absolute -top-20 -left-20 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-60"
					style={{
						background:
							"radial-gradient(circle at 30% 30%, #ffd1dc 0%, #fbc2eb 40%, transparent 70%)",
					}}
					animate={{ x: [0, 60, -30, 0], y: [0, 40, -20, 0] }}
					transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
				/>
				<motion.div
					aria-hidden
					className="absolute top-10 right-0 w-[26rem] h-[26rem] rounded-full blur-3xl opacity-50"
					style={{
						background:
							"radial-gradient(circle at 60% 40%, #c2e9fb 0%, #a1c4fd 50%, transparent 75%)",
					}}
					animate={{ x: [0, -50, 30, 0], y: [0, 30, 60, 0] }}
					transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
				/>
				<motion.div
					aria-hidden
					className="absolute bottom-0 left-1/3 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-50"
					style={{
						background:
							"radial-gradient(circle at 50% 50%, #fef9d7 0%, #d7fcec 55%, transparent 75%)",
					}}
					animate={{ x: [0, 40, -40, 0], y: [0, -30, 20, 0] }}
					transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
				/>
				<motion.div
					aria-hidden
					className="absolute -bottom-24 -right-16 w-[22rem] h-[22rem] rounded-full blur-3xl opacity-45"
					style={{
						background:
							"radial-gradient(circle at 40% 60%, #e0c3fc 0%, #8ec5fc 60%, transparent 80%)",
					}}
					animate={{ x: [0, -30, 50, 0], y: [0, -40, -10, 0] }}
					transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
				/>
			</div>

			<Container>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					className="mb-12"
				>
					<h2
						className="text-5xl md:text-6xl tracking-tight mb-3"
						style={{ fontFamily: "var(--font-handwriting)" }}
					>
						Life 100 List
					</h2>
					<p
						className="text-xl text-gray-700"
						style={{ fontFamily: "var(--font-handwriting)" }}
					>
						things i want to do before i go ✦
					</p>
					<div className="h-1 w-20 bg-black/70 mt-4 rounded-full"></div>
				</motion.div>

				<ol
					className="space-y-5 text-2xl md:text-3xl text-gray-900"
					style={{ fontFamily: "var(--font-handwriting)" }}
				>
					{lifeList.map((item, idx) => (
						<motion.li
							key={item.id}
							initial={{ opacity: 0, y: 12, rotate: 0 }}
							whileInView={{
								opacity: 1,
								y: 0,
								rotate: idx % 2 === 0 ? -0.6 : 0.5,
							}}
							viewport={{ once: true, margin: "-50px" }}
							transition={{ delay: idx * 0.08, duration: 0.4 }}
							className="flex items-baseline gap-4"
						>
							<span className="text-gray-500 w-10 shrink-0 tabular-nums">
								{String(item.id).padStart(2, "0")}.
							</span>
							<span
								className={
									item.done
										? "line-through decoration-2 decoration-gray-500 text-gray-500"
										: ""
								}
							>
								{item.text}
							</span>
						</motion.li>
					))}
				</ol>

				<p
					className="mt-12 text-lg text-gray-600"
					style={{ fontFamily: "var(--font-handwriting)" }}
				>
					… more to come ✎
				</p>
			</Container>
		</section>
	);
}
