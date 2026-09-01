import { Frame, collectIdx, MatrixGrid } from "./primitives";
import type { VisualizerProps } from "./types";

export function RotateImageSpaceVisualizer({ step, nums }: VisualizerProps) {
  const n = Number(step.vars.find((v) => v.name === "rows")?.value ?? 2);
  const i = collectIdx(step, "i");
  const j = collectIdx(step, "j");
  const rotVar = step.vars.find((v) => v.name === "rotated");
  const rotated = rotVar
    ? rotVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean).map(Number)
    : [];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-5">
        <MatrixGrid values={nums} rows={n} cols={n} label="matrix"
          highlight={(r, c) => (r === i && c === j ? { value: String(nums[r * n + c]), cls: "bg-red-100 border-red-500 text-red-700", label: `(${i},${j})` } : null)} />
        <MatrixGrid values={rotated.length ? rotated : Array(n * n).fill("·")} rows={n} cols={n} label="rotated"
          highlight={(r, c) => (c === n - 1 - (i ?? -1) && r === (j ?? -1) ? { value: String(rotated[r * n + c] ?? "·"), cls: "bg-emerald-100 border-emerald-500 text-emerald-700" } : null)} />
      </div>
    </Frame>
  );
}
