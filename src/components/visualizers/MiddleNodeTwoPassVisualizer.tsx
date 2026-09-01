import { Frame, collectIdx, LinkedList } from "./primitives";
import type { VisualizerProps } from "./types";

export function MiddleNodeTwoPassVisualizer({ step, nums }: VisualizerProps) {
  const idx = collectIdx(step, "idx");

  return (
    <Frame vars={step.vars} step={step}>
      <LinkedList values={nums} label="list"
        highlight={(i) => (i === idx ? { cls: "bg-red-100 border-red-500 text-red-700", label: "cur" } : null)} />
    </Frame>
  );
}
