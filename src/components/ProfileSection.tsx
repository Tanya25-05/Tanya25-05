"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SpotlightText from "./SpotlightText";

const ABOUT_PARAGRAPHS = [
  "I'm Tanya, an M.Tech graduate in Artificial Intelligence, currently exploring physical AI — how models perceive and act in the real world — alongside agentic workflows: orchestration, tool-calling, and getting multiple agents to coordinate without falling apart.",
  "I also think a lot at the system-design level — how queues, caching, and observability hold up under real load, since that's usually what decides whether something ships. My internships at DRDO and RoboMQ lived in that space: pipelines, monitoring, and the plumbing that keeps a system reliable.",
  "Outside of that, I like keeping my hands on things — small experiments, not just theory. I'd rather be honest about what I'm still learning than pretend otherwise, and I love connecting with people; the best systems still get built around real conversations.",
];

const skills = [
  "Python",
  "PyTorch",
  "Hugging Face",
  "LLMs",
  "Prompt Engineering",
  "Docker",
  "Agentic AI",
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
                className="object-cover select-none"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          </div>
        </div>
        <div>
          <SectionHeading index="01">About</SectionHeading>
          <Reveal>
            <div className="text-sm leading-relaxed max-w-lg space-y-4">
              {ABOUT_PARAGRAPHS.map((text) => (
                <SpotlightText key={text} baseColor="#52525b">
                  {text}
                </SpotlightText>
              ))}
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
