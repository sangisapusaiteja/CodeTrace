import { Frame, collectIdx, MatrixGrid } from "./primitives";
import type { VisualizerProps } from "./types";

export function SudokuSinglePassVisualizer({ step, nums }: VisualizerProps) {
  const rows = Number(step.vars.find((v) => v.name === "rows")?.value ?? 9);
  const cols = Number(step.vars.find((v) => v.name === "cols")?.value ?? 9);
  const r = collectIdx(step, "r");
  const c = collectIdx(step, "c");
  const disp = nums.map((v) => (v === 0 ? "·" : String(v)));

  return (
    <Frame vars={step.vars} step={step}>
      <MatrixGrid values={disp} rows={rows} cols={cols} cellCls="h-7 w-7 text-xs" label="board"
        highlight={(rr, cc) => {
          if (rr === r && cc === c) return { value: disp[rr * cols + cc], cls: "bg-emerald-100 border-emerald-500 text-emerald-700" };
          return null;
        }} />
    </Frame>
  );
}
