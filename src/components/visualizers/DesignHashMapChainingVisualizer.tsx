import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Array of Linked Lists (Chaining) — show the buckets with chained nodes.
export function DesignHashMapChainingVisualizer({ step }: VisualizerProps) {
  const opVar = step.vars.find((v) => v.name === "op");
  const bucketsVar = step.vars.find((v) => v.name === "buckets");
  const op = opVar ? opVar.value : "";
  const buckets = bucketsVar ? bucketsVar.value : "";

  // Parse bucket desc like "b0: | b1: 1:10 → 6:30 | b2: 2:20 | ..."
  const bucketEntries: { idx: number; nodes: { key: number; value: number }[] }[] = [];
  if (buckets) {
    const parts = buckets.split("|");
    for (const part of parts) {
      const trimmed = part.trim();
      const m = trimmed.match(/^b(\d+):(.*)$/);
      if (m) {
        const idx = Number(m[1]);
        const nodes = m[2].trim() === "" ? [] : m[2].split("→").map((s) => {
          const [k, v] = s.trim().split(":");
          return { key: Number(k), value: Number(v) };
        });
        bucketEntries.push({ idx, nodes });
      }
    }
  }

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-sm font-bold text-fuchsia-700">
          {op || "initializing"}
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-fuchsia-600">buckets (chaining)</span>
          <div className="flex flex-wrap justify-center gap-2">
            {bucketEntries.map((b) => (
              <div key={b.idx} className="flex items-center gap-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-fuchsia-100 border-2 border-fuchsia-400 font-mono text-sm font-bold text-fuchsia-700">
                  {b.idx}
                </div>
                {b.nodes.length === 0 ? (
                  <div className="text-xs text-gray-400">null</div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    {b.nodes.map((n, ni) => (
                      <div key={ni} className="flex items-center gap-1.5">
                        {ni > 0 && <span className="text-xs text-gray-400">→</span>}
                        <div className="rounded-md bg-white border border-gray-300 px-2 py-1 font-mono text-xs font-semibold text-gray-700">
                          {n.key}:{n.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}
