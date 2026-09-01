import { Frame, MatrixGrid } from "./primitives";
import type { VisualizerProps } from "./types";

export function RotateImageTransposeVisualizer({ step, nums }: VisualizerProps) {
  const n = Number(step.vars.find((v) => v.name === "rows")?.value ?? 2);
  const matrixVar = step.vars.find((v) => v.name === "matrix");
  const matrix = matrixVar
    ? matrixVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean).map(Number)
    : nums;

  return (
    <Frame vars={step.vars} step={step}>
      <MatrixGrid values={matrix} rows={n} cols={n} label="matrix (rotating)" />
    </Frame>
  );
}
