import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

export function HappyNumberSetVisualizer({ step, nums }: VisualizerProps) {
  const nVar = step.vars.find((v) => v.name === "n");
  const seenVar = step.vars.find((v) => v.name === "seen");
  const n = nVar ? nVar.value : "";
  const seen = seenVar ? seenVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-emerald-400 bg-emerald-50 font-mono text-2xl font-bold text-emerald-700">
          {n}
        </div>
        {seen && <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 font-mono text-xs text-fuchsia-700">seen = {seen}</div>}
      </div>
    </Frame>
  );
}
