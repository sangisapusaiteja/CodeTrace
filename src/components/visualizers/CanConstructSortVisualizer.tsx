import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Sorting — show sorted note and mag with pointer i.
export function CanConstructSortVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const noteVar = step.vars.find((v) => v.name === "note");
  const note = noteVar ? noteVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase text-gray-400">note</span>
          <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700">
            {note}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase text-gray-400">mag</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {nums.map((v, idx) => {
              const isCurrent = idx === i;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${
                      isCurrent ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]" : "bg-white border-gray-300 text-gray-800"
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
      </div>
    </Frame>
  );
}
