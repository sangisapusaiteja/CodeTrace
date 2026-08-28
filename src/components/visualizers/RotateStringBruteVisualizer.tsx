import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force (Try All Rotations) — show s and goal.
export function RotateStringBruteVisualizer({ step }: VisualizerProps) {
  const sVar = step.vars.find((v) => v.name === "s");
  const goalVar = step.vars.find((v) => v.name === "goal");
  const s = sVar ? sVar.value.replace(/"/g, "") : "";
  const goal = goalVar ? goalVar.value.replace(/"/g, "") : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">s</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {s.split("").map((c, idx) => (
              <div key={idx} className="flex h-11 w-11 items-center justify-center rounded-lg bg-white border-2 border-gray-300 font-mono text-lg font-semibold text-gray-800">
                {c}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">goal</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {goal.split("").map((c, idx) => (
              <div key={idx} className="flex h-11 w-11 items-center justify-center rounded-lg bg-white border-2 border-gray-300 font-mono text-lg font-semibold text-gray-800">
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}
