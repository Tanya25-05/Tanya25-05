import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const experience = [
  {
    role: "AI/ML Project Intern",
    company: "DRDO, Ministry of Defence · Delhi",
    duration: "July 2025 — April 2026",
    points: [
      "Built an end-to-end ML pipeline to detect anomalies in maritime time-series data, enabling identification of irregular operational patterns.",
      "Performed feature engineering and preprocessing on multi-source signal data.",
      "Performed multilingual translation for a chat-based application.",
    ],
  },
  {
    role: "Associate Software Engineer",
    company: "RoboMQ · Jaipur",
    duration: "Jan 2024 — August 2024",
    points: [
      "Built real-time microservices monitoring using Python, Prometheus, and Alertmanager, improving alert accuracy and reducing false positives.",
      "Merged AWS CloudWatch Exporter with Prometheus to monitor RDS (MySQL, PostgreSQL) and ElastiCache (Redis), and set up Grafana dashboards for live metrics and incident visibility.",
      "Automated incident notifications via Microsoft Teams using Power Automate, improving response efficiency by 30%.",
      "Reduced duplicate alerts by 50% by refining alert rules and suppressing redundant notifications across NATs.",
    ],
  },
];

const education = [
  {
    role: "M.Tech, Artificial Intelligence",
    company: "Banasthali Vidyapith",
    duration: "2024 — 2026",
    points: ["CGPA: 8.93 / 10.0"],
  },
  {
    role: "B.Tech (Honors), Computer Science and Engineering",
    company: "Rajasthan Technical University",
    duration: "2020 — 2024",
    points: ["CGPA: 9.62 / 10.0"],
  },
];

function Timeline({ items }: { items: typeof experience }) {
  return (
    <div className="relative pl-6 space-y-10 border-l-2 border-pink-100">
      {items.map((e) => (
        <div key={e.role + e.company} className="relative">
          <div className="absolute -left-6.75 top-1 w-3 h-3 rounded-full bg-linear-to-br from-pink-500 to-amber-400 ring-4 ring-white" />
          <p className="font-mono text-xs tracking-wide text-zinc-500 mb-1">
            {e.duration}
          </p>
          <h3 className="font-semibold text-sm">
            {e.role} &middot; {e.company}
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-zinc-600 list-disc list-inside">
            {e.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      data-stream-checkpoint="Experience"
      data-stream-x="80"
      className="relative max-w-4xl mx-auto px-6 py-16 w-full"
    >
      <SectionHeading index="04">Experience</SectionHeading>
      <Reveal>
        <Timeline items={experience} />

        <h3 className="font-mono text-xs tracking-[0.2em] text-zinc-500 uppercase mt-12 mb-6">
          Education
        </h3>
        <Timeline items={education} />
      </Reveal>
    </section>
  );
}
