import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Hash Set — show the array and the set contents; highlight the missing value.
export function FirstMissingPositiveHashSetVisualizer({ step, nums }: VisualizerProps) {
  const seenVar = step.vars.find((v) => v.name === "seen");
  const seen = seenVar
    ? seenVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter((s) => s !== "").map(Number)
    : [];

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
        {seen.length > 0 && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-600">seen set</span>
            <div className="flex flex-wrap justify-center gap-1">
              {seen.map((v, idx) => (
                <div key={idx} className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-50 border border-sky-300 font-mono text-xs font-semibold text-sky-700">
                  {v}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Frame>
  );
}
