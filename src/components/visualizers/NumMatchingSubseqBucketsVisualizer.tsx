import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Character Buckets — show the bucket sizes and count.
export function NumMatchingSubseqBucketsVisualizer({ step, nums }: VisualizerProps) {
  const cVar = step.vars.find((v) => v.name === "c");
  const countVar = step.vars.find((v) => v.name === "count");
  const bucketsVar = step.vars.find((v) => v.name === "buckets");
  const c = cVar ? cVar.value : "";
  const count = countVar ? countVar.value : "";
  const buckets = bucketsVar ? bucketsVar.value : "";

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {nums.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white border-2 border-gray-300 font-mono text-lg font-semibold text-gray-800">
                {String.fromCharCode(v)}
              </div>
              <div className="mt-1 text-[10px] text-gray-400">{idx}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-md bg-sky-100 px-2 py-0.5 font-mono font-bold text-sky-700">c = {c}</span>
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">count = {count}</span>
        </div>
        {buckets && (
          <div className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 font-mono text-xs text-fuchsia-700 max-w-md text-center">
            {buckets}
          </div>
        )}
      </div>
    </Frame>
  );
}
