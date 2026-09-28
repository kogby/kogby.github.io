"use client";

import { useState } from "react";

// Logo with line-art fallback: missing files render as an initial in a circle,
// matching the site's geometric-minimalism style.
export default function CompanyLogo({ src, name, size }: { src: string; name: string; size: string }) {
	const [failed, setFailed] = useState(false);
	return (
		<div
			className={`${size} relative shrink-0 bg-white rounded-full border border-gray-200 overflow-hidden flex items-center justify-center`}
		>
			{src && !failed ? (
				<img
					src={src}
					alt={`${name} logo`}
					onError={() => setFailed(true)}
					// A static-HTML <img> can fail before hydration attaches onError; catch that on mount.
					ref={(img) => {
						if (img?.complete && img.naturalWidth === 0) setFailed(true);
					}}
					className="w-full h-full object-contain p-[12%]"
				/>
			) : (
				<span className="text-sm font-semibold text-gray-400 select-none">
					{name.charAt(0)}
				</span>
			)}
		</div>
	);
}
