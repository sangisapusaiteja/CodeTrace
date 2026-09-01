import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Sliding Window — show s with left/right pointers, formed, bestLen, windowCount.
export function MinWindowSlidingVisualizer({ step, nums }: VisualizerProps) {
  const left = collectIdx(step, "left");
  const right = collectIdx(step, "right");
  const formedVar = step.vars.find((v) => v.name === "formed");
  const bestVar = step.vars.find((v) => v.name === "bestLen");
  const winVar = step.vars.find((v) => v.name === "windowCount");
  const formed = formedVar ? formedVar.value : "";
  const bestLen = bestVar ? bestVar.value : "";
  const windowCount = winVar ? winVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => {
            const isL = idx === left;
            const isR = idx === right;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${isL ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]" : isR ? "bg-orange-100 border-orange-500 text-orange-700 shadow-[0_0_12px_rgba(249,115,22,0.5)]" : "bg-white border-gray-300 text-gray-800"}`}>
                  {String.fromCharCode(v)}
                </div>
                <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                <div className="h-5">{isL ? <Arrow kind="i" label="L" /> : isR ? <Arrow kind="j" label="R" /> : null}</div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {formed && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1 font-mono text-xs font-semibold text-amber-700">
              formed = {formed}
            </div>
          )}
          {bestLen && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-xs font-semibold text-emerald-700">
              bestLen = {bestLen}
            </div>
          )}
        </div>
        {windowCount && (
          <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700">
            windowCount = {windowCount}
          </div>
        )}
      </div>
    </Frame>
  );
}
