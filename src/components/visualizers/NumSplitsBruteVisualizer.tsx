import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force — show string with pointer i, left/right sizes, count.
export function NumSplitsBruteVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const leftVar = step.vars.find((v) => v.name === "left");
  const rightVar = step.vars.find((v) => v.name === "right");
  const countVar = step.vars.find((v) => v.name === "count");
  const left = leftVar ? leftVar.value : "";
  const right = rightVar ? rightVar.value : "";
  const count = countVar ? countVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => {
            const isCurrent = idx === i;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${isCurrent ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]" : "bg-white border-gray-300 text-gray-800"}`}>
                  {String.fromCharCode(v)}
                </div>
                <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                <div className="h-5">{isCurrent && <Arrow kind="i" label="i" />}</div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-md bg-sky-100 px-2 py-0.5 font-mono font-bold text-sky-700">left = {left}</span>
          <span className="rounded-md bg-amber-100 px-2 py-0.5 font-mono font-bold text-amber-700">right = {right}</span>
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">count = {count}</span>
        </div>
      </div>
    </Frame>
  );
}
