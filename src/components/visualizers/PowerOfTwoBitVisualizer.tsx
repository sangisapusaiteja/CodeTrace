import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Bit Manipulation (n & (n-1)) — show n in binary with its bits.
export function PowerOfTwoBitVisualizer({ step, nums }: VisualizerProps) {
  const nVar = step.vars.find((v) => v.name === "n");
  const n = nVar ? Number(nVar.value) : nums[0];
  const bits = n > 0 ? n.toString(2) : "0";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1">
          {bits.split("").map((b, idx) => (
            <div
              key={idx}
              className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono text-xl font-bold ${
                b === "1" ? "bg-violet-100 border-violet-400 text-violet-700" : "bg-gray-50 border-gray-200 text-gray-300"
              }`}
            >
              {b}
            </div>
          ))}
        </div>
        <div className="rounded-md border border-gray-200 bg-white px-3 py-1.5 font-mono text-xs text-gray-600">
          n = {n} = {bits}
        </div>
      </div>
    </Frame>
  );
}
