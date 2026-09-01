import { Frame, LinkedList } from "./primitives";
import type { VisualizerProps } from "./types";

export function ReverseBetweenExtractVisualizer({ step, nums }: VisualizerProps) {
  const listVar = step.vars.find((v) => v.name === "list");
  const list = listVar
    ? listVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : nums.map(String);

  return (
    <Frame vars={step.vars} step={step}>
      <LinkedList values={list} label="list" />
    </Frame>
  );
}
