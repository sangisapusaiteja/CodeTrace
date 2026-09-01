import { Frame, collectIdx, LinkedList } from "./primitives";
import type { VisualizerProps } from "./types";

export function IntersectionHashSetVisualizer({ step, nums }: VisualizerProps) {
  const list = step.vars.find((v) => v.name === "list")?.value ?? "A";
  const idx = collectIdx(step, "idx");
  const visitedVar = step.vars.find((v) => v.name === "visited");
  const visited = visitedVar ? visitedVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <LinkedList values={nums} label={`list ${list}`}
          highlight={(i) => (i === idx ? { cls: "bg-red-100 border-red-500 text-red-700", label: "cur" } : null)} />
        {visited && <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 font-mono text-xs text-fuchsia-700">visited = {visited}</div>}
      </div>
    </Frame>
  );
}
