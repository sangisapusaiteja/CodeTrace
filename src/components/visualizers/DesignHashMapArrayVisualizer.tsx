import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force (Direct Address Array) — show the data array and current op.
export function DesignHashMapArrayVisualizer({ step }: VisualizerProps) {
  const opVar = step.vars.find((v) => v.name === "op");
  const keyVar = step.vars.find((v) => v.name === "key");
  const dataVar = step.vars.find((v) => v.name === "data[0..7]");
  const op = opVar ? opVar.value : "";
  const key = keyVar ? keyVar.value : "";
  const data = dataVar ? dataVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter((s) => s !== "").map(Number) : [];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-sm font-bold text-fuchsia-700">
          {op || "initializing"}
          {key !== "" && op !== "initializing" && <span className="ml-2 text-xs text-fuchsia-400">key = {key}</span>}
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-fuchsia-600">data</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {data.map((v, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${v >= 0 ? "bg-emerald-100 border-emerald-400 text-emerald-700" : "bg-gray-50 border-gray-200 text-gray-300"}`}>
                  {v}
                </div>
                <div className="mt-1 text-[10px] text-gray-400">{idx}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}
