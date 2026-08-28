import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Dynamic Programming — bar chart with the current day highlighted and the
// two DP states (notHolding, holding) shown as chips.
export function MaxProfit2DPVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const notHoldingVar = step.vars.find((v) => v.name === "notHolding");
  const holdingVar = step.vars.find((v) => v.name === "holding");
  const notHolding = notHoldingVar ? Number(notHoldingVar.value) : 0;
  const holding = holdingVar ? Number(holdingVar.value) : -nums[0];
  const maxPrice = Math.max(...nums);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-end justify-center gap-1" style={{ height: "140px" }}>
          {nums.map((v, idx) => {
            const isCurrent = i !== null && idx === i;
            const height = maxPrice ? (v / maxPrice) * 120 + 12 : 12;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="mb-1 flex flex-col items-center">
                  {isCurrent && <Arrow kind="i" label="day" />}
                </div>
                <div
                  className={`w-8 rounded-t-md transition-all duration-200 ${
                    isCurrent
                      ? "bg-gradient-to-t from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
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
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">
            notHolding = {notHolding}
          </span>
          <span className="rounded-md bg-amber-100 px-2 py-0.5 font-mono font-bold text-amber-700">
            holding = {holding}
          </span>
        </div>
      </div>
    </Frame>
  );
}
