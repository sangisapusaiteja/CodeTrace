import { cn } from "@/lib/utils";
import type { TraceStep } from "@/lib/trace";

export const POINTER_COLORS: Record<string, string> = {
  i: "text-red-600",
  j: "text-orange-600",
  w: "text-orange-600",
  active: "text-amber-600",
  found: "text-emerald-600",
};

/** A downward arrow pointing at a cell, with an optional label. */
export function Arrow({
  kind = "i",
  label,
}: {
  kind?: string;
  label?: React.ReactNode;
}) {
  const color = POINTER_COLORS[kind] ?? "text-gray-600";
  return (
    <span className={cn("flex items-center justify-center leading-none", color)}>
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none" aria-hidden className="block">
        <path d="M7 0 L7 12 M7 12 L2 8 M7 12 L12 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label != null && <span className="ml-0.5 font-mono text-[13px] font-bold">{label}</span>}
    </span>
  );
}

export function VarChip({
  name,
  value,
  tone = "info",
}: {
  name: string;
  value: string;
  tone?: "ok" | "fail" | "info";
}) {
  const color =
    tone === "ok"
      ? "text-emerald-600"
      : tone === "fail"
      ? "text-red-600"
      : "text-gray-700";
  const border =
    tone === "ok"
      ? "border-emerald-300 bg-emerald-50/50"
      : tone === "fail"
      ? "border-red-300 bg-red-50/50"
      : "border-gray-200 bg-white";
  return (
    <div className={cn("flex items-center gap-2 rounded-md border px-3 py-1.5 shadow-sm", border)}>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{name}</span>
      <span className={cn("font-mono text-sm font-semibold", color)}>{value}</span>
    </div>
  );
}

export function ResultBadge({
  result,
  tone,
}: {
  result: string;
  tone: "ok" | "fail" | "info";
}) {
  const styles =
    tone === "ok"
      ? "bg-emerald-500/10 text-emerald-600 border-emerald-400/40"
      : tone === "fail"
      ? "bg-red-500/10 text-red-500 border-red-400/40"
      : "bg-white text-gray-600 border-gray-300";
  return (
    <span className={cn("rounded-full border px-4 py-1.5 font-mono text-sm font-semibold shadow-sm", styles)}>
      {result || "running…"}
    </span>
  );
}

/** Shared vertical layout: children → variables → result → explanation. */
export function Frame({
  children,
  vars,
  step,
}: {
  children: React.ReactNode;
  vars: TraceStep["vars"];
  step: TraceStep;
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 p-6">
      {children}
      {vars.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {vars.map((v) => (
            <VarChip key={v.name} name={v.name} value={v.value} tone={v.tone} />
          ))}
        </div>
      )}
      <ResultBadge result={step.result} tone={step.resultTone} />
      <p className="max-w-md text-center text-xs leading-relaxed text-gray-500">{step.explanation}</p>
    </div>
  );
}

export function collectIdx(step: TraceStep, name: string): number | null {
  const v = step.vars.find((x) => x.name === name);
  if (!v) return null;
  const m = v.value.match(/-?\d+/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isNaN(n) ? null : n;
}

/** A node renderer config for LinkedList. */
export type ListNodeCell = {
  cls: string;
  label?: string;
};

/**
 * Renders a linked list as a row of node boxes with arrows.
 * highlight(idx) returns a ListNodeCell (or null for default styling).
 */
export function LinkedList({
  values,
  highlight,
  label,
  nullLabel = "null",
}: {
  values: (string | number)[];
  highlight?: (idx: number) => ListNodeCell | null;
  label?: string;
  nullLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>}
      <div className="flex flex-wrap items-center justify-center gap-1">
        {values.map((v, idx) => {
          const h = highlight ? highlight(idx) : null;
          return (
            <div key={idx} className="flex items-center gap-1">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 min-w-10 items-center justify-center rounded-lg border-2 px-2 font-mono text-sm font-semibold transition-all duration-200 ${
                    h ? h.cls : "border-gray-300 bg-white text-gray-800"
                  }`}
                >
                  {v}
                </div>
                {h?.label && <div className="mt-0.5 h-4 text-[10px] text-gray-500">{h.label}</div>}
              </div>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden className="text-gray-400">
                <path d="M0 6 H12 M12 6 L8 2 M12 6 L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          );
        })}
        <div className="flex h-10 items-center rounded-lg border-2 border-dashed border-gray-300 px-2 font-mono text-xs text-gray-400">
          {nullLabel}
        </div>
      </div>
    </div>
  );
}

/** A cell renderer config for MatrixGrid. */
export type MatrixCell = {
  value: string;
  /** tailwind classes for the cell box */
  cls: string;
  label?: string;
};

/**
 * Renders a 2D matrix from a flattened row-major value array.
 * highlight(r, c) returns a MatrixCell (or null for default styling).
 */
export function MatrixGrid({
  values,
  rows,
  cols,
  highlight,
  cellCls = "h-9 w-9",
  label,
}: {
  values: (string | number)[];
  rows: number;
  cols: number;
  highlight?: (r: number, c: number) => MatrixCell | null;
  cellCls?: string;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>}
      <div className="flex flex-col gap-1">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-1">
            {Array.from({ length: cols }).map((_, c) => {
              const val = values[r * cols + c];
              const h = highlight ? highlight(r, c) : null;
              return (
                <div key={c} className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center rounded-md border-2 font-mono text-sm font-semibold transition-all duration-200 ${cellCls} ${
                      h ? h.cls : "border-gray-300 bg-white text-gray-800"
                    }`}
                  >
                    {val}
                  </div>
                  {h?.label && <div className="mt-0.5 h-4 text-[10px] text-gray-500">{h.label}</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
