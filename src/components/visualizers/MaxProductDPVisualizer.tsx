import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Dynamic Programming (Track Min and Max) — show nums with pointer i, max/min/result.
export function MaxProductDPVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const maxVar = step.vars.find((v) => v.name === "maxSoFar");
  const minVar = step.vars.find((v) => v.name === "minSoFar");
  const resVar = step.vars.find((v) => v.name === "result");
  const maxSoFar = maxVar ? maxVar.value : "";
  const minSoFar = minVar ? minVar.value : "";
  const result = resVar ? resVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => {
            const isCurrent = idx === i;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${isCurrent ? "bg-emerald-100 border-emerald-500 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-white border-gray-300 text-gray-800"}`}>
                  {v}
                </div>
                <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                <div className="h-5">{isCurrent && <Arrow kind="i" label="i" />}</div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {maxSoFar && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-xs font-semibold text-emerald-700">
              maxSoFar = {maxSoFar}
            </div>
          )}
          {minSoFar && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1 font-mono text-xs font-semibold text-rose-700">
              minSoFar = {minSoFar}
            </div>
          )}
          {result && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1 font-mono text-xs font-semibold text-amber-700">
              result = {result}
            </div>
          )}
        </div>
      </div>
    </Frame>
  );
}
