import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force — show result value.
export function RangeBitwiseAndBruteVisualizer({ step, nums }: VisualizerProps) {
  const iVar = step.vars.find((v) => v.name === "i");
  const resultVar = step.vars.find((v) => v.name === "result");
  const i = iVar ? Number(iVar.value) : -1;
  const result = resultVar ? Number(resultVar.value) : nums[0];
  const left = nums[0];
  const right = nums[1];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="text-center font-mono text-sm text-gray-600">
          {left} &amp; {left + 1} &amp; ... &amp; {right}
        </div>
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-mono text-lg font-bold text-emerald-700">
          result = {result}
        </div>
        {i >= 0 && (
          <div className="text-xs text-gray-500">processing i = {i}</div>
        )}
      </div>
    </Frame>
  );
}
