import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Extra Array — show the original char array and the reversed result array.
export function ReverseStringExtraArrayVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const resultVar = step.vars.find((v) => v.name === "result");
  const result = resultVar
    ? resultVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter((s) => s !== "").map((s) => s.replace(/'/g, ""))
    : [];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">s</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {nums.map((v, idx) => {
              const isCurrent = idx === i;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                      isCurrent
                        ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  >
                    {String.fromCharCode(v)}
                  </div>
                  <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                  <div className="h-5">{isCurrent && <Arrow kind="i" label="i" />}</div>
                </div>
              );
            })}
          </div>
        </div>
        {result.length > 0 && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-600">result</span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {result.map((c, idx) => (
                <div key={idx} className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-50 border-2 border-sky-300 font-mono text-lg font-semibold text-sky-700">
                  {c}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Frame>
  );
}
