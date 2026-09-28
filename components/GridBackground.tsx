"use client";

import { useEffect } from "react";

// Feeds the cursor position to .grid-glow (globals.css) via CSS variables.
export default function GridBackground() {
	useEffect(() => {
		let frame = 0;
		const onMove = (e: PointerEvent) => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const s = document.documentElement.style;
				s.setProperty("--mx", `${e.clientX}px`);
				s.setProperty("--my", `${e.clientY}px`);
			});
		};
		window.addEventListener("pointermove", onMove, { passive: true });
		return () => {
			window.removeEventListener("pointermove", onMove);
			cancelAnimationFrame(frame);
		};
	}, []);
	return <div aria-hidden className="grid-glow" />;
}
