import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force (Count Bits Individually) — show the ans array and current i/num.
export function CountingBitsBruteVisualizer({ step }: VisualizerProps) {
  const iVar = step.vars.find((v) => v.name === "i");
  const numVar = step.vars.find((v) => v.name === "num");
  const countVar = step.vars.find((v) => v.name === "count");
  const ansVar = step.vars.find((v) => v.name === "ans");
  const i = iVar ? Number(iVar.value) : -1;
  const num = numVar ? Number(numVar.value) : -1;
  const count = countVar ? Number(countVar.value) : 0;
  const ans = ansVar ? ansVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter((s) => s !== "").map(Number) : [];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        {ans.length > 0 && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-600">ans</span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {ans.map((v, idx) => (
                <div
                  key={idx}
                  className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${
                    idx === i ? "bg-emerald-100 border-emerald-500 text-emerald-700" : "bg-white border-gray-300 text-gray-800"
                  }`}
                >
                  {v}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-md bg-sky-100 px-2 py-0.5 font-mono font-bold text-sky-700">
            i = {i}
          </span>
          <span className="rounded-md bg-amber-100 px-2 py-0.5 font-mono font-bold text-amber-700">
            num = {num}
          </span>
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">
            count = {count}
          </span>
        </div>
      </div>
    </Frame>
  );
}
