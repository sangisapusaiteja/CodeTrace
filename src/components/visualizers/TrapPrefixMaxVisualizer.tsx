import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Prefix Max Arrays — show height bars with pointer i, leftMax, rightMax, total.
export function TrapPrefixMaxVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const leftVar = step.vars.find((v) => v.name === "leftMax");
  const rightVar = step.vars.find((v) => v.name === "rightMax");
  const waterVar = step.vars.find((v) => v.name === "totalWater");
  const leftMax = leftVar ? leftVar.value : "";
  const rightMax = rightVar ? rightVar.value : "";
  const totalWater = waterVar ? waterVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => {
            const isCurrent = idx === i;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${isCurrent ? "bg-sky-100 border-sky-500 text-sky-700 shadow-[0_0_12px_rgba(14,165,233,0.5)]" : "bg-white border-gray-300 text-gray-800"}`}>
                  {v}
                </div>
                <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                <div className="h-5">{isCurrent && <Arrow kind="i" label="i" />}</div>
              </div>
            );
          })}
        </div>
        {leftMax && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 font-mono text-xs text-amber-700">
            leftMax = {leftMax}
          </div>
        )}
        {rightMax && (
          <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700">
            rightMax = {rightMax}
          </div>
        )}
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-sm font-bold text-emerald-700">
          totalWater = {totalWater}
        </div>
      </div>
    </Frame>
  );
}
