import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Brute Force (Check Each Word) — show current word, i, and count.
export function NumMatchingSubseqBruteVisualizer({ step, nums }: VisualizerProps) {
  const wordVar = step.vars.find((v) => v.name === "word");
  const iVar = step.vars.find((v) => v.name === "i");
  const countVar = step.vars.find((v) => v.name === "count");
  const word = wordVar ? wordVar.value : "";
  const i = iVar ? iVar.value : "";
  const count = countVar ? countVar.value : "";

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
          <span className="rounded-md bg-fuchsia-100 px-2 py-0.5 font-mono font-bold text-fuchsia-700">word = {word}</span>
          <span className="rounded-md bg-sky-100 px-2 py-0.5 font-mono font-bold text-sky-700">i = {i}</span>
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-700">count = {count}</span>
        </div>
      </div>
    </Frame>
  );
}
