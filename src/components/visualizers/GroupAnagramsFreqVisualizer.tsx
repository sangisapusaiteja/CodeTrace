import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Character Frequency — show the anagram map.
export function GroupAnagramsFreqVisualizer({ step }: VisualizerProps) {
  const mapVar = step.vars.find((v) => v.name === "anagramMap");
  const map = mapVar ? mapVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        {map && (
          <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700 max-w-md text-center">
            {map}
          </div>
        )}
      </div>
    </Frame>
  );
}
