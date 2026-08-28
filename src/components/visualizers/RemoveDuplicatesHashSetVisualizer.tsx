import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Hash Set approach — shows the array, the growing set, and the write-back.
export function RemoveDuplicatesHashSetVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const seenVar = step.vars.find((v) => v.name === "seen");
  const seen = seenVar
    ? seenVar.value.replace(/[{}]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const uniqueVar = step.vars.find((v) => v.name === "unique");
  const unique = uniqueVar
    ? uniqueVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <Frame vars={step.vars} step={step}>
      {/* Array */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {nums.map((v, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                idx === i
                  ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                  : idx < unique.length
                  ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              {v}
            </div>
            <div className="h-5">{idx === i ? <Arrow kind="i" /> : <span className="text-[10px] text-gray-400">{idx}</span>}</div>
          </div>
        ))}
      </div>

      {/* Set */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">seen (set)</span>
        <div className="flex flex-wrap justify-center gap-1.5">
          {seen.map((v, idx) => (
            <div key={idx} className="flex h-9 w-9 items-center justify-center rounded-md border border-violet-300 bg-violet-50 font-mono text-sm font-semibold text-violet-700">
              {v}
            </div>
          ))}
          {seen.length === 0 && <span className="text-xs text-gray-400">empty</span>}
        </div>
      </div>
    </Frame>
  );
}
