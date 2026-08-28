import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Index Mapping — show the first-occurrence index maps.
export function WordPatternIndexVisualizer({ step }: VisualizerProps) {
  const cfVar = step.vars.find((v) => v.name === "charFirst");
  const wfVar = step.vars.find((v) => v.name === "wordFirst");
  const cf = cfVar ? cfVar.value : "";
  const wf = wfVar ? wfVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase text-fuchsia-600">char first index</span>
            <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700 min-w-40 text-center">
              {cf || "{}"}
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase text-fuchsia-600">word first index</span>
            <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700 min-w-40 text-center">
              {wf || "{}"}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}
