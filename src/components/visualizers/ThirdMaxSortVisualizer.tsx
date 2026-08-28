import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Sorting approach — shows the sorted array with a backward scan pointer (i)
// and highlights the distinct values counted so far.
export function ThirdMaxSortVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const sortedVar = step.vars.find((v) => v.name === "sorted");
  const sorted = sortedVar
    ? sortedVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : nums.map(String);

  const states = sorted.map((_, idx) => {
    if (idx === i) return "i";
    if (idx > (i ?? sorted.length)) return "active"; // already counted (larger)
    return "idle";
  });
  const subs = sorted.map((_, idx) =>
    idx === i ? <Arrow key={idx} kind="i" label="i" /> : null
  );

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Sorted (ascending) — scanning backward
        </span>
        <div className="flex flex-wrap justify-center gap-1.5">
          {sorted.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                  states[idx] === "i"
                    ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                    : states[idx] === "active"
                    ? "bg-emerald-100 border-emerald-500 text-emerald-700"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                {v}
              </div>
              <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
              <div className="h-5">{subs[idx]}</div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
