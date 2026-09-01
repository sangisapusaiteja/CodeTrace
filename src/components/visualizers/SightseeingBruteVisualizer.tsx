import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force — show values with i and j pointers, score, maxScore.
export function SightseeingBruteVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const j = collectIdx(step, "j");
  const scoreVar = step.vars.find((v) => v.name === "score");
  const maxVar = step.vars.find((v) => v.name === "maxScore");
  const score = scoreVar ? scoreVar.value : "";
  const maxScore = maxVar ? maxVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => {
            const isI = idx === i;
            const isJ = idx === j;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${isI ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]" : isJ ? "bg-orange-100 border-orange-500 text-orange-700 shadow-[0_0_12px_rgba(249,115,22,0.5)]" : "bg-white border-gray-300 text-gray-800"}`}>
                  {v}
                </div>
                <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                <div className="h-5">{isI ? <Arrow kind="i" label="i" /> : isJ ? <Arrow kind="j" label="j" /> : null}</div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {score && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1 font-mono text-xs font-semibold text-amber-700">
              score = {score}
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
