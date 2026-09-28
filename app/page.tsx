import Hero from "@/components/Hero";
import Bio from "@/components/Bio";
import Experience from "@/components/Experience";
import ProjectList from "@/components/ProjectList";
import Skills from "@/components/Skills";
import CourseworkList from "@/components/CourseworkList";
import Studying from "@/components/Studying";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Bio />
      <Experience />
      <ProjectList />
      <Skills />
      <CourseworkList />
      <Studying />
      <Contact />
    </>
  );
}
