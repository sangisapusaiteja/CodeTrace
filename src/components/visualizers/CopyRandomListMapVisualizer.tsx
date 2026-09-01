import { Frame, collectIdx, LinkedList } from "./primitives";
import type { VisualizerProps } from "./types";

export function CopyRandomListMapVisualizer({ step, nums }: VisualizerProps) {
  const idx = collectIdx(step, "idx");
  const randomVar = step.vars.find((v) => v.name === "random");
  const random = randomVar ? randomVar.value : "";
  const listVar = step.vars.find((v) => v.name === "list");
  const list = listVar
    ? listVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : nums.map(String);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <LinkedList values={list} label="original"
          highlight={(i) => (i === idx ? { cls: "bg-red-100 border-red-500 text-red-700", label: "cur" } : null)} />
        {random && <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 font-mono text-xs text-fuchsia-700">random = {random}</div>}
      </div>
    </Frame>
  );
}
