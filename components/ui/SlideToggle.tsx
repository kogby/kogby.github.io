"use client";

import { motion } from "framer-motion";

// Pill toggle whose black highlight slides to the selected option. `id` keeps each
// toggle's shared-layout animation separate when several are on the page.
export default function SlideToggle<T extends string>({
	id,
	options,
	value,
	onChange,
}: {
	id: string;
	options: readonly { value: T; label: string }[];
	value: T;
	onChange: (value: T) => void;
}) {
	return (
		<div className="flex bg-gray-100 p-1 rounded-full">
			{options.map((o) => (
				<button
					key={o.value}
					onClick={() => onChange(o.value)}
					aria-pressed={value === o.value}
					className={`relative px-3 sm:px-5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
						value === o.value ? "text-white" : "text-gray-600 hover:text-gray-900"
					}`}
				>
					{value === o.value && (
						<motion.span
							layoutId={id}
							className="absolute inset-0 bg-black rounded-full"
							transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
						/>
					)}
					<span className="relative z-10">{o.label}</span>
				</button>
			))}
		</div>
	);
}
