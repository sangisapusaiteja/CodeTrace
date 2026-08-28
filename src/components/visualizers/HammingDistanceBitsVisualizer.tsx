import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Bit-by-Bit Comparison — show x, y, xor and count.
export function HammingDistanceBitsVisualizer({ step }: VisualizerProps) {
  const xorVar = step.vars.find((v) => v.name === "xor");
  const countVar = step.vars.find((v) => v.name === "count");
  const xor = xorVar ? Number(xorVar.value) : 0;
  const count = countVar ? Number(countVar.value) : 0;
  const bits = xor.toString(2);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1">
          {bits.split("").map((b, idx) => (
            <div
              key={idx}
              className={`flex h-11 w-11 items-center justify-center rounded-lg border-2 font-mono text-lg font-bold ${
                b === "1" ? "bg-red-100 border-red-400 text-red-700" : "bg-gray-50 border-gray-200 text-gray-300"
              }`}
            >
              {b}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-md bg-red-100 px-2 py-0.5 font-mono font-bold text-red-700">
            xor = {xor}
          </span>
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">
            count = {count}
          </span>
        </div>
      </div>
    </Frame>
  );
}
