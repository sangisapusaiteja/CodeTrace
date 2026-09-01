import { Frame, collectIdx, MatrixGrid } from "./primitives";
import type { VisualizerProps } from "./types";

export function SpiralLayerVisualizer({ step, nums }: VisualizerProps) {
  const rows = Number(step.vars.find((v) => v.name === "rows")?.value ?? 2);
  const cols = Number(step.vars.find((v) => v.name === "cols")?.value ?? 2);
  const top = collectIdx(step, "top") ?? 0;
  const bottom = collectIdx(step, "bottom") ?? rows - 1;
  const left = collectIdx(step, "left") ?? 0;
  const right = collectIdx(step, "right") ?? cols - 1;
  const r = collectIdx(step, "row");
  const c = collectIdx(step, "col");

  return (
    <Frame vars={step.vars} step={step}>
      <MatrixGrid values={nums} rows={rows} cols={cols} label="matrix"
        highlight={(rr, cc) => {
          const onBoundary = rr === top || rr === bottom || cc === left || cc === right;
          if (rr === r && cc === c) return { value: String(nums[rr * cols + cc]), cls: "bg-red-100 border-red-500 text-red-700", label: "cur" };
          if (onBoundary) return { value: String(nums[rr * cols + cc]), cls: "bg-amber-100 border-amber-500 text-amber-700" };
          return null;
        }} />
    </Frame>
  );
}
