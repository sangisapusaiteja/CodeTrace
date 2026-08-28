import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Brian Kernighan's Algorithm — show n in binary and count.
export function HammingWeightKernighanVisualizer({ step, nums }: VisualizerProps) {
  const nVar = step.vars.find((v) => v.name === "n");
  const countVar = step.vars.find((v) => v.name === "count");
  const n = nVar ? Number(nVar.value) : nums[0];
  const count = countVar ? Number(countVar.value) : 0;
  const bits = n.toString(2);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1">
          {bits.split("").map((b, idx) => (
            <div
              key={idx}
              className={`flex h-11 w-11 items-center justify-center rounded-lg border-2 font-mono text-lg font-bold ${
                b === "1" ? "bg-violet-100 border-violet-400 text-violet-700" : "bg-gray-50 border-gray-200 text-gray-300"
              }`}
            >
              {b}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-md bg-violet-100 px-2 py-0.5 font-mono font-bold text-violet-700">
            n = {n}
          </span>
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">
            count = {count}
          </span>
        </div>
      </div>
    </Frame>
  );
}
