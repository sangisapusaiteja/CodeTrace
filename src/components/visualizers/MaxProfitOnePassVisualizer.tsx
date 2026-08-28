import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// One Pass — bar chart with a running minPrice line and profit calculation.
export function MaxProfitOnePassVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const minPriceVar = step.vars.find((v) => v.name === "minPrice");
  const maxProfitVar = step.vars.find((v) => v.name === "maxProfit");
  const minPrice = minPriceVar ? Number(minPriceVar.value) : nums[0];
  const maxProfit = maxProfitVar ? Number(maxProfitVar.value) : 0;
  const maxPrice = Math.max(...nums);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-end justify-center gap-1" style={{ height: "140px" }}>
          {nums.map((v, idx) => {
            const isCurrent = i !== null && idx === i;
            const isMin = v === minPrice && i !== null && idx <= i;
            const height = maxPrice ? (v / maxPrice) * 120 + 12 : 12;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="mb-1 flex flex-col items-center">
                  {isCurrent && !isMin && <Arrow kind="found" label="sell" />}
                  {isCurrent && isMin && <Arrow kind="i" label="new min" />}
                  {isMin && !isCurrent && <Arrow kind="j" label="min" />}
                </div>
                <div
                  className={`w-8 rounded-t-md transition-all duration-200 ${
                    isCurrent && !isMin
                      ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                      : isMin
                      ? "bg-gradient-to-t from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
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
        {/* Min price indicator */}
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-md bg-amber-100 px-2 py-0.5 font-mono font-bold text-amber-700">
            min = {minPrice}
          </span>
          {maxProfit > 0 && (
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">
              profit = {maxProfit}
            </span>
          )}
        </div>
      </div>
    </Frame>
  );
}
