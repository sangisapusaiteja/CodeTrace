import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Sorting — show sorted array with pointer i, current and longest.
export function LongestConsecutiveSortVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const currentVar = step.vars.find((v) => v.name === "current");
  const longestVar = step.vars.find((v) => v.name === "longest");
  const current = currentVar ? currentVar.value : "";
  const longest = longestVar ? longestVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => {
            const isCurrent = idx === i;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${isCurrent ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]" : "bg-white border-gray-300 text-gray-800"}`}>
                  {v}
                </div>
                <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                <div className="h-5">{isCurrent && <Arrow kind="i" label="i" />}</div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-md bg-amber-100 px-2 py-0.5 font-mono font-bold text-amber-700">current = {current}</span>
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">longest = {longest}</span>
        </div>
      </div>
    </Frame>
  );
}
