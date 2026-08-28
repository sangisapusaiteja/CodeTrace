import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force (Generate All Permutations) — show the sorted permutation list
// and the current/next transition.
export function NextPermutationBruteVisualizer({ step, nums }: VisualizerProps) {
  const permsVar = step.vars.find((v) => v.name === "perms");
  const perms = permsVar
    ? permsVar.value
        .replace(/^\[|\]$/g, "")
        .split("], [")
        .map((s) => s.replace(/[\[\]]/g, "").split(",").map(Number))
        .filter((p) => p.length > 0)
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
        {perms.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {perms.map((p, idx) => (
              <div
                key={idx}
                className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-gray-600"
              >
                [{p.join(", ")}]
              </div>
            ))}
          </div>
        )}
      </div>
    </Frame>
  );
}
