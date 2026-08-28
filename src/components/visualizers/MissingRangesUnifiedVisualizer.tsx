import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Unified Boundary Scan — shows prev/curr pointers and the growing result list.
export function MissingRangesUnifiedVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const prevVar = step.vars.find((v) => v.name === "prev");
  const currVar = step.vars.find((v) => v.name === "curr");
  const prevVal = prevVar ? Number(prevVar.value) : -1;
  const currVal = currVar ? Number(currVar.value) : 0;

  const resultVar = step.vars.find((v) => v.name === "result");
  const result: number[][] = [];
  if (resultVar) {
    const matches = resultVar.value.matchAll(/\[(\d+),(\d+)\]/g);
    for (const m of matches) result.push([Number(m[1]), Number(m[2])]);
  }

  return (
    <Frame vars={step.vars} step={step}>
      {/* Virtual anchors */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {nums.map((v, idx) => {
          const isI = idx === i;
          const isPrev = v === prevVal;
          const isCurr = v === currVal;
          return (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                  isI
                    ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                    : isCurr
                    ? "bg-emerald-100 border-emerald-500 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    : isPrev
                    ? "bg-amber-100 border-amber-500 text-amber-700"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                {v}
              </div>
              <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
              <div className="h-5">
                {isI && <Arrow kind="i" label="i" />}
                {isPrev && !isI && <Arrow kind="active" label="prev" />}
                {isCurr && !isI && <Arrow kind="found" label="curr" />}
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
