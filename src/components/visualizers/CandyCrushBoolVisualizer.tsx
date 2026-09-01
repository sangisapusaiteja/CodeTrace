import { Frame, MatrixGrid } from "./primitives";
import type { VisualizerProps } from "./types";

export function CandyCrushBoolVisualizer({ step, nums }: VisualizerProps) {
  const rows = Number(step.vars.find((v) => v.name === "rows")?.value ?? 2);
  const cols = Number(step.vars.find((v) => v.name === "cols")?.value ?? 2);
  const boardVar = step.vars.find((v) => v.name === "board");
  const board = boardVar
    ? boardVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean).map(Number)
    : nums;

  return (
    <Frame vars={step.vars} step={step}>
      <MatrixGrid values={board} rows={rows} cols={cols} label="board"
        highlight={(r, c) => (board[r * cols + c] === 0 ? { value: "·", cls: "bg-gray-100 border-gray-200 text-gray-400" } : null)} />
    </Frame>
  );
}
