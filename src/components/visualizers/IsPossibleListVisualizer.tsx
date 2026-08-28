import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Track Every Subsequence in a List — show the subs list.
export function IsPossibleListVisualizer({ step, nums }: VisualizerProps) {
  const subsVar = step.vars.find((v) => v.name === "subs");
  const subs = subsVar ? subsVar.value : "";

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
        {subs && (
          <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700 max-w-md text-center">
            subs = {subs}
          </div>
        )}
      </div>
    </Frame>
  );
}
