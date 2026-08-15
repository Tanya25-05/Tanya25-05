import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import Timeline from "./Timeline";

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
  {
    role: "Software Development Intern",
    company: "Aditya Birla Group",
    duration: "March 2023 — July 2023",
    points: [
      "Built a visitor entrance feature for a residential security app, letting visitors request gate entry that a resident verifies and approves before access is granted.",
    ],
  },
];

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
      </Reveal>
    </section>
  );
}
