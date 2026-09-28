import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Education from "@/components/Education";
import Studying from "@/components/Studying";
import CourseworkList from "@/components/CourseworkList";

export const metadata: Metadata = { title: "Learning | kogby" };

export default function LearningPage() {
  return (
    <>
      <Container className="pt-12 pb-12">
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
          I&apos;m a broad learner: systems, machine learning, data, and the occasional book on how to
          think. This is what I&apos;ve studied, and what I&apos;m reading now.
        </p>
      </Container>
      <Education />
      <Studying />
      <CourseworkList />
    </>
  );
}
