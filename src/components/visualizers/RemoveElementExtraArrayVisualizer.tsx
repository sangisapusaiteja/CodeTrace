import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Extra Array approach — shows the array with a read pointer and a separate
// result row being built, then copied back.
export function RemoveElementExtraArrayVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const valVar = step.vars.find((v) => v.name === "val");
  const val = valVar ? Number(valVar.value) : 0;
  const resultVar = step.vars.find((v) => v.name === "result");
  const result = resultVar
    ? resultVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <Frame vars={step.vars} step={step}>
      {/* Original array */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">nums</span>
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                  idx === i
                    ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                    : v === val
                    ? "bg-gray-100 border-gray-300 text-gray-400 line-through"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                {v}
              </div>
              <div className="h-5">{idx === i ? <Arrow kind="i" /> : <span className="text-[10px] text-gray-400">{idx}</span>}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Result array */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">result</span>
        <div className="flex flex-wrap justify-center gap-1.5">
          {result.map((v, idx) => (
            <div key={idx} className="flex h-10 w-10 items-center justify-center rounded-md border border-emerald-300 bg-emerald-50 font-mono text-sm font-semibold text-emerald-700">
              {v}
            </div>
          ))}
          {result.length === 0 && <span className="text-xs text-gray-400">empty</span>}
        </div>
      </div>
    </Frame>
  );
}
