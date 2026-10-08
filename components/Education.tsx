"use client";

import { motion } from "framer-motion";
import Container from "./ui/Container";
import CompanyLogo from "./ui/CompanyLogo";
import { education } from "@/lib/data";

export default function Education() {
	return (
		<section id="education" className="py-20">
			<Container>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					className="mb-16"
				>
					<h2 className="text-3xl font-bold tracking-tight mb-4">Education</h2>
					<div className="h-1 w-20 bg-black"></div>
				</motion.div>

				<div className="space-y-12">
					{education.map((ed) => (
						<motion.div
							key={ed.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="grid grid-cols-[1fr] md:grid-cols-[190px_60px_1fr] gap-4 md:gap-8"
						>
							<p className="md:text-right text-sm font-medium text-gray-500 font-mono tracking-tight whitespace-nowrap">{ed.period}</p>

							<div className="hidden md:flex justify-center">
								<CompanyLogo src={ed.logoUrl} name={ed.school} size="w-12 h-12" />
							</div>

							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<span className="md:hidden">
										<CompanyLogo src={ed.logoUrl} name={ed.school} size="w-10 h-10" />
									</span>
									<h3 className="text-lg font-semibold">{ed.school}</h3>
								</div>
								{ed.unit && <p className="text-sm text-gray-500">{ed.unit}</p>}
								<p className="text-black font-medium">{ed.degree}</p>
								<p className="text-sm text-gray-600">GPA {ed.gpa}</p>
								{ed.courses.length > 0 && (
									<div className="flex flex-wrap gap-2 pt-2">
										{ed.courses.map((c) => (
											<span key={c} className="text-xs font-medium px-2.5 py-1 border border-gray-200 text-gray-600 rounded-full bg-white">
												{c}
											</span>
										))}
									</div>
								)}
							</div>
						</motion.div>
					))}
				</div>
			</Container>
		</section>
	);
}
