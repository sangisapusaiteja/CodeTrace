import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force — show haystack with i and i+j pointers.
export function StrStrBruteVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const j = collectIdx(step, "j");
  const needleVar = step.vars.find((v) => v.name === "needle");
  const needle = needleVar ? needleVar.value.replace(/"/g, "") : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">haystack</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {nums.map((v, idx) => {
              const isI = idx === i;
              const isJ = i !== null && j !== null && idx === i + j;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${isJ ? "bg-amber-100 border-amber-500 text-amber-800 shadow-[0_0_12px_rgba(234,179,8,0.5)]" : isI ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]" : "bg-white border-gray-300 text-gray-800"}`}>
                    {String.fromCharCode(v)}
                  </div>
                  <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                  <div className="h-5">
                    {isI && <Arrow kind="i" label="i" />}
                    {isJ && !isI && <Arrow kind="j" label="j" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">needle</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {needle.split("").map((c, idx) => (
              <div key={idx} className="flex h-11 w-11 items-center justify-center rounded-lg bg-white border-2 border-gray-300 font-mono text-lg font-semibold text-gray-800">
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}
