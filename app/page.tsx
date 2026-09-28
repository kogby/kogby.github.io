import Hero from "@/components/Hero";
import Bio from "@/components/Bio";
import VennMap from "@/components/VennMap";
import Experience from "@/components/Experience";
import ProjectList from "@/components/ProjectList";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Bio />
      <VennMap />
      <Experience />
      <ProjectList />
      <Contact />
    </>
  );
}
