import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Prefix and Suffix Distinct Counts — show string with pointer i, arrays, count.
export function NumSplitsPrefixSuffixVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const prefixVar = step.vars.find((v) => v.name === "prefixDistinct");
  const suffixVar = step.vars.find((v) => v.name === "suffixDistinct");
  const countVar = step.vars.find((v) => v.name === "count");
  const prefix = prefixVar ? prefixVar.value : "";
  const suffix = suffixVar ? suffixVar.value : "";
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
        {prefix && (
          <div className="rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 font-mono text-xs text-sky-700">
            prefix = {prefix}
          </div>
        )}
        {suffix && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 font-mono text-xs text-amber-700">
            suffix = {suffix}
          </div>
        )}
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-sm font-bold text-emerald-700">
          count = {count}
        </div>
      </div>
    </Frame>
  );
}
