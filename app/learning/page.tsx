import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Education from "@/components/Education";
import Studying from "@/components/Studying";
import CourseworkList from "@/components/CourseworkList";

export const metadata: Metadata = { title: "Learning | kogby" };

export default function LearningPage() {
  return (
    <>
      <section className="pt-20 pb-16 md:pt-28">
        <Container>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            I&apos;m a broad learner.
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
            Systems, machine learning, data, and the occasional book on how to think. This is what
            I&apos;ve studied, and what I&apos;m reading now.
          </p>
        </Container>
      </section>
      <Education />
      <Studying />
      <CourseworkList />
    </>
  );
}
