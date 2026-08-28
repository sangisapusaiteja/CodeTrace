import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Gauss' Formula — show the array with current element highlighted, plus the
// expected and actual sums.
export function MissingNumberGaussVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const expectedVar = step.vars.find((v) => v.name === "expectedSum");
  const actualVar = step.vars.find((v) => v.name === "actualSum");
  const expected = expectedVar ? Number(expectedVar.value) : 0;
  const actual = actualVar ? Number(actualVar.value) : 0;

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => {
            const isCurrent = idx === i;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${isCurrent ? "bg-emerald-100 border-emerald-500 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-white border-gray-300 text-gray-800"}`}>
                  {v}
                </div>
                <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
                <div className="h-5">{isCurrent && <Arrow kind="i" label="i" />}</div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-md bg-sky-100 px-2 py-0.5 font-mono font-bold text-sky-700">
            expected = {expected}
          </span>
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">
            actual = {actual}
          </span>
        </div>
      </div>
    </Frame>
  );
}
