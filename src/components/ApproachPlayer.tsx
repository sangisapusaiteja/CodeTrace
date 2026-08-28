"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Copy, Check } from "lucide-react";
import type { Trace } from "@/lib/trace";
import { traceBuilders } from "@/lib/traces";
import { getVisualizer } from "@/components/visualizers";

interface ApproachPlayerProps {
  slug: string;
  versionId: string;
  name: string;
  description: string;
  time: string;
  space: string;
  source: string;
  nums: number[];
  params?: (number | number[])[];
  accent: string; // tailwind gradient classes
}

export function ApproachPlayer({
  slug,
  versionId,
  name,
  description,
  time,
  space,
  source,
  nums,
  params = [],
  accent,
}: ApproachPlayerProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [copied, setCopied] = useState(false);

  const builder = traceBuilders[slug]?.[versionId];
  const steps: Trace = useMemo(
    () => (builder ? builder(nums, ...params) : []),
    [builder, nums, params]
  );

  const safeIndex = Math.min(index, Math.max(0, steps.length - 1));
  const cur = steps[safeIndex];
  const Visualizer = getVisualizer(slug, versionId);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      setIndex((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, speed);
    return () => clearTimeout(t);
  }, [playing, index, speed, steps.length]);

  const reset = () => {
    setPlaying(false);
    setIndex(0);
  };
  const togglePlay = () => {
    if (index >= steps.length - 1) setIndex(0);
    setPlaying((p) => !p);
  };

  const lines = source.split("\n");

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface-raised/40">
      {/* Header */}
      <div className={`h-1.5 bg-gradient-to-r ${accent}`} />
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r ${accent} text-white`}>
          Approach
        </span>
        <h3 className="text-lg font-bold text-text">{name}</h3>
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-text-muted" title="Time">⏱ {time}</span>
          <span className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-text-muted" title="Space">📦 {space}</span>
        </div>
      </div>

      {/* Body: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: explanation + code */}
        <div className="border-r border-border p-5">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">How it works</h4>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">{description}</p>

          <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-text-dim">Code</h4>
          <div className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#0d1117]">
            <div className="flex items-center border-b border-white/5 px-3 py-1.5 text-[11px] text-[#7A828E]">
              <span className="text-[#7FD1C0]">{"</>"}</span>
              <span className="ml-1.5">solution.js</span>
              <button
                onClick={copyCode}
                className="ml-auto flex items-center gap-1 rounded-md border border-white/10 px-2 py-0.5 text-[#7A828E] transition-colors hover:border-[#7FD1C0] hover:text-[#7FD1C0]"
                title="Copy code"
              >
                {copied ? <Check className="h-3 w-3 text-[#7FD1A5]" /> : <Copy className="h-3 w-3" />}
                <span className={copied ? "text-[#7FD1A5]" : ""}>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <div className="max-h-72 overflow-auto py-2 font-mono text-[12px] leading-5">
              {lines.map((line, i) => {
                const active = i === cur?.line;
                return (
                  <div key={i} className={`flex items-stretch ${active ? "bg-white/[0.05]" : ""}`}>
                    <span className={`w-10 shrink-0 select-none pr-3 text-right text-[10px] ${active ? "text-[#7FD1A5]" : "text-[#3d444d]"}`}>{i + 1}</span>
                    <span className="flex-1 whitespace-pre pl-1 text-[#C9D1D9]">{line}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: visualization + controls */}
        <div className="flex flex-col bg-[#f8fafc]">
          <div className="flex-1 p-5">
            {Visualizer && cur ? (
              Visualizer({ step: cur, steps, nums, currentIndex: safeIndex, versionId, slug })
            ) : (
              <p className="text-sm text-gray-500">Run the animation to see the visualization.</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-2 border-t border-gray-200 bg-white px-5 py-3">
            <span className="text-xs font-semibold text-gray-500">
              Step {safeIndex} / {Math.max(0, steps.length - 1)}
            </span>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="h-8 rounded-md border border-gray-300 bg-white px-2 text-xs font-semibold text-gray-600 focus:outline-none"
              title="Speed"
            >
              <option value={1500}>0.5x</option>
              <option value={900}>1x</option>
              <option value={450}>2x</option>
            </select>
            <div className="flex items-center gap-1">
              <button onClick={reset} className="rounded-md border border-gray-300 p-2 text-gray-500 hover:text-emerald-600 hover:border-emerald-400 transition-colors" title="Reset">
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={index === 0}
                className="rounded-md border border-gray-300 p-2 text-gray-500 hover:text-emerald-600 hover:border-emerald-400 transition-colors disabled:opacity-30"
                title="Previous step"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                onClick={togglePlay}
                className="rounded-md bg-emerald-500 p-2 text-white shadow-md hover:bg-emerald-400 transition-all hover:scale-105"
                title={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>
              <button
                onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
                disabled={index >= steps.length - 1}
                className="rounded-md border border-gray-300 p-2 text-gray-500 hover:text-emerald-600 hover:border-emerald-400 transition-colors disabled:opacity-30"
                title="Next step"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
