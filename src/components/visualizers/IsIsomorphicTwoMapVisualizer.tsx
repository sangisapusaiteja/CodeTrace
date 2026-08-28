import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Two Hash Maps (Bijection Check) — show mapST and mapTS.
export function IsIsomorphicTwoMapVisualizer({ step }: VisualizerProps) {
  const mapSTVar = step.vars.find((v) => v.name === "mapST");
  const mapTSVar = step.vars.find((v) => v.name === "mapTS");
  const mapST = mapSTVar ? mapSTVar.value : "";
  const mapTS = mapTSVar ? mapTSVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase text-fuchsia-600">s → t</span>
            <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700 min-w-40 text-center">
              {mapST || "{}"}
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase text-fuchsia-600">t → s</span>
            <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700 min-w-40 text-center">
              {mapTS || "{}"}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}
