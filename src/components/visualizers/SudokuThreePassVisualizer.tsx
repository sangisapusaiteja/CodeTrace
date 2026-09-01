import { Frame, collectIdx, MatrixGrid } from "./primitives";
import type { VisualizerProps } from "./types";

export function SudokuThreePassVisualizer({ step, nums }: VisualizerProps) {
  const rows = Number(step.vars.find((v) => v.name === "rows")?.value ?? 9);
  const cols = Number(step.vars.find((v) => v.name === "cols")?.value ?? 9);
  const r = collectIdx(step, "r");
  const c = collectIdx(step, "c");
  const seenVar = step.vars.find((v) => v.name === "seen");
  const seen = seenVar ? seenVar.value : "";
  const disp = nums.map((v) => (v === 0 ? "·" : String(v)));

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <MatrixGrid values={disp} rows={rows} cols={cols} cellCls="h-7 w-7 text-xs" label="board"
          highlight={(rr, cc) => (rr === r && cc === c ? { value: disp[rr * cols + cc], cls: "bg-red-100 border-red-500 text-red-700" } : null)} />
        {seen && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-xs text-emerald-700">seen = {seen}</div>}
      </div>
    </Frame>
  );
}
