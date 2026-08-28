import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Split and Reverse — show the string and the extracted words.
export function ReverseWordsSplitVisualizer({ step, nums }: VisualizerProps) {
  const wordsVar = step.vars.find((v) => v.name === "words");
  const words = wordsVar
    ? wordsVar.value.replace(/^\[|\]$/g, "").split(", ").map((s) => s.replace(/"/g, "")).filter((s) => s !== "")
    : [];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${v === 32 ? "bg-gray-100 border-gray-200 text-gray-300" : "bg-white border-gray-300 text-gray-800"}`}>
                {v === 32 ? "␣" : String.fromCharCode(v)}
              </div>
              <div className="mt-1 text-[10px] text-gray-400">{idx}</div>
            </div>
          ))}
        </div>
        {words.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {words.map((w, idx) => (
              <div key={idx} className="flex h-9 items-center justify-center rounded-md bg-sky-50 border border-sky-300 px-2 font-mono text-sm font-semibold text-sky-700">
                {w}
              </div>
            ))}
          </div>
        )}
      </div>
    </Frame>
  );
}
