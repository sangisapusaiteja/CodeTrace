import { Frame, collectIdx, LinkedList } from "./primitives";
import type { VisualizerProps } from "./types";

export function AddTwoNumbersIterativeVisualizer({ step, nums }: VisualizerProps) {
  const idx = collectIdx(step, "idx");
  const carryVar = step.vars.find((v) => v.name === "carry");
  const carry = carryVar ? carryVar.value : "";
  const resultVar = step.vars.find((v) => v.name === "result");
  const result = resultVar
    ? resultVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <LinkedList values={nums} label="l1"
          highlight={(i) => (i === idx ? { cls: "bg-red-100 border-red-500 text-red-700", label: "cur" } : null)} />
        {result.length > 0 && <LinkedList values={result} label="result" />}
        {carry && <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1 font-mono text-xs text-amber-700">carry = {carry}</div>}
      </div>
    </Frame>
  );
}
