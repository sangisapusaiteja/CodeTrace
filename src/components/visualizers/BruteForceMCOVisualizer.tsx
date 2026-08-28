import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force visualizer — shows the run being counted from each start (i→j).
// Uses a horizontal "ruler" look: cells with index labels and a sliding window.
export function BruteForceMCOVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const j = collectIdx(step, "j");

  const states = nums.map((_, idx) => {
    if (idx === i) return "i";
    if (idx === j) return "j";
    if (i !== null && j !== null && idx >= i && idx <= j && nums[idx] === 1) return "active";
    return "idle";
  });

  const subs = nums.map((_, idx) => {
    if (idx === i) return <Arrow key={idx} kind="i" label="start" />;
    if (idx === j) return <Arrow key={idx} kind="j" label="scan" />;
    return null;
  });

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`flex h-12 w-14 items-center justify-center rounded-md font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                  states[idx] === "i"
                    ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_14px_rgba(239,68,68,0.5)]"
                    : states[idx] === "j"
                    ? "bg-orange-100 border-orange-500 text-orange-700 shadow-[0_0_14px_rgba(249,115,22,0.5)]"
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
