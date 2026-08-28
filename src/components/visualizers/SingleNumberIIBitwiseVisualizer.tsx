import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Bitwise Counting — show bit position and bitSum.
export function SingleNumberIIBitwiseVisualizer({ step }: VisualizerProps) {
  const iVar = step.vars.find((v) => v.name === "i");
  const bitSumVar = step.vars.find((v) => v.name === "bitSum");
  const resultVar = step.vars.find((v) => v.name === "result");
  const i = iVar ? Number(iVar.value) : -1;
  const bitSum = bitSumVar ? Number(bitSumVar.value) : 0;
  const result = resultVar ? Number(resultVar.value) : 0;

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold uppercase text-gray-400">bit position</span>
            <div className="mt-1 font-mono text-2xl font-bold text-violet-700">{i}</div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold uppercase text-gray-400">bitSum</span>
            <div className="mt-1 font-mono text-2xl font-bold text-amber-700">{bitSum}</div>
          </div>
        </div>
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-sm font-bold text-emerald-700">
          result = {result}
        </div>
      </div>
    </Frame>
  );
}
