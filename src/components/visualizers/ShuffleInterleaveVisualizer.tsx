import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Interleave approach — shows the input split into halves and the result
// being built by alternating from each half.
export function ShuffleInterleaveVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const n = Math.floor(nums.length / 2);
  const resultVar = step.vars.find((v) => v.name === "result");
  const result = resultVar
    ? resultVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const isActive = (idx: number) => i !== null && (idx === i || idx === n + i);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-4">
        {/* Input halves */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">input (x… | y…)</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {nums.map((v, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                    isActive(idx)
                      ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                      : idx < n
                      ? "bg-sky-50 border-sky-300 text-sky-700"
                      : "bg-violet-50 border-violet-300 text-violet-700"
                  }`}
                >
                  {v}
                </div>
                <div className="h-5">{isActive(idx) ? <Arrow kind="i" /> : <span className="text-[10px] text-gray-400">{idx}</span>}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">result</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {result.map((v, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                    v === "·"
                      ? "bg-gray-50 border-dashed border-gray-300 text-gray-300"
                      : idx % 2 === 0
                      ? "bg-sky-100 border-sky-400 text-sky-800"
                      : "bg-violet-100 border-violet-400 text-violet-800"
                  }`}
                >
                  {v}
                </div>
                <span className="mt-1 text-[10px] text-gray-400">{idx}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}
