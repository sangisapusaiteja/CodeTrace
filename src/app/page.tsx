import Link from "next/link";
import { Columns3, ArrowRight, Code, Type, Binary, Hash, MoveRight } from "lucide-react";
import { loadProblems, databaseProblemsEnabled } from "@/lib/api/problems";
import { EmptyState } from "@/components/EmptyState";
import { LogoutButton } from "@/components/LogoutButton";
import LogoMark from "@/components/LogoMark";

const CATEGORY_META: Record<string, { title: string; icon: string; color: string }> = {
  arrays: { title: "Arrays", icon: "Columns3", color: "from-emerald-500 to-teal-400" },
  strings: { title: "Strings", icon: "Type", color: "from-sky-500 to-blue-400" },
  "bit-manipulation": { title: "Bit Manipulation", icon: "Binary", color: "from-violet-500 to-purple-400" },
  "hash-table": { title: "Hash Table", icon: "Hash", color: "from-fuchsia-500 to-pink-400" },
  "two-pointers": { title: "Two Pointers", icon: "MoveRight", color: "from-teal-500 to-cyan-400" },
};

const DEFAULT_CATEGORY_META = { title: "Problems", icon: "Code", color: "from-neutral-500 to-neutral-400" };
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Columns3, Code, Type, Binary, Hash, MoveRight };

function DifficultyBadge({ d }: { d: string }) {
  const cls =
    d === "easy"
      ? "bg-accent/10 text-accent border-accent/20"
      : d === "medium"
      ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
      : "bg-rose-400/10 text-rose-400 border-rose-400/20";
  return <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold border ${cls}`}>{d}</span>;
}

export default async function DashboardPage() {
  if (!databaseProblemsEnabled) {
    return <EmptyState message="Supabase is not configured. Add your Supabase keys in .env.local." />;
  }

  let problems;
  try {
    problems = await loadProblems();
  } catch {
    return <EmptyState message="Could not reach Supabase. Check your connection and that the tables exist." />;
  }

  const groups = new Map<string, typeof problems>();
  for (const p of problems) {
    const list = groups.get(p.categoryId) ?? [];
    list.push(p);
    groups.set(p.categoryId, list);
  }

  return (
    <div className="min-h-screen bg-surface text-text">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <LogoMark size="xs" />
            <span className="text-lg font-black">
              Code<span className="text-accent">Trace</span>
            </span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-accent">
            Watch algorithms run line by line
          </p>
          <h1 className="mx-auto mt-3 max-w-2xl text-4xl font-black text-text sm:text-5xl">
            Step through code with a <span className="text-accent">live visualization</span>
          </h1>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {groups.size === 0 && (
          <p className="py-20 text-center text-text-muted">No problems found.</p>
        )}

        {Array.from(groups.entries()).map(([catId, catProblems]) => {
          const meta = CATEGORY_META[catId] ?? DEFAULT_CATEGORY_META;
          const Icon = iconMap[meta.icon] ?? Code;
          return (
            <section key={catId} className="mb-12">
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${meta.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text">{meta.title}</h2>
                  <p className="text-xs text-text-dim">
                    {catProblems.length} problem{catProblems.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {catProblems.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/problem/${p.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${meta.color}`} />
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-text">{p.title}</h3>
                      <DifficultyBadge d={p.difficulty} />
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted line-clamp-2">{p.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-text-dim">
                        {p.versions.length} approach{p.versions.length === 1 ? "" : "es"}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-accent">
                        Visualize
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
