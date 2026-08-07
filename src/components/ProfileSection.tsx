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
                I&apos;m Tanya, an AI engineer who builds systems that reason,
                plan, and act — not just chat. My focus is agentic workflows:
                architectures where language models call tools, coordinate with
                other agents, and carry state across multi-step tasks to get
                real work done, instead of returning a single one-shot answer.
              </p>
              <p>
                Most of my time goes into the scaffolding around the model
                itself — orchestration logic, memory, tool integrations, and
                evaluation loops that catch failures before they reach a user.
                That&apos;s the unglamorous plumbing that decides whether an
                agent is actually reliable in production or just an impressive
                demo, and I care a lot about getting it right.
              </p>
              <p>
                Outside of agent architecture, I&apos;m endlessly curious about
                how far autonomous systems can go before a human needs to stay
                in the loop, and I like keeping my hands on the tools I build —
                small experiments and side projects, not just theory. Above
                all, I love connecting to humans — the best systems still get
                built around real conversations.
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
