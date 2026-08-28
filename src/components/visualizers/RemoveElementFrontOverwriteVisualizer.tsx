import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Front Overwrite approach — in-place array with i (read) and k (write) arrows.
// The compacted prefix turns green, skipped elements are grayed out.
export function RemoveElementFrontOverwriteVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const k = collectIdx(step, "k");
  const valVar = step.vars.find((v) => v.name === "val");
  const val = valVar ? Number(valVar.value) : 0;
  const valuesVar = step.vars.find((v) => v.name === "nums");
  const values = valuesVar
    ? valuesVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : nums.map(String);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">nums (in-place)</span>
        <div className="flex flex-wrap justify-center gap-1.5">
          {values.map((v, idx) => {
            const isI = idx === i;
            const isK = idx === k && idx !== i;
            const isKept = k !== null && idx < k;
            const numVal = Number(v);
            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                    isI
                      ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                      : isK
                      ? "bg-amber-100 border-amber-500 text-amber-800 shadow-[0_0_12px_rgba(234,179,8,0.5)]"
                      : isKept
                      ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                      : numVal === val
                      ? "bg-gray-100 border-gray-300 text-gray-400"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                >
                  {v}
                </div>
                <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                <div className="h-5">
                  {isI && <Arrow kind="i" label="i" />}
                  {isK && !isI && <Arrow kind="active" label="k" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Frame>
  );
}
