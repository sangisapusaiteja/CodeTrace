import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Group Counting — show the groups array.
export function CountBinarySubstringsGroupVisualizer({ step, nums }: VisualizerProps) {
  const groupsVar = step.vars.find((v) => v.name === "groups");
  const groups = groupsVar ? groupsVar.value : "";

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
        {groups && (
          <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700">
            groups = {groups}
          </div>
        )}
      </div>
    </Frame>
  );
}
