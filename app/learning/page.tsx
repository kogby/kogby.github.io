import Container from "@/components/ui/Container";
import Education from "@/components/Education";
import Studying from "@/components/Studying";
import CourseworkList from "@/components/CourseworkList";

export default function LearningPage() {
  return (
    <>
      <Container className="pt-12 pb-12">
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
          I started in information management, got pulled into data science, then backend and
          distributed systems, and now ML infrastructure, down to GPU kernels. I like solving
          real-world problems that benefit people directly, and I learn whatever those problems need.
          Here&apos;s the formal side, and what I&apos;m reading now.
        </p>
      </Container>
      <Education />
      <Studying />
      <CourseworkList />
    </>
  );
}
