import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force — array with i (start) and j (extend) pointers; count shown.
export function ZeroFilledBruteVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const j = collectIdx(step, "j");
  const countVar = step.vars.find((v) => v.name === "count");
  const count = countVar ? Number(countVar.value) : 0;

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-wrap justify-center gap-1.5">
        {nums.map((v, idx) => {
          const isI = idx === i;
          const isJ = idx === j && idx !== i;
          const isZero = v === 0;
          return (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                  isI
                    ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                    : isJ
                    ? "bg-amber-100 border-amber-500 text-amber-800 shadow-[0_0_12px_rgba(234,179,8,0.5)]"
                    : isZero
                    ? "bg-sky-50 border-sky-300 text-sky-700"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                {v}
              </div>
              <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
              <div className="h-5">
                {isI && <Arrow kind="i" label="i" />}
                {isJ && !isI && <Arrow kind="j" label="j" />}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center text-xs text-gray-400">count = {count}</div>
    </Frame>
  );
}
