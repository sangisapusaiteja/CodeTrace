"use client";

import { useEffect, useState } from "react";

export interface Problem {
  slug: string;
  title: string;
  categoryId: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  constraints: string;
  versions: { id: string; name: string; source: string }[];
}

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/problems", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (active) setProblems(data.problems ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return { problems, loaded };
}
