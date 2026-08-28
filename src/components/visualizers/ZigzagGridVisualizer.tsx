import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Simulation with 2D Grid — show the string and the grid rows.
export function ZigzagGridVisualizer({ step, nums }: VisualizerProps) {
  const rowVar = step.vars.find((v) => v.name === "row");
  const colVar = step.vars.find((v) => v.name === "col");
  const row = rowVar ? Number(rowVar.value) : 0;
  const col = colVar ? Number(colVar.value) : 0;

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => {
            const isCurrent = idx === col;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${isCurrent ? "bg-emerald-100 border-emerald-500 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-white border-gray-300 text-gray-800"}`}>
                  {String.fromCharCode(v)}
                </div>
                <div className="mt-1 text-[10px] text-gray-400">{idx}</div>
              </div>
            );
          })}
        </div>
        <div className="text-center text-xs text-gray-400">
          current cell: row {row}, col {col}
        </div>
      </div>
    </Frame>
  );
}
