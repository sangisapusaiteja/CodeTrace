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
