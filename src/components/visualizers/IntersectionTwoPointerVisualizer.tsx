import { Frame, collectIdx, LinkedList } from "./primitives";
import type { VisualizerProps } from "./types";

export function IntersectionTwoPointerVisualizer({ step, nums }: VisualizerProps) {
  const pA = collectIdx(step, "pA");
  const pB = collectIdx(step, "pB");

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <LinkedList values={nums} label="list A"
          highlight={(i) => (i === pA ? { cls: "bg-red-100 border-red-500 text-red-700", label: "pA" } : null)} />
        <LinkedList values={nums} label="list B"
          highlight={(i) => (i === pB ? { cls: "bg-sky-100 border-sky-500 text-sky-700", label: "pB" } : null)} />
      </div>
    </Frame>
  );
}
