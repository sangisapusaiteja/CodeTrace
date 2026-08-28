import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force — show result.
export function FourSumBruteVisualizer({ step, nums }: VisualizerProps) {
  const resultVar = step.vars.find((v) => v.name === "result");
  const result = resultVar ? resultVar.value : "";

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
        {result && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-mono text-xs font-bold text-emerald-700 max-w-md text-center">
            result = {result}
          </div>
        )}
      </div>
    </Frame>
  );
}
