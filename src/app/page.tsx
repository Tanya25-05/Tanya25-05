import ContactSection from "@/components/Contact/ContactSection";
import EducationSection from "@/components/EducationSection";
import ExperienceSection from "@/components/ExperienceSection";
import GithubProjects from "@/components/GithubProjects";
import Hero from "@/components/Hero/Hero";
import Illustrations from "@/components/Illustrations";
import ProfileSection from "@/components/ProfileSection";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import WaterStream from "@/components/WaterStream";

export default function Home() {
  return (
    <div className="relative flex-1 flex flex-col">
      <WaterStream />

      <Hero />

      <ProfileSection />

      <section
        id="projects"
        data-stream-checkpoint="Projects"
        data-stream-x="80"
        className="relative max-w-4xl mx-auto px-6 py-16 w-full"
      >
        <SectionHeading index="02">Projects</SectionHeading>
        <Reveal>
          <GithubProjects />
        </Reveal>
      </section>

      <Illustrations />

      <ExperienceSection />

      <EducationSection />

      <section
        id="contact"
        data-stream-checkpoint="Contact"
        data-stream-x="50"
        className="relative max-w-5xl mx-auto px-6 py-20 w-full"
      >
        <SectionHeading index="06">Contact</SectionHeading>

        {/* SectionHeading's own mb-8 (32px) is shared by every section
            on the page — pulling just this one closer without touching
            that shared spacing, down to a 16px net gap. */}
        <Reveal className="-mt-4">
          <ContactSection />
        </Reveal>
      </section>
    </div>
  );
}
