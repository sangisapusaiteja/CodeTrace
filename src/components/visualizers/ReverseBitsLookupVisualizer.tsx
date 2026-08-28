import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Byte-Level Lookup Table — show the 4 bytes.
export function ReverseBitsLookupVisualizer({ step }: VisualizerProps) {
  const b0Var = step.vars.find((v) => v.name === "byte0");
  const b1Var = step.vars.find((v) => v.name === "byte1");
  const b2Var = step.vars.find((v) => v.name === "byte2");
  const b3Var = step.vars.find((v) => v.name === "byte3");
  const bytes = [b0Var?.value, b1Var?.value, b2Var?.value, b3Var?.value].filter(Boolean);

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {bytes.map((b, idx) => {
            const bits = b ?? "";
            return (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-[10px] font-semibold uppercase text-gray-400">byte{idx}</span>
                <div className="mt-1 flex gap-0.5">
                  {bits.split("").map((bit, bi) => (
                    <div
                      key={bi}
                      className={`flex h-8 w-4 items-center justify-center rounded border font-mono text-xs font-bold ${
                        bit === "1" ? "bg-violet-100 border-violet-300 text-violet-700" : "bg-gray-50 border-gray-200 text-gray-300"
                      }`}
                    >
                      {bit}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="rounded-md border border-gray-200 bg-white px-3 py-1 font-mono text-xs text-gray-600">
          reverse each byte and reassemble
        </div>
      </div>
    </Frame>
  );
}
