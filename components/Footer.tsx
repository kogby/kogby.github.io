import Container from "./ui/Container";

export default function Footer() {
	return (
		<footer className="py-12 mt-20 border-t border-gray-100">
			<Container className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
				<p>© {new Date().getFullYear()} kogby. All rights reserved.</p>
				<div className="flex gap-6">
					<a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
						GitHub
					</a>
					<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
						LinkedIn
					</a>
					<a href="mailto:hello@example.com" className="hover:text-black transition-colors">
						Email
					</a>
				</div>
			</Container>
		</footer>
	);
}
