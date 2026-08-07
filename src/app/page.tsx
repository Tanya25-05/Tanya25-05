import ExperienceSection from "@/components/ExperienceSection";
import GithubProjects from "@/components/GithubProjects";
import Hero from "@/components/Hero/Hero";
import Illustrations from "@/components/Illustrations";
import ProfileSection from "@/components/ProfileSection";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import SocialIcons from "@/components/SocialIcons";
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

      <section
        id="contact"
        data-stream-checkpoint="Contact"
        data-stream-x="50"
        className="relative max-w-4xl mx-auto px-6 py-20 w-full text-center"
      >
        <SectionHeading index="05">Contact</SectionHeading>
        <Reveal className="flex flex-col items-center">
          <p className="text-zinc-600 mb-6">Let&apos;s work together.</p>
          <a
            href="mailto:vermatanya932@gmail.com"
            className="inline-block px-5 py-2.5 bg-linear-to-r from-pink-500 to-amber-400 text-white text-sm rounded-lg hover:brightness-105 transition-all mb-8"
          >
            Email Me
          </a>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-zinc-500">Find me elsewhere</p>
            <SocialIcons />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
