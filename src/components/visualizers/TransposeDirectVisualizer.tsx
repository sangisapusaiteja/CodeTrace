import { Frame, collectIdx, MatrixGrid } from "./primitives";
import type { VisualizerProps } from "./types";

export function TransposeDirectVisualizer({ step, nums }: VisualizerProps) {
  const rows = Number(step.vars.find((v) => v.name === "rows")?.value ?? 2);
  const cols = Number(step.vars.find((v) => v.name === "cols")?.value ?? 2);
  const i = collectIdx(step, "i");
  const j = collectIdx(step, "j");
  const resultVar = step.vars.find((v) => v.name === "result");
  const result = resultVar
    ? resultVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean).map(Number)
    : [];

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-5">
        <MatrixGrid values={nums} rows={rows} cols={cols} label="matrix"
          highlight={(r, c) => {
            if (r === i && c === j) return { value: String(nums[r * cols + c]), cls: "bg-red-100 border-red-500 text-red-700", label: `(${i},${j})` };
            return null;
          }} />
        <MatrixGrid values={result.length ? result : Array(rows * cols).fill("·")} rows={cols} cols={rows} label="result"
          highlight={(r, c) => (r === j && c === i ? { value: String(result[r * rows + c] ?? "·"), cls: "bg-emerald-100 border-emerald-500 text-emerald-700" } : null)} />
      </div>
    </Frame>
  );
}
