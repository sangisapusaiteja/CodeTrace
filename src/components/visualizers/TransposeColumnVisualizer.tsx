import { Frame, collectIdx, MatrixGrid } from "./primitives";
import type { VisualizerProps } from "./types";

export function TransposeColumnVisualizer({ step, nums }: VisualizerProps) {
  const rows = Number(step.vars.find((v) => v.name === "rows")?.value ?? 2);
  const cols = Number(step.vars.find((v) => v.name === "cols")?.value ?? 2);
  const j = collectIdx(step, "j");
  const i = collectIdx(step, "i");
  const resultVar = step.vars.find((v) => v.name === "result");
  const result = resultVar
    ? resultVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean).map(Number)
    : [];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-5">
        <MatrixGrid values={nums} rows={rows} cols={cols} label="matrix"
          highlight={(r, c) => {
            if (c === j && (i === null || r === i)) return { value: String(nums[r * cols + c]), cls: "bg-sky-100 border-sky-500 text-sky-700", label: `col ${j}` };
            return null;
          }} />
        <MatrixGrid values={result.length ? result : Array(rows * cols).fill("·")} rows={cols} cols={rows} label="result"
          highlight={(r, c) => (j !== null && r === j ? { value: String(result[r * rows + c] ?? "·"), cls: "bg-emerald-100 border-emerald-500 text-emerald-700", label: `row ${j}` } : null)} />
      </div>
    </Frame>
  );
}
