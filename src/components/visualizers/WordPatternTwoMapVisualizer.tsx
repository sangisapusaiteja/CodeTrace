import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Two Hash Maps (Bijection Check) — show the char-to-word and word-to-char maps.
export function WordPatternTwoMapVisualizer({ step }: VisualizerProps) {
  const ctwVar = step.vars.find((v) => v.name === "charToWord");
  const wtcVar = step.vars.find((v) => v.name === "wordToChar");
  const ctw = ctwVar ? ctwVar.value : "";
  const wtc = wtcVar ? wtcVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase text-fuchsia-600">char → word</span>
            <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700 min-w-40 text-center">
              {ctw || "{}"}
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase text-fuchsia-600">word → char</span>
            <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700 min-w-40 text-center">
              {wtc || "{}"}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}
