import { Frame, collectIdx, LinkedList } from "./primitives";
import type { VisualizerProps } from "./types";

export function RemoveNthOnePassVisualizer({ step, nums }: VisualizerProps) {
  const slow = collectIdx(step, "slow");
  const fast = collectIdx(step, "fast");
  const listVar = step.vars.find((v) => v.name === "list");
  const list = listVar
    ? listVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : nums.map(String);

  return (
    <Frame vars={step.vars} step={step}>
      <LinkedList values={list} label="list"
        highlight={(i) => {
          if (i === slow) return { cls: "bg-red-100 border-red-500 text-red-700", label: "slow" };
          if (i === fast) return { cls: "bg-sky-100 border-sky-500 text-sky-700", label: "fast" };
          return null;
        }} />
    </Frame>
  );
}
