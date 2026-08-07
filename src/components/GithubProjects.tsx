"use client";

import { useEffect, useState } from "react";

const GITHUB_USERNAME = "Tanya25-05";

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
        const filtered = data
          .filter((r) => !r.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-zinc-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {repos.map((repo) => (
        <a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-200 p-4"
        >
          <h3 className="font-semibold text-sm mb-1">{repo.name}</h3>
          <p className="text-xs text-zinc-500 leading-relaxed mb-3 line-clamp-2">
            {repo.description || "No description provided."}
          </p>
          <div className="font-mono text-[11px] tracking-wide text-zinc-400">
            {repo.language && <span>{repo.language} &middot; </span>}
            <span>★ {repo.stargazers_count}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
