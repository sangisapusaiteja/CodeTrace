import { Frame, collectIdx, MatrixGrid } from "./primitives";
import type { VisualizerProps } from "./types";

export function SpiralSimulateVisualizer({ step, nums }: VisualizerProps) {
  const rows = Number(step.vars.find((v) => v.name === "rows")?.value ?? 2);
  const cols = Number(step.vars.find((v) => v.name === "cols")?.value ?? 2);
  const row = collectIdx(step, "row");
  const col = collectIdx(step, "col");

  return (
    <Frame vars={step.vars} step={step}>
      <MatrixGrid values={nums} rows={rows} cols={cols} label="matrix"
        highlight={(r, c) => {
          if (r === row && c === col) return { value: String(nums[r * cols + c]), cls: "bg-red-100 border-red-500 text-red-700", label: "cur" };
          return null;
        }} />
    </Frame>
  );
}
