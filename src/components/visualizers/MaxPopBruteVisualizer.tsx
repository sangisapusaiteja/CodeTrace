import { Frame, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force — show logs as [birth, death] pairs with pointer i and year.
export function MaxPopBruteVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const yearVar = step.vars.find((v) => v.name === "year");
  const countVar = step.vars.find((v) => v.name === "count");
  const maxVar = step.vars.find((v) => v.name === "maxPop");
  const year = yearVar ? yearVar.value : "";
  const count = countVar ? countVar.value : "";
  const maxPop = maxVar ? maxVar.value : "";

  const pairs: [number, number][] = [];
  for (let k = 0; k + 1 < nums.length; k += 2) pairs.push([nums[k], nums[k + 1]]);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {pairs.map((p, idx) => {
            const isCurrent = idx === i;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`flex items-center gap-1 rounded-lg border-2 px-2 py-1 font-mono text-sm font-semibold ${isCurrent ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]" : "bg-white border-gray-300 text-gray-800"}`}>
                  <span>{p[0]}</span>
                  <span className="text-gray-400">→</span>
                  <span>{p[1]}</span>
                </div>
                <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                <div className="h-5">{isCurrent && <span className="font-mono text-[13px] font-bold text-red-600">i</span>}</div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {year && (
            <div className="rounded-md border border-gray-200 bg-white px-3 py-1 font-mono text-xs font-semibold text-gray-700">
              year = {year}
            </div>
          )}
          {count && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1 font-mono text-xs font-semibold text-amber-700">
              count = {count}
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
