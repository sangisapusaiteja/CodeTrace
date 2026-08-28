import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Sorting approach — sorted array with run highlighting and threshold indicator.
export function Majority2SortVisualizer({ step, nums }: VisualizerProps) {
  const currentVar = step.vars.find((v) => v.name === "current");
  const countVar = step.vars.find((v) => v.name === "count");
  const thresholdVar = step.vars.find((v) => v.name === "threshold");
  const current = currentVar ? Number(currentVar.value) : -1;
  const count = countVar ? Number(countVar.value) : 0;
  const threshold = thresholdVar ? Number(thresholdVar.value) : Math.floor(nums.length / 3);
  const sorted = [...nums].sort((a, b) => a - b);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-1.5">
          {sorted.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 font-mono text-sm font-semibold transition-all duration-200 ${
                  v === current && count > 0
                    ? count > threshold
                      ? "bg-emerald-100 border-emerald-500 text-emerald-700 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                      : "bg-amber-100 border-amber-500 text-amber-700"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                {v}
              </div>
              <span className="mt-1 text-[9px] text-gray-400">{idx}</span>
            </div>
          ))}
        </div>
        {count > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-md bg-amber-100 px-2 py-0.5 font-mono font-bold text-amber-700">
              run = {current} × {count}
            </span>
            {count > threshold && (
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">
                {count} {'>'} {threshold} ✓
              </span>
            )}
          </div>
        )}
      </div>
    </Frame>
  );
}
