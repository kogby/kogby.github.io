import Link from "next/link";
import Container from "./ui/Container";

export default function Navbar() {
	const navLinks = [
		{ name: "About", href: "#about" },
		{ name: "Projects", href: "#projects" },
		{ name: "Contact", href: "#contact" },
	];

	return (
		<nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
			<Container className="flex items-center justify-between h-16">
				<Link href="/" className="text-lg font-bold tracking-tight hover:text-gray-600 transition-colors">
					kogby
				</Link>

				<div className="flex gap-6 sm:gap-8">
					{navLinks.map((link) => (
						<Link
							key={link.name}
							href={link.href}
							className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
						>
							{link.name}
						</Link>
					))}
				</div>
			</Container>
		</nav>
	);
}
