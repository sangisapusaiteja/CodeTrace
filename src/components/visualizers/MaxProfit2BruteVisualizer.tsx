import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force (Recursion) — bar chart with the current day highlighted and
// the holding state shown. The recursion explores buy/sell/skip decisions.
export function MaxProfit2BruteVisualizer({ step, nums }: VisualizerProps) {
  const day = collectIdx(step, "day");
  const holdingVar = step.vars.find((v) => v.name === "holding");
  const holding = holdingVar ? holdingVar.value === "true" : false;
  const maxPrice = Math.max(...nums);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-end justify-center gap-1" style={{ height: "140px" }}>
          {nums.map((v, idx) => {
            const isCurrent = day !== null && idx === day;
            const height = maxPrice ? (v / maxPrice) * 120 + 12 : 12;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="mb-1 flex flex-col items-center">
                  {isCurrent && holding && <Arrow kind="active" label="hold" />}
                  {isCurrent && !holding && <Arrow kind="i" label="day" />}
                </div>
                <div
                  className={`w-8 rounded-t-md transition-all duration-200 ${
                    isCurrent
                      ? holding
                        ? "bg-gradient-to-t from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                        : "bg-gradient-to-t from-sky-500 to-cyan-400 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                      : "bg-gradient-to-t from-gray-300 to-gray-200"
                  }`}
                  style={{ height: `${height}px` }}
                />
                <span className="mt-1 font-mono text-[11px] font-semibold text-gray-600">{v}</span>
                <span className="text-[9px] text-gray-400">{idx}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span
            className={`rounded-md px-2 py-0.5 font-mono font-bold ${
              holding ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"
            }`}
          >
            {holding ? "holding stock" : "not holding"}
          </span>
        </div>
      </div>
    </Frame>
  );
}
