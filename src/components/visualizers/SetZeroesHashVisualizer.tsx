import { Frame, collectIdx, MatrixGrid } from "./primitives";
import type { VisualizerProps } from "./types";

export function SetZeroesHashVisualizer({ step, nums }: VisualizerProps) {
  const rows = Number(step.vars.find((v) => v.name === "rows")?.value ?? 2);
  const cols = Number(step.vars.find((v) => v.name === "cols")?.value ?? 2);
  const i = collectIdx(step, "i");
  const j = collectIdx(step, "j");
  const zrVar = step.vars.find((v) => v.name === "zeroRows");
  const zcVar = step.vars.find((v) => v.name === "zeroCols");
  const zeroRows = zrVar ? zrVar.value.replace(/[{}]/g, "").split(",").map((s) => s.trim()).filter(Boolean).map(Number) : [];
  const zeroCols = zcVar ? zcVar.value.replace(/[{}]/g, "").split(",").map((s) => s.trim()).filter(Boolean).map(Number) : [];

  return (
    <Frame vars={step.vars} step={step}>
      <MatrixGrid values={nums} rows={rows} cols={cols} label="matrix"
        highlight={(r, c) => {
          if (r === i && c === j) return { value: String(nums[r * cols + c]), cls: "bg-red-100 border-red-500 text-red-700", label: `(${i},${j})` };
          if (zeroRows.includes(r) || zeroCols.includes(c)) return { value: "0", cls: "bg-amber-100 border-amber-500 text-amber-700" };
          return null;
        }} />
    </Frame>
  );
}
