import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Two Pointers — array with left and right pointers.
export function MaxAreaTwoPointerVisualizer({ step, nums }: VisualizerProps) {
  const left = collectIdx(step, "left");
  const right = collectIdx(step, "right");

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-wrap justify-center gap-1.5">
        {nums.map((v, idx) => {
          const isLeft = idx === left;
          const isRight = idx === right;
          return (
            <div key={idx} className="flex flex-col items-center">
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 ${isLeft ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]" : isRight ? "bg-amber-100 border-amber-500 text-amber-800 shadow-[0_0_12px_rgba(234,179,8,0.5)]" : "bg-white border-gray-300 text-gray-800"}`}>
                {v}
              </div>
              <div className="mt-1 h-5 text-[10px] text-gray-400">{idx}</div>
              <div className="h-5">
                {isLeft && <Arrow kind="i" label="L" />}
                {isRight && <Arrow kind="j" label="R" />}
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}
