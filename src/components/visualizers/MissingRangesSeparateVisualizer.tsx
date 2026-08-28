import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Separate Gaps — shows the number line with found/missing ranges highlighted.
export function MissingRangesSeparateVisualizer({ step, nums }: VisualizerProps) {
  const lowerVar = step.vars.find((v) => v.name === "lower");
  const upperVar = step.vars.find((v) => v.name === "upper");
  const lower = lowerVar ? Number(lowerVar.value) : 0;
  const upper = upperVar ? Number(upperVar.value) : 100;

  const resultVar = step.vars.find((v) => v.name === "result");
  const result: number[][] = [];
  if (resultVar) {
    const matches = resultVar.value.matchAll(/\[(\d+),(\d+)\]/g);
    for (const m of matches) result.push([Number(m[1]), Number(m[2])]);
  }

  const range = upper - lower;
  const showCount = Math.min(range + 1, 20);
  const step_size = range > 0 ? Math.max(1, Math.floor(range / (showCount - 1))) : 1;

  return (
    <Frame vars={step.vars} step={step}>
      {/* Number line */}
      <div className="flex flex-wrap justify-center gap-0.5">
        {Array.from({ length: showCount }, (_, idx) => {
          const val = lower + idx * step_size;
          const inNums = nums.includes(val);
          const inGap = result.some(([s, e]) => val >= s && val <= e);
          return (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-md border text-[11px] font-semibold transition-all duration-200 ${
                  inNums
                    ? "bg-gray-100 border-gray-300 text-gray-600"
                    : inGap
                    ? "bg-violet-100 border-violet-400 text-violet-700"
                    : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {val}
              </div>
            </div>
          );
        })}
      </div>

      {/* Found ranges */}
      {result.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {result.map(([s, e], idx) => (
            <div key={idx} className="flex items-center gap-0.5 rounded-md border border-violet-300 bg-violet-50 px-2 py-1">
              <span className="font-mono text-xs font-bold text-violet-700">[{s},{e}]</span>
            </div>
          ))}
        </div>
      )}
    </Frame>
  );
}
