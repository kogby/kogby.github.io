import Link from "next/link";
import Container from "./ui/Container";

export default function Navbar() {
	const navLinks = [
		{ name: "Experience", href: "/experience" },
		{ name: "Projects", href: "/projects" },
		{ name: "Skills", href: "/skills" },
		{ name: "Studying", href: "/studying" },
		{ name: "Life List", href: "/life" },
		{ name: "Contact", href: "/contact" },
	];

	return (
		<nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
			<Container className="flex items-center justify-between gap-4 h-16">
				<Link href="/" className="text-lg font-bold tracking-tight hover:text-gray-600 transition-colors">
					kogby
				</Link>

				{/* ponytail: horizontally scrollable on small screens; hamburger if links grow */}
				<div className="flex gap-5 sm:gap-8 overflow-x-auto whitespace-nowrap">
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
