import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

export function HappyNumberFloydVisualizer({ step, nums }: VisualizerProps) {
  const slowVar = step.vars.find((v) => v.name === "slow");
  const fastVar = step.vars.find((v) => v.name === "fast");
  const slow = slowVar ? slowVar.value : "";
  const fast = fastVar ? fastVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-red-500">slow</span>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-red-400 bg-red-50 font-mono text-xl font-bold text-red-700">{slow}</div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-500">fast</span>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-sky-400 bg-sky-50 font-mono text-xl font-bold text-sky-700">{fast}</div>
        </div>
      </div>
    </Frame>
  );
}
