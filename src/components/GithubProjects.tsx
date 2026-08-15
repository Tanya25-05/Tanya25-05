"use client";

import { useEffect, useState } from "react";
import SpotlightText from "./SpotlightText";

const GITHUB_USERNAME = "Tanya25-05";

// Curated on purpose — the account has several throwaway/experiment
// repos that don't belong on the site. Only repo names listed here
// are shown, in this order; everything else fetched from the API is
// dropped.
const ALLOWED_REPOS = [
  "tenxo",
  "Sentinel",
  "CARLA_Latest_Project",
  "ytanalytix",
  "Timex",
  "Emotunes",
  "log-foot-calculator",
];

// Per-repo overrides for display — falls back to the repo's own name
// (title) and GitHub description when not listed here. `category` is
// the small mono eyebrow above the title (kept as a technical/domain
// tag, not a job-title style role). `url`, when present, is a real
// live product link — left unset entirely rather than falling back to
// the GitHub repo, so the link line only ever shows up where there's
// somewhere genuinely worth sending a visitor.
const PROJECT_OVERRIDES: Record<
  string,
  { title?: string; category: string; description: string; url?: string }
> = {
  CARLA_Latest_Project: {
    title: "Autonomous Driving Vehicle",
    category: "Reinforcement Learning",
    description:
      "Hybrid reinforcement-learning pipeline combining a DQN policy with an Xception-based CNN perception stack for lane and edge detection, trained end-to-end on synthetic driving data generated in the CARLA simulator.",
  },
  Sentinel: {
    category: "Autonomous Security Testing",
    description:
      "Clones a repository into an isolated, ephemeral Docker/Firecracker sandbox and runs Semgrep, Trivy, CodeQL, Bandit, OWASP ZAP, and Gitleaks against it. A FastAPI backend queues scans through Redis, persists findings in PostgreSQL, and an Ollama-hosted Llama 3.2 model reasons over the results to prioritize vulnerabilities and draft remediations — without ever modifying the target repo.",
  },
  tenxo: {
    category: "Decentralized Compute",
    description:
      "Decentralized GPU compute marketplace where workloads run end-to-end encrypted on provider hardware. A Go matchmaker routes jobs over NATS without ever touching the encryption keys; a Rust edge agent performs an ECDH handshake, spins up an ephemeral LUKS2-encrypted container per job, and shreds it after execution, so the provider never sees plaintext code or data.",
    url: "http://tenxo.xyz/",
  },
  ytanalytix: {
    category: "AI Content Tooling",
    description:
      "BYOK YouTube analytics tool built on Astro — plug in your own YouTube Data and LLM API keys and it scores a video's title, hook, and script against heuristics pulled from competitor analysis, then generates ranked titles, descriptions, tags, and thumbnail briefs.",
  },
  Timex: {
    category: "Browser Extension",
    description:
      "Chrome extension (Vite + vanilla JS) that hooks into the tabs API to log time spent per open tab in the background, then surfaces the breakdown in a companion analysis dashboard for browsing and time management.",
  },
  Emotunes: {
    category: "Computer Vision",
    description:
      "React app that reads a user's facial expression through webcam-based emotion detection and recommends songs matching the detected mood in real time.",
  },
  "log-foot-calculator": {
    title: "Board Foot Calculator",
    category: "Utility",
    description:
      "Single-purpose microtool for computing board footage from lumber dimensions.",
    url: "https://boardfootcal.com",
  },
};

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
};

function formatLinkLabel(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "").toUpperCase();
}

export default function GithubProjects() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
    )
      .then((res) => {
        if (!res.ok) throw new Error("GitHub API request failed");
        return res.json();
      })
      .then((data: Repo[]) => {
        if (cancelled) return;
        const byName = new Map(data.map((r) => [r.name, r]));
        const filtered = ALLOWED_REPOS.map((name) => byName.get(name)).filter(
          (r): r is Repo => r !== undefined
        );
        setRepos(filtered);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <p className="text-sm text-zinc-400">
        Couldn&apos;t load repositories —{" "}
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-pink-500 transition-colors"
        >
          view on GitHub
        </a>
        .
      </p>
    );
  }

  if (!repos) {
    return (
      <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-xl bg-zinc-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-2">
      {repos.map((repo, i) => {
        const override = PROJECT_OVERRIDES[repo.name];
        return (
          <div key={repo.id}>
            <p className="font-mono text-xs tracking-[0.15em] text-zinc-400 mb-2">
              № {String(i + 1).padStart(2, "0")} — {(override?.category ?? repo.language ?? "Project").toUpperCase()}
            </p>
            {/* Title + description are one link to the repo itself —
                clickable anywhere in the text, not just a small arrow
                line — while the "visit site" link below (when one
                exists) stays a separate sibling link rather than a
                nested anchor, since anchors can't nest. */}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <h3 className="font-serif text-4xl text-zinc-900 mb-3 transition-colors group-hover:text-pink-600">
                {override?.title ?? repo.name}
              </h3>
              <div className="w-10 h-px bg-pink-300 mb-3" aria-hidden />
              <SpotlightText className="text-sm leading-6" baseColor="#52525b">
                {override?.description || repo.description || "No description provided."}
              </SpotlightText>
            </a>
            {override?.url && (
              <a
                href={override.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-mono text-xs tracking-[0.1em] text-pink-500 underline decoration-pink-200 underline-offset-4 hover:text-pink-600 transition-colors"
              >
                {formatLinkLabel(override.url)} ↗
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
