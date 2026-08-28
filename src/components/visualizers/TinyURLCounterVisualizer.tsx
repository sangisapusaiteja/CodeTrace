import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Counter-Based — show the map and counter.
export function TinyURLCounterVisualizer({ step }: VisualizerProps) {
  const counterVar = step.vars.find((v) => v.name === "counter");
  const mapVar = step.vars.find((v) => v.name === "map");
  const counter = counterVar ? counterVar.value : "";
  const map = mapVar ? mapVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-sm font-bold text-fuchsia-700">
          counter = {counter}
        </div>
        {map && (
          <div className="rounded-md border border-gray-200 bg-white px-3 py-1.5 font-mono text-xs text-gray-600 max-w-md text-center">
            map = {map}
          </div>
        )}
      </div>
    </Frame>
  );
}
