import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Sorting — show the groups map.
export function GroupAnagramsSortVisualizer({ step }: VisualizerProps) {
  const groupsVar = step.vars.find((v) => v.name === "groups");
  const groups = groupsVar ? groupsVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        {groups && (
          <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700 max-w-md text-center">
            {groups}
          </div>
        )}
      </div>
    </Frame>
  );
}
