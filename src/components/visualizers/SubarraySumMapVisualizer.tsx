import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Prefix Sum + Hash Map — show nums with pointer i, prefixSum, count, and map.
export function SubarraySumMapVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const prefixVar = step.vars.find((v) => v.name === "prefixSum");
  const countVar = step.vars.find((v) => v.name === "count");
  const mapVar = step.vars.find((v) => v.name === "prefixCount");
  const prefixSum = prefixVar ? prefixVar.value : "";
  const count = countVar ? countVar.value : "";
  const map = mapVar ? mapVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => {
            const isCurrent = idx === i;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${isCurrent ? "bg-emerald-100 border-emerald-500 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-white border-gray-300 text-gray-800"}`}>
                  {v}
                </div>
                <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                <div className="h-5">{isCurrent && <Arrow kind="i" label="i" />}</div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {prefixSum && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1 font-mono text-xs font-semibold text-amber-700">
              prefixSum = {prefixSum}
            </div>
          )}
          {count && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-xs font-semibold text-emerald-700">
              count = {count}
            </div>
          )}
        </div>
        {map && (
          <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700">
            prefixCount = {map}
          </div>
        )}
      </div>
    </Frame>
  );
}
