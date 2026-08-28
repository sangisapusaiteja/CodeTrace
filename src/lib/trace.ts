export type CellState = "idle" | "i" | "j" | "active" | "found";

/** A named variable shown in the readout panel (e.g. count, maxCount, i, j). */
export interface VarVal {
  name: string;
  value: string;
  tone?: "ok" | "fail" | "info";
}

/** One snapshot of an algorithm's execution. */
export interface TraceStep {
  /** 0-indexed source line to highlight */
  line: number;
  /** the array being scanned */
  cells: CellState[];
  /** per-cell values shown this step; falls back to the raw input array */
  values?: number[];
  /** named variables to display */
  vars: VarVal[];
  /** short result text shown as a badge */
  result: string;
  resultTone: "ok" | "fail" | "info";
  /** human explanation of this step */
  explanation: string;
  /** whether the algorithm finished */
  done: boolean;
}

/** A trace is just the ordered list of steps for one source/version. */
export type Trace = TraceStep[];
