import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force — show current num, streak, and longest.
export function LongestConsecutiveBruteVisualizer({ step, nums }: VisualizerProps) {
  const numVar = step.vars.find((v) => v.name === "num");
  const streakVar = step.vars.find((v) => v.name === "currentStreak");
  const longestVar = step.vars.find((v) => v.name === "longestStreak");
  const num = numVar ? numVar.value : "";
  const streak = streakVar ? streakVar.value : "";
  const longest = longestVar ? longestVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white border-2 border-gray-300 font-mono text-lg font-semibold text-gray-800">
                {v}
              </div>
              <div className="mt-1 text-[10px] text-gray-400">{idx}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-md bg-sky-100 px-2 py-0.5 font-mono font-bold text-sky-700">num = {num}</span>
          <span className="rounded-md bg-amber-100 px-2 py-0.5 font-mono font-bold text-amber-700">streak = {streak}</span>
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">longest = {longest}</span>
        </div>
      </div>
    </Frame>
  );
}
