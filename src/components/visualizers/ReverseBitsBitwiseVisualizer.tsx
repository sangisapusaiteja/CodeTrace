import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Bit-by-Bit Reversal — show n in binary and result.
export function ReverseBitsBitwiseVisualizer({ step }: VisualizerProps) {
  const iVar = step.vars.find((v) => v.name === "i");
  const nVar = step.vars.find((v) => v.name === "n (binary)");
  const resultVar = step.vars.find((v) => v.name === "result");
  const i = iVar ? Number(iVar.value) : -1;
  const nBits = nVar ? nVar.value : "";
  const result = resultVar ? Number(resultVar.value) : 0;

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1">
          {nBits.split("").map((b, idx) => (
            <div
              key={idx}
              className={`flex h-8 w-6 items-center justify-center rounded border font-mono text-xs font-bold ${
                b === "1" ? "bg-red-100 border-red-300 text-red-700" : "bg-gray-50 border-gray-200 text-gray-300"
              } ${idx === 31 - (i >= 0 ? i : -1) ? "ring-2 ring-amber-400" : ""}`}
            >
              {b}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-md bg-sky-100 px-2 py-0.5 font-mono font-bold text-sky-700">
            bit {i}
          </span>
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">
            result = {result}
          </span>
        </div>
      </div>
    </Frame>
  );
}
