import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Traverse from End — char array with pointer i scanning from the right.
export function LengthOfLastWordEndVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const lengthVar = step.vars.find((v) => v.name === "length");
  const length = lengthVar ? Number(lengthVar.value) : 0;

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => {
            const isCurrent = idx === i;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                    isCurrent
                      ? v === 32
                        ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                        : "bg-emerald-100 border-emerald-500 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                      : v === 32
                      ? "bg-gray-100 border-gray-200 text-gray-300"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                >
                  {v === 32 ? "␣" : String.fromCharCode(v)}
                </div>
                <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                <div className="h-5">{isCurrent && <Arrow kind="i" label="i" />}</div>
              </div>
            );
          })}
        </div>
        <div className="text-center text-xs">
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">
            length = {length}
          </span>
        </div>
      </div>
    </Frame>
  );
}
