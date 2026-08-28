import { supabaseAdminRequest, supabaseServerEnabled } from "@/lib/supabase-rest";

export const databaseProblemsEnabled = supabaseServerEnabled;

export interface Problem {
  slug: string;
  title: string;
  categoryId: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  constraints: string;
  versions: { id: string; name: string; source: string }[];
}

interface ProblemRow {
  id: string;
  slug: string;
  title: string;
  category_id: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  constraints: string | null;
}

interface VersionRow {
  problem_id: string;
  version_id: string;
  name: string;
  source: string;
}

export async function loadProblems(): Promise<Problem[]> {
  if (!supabaseServerEnabled) return [];

  const problems = await supabaseAdminRequest<ProblemRow[]>("viz_problems", {
    query: { select: "id,slug,title,category_id,difficulty,description,constraints", order: "sort_order.asc" },
  });

  const versionRows = await supabaseAdminRequest<VersionRow[]>("viz_problem_versions", {
    query: { select: "problem_id,version_id,name,source", order: "sort_order.asc" },
  });

  const versionsByProblem = new Map<string, { id: string; name: string; source: string }[]>();
  for (const v of versionRows) {
    const list = versionsByProblem.get(v.problem_id) ?? [];
    list.push({ id: v.version_id, name: v.name, source: v.source });
    versionsByProblem.set(v.problem_id, list);
  }

  return problems.map((p) => ({
    slug: p.slug,
    title: p.title,
    categoryId: p.category_id,
    difficulty: p.difficulty,
    description: p.description,
    constraints: p.constraints ?? "",
    versions: versionsByProblem.get(p.id) ?? [],
  }));
}
