"use client";

import { motion } from "framer-motion";
import Container from "./ui/Container";

export default function Bio() {
	return (
		<section className="pb-32">
			<Container>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="max-w-3xl space-y-5 text-lg text-gray-700 leading-relaxed"
				>
					<p>
						I&apos;m currently a graduate student at <span className="font-semibold text-black">Carnegie Mellon University</span>,
						focused on distributed systems and ML infrastructure.
					</p>
					<p>
						Previously: backend engineer at <span className="font-semibold text-black">LINE</span> (21M+ DAU commerce platform),
						ML engineer at <span className="font-semibold text-black">EVA Air</span>,
						and president of the <span className="font-semibold text-black">NTU Data Analytics Club</span>.
					</p>
					<p className="text-gray-500">
						I care about building minimal, observable systems — and turning messy data pipelines into something you&apos;d actually want to run on a Sunday night.
					</p>
				</motion.div>
			</Container>
		</section>
	);
}
