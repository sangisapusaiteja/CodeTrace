import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Hash Set — show the array, the seen set, and the result.
export function FindDisappearedHashSetVisualizer({ step, nums }: VisualizerProps) {
  const seenVar = step.vars.find((v) => v.name === "seen");
  const resultVar = step.vars.find((v) => v.name === "result");
  const seen = seenVar ? seenVar.value : "";
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
        {seen && (
          <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700">
            seen = {seen}
          </div>
        )}
        {result && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-mono text-xs font-bold text-emerald-700">
            result = {result}
          </div>
        )}
      </div>
    </Frame>
  );
}
