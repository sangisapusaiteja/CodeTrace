import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Kadane's Algorithm — show nums with pointer i, currentSum, maxSum.
export function MaxSubArrayKadaneVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const curVar = step.vars.find((v) => v.name === "currentSum");
  const maxVar = step.vars.find((v) => v.name === "maxSum");
  const currentSum = curVar ? curVar.value : "";
  const maxSum = maxVar ? maxVar.value : "";

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
          {currentSum && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1 font-mono text-xs font-semibold text-amber-700">
              currentSum = {currentSum}
            </div>
          )}
          {maxSum && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-xs font-semibold text-emerald-700">
              maxSum = {maxSum}
            </div>
          )}
        </div>
      </div>
    </Frame>
  );
}
