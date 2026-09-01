import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force (Generate All Permutations) — show s2 and the perms list.
export function CheckInclusionBruteVisualizer({ step, nums }: VisualizerProps) {
  const permsVar = step.vars.find((v) => v.name === "perms");
  const perms = permsVar ? permsVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 bg-white border-gray-300 text-gray-800">
                {String.fromCharCode(v)}
              </div>
              <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
            </div>
          ))}
        </div>
        {perms && (
          <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700">
            perms = {perms}
          </div>
        )}
      </div>
    </Frame>
  );
}
