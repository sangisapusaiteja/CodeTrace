import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Vertical Scanning — show the list of strings.
export function LongestCommonPrefixVerticalVisualizer({ step }: VisualizerProps) {
  const strsVar = step.vars.find((v) => v.name === "strs");
  const strs = strsVar
    ? strsVar.value.replace(/^\[|\]$/g, "").split(", ").map((s) => s.replace(/"/g, "")).filter((s) => s !== "")
    : [];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-2">
        {strs.map((w, row) => (
          <div key={row} className="flex flex-wrap justify-center gap-1.5">
            {w.split("").map((c, col) => (
              <div key={col} className="flex h-10 w-10 items-center justify-center rounded-md bg-white border border-gray-300 font-mono text-base font-semibold text-gray-800">
                {c}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Frame>
  );
}
