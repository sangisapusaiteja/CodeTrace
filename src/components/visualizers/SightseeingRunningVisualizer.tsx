import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Decomposition with Running Maximum — show values with pointer j, maxLeftScore, maxScore.
export function SightseeingRunningVisualizer({ step, nums }: VisualizerProps) {
  const j = collectIdx(step, "j");
  const leftVar = step.vars.find((v) => v.name === "maxLeftScore");
  const maxVar = step.vars.find((v) => v.name === "maxScore");
  const maxLeftScore = leftVar ? leftVar.value : "";
  const maxScore = maxVar ? maxVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => {
            const isCurrent = idx === j;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${isCurrent ? "bg-emerald-100 border-emerald-500 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-white border-gray-300 text-gray-800"}`}>
                  {v}
                </div>
                <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                <div className="h-5">{isCurrent && <Arrow kind="j" label="j" />}</div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {maxLeftScore && (
            <div className="rounded-md border border-sky-200 bg-sky-50 px-3 py-1 font-mono text-xs font-semibold text-sky-700">
              maxLeftScore = {maxLeftScore}
            </div>
          )}
          {maxScore && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-xs font-semibold text-emerald-700">
              maxScore = {maxScore}
            </div>
          )}
        </div>
      </div>
    </Frame>
  );
}
