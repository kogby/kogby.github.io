import Container from "@/components/ui/Container";
import { writings, writingProfiles } from "@/lib/data";

const hand = { fontFamily: "var(--font-handwriting)" };

export default function WritingsPage() {
	return (
		<section className="py-16">
			<Container>
				<h1 className="text-5xl md:text-6xl tracking-tight mb-3" style={hand}>
					Writings
				</h1>
				<p className="text-xl text-gray-600 mb-12" style={hand}>
					notes on work, learning, and life ✎
				</p>

				{writings.length > 0 ? (
					<ul className="divide-y divide-gray-200">
						{writings.map((w) => (
							<li key={w.url}>
								<a href={w.url} target="_blank" rel="noopener noreferrer" className="group block py-6">
									<p className="font-mono text-xs text-gray-400 mb-1">
										{w.date} · {w.platform}
									</p>
									<h2 className="text-xl font-semibold group-hover:text-accent-primary transition-colors">
										{w.title} ↗
									</h2>
									<p className="text-gray-600 mt-1">{w.blurb}</p>
								</a>
							</li>
						))}
					</ul>
				) : (
					<p className="text-2xl text-gray-500" style={hand}>
						first post coming soon.
					</p>
				)}

				<p className="mt-12 text-sm text-gray-500">
					Also on{" "}
					{writingProfiles.map((p, i) => (
						<span key={p.name}>
							{i > 0 && " · "}
							<a href={p.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-black">
								{p.name}
							</a>
						</span>
					))}
				</p>
			</Container>
		</section>
	);
}
