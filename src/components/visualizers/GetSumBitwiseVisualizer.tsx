import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Bit Manipulation (XOR + AND + Shift) — show a, b, and carry.
export function GetSumBitwiseVisualizer({ step, nums }: VisualizerProps) {
  const aVar = step.vars.find((v) => v.name === "a");
  const bVar = step.vars.find((v) => v.name === "b");
  const carryVar = step.vars.find((v) => v.name === "carry");
  const a = aVar ? Number(aVar.value) : nums[0];
  const b = bVar ? Number(bVar.value) : nums[1];
  const carry = carryVar ? Number(carryVar.value) : 0;

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold uppercase text-gray-400">a (sum)</span>
            <div className="mt-1 font-mono text-2xl font-bold text-sky-700">{a}</div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold uppercase text-gray-400">b (carry)</span>
            <div className="mt-1 font-mono text-2xl font-bold text-amber-700">{b}</div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold uppercase text-gray-400">carry</span>
            <div className="mt-1 font-mono text-2xl font-bold text-violet-700">{carry}</div>
          </div>
        </div>
        <div className="text-xs text-gray-500">carry = (a &amp; b) &lt;&lt; 1, a = a ^ b</div>
      </div>
    </Frame>
  );
}
