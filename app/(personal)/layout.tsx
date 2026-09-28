import Link from "next/link";
import Container from "@/components/ui/Container";

const links = [
	{ name: "Writings", href: "/writings" },
	{ name: "Life List", href: "/life" },
];

export default function PersonalLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Container className="pt-10">
				<nav className="flex gap-6 text-xl text-gray-500" style={{ fontFamily: "var(--font-handwriting)" }}>
					{links.map((l) => (
						<Link key={l.href} href={l.href} className="hover:text-black transition-colors">
							{l.name}
						</Link>
					))}
				</nav>
			</Container>
			{children}
		</>
	);
}
