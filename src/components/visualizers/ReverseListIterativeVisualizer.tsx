import { Frame, collectIdx, LinkedList } from "./primitives";
import type { VisualizerProps } from "./types";

export function ReverseListIterativeVisualizer({ step, nums }: VisualizerProps) {
  const idx = collectIdx(step, "idx");
  const listVar = step.vars.find((v) => v.name === "list");
  const list = listVar
    ? listVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : nums.map(String);

  return (
    <Frame vars={step.vars} step={step}>
      <LinkedList values={list} label="list"
        highlight={(i) => (i === idx ? { cls: "bg-red-100 border-red-500 text-red-700", label: "curr" } : null)} />
    </Frame>
  );
}
