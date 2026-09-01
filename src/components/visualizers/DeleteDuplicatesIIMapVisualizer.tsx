import { Frame, collectIdx, LinkedList } from "./primitives";
import type { VisualizerProps } from "./types";

export function DeleteDuplicatesIIMapVisualizer({ step, nums }: VisualizerProps) {
  const idx = collectIdx(step, "idx");
  const countVar = step.vars.find((v) => v.name === "count");
  const count = countVar ? countVar.value : "";
  const listVar = step.vars.find((v) => v.name === "list");
  const list = listVar
    ? listVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : nums.map(String);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <LinkedList values={list} label="list"
          highlight={(i) => (i === idx ? { cls: "bg-red-100 border-red-500 text-red-700", label: "cur" } : null)} />
        {count && <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 font-mono text-xs text-fuchsia-700">count = {count}</div>}
      </div>
    </Frame>
  );
}
