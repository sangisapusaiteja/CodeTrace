import { Frame, collectIdx, LinkedList } from "./primitives";
import type { VisualizerProps } from "./types";

export function PalindromeArrayVisualizer({ step, nums }: VisualizerProps) {
  const left = collectIdx(step, "left");
  const right = collectIdx(step, "right");

  return (
    <Frame vars={step.vars} step={step}>
      <LinkedList values={nums} label="vals"
        highlight={(i) => {
          if (i === left) return { cls: "bg-red-100 border-red-500 text-red-700", label: "L" };
          if (i === right) return { cls: "bg-sky-100 border-sky-500 text-sky-700", label: "R" };
          return null;
        }} />
    </Frame>
  );
}
