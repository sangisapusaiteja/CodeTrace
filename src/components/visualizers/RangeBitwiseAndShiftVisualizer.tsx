import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Bit Shift (Common Prefix) — show left and right as they shift.
export function RangeBitwiseAndShiftVisualizer({ step, nums }: VisualizerProps) {
  const leftVar = step.vars.find((v) => v.name === "left");
  const rightVar = step.vars.find((v) => v.name === "right");
  const shiftsVar = step.vars.find((v) => v.name === "shifts");
  const left = leftVar ? Number(leftVar.value) : nums[0];
  const right = rightVar ? Number(rightVar.value) : nums[1];
  const shifts = shiftsVar ? Number(shiftsVar.value) : 0;

  const showBits = (v: number) => v.toString(2);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold uppercase text-gray-400">left</span>
            <div className="mt-1 font-mono text-2xl font-bold text-sky-700">{left}</div>
            <div className="font-mono text-xs text-gray-500">{showBits(left)}</div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold uppercase text-gray-400">right</span>
            <div className="mt-1 font-mono text-2xl font-bold text-sky-700">{right}</div>
            <div className="font-mono text-xs text-gray-500">{showBits(right)}</div>
          </div>
        </div>
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-sm font-bold text-emerald-700">
          shifts = {shifts}
        </div>
      </div>
    </Frame>
  );
}
