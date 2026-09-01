import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Prefix Sum — show nums with pointer i and the prefix array being built.
export function RangeSumPrefixVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const prefixVar = step.vars.find((v) => v.name === "prefix");
  const prefix = prefixVar
    ? prefixVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => {
            const isCurrent = idx === i;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${isCurrent ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]" : "bg-white border-gray-300 text-gray-800"}`}>
                  {v}
                </div>
                <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                <div className="h-5">{isCurrent && <Arrow kind="i" label="i" />}</div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">prefix</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {prefix.map((v, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`flex h-9 w-9 items-center justify-center rounded-md border font-mono text-sm font-semibold ${v !== "0" || idx === 0 ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-400"}`}>
                  {v}
                </div>
                <div className="mt-0.5 text-[10px] text-gray-400">{idx}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}
