import { Frame, collectIdx, LinkedList } from "./primitives";
import type { VisualizerProps } from "./types";

export function DetectCycleSetVisualizer({ step, nums }: VisualizerProps) {
  const idx = collectIdx(step, "idx");
  const seenVar = step.vars.find((v) => v.name === "seen");
  const seen = seenVar ? seenVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <LinkedList values={nums} label="list"
          highlight={(i) => (i === idx ? { cls: "bg-red-100 border-red-500 text-red-700", label: "cur" } : null)} />
        {seen && <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 font-mono text-xs text-fuchsia-700">seen = {seen}</div>}
      </div>
    </Frame>
  );
}
