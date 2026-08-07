import Card from "@/components/Card";
import ExperienceSection from "@/components/ExperienceSection";
import GithubProjects from "@/components/GithubProjects";
import Hero from "@/components/Hero/Hero";
import Illustrations from "@/components/Illustrations";
import ProfileSection from "@/components/ProfileSection";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import SocialIcons from "@/components/SocialIcons";
import WaterStream from "@/components/WaterStream";

const featuredProjects = [
  {
    title: "Autonomous Driving Vehicle (CARLA)",
    description:
      "Hybrid RL pipeline (DQN + Xception) with a CNN perception system for lane/edge detection, trained on synthetic CARLA data.",
    color: "#d8f0f0",
  },
  {
    title: "Language Translation",
    description:
      "Secure, low-latency Swahili–English translation system using a fine-tuned LLM for government communication workflows.",
    color: "#f0d8f0",
  },
  {
    title: "NMAP Scan Automation",
    description:
      "Automated vulnerability scanning pipeline enumerating subdomains and running scheduled Nmap scans via cron, wired into CI/CD.",
    color: "#d8e8e8",
  },
];

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
          <h3 className="font-mono text-xs tracking-[0.2em] text-zinc-500 uppercase mt-10 mb-4">
            Featured Projects
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProjects.map((p) => (
              <Card key={p.title} {...p} />
            ))}
          </div>
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
