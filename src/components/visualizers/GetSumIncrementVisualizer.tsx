import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Successive Increment/Decrement — show a and b values.
export function GetSumIncrementVisualizer({ step, nums }: VisualizerProps) {
  const aVar = step.vars.find((v) => v.name === "a");
  const bVar = step.vars.find((v) => v.name === "b");
  const a = aVar ? Number(aVar.value) : nums[0];
  const b = bVar ? Number(bVar.value) : nums[1];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold uppercase text-gray-400">a</span>
            <div className="mt-1 font-mono text-2xl font-bold text-sky-700">{a}</div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold uppercase text-gray-400">b</span>
            <div className="mt-1 font-mono text-2xl font-bold text-amber-700">{b}</div>
          </div>
        </div>
        <div className="text-xs text-gray-500">increment/decrement a by 1, b times</div>
      </div>
    </Frame>
  );
}
