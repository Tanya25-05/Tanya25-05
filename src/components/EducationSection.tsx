import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import Timeline from "./Timeline";

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

export default function EducationSection() {
  return (
    <section
      id="education"
      data-stream-checkpoint="Education"
      data-stream-x="20"
      className="relative max-w-4xl mx-auto px-6 py-16 w-full"
    >
      <SectionHeading index="05">Education</SectionHeading>
      <Reveal>
        <Timeline items={education} />
      </Reveal>
    </section>
  );
}
