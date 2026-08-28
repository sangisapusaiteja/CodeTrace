import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Greedy with Hash Map — show the string and the frequency counts.
export function LongestPalindromeGreedyVisualizer({ step, nums }: VisualizerProps) {
  const countsVar = step.vars.find((v) => v.name === "counts");
  const counts = countsVar ? countsVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white border-2 border-gray-300 font-mono text-lg font-semibold text-gray-800">
                {String.fromCharCode(v)}
              </div>
              <div className="mt-1 text-[10px] text-gray-400">{idx}</div>
            </div>
          ))}
        </div>
        {counts && (
          <div className="rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 font-mono text-xs text-sky-700">
            {counts}
          </div>
        )}
      </div>
    </Frame>
  );
}
