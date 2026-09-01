import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Prefix Sum (Optimal) — show nums with pointer i, leftSum/rightSum/totalSum.
export function PivotIndexPrefixVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const leftVar = step.vars.find((v) => v.name === "leftSum");
  const rightVar = step.vars.find((v) => v.name === "rightSum");
  const totalVar = step.vars.find((v) => v.name === "totalSum");
  const leftSum = leftVar ? leftVar.value : "";
  const rightSum = rightVar ? rightVar.value : "";
  const totalSum = totalVar ? totalVar.value : "";

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
          {totalSum && (
            <div className="rounded-md border border-gray-200 bg-white px-3 py-1 font-mono text-xs font-semibold text-gray-700">
              totalSum = {totalSum}
            </div>
          )}
          {leftSum && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1 font-mono text-xs font-semibold text-amber-700">
              leftSum = {leftSum}
            </div>
          )}
          {rightSum && (
            <div className="rounded-md border border-sky-200 bg-sky-50 px-3 py-1 font-mono text-xs font-semibold text-sky-700">
              rightSum = {rightSum}
            </div>
          )}
        </div>
      </div>
    </Frame>
  );
}
