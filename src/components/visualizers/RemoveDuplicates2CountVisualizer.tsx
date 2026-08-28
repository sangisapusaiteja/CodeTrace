import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Count & Overwrite — in-place array with i (read), writePos (write), and
// the running count displayed.
export function RemoveDuplicates2CountVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const writePos = collectIdx(step, "writePos");
  const countVar = step.vars.find((v) => v.name === "count");
  const count = countVar ? Number(countVar.value) : 1;

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-wrap justify-center gap-1.5">
        {nums.map((v, idx) => {
          const isI = idx === i;
          const isW = idx === writePos && idx !== i;
          const isKept = writePos !== null && idx < writePos;
          return (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                  isI
                    ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                    : isW
                    ? "bg-amber-100 border-amber-500 text-amber-800 shadow-[0_0_12px_rgba(234,179,8,0.5)]"
                    : isKept
                    ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                {v}
              </div>
              <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
              <div className="h-5">
                {isI && <Arrow kind="i" label="i" />}
                {isW && !isI && <Arrow kind="active" label="w" />}
              </div>
            </div>
          );
        })}
      </div>
      {count > 0 && (
        <div className="text-center text-xs text-gray-400">
          count = {count} {count > 2 ? "(skip — 3rd duplicate)" : "(≤ 2 — keep)"}
        </div>
      )}
    </Frame>
  );
}
