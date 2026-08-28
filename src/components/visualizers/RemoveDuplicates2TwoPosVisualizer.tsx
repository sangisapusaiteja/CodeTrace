import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Two Positions Back — in-place array with i (read) and writePos (write),
// plus a marker showing the writePos-2 comparison element.
export function RemoveDuplicates2TwoPosVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const writePos = collectIdx(step, "writePos");
  const compareVar = step.vars.find((v) => v.name === "nums[writePos-2]");
  const compareVal = compareVar ? compareVar.value : "—";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-wrap justify-center gap-1.5">
        {nums.map((v, idx) => {
          const isI = idx === i;
          const isW = idx === writePos && idx !== i;
          const isCompare = writePos !== null && idx === writePos - 2;
          const isKept = writePos !== null && idx < writePos;
          return (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                  isI
                    ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                    : isW
                    ? "bg-amber-100 border-amber-500 text-amber-800 shadow-[0_0_12px_rgba(234,179,8,0.5)]"
                    : isCompare
                    ? "bg-sky-100 border-sky-500 text-sky-700 shadow-[0_0_12px_rgba(14,165,233,0.5)]"
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
                {isCompare && !isI && !isW && <Arrow kind="j" label="w-2" />}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center text-xs text-gray-400">
        comparing nums[i] with nums[writePos-2] = {compareVal}
      </div>
    </Frame>
  );
}
