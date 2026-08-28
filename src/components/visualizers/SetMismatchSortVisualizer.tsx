import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Sorting — sorted array with current element highlighted, plus duplicate and
// missing chips.
export function SetMismatchSortVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const dupVar = step.vars.find((v) => v.name === "duplicate");
  const missVar = step.vars.find((v) => v.name === "missing");
  const duplicate = dupVar ? Number(dupVar.value) : -1;
  const missing = missVar ? Number(missVar.value) : -1;

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => {
            const isCurrent = idx === i;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${
                    v === duplicate
                      ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                      : v === missing
                      ? "bg-emerald-100 border-emerald-500 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                      : isCurrent
                      ? "bg-amber-100 border-amber-500 text-amber-800"
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
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-md bg-red-100 px-2 py-0.5 font-mono font-bold text-red-700">
            duplicate = {duplicate}
          </span>
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">
            missing = {missing}
          </span>
        </div>
      </div>
    </Frame>
  );
}
