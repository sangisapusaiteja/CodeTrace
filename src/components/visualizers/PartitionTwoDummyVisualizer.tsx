import { Frame, collectIdx, LinkedList } from "./primitives";
import type { VisualizerProps } from "./types";

export function PartitionTwoDummyVisualizer({ step, nums }: VisualizerProps) {
  const idx = collectIdx(step, "idx");
  const lessVar = step.vars.find((v) => v.name === "less");
  const greaterVar = step.vars.find((v) => v.name === "greater");
  const less = lessVar ? lessVar.value : "";
  const greater = greaterVar ? greaterVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <LinkedList values={nums} label="list"
          highlight={(i) => (i === idx ? { cls: "bg-red-100 border-red-500 text-red-700", label: "cur" } : null)} />
        {less && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-xs text-emerald-700">less chain = {less}</div>}
        {greater && <div className="rounded-md border border-sky-200 bg-sky-50 px-3 py-1 font-mono text-xs text-sky-700">greater chain = {greater}</div>}
      </div>
    </Frame>
  );
}
