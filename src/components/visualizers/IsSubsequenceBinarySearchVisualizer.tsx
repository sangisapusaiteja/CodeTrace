import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Binary Search with Preprocessing — show t and the positions map.
export function IsSubsequenceBinarySearchVisualizer({ step }: VisualizerProps) {
  const positionsVar = step.vars.find((v) => v.name === "positions");
  const positions = positionsVar ? positionsVar.value : "";
  const tVar = step.vars.find((v) => v.name === "t");
  const t = tVar ? tVar.value.replace(/"/g, "") : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">t</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {t.split("").map((c, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white border-2 border-gray-300 font-mono text-lg font-semibold text-gray-800">
                  {c}
                </div>
                <div className="mt-1 text-[10px] text-gray-400">{idx}</div>
              </div>
            ))}
          </div>
        </div>
        {positions && (
          <div className="rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 font-mono text-xs text-sky-700">
            {positions}
          </div>
        )}
      </div>
    </Frame>
  );
}
