import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Prefix & Suffix Products — shows three rows: the original array, prefix
// products being built left-to-right, suffix products right-to-left, and
// the result row.
export function ProductPrefixSuffixVisualizer({ step, nums }: VisualizerProps) {
  const prefixVar = step.vars.find((v) => v.name === "prefix");
  const suffixVar = step.vars.find((v) => v.name === "suffix");
  const resultVar = step.vars.find((v) => v.name === "result");

  const prefix = prefixVar
    ? prefixVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : nums.map(() => "1");
  const suffix = suffixVar
    ? suffixVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : nums.map(() => "1");
  const result = resultVar
    ? resultVar.value.replace(/[\[\]]/g, "").split(",").map((s) => s.trim()).filter(Boolean)
    : nums.map(() => "0");

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-1.5">
        {/* Original */}
        <div className="flex items-center gap-2">
          <span className="w-12 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400">nums</span>
          <div className="flex gap-1">
            {nums.map((v, idx) => (
              <div key={idx} className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white font-mono text-xs font-semibold text-gray-800">
                {v}
              </div>
            ))}
          </div>
        </div>
        {/* Prefix */}
        <div className="flex items-center gap-2">
          <span className="w-12 text-right text-[10px] font-semibold uppercase tracking-wider text-amber-500">prefix</span>
          <div className="flex gap-1">
            {prefix.map((v, idx) => (
              <div key={idx} className="flex h-8 w-8 items-center justify-center rounded-md border border-amber-300 bg-amber-50 font-mono text-xs font-semibold text-amber-700">
                {v}
              </div>
            ))}
          </div>
        </div>
        {/* Suffix */}
        <div className="flex items-center gap-2">
          <span className="w-12 text-right text-[10px] font-semibold uppercase tracking-wider text-sky-500">suffix</span>
          <div className="flex gap-1">
            {suffix.map((v, idx) => (
              <div key={idx} className="flex h-8 w-8 items-center justify-center rounded-md border border-sky-300 bg-sky-50 font-mono text-xs font-semibold text-sky-700">
                {v}
              </div>
            ))}
          </div>
        </div>
        {/* Result */}
        <div className="flex items-center gap-2">
          <span className="w-12 text-right text-[10px] font-semibold uppercase tracking-wider text-emerald-500">result</span>
          <div className="flex gap-1">
            {result.map((v, idx) => (
              <div key={idx} className={`flex h-8 w-8 items-center justify-center rounded-md border font-mono text-xs font-bold ${
                v !== "0" ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-400"
              }`}>
                {v}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}
