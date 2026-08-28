import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Prefix Min and Suffix Max — array with middle element j highlighted,
// plus leftMin and rightMax arrays shown.
export function IncreasingTripletPrefixSuffixVisualizer({ step, nums }: VisualizerProps) {
  const j = collectIdx(step, "j");
  const leftMinVar = step.vars.find((v) => v.name === "leftMin");
  const rightMaxVar = step.vars.find((v) => v.name === "rightMax");
  const leftMin = leftMinVar ? leftMinVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter((s) => s !== "").map(Number) : [];
  const rightMax = rightMaxVar ? rightMaxVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter((s) => s !== "").map(Number) : [];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => {
            const isJ = idx === j;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                    isJ
                      ? "bg-amber-100 border-amber-500 text-amber-800 shadow-[0_0_12px_rgba(234,179,8,0.5)]"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                >
                  {v}
                </div>
                <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                <div className="h-5">{isJ && <Arrow kind="j" label="j" />}</div>
              </div>
            );
          })}
        </div>
        {leftMin.length > 0 && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-600">leftMin</span>
            <div className="flex gap-1">
              {leftMin.map((v, idx) => (
                <div key={idx} className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-50 border border-sky-300 font-mono text-xs font-semibold text-sky-700">
                  {v}
                </div>
              ))}
            </div>
          </div>
        )}
        {rightMax.length > 0 && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">rightMax</span>
            <div className="flex gap-1">
              {rightMax.map((v, idx) => (
                <div key={idx} className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 border border-emerald-300 font-mono text-xs font-semibold text-emerald-700">
                  {v}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Frame>
  );
}
