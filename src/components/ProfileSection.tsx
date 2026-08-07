import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const skills = [
  "Python",
  "PyTorch",
  "Hugging Face",
  "LLMs",
  "Prompt Engineering",
  "Docker",
  "Kubernetes",
  "AWS",
];

export default function ProfileSection() {
  return (
    <section
      id="about"
      data-stream-checkpoint="About"
      data-stream-x="20"
      className="relative max-w-4xl mx-auto px-6 py-20 w-full"
    >
      <div className="flex flex-col sm:flex-row items-center gap-10">
        <div className="shrink-0 relative">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-5 bg-pink-200/70 -rotate-3 shadow-sm z-10" />
          <div className="w-48 bg-white p-3 pb-8 rounded-sm -rotate-3 shadow-[0_10px_28px_rgba(0,0,0,0.18)]">
            {/* Drop your photo at public/about/photo.jpg */}
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-zinc-200">
              <Image
                src="/about/photo.jpg"
                alt="Tanya Verma"
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
        <div>
          <SectionHeading index="01">About</SectionHeading>
          <Reveal>
            <div className="text-zinc-600 text-sm leading-relaxed max-w-lg space-y-4">
              <p>
                I&apos;m Tanya, an M.Tech graduate in Artificial Intelligence.
                Lately I&apos;ve been going deep on physical AI — how models
                perceive and act in the real world, not just generate text —
                alongside agentic workflows: orchestration, tool-calling, and
                getting multiple agents to coordinate on a task without
                falling apart.
              </p>
              <p>
                Alongside that, I spend a lot of time thinking at the
                system-design level — how the pieces around a model (queues,
                caching, service boundaries, observability) hold up under real
                load, since that&apos;s usually what decides whether something
                ships or stays a notebook. My internships at DRDO and RoboMQ
                mostly lived in that space: pipelines, monitoring, and the
                unglamorous plumbing that makes a system actually reliable.
              </p>
              <p>
                Outside of that, I like keeping my hands on things — small
                experiments and side projects, not just theory. I&apos;m still
                learning a lot of this as I go, and I&apos;d rather be honest
                about that than pretend otherwise. I also love connecting with
                people — the best systems still get built around real
                conversations.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {skills.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[11px] tracking-wide text-zinc-500 bg-zinc-100 rounded-full px-2.5 py-1"
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
