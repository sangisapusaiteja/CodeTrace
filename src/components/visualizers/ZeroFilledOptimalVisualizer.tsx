import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Counting Consecutive Zeros (Optimal) — single pass, current element
// highlighted, consecutiveZeros and count shown.
export function ZeroFilledOptimalVisualizer({ step, nums }: VisualizerProps) {
  const idx = collectIdx(step, "num");
  const czVar = step.vars.find((v) => v.name === "consecutiveZeros");
  const countVar = step.vars.find((v) => v.name === "count");
  const consecutiveZeros = czVar ? Number(czVar.value) : 0;
  const count = countVar ? Number(countVar.value) : 0;

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-wrap justify-center gap-1.5">
        {nums.map((v, i) => {
          const isCurrent = i === idx;
          const isZero = v === 0;
          return (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                  isCurrent
                    ? "bg-emerald-100 border-emerald-500 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    : isZero
                    ? "bg-sky-50 border-sky-300 text-sky-700"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                {v}
              </div>
              <div className="mt-1 h-5 text-[10px] text-gray-400">{i}</div>
              <div className="h-5">{isCurrent && <Arrow kind="i" label="num" />}</div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span className="rounded-md bg-sky-100 px-2 py-0.5 font-mono font-bold text-sky-700">
          consecutiveZeros = {consecutiveZeros}
        </span>
        <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">
          count = {count}
        </span>
      </div>
    </Frame>
  );
}
