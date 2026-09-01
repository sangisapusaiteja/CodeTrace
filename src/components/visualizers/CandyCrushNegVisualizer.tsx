import { Frame, MatrixGrid } from "./primitives";
import type { VisualizerProps } from "./types";

export function CandyCrushNegVisualizer({ step, nums }: VisualizerProps) {
  const rows = Number(step.vars.find((v) => v.name === "rows")?.value ?? 2);
  const cols = Number(step.vars.find((v) => v.name === "cols")?.value ?? 2);
  const boardVar = step.vars.find((v) => v.name === "board");
  const board = boardVar
    ? boardVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean).map(Number)
    : nums;

  return (
    <Frame vars={step.vars} step={step}>
      <MatrixGrid values={board} rows={rows} cols={cols} label="board"
        highlight={(r, c) => {
          const v = board[r * cols + c];
          if (v === 0) return { value: "·", cls: "bg-gray-100 border-gray-200 text-gray-400" };
          if (v < 0) return { value: String(Math.abs(v)), cls: "bg-rose-100 border-rose-500 text-rose-700" };
          return null;
        }} />
    </Frame>
  );
}
