import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Renders a binary array, tracking index i with arrows and showing the
// current run of consecutive 1s as active cells.
export function MaxConsecutiveOnesVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");

  const states = nums.map((_, idx) => {
    if (idx === i) return "i";
    if (idx < (i ?? -1) && nums[idx] === 1) return "active";
    return "idle";
  });
  const subs = nums.map((_, idx) =>
    idx === i ? <Arrow key={idx} kind="i" label="i" /> : null
  );

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-wrap justify-center gap-2">
        {nums.map((v, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg font-mono text-lg font-semibold transition-all duration-200 ${
                states[idx] === "i"
                  ? "bg-red-50 border-2 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.45)]"
                  : states[idx] === "active"
                  ? "bg-emerald-50 border-2 border-emerald-500 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.45)]"
                  : "bg-white border border-gray-300 text-gray-800"
              }`}
            >
              {v}
            </div>
            {subs[idx]}
          </div>
        ))}
      </div>
    </Frame>
  );
}
