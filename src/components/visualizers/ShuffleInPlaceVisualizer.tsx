import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// In-place approach — shows the single array being encoded (values grow
// large) then decoded back to the shuffled result.
export function ShuffleInPlaceVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const valuesVar = step.vars.find((v) => v.name === "nums");
  const values = valuesVar
    ? valuesVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : nums.map(String);

  // Detect encode phase (large values) vs decode phase (small values).
  const isEncoded = values.some((v) => Number(v) > 1000);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          nums {isEncoded ? "(encoded)" : "(in-place)"}
        </span>
        <div className="flex flex-wrap justify-center gap-1.5">
          {values.map((v, idx) => {
            const num = Number(v);
            const big = num > 1000;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg font-mono text-sm font-semibold border-2 transition-all duration-200 ${
                    idx === i
                      ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                      : big
                      ? "bg-amber-100 border-amber-500 text-amber-800"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                >
                  {v}
                </div>
                <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                <div className="h-5">{idx === i ? <Arrow kind="i" /> : null}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Frame>
  );
}
