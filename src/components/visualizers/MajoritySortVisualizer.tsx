import { Frame, Arrow } from "./primitives";
import type { VisualizerProps } from "./types";

// Sorting approach — shows the sorted array with the middle element
// highlighted as the majority.
export function MajoritySortVisualizer({ step, nums }: VisualizerProps) {
  const sortedVar = step.vars.find((v) => v.name === "sorted");
  const sorted = sortedVar
    ? sortedVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : nums.map(String);
  const mid = Math.floor(sorted.length / 2);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">sorted</span>
        <div className="flex flex-wrap justify-center gap-1.5">
          {sorted.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                  idx === mid
                    ? "bg-emerald-100 border-emerald-500 text-emerald-700 shadow-[0_0_14px_rgba(16,185,129,0.5)]"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                {v}
              </div>
              <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
              <div className="h-5">{idx === mid ? <Arrow kind="found" label="mid" /> : null}</div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
