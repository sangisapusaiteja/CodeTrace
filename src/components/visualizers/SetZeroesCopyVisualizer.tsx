import { Frame, collectIdx, MatrixGrid } from "./primitives";
import type { VisualizerProps } from "./types";

export function SetZeroesCopyVisualizer({ step, nums }: VisualizerProps) {
  const rows = Number(step.vars.find((v) => v.name === "rows")?.value ?? 2);
  const cols = Number(step.vars.find((v) => v.name === "cols")?.value ?? 2);
  const i = collectIdx(step, "i");
  const j = collectIdx(step, "j");
  const matrixVar = step.vars.find((v) => v.name === "matrix");
  const matrix = matrixVar
    ? matrixVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean).map(Number)
    : nums;

  return (
    <Frame vars={step.vars} step={step}>
      <MatrixGrid values={matrix} rows={rows} cols={cols} label="matrix"
        highlight={(r, c) => {
          if (r === i && c === j) return { value: String(matrix[r * cols + c]), cls: "bg-red-100 border-red-500 text-red-700" };
          if (matrix[r * cols + c] === 0) return { value: "0", cls: "bg-amber-100 border-amber-500 text-amber-700" };
          return null;
        }} />
    </Frame>
  );
}
