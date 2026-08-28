import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// DP with Right Shift — show the ans array being filled.
export function CountingBitsDPVisualizer({ step }: VisualizerProps) {
  const iVar = step.vars.find((v) => v.name === "i");
  const ansVar = step.vars.find((v) => v.name === "ans");
  const i = iVar ? Number(iVar.value) : -1;
  const ans = ansVar ? ansVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter((s) => s !== "").map(Number) : [];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-600">ans</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {ans.map((v, idx) => (
              <div
                key={idx}
                className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${
                  idx === i ? "bg-emerald-100 border-emerald-500 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                {v}
              </div>
            ))}
          </div>
        </div>
        {i >= 0 && (
          <div className="rounded-md border border-gray-200 bg-white px-3 py-1 font-mono text-xs text-gray-600">
            computing ans[{i}] = ans[{i} {String.fromCharCode(62)}{String.fromCharCode(62)} 1] + ({i} & 1)
          </div>
        )}
      </div>
    </Frame>
  );
}
