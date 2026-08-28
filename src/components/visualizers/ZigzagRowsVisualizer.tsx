import { Frame } from "./primitives";
import type { VisualizerProps } from "./types";

// Row-by-Row Collection — show the string and the row strings.
export function ZigzagRowsVisualizer({ step, nums }: VisualizerProps) {
  const rowsVar = step.vars.find((v) => v.name === "rows");
  const rows = rowsVar
    ? rowsVar.value.replace(/^\[|\]$/g, "").split(", ").map((s) => s.replace(/"/g, "")).filter((s) => s !== "")
    : [];

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
        {rows.length > 0 && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-600">rows</span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {rows.map((r, idx) => (
                <div key={idx} className="flex h-9 items-center justify-center rounded-md bg-sky-50 border border-sky-300 px-2 font-mono text-sm font-semibold text-sky-700">
                  {r}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Frame>
  );
}
