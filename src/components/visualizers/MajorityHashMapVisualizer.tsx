import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Hash Map approach — shows the array with a read pointer and a live count
// bar chart of each distinct value.
export function MajorityHashMapVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const countsVar = step.vars.find((v) => v.name === "counts");
  const counts: Record<string, number> = {};
  if (countsVar) {
    for (const part of countsVar.value.replace(/[{}]/g, "").split(",")) {
      const [k, v] = part.split(":");
      if (k !== undefined && v !== undefined) counts[k.trim()] = Number(v.trim());
    }
  }
  const maxCount = Math.max(0, ...Object.values(counts));

  return (
    <Frame vars={step.vars} step={step}>
      {/* Array */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {nums.map((v, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                idx === i
                  ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              {v}
            </div>
            <div className="h-5">{idx === i ? <Arrow kind="i" /> : <span className="text-[10px] text-gray-400">{idx}</span>}</div>
          </div>
        ))}
      </div>

      {/* Count bars */}
      {Object.keys(counts).length > 0 && (
        <div className="flex items-end justify-center gap-3">
          {Object.entries(counts).map(([k, v]) => (
            <div key={k} className="flex flex-col items-center gap-1">
              <span className="font-mono text-sm font-semibold text-emerald-600">{v}</span>
              <div
                className="w-8 rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-200"
                style={{ height: `${maxCount ? (v / maxCount) * 60 : 0}px` }}
              />
              <span className="text-[10px] text-gray-400">{k}</span>
            </div>
          ))}
        </div>
      )}
    </Frame>
  );
}
