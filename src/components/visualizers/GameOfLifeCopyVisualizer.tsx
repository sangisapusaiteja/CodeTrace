import { Frame, collectIdx, MatrixGrid } from "./primitives";
import type { VisualizerProps } from "./types";

export function GameOfLifeCopyVisualizer({ step, nums }: VisualizerProps) {
  const rows = Number(step.vars.find((v) => v.name === "rows")?.value ?? 2);
  const cols = Number(step.vars.find((v) => v.name === "cols")?.value ?? 2);
  const i = collectIdx(step, "i");
  const j = collectIdx(step, "j");

  return (
    <Frame vars={step.vars} step={step}>
      <MatrixGrid values={nums} rows={rows} cols={cols} label="board"
        highlight={(r, c) => {
          if (r === i && c === j) return { value: String(nums[r * cols + c]), cls: "bg-red-100 border-red-500 text-red-700", label: `(${i},${j})` };
          if (nums[r * cols + c] === 1) return { value: "1", cls: "bg-emerald-100 border-emerald-500 text-emerald-700" };
          return null;
        }} />
    </Frame>
  );
}
