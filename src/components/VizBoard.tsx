"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { List, Grid3X3 } from "lucide-react";
import type { TraceStep } from "@/lib/trace";
import { getVisualizer } from "@/components/visualizers";
import { Frame, Arrow, collectIdx } from "@/components/visualizers/primitives";

interface VizBoardProps {
  step: TraceStep;
  steps: TraceStep[];
  nums: number[];
  currentIndex: number;
  slug: string;
  versionId: string;
}

export function VizBoard({
  step,
  steps,
  nums,
  currentIndex,
  slug,
  versionId,
}: VizBoardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const Visualizer = getVisualizer(slug, versionId);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#f8fafc]">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Visualization</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetails((s) => !s)}
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${
              showDetails
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-gray-300 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-700"
            }`}
          >
            {showDetails ? <Grid3X3 className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
            {showDetails ? "Visual" : "Details"}
          </button>
          <span className="rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 text-xs font-semibold">
            step {currentIndex} / {Math.max(0, steps.length - 1)}
          </span>
        </div>
      </div>

      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          {showDetails ? (
            <motion.div
              key="details"
              className="absolute inset-0 overflow-auto p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <StepTable steps={steps} currentIndex={currentIndex} />
            </motion.div>
          ) : (
            <motion.div
              key="visual"
              className="absolute inset-0 overflow-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {Visualizer ? (
                Visualizer({ step, steps, nums, currentIndex, versionId, slug })
              ) : (
                <GenericVisualizer step={step} nums={nums} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Fallback renderer for problems without a dedicated visualizer.
function GenericVisualizer({ step, nums }: { step: TraceStep; nums: number[] }) {
  const iIdx = collectIdx(step, "i");
  const jIdx = collectIdx(step, "j");

  const effectiveState = (idx: number): string => {
    const fromCells = step.cells[idx] ?? "idle";
    if (fromCells === "found" || fromCells === "active") return fromCells;
    if (idx === iIdx) return "i";
    if (idx === jIdx) return "j";
    return fromCells;
  };

  const subs = nums.map((_, idx) => {
    const s = effectiveState(idx);
    if (s === "i") return <Arrow key={idx} kind="i" label="i" />;
    if (s === "j") return <Arrow key={idx} kind="j" label="j" />;
    if (s === "active") return <Arrow key={idx} kind="active" label="•" />;
    if (s === "found") return <Arrow key={idx} kind="found" label="✓" />;
    return null;
  });

  return (
    <Frame vars={step.vars} step={step}>
      <div className="flex flex-wrap justify-center gap-2">
        {nums.map((v, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono text-lg font-semibold ${
                effectiveState(idx) === "i"
                  ? "bg-red-50 border-red-500 text-red-700"
                  : effectiveState(idx) === "j"
                  ? "bg-orange-50 border-orange-500 text-orange-700"
                  : effectiveState(idx) === "active"
                  ? "bg-amber-50 border-amber-500 text-amber-800"
                  : effectiveState(idx) === "found"
                  ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              {v}
            </div>
            {subs[idx]}
          </div>
        ))}
      </div>
    </Frame>
  );
}

function StepTable({ steps, currentIndex }: { steps: TraceStep[]; currentIndex: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
            <th className="px-3 py-2 font-semibold">#</th>
            <th className="px-3 py-2 font-semibold">Result</th>
            <th className="px-3 py-2 font-semibold">Variables</th>
            <th className="px-3 py-2 font-semibold">Explanation</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((s, i) => (
            <tr
              key={i}
              className={`border-b border-gray-100 last:border-0 ${
                i === currentIndex ? "bg-emerald-50" : "hover:bg-gray-50"
              }`}
            >
              <td className="px-3 py-2 text-center font-mono text-gray-400">{i + 1}</td>
              <td className="px-3 py-2 font-mono">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    s.resultTone === "ok"
                      ? "bg-emerald-50 text-emerald-700"
                      : s.resultTone === "fail"
                      ? "bg-red-50 text-red-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {s.result || "—"}
                </span>
              </td>
              <td className="px-3 py-2">
                <div className="flex flex-wrap gap-1.5">
                  {s.vars.map((v) => (
                    <span key={v.name} className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-700">
                      {v.name} = {v.value}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-3 py-2 text-gray-600">{s.explanation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
