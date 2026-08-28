import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Random Key Generation — show the two maps.
export function TinyURLRandomVisualizer({ step }: VisualizerProps) {
  const c2uVar = step.vars.find((v) => v.name === "code2url");
  const u2cVar = step.vars.find((v) => v.name === "url2code");
  const c2u = c2uVar ? c2uVar.value : "";
  const u2c = u2cVar ? u2cVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase text-fuchsia-600">code → url</span>
            <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700 min-w-40 text-center">
              {c2u || "{}"}
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase text-fuchsia-600">url → code</span>
            <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700 min-w-40 text-center">
              {u2c || "{}"}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}
