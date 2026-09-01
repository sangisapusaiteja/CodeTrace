import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force approach — shows nums (scan) and result (build) side by side,
// with i and j pointers and the running sum.
export function RunningSumBruteVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const j = collectIdx(step, "j");
  const resultVar = step.vars.find((v) => v.name === "result");
  const result = resultVar
    ? resultVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-4">
        {/* nums */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">nums</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {nums.map((v, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                    idx === i
                      ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                      : idx === j
                      ? "bg-orange-100 border-orange-500 text-orange-700 shadow-[0_0_12px_rgba(249,115,22,0.5)]"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                >
                  {v}
                </div>
                <div className="h-5">
                  {idx === i ? <Arrow kind="i" label="i" /> : idx === j ? <Arrow kind="j" label="j" /> : <span className="text-[10px] text-gray-400">{idx}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* result */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">result</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {result.map((v, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                    idx === i
                      ? "bg-emerald-100 border-emerald-500 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                      : v === "undefined"
                      ? "bg-gray-50 border-gray-200 text-gray-400"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                >
                  {v === "undefined" ? "·" : v}
                </div>
                <div className="h-5">{idx === i ? <Arrow kind="active" label="w" /> : <span className="text-[10px] text-gray-400">{idx}</span>}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}
