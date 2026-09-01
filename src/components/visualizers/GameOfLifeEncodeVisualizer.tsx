import { Frame, collectIdx, MatrixGrid } from "./primitives";
import type { VisualizerProps } from "./types";

export function GameOfLifeEncodeVisualizer({ step, nums }: VisualizerProps) {
  const rows = Number(step.vars.find((v) => v.name === "rows")?.value ?? 2);
  const cols = Number(step.vars.find((v) => v.name === "cols")?.value ?? 2);
  const i = collectIdx(step, "i");
  const j = collectIdx(step, "j");
  const boardVar = step.vars.find((v) => v.name === "board");
  const board = boardVar
    ? boardVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean).map(Number)
    : nums;

  return (
    <Frame vars={step.vars} step={step}>
      <MatrixGrid values={board} rows={rows} cols={cols} label="board (encoded)"
        highlight={(r, c) => {
          if (r === i && c === j) return { value: String(board[r * cols + c]), cls: "bg-red-100 border-red-500 text-red-700" };
          const v = board[r * cols + c];
          if (v === 2) return { value: "2", cls: "bg-emerald-100 border-emerald-500 text-emerald-700" };
          if (v === 3) return { value: "3", cls: "bg-amber-100 border-amber-500 text-amber-700" };
          if (v === 1) return { value: "1", cls: "bg-sky-100 border-sky-500 text-sky-700" };
          return null;
        }} />
    </Frame>
  );
}
