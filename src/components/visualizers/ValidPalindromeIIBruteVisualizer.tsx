import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force — show the string and the candidate after each deletion.
export function ValidPalindromeIIBruteVisualizer({ step }: VisualizerProps) {
  const sVar = step.vars.find((v) => v.name === "s");
  const s = sVar ? sVar.value.replace(/"/g, "") : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">s</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {s.split("").map((c, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white border-2 border-gray-300 font-mono text-lg font-semibold text-gray-800">
                  {c}
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
