import { Frame, Arrow, collectIdx } from "./primitives";
import type { VisualizerProps } from "./types";

// Track-three approach — a "podium" of first/second/third that fills and
// shifts as the scan progresses, plus the input array with the read pointer.
export function ThirdMaxTrackVisualizer({ step, nums }: VisualizerProps) {
  const i = collectIdx(step, "i");
  const get = (name: string) => step.vars.find((v) => v.name === name)?.value ?? "-∞";

  const first = get("first");
  const second = get("second");
  const third = get("third");

  const slots = [
    { label: "1st", value: first, cls: "from-amber-400 to-yellow-500" },
    { label: "2nd", value: second, cls: "from-slate-400 to-slate-500" },
    { label: "3rd", value: third, cls: "from-orange-400 to-amber-600" },
  ];

  return (
    <Frame vars={step.vars} step={step}>
      {/* Input array */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {nums.map((v, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-semibold border-2 transition-all duration-200 ${
                idx === i
                  ? "bg-red-100 border-red-500 text-red-700 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              {v}
            </div>
            <div className="h-5">{idx === i ? <Arrow kind="i" /> : <span className="text-[10px] text-gray-400">{idx}</span>}</div>
          </div>
        ))}
      </div>

      {/* Podium */}
      <div className="flex items-end gap-4">
        {slots.map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <div
              className={`flex h-14 w-16 items-center justify-center rounded-lg bg-gradient-to-br ${s.cls} font-mono text-lg font-bold text-white shadow-md`}
            >
              {s.value}
            </div>
            <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{s.label}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}
