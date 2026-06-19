"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Container from "./ui/Container";
import ConstellationGraph from "./ConstellationGraph";
import ProjectList from "./ProjectList";

type View = "cards" | "graph";

const TABS: { id: View; label: string }[] = [
	{ id: "cards", label: "Cards" },
	{ id: "graph", label: "Constellation" },
];

export default function ProjectsView() {
	const [view, setView] = useState<View>("cards");

	return (
		<>
			{/* View toggle */}
			<Container className="pt-8 pb-0">
				<div className="flex justify-center">
					<div className="inline-flex bg-gray-100 p-1 rounded-full">
						{TABS.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setView(tab.id)}
								className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors ${
									view === tab.id ? "text-white" : "text-gray-600 hover:text-gray-900"
								}`}
							>
								{view === tab.id && (
									<motion.div
										layoutId="projectsViewTab"
										className="absolute inset-0 rounded-full"
										style={{ backgroundColor: "var(--accent-primary)" }}
										transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
									/>
								)}
								<span className="relative z-10">{tab.label}</span>
							</button>
						))}
					</div>
				</div>
			</Container>

			{view === "cards" ? <ProjectList /> : <ConstellationGraph />}
		</>
	);
}
