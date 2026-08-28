import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Single-pass visualizer — a "streak meter": a running count bar that
// grows on 1 and resets on 0, plus a max tracker.
export function SinglePassMCOVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const countVar = step.vars.find((v) => v.name === "count");
  const count = countVar ? parseInt(countVar.value, 10) || 0 : 0;
  const maxCountVar = step.vars.find((v) => v.name === "maxCount");
  const maxCount = maxCountVar ? parseInt(maxCountVar.value, 10) || 0 : 0;

  // Height scale: a run of up to ~6 ones fills the meter.
  const maxBar = 6;
  const barHeight = Math.min(100, (count / maxBar) * 100);
  const maxBarHeight = Math.min(100, (maxCount / maxBar) * 100);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-5">
        {/* Array row with arrow */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                  idx === i
                    ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                    : idx < (i ?? -1) && v === 1
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

        {/* Streak meter */}
        <div className="flex items-end gap-6">
          <div className="flex flex-col items-center">
            <div className="flex h-32 w-12 items-end overflow-hidden rounded-lg border border-gray-300 bg-gray-50">
              <div
                className="w-full rounded-b-lg bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-200"
                style={{ height: `${barHeight}%` }}
              />
            </div>
            <span className="mt-1 text-[11px] font-semibold text-gray-400">count</span>
            <span className="font-mono text-lg font-bold text-emerald-600">{count}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex h-32 w-12 items-end overflow-hidden rounded-lg border border-gray-300 bg-gray-50">
              <div
                className="w-full rounded-b-lg bg-gradient-to-t from-indigo-500 to-indigo-400 transition-all duration-200"
                style={{ height: `${maxBarHeight}%` }}
              />
            </div>
            <span className="mt-1 text-[11px] font-semibold text-gray-400">maxCount</span>
            <span className="font-mono text-lg font-bold text-indigo-600">{maxCount}</span>
          </div>
        </div>
      </div>
    </Frame>
  );
}
