import Container from "./ui/Container";

export default function Contact() {
	return (
		<section id="contact" className="py-24 border-t border-gray-50">
			<Container className="text-center">
				<h2 className="text-3xl font-bold tracking-tight mb-8">Get in Touch</h2>
				<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
					Currently open to new opportunities in ML Infrastructure and Backend Engineering.
				</p>

				<a
					href="mailto:hello@kogby.dev"
					className="text-3xl md:text-5xl font-bold hover:text-blue-700 transition-colors tracking-tight underline decoration-gray-200 underline-offset-8 hover:decoration-blue-700"
				>
					hello@kogby.dev
				</a>
			</Container>
		</section>
	);
}
