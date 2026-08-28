import type { TraceStep } from "@/lib/trace";

export type VisualizerProps = {
  step: TraceStep;
  steps: TraceStep[];
  nums: number[];
  currentIndex: number;
  versionId: string;
  slug: string;
};

export type VisualizerComponent = (props: VisualizerProps) => React.ReactNode;
