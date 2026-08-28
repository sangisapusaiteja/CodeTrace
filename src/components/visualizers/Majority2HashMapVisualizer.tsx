import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Hash Map approach — shows the array with a read pointer and a live count
// bar chart of each distinct value, with a threshold line.
export function Majority2HashMapVisualizer({ step, nums }: VisualizerProps) {
  const countsVar = step.vars.find((v) => v.name === "counts");
  const thresholdVar = step.vars.find((v) => v.name === "threshold");
  const threshold = thresholdVar ? Number(thresholdVar.value) : Math.floor(nums.length / 3);
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
      {/* Count bars */}
      {Object.keys(counts).length > 0 && (
        <div className="flex items-end justify-center gap-3">
          {Object.entries(counts).map(([k, v]) => (
            <div key={k} className="flex flex-col items-center gap-1">
              <span className={`font-mono text-sm font-semibold ${v > threshold ? "text-emerald-600" : "text-gray-500"}`}>{v}</span>
              <div className="relative">
                <div
                  className={`w-8 rounded-t-md transition-all duration-200 ${
                    v > threshold
                      ? "bg-gradient-to-t from-emerald-500 to-emerald-400"
                      : "bg-gradient-to-t from-gray-300 to-gray-200"
                  }`}
                  style={{ height: `${maxCount ? (v / maxCount) * 80 : 0}px` }}
                />
              </div>
              <span className="text-[10px] text-gray-400">{k}</span>
            </div>
          ))}
        </div>
      )}

      {/* Threshold label */}
      <div className="text-center text-xs text-gray-400">
        threshold = n/3 = {threshold} (elements above qualify)
      </div>
    </Frame>
  );
}
