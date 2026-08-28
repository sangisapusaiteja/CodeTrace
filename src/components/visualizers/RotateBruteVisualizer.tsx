import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force — shows the array shifting right one step at a time with
// the saved last element and the shift pointer j.
export function RotateBruteVisualizer({ step, nums }: VisualizerProps) {
  const j = collectIdx(step, "j");
  const valuesVar = step.vars.find((v) => v.name === "nums");
  const values = valuesVar
    ? valuesVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : nums.map(String);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-wrap justify-center gap-1.5">
        {values.map((v, idx) => {
          const isJ = idx === j;
          return (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                  isJ
                    ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                {v}
              </div>
              <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
              <div className="h-5">{isJ && <Arrow kind="j" label="j" />}</div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}
