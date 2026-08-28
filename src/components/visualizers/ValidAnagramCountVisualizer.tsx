import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Hash Map (Frequency Count) — show the count array.
export function ValidAnagramCountVisualizer({ step }: VisualizerProps) {
  const countVar = step.vars.find((v) => v.name === "count");
  const count = countVar
    ? countVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter((s) => s !== "").map(Number)
    : [];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">count (a–z)</span>
          <div className="flex flex-wrap justify-center gap-1">
            {count.map((v, idx) => (
              <div key={idx} className={`flex h-8 w-8 items-center justify-center rounded-md border font-mono text-xs font-semibold ${v !== 0 ? "bg-red-50 border-red-300 text-red-700" : "bg-emerald-50 border-emerald-300 text-emerald-700"}`}>
                {v}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}
