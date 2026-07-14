import Link from "next/link";
import Hero from "@/components/Hero";
import Studying from "@/components/Studying";
import Container from "@/components/ui/Container";
import { highlightMetrics } from "@/components/ui/Metric";
import { projects, lifeList } from "@/lib/data";

// ponytail: featured = first three projects; career.json already orders by strength
const featured = projects.slice(0, 3);

function SelectedWork() {
  return (
    <section className="py-20 border-t border-gray-100">
      <Container>
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Selected Work</h2>
            <div className="h-1 w-20 bg-black"></div>
          </div>
          <Link
            href="/projects"
            className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            All projects →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((p) => (
            <Link
              key={p.id}
              href="/projects"
              className="group flex flex-col p-6 border border-gray-200 rounded-xl hover:border-black/30 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="font-bold leading-snug mb-2 group-hover:text-accent-primary transition-colors">
                {p.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{p.summary}</p>
              {p.metrics && (
                <p className="text-sm text-gray-800 mb-4">{highlightMetrics(p.metrics)}</p>
              )}
              <div className="mt-auto flex flex-wrap gap-1.5">
                {p.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2 py-0.5 border border-gray-200 text-gray-500 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function LifeTeaser() {
  return (
    <section className="py-20 border-t border-gray-100">
      <Container>
        <div className="max-w-2xl">
          <h2
            className="text-4xl md:text-5xl tracking-tight mb-6"
            style={{ fontFamily: "var(--font-handwriting)" }}
          >
            Beyond the terminal ✦
          </h2>
          <ul
            className="space-y-2 text-2xl text-gray-800 mb-6"
            style={{ fontFamily: "var(--font-handwriting)" }}
          >
            {lifeList.slice(0, 3).map((item) => (
              <li key={item.id}>
                <span className="text-gray-400 mr-3">{String(item.id).padStart(2, "0")}.</span>
                {item.text}
              </li>
            ))}
          </ul>
          <Link
            href="/life"
            className="text-lg text-gray-500 hover:text-black transition-colors"
            style={{ fontFamily: "var(--font-handwriting)" }}
          >
            the whole life list →
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Studying />
      <LifeTeaser />
    </>
  );
}
