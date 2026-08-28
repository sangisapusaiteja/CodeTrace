import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Iterative Division — show n as it divides by 2.
export function PowerOfTwoIterativeVisualizer({ step, nums }: VisualizerProps) {
  const nVar = step.vars.find((v) => v.name === "n");
  const n = nVar ? Number(nVar.value) : nums[0];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 border-2 border-violet-400 font-mono text-2xl font-bold text-violet-700 shadow-[0_0_12px_rgba(139,92,246,0.3)]">
          {n}
        </div>
        <div className="rounded-md border border-gray-200 bg-white px-3 py-1.5 font-mono text-xs text-gray-600">
          n = {n} ({n.toString(2)})
        </div>
      </div>
    </Frame>
  );
}
