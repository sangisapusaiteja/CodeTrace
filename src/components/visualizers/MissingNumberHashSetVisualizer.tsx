import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Hash Set — show the array and the set contents.
export function MissingNumberHashSetVisualizer({ step, nums }: VisualizerProps) {
  const setVar = step.vars.find((v) => v.name === "numSet");
  const numSet = setVar ? setVar.value.replace(/[{}]/g, "").split(",").map((s) => s.trim()).filter((s) => s !== "").map(Number) : [];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white border-2 border-gray-300 font-mono text-lg font-semibold text-gray-800">
                {v}
              </div>
              <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
            </div>
          ))}
        </div>
        {numSet.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1">
            {numSet.map((v, idx) => (
              <div key={idx} className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-50 border border-sky-300 font-mono text-sm font-semibold text-sky-700">
                {v}
              </div>
            ))}
          </div>
        )}
      </div>
    </Frame>
  );
}
