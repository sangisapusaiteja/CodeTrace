import { Frame, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Line Sweep (Difference Array) — show the delta array and running sum.
export function MaxPopSweepVisualizer({ step, nums }: VisualizerProps) {
  const j = collectIdx(step, "j");
  const runVar = step.vars.find((v) => v.name === "runningSum");
  const maxVar = step.vars.find((v) => v.name === "maxPop");
  const runningSum = runVar ? runVar.value : "";
  const maxPop = maxVar ? maxVar.value : "";

  const pairs: [number, number][] = [];
  for (let k = 0; k + 1 < nums.length; k += 2) pairs.push([nums[k], nums[k + 1]]);

  const delta = new Array(101).fill(0);
  for (const [b, d] of pairs) {
    delta[b - 1950]++;
    delta[d - 1950]--;
  }

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {pairs.map((p, idx) => (
            <div key={idx} className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1 font-mono text-sm font-semibold text-gray-800">
              <span>{p[0]}</span>
              <span className="text-gray-400">→</span>
              <span>{p[1]}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-fuchsia-500">delta (years 1950-2050)</span>
          <div className="flex flex-wrap justify-center gap-1">
            {delta.map((v, idx) => (
              <div key={idx} className={`flex h-7 w-7 items-center justify-center rounded-md border font-mono text-xs font-semibold ${idx === j ? "border-fuchsia-500 bg-fuchsia-100 text-fuchsia-700 shadow-[0_0_10px_rgba(217,70,239,0.4)]" : v !== 0 ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700" : "border-gray-200 bg-gray-50 text-gray-400"}`}>
                {v}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {runningSum && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1 font-mono text-xs font-semibold text-amber-700">
              runningSum = {runningSum}
            </div>
          )}
          {maxPop && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-xs font-semibold text-emerald-700">
              maxPop = {maxPop}
            </div>
          )}
        </div>
      </div>
    </Frame>
  );
}
