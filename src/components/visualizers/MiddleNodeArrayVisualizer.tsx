import { Frame, collectIdx, LinkedList } from "./primitives";
import type { VisualizerProps } from "./types";

export function MiddleNodeArrayVisualizer({ step, nums }: VisualizerProps) {
  const idx = collectIdx(step, "idx");
  const nodesVar = step.vars.find((v) => v.name === "nodes");
  const nodes = nodesVar
    ? nodesVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : nums.map(String);

  return (
    <Frame vars={step.vars} step={step}>
      <LinkedList values={nodes} label="nodes"
        highlight={(i) => (i === idx ? { cls: "bg-red-100 border-red-500 text-red-700", label: "cur" } : null)} />
    </Frame>
  );
}
