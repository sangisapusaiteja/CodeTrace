import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Sorting — sorted array with current element highlighted and expected shown.
export function FirstMissingPositiveSortVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const expectedVar = step.vars.find((v) => v.name === "expected");
  const expected = expectedVar ? Number(expectedVar.value) : 1;

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => {
            const isCurrent = idx === i;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                    isCurrent
                      ? "bg-emerald-100 border-emerald-500 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                      : v <= 0
                      ? "bg-gray-100 border-gray-300 text-gray-400"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                >
                  {v}
                </div>
                <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                <div className="h-5">{isCurrent && <Arrow kind="i" label="i" />}</div>
              </div>
            );
          })}
        </div>
        <div className="text-center text-xs">
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">
            expected = {expected}
          </span>
        </div>
      </div>
    </Frame>
  );
}
