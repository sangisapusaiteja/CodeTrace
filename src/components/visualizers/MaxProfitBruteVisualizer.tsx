import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force — bar chart with buy (i, red) and sell (j, green) arrows,
// profit shown on hover. Each bar is a price on a given day.
export function MaxProfitBruteVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const j = collectIdx(step, "j");
  const maxProfitVar = step.vars.find((v) => v.name === "maxProfit");
  const maxProfit = maxProfitVar ? Number(maxProfitVar.value) : 0;
  const maxPrice = Math.max(...nums);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-end justify-center gap-1" style={{ height: "140px" }}>
          {nums.map((v, idx) => {
            const isBuy = idx === i;
            const isSell = idx === j;
            const height = maxPrice ? (v / maxPrice) * 120 + 12 : 12;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="mb-1 flex flex-col items-center">
                  {isBuy && <Arrow kind="i" label="buy" />}
                  {isSell && !isBuy && <Arrow kind="found" label="sell" />}
                </div>
                <div
                  className={`w-8 rounded-t-md transition-all duration-200 ${
                    isBuy
                      ? "bg-gradient-to-t from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                      : isSell
                      ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
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
        {maxProfit > 0 && (
          <div className="rounded-md bg-emerald-100 px-3 py-1 font-mono text-sm font-bold text-emerald-700">
            profit = {maxProfit}
          </div>
        )}
      </div>
    </Frame>
  );
}
