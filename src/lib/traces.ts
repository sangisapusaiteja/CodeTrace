import type { Trace, TraceStep, CellState } from "@/lib/trace";

function cellsFor(
  nums: number[],
  predicate: (idx: number) => CellState | null
): CellState[] {
  return nums.map((_, idx) => predicate(idx) ?? "idle");
}

// ── Max Consecutive Ones ────────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Brute Force (Check All Subarrays)
// For every starting index, count how many 1s follow in a row.
// Source (lines):
// 0: var findMaxConsecutiveOnes = function(nums) {
// 1:     let maxCount = 0;
// 2:
// 3:     for (let i = 0; i < nums.length; i++) {
// 4:         if (nums[i] === 0) continue;
// 5:         let count = 0;
// 6:         while (i + count < nums.length && nums[i + count] === 1) {
// 7:             count++;
// 8:         }
// 9:         maxCount = Math.max(maxCount, count);
// 10:    }
// 11:
// 12:    return maxCount;
// 13: };
export function mcoBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let maxCount = 0;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    count: number,
    result: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i"; // outer loop start
        if (idx === j) return "j"; // inner scanning pointer
        if (idx >= i && idx <= j && nums[idx] === 1) return "active";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "count", value: String(count), tone: "info" },
        { name: "maxCount", value: String(maxCount), tone: "info" },
      ],
      result,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, -1, 0, "maxCount = 0", "info", "Initialize maxCount = 0.");

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) {
      pushStep(4, i, i, 0, "skip 0", "fail", `nums[${i}] = 0 → no run starts here, skip.`);
      continue;
    }
    let count = 0;
    pushStep(5, i, i, 0, "count = 0", "info", `nums[${i}] = 1 → start counting a run from index ${i}.`);
    while (i + count < nums.length && nums[i + count] === 1) {
      count++;
      pushStep(7, i, i + count - 1, count, `count → ${count}`, "ok", `nums[${i + count - 1}] = 1 → run grows to ${count}.`);
    }
    if (count > maxCount) maxCount = count;
    pushStep(9, i, i + count - 1, count, `maxCount = ${maxCount}`, "ok", `Run of ${count} from start ${i} → maxCount = ${maxCount}.`);
  }

  done = true;
  steps.push({
    line: 12,
    cells: nums.map(() => "idle"),
    vars: [{ name: "maxCount", value: String(maxCount), tone: "ok" }],
    result: `return ${maxCount}`,
    resultTone: "ok",
    explanation: `The longest run of consecutive 1s is ${maxCount}.`,
    done,
  });

  return steps;
}

// Approach 2: Single Pass (Running Counter)
// One left-to-right scan keeping a running count.
// Source (lines):
// 0: var findMaxConsecutiveOnes = function(nums) {
// 1:     let maxCount = 0;
// 2:     let count = 0;
// 3:
// 4:     for (const num of nums) {
// 5:         if (num === 1) {
// 6:             count++;
// 7:         } else {
// 8:             count = 0;
// 9:         }
// 10:        maxCount = Math.max(maxCount, count);
// 11:    }
// 12:
// 13:    return maxCount;
// 14: };
export function mcoSinglePassTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let maxCount = 0;
  let count = 0;

  const pushStep = (
    line: number,
    i: number,
    result: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : idx < i ? "active" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "num", value: i >= 0 ? String(nums[i]) : "—", tone: nums[i] === 1 ? "ok" : "fail" },
        { name: "count", value: String(count), tone: nums[i] === 1 ? "ok" : "fail" },
        { name: "maxCount", value: String(maxCount), tone: "info" },
      ],
      result,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, "maxCount = 0", "info", "Initialize maxCount = 0.");
  pushStep(2, -1, "count = 0", "info", "Initialize count = 0.");

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    if (num === 1) {
      count++;
      pushStep(6, i, `count → ${count}`, "ok", `num = ${num} is 1 → count becomes ${count}.`);
    } else {
      count = 0;
      pushStep(8, i, `count → 0`, "fail", `num = ${num} is 0 → streak breaks, count resets to 0.`);
    }
    const before = maxCount;
    maxCount = Math.max(maxCount, count);
    pushStep(10, i, `maxCount = ${maxCount}`, maxCount > before ? "ok" : "info", `maxCount = max(${before}, ${count}) = ${maxCount}.`);
  }

  done = true;
  steps.push({
    line: 13,
    cells: nums.map(() => "idle"),
    vars: [
      { name: "count", value: String(count), tone: "info" },
      { name: "maxCount", value: String(maxCount), tone: "ok" },
    ],
    result: `return ${maxCount}`,
    resultTone: "ok",
    explanation: `The longest run of consecutive 1s is ${maxCount}.`,
    done,
  });

  return steps;
}

// ── Third Maximum Number ────────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Sorting — sort, then walk backward counting distinct values.
// Source (lines):
// 0: var thirdMax = function(nums) {
// 1:     nums.sort((a, b) => a - b);
// 2:     let count = 1;
// 3:     // Walk backward from the largest element
// 4:     for (let i = nums.length - 2; i >= 0; i--) {
// 5:         if (nums[i] === nums[i + 1]) {
// 6:             continue;
// 7:         }
// 8:         count++;
// 9:         if (count === 3) {
// 10:            return nums[i];
// 11:        }
// 12:    }
// 13:    // Fewer than 3 distinct values, return the maximum
// 14:    return nums[nums.length - 1];
// 15: };
export function thirdMaxSortTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const sorted = [...nums].sort((a, b) => a - b);
  let count = 1;
  let answer: number | null = null;

  const pushStep = (
    line: number,
    i: number,
    result: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sorted, (idx) => (idx === i ? "i" : idx > i ? "active" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "count", value: String(count), tone: "info" },
        { name: "sorted", value: `[${sorted.join(", ")}]`, tone: "info" },
      ],
      result,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, "sorted", "info", `Sort nums ascending → [${sorted.join(", ")}].`);
  pushStep(2, -1, "count = 1", "info", "count = 1 (the largest element is one distinct value).");

  for (let i = sorted.length - 2; i >= 0; i--) {
    if (sorted[i] === sorted[i + 1]) {
      pushStep(6, i, "duplicate", "fail", `nums[${i}] = ${sorted[i]} equals nums[${i + 1}] → skip (continue).`);
      continue;
    }
    count++;
    if (count === 3) {
      pushStep(8, i, `count → ${count}`, "ok", `count becomes ${count}.`);
      answer = sorted[i];
      pushStep(10, i, `return ${sorted[i]}`, "ok", `count === 3 → return nums[${i}] = ${sorted[i]}.`);
      done = true;
      break;
    } else {
      pushStep(8, i, `count → ${count}`, "info", `count becomes ${count}.`);
    }
  }

  if (!done) {
    answer = sorted[sorted.length - 1];
    pushStep(14, -1, `return ${sorted[sorted.length - 1]}`, "ok", `Fewer than 3 distinct values → return the max ${sorted[sorted.length - 1]}.`);
  }

  done = true;
  steps.push({
    line: 14,
    cells: sorted.map(() => "idle"),
    vars: [{ name: "answer", value: String(answer), tone: "ok" }],
    result: `answer = ${answer}`,
    resultTone: "ok",
    explanation: `Third distinct maximum is ${answer}.`,
    done,
  });

  return steps;
}

// Approach 2: Track Three Maximums (Optimal) — single pass, three variables.
// Source (lines):
// 0: var thirdMax = function(nums) {
// 1:     // Use -Infinity as sentinel (outside 32-bit integer range)
// 2:     let first = -Infinity;
// 3:     let second = -Infinity;
// 4:     let third = -Infinity;
// 5:
// 6:     for (const num of nums) {
// 7:         // Skip duplicates
// 8:         if (num === first || num === second || num === third) {
// 9:             continue;
// 10:        }
// 11:        if (num > first) {
// 12:            // New largest: shift everything down
// 13:            third = second;
// 14:            second = first;
// 15:            first = num;
// 16:        } else if (num > second) {
// 17:            // New second largest: shift third down
// 18:            third = second;
// 19:            second = num;
// 20:        } else if (num > third) {
// 21:            // New third largest
// 22:            third = num;
// 23:        }
// 24:    }
// 25:
// 26:    // If third was never assigned, return the maximum
// 27:    return third === -Infinity ? first : third;
// 28: };
export function thirdMaxTrackTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let first = -Infinity;
  let second = -Infinity;
  let third = -Infinity;

  const fmt = (v: number) => (v === -Infinity ? "-∞" : String(v));

  const pushStep = (
    line: number,
    i: number,
    result: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : idx < i ? "active" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "num", value: i >= 0 ? String(nums[i]) : "—", tone: "info" },
        { name: "first", value: fmt(first), tone: "info" },
        { name: "second", value: fmt(second), tone: "info" },
        { name: "third", value: fmt(third), tone: "info" },
      ],
      result,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, -1, "first = -∞", "info", "Initialize first = -Infinity.");
  pushStep(3, -1, "second = -∞", "info", "Initialize second = -Infinity.");
  pushStep(4, -1, "third = -∞", "info", "Initialize third = -Infinity.");

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    if (num === first || num === second || num === third) {
      pushStep(9, i, "duplicate", "fail", `num = ${num} already tracked → skip (continue).`);
      continue;
    }
    if (num > first) {
      pushStep(11, i, `${num} > first`, "ok", `${num} > first → shift everything down.`);
      third = second;
      second = first;
      first = num;
      pushStep(15, i, `first = ${num}`, "ok", `first = ${num}, second = ${fmt(second)}, third = ${fmt(third)}.`);
    } else if (num > second) {
      pushStep(16, i, `${num} > second`, "ok", `${num} > second → shift third down.`);
      third = second;
      second = num;
      pushStep(19, i, `second = ${num}`, "ok", `second = ${num}, third = ${fmt(third)}.`);
    } else if (num > third) {
      pushStep(20, i, `${num} > third`, "ok", `${num} > third → set third.`);
      third = num;
      pushStep(22, i, `third = ${num}`, "ok", `third = ${num}.`);
    } else {
      pushStep(20, i, "ignore", "fail", `${num} ≤ third → ignore.`);
    }
  }

  const answer = third === -Infinity ? first : third;
  done = true;
  steps.push({
    line: 27,
    cells: nums.map(() => "idle"),
    vars: [
      { name: "first", value: fmt(first), tone: "info" },
      { name: "second", value: fmt(second), tone: "info" },
      { name: "third", value: fmt(third), tone: "info" },
      { name: "answer", value: String(answer), tone: "ok" },
    ],
    result: `return ${answer}`,
    resultTone: "ok",
    explanation: third === -Infinity ? `Third was never assigned → return the maximum ${first}.` : `Return third = ${third}.`,
    done,
  });

  return steps;
}

// ── Move Zeroes ─────────────────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Extra Array — collect non-zeroes into a result, copy back.
// Source (lines):
// 0: var moveZeroes = function(nums) {
// 1:     var n = nums.length;
// 2:     var result = new Array(n).fill(0);
// 3:     var insertPos = 0;
// 4:
// 5:     // Collect non-zero elements
// 6:     for (var i = 0; i < n; i++) {
// 7:         if (nums[i] !== 0) {
// 8:             result[insertPos] = nums[i];
// 9:             insertPos++;
// 10:        }
// 11:    }
// 12:
// 13:    // Copy result back into nums
// 14:    for (var i = 0; i < n; i++) {
// 15:        nums[i] = result[i];
// 16:    }
// 17: };
export function moveZeroesExtraArrayTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;
  const working = [...nums];
  const result = new Array(n).fill(0);
  let insertPos = 0;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => (idx === i ? "i" : idx < i ? "active" : "idle")),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "insertPos", value: String(insertPos), tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, "n = " + n, "info", `n = nums.length = ${n}.`);
  pushStep(2, -1, "result = zeros", "info", `result = new Array(${n}).fill(0).`);
  pushStep(3, -1, "insertPos = 0", "info", "insertPos = 0 — where the next non-zero goes.");

  for (let i = 0; i < n; i++) {
    if (working[i] !== 0) {
      result[insertPos] = working[i];
      pushStep(8, i, `result[${insertPos}] = ${working[i]}`, "ok", `nums[${i}] = ${working[i]} is non-zero → result[${insertPos}] = ${working[i]}.`);
      insertPos++;
      pushStep(9, i, `insertPos → ${insertPos}`, "ok", `insertPos++ → ${insertPos}.`);
    } else {
      pushStep(7, i, "skip 0", "fail", `nums[${i}] = 0 → skip it.`);
    }
  }

  for (let i = 0; i < n; i++) {
    working[i] = result[i];
    pushStep(15, i, `nums[${i}] = ${result[i]}`, "info", `Copy result[${i}] = ${result[i]} back into nums[${i}].`);
  }

  done = true;
  steps.push({
    line: 17,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "nums", value: `[${working.join(", ")}]`, tone: "ok" }],
    result: `done → [${working.join(", ")}]`,
    resultTone: "ok",
    explanation: `Final nums = [${working.join(", ")}].`,
    done,
  });

  return steps;
}

// Approach 2: Two Pointers (Swap) — swap non-zeroes to the front in place.
// Source (lines):
// 0: var moveZeroes = function(nums) {
// 1:     var insertPos = 0;
// 2:     for (var i = 0; i < nums.length; i++) {
// 3:         if (nums[i] !== 0) {
// 4:             // Swap non-zero element into the correct position
// 5:             var temp = nums[insertPos];
// 6:             nums[insertPos] = nums[i];
// 7:             nums[i] = temp;
// 8:             insertPos++;
// 9:         }
// 10:    }
// 11: };
export function moveZeroesSwapTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums];
  let insertPos = 0;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => {
        if (idx === i) return "i";
        if (idx === insertPos) return "j";
        return "idle";
      }),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "insertPos", value: String(insertPos), tone: "info" },
        { name: "nums", value: `[${working.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, "insertPos = 0", "info", "insertPos = 0 — where the next non-zero belongs.");

  for (let i = 0; i < working.length; i++) {
    if (working[i] !== 0) {
      const temp = working[insertPos];
      working[insertPos] = working[i];
      working[i] = temp;
      pushStep(6, i, `swap → [${working.join(", ")}]`, "ok", `nums[${i}] = ${working[i]} is non-zero → swap with nums[${insertPos}].`);
      insertPos++;
      pushStep(8, i, `insertPos → ${insertPos}`, "ok", `insertPos++ → ${insertPos}.`);
    } else {
      pushStep(3, i, "skip 0", "fail", `nums[${i}] = 0 → skip it.`);
    }
  }

  done = true;
  steps.push({
    line: 11,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "nums", value: `[${working.join(", ")}]`, tone: "ok" }],
    result: `done → [${working.join(", ")}]`,
    resultTone: "ok",
    explanation: `Final nums = [${working.join(", ")}].`,
    done,
  });

  return steps;
}

// ── Shuffle the Array ───────────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: New Array (Interleave) — build a fresh result array.
// Source (lines):
// 0: var shuffle = function(nums, n) {
// 1:     var result = new Array(2 * n);
// 2:
// 3:     for (var i = 0; i < n; i++) {
// 4:         // Place element from first half
// 5:         result[2 * i] = nums[i];
// 6:         // Place element from second half
// 7:         result[2 * i + 1] = nums[n + i];
// 8:     }
// 9:
// 10:    return result;
// 11: };
export function shuffleInterleaveTrace(nums: number[], n: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result = new Array(2 * n).fill("·");

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i || idx === n + i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, "result = []", "info", `result = new Array(${2 * n}) — the shuffled output.`);

  for (let i = 0; i < n; i++) {
    result[2 * i] = nums[i];
    pushStep(5, i, `result[${2 * i}] = ${nums[i]}`, "ok", `Place nums[${i}] = ${nums[i]} (first half) at result[${2 * i}].`);
    result[2 * i + 1] = nums[n + i];
    pushStep(7, i, `result[${2 * i + 1}] = ${nums[n + i]}`, "ok", `Place nums[${n + i}] = ${nums[n + i]} (second half) at result[${2 * i + 1}].`);
  }

  done = true;
  steps.push({
    line: 10,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }],
    result: `return [${result.join(", ")}]`,
    resultTone: "ok",
    explanation: `Shuffled result = [${result.join(", ")}].`,
    done,
  });

  return steps;
}

// Approach 2: In-Place by Encoding Two Values — O(1) space.
// Source (lines):
// 0: var shuffle = function(nums, n) {
// 1:     var maxVal = 1001;
// 2:
// 3:     // Encode: add shuffled value as the high part (base maxVal)
// 4:     for (var i = n - 1; i >= 0; i--) {
// 5:         // nums[n + i] goes to position 2*i+1
// 6:         nums[2 * i + 1] += (nums[n + i] % maxVal) * maxVal;
// 7:         // nums[i] goes to position 2*i
// 8:         nums[2 * i] += (nums[i] % maxVal) * maxVal;
// 9:     }
// 10:
// 11:    // Decode: keep only the high part (the shuffled value)
// 12:    for (var i = 0; i < 2 * n; i++) {
// 13:        nums[i] = Math.floor(nums[i] / maxVal);
// 14:    }
// 15:
// 16:    return nums;
// 17: };
export function shuffleInPlaceTrace(nums: number[], n: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums];
  const maxVal = 1001;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => (idx === i ? "i" : "idle")),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "nums", value: `[${working.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, "maxVal = 1001", "info", "maxVal = 1001 — a base larger than any value.");

  for (let i = n - 1; i >= 0; i--) {
    working[2 * i + 1] += (working[n + i] % maxVal) * maxVal;
    pushStep(6, i, `encode 2i+1`, "info", `Encode nums[${2 * i + 1}] += (nums[${n + i}] % ${maxVal}) * ${maxVal}.`);
    working[2 * i] += (working[i] % maxVal) * maxVal;
    pushStep(8, i, `encode 2i`, "info", `Encode nums[${2 * i}] += (nums[${i}] % ${maxVal}) * ${maxVal}.`);
  }

  for (let i = 0; i < 2 * n; i++) {
    working[i] = Math.floor(working[i] / maxVal);
    pushStep(13, i, `decode → ${working[i]}`, "ok", `Decode nums[${i}] = floor(nums[${i}] / ${maxVal}) = ${working[i]}.`);
  }

  done = true;
  steps.push({
    line: 16,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "nums", value: `[${working.join(", ")}]`, tone: "ok" }],
    result: `return [${working.join(", ")}]`,
    resultTone: "ok",
    explanation: `Shuffled nums = [${working.join(", ")}].`,
    done,
  });

  return steps;
}

// ── Majority Element ─────────────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Hash Map — count each element, return when count > n/2.
// Source (lines):
// 0: var majorityElement = function(nums) {
// 1:     var counts = new Map();
// 2:     var threshold = Math.floor(nums.length / 2);
// 3:
// 4:     for (var i = 0; i < nums.length; i++) {
// 5:         var count = (counts.get(nums[i]) || 0) + 1;
// 6:         counts.set(nums[i], count);
// 7:
// 8:         // Return as soon as we find the majority element
// 9:         if (count > threshold) {
// 10:            return nums[i];
// 11:        }
// 12:    }
// 13:
// 14:    return -1; // Won't reach here given problem guarantee
// 15: };
export function majorityHashMapTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const counts = new Map<number, number>();
  const threshold = Math.floor(nums.length / 2);

  const pushStep = (
    line: number,
    i: number,
    result: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : idx < i ? "active" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "threshold", value: String(threshold), tone: "info" },
        { name: "counts", value: `{${Array.from(counts.entries()).map(([k, v]) => `${k}:${v}`).join(", ")}}`, tone: "info" },
      ],
      result,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, "counts = {}", "info", "counts = new Map() — count each element.");
  pushStep(2, -1, `threshold = ${threshold}`, "info", `threshold = floor(n/2) = ${threshold}.`);

  for (let i = 0; i < nums.length; i++) {
    const count = (counts.get(nums[i]) || 0) + 1;
    counts.set(nums[i], count);
    pushStep(6, i, `count[${nums[i]}] = ${count}`, "info", `nums[${i}] = ${nums[i]}: count becomes ${count}.`);
    if (count > threshold) {
      pushStep(9, i, `return ${nums[i]}`, "ok", `${count} > ${threshold} → ${nums[i]} is the majority element.`);
      done = true;
      break;
    } else {
      pushStep(9, i, "not yet", "fail", `${count} is not > ${threshold}, keep scanning.`);
    }
  }

  if (!done) {
    pushStep(14, -1, "return -1", "fail", "No majority found (won't happen per guarantee).");
  }

  done = true;
  steps.push({
    line: 14,
    cells: nums.map(() => "idle"),
    vars: [{ name: "counts", value: `{${Array.from(counts.entries()).map(([k, v]) => `${k}:${v}`).join(", ")}}`, tone: "info" }],
    result: `majority = ${Array.from(counts.entries()).find(([, v]) => v > threshold)?.[0] ?? -1}`,
    resultTone: "ok",
    explanation: `The majority element is ${Array.from(counts.entries()).find(([, v]) => v > threshold)?.[0] ?? -1}.`,
    done,
  });

  return steps;
}

// Approach 2: Sorting — the majority element sits at index n/2 after sorting.
// Source (lines):
// 0: var majorityElement = function(nums) {
// 1:     nums.sort(function(a, b) { return a - b; });
// 2:     // The majority element always occupies the middle position
// 3:     return nums[Math.floor(nums.length / 2)];
// 4: };
export function majoritySortTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  steps.push({
    line: 1,
    cells: sorted.map(() => "idle"),
    vars: [{ name: "sorted", value: `[${sorted.join(", ")}]`, tone: "info" }],
    result: "sorted",
    resultTone: "info",
    explanation: `Sort nums ascending → [${sorted.join(", ")}].`,
    done,
  });

  steps.push({
    line: 3,
    cells: cellsFor(sorted, (idx) => (idx === mid ? "found" : "idle")),
    vars: [
      { name: "mid", value: String(mid), tone: "info" },
      { name: "sorted[mid]", value: String(sorted[mid]), tone: "ok" },
    ],
    result: `return ${sorted[mid]}`,
    resultTone: "ok",
    explanation: `The majority element occupies the middle → nums[${mid}] = ${sorted[mid]}.`,
    done,
  });

  done = true;
  steps.push({
    line: 3,
    cells: sorted.map(() => "idle"),
    vars: [{ name: "majority", value: String(sorted[mid]), tone: "ok" }],
    result: `majority = ${sorted[mid]}`,
    resultTone: "ok",
    explanation: `The majority element is ${sorted[mid]}.`,
    done,
  });

  return steps;
}

// ── Remove Duplicates from Sorted Array ─────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Using a Hash Set — collect distinct, sort, write back.
// Source (lines):
// 0: var removeDuplicates = function(nums) {
// 1:     var seen = new Set();
// 2:     for (const num of nums) {
// 3:         seen.add(num);
// 4:     }
// 5:
// 6:     var unique = Array.from(seen);
// 7:     unique.sort(function(a, b) { return a - b; });
// 8:
// 9:     for (var i = 0; i < unique.length; i++) {
// 10:        nums[i] = unique[i];
// 11:    }
// 12:
// 13:    return unique.length;
// 14: };
export function removeDuplicatesHashSetTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums];
  const seen = new Set<number>();

  const pushStep = (
    line: number,
    i: number,
    result: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => (idx === i ? "i" : idx < i ? "active" : "idle")),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "seen", value: `{${Array.from(seen).join(", ")}}`, tone: "info" },
      ],
      result,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < working.length; i++) {
    const isNew = !seen.has(working[i]);
    seen.add(working[i]);
    pushStep(3, i, isNew ? `add ${working[i]}` : `${working[i]} dup`, isNew ? "ok" : "fail", `${working[i]} ${isNew ? "is new → add to set." : "already in set → ignored."}`);
  }

  const unique = Array.from(seen).sort((a, b) => a - b);
  steps.push({
    line: 7,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "unique", value: `[${unique.join(", ")}]`, tone: "info" }],
    result: `unique → [${unique.join(", ")}]`,
    resultTone: "info",
    explanation: `unique = Array.from(seen) sorted → [${unique.join(", ")}].`,
    done,
  });

  for (let i = 0; i < unique.length; i++) {
    working[i] = unique[i];
    steps.push({
      line: 10,
      cells: cellsFor(working, (idx) => (idx === i ? "active" : idx < unique.length ? "found" : "idle")),
      values: [...working],
      vars: [{ name: "i", value: String(i), tone: "info" }],
      result: `nums[${i}] = ${unique[i]}`,
      resultTone: "info",
      explanation: `Write unique[${i}] = ${unique[i]} back into nums[${i}].`,
      done,
    });
  }

  done = true;
  steps.push({
    line: 13,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "k", value: String(unique.length), tone: "ok" }],
    result: `return ${unique.length}`,
    resultTone: "ok",
    explanation: `The first k = ${unique.length} elements are the unique values.`,
    done,
  });

  return steps;
}

// Approach 2: Two Pointers (Optimal) — write pointer compacts uniques.
// Source (lines):
// 0: var removeDuplicates = function(nums) {
// 1:     if (nums.length === 0) return 0;
// 2:
// 3:     var insertPos = 1;
// 4:
// 5:     for (var i = 1; i < nums.length; i++) {
// 6:         // Found a new unique value, place it at insertPos
// 7:         if (nums[i] !== nums[insertPos - 1]) {
// 8:             nums[insertPos] = nums[i];
// 9:             insertPos++;
// 10:        }
// 11:    }
// 12:
// 13:    return insertPos;
// 14: };
export function removeDuplicatesTwoPointerTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums];
  let insertPos = 1;

  const pushStep = (
    line: number,
    i: number,
    result: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => {
        if (idx === i) return "i";
        if (idx === insertPos) return "j";
        return "idle";
      }),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "insertPos", value: String(insertPos), tone: "info" },
        { name: "nums", value: `[${working.join(", ")}]`, tone: "info" },
      ],
      result,
      resultTone,
      explanation,
      done,
    });
  };

  if (working.length === 0) {
    done = true;
    steps.push({ line: 1, cells: [], values: [], vars: [], result: "return 0", resultTone: "ok", explanation: "Empty array → nothing to keep.", done });
    return steps;
  }

  pushStep(3, -1, "insertPos = 1", "info", "The first element is always kept, so insertPos starts at 1.");

  for (let i = 1; i < working.length; i++) {
    if (working[i] !== working[insertPos - 1]) {
      working[insertPos] = working[i];
      pushStep(8, i, `nums[${insertPos}] = ${working[i]}`, "ok", `${working[i]} differs from nums[insertPos-1] → place it at insertPos.`);
      insertPos++;
      pushStep(9, i, `insertPos → ${insertPos}`, "ok", `insertPos++ → ${insertPos}.`);
    } else {
      pushStep(7, i, "duplicate", "fail", `${working[i]} equals nums[insertPos-1] → skip.`);
    }
  }

  done = true;
  steps.push({
    line: 13,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "k", value: String(insertPos), tone: "ok" }],
    result: `return ${insertPos}`,
    resultTone: "ok",
    explanation: `The first k = ${insertPos} elements are the unique values.`,
    done,
  });

  return steps;
}

// ── Remove Element ──────────────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Extra Array — collect non-val into a result, copy back.
// Source (lines):
// 0: var removeElement = function(nums, val) {
// 1:     var result = [];
// 2:     var k = 0;
// 3:
// 4:     // Collect elements that are not val
// 5:     for (var i = 0; i < nums.length; i++) {
// 6:         if (nums[i] !== val) {
// 7:             result.push(nums[i]);
// 8:             k++;
// 9:         }
// 10:    }
// 11:
// 12:    // Copy result back into nums
// 13:    for (var i = 0; i < k; i++) {
// 14:        nums[i] = result[i];
// 15:    }
// 16:
// 17:    return k;
// 18: };
export function removeElementExtraArrayTrace(nums: number[], val: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums];
  const result: number[] = [];
  let k = 0;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => (idx === i ? "i" : idx < i ? "active" : "idle")),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "val", value: String(val), tone: "info" },
        { name: "k", value: String(k), tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, "result = []", "info", "result = [] — collect kept elements.");
  pushStep(2, -1, "k = 0", "info", "k = 0 — count of kept elements.");

  for (let i = 0; i < working.length; i++) {
    if (working[i] !== val) {
      result.push(working[i]);
      k++;
      pushStep(7, i, `push ${working[i]}`, "ok", `nums[${i}] = ${working[i]} ≠ ${val} → push to result, k = ${k}.`);
    } else {
      pushStep(6, i, `skip ${val}`, "fail", `nums[${i}] = ${val} → skip (equals val).`);
    }
  }

  for (let i = 0; i < k; i++) {
    working[i] = result[i];
    pushStep(14, i, `nums[${i}] = ${result[i]}`, "info", `Copy result[${i}] = ${result[i]} back into nums[${i}].`);
  }

  done = true;
  steps.push({
    line: 17,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "k", value: String(k), tone: "ok" }],
    result: `return ${k}`,
    resultTone: "ok",
    explanation: `Return k = ${k} (elements not equal to ${val}).`,
    done,
  });

  return steps;
}

// Approach 2: Two Pointers (Front Overwrite) — write pointer compacts kept elements.
// Source (lines):
// 0: var removeElement = function(nums, val) {
// 1:     var k = 0;
// 2:     for (var i = 0; i < nums.length; i++) {
// 3:         if (nums[i] !== val) {
// 4:             // Place non-val element at the write position
// 5:             nums[k] = nums[i];
// 6:             k++;
// 7:         }
// 8:     }
// 9:     return k;
// 10: };
export function removeElementFrontOverwriteTrace(nums: number[], val: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums];
  let k = 0;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => {
        if (idx === i) return "i";
        if (idx === k && idx !== i) return "j";
        if (idx < k) return "found";
        return "idle";
      }),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "k", value: String(k), tone: "info" },
        { name: "val", value: String(val), tone: "info" },
        { name: "nums", value: `[${working.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, "k = 0", "info", "k = 0 — write pointer for next kept element.");

  for (let i = 0; i < working.length; i++) {
    if (working[i] !== val) {
      working[k] = working[i];
      pushStep(5, i, `nums[${k}] = ${working[i]}`, "ok", `nums[${i}] = ${working[i]} ≠ ${val} → overwrite nums[${k}] = ${working[i]}.`);
      k++;
      pushStep(6, i, `k → ${k}`, "ok", `k++ → ${k}.`);
    } else {
      pushStep(3, i, `skip ${val}`, "fail", `nums[${i}] = ${val} → skip (don't advance k).`);
    }
  }

  done = true;
  steps.push({
    line: 9,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "k", value: String(k), tone: "ok" }],
    result: `return ${k}`,
    resultTone: "ok",
    explanation: `Return k = ${k} (elements not equal to ${val}).`,
    done,
  });

  return steps;
}

// ── Best Time to Buy and Sell Stock ─────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Brute Force — try every pair of buy/sell days.
// Source (lines):
// 0: var maxProfit = function(prices) {
// 1:     let maxProfit = 0;
// 2:
// 3:     // Try every pair of buy and sell days
// 4:     for (let i = 0; i < prices.length - 1; i++) {
// 5:         for (let j = i + 1; j < prices.length; j++) {
// 6:             const profit = prices[j] - prices[i];
// 7:             if (profit > maxProfit) {
// 8:                 maxProfit = profit;
// 9:             }
// 10:        }
// 11:    }
// 12:
// 13:    return maxProfit;
// 14: };
export function maxProfitBruteTrace(prices: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let maxProfit = 0;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    result: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(prices, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        if (idx < i) return "active";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "buy", value: i >= 0 ? String(prices[i]) : "—", tone: "ok" },
        { name: "sell", value: j >= 0 ? String(prices[j]) : "—", tone: "info" },
        { name: "maxProfit", value: String(maxProfit), tone: maxProfit > 0 ? "ok" : "info" },
      ],
      result,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, -1, "maxProfit = 0", "info", "Initialize maxProfit = 0.");

  for (let i = 0; i < prices.length - 1; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      const profit = prices[j] - prices[i];
      if (profit > maxProfit) {
        maxProfit = profit;
        pushStep(8, i, j, `maxProfit → ${maxProfit}`, "ok", `Sell at ${prices[j]} - buy at ${prices[i]} = ${profit} > 0 → maxProfit = ${maxProfit}.`);
      } else {
        pushStep(6, i, j, `profit = ${profit}`, "fail", `Sell at ${prices[j]} - buy at ${prices[i]} = ${profit} ≤ 0 → skip.`);
      }
    }
  }

  done = true;
  steps.push({
    line: 13,
    cells: prices.map(() => "idle"),
    vars: [{ name: "maxProfit", value: String(maxProfit), tone: "ok" }],
    result: `return ${maxProfit}`,
    resultTone: "ok",
    explanation: `Maximum profit = ${maxProfit}.`,
    done,
  });

  return steps;
}

// Approach 2: One Pass (Optimal) — track minPrice, compute profit each day.
// Source (lines):
// 0: var maxProfit = function(prices) {
// 1:     var minPrice = prices[0];
// 2:     var maxProfit = 0;
// 3:
// 4:     for (var i = 1; i < prices.length; i++) {
// 5:         // Update the lowest price seen so far
// 6:         if (prices[i] < minPrice) {
// 7:             minPrice = prices[i];
// 8:         } else {
// 9:             // Check if selling today gives a better profit
// 10:            var profit = prices[i] - minPrice;
// 11:            if (profit > maxProfit) {
// 12:                maxProfit = profit;
// 13:            }
// 14:        }
// 15:    }
// 16:
// 17:    return maxProfit;
// 18: };
export function maxProfitOnePassTrace(prices: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let minPrice = prices[0];
  let maxProfit = 0;

  const pushStep = (
    line: number,
    i: number,
    result: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(prices, (idx) => (idx === i ? "i" : idx < i ? "active" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "minPrice", value: String(minPrice), tone: "ok" },
        { name: "maxProfit", value: String(maxProfit), tone: maxProfit > 0 ? "ok" : "info" },
      ],
      result,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, "minPrice = " + prices[0], "info", `minPrice = ${prices[0]} (first price).`);
  pushStep(2, -1, "maxProfit = 0", "info", "maxProfit = 0.");

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i];
      pushStep(7, i, `minPrice → ${minPrice}`, "ok", `prices[${i}] = ${prices[i]} < ${minPrice === prices[i] ? "old min" : minPrice} → new minPrice = ${minPrice}.`);
    } else {
      const profit = prices[i] - minPrice;
      if (profit > maxProfit) {
        maxProfit = profit;
        pushStep(12, i, `maxProfit → ${maxProfit}`, "ok", `prices[${i}] = ${prices[i]} - minPrice = ${minPrice} = ${profit} > 0 → maxProfit = ${maxProfit}.`);
      } else {
        pushStep(10, i, `profit = ${profit}`, "info", `prices[${i}] = ${prices[i]} - minPrice = ${minPrice} = ${profit} → not better.`);
      }
    }
  }

  done = true;
  steps.push({
    line: 17,
    cells: prices.map(() => "idle"),
    vars: [{ name: "maxProfit", value: String(maxProfit), tone: "ok" }],
    result: `return ${maxProfit}`,
    resultTone: "ok",
    explanation: `Maximum profit = ${maxProfit}.`,
    done,
  });

  return steps;
}

// ── Missing Ranges ──────────────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Check Each Gap Separately — handle before, between, after.
// Source (lines):
// 0: var findMissingRanges = function(nums, lower, upper) {
// 1:     const result = [];
// 2:     const n = nums.length;
// 3:
// 4:     if (n === 0) {
// 5:         result.push([lower, upper]);
// 6:         return result;
// 7:     }
// 8:
// 9:     // Gap before the first element
// 10:    if (lower < nums[0]) {
// 11:        result.push([lower, nums[0] - 1]);
// 12:    }
// 13:
// 14:    // Gaps between consecutive elements
// 15:    for (let i = 0; i < n - 1; i++) {
// 16:        if (nums[i + 1] - nums[i] > 1) {
// 17:            result.push([nums[i] + 1, nums[i + 1] - 1]);
// 18:        }
// 19:    }
// 20:
// 21:    // Gap after the last element
// 22:    if (nums[n - 1] < upper) {
// 23:        result.push([nums[n - 1] + 1, upper]);
// 24:    }
// 25:
// 26:    return result;
// 27: };
export function missingRangesSeparateTrace(nums: number[], lower: number, upper: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[][] = [];

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : idx < i ? "active" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "lower", value: String(lower), tone: "info" },
        { name: "upper", value: String(upper), tone: "info" },
        { name: "result", value: `[${result.map((r) => `[${r[0]},${r[1]}]`).join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (nums.length === 0) {
    result.push([lower, upper]);
    pushStep(5, -1, `[${lower},${upper}]`, "ok", `nums is empty → entire range [${lower}, ${upper}] is missing.`);
    done = true;
    steps.push({ line: 26, cells: [], vars: [{ name: "result", value: `[${lower},${upper}]`, tone: "ok" }], result: `return [[${lower},${upper}]]`, resultTone: "ok", explanation: `Return the full range.`, done });
    return steps;
  }

  pushStep(2, -1, `n = ${nums.length}`, "info", `n = ${nums.length}.`);

  // Gap before first element
  if (lower < nums[0]) {
    result.push([lower, nums[0] - 1]);
    pushStep(11, 0, `[${lower},${nums[0] - 1}]`, "ok", `lower = ${lower} < nums[0] = ${nums[0]} → gap [${lower}, ${nums[0] - 1}].`);
  } else {
    pushStep(10, 0, "no gap before", "info", `lower = ${lower} ≥ nums[0] = ${nums[0]} → no gap before first element.`);
  }

  // Gaps between consecutive elements
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i + 1] - nums[i] > 1) {
      result.push([nums[i] + 1, nums[i + 1] - 1]);
      pushStep(17, i, `[${nums[i] + 1},${nums[i + 1] - 1}]`, "ok", `nums[${i + 1}] - nums[${i}] = ${nums[i + 1]} - ${nums[i]} = ${nums[i + 1] - nums[i]} > 1 → gap [${nums[i] + 1}, ${nums[i + 1] - 1}].`);
    } else {
      pushStep(16, i, "no gap", "info", `nums[${i + 1}] - nums[${i}] = ${nums[i + 1] - nums[i]} ≤ 1 → no gap.`);
    }
  }

  // Gap after last element
  if (nums[nums.length - 1] < upper) {
    result.push([nums[nums.length - 1] + 1, upper]);
    pushStep(23, nums.length - 1, `[${nums[nums.length - 1] + 1},${upper}]`, "ok", `nums[${nums.length - 1}] = ${nums[nums.length - 1]} < upper = ${upper} → gap [${nums[nums.length - 1] + 1}, ${upper}].`);
  } else {
    pushStep(22, nums.length - 1, "no gap after", "info", `nums[${nums.length - 1}] = ${nums[nums.length - 1]} ≥ upper = ${upper} → no gap after last element.`);
  }

  done = true;
  steps.push({
    line: 26,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: `[${result.map((r) => `[${r[0]},${r[1]}]`).join(", ")}]`, tone: "ok" }],
    result: `return [${result.map((r) => `[${r[0]},${r[1]}]`).join(", ")}]`,
    resultTone: "ok",
    explanation: `Return ${result.length} missing range(s).`,
    done,
  });

  return steps;
}

// Approach 2: Unified Boundary Scan — virtual lower-1 and upper+1 anchors.
// Source (lines):
// 0: var findMissingRanges = function(nums, lower, upper) {
// 1:     const result = [];
// 2:     let prev = lower - 1;
// 3:
// 4:     for (let i = 0; i <= nums.length; i++) {
// 5:         // Use upper + 1 as the virtual element after the array
// 6:         const curr = (i < nums.length) ? nums[i] : upper + 1;
// 7:
// 8:         if (curr - prev > 1) {
// 9:             result.push([prev + 1, curr - 1]);
// 10:        }
// 11:        prev = curr;
// 12:    }
// 13:
// 14:    return result;
// 15: };
export function missingRangesUnifiedTrace(nums: number[], lower: number, upper: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let prev = lower - 1;
  const result: number[][] = [];

  const pushStep = (
    line: number,
    i: number,
    prevVal: number,
    currVal: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "prev", value: String(prevVal), tone: "info" },
        { name: "curr", value: currVal === upper + 1 ? `${upper}+1` : String(currVal), tone: "info" },
        { name: "result", value: `[${result.map((r) => `[${r[0]},${r[1]}]`).join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, -1, lower - 1, -1, `prev = ${lower - 1}`, "info", `prev = lower - 1 = ${lower - 1} (virtual element before range).`);

  for (let i = 0; i <= nums.length; i++) {
    const curr = i < nums.length ? nums[i] : upper + 1;
    if (curr - prev > 1) {
      result.push([prev + 1, curr - 1]);
      pushStep(9, i, prev, curr, `[${prev + 1},${curr - 1}]`, "ok", `curr - prev = ${curr} - ${prev} = ${curr - prev} > 1 → gap [${prev + 1}, ${curr - 1}].`);
    } else {
      pushStep(8, i, prev, curr, "no gap", "info", `curr - prev = ${curr} - ${prev} = ${curr - prev} ≤ 1 → no gap.`);
    }
    prev = curr;
  }

  done = true;
  steps.push({
    line: 14,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: `[${result.map((r) => `[${r[0]},${r[1]}]`).join(", ")}]`, tone: "ok" }],
    result: `return [${result.map((r) => `[${r[0]},${r[1]}]`).join(", ")}]`,
    resultTone: "ok",
    explanation: `Return ${result.length} missing range(s).`,
    done,
  });

  return steps;
}

// ── Majority Element II ─────────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Hash Map Counting — count every element, filter by threshold.
// Source (lines):
// 0: var majorityElement = function(nums) {
// 1:     var n = nums.length;
// 2:     var threshold = Math.floor(n / 3);
// 3:     var countMap = new Map();
// 4:     var result = [];
// 5:
// 6:     // Count occurrences of each element
// 7:     for (var i = 0; i < n; i++) {
// 8:         countMap.set(nums[i], (countMap.get(nums[i]) || 0) + 1);
// 9:     }
// 10:
// 11:    // Collect elements that appear more than n/3 times
// 12:    countMap.forEach(function(count, num) {
// 13:        if (count > threshold) {
// 14:            result.push(num);
// 15:        }
// 16:    });
// 17:
// 18:    return result;
// 19: };
export function majority2HashMapTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const counts = new Map<number, number>();
  const threshold = Math.floor(nums.length / 3);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : idx < i ? "active" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "threshold", value: String(threshold), tone: "info" },
        { name: "counts", value: `{${Array.from(counts.entries()).map(([k, v]) => `${k}:${v}`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, `n = ${nums.length}`, "info", `n = ${nums.length}.`);
  pushStep(2, -1, `threshold = ${threshold}`, "info", `threshold = floor(n/3) = ${threshold}.`);

  for (let i = 0; i < nums.length; i++) {
    const count = (counts.get(nums[i]) || 0) + 1;
    counts.set(nums[i], count);
    pushStep(8, i, `count[${nums[i]}] = ${count}`, "info", `nums[${i}] = ${nums[i]}: count becomes ${count}.`);
  }

  const result: number[] = [];
  counts.forEach((count, num) => {
    if (count > threshold) result.push(num);
  });

  done = true;
  steps.push({
    line: 18,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }],
    result: `return [${result.join(", ")}]`,
    resultTone: "ok",
    explanation: `Elements appearing > n/3 times: [${result.join(", ")}].`,
    done,
  });

  return steps;
}

// Approach 2: Sorting — sort then scan runs of consecutive elements.
// Source (lines):
// 0: var majorityElement = function(nums) {
// 1:     var n = nums.length;
// 2:     var threshold = Math.floor(n / 3);
// 3:     var result = [];
// 4:
// 5:     nums.sort(function(a, b) { return a - b; });
// 6:
// 7:     var i = 0;
// 8:     while (i < n) {
// 9:         var current = nums[i];
// 10:        var count = 0;
// 11:        // Count consecutive occurrences of current element
// 12:        while (i < n && nums[i] === current) {
// 13:            count++;
// 14:            i++;
// 15:        }
// 16:        if (count > threshold) {
// 17:            result.push(current);
// 18:        }
// 19:    }
// 20:
// 21:    return result;
// 22: };
export function majority2SortTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const sorted = [...nums].sort((a, b) => a - b);
  const threshold = Math.floor(nums.length / 3);
  const result: number[] = [];

  const pushStep = (
    line: number,
    i: number,
    current: number,
    count: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sorted, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "current", value: String(current), tone: "info" },
        { name: "count", value: String(count), tone: "info" },
        { name: "threshold", value: String(threshold), tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(5, -1, -1, 0, "sorted", "info", `Sort nums → [${sorted.join(", ")}].`);

  let i = 0;
  while (i < sorted.length) {
    const current = sorted[i];
    let count = 0;
    pushStep(9, i, current, 0, `current = ${current}`, "info", `Start counting run of ${current}.`);
    while (i < sorted.length && sorted[i] === current) {
      count++;
      i++;
    }
    if (count > threshold) {
      result.push(current);
      pushStep(17, i - 1, current, count, `push ${current}`, "ok", `count = ${count} > ${threshold} → ${current} qualifies.`);
    } else {
      pushStep(16, i - 1, current, count, "skip", "fail", `count = ${count} ≤ ${threshold} → ${current} does not qualify.`);
    }
  }

  done = true;
  steps.push({
    line: 21,
    cells: sorted.map(() => "idle"),
    vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }],
    result: `return [${result.join(", ")}]`,
    resultTone: "ok",
    explanation: `Elements appearing > n/3 times: [${result.join(", ")}].`,
    done,
  });

  return steps;
}

// ── Rotate Array ────────────────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Brute Force — rotate one step at a time, k times.
// Source (lines):
// 0: var rotate = function(nums, k) {
// 1:     var n = nums.length;
// 2:     k = k % n;
// 3:
// 4:     for (var i = 0; i < k; i++) {
// 5:         // Save the last element
// 6:         var last = nums[n - 1];
// 7:         // Shift everything right by one
// 8:         for (var j = n - 1; j > 0; j--) {
// 9:             nums[j] = nums[j - 1];
// 10:        }
// 11:        // Place last element at the front
// 12:        nums[0] = last;
// 13:    }
// 14: };
export function rotateBruteTrace(nums: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums];
  const n = working.length;
  k = k % n;

  if (k === 0) {
    done = true;
    steps.push({ line: 2, cells: working.map(() => "idle"), values: [...working], vars: [{ name: "k", value: "0", tone: "info" }], result: "k = 0 → no rotation needed", resultTone: "info", explanation: `k % n = ${k} → nothing to do.`, done });
    return steps;
  }

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => {
        if (idx === j) return "j";
        if (idx === i) return "i";
        return "idle";
      }),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "k", value: String(k), tone: "info" },
        { name: "last", value: i >= 0 && j < 0 ? String(working[n - 1]) : "—", tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, -1, -1, `k = ${k}`, "info", `k = k % n = ${k}.`);

  for (let i = 0; i < k; i++) {
    const last = working[n - 1];
    pushStep(6, i, -1, `last = ${last}`, "info", `Rotate ${i + 1}/${k}: save last = ${last}.`);
    for (let j = n - 1; j > 0; j--) {
      working[j] = working[j - 1];
      pushStep(9, i, j, `shift → [${working.join(", ")}]`, "info", `nums[${j}] = nums[${j - 1}] = ${working[j]}.`);
    }
    working[0] = last;
    pushStep(12, i, 0, `place ${last} → [${working.join(", ")}]`, "ok", `Place last = ${last} at front.`);
  }

  done = true;
  steps.push({
    line: 14,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "nums", value: `[${working.join(", ")}]`, tone: "ok" }],
    result: `[${working.join(", ")}]`,
    resultTone: "ok",
    explanation: `Array rotated by ${k} steps.`,
    done,
  });

  return steps;
}

// Approach 2: Extra Array — place each element at (i+k)%n in a result array.
// Source (lines):
// 0: var rotate = function(nums, k) {
// 1:     var n = nums.length;
// 2:     k = k % n;
// 3:     var result = new Array(n);
// 4:
// 5:     // Place each element at its rotated position
// 6:     for (var i = 0; i < n; i++) {
// 7:         result[(i + k) % n] = nums[i];
// 8:     }
// 9:
// 10:    // Copy back to original array
// 11:    for (var i = 0; i < n; i++) {
// 12:        nums[i] = result[i];
// 13:    }
// 14: };
export function rotateExtraArrayTrace(nums: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums];
  const n = working.length;
  k = k % n;
  const result = new Array(n).fill("·");

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => (idx === i ? "i" : "idle")),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "k", value: String(k), tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, -1, `k = ${k}`, "info", `k = k % n = ${k}.`);

  for (let i = 0; i < n; i++) {
    const dest = (i + k) % n;
    result[dest] = working[i];
    pushStep(7, i, `result[${dest}] = ${working[i]}`, "ok", `nums[${i}] = ${working[i]} → position (${i} + ${k}) % ${n} = ${dest}.`);
  }

  for (let i = 0; i < n; i++) {
    working[i] = result[i];
    pushStep(12, i, `nums[${i}] = ${result[i]}`, "info", `Copy result[${i}] = ${result[i]} back into nums[${i}].`);
  }

  done = true;
  steps.push({
    line: 14,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "nums", value: `[${working.join(", ")}]`, tone: "ok" }],
    result: `[${working.join(", ")}]`,
    resultTone: "ok",
    explanation: `Array rotated by ${k} steps.`,
    done,
  });

  return steps;
}

// ── Product of Array Except Self ────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Brute Force — for each i, multiply all j ≠ i.
// Source (lines):
// 0: var productExceptSelf = function(nums) {
// 1:     const n = nums.length;
// 2:     const result = new Array(n);
// 3:
// 4:     for (let i = 0; i < n; i++) {
// 5:         let product = 1;
// 6:         for (let j = 0; j < n; j++) {
// 7:             if (j !== i) {
// 8:                 product *= nums[j];
// 9:             }
// 10:        }
// 11:        result[i] = product;
// 12:    }
// 13:
// 14:    return result;
// 15: };
export function productBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;
  const result = new Array(n).fill(0);

  const pushStep = (
    line: number,
    i: number,
    j: number,
    product: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "product", value: String(product), tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, -1, 1, `n = ${n}`, "info", `n = ${n}.`);

  for (let i = 0; i < n; i++) {
    let product = 1;
    pushStep(5, i, -1, 1, `i = ${i}`, "info", `Compute product except nums[${i}] = ${nums[i]}.`);
    for (let j = 0; j < n; j++) {
      if (j !== i) {
        product *= nums[j];
        pushStep(8, i, j, product, `product *= ${nums[j]}`, "info", `j = ${j}, nums[${j}] = ${nums[j]} → product = ${product}.`);
      } else {
        pushStep(7, i, j, product, `skip j = i`, "fail", `j = ${j} = i → skip.`);
      }
    }
    result[i] = product;
    pushStep(11, i, -1, product, `result[${i}] = ${product}`, "ok", `Product except nums[${i}] = ${product}.`);
  }

  done = true;
  steps.push({
    line: 14,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }],
    result: `return [${result.join(", ")}]`,
    resultTone: "ok",
    explanation: `Return the product array.`,
    done,
  });

  return steps;
}

// Approach 2: Prefix and Suffix Products — build left/right product arrays.
// Source (lines):
// 0: var productExceptSelf = function(nums) {
// 1:     const n = nums.length;
// 2:     const prefix = new Array(n);
// 3:     const suffix = new Array(n);
// 4:     const result = new Array(n);
// 5:
// 6:     // Build prefix products
// 7:     prefix[0] = 1;
// 8:     for (let i = 1; i < n; i++) {
// 9:         prefix[i] = prefix[i - 1] * nums[i - 1];
// 10:    }
// 11:
// 12:    // Build suffix products
// 13:    suffix[n - 1] = 1;
// 14:    for (let i = n - 2; i >= 0; i--) {
// 15:        suffix[i] = suffix[i + 1] * nums[i + 1];
// 16:    }
// 17:
// 18:    // Combine prefix and suffix
// 19:    for (let i = 0; i < n; i++) {
// 20:        result[i] = prefix[i] * suffix[i];
// 21:    }
// 22:
// 23:    return result;
// 24: };
export function productPrefixSuffixTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;
  const prefix = new Array(n).fill(1);
  const suffix = new Array(n).fill(1);
  const result = new Array(n).fill(0);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "prefix", value: `[${prefix.join(", ")}]`, tone: "info" },
        { name: "suffix", value: `[${suffix.join(", ")}]`, tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(7, -1, "prefix[0] = 1", "info", "prefix[0] = 1 (no elements to the left).");
  for (let i = 1; i < n; i++) {
    prefix[i] = prefix[i - 1] * nums[i - 1];
    pushStep(9, i, `prefix[${i}] = ${prefix[i]}`, "info", `prefix[${i}] = prefix[${i - 1}] * nums[${i - 1}] = ${prefix[i - 1]} * ${nums[i - 1]} = ${prefix[i]}.`);
  }

  pushStep(13, n - 1, `suffix[${n - 1}] = 1`, "info", `suffix[${n - 1}] = 1 (no elements to the right).`);
  for (let i = n - 2; i >= 0; i--) {
    suffix[i] = suffix[i + 1] * nums[i + 1];
    pushStep(15, i, `suffix[${i}] = ${suffix[i]}`, "info", `suffix[${i}] = suffix[${i + 1}] * nums[${i + 1}] = ${suffix[i + 1]} * ${nums[i + 1]} = ${suffix[i]}.`);
  }

  for (let i = 0; i < n; i++) {
    result[i] = prefix[i] * suffix[i];
    pushStep(20, i, `result[${i}] = ${result[i]}`, "ok", `result[${i}] = prefix[${i}] * suffix[${i}] = ${prefix[i]} * ${suffix[i]} = ${result[i]}.`);
  }

  done = true;
  steps.push({
    line: 23,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }],
    result: `return [${result.join(", ")}]`,
    resultTone: "ok",
    explanation: `Return the product array.`,
    done,
  });

  return steps;
}

// ── Remove Duplicates from Sorted Array II ──────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Count and Overwrite — track running count, write if count ≤ 2.
// Source (lines):
// 0: var removeDuplicates = function(nums) {
// 1:     if (nums.length <= 2) return nums.length;
// 2:
// 3:     var writePos = 1;
// 4:     var count = 1;
// 5:
// 6:     for (var i = 1; i < nums.length; i++) {
// 7:         if (nums[i] === nums[i - 1]) {
// 8:             count++;
// 9:         } else {
// 10:            count = 1;
// 11:        }
// 12:
// 13:        if (count <= 2) {
// 14:            nums[writePos] = nums[i];
// 15:            writePos++;
// 16:        }
// 17:    }
// 18:
// 19:    return writePos;
// 20: };
export function removeDuplicates2CountTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums];

  if (working.length <= 2) {
    done = true;
    steps.push({ line: 1, cells: working.map(() => "idle"), values: [...working], vars: [{ name: "k", value: String(working.length), tone: "ok" }], result: `return ${working.length}`, resultTone: "ok", explanation: `Array has ≤ 2 elements → nothing to remove.`, done });
    return steps;
  }

  let writePos = 1;
  let count = 1;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => {
        if (idx === i) return "i";
        if (idx === writePos && idx !== i) return "j";
        return "idle";
      }),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "writePos", value: String(writePos), tone: "info" },
        { name: "count", value: String(count), tone: "info" },
        { name: "k", value: String(writePos), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(3, -1, "writePos = 1", "info", "writePos = 1 (first element always kept).");
  pushStep(4, -1, "count = 1", "info", "count = 1 (seen the first element once).");

  for (let i = 1; i < working.length; i++) {
    if (working[i] === working[i - 1]) {
      count++;
      pushStep(8, i, `count → ${count}`, "info", `nums[${i}] = ${working[i]} = nums[${i - 1}] → count = ${count}.`);
    } else {
      count = 1;
      pushStep(10, i, `count → 1`, "info", `nums[${i}] = ${working[i]} ≠ nums[${i - 1}] → reset count = 1.`);
    }
    if (count <= 2) {
      working[writePos] = working[i];
      pushStep(14, i, `write → [${working.join(", ")}]`, "ok", `count = ${count} ≤ 2 → keep. nums[${writePos}] = ${working[i]}.`);
      writePos++;
    } else {
      pushStep(13, i, `skip (3rd dup)`, "fail", `count = ${count} > 2 → skip ${working[i]} (third duplicate).`);
    }
  }

  done = true;
  steps.push({
    line: 19,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "k", value: String(writePos), tone: "ok" }],
    result: `return ${writePos}`,
    resultTone: "ok",
    explanation: `Return k = ${writePos}.`,
    done,
  });

  return steps;
}

// Approach 2: Optimal (Compare with Two Positions Back) — no counter needed.
// Source (lines):
// 0: var removeDuplicates = function(nums) {
// 1:     if (nums.length <= 2) return nums.length;
// 2:
// 3:     // First two elements are always valid
// 4:     var writePos = 2;
// 5:
// 6:     for (var i = 2; i < nums.length; i++) {
// 7:         // Compare with element two positions back in result
// 8:         if (nums[i] !== nums[writePos - 2]) {
// 9:             nums[writePos] = nums[i];
// 10:            writePos++;
// 11:        }
// 12:    }
// 13:
// 14:    return writePos;
// 15: };
export function removeDuplicates2TwoPosTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums];

  if (working.length <= 2) {
    done = true;
    steps.push({ line: 1, cells: working.map(() => "idle"), values: [...working], vars: [{ name: "k", value: String(working.length), tone: "ok" }], result: `return ${working.length}`, resultTone: "ok", explanation: `Array has ≤ 2 elements → nothing to remove.`, done });
    return steps;
  }

  let writePos = 2;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => {
        if (idx === i) return "i";
        if (idx === writePos && idx !== i) return "j";
        return "idle";
      }),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "writePos", value: String(writePos), tone: "info" },
        { name: "nums[writePos-2]", value: writePos >= 2 ? String(working[writePos - 2]) : "—", tone: "info" },
        { name: "k", value: String(writePos), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(4, -1, "writePos = 2", "info", "writePos = 2 (first two elements are always kept).");

  for (let i = 2; i < working.length; i++) {
    if (working[i] !== working[writePos - 2]) {
      working[writePos] = working[i];
      pushStep(9, i, `write → [${working.join(", ")}]`, "ok", `nums[${i}] = ${working[i]} ≠ nums[${writePos - 2}] → keep. nums[${writePos}] = ${working[i]}.`);
      writePos++;
    } else {
      pushStep(8, i, `skip`, "fail", `nums[${i}] = ${working[i]} = nums[${writePos - 2}] → third duplicate, skip.`);
    }
  }

  done = true;
  steps.push({
    line: 14,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "k", value: String(writePos), tone: "ok" }],
    result: `return ${writePos}`,
    resultTone: "ok",
    explanation: `Return k = ${writePos}.`,
    done,
  });

  return steps;
}

// ── Best Time to Buy and Sell Stock II ─────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Brute Force (Recursion) — explore every buy/sell/skip decision.
// Source (lines):
// 0: var maxProfit = function(prices) {
// 1:     function solve(day, holding) {
// 2:         // Base case: no more days to trade
// 3:         if (day === prices.length) return 0;
// 4:
// 5:         if (holding) {
// 6:             // Either sell today or skip
// 7:             let sell = prices[day] + solve(day + 1, false);
// 8:             let skip = solve(day + 1, true);
// 9:             return Math.max(sell, skip);
// 10:        } else {
// 11:            // Either buy today or skip
// 12:            let buy = -prices[day] + solve(day + 1, true);
// 13:            let skip = solve(day + 1, false);
// 14:            return Math.max(buy, skip);
// 15:        }
// 16:    }
// 17:
// 18:    return solve(0, false);
// 19: };
export function maxProfit2BruteTrace(prices: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = prices.length;

  const pushStep = (
    line: number,
    day: number,
    holding: boolean,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(prices, (idx) => (idx === day ? (holding ? "active" : "i") : "idle")),
      vars: [
        { name: "day", value: day >= 0 ? String(day) : "—", tone: "info" },
        { name: "holding", value: holding ? "true" : "false", tone: holding ? "ok" : "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  // Recursive exploration with memoization to keep the trace linear.
  const memo = new Map<string, number>();
  const solve = (day: number, holding: boolean): number => {
    const key = `${day},${holding}`;
    if (memo.has(key)) {
      const v = memo.get(key)!;
      pushStep(3, day, holding, `memo → ${v}`, "info", `solve(${day}, ${holding}) already computed = ${v}.`);
      return v;
    }
    if (day === n) {
      pushStep(3, day, holding, "return 0", "info", `Base case: day ${day} = end → return 0.`);
      memo.set(key, 0);
      return 0;
    }
    if (holding) {
      const sell = prices[day] + solve(day + 1, false);
      const skip = solve(day + 1, true);
      const best = Math.max(sell, skip);
      pushStep(9, day, true, `max(${sell}, ${skip}) = ${best}`, "ok", `Holding at day ${day}: sell → ${sell}, skip → ${skip}. Best = ${best}.`);
      memo.set(key, best);
      return best;
    } else {
      const buy = -prices[day] + solve(day + 1, true);
      const skip = solve(day + 1, false);
      const best = Math.max(buy, skip);
      pushStep(14, day, false, `max(${buy}, ${skip}) = ${best}`, "ok", `Not holding at day ${day}: buy → ${buy}, skip → ${skip}. Best = ${best}.`);
      memo.set(key, best);
      return best;
    }
  };

  const result = solve(0, false);
  done = true;
  steps.push({
    line: 18,
    cells: prices.map(() => "idle"),
    vars: [{ name: "maxProfit", value: String(result), tone: "ok" }],
    result: `return ${result}`,
    resultTone: "ok",
    explanation: `Return max profit = ${result}.`,
    done,
  });

  return steps;
}

// Approach 2: Dynamic Programming — two states (notHolding, holding) per day.
// Source (lines):
// 0: var maxProfit = function(prices) {
// 1:     // notHolding: max profit when not holding stock
// 2:     // holding: max profit when holding stock
// 3:     let notHolding = 0;
// 4:     let holding = -prices[0];
// 5:
// 6:     for (let i = 1; i < prices.length; i++) {
// 7:         let newNotHolding = Math.max(notHolding, holding + prices[i]);
// 8:         let newHolding = Math.max(holding, notHolding - prices[i]);
// 9:         notHolding = newNotHolding;
// 10:        holding = newHolding;
// 11:    }
// 12:
// 13:    return notHolding;
// 14: };
export function maxProfit2DPTrace(prices: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = prices.length;

  let notHolding = 0;
  let holding = -prices[0];

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(prices, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "notHolding", value: String(notHolding), tone: "ok" },
        { name: "holding", value: String(holding), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(3, -1, "notHolding = 0", "info", "notHolding = 0 (start with no stock).");
  pushStep(4, 0, `holding = -${prices[0]}`, "info", `holding = -prices[0] = -${prices[0]} (buy on day 0).`);

  for (let i = 1; i < n; i++) {
    const newNotHolding = Math.max(notHolding, holding + prices[i]);
    const newHolding = Math.max(holding, notHolding - prices[i]);
    pushStep(7, i, `newNotHolding = ${newNotHolding}`, "info", `Day ${i} (price ${prices[i]}): max(notHolding=${notHolding}, holding+prices=${holding}+${prices[i]}=${holding + prices[i]}) = ${newNotHolding}.`);
    pushStep(8, i, `newHolding = ${newHolding}`, "info", `Day ${i}: max(holding=${holding}, notHolding-prices=${notHolding}-${prices[i]}=${notHolding - prices[i]}) = ${newHolding}.`);
    notHolding = newNotHolding;
    holding = newHolding;
    pushStep(9, i, `notHolding = ${notHolding}`, "ok", `Update notHolding = ${notHolding}.`);
    pushStep(10, i, `holding = ${holding}`, "ok", `Update holding = ${holding}.`);
  }

  done = true;
  steps.push({
    line: 13,
    cells: prices.map(() => "idle"),
    vars: [{ name: "maxProfit", value: String(notHolding), tone: "ok" }],
    result: `return ${notHolding}`,
    resultTone: "ok",
    explanation: `Return notHolding = ${notHolding} (end without holding stock).`,
    done,
  });

  return steps;
}

export type TraceBuilder = (nums: number[], ...rest: (number | number[])[]) => Trace;

// ── Number of Zero-Filled Subarrays ────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Brute Force — for each zero, extend right while zeros.
// Source (lines):
// 0: var zeroFilledSubarray = function(nums) {
// 1:     let count = 0;
// 2:
// 3:     for (let i = 0; i < nums.length; i++) {
// 4:         if (nums[i] !== 0) continue;
// 5:         // Extend right while we see zeros
// 6:         for (let j = i; j < nums.length && nums[j] === 0; j++) {
// 7:             count++;
// 8:         }
// 9:     }
// 10:
// 11:    return count;
// 12: };
export function zeroFilledBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let count = 0;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j && j !== i) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "count", value: String(count), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, -1, "count = 0", "info", "count = 0.");

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      pushStep(4, i, -1, "skip", "fail", `nums[${i}] = ${nums[i]} ≠ 0 → skip.`);
      continue;
    }
    pushStep(5, i, -1, "start run", "info", `nums[${i}] = 0 → start extending right.`);
    for (let j = i; j < nums.length && nums[j] === 0; j++) {
      count++;
      pushStep(7, i, j, `count → ${count}`, "ok", `Subarray [${i}..${j}] all zeros → count = ${count}.`);
    }
  }

  done = true;
  steps.push({
    line: 11,
    cells: nums.map(() => "idle"),
    vars: [{ name: "count", value: String(count), tone: "ok" }],
    result: `return ${count}`,
    resultTone: "ok",
    explanation: `Return total zero-filled subarrays = ${count}.`,
    done,
  });

  return steps;
}

// Approach 2: Counting Consecutive Zeros (Optimal) — each zero in a run of
// length k contributes k new subarrays ending at that position.
// Source (lines):
// 0: var zeroFilledSubarray = function(nums) {
// 1:     let count = 0;
// 2:     let consecutiveZeros = 0;
// 3:
// 4:     for (const num of nums) {
// 5:         if (num === 0) {
// 6:             consecutiveZeros++;
// 7:         } else {
// 8:             consecutiveZeros = 0;
// 9:         }
// 10:        // Each new zero in a run of length k adds k new subarrays
// 11:        count += consecutiveZeros;
// 12:    }
// 13:
// 14:    return count;
// 15: };
export function zeroFilledOptimalTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let count = 0;
  let consecutiveZeros = 0;

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (i) => (i === idx ? "i" : "idle")),
      vars: [
        { name: "num", value: idx >= 0 ? String(nums[idx]) : "—", tone: "info" },
        { name: "consecutiveZeros", value: String(consecutiveZeros), tone: "info" },
        { name: "count", value: String(count), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, "count = 0", "info", "count = 0.");
  pushStep(2, -1, "consecutiveZeros = 0", "info", "consecutiveZeros = 0.");

  for (let idx = 0; idx < nums.length; idx++) {
    const num = nums[idx];
    if (num === 0) {
      consecutiveZeros++;
      pushStep(6, idx, `consecutiveZeros → ${consecutiveZeros}`, "info", `num = 0 → consecutiveZeros = ${consecutiveZeros}.`);
    } else {
      consecutiveZeros = 0;
      pushStep(8, idx, "consecutiveZeros → 0", "fail", `num = ${num} ≠ 0 → reset consecutiveZeros = 0.`);
    }
    count += consecutiveZeros;
    pushStep(11, idx, `count → ${count}`, "ok", `Add ${consecutiveZeros} new subarrays ending here → count = ${count}.`);
  }

  done = true;
  steps.push({
    line: 14,
    cells: nums.map(() => "idle"),
    vars: [{ name: "count", value: String(count), tone: "ok" }],
    result: `return ${count}`,
    resultTone: "ok",
    explanation: `Return total zero-filled subarrays = ${count}.`,
    done,
  });

  return steps;
}

// ── Increasing Triplet Subsequence ─────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Brute Force — try every combination of three indices.
// Source (lines):
// 0: var increasingTriplet = function(nums) {
// 1:     var n = nums.length;
// 2:     for (var i = 0; i < n - 2; i++) {
// 3:         for (var j = i + 1; j < n - 1; j++) {
// 4:             if (nums[j] > nums[i]) {
// 5:                 for (var k = j + 1; k < n; k++) {
// 6:                     if (nums[k] > nums[j]) {
// 7:                         return true;
// 8:                     }
// 9:                 }
// 10:            }
// 11:        }
// 12:    }
// 13:    return false;
// 14: };
export function increasingTripletBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    k: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        if (idx === k) return "active";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "k", value: k >= 0 ? String(k) : "—", tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 1; j < n - 1; j++) {
      if (nums[j] > nums[i]) {
        pushStep(4, i, j, -1, `nums[${j}] > nums[${i}]`, "ok", `nums[${j}] = ${nums[j]} > nums[${i}] = ${nums[i]} → check k.`);
        for (let k = j + 1; k < n; k++) {
          if (nums[k] > nums[j]) {
            pushStep(6, i, j, k, `found!`, "ok", `nums[${k}] = ${nums[k]} > nums[${j}] = ${nums[j]} → triplet (${nums[i]}, ${nums[j]}, ${nums[k]}).`);
            done = true;
            steps.push({
              line: 7,
              cells: nums.map(() => "idle"),
              vars: [{ name: "result", value: "true", tone: "ok" }],
              result: "return true",
              resultTone: "ok",
              explanation: `Found increasing triplet → return true.`,
              done,
            });
            return steps;
          } else {
            pushStep(6, i, j, k, "no", "fail", `nums[${k}] = ${nums[k]} ≤ nums[${j}] = ${nums[j]} → not a triplet.`);
          }
        }
      } else {
        pushStep(4, i, j, -1, "no", "fail", `nums[${j}] = ${nums[j]} ≤ nums[${i}] = ${nums[i]} → skip j.`);
      }
    }
  }

  done = true;
  steps.push({
    line: 13,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: "false", tone: "fail" }],
    result: "return false",
    resultTone: "fail",
    explanation: `No increasing triplet found → return false.`,
    done,
  });

  return steps;
}

// Approach 2: Prefix Min and Suffix Max — precompute leftMin and rightMax.
// Source (lines):
// 0: var increasingTriplet = function(nums) {
// 1:     var n = nums.length;
// 2:     if (n < 3) return false;
// 3:
// 4:     // leftMin[i] = minimum value in nums[0..i]
// 5:     var leftMin = new Array(n);
// 6:     leftMin[0] = nums[0];
// 7:     for (var i = 1; i < n; i++) {
// 8:         leftMin[i] = Math.min(leftMin[i - 1], nums[i]);
// 9:     }
// 10:
// 11:    // rightMax[i] = maximum value in nums[i..n-1]
// 12:    var rightMax = new Array(n);
// 13:    rightMax[n - 1] = nums[n - 1];
// 14:    for (var i = n - 2; i >= 0; i--) {
// 15:        rightMax[i] = Math.max(rightMax[i + 1], nums[i]);
// 16:    }
// 17:
// 18:    // Check if any middle element forms a valid triplet
// 19:    for (var j = 1; j < n - 1; j++) {
// 20:        if (leftMin[j - 1] < nums[j] && nums[j] < rightMax[j + 1]) {
// 21:            return true;
// 22:        }
// 23:    }
// 24:
// 25:    return false;
// 26: };
export function increasingTripletPrefixSuffixTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;

  if (n < 3) {
    done = true;
    steps.push({ line: 2, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `n = ${n} < 3 → cannot form a triplet.`, done });
    return steps;
  }

  const leftMin = new Array(n);
  const rightMax = new Array(n);

  const pushStep = (
    line: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === j ? "j" : "idle")),
      vars: [
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "leftMin", value: `[${leftMin.join(", ")}]`, tone: "info" },
        { name: "rightMax", value: `[${rightMax.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  leftMin[0] = nums[0];
  pushStep(6, -1, "leftMin[0] = nums[0]", "info", `leftMin[0] = ${nums[0]}.`);
  for (let i = 1; i < n; i++) {
    leftMin[i] = Math.min(leftMin[i - 1], nums[i]);
    pushStep(8, -1, `leftMin[${i}] = ${leftMin[i]}`, "info", `leftMin[${i}] = min(${leftMin[i - 1]}, ${nums[i]}) = ${leftMin[i]}.`);
  }

  rightMax[n - 1] = nums[n - 1];
  pushStep(13, -1, `rightMax[${n - 1}] = nums[${n - 1}]`, "info", `rightMax[${n - 1}] = ${nums[n - 1]}.`);
  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], nums[i]);
    pushStep(15, -1, `rightMax[${i}] = ${rightMax[i]}`, "info", `rightMax[${i}] = max(${rightMax[i + 1]}, ${nums[i]}) = ${rightMax[i]}.`);
  }

  for (let j = 1; j < n - 1; j++) {
    if (leftMin[j - 1] < nums[j] && nums[j] < rightMax[j + 1]) {
      pushStep(20, j, "found!", "ok", `leftMin[${j - 1}] = ${leftMin[j - 1]} < nums[${j}] = ${nums[j]} < rightMax[${j + 1}] = ${rightMax[j + 1]} → triplet exists.`);
      done = true;
      steps.push({
        line: 21,
        cells: nums.map(() => "idle"),
        vars: [{ name: "result", value: "true", tone: "ok" }],
        result: "return true",
        resultTone: "ok",
        explanation: `Middle element nums[${j}] = ${nums[j]} forms a valid triplet → return true.`,
        done,
      });
      return steps;
    } else {
      pushStep(20, j, "no", "fail", `nums[${j}] = ${nums[j]} does not satisfy leftMin < nums[j] < rightMax.`);
    }
  }

  done = true;
  steps.push({
    line: 25,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: "false", tone: "fail" }],
    result: "return false",
    resultTone: "fail",
    explanation: `No middle element forms a valid triplet → return false.`,
    done,
  });

  return steps;
}

// ── Next Permutation ───────────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Brute Force (Generate All Permutations) — enumerate, sort,
// find current, return next. For visualization we show the sorted list and
// the transition to the next permutation.
// Source (lines):
// 0: var nextPermutation = function(nums) {
// 1:     var perms = [];
// 2:     generatePerms(nums.slice(), 0, perms);
// 3:
// 4:     // Sort permutations lexicographically
// 5:     perms.sort(function(a, b) {
// 6:         for (var i = 0; i < a.length; i++) {
// 7:             if (a[i] !== b[i]) return a[i] - b[i];
// 8:         }
// 9:         return 0;
// 10:    });
// 11:
// 12:    // Find current and return next
// 13:    for (var i = 0; i < perms.length; i++) {
// 14:        if (perms[i].every(function(val, idx) { return val === nums[idx]; })) {
// 15:            var next = perms[(i + 1) % perms.length];
// 16:            for (var j = 0; j < nums.length; j++) {
// 17:                nums[j] = next[j];
// 18:            }
// 19:            return;
// 20:        }
// 21:    }
// 22: };
export function nextPermutationBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums];

  // Generate all distinct permutations.
  const perms: number[][] = [];
  const generate = (arr: number[], start: number) => {
    if (start === arr.length) {
      perms.push([...arr]);
      return;
    }
    const seen = new Set<number>();
    for (let i = start; i < arr.length; i++) {
      if (seen.has(arr[i])) continue;
      seen.add(arr[i]);
      [arr[start], arr[i]] = [arr[i], arr[start]];
      generate(arr, start + 1);
      [arr[start], arr[i]] = [arr[i], arr[start]];
    }
  };
  generate([...nums], 0);

  // Sort lexicographically.
  perms.sort((a, b) => {
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i];
    return 0;
  });

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: working.map(() => "idle"),
      values: [...working],
      vars: [{ name: "perms", value: `[${perms.map((p) => `[${p.join(",")}]`).join(", ")}]`, tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, `generated ${perms.length} perms`, "info", `Generated ${perms.length} distinct permutations.`);
  pushStep(5, "sorted", "info", `Sorted all permutations lexicographically.`);

  const idx = perms.findIndex((p) => p.every((v, i) => v === nums[i]));
  const next = perms[(idx + 1) % perms.length];
  for (let j = 0; j < working.length; j++) working[j] = next[j];
  pushStep(15, `next = [${next.join(", ")}]`, "ok", `Current permutation is at index ${idx}. Next is [${next.join(", ")}].`);
  pushStep(17, `nums = [${working.join(", ")}]`, "ok", `Copy next permutation into nums → [${working.join(", ")}].`);

  done = true;
  steps.push({
    line: 19,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "nums", value: `[${working.join(", ")}]`, tone: "ok" }],
    result: `[${working.join(", ")}]`,
    resultTone: "ok",
    explanation: `Return the next permutation [${working.join(", ")}].`,
    done,
  });

  return steps;
}

// Approach 2: Optimal (Single Pass with Suffix Reversal).
// Source (lines):
// 0: var nextPermutation = function(nums) {
// 1:     var n = nums.length;
// 2:
// 3:     // Step 1: Find the pivot (rightmost i where nums[i] < nums[i+1])
// 4:     var i = n - 2;
// 5:     while (i >= 0 && nums[i] >= nums[i + 1]) {
// 6:         i--;
// 7:     }
// 8:
// 9:     // Step 2: If pivot exists, find the successor and swap
// 10:    if (i >= 0) {
// 11:        var j = n - 1;
// 12:        while (nums[j] <= nums[i]) {
// 13:            j--;
// 14:        }
// 15:        // Step 3: Swap pivot with successor
// 16:        var temp = nums[i];
// 17:        nums[i] = nums[j];
// 18:        nums[j] = temp;
// 19:    }
// 20:
// 21:    // Step 4: Reverse the suffix starting at i+1
// 22:    var left = i + 1;
// 23:    var right = n - 1;
// 24:    while (left < right) {
// 25:        var temp = nums[left];
// 26:        nums[left] = nums[right];
// 27:        nums[right] = temp;
// 28:        left++;
// 29:        right--;
// 30:    }
// 31: };
export function nextPermutationOptimalTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums];
  const n = working.length;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  // Step 1: find pivot
  let i = n - 2;
  while (i >= 0 && working[i] >= working[i + 1]) {
    pushStep(5, i, -1, `nums[${i}] ≥ nums[${i + 1}]`, "fail", `nums[${i}] = ${working[i]} ≥ nums[${i + 1}] = ${working[i + 1]} → keep scanning left.`);
    i--;
  }
  if (i >= 0) {
    pushStep(5, i, -1, `pivot = ${i}`, "ok", `Found pivot at i = ${i}: nums[${i}] = ${working[i]} < nums[${i + 1}] = ${working[i + 1]}.`);
  } else {
    pushStep(5, -1, -1, "no pivot", "info", `No pivot found → array is descending, reverse entire array.`);
  }

  // Step 2: find successor and swap
  if (i >= 0) {
    let j = n - 1;
    while (working[j] <= working[i]) {
      pushStep(12, i, j, `nums[${j}] ≤ nums[${i}]`, "fail", `nums[${j}] = ${working[j]} ≤ nums[${i}] = ${working[i]} → keep scanning left.`);
      j--;
    }
    pushStep(12, i, j, `successor = ${j}`, "ok", `Found successor at j = ${j}: nums[${j}] = ${working[j]} > nums[${i}] = ${working[i]}.`);
    [working[i], working[j]] = [working[j], working[i]];
    pushStep(17, i, j, `swap → [${working.join(", ")}]`, "ok", `Swap nums[${i}] and nums[${j}] → [${working.join(", ")}].`);
  }

  // Step 4: reverse suffix
  let left = i + 1;
  let right = n - 1;
  while (left < right) {
    [working[left], working[right]] = [working[right], working[left]];
    pushStep(26, left, right, `reverse → [${working.join(", ")}]`, "ok", `Swap nums[${left}] and nums[${right}] → [${working.join(", ")}].`);
    left++;
    right--;
  }

  done = true;
  steps.push({
    line: 30,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "nums", value: `[${working.join(", ")}]`, tone: "ok" }],
    result: `[${working.join(", ")}]`,
    resultTone: "ok",
    explanation: `Next permutation is [${working.join(", ")}].`,
    done,
  });

  return steps;
}

// ── First Missing Positive ─────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Hash Set — store all numbers, check 1, 2, 3, ... in order.
// Source (lines):
// 0: var firstMissingPositive = function(nums) {
// 1:     // Store all numbers in a set for O(1) lookup
// 2:     const seen = new Set(nums);
// 3:
// 4:     // Check 1, 2, 3, ... until we find one that's missing
// 5:     for (let i = 1; i <= nums.length + 1; i++) {
// 6:         if (!seen.has(i)) {
// 7:             return i;
// 8:         }
// 9:     }
// 10:
// 11:    return nums.length + 1;
// 12: };
export function firstMissingPositiveHashSetTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const seen = new Set(nums);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "seen", value: `[${[...seen].join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, -1, `seen = {${[...seen].join(", ")}}`, "info", `Stored all ${nums.length} numbers in a set.`);

  for (let i = 1; i <= nums.length + 1; i++) {
    if (!seen.has(i)) {
      pushStep(6, -1, `return ${i}`, "ok", `${i} is not in the set → it is the first missing positive.`);
      done = true;
      steps.push({
        line: 7,
        cells: nums.map(() => "idle"),
        vars: [{ name: "result", value: String(i), tone: "ok" }],
        result: `return ${i}`,
        resultTone: "ok",
        explanation: `First missing positive = ${i}.`,
        done,
      });
      return steps;
    } else {
      pushStep(6, -1, `${i} present`, "info", `${i} is in the set → continue.`);
    }
  }

  done = true;
  steps.push({
    line: 11,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: String(nums.length + 1), tone: "ok" }],
    result: `return ${nums.length + 1}`,
    resultTone: "ok",
    explanation: `All 1..n present → return n+1 = ${nums.length + 1}.`,
    done,
  });

  return steps;
}

// Approach 2: Sorting — sort, then walk tracking the expected positive.
// Source (lines):
// 0: var firstMissingPositive = function(nums) {
// 1:     nums.sort((a, b) => a - b);
// 2:     let expected = 1;
// 3:
// 4:     for (let i = 0; i < nums.length; i++) {
// 5:         // Skip negatives, zeros, and duplicates
// 6:         if (nums[i] <= 0 || (i > 0 && nums[i] === nums[i - 1])) {
// 7:             continue;
// 8:         }
// 9:         // If current number matches what we expect, move to next
// 10:        if (nums[i] === expected) {
// 11:            expected++;
// 12:        } else {
// 13:            // Gap found
// 14:            break;
// 15:        }
// 16:    }
// 17:
// 18:    return expected;
// 19: };
export function firstMissingPositiveSortTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums].sort((a, b) => a - b);
  let expected = 1;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => (idx === i ? "i" : "idle")),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "expected", value: String(expected), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, `sorted = [${working.join(", ")}]`, "info", `Sorted the array → [${working.join(", ")}].`);
  pushStep(2, -1, "expected = 1", "info", "expected = 1 (first positive integer we look for).");

  for (let i = 0; i < working.length; i++) {
    if (working[i] <= 0 || (i > 0 && working[i] === working[i - 1])) {
      pushStep(6, i, "skip", "fail", `nums[${i}] = ${working[i]} is not a new positive → skip.`);
      continue;
    }
    if (working[i] === expected) {
      expected++;
      pushStep(11, i, `expected → ${expected}`, "ok", `nums[${i}] = ${working[i]} matches expected → expected = ${expected}.`);
    } else {
      pushStep(13, i, `gap at ${expected}`, "fail", `nums[${i}] = ${working[i]} > expected = ${expected} → gap found.`);
      break;
    }
  }

  done = true;
  steps.push({
    line: 18,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "result", value: String(expected), tone: "ok" }],
    result: `return ${expected}`,
    resultTone: "ok",
    explanation: `First missing positive = ${expected}.`,
    done,
  });

  return steps;
}

// ── Reverse String ────────────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.
// Input is a character array; we store chars as their char codes so the
// existing number[] plumbing works. Visualizers render them as characters.

// Approach 1: Extra Array — fill a reversed copy, then copy back.
// Source (lines):
// 0: var reverseString = function(s) {
// 1:     const n = s.length;
// 2:     const result = new Array(n);
// 3:
// 4:     // Fill reversed array from back to front
// 5:     for (let i = 0; i < n; i++) {
// 6:         result[i] = s[n - 1 - i];
// 7:     }
// 8:
// 9:     // Copy back into original array
// 10:    for (let i = 0; i < n; i++) {
// 11:        s[i] = result[i];
// 12:    }
// 13: };
export function reverseStringExtraArrayTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = codes.length;
  const working = [...codes];
  const result = new Array(n).fill(0);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => (idx === i ? "i" : "idle")),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "result", value: `[${result.map((c) => String.fromCharCode(c)).join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, `n = ${n}`, "info", `n = ${n}.`);
  pushStep(2, -1, "result = []", "info", "Allocate result array of length n.");

  for (let i = 0; i < n; i++) {
    result[i] = working[n - 1 - i];
    pushStep(6, i, `result[${i}] = s[${n - 1 - i}]`, "ok", `result[${i}] = s[${n - 1 - i}] = '${String.fromCharCode(working[n - 1 - i])}'.`);
  }

  for (let i = 0; i < n; i++) {
    working[i] = result[i];
    pushStep(11, i, `s[${i}] = '${String.fromCharCode(working[i])}'`, "ok", `Copy result[${i}] = '${String.fromCharCode(working[i])}' back into s[${i}].`);
  }

  done = true;
  steps.push({
    line: 12,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "s", value: `[${working.map((c) => String.fromCharCode(c)).join(", ")}]`, tone: "ok" }],
    result: `[${working.map((c) => String.fromCharCode(c)).join(", ")}]`,
    resultTone: "ok",
    explanation: `Reversed string: [${working.map((c) => String.fromCharCode(c)).join(", ")}].`,
    done,
  });

  return steps;
}

// Approach 2: Two Pointers — swap from both ends inward.
// Source (lines):
// 0: var reverseString = function(s) {
// 1:     let left = 0;
// 2:     let right = s.length - 1;
// 3:
// 4:     while (left < right) {
// 5:         // Swap characters at the two pointers
// 6:         [s[left], s[right]] = [s[right], s[left]];
// 7:         left++;
// 8:         right--;
// 9:     }
// 10: };
export function reverseStringTwoPointerTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...codes];
  let left = 0;
  let right = working.length - 1;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => {
        if (idx === left) return "i";
        if (idx === right) return "j";
        return "idle";
      }),
      values: [...working],
      vars: [
        { name: "left", value: String(left), tone: "info" },
        { name: "right", value: String(right), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, "left = 0", "info", "left = 0.");
  pushStep(2, `right = ${right}`, "info", `right = s.length - 1 = ${right}.`);

  while (left < right) {
    pushStep(4, `left=${left} < right=${right}`, "info", `left = ${left} < right = ${right} → swap.`);
    [working[left], working[right]] = [working[right], working[left]];
    pushStep(6, `swap → [${working.map((c) => String.fromCharCode(c)).join(", ")}]`, "ok", `Swap s[${left}] = '${String.fromCharCode(working[left])}' and s[${right}] = '${String.fromCharCode(working[right])}'.`);
    left++;
    right--;
    pushStep(7, `left → ${left}`, "info", `left = ${left}.`);
    pushStep(8, `right → ${right}`, "info", `right = ${right}.`);
  }

  done = true;
  steps.push({
    line: 9,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "s", value: `[${working.map((c) => String.fromCharCode(c)).join(", ")}]`, tone: "ok" }],
    result: `[${working.map((c) => String.fromCharCode(c)).join(", ")}]`,
    resultTone: "ok",
    explanation: `Reversed string: [${working.map((c) => String.fromCharCode(c)).join(", ")}].`,
    done,
  });

  return steps;
}

// ── Length of Last Word ───────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.
// Input is a string; we store chars as their char codes (space = 32) so the
// existing number[] plumbing works. Visualizers render them as characters.

// Approach 1: Split and Filter — split on spaces, filter empties, take last.
// Source (lines):
// 0: var lengthOfLastWord = function(s) {
// 1:     // Splitting on a single space can produce empty strings, so filter them out
// 2:     const words = s.split(" ").filter((w) => w.length > 0);
// 3:
// 4:     if (words.length === 0) {
// 5:         return 0;
// 6:     }
// 7:
// 8:     return words[words.length - 1].length;
// 9: };
export function lengthOfLastWordSplitTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  const words = s.split(" ").filter((w) => w.length > 0);

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, () => "idle"),
      values: [...codes],
      vars: [
        { name: "words", value: `[${words.map((w) => `"${w}"`).join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, `words = [${words.map((w) => `"${w}"`).join(", ")}]`, "info", `Split "${s}" on spaces and filter empties → ${words.length} word(s).`);

  if (words.length === 0) {
    pushStep(4, "no words", "fail", `No words found → return 0.`);
    done = true;
    steps.push({
      line: 5,
      cells: codes.map(() => "idle"),
      values: [...codes],
      vars: [{ name: "result", value: "0", tone: "ok" }],
      result: "return 0",
      resultTone: "ok",
      explanation: `No words → return 0.`,
      done,
    });
    return steps;
  }

  const last = words[words.length - 1];
  pushStep(8, `last = "${last}"`, "info", `Last word is "${last}".`);
  done = true;
  steps.push({
    line: 8,
    cells: codes.map(() => "idle"),
    values: [...codes],
    vars: [{ name: "result", value: String(last.length), tone: "ok" }],
    result: `return ${last.length}`,
    resultTone: "ok",
    explanation: `Length of last word "${last}" = ${last.length}.`,
    done,
  });

  return steps;
}

// Approach 2: Traverse from End (Optimal) — skip trailing spaces, count chars.
// Source (lines):
// 0: var lengthOfLastWord = function(s) {
// 1:     let i = s.length - 1;
// 2:     // Skip trailing spaces
// 3:
// 4:     while (i >= 0 && s[i] === ' ') {
// 5:         i--;
// 6:     }
// 7:
// 8:     // Count characters in the last word
// 9:     let length = 0;
// 10:    while (i >= 0 && s[i] !== ' ') {
// 11:        length++;
// 12:        i--;
// 13:    }
// 14:
// 15:    return length;
// 16: };
export function lengthOfLastWordEndTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...codes];
  let i = working.length - 1;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => (idx === i ? "i" : "idle")),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "length", value: String(length), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  let length = 0;
  pushStep(1, `i = ${i}`, "info", `i = s.length - 1 = ${i}.`);

  while (i >= 0 && working[i] === 32) {
    pushStep(4, `s[${i}] = ' '`, "fail", `s[${i}] is a space → skip.`);
    i--;
    pushStep(5, `i → ${i}`, "info", `i = ${i}.`);
  }

  while (i >= 0 && working[i] !== 32) {
    length++;
    pushStep(11, `length → ${length}`, "ok", `s[${i}] = '${String.fromCharCode(working[i])}' → length = ${length}.`);
    i--;
    pushStep(12, `i → ${i}`, "info", `i = ${i}.`);
  }

  done = true;
  steps.push({
    line: 15,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "result", value: String(length), tone: "ok" }],
    result: `return ${length}`,
    resultTone: "ok",
    explanation: `Length of last word = ${length}.`,
    done,
  });

  return steps;
}

// ── Is Subsequence ────────────────────────────────────────────────────
// Two DISTINCT approaches. Input: s (first string) and t (second string),
// both as char-code arrays.

// Approach 1: Two Pointers — scan t, advance i in s on match.
// Source (lines):
// 0: var isSubsequence = function(s, t) {
// 1:     // Initialize pointer for s
// 2:     let i = 0;
// 3:
// 4:     // Traverse through t
// 5:     for (let j = 0; j < t.length; j++) {
// 6:         // If we found all characters in s
// 7:         if (i === s.length) {
// 8:             return true;
// 9:         }
// 10:        // If characters match, move pointer in s
// 11:        if (s[i] === t[j]) {
// 12:            i++;
// 13:        }
// 14:    }
// 15:
// 16:    // Check if we found all characters
// 17:    return i === s.length;
// 18: };
export function isSubsequenceTwoPointerTrace(sCodes: number[], tCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const t = tCodes.map((c) => String.fromCharCode(c)).join("");
  let i = 0;

  const pushStep = (
    line: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(tCodes, (idx) => (idx === j ? "j" : "idle")),
      values: [...tCodes],
      vars: [
        { name: "i", value: String(i), tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "s", value: `"${s}"`, tone: "info" },
        { name: "t", value: `"${t}"`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, -1, "i = 0", "info", "i = 0 (pointer into s).");

  for (let j = 0; j < t.length; j++) {
    if (i === s.length) {
      pushStep(7, j, "all matched", "ok", `i = ${i} = s.length → all characters of s found.`);
      done = true;
      steps.push({
        line: 8,
        cells: tCodes.map(() => "idle"),
        values: [...tCodes],
        vars: [{ name: "result", value: "true", tone: "ok" }],
        result: "return true",
        resultTone: "ok",
        explanation: `All characters of "${s}" found in order → return true.`,
        done,
      });
      return steps;
    }
    if (s[i] === t[j]) {
      i++;
      pushStep(12, j, `i → ${i}`, "ok", `s[${i - 1}] = '${s[i - 1]}' matches t[${j}] = '${t[j]}' → i = ${i}.`);
    } else {
      pushStep(11, j, "no match", "fail", `s[${i}] = '${s[i]}' ≠ t[${j}] = '${t[j]}' → keep i.`);
    }
  }

  done = true;
  steps.push({
    line: 17,
    cells: tCodes.map(() => "idle"),
    values: [...tCodes],
    vars: [{ name: "result", value: String(i === s.length), tone: i === s.length ? "ok" : "fail" }],
    result: `return ${i === s.length}`,
    resultTone: i === s.length ? "ok" : "fail",
    explanation: `i = ${i}, s.length = ${s.length} → ${i === s.length ? "is" : "is not"} a subsequence.`,
    done,
  });

  return steps;
}

// Approach 2: Binary Search with Preprocessing — store positions of each char
// in t, then binary search for the next index after prev for each char of s.
// Source (lines):
// 0: var isSubsequence = function(s, t) {
// 1:     var positions = new Map();
// 2:     for (var idx = 0; idx < t.length; idx++) {
// 3:         if (!positions.has(t[idx])) positions.set(t[idx], []);
// 4:         positions.get(t[idx]).push(idx);
// 5:     }
// 6:     var prev = -1;
// 7:     for (var i = 0; i < s.length; i++) {
// 8:         var idxs = positions.get(s[i]) || [];
// 9:         // Binary search for the smallest index > prevIndex
// 10:        var lo = 0, hi = idxs.length;
// 11:        while (lo < hi) {
// 12:            var mid = (lo + hi) >> 1;
// 13:            if (idxs[mid] > prev) {
// 14:                hi = mid;
// 15:            } else {
// 16:                lo = mid + 1;
// 17:            }
// 18:        }
// 19:        if (lo === idxs.length) {
// 20:            return false;
// 21:        }
// 22:        prev = idxs[lo];
// 23:    }
// 24:    return true;
// 25: };
export function isSubsequenceBinarySearchTrace(sCodes: number[], tCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const t = tCodes.map((c) => String.fromCharCode(c)).join("");
  const positions = new Map<string, number[]>();
  for (let idx = 0; idx < t.length; idx++) {
    const ch = t[idx];
    if (!positions.has(ch)) positions.set(ch, []);
    positions.get(ch)!.push(idx);
  }
  let prev = -1;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(tCodes, () => "idle"),
      values: [...tCodes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "prev", value: String(prev), tone: "info" },
        { name: "positions", value: `{${Array.from(positions.entries()).map(([k, v]) => `'${k}':[${v.join(",")}]`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, -1, "positions built", "info", `Preprocessed positions of each char in "${t}".`);

  for (let i = 0; i < s.length; i++) {
    const idxs = positions.get(s[i]) ?? [];
    pushStep(8, i, `idxs('${s[i]}') = [${idxs.join(", ")}]`, "info", `Positions of '${s[i]}' in t: [${idxs.join(", ")}].`);
    let lo = 0, hi = idxs.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (idxs[mid] > prev) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    if (lo === idxs.length) {
      pushStep(19, i, "no index > prev", "fail", `No position of '${s[i]}' after prev = ${prev} → return false.`);
      done = true;
      steps.push({
        line: 20,
        cells: tCodes.map(() => "idle"),
        values: [...tCodes],
        vars: [{ name: "result", value: "false", tone: "fail" }],
        result: "return false",
        resultTone: "fail",
        explanation: `Cannot place '${s[i]}' after index ${prev} → not a subsequence.`,
        done,
      });
      return steps;
    }
    prev = idxs[lo];
    pushStep(22, i, `prev → ${prev}`, "ok", `Place '${s[i]}' at index ${prev} → prev = ${prev}.`);
  }

  done = true;
  steps.push({
    line: 24,
    cells: tCodes.map(() => "idle"),
    values: [...tCodes],
    vars: [{ name: "result", value: "true", tone: "ok" }],
    result: "return true",
    resultTone: "ok",
    explanation: `All characters of "${s}" placed in order → is a subsequence.`,
    done,
  });

  return steps;
}

// ── Valid Palindrome ───────────────────────────────────────────────────
// Two DISTINCT approaches. Input: s as char-code array.

// Approach 1: Filter and Reverse — build cleaned string, compare with reverse.
// Source (lines):
// 0: var isPalindrome = function(s) {
// 1:     // Build a cleaned string with only lowercase alphanumeric chars
// 2:     let filtered = "";
// 3:     for (const c of s) {
// 4:         if (/[a-z0-9]/i.test(c)) {
// 5:             filtered += c.toLowerCase();
// 6:         }
// 7:     }
// 8:
// 9:     // Compare with its reverse
// 10:    const reversed = filtered.split("").reverse().join("");
// 11:
// 12:    return filtered === reversed;
// 13: };
export function validPalindromeFilterTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  let filtered = "";

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, (i) => (i === idx ? "i" : "idle")),
      values: [...codes],
      vars: [
        { name: "filtered", value: `"${filtered}"`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, -1, 'filtered = ""', "info", 'filtered = "" (cleaned string).');

  for (let idx = 0; idx < s.length; idx++) {
    const c = s[idx];
    if (/[a-z0-9]/i.test(c)) {
      filtered += c.toLowerCase();
      pushStep(5, idx, `filtered → "${filtered}"`, "ok", `'${c}' is alphanumeric → append → "${filtered}".`);
    } else {
      pushStep(4, idx, "skip", "fail", `'${c}' is not alphanumeric → skip.`);
    }
  }

  const reversed = filtered.split("").reverse().join("");
  pushStep(10, -1, `reversed = "${reversed}"`, "info", `Reversed filtered = "${reversed}".`);
  const isPal = filtered === reversed;
  done = true;
  steps.push({
    line: 12,
    cells: codes.map(() => "idle"),
    values: [...codes],
    vars: [{ name: "result", value: String(isPal), tone: isPal ? "ok" : "fail" }],
    result: `return ${isPal}`,
    resultTone: isPal ? "ok" : "fail",
    explanation: `"${filtered}" ${isPal ? "==" : "≠"} "${reversed}" → ${isPal ? "is" : "is not"} a palindrome.`,
    done,
  });

  return steps;
}

// Approach 2: Two Pointers (Optimal) — skip non-alphanumeric, compare ends.
// Source (lines):
// 0: var isPalindrome = function(s) {
// 1:     let left = 0;
// 2:     let right = s.length - 1;
// 3:
// 4:     while (left < right) {
// 5:         // Skip non-alphanumeric characters from the left
// 6:         if (!isAlphanumeric(s[left])) {
// 7:             left++;
// 8:             continue;
// 9:         }
// 10:        // Skip non-alphanumeric characters from the right
// 11:        if (!isAlphanumeric(s[right])) {
// 12:            right--;
// 13:            continue;
// 14:        }
// 15:
// 16:        // Compare lowercase versions
// 17:        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
// 18:            return false;
// 19:        }
// 20:
// 21:        left++;
// 22:        right--;
// 23:    }
// 24:
// 25:    return true;
// 26: }
// 27:
// 28: function isAlphanumeric(char) {
// 29:     return /[a-zA-Z0-9]/.test(char);
// 30: }
export function validPalindromeTwoPointerTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  let left = 0;
  let right = s.length - 1;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, (idx) => {
        if (idx === left) return "i";
        if (idx === right) return "j";
        return "idle";
      }),
      values: [...codes],
      vars: [
        { name: "left", value: String(left), tone: "info" },
        { name: "right", value: String(right), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, "left = 0", "info", "left = 0.");
  pushStep(2, `right = ${right}`, "info", `right = s.length - 1 = ${right}.`);

  while (left < right) {
    if (!/[a-zA-Z0-9]/.test(s[left])) {
      pushStep(6, `skip left '${s[left]}'`, "fail", `s[${left}] = '${s[left]}' is not alphanumeric → skip.`);
      left++;
      pushStep(7, `left → ${left}`, "info", `left = ${left}.`);
      continue;
    }
    if (!/[a-zA-Z0-9]/.test(s[right])) {
      pushStep(11, `skip right '${s[right]}'`, "fail", `s[${right}] = '${s[right]}' is not alphanumeric → skip.`);
      right--;
      pushStep(12, `right → ${right}`, "info", `right = ${right}.`);
      continue;
    }
    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      pushStep(17, "mismatch", "fail", `'${s[left]}' ≠ '${s[right]}' → not a palindrome.`);
      done = true;
      steps.push({
        line: 18,
        cells: codes.map(() => "idle"),
        values: [...codes],
        vars: [{ name: "result", value: "false", tone: "fail" }],
        result: "return false",
        resultTone: "fail",
        explanation: `Mismatch at '${s[left]}' vs '${s[right]}' → return false.`,
        done,
      });
      return steps;
    }
    pushStep(17, `match '${s[left]}'`, "ok", `'${s[left]}' == '${s[right]}' → continue.`);
    left++;
    right--;
    pushStep(21, `left → ${left}`, "info", `left = ${left}.`);
    pushStep(22, `right → ${right}`, "info", `right = ${right}.`);
  }

  done = true;
  steps.push({
    line: 25,
    cells: codes.map(() => "idle"),
    values: [...codes],
    vars: [{ name: "result", value: "true", tone: "ok" }],
    result: "return true",
    resultTone: "ok",
    explanation: `All pairs matched → is a palindrome.`,
    done,
  });

  return steps;
}

// ── Valid Palindrome II ────────────────────────────────────────────────
// Two DISTINCT approaches. Input: s as char-code array.

// Approach 1: Brute Force — check each single deletion.
// Source (lines):
// 0: var validPalindrome = function(s) {
// 1:     function isPalindrome(t) {
// 2:         let left = 0;
// 3:         let right = t.length - 1;
// 4:         while (left < right) {
// 5:             if (t[left] !== t[right]) {
// 6:                 return false;
// 7:             }
// 8:             left++;
// 9:             right--;
// 10:        }
// 11:        return true;
// 12:    }
// 13:
// 14:    if (isPalindrome(s)) {
// 15:        return true;
// 16:    }
// 17:
// 18:    // Check each possible single deletion
// 19:    for (let i = 0; i < s.length; i++) {
// 20:        const candidate = s.slice(0, i) + s.slice(i + 1);
// 21:        if (isPalindrome(candidate)) {
// 22:            return true;
// 23:        }
// 24:    }
// 25:
// 26:    return false;
// 27: }
export function validPalindromeIIBruteTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");

  const isPal = (t: string): boolean => {
    let l = 0, r = t.length - 1;
    while (l < r) {
      if (t[l] !== t[r]) return false;
      l++; r--;
    }
    return true;
  };

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, () => "idle"),
      values: [...codes],
      vars: [{ name: "s", value: `"${s}"`, tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (isPal(s)) {
    pushStep(14, "already palindrome", "ok", `"${s}" is already a palindrome.`);
    done = true;
    steps.push({
      line: 15,
      cells: codes.map(() => "idle"),
      values: [...codes],
      vars: [{ name: "result", value: "true", tone: "ok" }],
      result: "return true",
      resultTone: "ok",
      explanation: `"${s}" is already a palindrome → return true.`,
      done,
    });
    return steps;
  }

  for (let i = 0; i < s.length; i++) {
    const candidate = s.slice(0, i) + s.slice(i + 1);
    pushStep(20, `candidate = "${candidate}"`, "info", `Delete s[${i}] = '${s[i]}' → "${candidate}".`);
    if (isPal(candidate)) {
      pushStep(21, "palindrome!", "ok", `"${candidate}" is a palindrome.`);
      done = true;
      steps.push({
        line: 22,
        cells: codes.map(() => "idle"),
        values: [...codes],
        vars: [{ name: "result", value: "true", tone: "ok" }],
        result: "return true",
        resultTone: "ok",
        explanation: `Deleting '${s[i]}' makes it a palindrome → return true.`,
        done,
      });
      return steps;
    } else {
      pushStep(21, "not palindrome", "fail", `"${candidate}" is not a palindrome.`);
    }
  }

  done = true;
  steps.push({
    line: 26,
    cells: codes.map(() => "idle"),
    values: [...codes],
    vars: [{ name: "result", value: "false", tone: "fail" }],
    result: "return false",
    resultTone: "fail",
    explanation: `No single deletion makes it a palindrome → return false.`,
    done,
  });

  return steps;
}

// Approach 2: Two Pointers (Greedy) — on mismatch, try skipping left or right.
// Source (lines):
// 0: var validPalindrome = function(s) {
// 1:     let left = 0, right = s.length - 1;
// 2:
// 3:     while (left < right) {
// 4:         if (s[left] !== s[right]) {
// 5:             // Mismatch: try skipping left or right character
// 6:             return isPalindrome(s, left + 1, right)
// 7:                 || isPalindrome(s, left, right - 1);
// 8:         }
// 9:         left++;
// 10:        right--;
// 11:    }
// 12:
// 13:    return true;
// 14: }
// 15:
// 16: function isPalindrome(s, left, right) {
// 17:    while (left < right) {
// 18:        if (s[left] !== s[right]) {
// 19:            return false;
// 20:        }
// 21:        left++;
// 22:        right--;
// 23:    }
// 24:    // No mismatch found, already a palindrome
// 25:    return true;
// 26: }
export function validPalindromeIIGreedyTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  let left = 0, right = s.length - 1;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, (idx) => {
        if (idx === left) return "i";
        if (idx === right) return "j";
        return "idle";
      }),
      values: [...codes],
      vars: [
        { name: "left", value: String(left), tone: "info" },
        { name: "right", value: String(right), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  const isPalRange = (l: number, r: number): boolean => {
    while (l < r) {
      if (s[l] !== s[r]) return false;
      l++; r--;
    }
    return true;
  };

  while (left < right) {
    if (s[left] !== s[right]) {
      pushStep(4, `mismatch '${s[left]}' vs '${s[right]}'`, "fail", `s[${left}] = '${s[left]}' ≠ s[${right}] = '${s[right]}' → try skipping one.`);
      const skipLeft = isPalRange(left + 1, right);
      const skipRight = isPalRange(left, right - 1);
      pushStep(6, `skipLeft=${skipLeft}, skipRight=${skipRight}`, "info", `Skip left → ${skipLeft}; skip right → ${skipRight}.`);
      const result = skipLeft || skipRight;
      done = true;
      steps.push({
        line: 7,
        cells: codes.map(() => "idle"),
        values: [...codes],
        vars: [{ name: "result", value: String(result), tone: result ? "ok" : "fail" }],
        result: `return ${result}`,
        resultTone: result ? "ok" : "fail",
        explanation: `Skipping one character ${result ? "makes" : "does not make"} it a palindrome → return ${result}.`,
        done,
      });
      return steps;
    }
    pushStep(4, `match '${s[left]}'`, "ok", `s[${left}] = '${s[left]}' == s[${right}] = '${s[right]}' → continue.`);
    left++;
    right--;
    pushStep(9, `left → ${left}`, "info", `left = ${left}.`);
    pushStep(10, `right → ${right}`, "info", `right = ${right}.`);
  }

  done = true;
  steps.push({
    line: 13,
    cells: codes.map(() => "idle"),
    values: [...codes],
    vars: [{ name: "result", value: "true", tone: "ok" }],
    result: "return true",
    resultTone: "ok",
    explanation: `No mismatch → already a palindrome → return true.`,
    done,
  });

  return steps;
}

// ── Valid Anagram ──────────────────────────────────────────────────────
// Two DISTINCT approaches. Input: s and t as char-code arrays.

// Approach 1: Sorting — sort both strings and compare.
// Source (lines):
// 0: var isAnagram = function(s, t) {
// 1:     if (s.length !== t.length) {
// 2:         return false;
// 3:     }
// 4:
// 5:     // Sort both strings and compare
// 6:     const sortedS = s.split("").sort();
// 7:     const sortedT = t.split("").sort();
// 8:
// 9:     for (let i = 0; i < sortedS.length; i++) {
// 10:        if (sortedS[i] !== sortedT[i]) {
// 11:            return false;
// 12:        }
// 13:    }
// 14:
// 15:    return true;
// 16: }
export function validAnagramSortTrace(sCodes: number[], tCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const t = tCodes.map((c) => String.fromCharCode(c)).join("");

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(tCodes, () => "idle"),
      values: [...tCodes],
      vars: [
        { name: "s", value: `"${s}"`, tone: "info" },
        { name: "t", value: `"${t}"`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (s.length !== t.length) {
    pushStep(1, "lengths differ", "fail", `s.length = ${s.length} ≠ t.length = ${t.length} → return false.`);
    done = true;
    steps.push({
      line: 2,
      cells: tCodes.map(() => "idle"),
      values: [...tCodes],
      vars: [{ name: "result", value: "false", tone: "fail" }],
      result: "return false",
      resultTone: "fail",
      explanation: `Different lengths → cannot be anagrams → return false.`,
      done,
    });
    return steps;
  }

  const sortedS = s.split("").sort();
  const sortedT = t.split("").sort();
  pushStep(6, `sortedS = [${sortedS.join(", ")}]`, "info", `Sorted s → [${sortedS.join(", ")}].`);
  pushStep(7, `sortedT = [${sortedT.join(", ")}]`, "info", `Sorted t → [${sortedT.join(", ")}].`);

  for (let i = 0; i < sortedS.length; i++) {
    if (sortedS[i] !== sortedT[i]) {
      pushStep(10, `mismatch at ${i}`, "fail", `sortedS[${i}] = '${sortedS[i]}' ≠ sortedT[${i}] = '${sortedT[i]}' → return false.`);
      done = true;
      steps.push({
        line: 11,
        cells: tCodes.map(() => "idle"),
        values: [...tCodes],
        vars: [{ name: "result", value: "false", tone: "fail" }],
        result: "return false",
        resultTone: "fail",
        explanation: `Sorted strings differ → not anagrams → return false.`,
        done,
      });
      return steps;
    }
    pushStep(10, `match '${sortedS[i]}'`, "ok", `sortedS[${i}] = sortedT[${i}] = '${sortedS[i]}' → continue.`);
  }

  done = true;
  steps.push({
    line: 15,
    cells: tCodes.map(() => "idle"),
    values: [...tCodes],
    vars: [{ name: "result", value: "true", tone: "ok" }],
    result: "return true",
    resultTone: "ok",
    explanation: `Sorted strings identical → are anagrams → return true.`,
    done,
  });

  return steps;
}

// Approach 2: Hash Map (Frequency Count) — increment for s, decrement for t.
// Source (lines):
// 0: var isAnagram = function(s, t) {
// 1:     if (s.length !== t.length) return false;
// 2:
// 3:     const count = new Array(26).fill(0);
// 4:
// 5:     // Increment for s, decrement for t
// 6:     for (let i = 0; i < s.length; i++) {
// 7:         count[s.charCodeAt(i) - 97]++;
// 8:         count[t.charCodeAt(i) - 97]--;
// 9:     }
// 10:
// 11:    // Check if all counts are zero
// 12:    for (const c of count) {
// 13:        if (c !== 0) return false;
// 14:    }
// 15:
// 16:    return true;
// 17: }
export function validAnagramCountTrace(sCodes: number[], tCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const t = tCodes.map((c) => String.fromCharCode(c)).join("");
  const count = new Array(26).fill(0);

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(tCodes, () => "idle"),
      values: [...tCodes],
      vars: [
        { name: "count", value: `[${count.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (s.length !== t.length) {
    pushStep(1, "lengths differ", "fail", `s.length = ${s.length} ≠ t.length = ${t.length} → return false.`);
    done = true;
    steps.push({
      line: 1,
      cells: tCodes.map(() => "idle"),
      values: [...tCodes],
      vars: [{ name: "result", value: "false", tone: "fail" }],
      result: "return false",
      resultTone: "fail",
      explanation: `Different lengths → cannot be anagrams → return false.`,
      done,
    });
    return steps;
  }

  pushStep(3, "count = [0×26]", "info", "count array of 26 zeros.");

  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
    pushStep(8, `count → [${count.join(", ")}]`, "info", `s[${i}]='${s[i]}' (+1), t[${i}]='${t[i]}' (-1).`);
  }

  for (let i = 0; i < 26; i++) {
    if (count[i] !== 0) {
      pushStep(13, `count[${i}] = ${count[i]}`, "fail", `count[${i}] = ${count[i]} ≠ 0 → return false.`);
      done = true;
      steps.push({
        line: 13,
        cells: tCodes.map(() => "idle"),
        values: [...tCodes],
        vars: [{ name: "result", value: "false", tone: "fail" }],
        result: "return false",
        resultTone: "fail",
        explanation: `Non-zero count → not anagrams → return false.`,
        done,
      });
      return steps;
    }
  }

  done = true;
  steps.push({
    line: 16,
    cells: tCodes.map(() => "idle"),
    values: [...tCodes],
    vars: [{ name: "result", value: "true", tone: "ok" }],
    result: "return true",
    resultTone: "ok",
    explanation: `All counts zero → are anagrams → return true.`,
    done,
  });

  return steps;
}

// ── Rotate String ─────────────────────────────────────────────────────
// Two DISTINCT approaches. Input: s and goal as char-code arrays.

// Approach 1: Brute Force (Try All Rotations).
// Source (lines):
// 0: var rotateString = function(s, goal) {
// 1:     if (s.length !== goal.length) {
// 2:         return false;
// 3:     }
// 4:     // Try every possible rotation
// 5:     for (var k = 0; k < s.length; k++) {
// 6:         // Build the k-th rotation: s[k..n-1] + s[0..k-1]
// 7:         var rotated = s.slice(k) + s.slice(0, k);
// 8:         if (rotated === goal) {
// 9:             return true;
// 10:        }
// 11:    }
// 12:    return false;
// 13: }
export function rotateStringBruteTrace(sCodes: number[], gCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const goal = gCodes.map((c) => String.fromCharCode(c)).join("");

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, () => "idle"),
      values: [...sCodes],
      vars: [
        { name: "s", value: `"${s}"`, tone: "info" },
        { name: "goal", value: `"${goal}"`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (s.length !== goal.length) {
    pushStep(1, "lengths differ", "fail", `s.length = ${s.length} ≠ goal.length = ${goal.length} → return false.`);
    done = true;
    steps.push({
      line: 2,
      cells: sCodes.map(() => "idle"),
      values: [...sCodes],
      vars: [{ name: "result", value: "false", tone: "fail" }],
      result: "return false",
      resultTone: "fail",
      explanation: `Different lengths → rotation impossible → return false.`,
      done,
    });
    return steps;
  }

  for (let k = 0; k < s.length; k++) {
    const rotated = s.slice(k) + s.slice(0, k);
    pushStep(7, `rotated = "${rotated}"`, "info", `Rotation k=${k}: "${rotated}".`);
    if (rotated === goal) {
      pushStep(8, "match!", "ok", `"${rotated}" == "${goal}" → found.`);
      done = true;
      steps.push({
        line: 9,
        cells: sCodes.map(() => "idle"),
        values: [...sCodes],
        vars: [{ name: "result", value: "true", tone: "ok" }],
        result: "return true",
        resultTone: "ok",
        explanation: `Rotation k=${k} equals goal → return true.`,
        done,
      });
      return steps;
    } else {
      pushStep(8, "no match", "fail", `"${rotated}" ≠ "${goal}".`);
    }
  }

  done = true;
  steps.push({
    line: 12,
    cells: sCodes.map(() => "idle"),
    values: [...sCodes],
    vars: [{ name: "result", value: "false", tone: "fail" }],
    result: "return false",
    resultTone: "fail",
    explanation: `No rotation equals goal → return false.`,
    done,
  });

  return steps;
}

// Approach 2: Concatenate and Search — check if goal is substring of s+s.
// Source (lines):
// 0: var rotateString = function(s, goal) {
// 1:     // Different lengths means rotation is impossible
// 2:     if (s.length !== goal.length) {
// 3:         return false;
// 4:     }
// 5:
// 6:     // Every rotation of s appears as a substring of s + s
// 7:     const doubled = s + s;
// 8:
// 9:     if (doubled.includes(goal)) {
// 10:        return true;
// 11:    }
// 12:
// 13:    return false;
// 14: }
export function rotateStringConcatTrace(sCodes: number[], gCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const goal = gCodes.map((c) => String.fromCharCode(c)).join("");

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, () => "idle"),
      values: [...sCodes],
      vars: [
        { name: "s", value: `"${s}"`, tone: "info" },
        { name: "goal", value: `"${goal}"`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (s.length !== goal.length) {
    pushStep(2, "lengths differ", "fail", `s.length = ${s.length} ≠ goal.length = ${goal.length} → return false.`);
    done = true;
    steps.push({
      line: 3,
      cells: sCodes.map(() => "idle"),
      values: [...sCodes],
      vars: [{ name: "result", value: "false", tone: "fail" }],
      result: "return false",
      resultTone: "fail",
      explanation: `Different lengths → rotation impossible → return false.`,
      done,
    });
    return steps;
  }

  const doubled = s + s;
  pushStep(7, `doubled = "${doubled}"`, "info", `doubled = s + s = "${doubled}".`);
  const found = doubled.includes(goal);
  pushStep(9, `includes = ${found}`, found ? "ok" : "fail", `"${doubled}" ${found ? "contains" : "does not contain"} "${goal}".`);
  done = true;
  steps.push({
    line: found ? 10 : 13,
    cells: sCodes.map(() => "idle"),
    values: [...sCodes],
    vars: [{ name: "result", value: String(found), tone: found ? "ok" : "fail" }],
    result: `return ${found}`,
    resultTone: found ? "ok" : "fail",
    explanation: `Goal is ${found ? "" : "not "}a rotation of s → return ${found}.`,
    done,
  });

  return steps;
}

// ── Longest Common Prefix ─────────────────────────────────────────────
// Two DISTINCT approaches. Input: strs as a space-separated string of words
// (char-code array of the whole joined string).

// Approach 1: Vertical Scanning — compare char by char across all strings.
// Source (lines):
// 0: var longestCommonPrefix = function(strs) {
// 1:     if (strs.length === 0) {
// 2:         return "";
// 3:     }
// 4:
// 5:     // Use first string as reference
// 6:     for (let i = 0; i < strs[0].length; i++) {
// 7:         const char = strs[0][i];
// 8:
// 9:         // Check if all strings have this character at position i
// 10:        for (let j = 1; j < strs.length; j++) {
// 11:            if (i >= strs[j].length || strs[j][i] !== char) {
// 12:                return strs[0].substring(0, i);
// 13:            }
// 14:        }
// 15:    }
// 16:
// 17:    // The entire first string is the common prefix
// 18:    return strs[0];
// 19: }
export function longestCommonPrefixVerticalTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const strs = codes.map((c) => String.fromCharCode(c)).join("").split(" ").filter((w) => w.length > 0);

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, () => "idle"),
      values: [...codes],
      vars: [
        { name: "strs", value: `[${strs.map((w) => `"${w}"`).join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (strs.length === 0) {
    pushStep(1, "empty", "fail", "No strings → return empty string.");
    done = true;
    steps.push({
      line: 2,
      cells: codes.map(() => "idle"),
      values: [...codes],
      vars: [{ name: "result", value: '""', tone: "ok" }],
      result: 'return ""',
      resultTone: "ok",
      explanation: `No strings → return "".`,
      done,
    });
    return steps;
  }

  for (let i = 0; i < strs[0].length; i++) {
    const char = strs[0][i];
    pushStep(7, `char = '${char}'`, "info", `Reference char at position ${i} = '${char}'.`);
    for (let j = 1; j < strs.length; j++) {
      if (i >= strs[j].length || strs[j][i] !== char) {
        const prefix = strs[0].substring(0, i);
        pushStep(11, `mismatch at strs[${j}]`, "fail", `strs[${j}] = "${strs[j]}" differs at position ${i} → prefix = "${prefix}".`);
        done = true;
        steps.push({
          line: 12,
          cells: codes.map(() => "idle"),
          values: [...codes],
          vars: [{ name: "result", value: `"${prefix}"`, tone: "ok" }],
          result: `return "${prefix}"`,
          resultTone: "ok",
          explanation: `Common prefix = "${prefix}".`,
          done,
        });
        return steps;
      }
      pushStep(11, `match in strs[${j}]`, "ok", `strs[${j}] has '${char}' at position ${i}.`);
    }
  }

  done = true;
  steps.push({
    line: 18,
    cells: codes.map(() => "idle"),
    values: [...codes],
    vars: [{ name: "result", value: `"${strs[0]}"`, tone: "ok" }],
    result: `return "${strs[0]}"`,
    resultTone: "ok",
    explanation: `Entire first string "${strs[0]}" is the common prefix.`,
    done,
  });

  return steps;
}

// Approach 2: Sorting — sort, compare first and last strings.
// Source (lines):
// 0: var longestCommonPrefix = function(strs) {
// 1:     if (strs.length === 0) {
// 2:         return "";
// 3:     }
// 4:
// 5:     // Sort so first and last strings are most different
// 6:     strs.sort();
// 7:     const first = strs[0];
// 8:     const last = strs[strs.length - 1];
// 9:
// 10:    let i = 0;
// 11:    const limit = Math.min(first.length, last.length);
// 12:    while (i < limit && first[i] === last[i]) {
// 13:        i++;
// 14:    }
// 15:
// 16:    return first.slice(0, i);
// 17: }
export function longestCommonPrefixSortTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const strs = codes.map((c) => String.fromCharCode(c)).join("").split(" ").filter((w) => w.length > 0);

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, () => "idle"),
      values: [...codes],
      vars: [
        { name: "strs", value: `[${strs.map((w) => `"${w}"`).join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (strs.length === 0) {
    pushStep(1, "empty", "fail", "No strings → return empty string.");
    done = true;
    steps.push({
      line: 2,
      cells: codes.map(() => "idle"),
      values: [...codes],
      vars: [{ name: "result", value: '""', tone: "ok" }],
      result: 'return ""',
      resultTone: "ok",
      explanation: `No strings → return "".`,
      done,
    });
    return steps;
  }

  const sorted = [...strs].sort();
  pushStep(6, `sorted = [${sorted.map((w) => `"${w}"`).join(", ")}]`, "info", `Sorted strings → [${sorted.map((w) => `"${w}"`).join(", ")}].`);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  pushStep(7, `first = "${first}"`, "info", `first = "${first}".`);
  pushStep(8, `last = "${last}"`, "info", `last = "${last}".`);

  let i = 0;
  const limit = Math.min(first.length, last.length);
  while (i < limit && first[i] === last[i]) {
    i++;
    pushStep(13, `i → ${i}`, "ok", `first[${i - 1}] = last[${i - 1}] = '${first[i - 1]}' → i = ${i}.`);
  }

  const prefix = first.slice(0, i);
  done = true;
  steps.push({
    line: 16,
    cells: codes.map(() => "idle"),
    values: [...codes],
    vars: [{ name: "result", value: `"${prefix}"`, tone: "ok" }],
    result: `return "${prefix}"`,
    resultTone: "ok",
    explanation: `Common prefix of first and last = "${prefix}".`,
    done,
  });

  return steps;
}

// ── Longest Palindrome ────────────────────────────────────────────────
// Two DISTINCT approaches. Input: s as char-code array.

// Approach 1: Greedy with Hash Map — count frequencies, use even parts.
// Source (lines):
// 0: var longestPalindrome = function(s) {
// 1:     const counts = new Map();
// 2:     for (const c of s) {
// 3:         counts.set(c, (counts.get(c) || 0) + 1);
// 4:     }
// 5:
// 6:     let length = 0;
// 7:     let hasOdd = false;
// 8:     for (const count of counts.values()) {
// 9:         // Use the largest even number <= count
// 10:        length += Math.floor(count / 2) * 2;
// 11:        if (count % 2 === 1) {
// 12:            hasOdd = true;
// 13:        }
// 14:    }
// 15:
// 16:    // Place one odd character in the center if available
// 17:    if (hasOdd) {
// 18:        length += 1;
// 19:    }
// 20:
// 21:    return length;
// 22: }
export function longestPalindromeGreedyTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  const counts = new Map<string, number>();
  for (const c of s) counts.set(c, (counts.get(c) || 0) + 1);

  let length = 0;
  let hasOdd = false;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, () => "idle"),
      values: [...codes],
      vars: [
        { name: "counts", value: `{${Array.from(counts.entries()).map(([k, v]) => `'${k}':${v}`).join(", ")}}`, tone: "info" },
        { name: "length", value: String(length), tone: "ok" },
        { name: "hasOdd", value: String(hasOdd), tone: hasOdd ? "ok" : "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, "counts built", "info", `Counted frequencies: {${Array.from(counts.entries()).map(([k, v]) => `'${k}':${v}`).join(", ")}}.`);

  for (const count of counts.values()) {
    length += Math.floor(count / 2) * 2;
    pushStep(10, `length → ${length}`, "ok", `count = ${count} → add ${Math.floor(count / 2) * 2} → length = ${length}.`);
    if (count % 2 === 1) {
      hasOdd = true;
      pushStep(12, "hasOdd = true", "info", `count = ${count} is odd → hasOdd = true.`);
    }
  }

  if (hasOdd) {
    length += 1;
    pushStep(18, `length → ${length}`, "ok", `hasOdd → add 1 for center → length = ${length}.`);
  }

  done = true;
  steps.push({
    line: 21,
    cells: codes.map(() => "idle"),
    values: [...codes],
    vars: [{ name: "result", value: String(length), tone: "ok" }],
    result: `return ${length}`,
    resultTone: "ok",
    explanation: `Longest palindrome length = ${length}.`,
    done,
  });

  return steps;
}

// Approach 2: Optimal (Single Pass with Set) — pair chars as we scan.
// Source (lines):
// 0: var longestPalindrome = function(s) {
// 1:     const oddChars = new Set();
// 2:     let length = 0;
// 3:     for (const c of s) {
// 4:         if (oddChars.has(c)) {
// 5:             // Pair completed, add 2 to length
// 6:             oddChars.delete(c);
// 7:             length += 2;
// 8:         } else {
// 9:             // First of a potential pair
// 10:            oddChars.add(c);
// 11:        }
// 12:    }
// 13:    // If any unpaired characters remain, one can go in the center
// 14:    if (oddChars.size > 0) {
// 15:        length++;
// 16:    }
// 17:    return length;
// 18: }
export function longestPalindromeSetTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  const oddChars = new Set<string>();
  let length = 0;

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, (i) => (i === idx ? "i" : "idle")),
      values: [...codes],
      vars: [
        { name: "oddChars", value: `{${[...oddChars].join(", ")}}`, tone: "info" },
        { name: "length", value: String(length), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, -1, "length = 0", "info", "length = 0.");

  for (let idx = 0; idx < s.length; idx++) {
    const c = s[idx];
    if (oddChars.has(c)) {
      oddChars.delete(c);
      length += 2;
      pushStep(7, idx, `length → ${length}`, "ok", `'${c}' completes a pair → length = ${length}.`);
    } else {
      oddChars.add(c);
      pushStep(10, idx, `add '${c}'`, "info", `'${c}' is unpaired → add to set.`);
    }
  }

  if (oddChars.size > 0) {
    length++;
    pushStep(15, -1, `length → ${length}`, "ok", `${oddChars.size} unpaired char(s) → one goes in center → length = ${length}.`);
  }

  done = true;
  steps.push({
    line: 17,
    cells: codes.map(() => "idle"),
    values: [...codes],
    vars: [{ name: "result", value: String(length), tone: "ok" }],
    result: `return ${length}`,
    resultTone: "ok",
    explanation: `Longest palindrome length = ${length}.`,
    done,
  });

  return steps;
}

// ── Find the Index of the First Occurrence in a String ───────────────
// Two DISTINCT approaches. Input: haystack and needle as char-code arrays.

// Approach 1: Brute Force — try each starting position.
// Source (lines):
// 0: var strStr = function(haystack, needle) {
// 1:     const n = haystack.length;
// 2:     const m = needle.length;
// 3:
// 4:     // Try each possible starting position
// 5:     for (let i = 0; i <= n - m; i++) {
// 6:         let j = 0;
// 7:         // Compare needle with haystack starting at position i
// 8:         while (j < m && haystack[i + j] === needle[j]) {
// 9:             j++;
// 10:        }
// 11:        // If we matched all characters of needle, return the start
// 12:        if (j === m) {
// 13:            return i;
// 14:        }
// 15:    }
// 16:
// 17:    return -1;
// 18: }
export function strStrBruteTrace(hCodes: number[], nCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const haystack = hCodes.map((c) => String.fromCharCode(c)).join("");
  const needle = nCodes.map((c) => String.fromCharCode(c)).join("");
  const n = haystack.length;
  const m = needle.length;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(hCodes, (idx) => {
        if (idx === i + j) return "j";
        if (idx === i) return "i";
        return "idle";
      }),
      values: [...hCodes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "needle", value: `"${needle}"`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, -1, `n = ${n}`, "info", `n = ${n}.`);
  pushStep(2, -1, -1, `m = ${m}`, "info", `m = ${m}.`);

  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    pushStep(6, i, j, `start at ${i}`, "info", `Try matching needle at position ${i}.`);
    while (j < m && haystack[i + j] === needle[j]) {
      j++;
      pushStep(9, i, j, `j → ${j}`, "ok", `haystack[${i + j - 1}] = '${haystack[i + j - 1]}' matches needle[${j - 1}] → j = ${j}.`);
    }
    if (j === m) {
      pushStep(12, i, j, "full match!", "ok", `Matched all ${m} chars at position ${i}.`);
      done = true;
      steps.push({
        line: 13,
        cells: hCodes.map(() => "idle"),
        values: [...hCodes],
        vars: [{ name: "result", value: String(i), tone: "ok" }],
        result: `return ${i}`,
        resultTone: "ok",
        explanation: `Needle found at index ${i} → return ${i}.`,
        done,
      });
      return steps;
    } else {
      pushStep(12, i, j, "mismatch", "fail", `Mismatch at j = ${j} → try next start.`);
    }
  }

  done = true;
  steps.push({
    line: 17,
    cells: hCodes.map(() => "idle"),
    values: [...hCodes],
    vars: [{ name: "result", value: "-1", tone: "fail" }],
    result: "return -1",
    resultTone: "fail",
    explanation: `Needle not found → return -1.`,
    done,
  });

  return steps;
}

// Approach 2: Rabin-Karp (Rolling Hash).
// Source (lines):
// 0: var strStr = function(haystack, needle) {
// 1:     const n = haystack.length;
// 2:     const m = needle.length;
// 3:     if (m > n) {
// 4:         return -1;
// 5:     }
// 6:
// 7:     const BASE = 26n;
// 8:     const MOD = 1000000007n;
// 9:
// 10:    // power = BASE^(m-1) mod MOD, the weight of the leftmost character
// 11:    let power = 1n;
// 12:    for (let k = 0; k < m - 1; k++) {
// 13:        power = (power * BASE) % MOD;
// 14:    }
// 15:
// 16:    // Compute the hash of the needle and of the first window
// 17:    let needleHash = 0n;
// 18:    let windowHash = 0n;
// 19:    for (let k = 0; k < m; k++) {
// 20:        needleHash = (needleHash * BASE + BigInt(needle.charCodeAt(k) - 97)) % MOD;
// 21:        windowHash = (windowHash * BASE + BigInt(haystack.charCodeAt(k) - 97)) % MOD;
// 22:    }
// 23:
// 24:    for (let i = 0; i <= n - m; i++) {
// 25:        // Hash match is only a hint, verify the characters
// 26:        if (windowHash === needleHash && haystack.slice(i, i + m) === needle) {
// 27:            return i;
// 28:        }
// 29:        // Roll the hash forward to the next window
// 30:        if (i < n - m) {
// 31:            windowHash = (((windowHash - BigInt(haystack.charCodeAt(i) - 97) * power) % MOD) + MOD) % MOD;
// 32:            windowHash = (windowHash * BASE + BigInt(haystack.charCodeAt(i + m) - 97)) % MOD;
// 33:        }
// 34:    }
// 35:
// 36:    return -1;
// 37: }
export function strStrRabinKarpTrace(hCodes: number[], nCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const haystack = hCodes.map((c) => String.fromCharCode(c)).join("");
  const needle = nCodes.map((c) => String.fromCharCode(c)).join("");
  const n = haystack.length;
  const m = needle.length;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(hCodes, (idx) => (idx === i ? "i" : "idle")),
      values: [...hCodes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "needle", value: `"${needle}"`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (m > n) {
    pushStep(3, -1, "m > n", "fail", `m = ${m} > n = ${n} → return -1.`);
    done = true;
    steps.push({
      line: 4,
      cells: hCodes.map(() => "idle"),
      values: [...hCodes],
      vars: [{ name: "result", value: "-1", tone: "fail" }],
      result: "return -1",
      resultTone: "fail",
      explanation: `Needle longer than haystack → return -1.`,
      done,
    });
    return steps;
  }

  const BASE = BigInt(26);
  const MOD = BigInt(1000000007);
  let power = BigInt(1);
  for (let k = 0; k < m - 1; k++) power = (power * BASE) % MOD;
  let needleHash = BigInt(0);
  let windowHash = BigInt(0);
  for (let k = 0; k < m; k++) {
    needleHash = (needleHash * BASE + BigInt(needle.charCodeAt(k) - 97)) % MOD;
    windowHash = (windowHash * BASE + BigInt(haystack.charCodeAt(k) - 97)) % MOD;
  }
  pushStep(22, -1, `needleHash = ${needleHash}`, "info", `Computed needle hash and first window hash.`);

  for (let i = 0; i <= n - m; i++) {
    if (windowHash === needleHash && haystack.slice(i, i + m) === needle) {
      pushStep(26, i, "hash + chars match!", "ok", `Window at ${i} matches needle.`);
      done = true;
      steps.push({
        line: 27,
        cells: hCodes.map(() => "idle"),
        values: [...hCodes],
        vars: [{ name: "result", value: String(i), tone: "ok" }],
        result: `return ${i}`,
        resultTone: "ok",
        explanation: `Needle found at index ${i} → return ${i}.`,
        done,
      });
      return steps;
    }
    if (i < n - m) {
      windowHash = (((windowHash - BigInt(haystack.charCodeAt(i) - 97) * power) % MOD) + MOD) % MOD;
      windowHash = (windowHash * BASE + BigInt(haystack.charCodeAt(i + m) - 97)) % MOD;
      pushStep(32, i, `roll → windowHash = ${windowHash}`, "info", `Rolled hash to window starting at ${i + 1}.`);
    }
  }

  done = true;
  steps.push({
    line: 36,
    cells: hCodes.map(() => "idle"),
    values: [...hCodes],
    vars: [{ name: "result", value: "-1", tone: "fail" }],
    result: "return -1",
    resultTone: "fail",
    explanation: `Needle not found → return -1.`,
    done,
  });

  return steps;
}

// ── Zigzag Conversion ─────────────────────────────────────────────────
// Two DISTINCT approaches. Input: s as char-code array, numRows as number.

// Approach 1: Simulation with 2D Grid.
// Source (lines):
// 0: var convert = function (s, numRows) {
// 1:     if (numRows === 1 || numRows >= s.length) return s;
// 2:
// 3:     const grid = Array.from({ length: numRows }, () => new Array(s.length).fill(''));
// 4:     let row = 0, col = 0;
// 5:     let goingDown = true;
// 6:
// 7:     for (let i = 0; i < s.length; i++) {
// 8:         grid[row][col] = s[i];
// 9:
// 10:        if (goingDown) {
// 11:            if (row === numRows - 1) {
// 12:                // Switch to diagonal up-right
// 13:                row--;
// 14:                col++;
// 15:                goingDown = false;
// 16:            } else {
// 17:                row++;
// 18:            }
// 19:        } else {
// 20:            if (row === 0) {
// 21:                // Switch back to going down
// 22:                row++;
// 23:                goingDown = true;
// 24:            } else {
// 25:                row--;
// 26:                col++;
// 27:            }
// 28:        }
// 29:    }
// 30:
// 31:    let result = '';
// 32:    for (let r = 0; r < numRows; r++) {
// 33:        for (let c = 0; c < s.length; c++) {
// 34:            if (grid[r][c] !== '') {
// 35:                result += grid[r][c];
// 36:            }
// 37:        }
// 38:    }
// 39:    return result;
// 40: }
export function zigzagGridTrace(codes: number[], numRows: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  const rows = Math.max(1, numRows);

  if (rows === 1 || rows >= s.length) {
    done = true;
    steps.push({ line: 1, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: `"${s}"`, tone: "ok" }], result: `return "${s}"`, resultTone: "ok", explanation: `numRows = ${rows} → return s unchanged.`, done });
    return steps;
  }

  const grid: string[][] = Array.from({ length: rows }, () => new Array(s.length).fill(""));
  let row = 0, col = 0;
  let goingDown = true;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, () => "idle"),
      values: [...codes],
      vars: [
        { name: "row", value: String(row), tone: "info" },
        { name: "col", value: String(col), tone: "info" },
        { name: "goingDown", value: String(goingDown), tone: goingDown ? "ok" : "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < s.length; i++) {
    grid[row][col] = s[i];
    pushStep(8, `place '${s[i]}' at (${row},${col})`, "ok", `Place '${s[i]}' at grid[${row}][${col}].`);
    if (goingDown) {
      if (row === rows - 1) {
        row--; col++; goingDown = false;
        pushStep(15, "switch up-right", "info", `At bottom row → move up-right, goingDown = false.`);
      } else {
        row++;
        pushStep(17, `row → ${row}`, "info", `Move down → row = ${row}.`);
      }
    } else {
      if (row === 0) {
        row++; goingDown = true;
        pushStep(23, "switch down", "info", `At top row → move down, goingDown = true.`);
      } else {
        row--; col++;
        pushStep(26, `row → ${row}, col → ${col}`, "info", `Move up-right → row = ${row}, col = ${col}.`);
      }
    }
  }

  let result = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < s.length; c++) {
      if (grid[r][c] !== "") result += grid[r][c];
    }
  }

  done = true;
  steps.push({
    line: 39,
    cells: codes.map(() => "idle"),
    values: [...codes],
    vars: [{ name: "result", value: `"${result}"`, tone: "ok" }],
    result: `return "${result}"`,
    resultTone: "ok",
    explanation: `Read rows → "${result}".`,
    done,
  });

  return steps;
}

// Approach 2: Row-by-Row Collection.
// Source (lines):
// 0: var convert = function (s, numRows) {
// 1:     if (numRows === 1 || numRows >= s.length) {
// 2:         return s;
// 3:     }
// 4:
// 5:     const rows = new Array(numRows).fill('');
// 6:     let currentRow = 0;
// 7:     let goingDown = false;
// 8:
// 9:     for (const char of s) {
// 10:        rows[currentRow] += char;
// 11:        // Flip direction at top and bottom rows
// 12:        if (currentRow === 0 || currentRow === numRows - 1) {
// 13:            goingDown = !goingDown;
// 14:        }
// 15:        currentRow += goingDown ? 1 : -1;
// 16:    }
// 17:
// 18:    return rows.join('');
// 19: }
export function zigzagRowsTrace(codes: number[], numRows: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  const rows = Math.max(1, numRows);

  if (rows === 1 || rows >= s.length) {
    done = true;
    steps.push({ line: 2, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: `"${s}"`, tone: "ok" }], result: `return "${s}"`, resultTone: "ok", explanation: `numRows = ${rows} → return s unchanged.`, done });
    return steps;
  }

  const rowStrs = new Array(rows).fill("");
  let currentRow = 0;
  let goingDown = false;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, () => "idle"),
      values: [...codes],
      vars: [
        { name: "currentRow", value: String(currentRow), tone: "info" },
        { name: "goingDown", value: String(goingDown), tone: goingDown ? "ok" : "info" },
        { name: "rows", value: `[${rowStrs.map((r) => `"${r}"`).join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (const char of s) {
    rowStrs[currentRow] += char;
    pushStep(10, `append '${char}' to row ${currentRow}`, "ok", `rows[${currentRow}] = "${rowStrs[currentRow]}".`);
    if (currentRow === 0 || currentRow === rows - 1) {
      goingDown = !goingDown;
      pushStep(13, `goingDown → ${goingDown}`, "info", `At boundary row → flip direction.`);
    }
    currentRow += goingDown ? 1 : -1;
    pushStep(15, `currentRow → ${currentRow}`, "info", `currentRow = ${currentRow}.`);
  }

  const result = rowStrs.join("");
  done = true;
  steps.push({
    line: 18,
    cells: codes.map(() => "idle"),
    values: [...codes],
    vars: [{ name: "result", value: `"${result}"`, tone: "ok" }],
    result: `return "${result}"`,
    resultTone: "ok",
    explanation: `Join rows → "${result}".`,
    done,
  });

  return steps;
}

// ── Reverse Words in a String ─────────────────────────────────────────
// Two DISTINCT approaches. Input: s as char-code array.

// Approach 1: Split and Reverse (Built-in Functions).
// Source (lines):
// 0: var reverseWords = function(s) {
// 1:     // Split by one or more spaces
// 2:     const words = s.split(/\s+/).filter((w) => w.length > 0);
// 3:     // Reverse the array of words
// 4:     words.reverse();
// 5:     return words.join(" ");
// 6: }
export function reverseWordsSplitTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  const words = s.split(/\s+/).filter((w) => w.length > 0);

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, () => "idle"),
      values: [...codes],
      vars: [{ name: "words", value: `[${words.map((w) => `"${w}"`).join(", ")}]`, tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, `words = [${words.map((w) => `"${w}"`).join(", ")}]`, "info", `Split "${s}" → ${words.length} word(s).`);
  words.reverse();
  pushStep(4, `reversed = [${words.map((w) => `"${w}"`).join(", ")}]`, "info", `Reversed word order.`);
  const result = words.join(" ");
  done = true;
  steps.push({
    line: 5,
    cells: codes.map(() => "idle"),
    values: [...codes],
    vars: [{ name: "result", value: `"${result}"`, tone: "ok" }],
    result: `return "${result}"`,
    resultTone: "ok",
    explanation: `Joined reversed words → "${result}".`,
    done,
  });

  return steps;
}

// Approach 2: Two Pointers (Reverse Traversal).
// Source (lines):
// 0: var reverseWords = function(s) {
// 1:     const result = [];
// 2:     let i = s.length - 1;
// 3:     while (i >= 0) {
// 4:         // Skip spaces
// 5:         while (i >= 0 && s[i] === ' ') {
// 6:             i--;
// 7:         }
// 8:         if (i < 0) {
// 9:             break;
// 10:        }
// 11:        // Find start of word
// 12:        let j = i;
// 13:        while (j >= 0 && s[j] !== ' ') {
// 14:            j--;
// 15:        }
// 16:        // Append word to result
// 17:        result.push(s.slice(j + 1, i + 1));
// 18:        i = j;
// 19:    }
// 20:    return result.join(" ");
// 21: }
export function reverseWordsTwoPointerTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  const result: string[] = [];
  let i = s.length - 1;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, (idx) => (idx === i ? "i" : "idle")),
      values: [...codes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "result", value: `[${result.map((w) => `"${w}"`).join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, `i = ${i}`, "info", `i = s.length - 1 = ${i}.`);

  while (i >= 0) {
    while (i >= 0 && s[i] === " ") {
      pushStep(5, `skip space at ${i}`, "fail", `s[${i}] is a space → skip.`);
      i--;
      pushStep(6, `i → ${i}`, "info", `i = ${i}.`);
    }
    if (i < 0) {
      pushStep(8, "done", "info", `i < 0 → no more words.`);
      break;
    }
    let j = i;
    pushStep(12, `j = ${j}`, "info", `j = i = ${j}.`);
    while (j >= 0 && s[j] !== " ") {
      j--;
      pushStep(14, `j → ${j}`, "info", `j = ${j}.`);
    }
    const word = s.slice(j + 1, i + 1);
    result.push(word);
    pushStep(17, `push "${word}"`, "ok", `Extracted word "${word}" → result = [${result.map((w) => `"${w}"`).join(", ")}].`);
    i = j;
    pushStep(18, `i → ${i}`, "info", `i = ${i}.`);
  }

  const joined = result.join(" ");
  done = true;
  steps.push({
    line: 20,
    cells: codes.map(() => "idle"),
    values: [...codes],
    vars: [{ name: "result", value: `"${joined}"`, tone: "ok" }],
    result: `return "${joined}"`,
    resultTone: "ok",
    explanation: `Joined reversed words → "${joined}".`,
    done,
  });

  return steps;
}

// ── Single Number ──────────────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Brute Force (Nested Loops) — for each element, scan for a duplicate.
// Source (lines):
// 0: var singleNumber = function(nums) {
// 1:     for (var i = 0; i < nums.length; i++) {
// 2:         var foundDuplicate = false;
// 3:         for (var j = 0; j < nums.length; j++) {
// 4:             if (i !== j && nums[i] === nums[j]) {
// 5:                 foundDuplicate = true;
// 6:                 break;
// 7:             }
// 8:         }
// 9:         if (!foundDuplicate) {
// 10:            return nums[i];
// 11:        }
// 12:    }
// 13:    return -1; // unreachable given problem constraints
// 14: };
export function singleNumberBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    let foundDuplicate = false;
    pushStep(2, i, -1, `check nums[${i}] = ${nums[i]}`, "info", `Check if nums[${i}] = ${nums[i]} has a duplicate.`);
    for (let j = 0; j < nums.length; j++) {
      if (i !== j && nums[i] === nums[j]) {
        foundDuplicate = true;
        pushStep(5, i, j, "duplicate found", "fail", `nums[${j}] = ${nums[j]} equals nums[${i}] → duplicate.`);
        break;
      }
      pushStep(4, i, j, "no match", "info", `nums[${j}] = ${nums[j]} ≠ nums[${i}].`);
    }
    if (!foundDuplicate) {
      pushStep(9, i, -1, `single = ${nums[i]}`, "ok", `nums[${i}] = ${nums[i]} has no duplicate → it is the single number.`);
      done = true;
      steps.push({
        line: 10,
        cells: nums.map(() => "idle"),
        vars: [{ name: "result", value: String(nums[i]), tone: "ok" }],
        result: `return ${nums[i]}`,
        resultTone: "ok",
        explanation: `Single number = ${nums[i]}.`,
        done,
      });
      return steps;
    }
  }

  done = true;
  steps.push({
    line: 13,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: "-1", tone: "fail" }],
    result: "return -1",
    resultTone: "fail",
    explanation: `No single number found (unreachable).`,
    done,
  });

  return steps;
}

// Approach 2: Hash Map (Count Occurrences) — count, then find count === 1.
// Source (lines):
// 0: var singleNumber = function(nums) {
// 1:     var countMap = new Map();
// 2:     // Count occurrences of each number
// 3:     for (var i = 0; i < nums.length; i++) {
// 4:         countMap.set(nums[i], (countMap.get(nums[i]) || 0) + 1);
// 5:     }
// 6:     // Find the number that appears exactly once
// 7:     for (var [num, count] of countMap) {
// 8:         if (count === 1) {
// 9:             return num;
// 10:        }
// 11:    }
// 12:    return -1; // unreachable given problem constraints
// 13: };
export function singleNumberHashMapTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const countMap = new Map<number, number>();

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "countMap", value: `{${Array.from(countMap.entries()).map(([k, v]) => `${k}:${v}`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, "countMap = {}", "info", "countMap = {} (empty).");

  for (let i = 0; i < nums.length; i++) {
    countMap.set(nums[i], (countMap.get(nums[i]) || 0) + 1);
    pushStep(4, i, `countMap → {${Array.from(countMap.entries()).map(([k, v]) => `${k}:${v}`).join(", ")}}`, "info", `Increment count of ${nums[i]} → ${countMap.get(nums[i])}.`);
  }

  for (const [num, count] of countMap) {
    if (count === 1) {
      pushStep(8, -1, `count(${num}) = 1`, "ok", `${num} appears exactly once.`);
      done = true;
      steps.push({
        line: 9,
        cells: nums.map(() => "idle"),
        vars: [{ name: "result", value: String(num), tone: "ok" }],
        result: `return ${num}`,
        resultTone: "ok",
        explanation: `Single number = ${num}.`,
        done,
      });
      return steps;
    }
    pushStep(8, -1, `count(${num}) = ${count}`, "fail", `${num} appears ${count} times → not single.`);
  }

  done = true;
  steps.push({
    line: 12,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: "-1", tone: "fail" }],
    result: "return -1",
    resultTone: "fail",
    explanation: `No single number found (unreachable).`,
    done,
  });

  return steps;
}

// ── Missing Number ─────────────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Hash Set — store all numbers, check which in [0, n] is missing.
// Source (lines):
// 0: var missingNumber = function(nums) {
// 1:     var n = nums.length;
// 2:     var numSet = new Set(nums);
// 3:
// 4:     // Check which number in [0, n] is missing
// 5:     for (var i = 0; i <= n; i++) {
// 6:         if (!numSet.has(i)) {
// 7:             return i;
// 8:         }
// 9:     }
// 10:
// 11:    return -1; // Should never reach here
// 12: };
export function missingNumberHashSetTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;
  const numSet = new Set(nums);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "numSet", value: `{${[...numSet].join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, `n = ${n}`, "info", `n = ${n}.`);
  pushStep(2, -1, `numSet = {${[...numSet].join(", ")}}`, "info", `Stored all numbers in a set.`);

  for (let i = 0; i <= n; i++) {
    if (!numSet.has(i)) {
      pushStep(6, -1, `return ${i}`, "ok", `${i} is not in the set → it is the missing number.`);
      done = true;
      steps.push({
        line: 7,
        cells: nums.map(() => "idle"),
        vars: [{ name: "result", value: String(i), tone: "ok" }],
        result: `return ${i}`,
        resultTone: "ok",
        explanation: `Missing number = ${i}.`,
        done,
      });
      return steps;
    } else {
      pushStep(6, -1, `${i} present`, "info", `${i} is in the set → continue.`);
    }
  }

  done = true;
  steps.push({
    line: 11,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: "-1", tone: "fail" }],
    result: "return -1",
    resultTone: "fail",
    explanation: `No missing number found (should never happen).`,
    done,
  });

  return steps;
}

// Approach 2: Gauss' Formula (Sum) — expected sum minus actual sum.
// Source (lines):
// 0: var missingNumber = function(nums) {
// 1:     var n = nums.length;
// 2:     var expectedSum = n * (n + 1) / 2;
// 3:     var actualSum = 0;
// 4:
// 5:     for (var i = 0; i < n; i++) {
// 6:         actualSum += nums[i];
// 7:     }
// 8:
// 9:     return expectedSum - actualSum;
// 10: };
export function missingNumberGaussTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  let actualSum = 0;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "expectedSum", value: String(expectedSum), tone: "ok" },
        { name: "actualSum", value: String(actualSum), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, `n = ${n}`, "info", `n = ${n}.`);
  pushStep(2, -1, `expectedSum = ${expectedSum}`, "info", `expectedSum = n*(n+1)/2 = ${expectedSum}.`);
  pushStep(3, -1, "actualSum = 0", "info", "actualSum = 0.");

  for (let i = 0; i < n; i++) {
    actualSum += nums[i];
    pushStep(6, i, `actualSum → ${actualSum}`, "ok", `Add nums[${i}] = ${nums[i]} → actualSum = ${actualSum}.`);
  }

  const result = expectedSum - actualSum;
  done = true;
  steps.push({
    line: 9,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: String(result), tone: "ok" }],
    result: `return ${result}`,
    resultTone: "ok",
    explanation: `Missing number = expectedSum - actualSum = ${expectedSum} - ${actualSum} = ${result}.`,
    done,
  });

  return steps;
}

// ── Set Mismatch ──────────────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Sorting — sort, then find duplicate and gap.
// Source (lines):
// 0: var findErrorNums = function(nums) {
// 1:     nums.sort(function(a, b) { return a - b; });
// 2:     var n = nums.length;
// 3:     var duplicate = -1, missing = -1;
// 4:
// 5:     // Check if 1 is missing
// 6:     if (nums[0] !== 1) {
// 7:         missing = 1;
// 8:     }
// 9:
// 10:    for (var i = 1; i < n; i++) {
// 11:        if (nums[i] === nums[i - 1]) {
// 12:            duplicate = nums[i];
// 13:        } else if (nums[i] > nums[i - 1] + 1) {
// 14:            missing = nums[i - 1] + 1;
// 15:        }
// 16:    }
// 17:
// 18:    // If missing is still not found, it must be n
// 19:    if (missing === -1) {
// 20:        missing = n;
// 21:    }
// 22:
// 23:    return [duplicate, missing];
// 24: };
export function setMismatchSortTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums].sort((a, b) => a - b);
  const n = working.length;
  let duplicate = -1, missing = -1;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => (idx === i ? "i" : "idle")),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "duplicate", value: String(duplicate), tone: duplicate >= 0 ? "fail" : "info" },
        { name: "missing", value: String(missing), tone: missing >= 0 ? "ok" : "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, `sorted = [${working.join(", ")}]`, "info", `Sorted → [${working.join(", ")}].`);

  if (working[0] !== 1) {
    missing = 1;
    pushStep(7, 0, "missing = 1", "ok", `nums[0] = ${working[0]} ≠ 1 → missing = 1.`);
  }

  for (let i = 1; i < n; i++) {
    if (working[i] === working[i - 1]) {
      duplicate = working[i];
      pushStep(12, i, `duplicate = ${duplicate}`, "fail", `nums[${i}] = ${working[i]} equals nums[${i - 1}] → duplicate.`);
    } else if (working[i] > working[i - 1] + 1) {
      missing = working[i - 1] + 1;
      pushStep(14, i, `missing = ${missing}`, "ok", `Gap between ${working[i - 1]} and ${working[i]} → missing = ${missing}.`);
    }
  }

  if (missing === -1) {
    missing = n;
    pushStep(20, -1, `missing = ${n}`, "ok", `No gap found → missing = n = ${n}.`);
  }

  done = true;
  steps.push({
    line: 23,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "result", value: `[${duplicate}, ${missing}]`, tone: "ok" }],
    result: `[${duplicate}, ${missing}]`,
    resultTone: "ok",
    explanation: `Duplicate = ${duplicate}, missing = ${missing}.`,
    done,
  });

  return steps;
}

// Approach 2: Hash Map Counting — count occurrences, find count 2 and count 0.
// Source (lines):
// 0: var findErrorNums = function(nums) {
// 1:     var n = nums.length;
// 2:     var countMap = new Map();
// 3:     var duplicate = -1, missing = -1;
// 4:
// 5:     // Count occurrences of each number
// 6:     for (var i = 0; i < n; i++) {
// 7:         countMap.set(nums[i], (countMap.get(nums[i]) || 0) + 1);
// 8:     }
// 9:
// 10:    // Find the duplicate (count 2) and missing (count 0)
// 11:    for (var i = 1; i <= n; i++) {
// 12:        var count = countMap.get(i) || 0;
// 13:        if (count === 2) {
// 14:            duplicate = i;
// 15:        } else if (count === 0) {
// 16:            missing = i;
// 17:        }
// 18:    }
// 19:
// 20:    return [duplicate, missing];
// 21: };
export function setMismatchHashMapTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;
  const countMap = new Map<number, number>();
  let duplicate = -1, missing = -1;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "countMap", value: `{${Array.from(countMap.entries()).map(([k, v]) => `${k}:${v}`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < n; i++) {
    countMap.set(nums[i], (countMap.get(nums[i]) || 0) + 1);
    pushStep(7, i, `countMap → {${Array.from(countMap.entries()).map(([k, v]) => `${k}:${v}`).join(", ")}}`, "info", `Increment count of ${nums[i]} → ${countMap.get(nums[i])}.`);
  }

  for (let i = 1; i <= n; i++) {
    const count = countMap.get(i) || 0;
    if (count === 2) {
      duplicate = i;
      pushStep(14, -1, `duplicate = ${i}`, "fail", `${i} appears twice → duplicate.`);
    } else if (count === 0) {
      missing = i;
      pushStep(16, -1, `missing = ${i}`, "ok", `${i} appears zero times → missing.`);
    }
  }

  done = true;
  steps.push({
    line: 20,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: `[${duplicate}, ${missing}]`, tone: "ok" }],
    result: `[${duplicate}, ${missing}]`,
    resultTone: "ok",
    explanation: `Duplicate = ${duplicate}, missing = ${missing}.`,
    done,
  });

  return steps;
}

// ── Power of Two ──────────────────────────────────────────────────────
// Two DISTINCT approaches. Input is a single integer n (passed as nums[0]).

// Approach 1: Iterative Division — divide by 2 until 1 or odd.
// Source (lines):
// 0: var isPowerOfTwo = function (n) {
// 1:   if (n <= 0) return false;
// 2:
// 3:   // Keep dividing by 2 until we reach 1 or find an odd number
// 4:   while (n > 1) {
// 5:     if (n % 2 !== 0) return false;
// 6:     n = Math.floor(n / 2);
// 7:   }
// 8:
// 9:   return true;
// 10: };
export function powerOfTwoIterativeTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let n = nums[0];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      values: [...nums],
      vars: [{ name: "n", value: String(n), tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (n <= 0) {
    pushStep(1, "n ≤ 0", "fail", `n = ${n} ≤ 0 → return false.`);
    done = true;
    steps.push({ line: 1, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `${n} ≤ 0 → not a power of two.`, done });
    return steps;
  }

  while (n > 1) {
    if (n % 2 !== 0) {
      pushStep(5, `n = ${n} is odd`, "fail", `n = ${n} is odd → not a power of two.`);
      done = true;
      steps.push({ line: 5, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `${n} is odd → not a power of two.`, done });
      return steps;
    }
    pushStep(5, `n = ${n} is even`, "ok", `n = ${n} is even → continue.`);
    n = Math.floor(n / 2);
    pushStep(6, `n → ${n}`, "info", `Divide by 2 → n = ${n}.`);
  }

  done = true;
  steps.push({
    line: 9,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: "true", tone: "ok" }],
    result: "return true",
    resultTone: "ok",
    explanation: `Reached n = 1 → is a power of two.`,
    done,
  });

  return steps;
}

// Approach 2: Bit Manipulation (n & (n - 1)).
// Source (lines):
// 0: var isPowerOfTwo = function (n) {
// 1:   // Power of two has exactly one bit set, so n & (n - 1) clears that bit
// 2:   return n > 0 && (n & (n - 1)) === 0;
// 3: };
export function powerOfTwoBitTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  const done = false;
  const n = nums[0];
  const result = n > 0 && (n & (n - 1)) === 0;

  steps.push({
    line: 2,
    cells: nums.map(() => "idle"),
    values: [...nums],
    vars: [
      { name: "n", value: String(n), tone: "info" },
      { name: "n & (n-1)", value: String(n > 0 ? n & (n - 1) : "—"), tone: "info" },
      { name: "result", value: String(result), tone: result ? "ok" : "fail" },
    ],
    result: `return ${result}`,
    resultTone: result ? "ok" : "fail",
    explanation: `n = ${n} (binary ${n.toString(2)}). n & (n-1) = ${n > 0 ? n & (n - 1) : "—"} → ${result ? "only one bit set, power of two" : "not a power of two"}.`,
    done,
  });

  return steps;
}

// ── Number of 1 Bits ──────────────────────────────────────────────────
// Two DISTINCT approaches. Input is a single integer n (passed as nums[0]).

// Approach 1: Check Each Bit.
// Source (lines):
// 0: var hammingWeight = function(n) {
// 1:     let count = 0;
// 2:
// 3:     while (n !== 0) {
// 4:         // Check if the least significant bit is set
// 5:         count += n & 1;
// 6:         // Shift right to process the next bit
// 7:         n >>>= 1;
// 8:     }
// 9:
// 10:    return count;
// 11: };
export function hammingWeightBitsTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let n = nums[0];
  let count = 0;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      values: [...nums],
      vars: [
        { name: "n", value: String(n), tone: "info" },
        { name: "n (binary)", value: n.toString(2), tone: "info" },
        { name: "count", value: String(count), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  while (n !== 0) {
    count += n & 1;
    pushStep(5, `LSB = ${n & 1} → count = ${count}`, n & 1 ? "ok" : "fail", `n = ${n} (${n.toString(2)}), LSB = ${n & 1} → count = ${count}.`);
    n >>>= 1;
    pushStep(7, `n → ${n}`, "info", `Shift right → n = ${n}.`);
  }

  done = true;
  steps.push({
    line: 10,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: String(count), tone: "ok" }],
    result: `return ${count}`,
    resultTone: "ok",
    explanation: `Number of 1 bits = ${count}.`,
    done,
  });

  return steps;
}

// Approach 2: Brian Kernighan's Algorithm.
// Source (lines):
// 0: var hammingWeight = function(n) {
// 1:     let count = 0;
// 2:
// 3:     while (n !== 0) {
// 4:         // Clear the lowest set bit
// 5:         n = n & (n - 1);
// 6:         count++;
// 7:     }
// 8:
// 9:     return count;
// 10: };
export function hammingWeightKernighanTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let n = nums[0];
  let count = 0;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      values: [...nums],
      vars: [
        { name: "n", value: String(n), tone: "info" },
        { name: "n (binary)", value: n.toString(2), tone: "info" },
        { name: "count", value: String(count), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  while (n !== 0) {
    n = n & (n - 1);
    count++;
    pushStep(6, `n → ${n}, count → ${count}`, "ok", `Clear lowest set bit → n = ${n} (${n.toString(2)}), count = ${count}.`);
  }

  done = true;
  steps.push({
    line: 9,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: String(count), tone: "ok" }],
    result: `return ${count}`,
    resultTone: "ok",
    explanation: `Number of 1 bits = ${count}.`,
    done,
  });

  return steps;
}

// ── Counting Bits ─────────────────────────────────────────────────────
// Two DISTINCT approaches. Input is a single integer n (passed as nums[0]).

// Approach 1: Brute Force (Count Bits Individually).
// Source (lines):
// 0: var countBits = function(n) {
// 1:     const ans = new Array(n + 1);
// 2:     for (let i = 0; i <= n; i++) {
// 3:         let count = 0;
// 4:         let num = i;
// 5:         // Count each 1-bit by checking the last bit and shifting right
// 6:         while (num > 0) {
// 7:             count += num & 1;
// 8:             num >>= 1;
// 9:         }
// 10:        ans[i] = count;
// 11:    }
// 12:    return ans;
// 13: };
export function countingBitsBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums[0];
  const ans = new Array(n + 1).fill(0);

  const pushStep = (
    line: number,
    i: number,
    num: number,
    count: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      values: [...nums],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "num", value: num >= 0 ? String(num) : "—", tone: "info" },
        { name: "count", value: String(count), tone: "ok" },
        { name: "ans", value: `[${ans.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, -1, 0, `ans = [${ans.join(", ")}]`, "info", `Allocate ans of size ${n + 1}.`);

  for (let i = 0; i <= n; i++) {
    let count = 0;
    let num = i;
    pushStep(3, i, num, count, `i = ${i}`, "info", `Count 1-bits of ${i} (${i.toString(2)}).`);
    while (num > 0) {
      count += num & 1;
      pushStep(7, i, num, count, `count → ${count}`, num & 1 ? "ok" : "fail", `${num} (${num.toString(2)}), LSB = ${num & 1} → count = ${count}.`);
      num >>= 1;
      pushStep(8, i, num, count, `num → ${num}`, "info", `Shift right → num = ${num}.`);
    }
    ans[i] = count;
    pushStep(10, i, -1, count, `ans[${i}] = ${count}`, "ok", `ans[${i}] = ${count}.`);
  }

  done = true;
  steps.push({
    line: 12,
    cells: nums.map(() => "idle"),
    values: [...nums],
    vars: [{ name: "result", value: `[${ans.join(", ")}]`, tone: "ok" }],
    result: `[${ans.join(", ")}]`,
    resultTone: "ok",
    explanation: `Return ans = [${ans.join(", ")}].`,
    done,
  });

  return steps;
}

// Approach 2: DP with Right Shift.
// Source (lines):
// 0: var countBits = function(n) {
// 1:     const ans = new Array(n + 1).fill(0);
// 2:     for (let i = 1; i <= n; i++) {
// 3:         // Bit count of i = bit count of (i without last bit) + last bit
// 4:         ans[i] = ans[i >> 1] + (i & 1);
// 5:     }
// 6:     return ans;
// 7: };
export function countingBitsDPTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums[0];
  const ans = new Array(n + 1).fill(0);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      values: [...nums],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "ans", value: `[${ans.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, `ans = [${ans.join(", ")}]`, "info", `Allocate ans filled with 0.`);

  for (let i = 1; i <= n; i++) {
    ans[i] = ans[i >> 1] + (i & 1);
    pushStep(4, i, `ans[${i}] = ${ans[i]}`, "ok", `ans[${i}] = ans[${i >> 1}] + (${i} & 1) = ${ans[i >> 1]} + ${i & 1} = ${ans[i]}.`);
  }

  done = true;
  steps.push({
    line: 6,
    cells: nums.map(() => "idle"),
    values: [...nums],
    vars: [{ name: "result", value: `[${ans.join(", ")}]`, tone: "ok" }],
    result: `[${ans.join(", ")}]`,
    resultTone: "ok",
    explanation: `Return ans = [${ans.join(", ")}].`,
    done,
  });

  return steps;
}

// ── Hamming Distance ──────────────────────────────────────────────────
// Two DISTINCT approaches. Input: x = nums[0], y = nums[1].

// Approach 1: Bit-by-Bit Comparison.
// Source (lines):
// 0: var hammingDistance = function(x, y) {
// 1:     var xor = x ^ y;
// 2:     var count = 0;
// 3:
// 4:     // Check each bit by shifting right until no bits remain
// 5:     while (xor !== 0) {
// 6:         count += xor & 1;
// 7:         xor >>= 1;
// 8:     }
// 9:
// 10:    return count;
// 11: };
export function hammingDistanceBitsTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const x = nums[0];
  const y = nums[1];
  let xor = x ^ y;
  let count = 0;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      values: [...nums],
      vars: [
        { name: "xor", value: String(xor), tone: "info" },
        { name: "count", value: String(count), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, `xor = x ^ y = ${x} ^ ${y} = ${xor}`, "info", `xor = ${x} ^ ${y} = ${xor} (${xor.toString(2)}).`);

  while (xor !== 0) {
    count += xor & 1;
    pushStep(6, `count → ${count}`, xor & 1 ? "ok" : "fail", `xor = ${xor} (${xor.toString(2)}), LSB = ${xor & 1} → count = ${count}.`);
    xor >>= 1;
    pushStep(7, `xor → ${xor}`, "info", `Shift right → xor = ${xor}.`);
  }

  done = true;
  steps.push({
    line: 10,
    cells: nums.map(() => "idle"),
    values: [...nums],
    vars: [{ name: "result", value: String(count), tone: "ok" }],
    result: `return ${count}`,
    resultTone: "ok",
    explanation: `Hamming distance = ${count}.`,
    done,
  });

  return steps;
}

// Approach 2: Brian Kernighan's Algorithm (Optimal).
// Source (lines):
// 0: var hammingDistance = function(x, y) {
// 1:     var xor = x ^ y;
// 2:     var count = 0;
// 3:
// 4:     // Each iteration clears the lowest set bit
// 5:     while (xor !== 0) {
// 6:         xor = xor & (xor - 1);
// 7:         count++;
// 8:     }
// 9:
// 10:    return count;
// 11: };
export function hammingDistanceKernighanTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const x = nums[0];
  const y = nums[1];
  let xor = x ^ y;
  let count = 0;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      values: [...nums],
      vars: [
        { name: "xor", value: String(xor), tone: "info" },
        { name: "count", value: String(count), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, `xor = x ^ y = ${x} ^ ${y} = ${xor}`, "info", `xor = ${x} ^ ${y} = ${xor} (${xor.toString(2)}).`);

  while (xor !== 0) {
    xor = xor & (xor - 1);
    count++;
    pushStep(7, `xor → ${xor}, count → ${count}`, "ok", `Clear lowest set bit → xor = ${xor} (${xor.toString(2)}), count = ${count}.`);
  }

  done = true;
  steps.push({
    line: 10,
    cells: nums.map(() => "idle"),
    values: [...nums],
    vars: [{ name: "result", value: String(count), tone: "ok" }],
    result: `return ${count}`,
    resultTone: "ok",
    explanation: `Hamming distance = ${count}.`,
    done,
  });

  return steps;
}

// ── Reverse Bits ──────────────────────────────────────────────────────
// Two DISTINCT approaches. Input: single integer n (passed as nums[0]).

// Approach 1: Bit-by-Bit Reversal.
// Source (lines):
// 0: var reverseBits = function(n) {
// 1:     var result = 0;
// 2:     for (var i = 0; i < 32; i++) {
// 3:         // Shift result left to make room, then add last bit of n
// 4:         result = (result << 1) | (n & 1);
// 5:         // Move to next bit of n
// 6:         n >>>= 1;
// 7:     }
// 8:     // Convert to unsigned 32-bit integer
// 9:     return result >>> 0;
// 10: };
export function reverseBitsBitwiseTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let n = nums[0] >>> 0;
  let result = 0;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      values: [...nums],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "n (binary)", value: n.toString(2).padStart(32, "0"), tone: "info" },
        { name: "result", value: String(result), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1);
    pushStep(4, i, `result → ${result}`, "ok", `Bit ${i}: n & 1 = ${n & 1} → result = ${result}.`);
    n >>>= 1;
    pushStep(6, i, `n → ${n}`, "info", `Shift n right → n = ${n}.`);
  }

  const final = result >>> 0;
  done = true;
  steps.push({
    line: 9,
    cells: nums.map(() => "idle"),
    values: [...nums],
    vars: [{ name: "result", value: String(final), tone: "ok" }],
    result: `return ${final}`,
    resultTone: "ok",
    explanation: `Reversed bits = ${final}.`,
    done,
  });

  return steps;
}

// Approach 2: Byte-Level Lookup Table.
// Source (lines):
// 0: // Precompute reversal for all 256 byte values
// 1: var TABLE = new Array(256);
// 2: for (var i = 0; i < 256; i++) {
// 3:     var reversed = 0, val = i;
// 4:     for (var j = 0; j < 8; j++) {
// 5:         reversed = (reversed << 1) | (val & 1);
// 6:         val >>= 1;
// 7:     }
// 8:     TABLE[i] = reversed;
// 9: }
// 10:
// 11: var reverseBits = function(n) {
// 12:    // Reverse each byte and place in opposite position
// 13:    return ((TABLE[n & 0xFF] << 24)
// 14:          | (TABLE[(n >> 8) & 0xFF] << 16)
// 15:          | (TABLE[(n >> 16) & 0xFF] << 8)
// 16:          | (TABLE[(n >>> 24) & 0xFF])) >>> 0;
// 17: };
export function reverseBitsLookupTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  const done = false;
  const n = nums[0] >>> 0;

  const TABLE = new Array(256);
  for (let i = 0; i < 256; i++) {
    let reversed = 0, val = i;
    for (let j = 0; j < 8; j++) {
      reversed = (reversed << 1) | (val & 1);
      val >>= 1;
    }
    TABLE[i] = reversed;
  }

  const b0 = TABLE[n & 0xFF] << 24;
  const b1 = TABLE[(n >> 8) & 0xFF] << 16;
  const b2 = TABLE[(n >> 16) & 0xFF] << 8;
  const b3 = TABLE[(n >>> 24) & 0xFF];
  const result = (b0 | b1 | b2 | b3) >>> 0;

  steps.push({
    line: 13,
    cells: nums.map(() => "idle"),
    values: [...nums],
    vars: [
      { name: "byte0", value: String((n & 0xFF).toString(2).padStart(8, "0")), tone: "info" },
      { name: "byte1", value: String(((n >> 8) & 0xFF).toString(2).padStart(8, "0")), tone: "info" },
      { name: "byte2", value: String(((n >> 16) & 0xFF).toString(2).padStart(8, "0")), tone: "info" },
      { name: "byte3", value: String(((n >>> 24) & 0xFF).toString(2).padStart(8, "0")), tone: "info" },
    ],
    result: `return ${result}`,
    resultTone: "ok",
    explanation: `Reverse each byte and reassemble → ${result}.`,
    done,
  });

  return steps;
}

// ── Bitwise AND of Numbers Range ──────────────────────────────────────
// Two DISTINCT approaches. Input: left = nums[0], right = nums[1].

// Approach 1: Brute Force.
// Source (lines):
// 0: var rangeBitwiseAnd = function(left, right) {
// 1:     let result = left;
// 2:     // i stays below right; AND in i + 1 each step
// 3:     for (let i = left; i < right; i++) {
// 4:         result &= i + 1;
// 5:         // Once result is 0, no AND operation can set bits back to 1
// 6:         if (result === 0) return 0;
// 7:     }
// 8:     return result;
// 9: };
export function rangeBitwiseAndBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const left = nums[0];
  const right = nums[1];
  let result = left;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      values: [...nums],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "result", value: String(result), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, `result = ${left}`, "info", `result = left = ${left}.`);

  for (let i = left; i < right; i++) {
    result &= i + 1;
    pushStep(4, i, `result → ${result}`, "info", `result &= ${i + 1} → ${result}.`);
    if (result === 0) {
      pushStep(6, i, "result = 0", "fail", `result is 0 → return 0.`);
      done = true;
      steps.push({ line: 6, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "0", tone: "fail" }], result: "return 0", resultTone: "fail", explanation: `AND reached 0 → return 0.`, done });
      return steps;
    }
  }

  done = true;
  steps.push({
    line: 8,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: String(result), tone: "ok" }],
    result: `return ${result}`,
    resultTone: "ok",
    explanation: `Bitwise AND of range = ${result}.`,
    done,
  });

  return steps;
}

// Approach 2: Bit Shift (Common Prefix).
// Source (lines):
// 0: var rangeBitwiseAnd = function(left, right) {
// 1:     let shifts = 0;
// 2:     // Shift both numbers right until they share the same prefix
// 3:     while (left !== right) {
// 4:         left >>= 1;
// 5:         right >>= 1;
// 6:         shifts++;
// 7:     }
// 8:     // Shift the common prefix back to its original position
// 9:     return left << shifts;
// 10: };
export function rangeBitwiseAndShiftTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let left = nums[0];
  let right = nums[1];
  let shifts = 0;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      values: [...nums],
      vars: [
        { name: "left", value: String(left), tone: "info" },
        { name: "right", value: String(right), tone: "info" },
        { name: "shifts", value: String(shifts), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, "shifts = 0", "info", "shifts = 0.");

  while (left !== right) {
    left >>= 1;
    right >>= 1;
    shifts++;
    pushStep(6, `left = ${left}, right = ${right}, shifts = ${shifts}`, "info", `Shift both right → left = ${left}, right = ${right}, shifts = ${shifts}.`);
  }

  const result = left << shifts;
  done = true;
  steps.push({
    line: 9,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: String(result), tone: "ok" }],
    result: `return ${result}`,
    resultTone: "ok",
    explanation: `Common prefix ${left} shifted left ${shifts} → ${result}.`,
    done,
  });

  return steps;
}

// ── Single Number II ──────────────────────────────────────────────────
// Two DISTINCT approaches. Input: nums array.

// Approach 1: Hash Map Counting.
// Source (lines):
// 0: var singleNumber = function (nums) {
// 1:   const countMap = new Map();
// 2:
// 3:   // Count occurrences of each element
// 4:   for (const num of nums) {
// 5:     countMap.set(num, (countMap.get(num) || 0) + 1);
// 6:   }
// 7:
// 8:   // Find the element that appears exactly once
// 9:   for (const [num, count] of countMap) {
// 10:    if (count === 1) {
// 11:      return num;
// 12:    }
// 13:  }
// 14:
// 15:  return -1; // Should never reach here given valid input
// 16: };
export function singleNumberIIHashMapTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const countMap = new Map<number, number>();

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "countMap", value: `{${Array.from(countMap.entries()).map(([k, v]) => `${k}:${v}`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    countMap.set(nums[i], (countMap.get(nums[i]) || 0) + 1);
    pushStep(5, i, `countMap → {${Array.from(countMap.entries()).map(([k, v]) => `${k}:${v}`).join(", ")}}`, "info", `Increment count of ${nums[i]} → ${countMap.get(nums[i])}.`);
  }

  for (const [num, count] of countMap) {
    if (count === 1) {
      pushStep(10, -1, `count(${num}) = 1`, "ok", `${num} appears once.`);
      done = true;
      steps.push({ line: 11, cells: nums.map(() => "idle"), vars: [{ name: "result", value: String(num), tone: "ok" }], result: `return ${num}`, resultTone: "ok", explanation: `Single number = ${num}.`, done });
      return steps;
    }
    pushStep(10, -1, `count(${num}) = ${count}`, "fail", `${num} appears ${count} times → not single.`);
  }

  done = true;
  steps.push({ line: 15, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "-1", tone: "fail" }], result: "return -1", resultTone: "fail", explanation: `No single number (unreachable).`, done });
  return steps;
}

// Approach 2: Bitwise Counting (Bit-by-Bit).
// Source (lines):
// 0: var singleNumber = function (nums) {
// 1:   let result = 0;
// 2:
// 3:   // Process each of the 32 bit positions
// 4:   for (let i = 0; i < 32; i++) {
// 5:     let bitSum = 0;
// 6:
// 7:     // Count how many numbers have a 1 at bit position i
// 8:     for (const num of nums) {
// 9:       bitSum += (num >> i) & 1;
// 10:    }
// 11:
// 12:    // If the count mod 3 is 1, the single number has a 1 here
// 13:    if (bitSum % 3 === 1) {
// 14:      result |= 1 << i;
// 15:    }
// 16:  }
// 17:
// 18:  // Convert to signed 32-bit integer (handles negative results)
// 19:  return result | 0;
// 20: };
export function singleNumberIIBitwiseTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let result = 0;

  const pushStep = (
    line: number,
    i: number,
    bitSum: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "bitSum", value: String(bitSum), tone: "info" },
        { name: "result", value: String(result), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < 32; i++) {
    let bitSum = 0;
    for (const num of nums) {
      bitSum += (num >> i) & 1;
    }
    pushStep(9, i, bitSum, `bitSum = ${bitSum}`, "info", `Bit ${i}: sum of set bits = ${bitSum}.`);
    if (bitSum % 3 === 1) {
      result |= 1 << i;
      pushStep(14, i, bitSum, `result → ${result}`, "ok", `bitSum % 3 = 1 → set bit ${i} in result.`);
    } else {
      pushStep(13, i, bitSum, "bitSum % 3 = 0", "fail", `bitSum % 3 = 0 → skip bit ${i}.`);
    }
  }

  const final = result | 0;
  done = true;
  steps.push({
    line: 19,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: String(final), tone: "ok" }],
    result: `return ${final}`,
    resultTone: "ok",
    explanation: `Single number = ${final}.`,
    done,
  });

  return steps;
}

// ── Single Number III ─────────────────────────────────────────────────
// Two DISTINCT approaches. Input: nums array.

// Approach 1: Hash Map.
// Source (lines):
// 0: var singleNumber = function (nums) {
// 1:   const freq = new Map()
// 2:   for (const num of nums) {
// 3:     freq.set(num, (freq.get(num) || 0) + 1)
// 4:   }
// 5:
// 6:   const result = []
// 7:   for (const [num, count] of freq) {
// 8:     if (count === 1) {
// 9:       result.push(num)
// 10:    }
// 11:  }
// 12:  return result
// 13: }
export function singleNumberIIIHashMapTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const freq = new Map<number, number>();
  const result: number[] = [];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      vars: [
        { name: "freq", value: `{${Array.from(freq.entries()).map(([k, v]) => `${k}:${v}`).join(", ")}}`, tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
    pushStep(3, `freq → {${Array.from(freq.entries()).map(([k, v]) => `${k}:${v}`).join(", ")}}`, "info", `Increment count of ${num} → ${freq.get(num)}.`);
  }

  for (const [num, count] of freq) {
    if (count === 1) {
      result.push(num);
      pushStep(9, `result → [${result.join(", ")}]`, "ok", `${num} appears once → add to result.`);
    }
  }

  done = true;
  steps.push({
    line: 12,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }],
    result: `[${result.join(", ")}]`,
    resultTone: "ok",
    explanation: `Single numbers = [${result.join(", ")}].`,
    done,
  });

  return steps;
}

// Approach 2: Sorting.
// Source (lines):
// 0: var singleNumber = function (nums) {
// 1:   nums.sort((a, b) => a - b)
// 2:   const result = []
// 3:   let i = 0
// 4:
// 5:   while (i < nums.length) {
// 6:     // If last element or doesn't match next, it's unique
// 7:     if (i === nums.length - 1 || nums[i] !== nums[i + 1]) {
// 8:       result.push(nums[i])
// 9:       i++
// 10:    } else {
// 11:      i += 2 // Skip the pair
// 12:    }
// 13:  }
// 14:  return result
// 15: }
export function singleNumberIIISortTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums].sort((a, b) => a - b);
  const result: number[] = [];
  let i = 0;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => (idx === i ? "i" : "idle")),
      values: [...working],
      vars: [
        { name: "i", value: String(i), tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, `sorted = [${working.join(", ")}]`, "info", `Sorted → [${working.join(", ")}].`);

  while (i < working.length) {
    if (i === working.length - 1 || working[i] !== working[i + 1]) {
      result.push(working[i]);
      pushStep(8, `result → [${result.join(", ")}]`, "ok", `${working[i]} is unique → add.`);
      i++;
    } else {
      pushStep(11, `skip pair at ${i}`, "fail", `${working[i]} and ${working[i + 1]} match → skip pair.`);
      i += 2;
    }
  }

  done = true;
  steps.push({
    line: 14,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }],
    result: `[${result.join(", ")}]`,
    resultTone: "ok",
    explanation: `Single numbers = [${result.join(", ")}].`,
    done,
  });

  return steps;
}

// ── Sum of Two Integers ───────────────────────────────────────────────
// Two DISTINCT approaches. Input: a = nums[0], b = nums[1].

// Approach 1: Successive Increment/Decrement.
// Source (lines):
// 0: var getSum = function(a, b) {
// 1:     // Increment or decrement a by 1, b times
// 2:     while (b > 0) {
// 3:         a = -~a;  // a + 1 (bitwise)
// 4:         b = ~-b;  // b - 1 (bitwise)
// 5:     }
// 6:     while (b < 0) {
// 7:         a = ~-a;  // a - 1 (bitwise)
// 8:         b = -~b;  // b + 1 (bitwise)
// 9:     }
// 10:    return a;
// 11: };
export function getSumIncrementTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let a = nums[0];
  let b = nums[1];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      values: [...nums],
      vars: [
        { name: "a", value: String(a), tone: "info" },
        { name: "b", value: String(b), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  while (b > 0) {
    a = -~a;
    b = ~-b;
    pushStep(4, `a → ${a}, b → ${b}`, "info", `a+1, b-1 → a = ${a}, b = ${b}.`);
  }
  while (b < 0) {
    a = ~-a;
    b = -~b;
    pushStep(8, `a → ${a}, b → ${b}`, "info", `a-1, b+1 → a = ${a}, b = ${b}.`);
  }

  done = true;
  steps.push({
    line: 10,
    cells: nums.map(() => "idle"),
    values: [...nums],
    vars: [{ name: "result", value: String(a), tone: "ok" }],
    result: `return ${a}`,
    resultTone: "ok",
    explanation: `Sum = ${a}.`,
    done,
  });

  return steps;
}

// Approach 2: Bit Manipulation (XOR + AND + Shift).
// Source (lines):
// 0: var getSum = function(a, b) {
// 1:     while (b !== 0) {
// 2:         var carry = (a & b) << 1;  // Carry: bits where both are 1, shifted left
// 3:         a = a ^ b;                 // Sum without carry: XOR
// 4:         b = carry;                 // Process remaining carry in next iteration
// 5:     }
// 6:     return a;
// 7: };
export function getSumBitwiseTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let a = nums[0];
  let b = nums[1];

  const pushStep = (
    line: number,
    carry: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      values: [...nums],
      vars: [
        { name: "a", value: String(a), tone: "info" },
        { name: "b", value: String(b), tone: "info" },
        { name: "carry", value: String(carry), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  while (b !== 0) {
    const carry = (a & b) << 1;
    pushStep(2, carry, `carry = ${carry}`, "info", `carry = (a & b) << 1 = ${a} & ${b} << 1 = ${carry}.`);
    a = a ^ b;
    pushStep(3, carry, `a → ${a}`, "ok", `a = a ^ b = ${a}.`);
    b = carry;
    pushStep(4, carry, `b → ${b}`, "info", `b = carry = ${b}.`);
  }

  done = true;
  steps.push({
    line: 6,
    cells: nums.map(() => "idle"),
    values: [...nums],
    vars: [{ name: "result", value: String(a), tone: "ok" }],
    result: `return ${a}`,
    resultTone: "ok",
    explanation: `Sum = ${a}.`,
    done,
  });

  return steps;
}

// ── Design HashMap ────────────────────────────────────────────────────
// Two DISTINCT approaches. This is a class with put/get/remove operations.
// We encode a demo sequence of operations as numbers:
//   ops[i] = 0 → put(key, value), 1 → get(key), 2 → remove(key)
// The keys are nums, and the values are passed as a params array.

// Approach 1: Brute Force (Direct Address Array) — an array indexed by key.
// Source (lines):
// 0: class MyHashMap {
// 1:     constructor() {
// 2:         this.data = new Array(1000001).fill(-1);
// 3:     }
// 4:
// 5:     put(key, value) {
// 6:         this.data[key] = value;
// 7:     }
// 8:
// 9:     get(key) {
// 10:        return this.data[key];
// 11:    }
// 12:
// 13:    remove(key) {
// 14:        this.data[key] = -1;
// 15:    }
// 16: }
export function designHashMapArrayTrace(): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const data = new Array(1000001).fill(-1);

  // ops: 0=put, 1=get, 2=remove
  const ops = [0, 1, 0, 1, 2, 1];
  const opKeys = [1, 1, 2, 1, 2, 2];
  const opValues = [10, 0, 20, 0, 0, 0];
  const opNames = ["put(1,10)", "get(1)", "put(2,20)", "get(1)", "remove(2)", "get(2)"];

  const pushStep = (
    line: number,
    opIdx: number,
    key: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    const shown = data.slice(0, 8);
    steps.push({
      line,
      cells: cellsFor(shown, () => "idle"),
      values: [...shown],
      vars: [
        { name: "op", value: opNames[opIdx] ?? "—", tone: "info" },
        { name: "key", value: String(key), tone: "info" },
        { name: "data[0..7]", value: `[${shown.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, -1, -1, "data filled with -1", "info", "data = new Array(1000001).fill(-1).");

  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    const key = opKeys[i];
    const value = opValues[i];
    if (op === 0) {
      data[key] = value;
      pushStep(6, i, key, `data[${key}] = ${value}`, "ok", `put(${key}, ${value}) → data[${key}] = ${value}.`);
    } else if (op === 1) {
      const v = data[key];
      pushStep(10, i, key, `get(${key}) = ${v}`, v >= 0 ? "ok" : "fail", `get(${key}) → data[${key}] = ${v}.`);
    } else {
      data[key] = -1;
      pushStep(14, i, key, `remove(${key})`, "fail", `remove(${key}) → data[${key}] = -1.`);
    }
  }

  done = true;
  steps.push({
    line: 16,
    cells: cellsFor(data.slice(0, 8), () => "idle"),
    values: [...data.slice(0, 8)],
    vars: [{ name: "result", value: `[${data.slice(0, 8).join(", ")}]`, tone: "ok" }],
    result: `done → data[0..7] = [${data.slice(0, 8).join(", ")}]`,
    resultTone: "ok",
    explanation: `Demo sequence complete. data[0..7] = [${data.slice(0, 8).join(", ")}].`,
    done,
  });

  return steps;
}

// Approach 2: Array of Linked Lists (Chaining) — buckets with hash key % size.
// Source (lines):
// 0: class MyHashMap {
// 1:     constructor() {
// 2:         this.size = 5;
// 3:         this.buckets = new Array(this.size).fill(null);
// 4:     }
// 5:
// 6:     _hash(key) {
// 7:         return key % this.size;
// 8:     }
// 9:
// 10:    put(key, value) {
// 11:        const bucket = this._hash(key);
// 12:        let curr = this.buckets[bucket];
// 13:        while (curr !== null) {
// 14:            if (curr.key === key) {
// 15:                curr.value = value;
// 16:                return;
// 17:            }
// 18:            curr = curr.next;
// 19:        }
// 20:        this.buckets[bucket] = { key: key, value: value, next: this.buckets[bucket] };
// 21:    }
// 22:
// 23:    get(key) {
// 24:        const bucket = this._hash(key);
// 25:        let curr = this.buckets[bucket];
// 26:        while (curr !== null) {
// 27:            if (curr.key === key) {
// 28:                return curr.value;
// 29:            }
// 30:            curr = curr.next;
// 31:        }
// 32:        return -1;
// 33:    }
// 34:
// 35:    remove(key) {
// 36:        const bucket = this._hash(key);
// 37:        if (this.buckets[bucket] !== null && this.buckets[bucket].key === key) {
// 38:            this.buckets[bucket] = this.buckets[bucket].next;
// 39:            return;
// 40:        }
// 41:        let curr = this.buckets[bucket];
// 42:        while (curr !== null && curr.next !== null) {
// 43:            if (curr.next.key === key) {
// 44:                curr.next = curr.next.next;
// 45:                return;
// 46:            }
// 47:            curr = curr.next;
// 48:        }
// 49:    }
// 50: }
export function designHashMapChainingTrace(): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const size = 5;
  const buckets: (null | { key: number; value: number; next: typeof buckets[number] })[] = new Array(size).fill(null);

  const ops = [0, 1, 0, 0, 2, 1];
  const opKeys = [1, 1, 2, 6, 1, 1];
  const opValues = [10, 0, 20, 30, 0, 0];
  const opNames = ["put(1,10)", "get(1)", "put(2,20)", "put(6,30)", "remove(1)", "get(1)"];

  const bucketDesc = () =>
    buckets.map((b, i) => {
      let desc = `b${i}:`;
      let c = b;
      let first = true;
      while (c !== null) {
        desc += `${first ? " " : " → "}${c.key}:${c.value}`;
        first = false;
        c = c.next;
      }
      return desc;
    }).join(" | ");

  const pushStep = (
    line: number,
    opIdx: number,
    key: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(buckets.map((_, i) => i), () => "idle"),
      values: buckets.map((_, i) => i),
      vars: [
        { name: "op", value: opNames[opIdx] ?? "—", tone: "info" },
        { name: "key", value: String(key), tone: "info" },
        { name: "buckets", value: bucketDesc(), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  const hash = (k: number) => k % size;
  pushStep(3, -1, -1, `buckets = [null × ${size}]`, "info", `buckets = new Array(${size}).fill(null).`);

  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    const key = opKeys[i];
    const value = opValues[i];
    const bucket = hash(key);
    if (op === 0) {
      let curr = buckets[bucket];
      let found = false;
      while (curr !== null) {
        if (curr.key === key) { curr.value = value; found = true; break; }
        curr = curr.next;
      }
      if (!found) {
        buckets[bucket] = { key, value, next: buckets[bucket] };
      }
      pushStep(20, i, key, `put(${key},${value}) → b${bucket}`, "ok", `hash(${key}) = ${bucket}. Insert/update → ${bucketDesc()}.`);
    } else if (op === 1) {
      let curr = buckets[bucket];
      let result = -1;
      while (curr !== null) {
        if (curr.key === key) { result = curr.value; break; }
        curr = curr.next;
      }
      pushStep(28, i, key, `get(${key}) = ${result}`, result >= 0 ? "ok" : "fail", `hash(${key}) = ${bucket}. Search bucket → ${result}.`);
    } else {
      if (buckets[bucket] !== null && buckets[bucket].key === key) {
        buckets[bucket] = buckets[bucket].next;
      } else {
        let curr = buckets[bucket];
        while (curr !== null && curr.next !== null) {
          if (curr.next.key === key) { curr.next = curr.next.next; break; }
          curr = curr.next;
        }
      }
      pushStep(38, i, key, `remove(${key})`, "fail", `hash(${key}) = ${bucket}. Remove key → ${bucketDesc()}.`);
    }
  }

  done = true;
  steps.push({
    line: 50,
    cells: cellsFor(buckets.map((_, i) => i), () => "idle"),
    values: buckets.map((_, i) => i),
    vars: [{ name: "buckets", value: bucketDesc(), tone: "ok" }],
    result: `done → ${bucketDesc()}`,
    resultTone: "ok",
    explanation: `Demo sequence complete. ${bucketDesc()}.`,
    done,
  });

  return steps;
}

// ── Contains Duplicate ────────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Brute Force — nested loops compare every pair.
// Source (lines):
// 0: function containsDuplicate(nums) {
// 1:     for (let i = 0; i < nums.length; i++) {
// 2:         for (let j = i + 1; j < nums.length; j++) {
// 3:             if (nums[i] === nums[j]) {
// 4:                 return true;
// 5:             }
// 6:         }
// 7:     }
// 8:     return false;
// 9: }
export function containsDuplicateBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) {
        pushStep(3, i, j, "duplicate found!", "ok", `nums[${i}] = ${nums[i]} equals nums[${j}] = ${nums[j]} → duplicate.`);
        done = true;
        steps.push({ line: 4, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `Found duplicate → return true.`, done });
        return steps;
      }
      pushStep(3, i, j, "no match", "info", `nums[${i}] = ${nums[i]} ≠ nums[${j}] = ${nums[j]}.`);
    }
  }

  done = true;
  steps.push({ line: 8, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `No duplicates → return false.`, done });
  return steps;
}

// Approach 2: Sorting — sort, then check adjacent elements.
// Source (lines):
// 0: function containsDuplicate(nums) {
// 1:     nums.sort((a, b) => a - b);
// 2:     for (let i = 0; i < nums.length - 1; i++) {
// 3:         if (nums[i] === nums[i + 1]) {
// 4:             return true;
// 5:         }
// 6:     }
// 7:     return false;
// 8: }
export function containsDuplicateSortTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums].sort((a, b) => a - b);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => (idx === i ? "i" : "idle")),
      values: [...working],
      vars: [{ name: "i", value: i >= 0 ? String(i) : "—", tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, `sorted = [${working.join(", ")}]`, "info", `Sorted → [${working.join(", ")}].`);

  for (let i = 0; i < working.length - 1; i++) {
    if (working[i] === working[i + 1]) {
      pushStep(3, i, "duplicate found!", "ok", `nums[${i}] = ${working[i]} equals nums[${i + 1}] → duplicate.`);
      done = true;
      steps.push({ line: 4, cells: working.map(() => "idle"), values: [...working], vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `Found duplicate → return true.`, done });
      return steps;
    }
    pushStep(3, i, "no match", "info", `nums[${i}] = ${working[i]} ≠ nums[${i + 1}] = ${working[i + 1]}.`);
  }

  done = true;
  steps.push({ line: 7, cells: working.map(() => "idle"), values: [...working], vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `No duplicates → return false.`, done });
  return steps;
}

// ── Word Pattern ──────────────────────────────────────────────────────
// Two DISTINCT approaches. pattern is passed as char codes (nums); the words
// string is passed as a params array (char codes of the joined words).

// Approach 1: Two Hash Maps (Bijection Check).
// Source (lines):
// 0: function wordPattern(pattern, s) {
// 1:     const words = s.split(" ");
// 2:     if (pattern.length !== words.length) return false;
// 3:     const charToWord = new Map();
// 4:     const wordToChar = new Map();
// 5:     for (let i = 0; i < pattern.length; i++) {
// 6:         const c = pattern[i];
// 7:         const word = words[i];
// 8:         // Check char -> word mapping
// 9:         if (charToWord.has(c)) {
// 10:            if (charToWord.get(c) !== word) return false;
// 11:        } else {
// 12:            charToWord.set(c, word);
// 13:        }
// 14:        // Check word -> char mapping
// 15:        if (wordToChar.has(word)) {
// 16:            if (wordToChar.get(word) !== c) return false;
// 17:        } else {
// 18:            wordToChar.set(word, c);
// 19:        }
// 20:    }
// 21:    return true;
// 22: }
export function wordPatternTwoMapTrace(patternCodes: number[], wordsCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const pattern = patternCodes.map((c) => String.fromCharCode(c)).join("");
  const words = wordsCodes.map((c) => String.fromCharCode(c)).join("").split(" ").filter((w) => w.length > 0);
  const charToWord = new Map<string, string>();
  const wordToChar = new Map<string, string>();

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(wordsCodes, () => "idle"),
      values: [...wordsCodes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "charToWord", value: `{${Array.from(charToWord.entries()).map(([k, v]) => `'${k}':"${v}"`).join(", ")}}`, tone: "info" },
        { name: "wordToChar", value: `{${Array.from(wordToChar.entries()).map(([k, v]) => `"${k}":'${v}'`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (pattern.length !== words.length) {
    pushStep(2, -1, "lengths differ", "fail", `pattern.length = ${pattern.length} ≠ words.length = ${words.length} → return false.`);
    done = true;
    steps.push({ line: 2, cells: wordsCodes.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Different lengths → return false.`, done });
    return steps;
  }

  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    const word = words[i];
    if (charToWord.has(c)) {
      if (charToWord.get(c) !== word) {
        pushStep(10, i, "char → word mismatch", "fail", `'${c}' already maps to "${charToWord.get(c)}" ≠ "${word}" → return false.`);
        done = true;
        steps.push({ line: 10, cells: wordsCodes.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Char-to-word mismatch → return false.`, done });
        return steps;
      }
      pushStep(10, i, `'${c}' → "${word}" ok`, "ok", `'${c}' already maps to "${word}".`);
    } else {
      charToWord.set(c, word);
      pushStep(12, i, `charToWord: '${c}' → "${word}"`, "ok", `Record '${c}' → "${word}".`);
    }
    if (wordToChar.has(word)) {
      if (wordToChar.get(word) !== c) {
        pushStep(16, i, "word → char mismatch", "fail", `"${word}" already maps to '${wordToChar.get(word)}' ≠ '${c}' → return false.`);
        done = true;
        steps.push({ line: 16, cells: wordsCodes.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Word-to-char mismatch → return false.`, done });
        return steps;
      }
      pushStep(16, i, `"${word}" → '${c}' ok`, "ok", `"${word}" already maps to '${c}'.`);
    } else {
      wordToChar.set(word, c);
      pushStep(18, i, `wordToChar: "${word}" → '${c}'`, "ok", `Record "${word}" → '${c}'.`);
    }
  }

  done = true;
  steps.push({ line: 21, cells: wordsCodes.map(() => "idle"), values: [...wordsCodes], vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `Bijection holds → return true.`, done });
  return steps;
}

// Approach 2: Index Mapping (Single-Pass Structure Comparison).
// Source (lines):
// 0: function wordPattern(pattern, s) {
// 1:     const words = s.split(" ");
// 2:     if (pattern.length !== words.length) return false;
// 3:     const charFirst = new Map();
// 4:     const wordFirst = new Map();
// 5:     for (let i = 0; i < pattern.length; i++) {
// 6:         const c = pattern[i];
// 7:         const word = words[i];
// 8:         // Record first occurrence index for each
// 9:         if (!charFirst.has(c)) charFirst.set(c, i);
// 10:        if (!wordFirst.has(word)) wordFirst.set(word, i);
// 11:        // If the structural positions differ, pattern doesn't match
// 12:        if (charFirst.get(c) !== wordFirst.get(word)) return false;
// 13:    }
// 14:    return true;
// 15: }
export function wordPatternIndexTrace(patternCodes: number[], wordsCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const pattern = patternCodes.map((c) => String.fromCharCode(c)).join("");
  const words = wordsCodes.map((c) => String.fromCharCode(c)).join("").split(" ").filter((w) => w.length > 0);
  const charFirst = new Map<string, number>();
  const wordFirst = new Map<string, number>();

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(wordsCodes, () => "idle"),
      values: [...wordsCodes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "charFirst", value: `{${Array.from(charFirst.entries()).map(([k, v]) => `'${k}':${v}`).join(", ")}}`, tone: "info" },
        { name: "wordFirst", value: `{${Array.from(wordFirst.entries()).map(([k, v]) => `"${k}":${v}`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (pattern.length !== words.length) {
    pushStep(2, -1, "lengths differ", "fail", `pattern.length = ${pattern.length} ≠ words.length = ${words.length} → return false.`);
    done = true;
    steps.push({ line: 2, cells: wordsCodes.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Different lengths → return false.`, done });
    return steps;
  }

  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    const word = words[i];
    if (!charFirst.has(c)) charFirst.set(c, i);
    if (!wordFirst.has(word)) wordFirst.set(word, i);
    pushStep(10, i, `first('${c}')=${charFirst.get(c)}, first("${word}")=${wordFirst.get(word)}`, "info", `First occurrence of '${c}' = ${charFirst.get(c)}, of "${word}" = ${wordFirst.get(word)}.`);
    if (charFirst.get(c) !== wordFirst.get(word)) {
      pushStep(12, i, "structural mismatch", "fail", `First positions differ → return false.`);
      done = true;
      steps.push({ line: 12, cells: wordsCodes.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Structural mismatch → return false.`, done });
      return steps;
    }
  }

  done = true;
  steps.push({ line: 14, cells: wordsCodes.map(() => "idle"), values: [...wordsCodes], vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `Structures match → return true.`, done });
  return steps;
}

// ── First Unique Character in a String ────────────────────────────────
// Two DISTINCT approaches. s is passed as char codes (nums).

// Approach 1: Brute Force.
// Source (lines):
// 0: function firstUniqChar(s) {
// 1:     for (let i = 0; i < s.length; i++) {
// 2:         let unique = true;
// 3:         for (let j = 0; j < s.length; j++) {
// 4:             if (i !== j && s[j] === s[i]) {
// 5:                 unique = false;
// 6:                 break;
// 7:             }
// 8:         }
// 9:         if (unique) {
// 10:            return i;
// 11:        }
// 12:    }
// 13:    return -1;
// 14: }
export function firstUniqCharBruteTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      values: [...codes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < s.length; i++) {
    let unique = true;
    pushStep(2, i, -1, `check s[${i}] = '${s[i]}'`, "info", `Check if '${s[i]}' is unique.`);
    for (let j = 0; j < s.length; j++) {
      if (i !== j && s[j] === s[i]) {
        unique = false;
        pushStep(5, i, j, "duplicate found", "fail", `s[${j}] = '${s[j]}' equals s[${i}] → not unique.`);
        break;
      }
      pushStep(4, i, j, "no match", "info", `s[${j}] = '${s[j]}' ≠ s[${i}].`);
    }
    if (unique) {
      pushStep(9, i, -1, `unique at ${i}`, "ok", `'${s[i]}' is unique → return index ${i}.`);
      done = true;
      steps.push({ line: 10, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: String(i), tone: "ok" }], result: `return ${i}`, resultTone: "ok", explanation: `First unique char at index ${i}.`, done });
      return steps;
    }
  }

  done = true;
  steps.push({ line: 13, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: "-1", tone: "fail" }], result: "return -1", resultTone: "fail", explanation: `No unique character → return -1.`, done });
  return steps;
}

// Approach 2: Two-Pass Frequency Count.
// Source (lines):
// 0: function firstUniqChar(s) {
// 1:     const count = new Array(26).fill(0);
// 2:     for (let i = 0; i < s.length; i++) {
// 3:         count[s.charCodeAt(i) - 97]++;
// 4:     }
// 5:     for (let i = 0; i < s.length; i++) {
// 6:         if (count[s.charCodeAt(i) - 97] === 1) return i;
// 7:     }
// 8:     return -1;
// 9: }
export function firstUniqCharFreqTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  const count = new Array(26).fill(0);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, (idx) => (idx === i ? "i" : "idle")),
      values: [...codes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "count", value: `[${count.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    pushStep(3, i, `count['${s[i]}'] → ${count[s.charCodeAt(i) - 97]}`, "info", `Increment count of '${s[i]}' → ${count[s.charCodeAt(i) - 97]}.`);
  }

  for (let i = 0; i < s.length; i++) {
    if (count[s.charCodeAt(i) - 97] === 1) {
      pushStep(6, i, `count['${s[i]}'] = 1`, "ok", `'${s[i]}' appears once → return index ${i}.`);
      done = true;
      steps.push({ line: 6, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: String(i), tone: "ok" }], result: `return ${i}`, resultTone: "ok", explanation: `First unique char at index ${i}.`, done });
      return steps;
    }
    pushStep(6, i, `count['${s[i]}'] > 1`, "fail", `'${s[i]}' appears ${count[s.charCodeAt(i) - 97]} times → skip.`);
  }

  done = true;
  steps.push({ line: 8, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: "-1", tone: "fail" }], result: "return -1", resultTone: "fail", explanation: `No unique character → return -1.`, done });
  return steps;
}

// ── Find All Numbers Disappeared in an Array ──────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Hash Set.
// Source (lines):
// 0: function findDisappearedNumbers(nums) {
// 1:     const seen = new Set();
// 2:     for (const num of nums) {
// 3:         seen.add(num);
// 4:     }
// 5:     const result = [];
// 6:     for (let i = 1; i <= nums.length; i++) {
// 7:         if (!seen.has(i)) {
// 8:             result.push(i);
// 9:         }
// 10:    }
// 11:    return result;
// 12: }
export function findDisappearedHashSetTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const seen = new Set(nums);
  const result: number[] = [];

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "seen", value: `{${[...seen].join(", ")}}`, tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, `seen = {${[...seen].join(", ")}}`, "info", `Stored all numbers in a set.`);

  for (let i = 1; i <= nums.length; i++) {
    if (!seen.has(i)) {
      result.push(i);
      pushStep(8, -1, `result → [${result.join(", ")}]`, "ok", `${i} is missing → add to result.`);
    } else {
      pushStep(7, -1, `${i} present`, "info", `${i} is in the set → skip.`);
    }
  }

  done = true;
  steps.push({
    line: 11,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }],
    result: `[${result.join(", ")}]`,
    resultTone: "ok",
    explanation: `Disappeared numbers = [${result.join(", ")}].`,
    done,
  });

  return steps;
}

// Approach 2: Negation Marking (Optimal).
// Source (lines):
// 0: function findDisappearedNumbers(nums) {
// 1:     for (let i = 0; i < nums.length; i++) {
// 2:         const index = Math.abs(nums[i]) - 1;
// 3:         if (nums[index] > 0) {
// 4:             nums[index] = -nums[index];
// 5:         }
// 6:     }
// 7:     const result = [];
// 8:     for (let i = 0; i < nums.length; i++) {
// 9:         if (nums[i] > 0)
// 10:            result.push(i + 1);
// 11:    }
// 12:    return result;
// 13: }
export function findDisappearedNegationTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums];
  const result: number[] = [];

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => (idx === i ? "i" : "idle")),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "nums", value: `[${working.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < working.length; i++) {
    const index = Math.abs(working[i]) - 1;
    if (working[index] > 0) {
      working[index] = -working[index];
      pushStep(4, i, `mark nums[${index}] → ${working[index]}`, "ok", `index = |nums[${i}]| - 1 = ${index}. Mark nums[${index}] = ${working[index]}.`);
    } else {
      pushStep(3, i, `nums[${index}] already negative`, "info", `index = ${index} already marked → skip.`);
    }
  }

  for (let i = 0; i < working.length; i++) {
    if (working[i] > 0) {
      result.push(i + 1);
      pushStep(10, i, `result → [${result.join(", ")}]`, "ok", `nums[${i}] = ${working[i]} > 0 → ${i + 1} is missing.`);
    } else {
      pushStep(9, i, `nums[${i}] negative`, "info", `nums[${i}] = ${working[i]} < 0 → ${i + 1} present.`);
    }
  }

  done = true;
  steps.push({
    line: 12,
    cells: working.map(() => "idle"),
    values: [...working],
    vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }],
    result: `[${result.join(", ")}]`,
    resultTone: "ok",
    explanation: `Disappeared numbers = [${result.join(", ")}].`,
    done,
  });

  return steps;
}

// ── Maximum Number of Balloons ─────────────────────────────────────────
// Two DISTINCT approaches. text is passed as char codes (nums).

// Approach 1: Character Frequency with Array.
// Source (lines):
// 0: function maxNumberOfBalloons(text) {
// 1:     const count = new Array(26).fill(0);
// 2:     for (const c of text) {
// 3:         count[c.charCodeAt(0) - 97]++;
// 4:     }
// 5:     let result = count['b'.charCodeAt(0) - 97]; // need 1 per balloon
// 6:     result = Math.min(result, count['a'.charCodeAt(0) - 97]);
// 7:     result = Math.min(result, Math.floor(count['l'.charCodeAt(0) - 97] / 2)); // need 2 per balloon
// 8:     result = Math.min(result, Math.floor(count['o'.charCodeAt(0) - 97] / 2)); // need 2 per balloon
// 9:     result = Math.min(result, count['n'.charCodeAt(0) - 97]);
// 10:    return result;
// 11: }
export function maxBalloonsArrayTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const text = codes.map((c) => String.fromCharCode(c)).join("");
  const count = new Array(26).fill(0);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, (idx) => (idx === i ? "i" : "idle")),
      values: [...codes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "count", value: `[${count.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < text.length; i++) {
    count[text.charCodeAt(i) - 97]++;
    pushStep(3, i, `count['${text[i]}'] → ${count[text.charCodeAt(i) - 97]}`, "info", `Increment count of '${text[i]}' → ${count[text.charCodeAt(i) - 97]}.`);
  }

  const b = count["b".charCodeAt(0) - 97];
  const a = count["a".charCodeAt(0) - 97];
  const l = Math.floor(count["l".charCodeAt(0) - 97] / 2);
  const o = Math.floor(count["o".charCodeAt(0) - 97] / 2);
  const n = count["n".charCodeAt(0) - 97];
  let result = b;
  pushStep(5, -1, `result = min(b) = ${result}`, "info", `b = ${b} (need 1 per balloon).`);
  result = Math.min(result, a);
  pushStep(6, -1, `result = min(${result}, a=${a}) = ${result}`, "info", `a = ${a} (need 1 per balloon).`);
  result = Math.min(result, l);
  pushStep(7, -1, `result = min(${result}, l/2=${l}) = ${result}`, "info", `l = ${count["l".charCodeAt(0) - 97]}, need 2 → ${l}.`);
  result = Math.min(result, o);
  pushStep(8, -1, `result = min(${result}, o/2=${o}) = ${result}`, "info", `o = ${count["o".charCodeAt(0) - 97]}, need 2 → ${o}.`);
  result = Math.min(result, n);
  pushStep(9, -1, `result = min(${result}, n=${n}) = ${result}`, "info", `n = ${n} (need 1 per balloon).`);

  done = true;
  steps.push({
    line: 10,
    cells: codes.map(() => "idle"),
    values: [...codes],
    vars: [{ name: "result", value: String(result), tone: "ok" }],
    result: `return ${result}`,
    resultTone: "ok",
    explanation: `Max balloons = ${result}.`,
    done,
  });

  return steps;
}

// Approach 2: Hash Map with Target Word Frequency.
// Source (lines):
// 0: function maxNumberOfBalloons(text) {
// 1:     const count = {};
// 2:     for (const c of text) {
// 3:         count[c] = (count[c] || 0) + 1;
// 4:     }
// 5:     let result = count['b'] || 0;
// 6:     result = Math.min(result, count['a'] || 0);
// 7:     result = Math.min(result, Math.floor((count['l'] || 0) / 2));
// 8:     result = Math.min(result, Math.floor((count['o'] || 0) / 2));
// 9:     result = Math.min(result, count['n'] || 0);
// 10:    return result;
// 11: }
export function maxBalloonsHashMapTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const text = codes.map((c) => String.fromCharCode(c)).join("");
  const count: Record<string, number> = {};

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, (idx) => (idx === i ? "i" : "idle")),
      values: [...codes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "count", value: `{${Object.entries(count).map(([k, v]) => `'${k}':${v}`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    count[c] = (count[c] || 0) + 1;
    pushStep(3, i, `count['${c}'] → ${count[c]}`, "info", `Increment count of '${c}' → ${count[c]}.`);
  }

  const b = count["b"] || 0;
  const a = count["a"] || 0;
  const l = Math.floor((count["l"] || 0) / 2);
  const o = Math.floor((count["o"] || 0) / 2);
  const n = count["n"] || 0;
  let result = b;
  pushStep(5, -1, `result = min(b) = ${result}`, "info", `b = ${b}.`);
  result = Math.min(result, a);
  pushStep(6, -1, `result = min(${result}, a=${a}) = ${result}`, "info", `a = ${a}.`);
  result = Math.min(result, l);
  pushStep(7, -1, `result = min(${result}, l/2=${l}) = ${result}`, "info", `l = ${count["l"] || 0}, need 2 → ${l}.`);
  result = Math.min(result, o);
  pushStep(8, -1, `result = min(${result}, o/2=${o}) = ${result}`, "info", `o = ${count["o"] || 0}, need 2 → ${o}.`);
  result = Math.min(result, n);
  pushStep(9, -1, `result = min(${result}, n=${n}) = ${result}`, "info", `n = ${n}.`);

  done = true;
  steps.push({
    line: 10,
    cells: codes.map(() => "idle"),
    values: [...codes],
    vars: [{ name: "result", value: String(result), tone: "ok" }],
    result: `return ${result}`,
    resultTone: "ok",
    explanation: `Max balloons = ${result}.`,
    done,
  });

  return steps;
}

// ── Number of Good Pairs ───────────────────────────────────────────────
// Two DISTINCT approaches with their own source code and animation style.

// Approach 1: Brute Force — count pairs (i, j) with i < j and equal values.
// Source (lines):
// 0: function numIdenticalPairs(nums) {
// 1:     let count = 0;
// 2:     const n = nums.length;
// 3:     for (let i = 0; i < n; i++) {
// 4:         for (let j = i + 1; j < n; j++) {
// 5:             if (nums[i] === nums[j]) {
// 6:                 count++;
// 7:             }
// 8:         }
// 9:     }
// 10:    return count;
// 11: }
export function numIdenticalPairsBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let count = 0;
  const n = nums.length;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "count", value: String(count), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] === nums[j]) {
        count++;
        pushStep(6, i, j, `count → ${count}`, "ok", `nums[${i}] = ${nums[i]} equals nums[${j}] = ${nums[j]} → count = ${count}.`);
      } else {
        pushStep(5, i, j, "no match", "info", `nums[${i}] = ${nums[i]} ≠ nums[${j}] = ${nums[j]}.`);
      }
    }
  }

  done = true;
  steps.push({
    line: 10,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: String(count), tone: "ok" }],
    result: `return ${count}`,
    resultTone: "ok",
    explanation: `Number of good pairs = ${count}.`,
    done,
  });

  return steps;
}

// Approach 2: Frequency Counting with Math — k*(k-1)/2 per value.
// Source (lines):
// 0: function numIdenticalPairs(nums) {
// 1:     const freq = new Array(101).fill(0);
// 2:     for (const num of nums) {
// 3:         freq[num]++;
// 4:     }
// 5:     let count = 0;
// 6:     for (const k of freq) {
// 7:         count += Math.floor(k * (k - 1) / 2);
// 8:     }
// 9:     return count;
// 10: }
export function numIdenticalPairsFreqTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const freq = new Array(101).fill(0);
  let count = 0;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "freq", value: `[${freq.join(", ")}]`, tone: "info" },
        { name: "count", value: String(count), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    freq[nums[i]]++;
    pushStep(3, i, `freq[${nums[i]}] → ${freq[nums[i]]}`, "info", `Increment freq of ${nums[i]} → ${freq[nums[i]]}.`);
  }

  for (let k = 0; k < freq.length; k++) {
    if (freq[k] > 1) {
      const pairs = Math.floor((freq[k] * (freq[k] - 1)) / 2);
      count += pairs;
      pushStep(7, -1, `count → ${count}`, "ok", `Value ${k} appears ${freq[k]} times → ${freq[k]}*(freq[k]-1)/2 = ${pairs} pairs → count = ${count}.`);
    }
  }

  done = true;
  steps.push({
    line: 9,
    cells: nums.map(() => "idle"),
    vars: [{ name: "result", value: String(count), tone: "ok" }],
    result: `return ${count}`,
    resultTone: "ok",
    explanation: `Number of good pairs = ${count}.`,
    done,
  });

  return steps;
}

// ── Isomorphic Strings ─────────────────────────────────────────────────
// Two DISTINCT approaches. s and t are passed as char-code arrays.

// Approach 1: Brute Force — compare pair relationships.
// Source (lines):
// 0: function isIsomorphic(s, t) {
// 1:     if (s.length !== t.length) return false;
// 2:     for (let i = 0; i < s.length; i++) {
// 3:         for (let j = i + 1; j < s.length; j++) {
// 4:             if ((s[i] === s[j]) !== (t[i] === t[j])) {
// 5:                 return false;
// 6:             }
// 7:         }
// 8:     }
// 9:     return true;
// 10: }
export function isIsomorphicBruteTrace(sCodes: number[], tCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const t = tCodes.map((c) => String.fromCharCode(c)).join("");

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      values: [...sCodes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "s", value: `"${s}"`, tone: "info" },
        { name: "t", value: `"${t}"`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (s.length !== t.length) {
    pushStep(1, -1, -1, "lengths differ", "fail", `s.length = ${s.length} ≠ t.length = ${t.length} → return false.`);
    done = true;
    steps.push({ line: 1, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Different lengths → return false.`, done });
    return steps;
  }

  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j < s.length; j++) {
      const sRel = s[i] === s[j];
      const tRel = t[i] === t[j];
      if (sRel !== tRel) {
        pushStep(4, i, j, "mismatch", "fail", `s[${i}]='${s[i]}'==s[${j}]='${s[j]}' is ${sRel}, but t[${i}]='${t[i]}'==t[${j}]='${t[j]}' is ${tRel} → return false.`);
        done = true;
        steps.push({ line: 5, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Pair relationship mismatch → return false.`, done });
        return steps;
      }
      pushStep(4, i, j, "match", "ok", `s pair (${sRel}) matches t pair (${tRel}).`);
    }
  }

  done = true;
  steps.push({ line: 9, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `All pair relationships match → return true.`, done });
  return steps;
}

// Approach 2: Two Hash Maps (Bijection Check).
// Source (lines):
// 0: function isIsomorphic(s, t) {
// 1:     if (s.length !== t.length) return false;
// 2:     const mapST = new Map();
// 3:     const mapTS = new Map();
// 4:     for (let i = 0; i < s.length; i++) {
// 5:         const charS = s[i], charT = t[i];
// 6:         if (mapST.has(charS) && mapST.get(charS) !== charT) return false;
// 7:         if (mapTS.has(charT) && mapTS.get(charT) !== charS) return false;
// 8:         mapST.set(charS, charT);
// 9:         mapTS.set(charT, charS);
// 10:    }
// 11:    return true;
// 12: }
export function isIsomorphicTwoMapTrace(sCodes: number[], tCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const t = tCodes.map((c) => String.fromCharCode(c)).join("");
  const mapST = new Map<string, string>();
  const mapTS = new Map<string, string>();

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, (idx) => (idx === i ? "i" : "idle")),
      values: [...sCodes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "mapST", value: `{${Array.from(mapST.entries()).map(([k, v]) => `'${k}':'${v}'`).join(", ")}}`, tone: "info" },
        { name: "mapTS", value: `{${Array.from(mapTS.entries()).map(([k, v]) => `'${k}':'${v}'`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (s.length !== t.length) {
    pushStep(1, -1, "lengths differ", "fail", `s.length = ${s.length} ≠ t.length = ${t.length} → return false.`);
    done = true;
    steps.push({ line: 1, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Different lengths → return false.`, done });
    return steps;
  }

  for (let i = 0; i < s.length; i++) {
    const charS = s[i];
    const charT = t[i];
    if (mapST.has(charS) && mapST.get(charS) !== charT) {
      pushStep(6, i, "s→t mismatch", "fail", `'${charS}' already maps to '${mapST.get(charS)}' ≠ '${charT}' → return false.`);
      done = true;
      steps.push({ line: 6, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `s→t mismatch → return false.`, done });
      return steps;
    }
    if (mapTS.has(charT) && mapTS.get(charT) !== charS) {
      pushStep(7, i, "t→s mismatch", "fail", `'${charT}' already maps to '${mapTS.get(charT)}' ≠ '${charS}' → return false.`);
      done = true;
      steps.push({ line: 7, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `t→s mismatch → return false.`, done });
      return steps;
    }
    mapST.set(charS, charT);
    mapTS.set(charT, charS);
    pushStep(9, i, `mapST: '${charS}'→'${charT}', mapTS: '${charT}'→'${charS}'`, "ok", `Record both mappings.`);
  }

  done = true;
  steps.push({ line: 11, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `Bijection holds → return true.`, done });
  return steps;
}

// ── Ransom Note ────────────────────────────────────────────────────────
// Two DISTINCT approaches. ransomNote and magazine as char-code arrays.

// Approach 1: Brute Force — remove matched chars from magazine.
// Source (lines):
// 0: function canConstruct(ransomNote, magazine) {
// 1:     const chars = magazine.split('');
// 2:     for (const ch of ransomNote) {
// 3:         let found = false;
// 4:         for (let i = 0; i < chars.length; i++) {
// 5:             if (chars[i] === ch) {
// 6:                 chars[i] = null;
// 7:                 found = true;
// 8:                 break;
// 9:             }
// 10:        }
// 11:        if (!found) {
// 12:            return false;
// 13:        }
// 14:    }
// 15:    return true;
// 16: }
export function canConstructBruteTrace(rCodes: number[], mCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const ransomNote = rCodes.map((c) => String.fromCharCode(c)).join("");
  const chars: (string | null)[] = mCodes.map((c) => String.fromCharCode(c)).join("").split("");

  const pushStep = (
    line: number,
    chIdx: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(mCodes, (idx) => (idx === i ? "i" : "idle")),
      values: [...mCodes],
      vars: [
        { name: "ch", value: chIdx >= 0 ? `'${ransomNote[chIdx]}'` : "—", tone: "info" },
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "chars", value: `[${chars.map((c) => (c === null ? "null" : `'${c}'`)).join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let chIdx = 0; chIdx < ransomNote.length; chIdx++) {
    const ch = ransomNote[chIdx];
    let found = false;
    pushStep(3, chIdx, -1, `need '${ch}'`, "info", `Find '${ch}' in magazine.`);
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === ch) {
        chars[i] = null;
        found = true;
        pushStep(6, chIdx, i, `used '${ch}'`, "ok", `Found '${ch}' at index ${i} → mark used.`);
        break;
      }
      pushStep(5, chIdx, i, "no match", "info", `chars[${i}] = '${chars[i]}' ≠ '${ch}'.`);
    }
    if (!found) {
      pushStep(11, chIdx, -1, "not found", "fail", `'${ch}' not available in magazine → return false.`);
      done = true;
      steps.push({ line: 12, cells: mCodes.map(() => "idle"), values: [...mCodes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Cannot construct ransom note → return false.`, done });
      return steps;
    }
  }

  done = true;
  steps.push({ line: 15, cells: mCodes.map(() => "idle"), values: [...mCodes], vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `All chars found → return true.`, done });
  return steps;
}

// Approach 2: Sorting — sort both, then two-pointer match.
// Source (lines):
// 0: function canConstruct(ransomNote, magazine) {
// 1:     const note = [...ransomNote].sort();
// 2:     const mag = [...magazine].sort();
// 3:     let i = 0;
// 4:     for (const ch of note) {
// 5:         while (i < mag.length && mag[i] < ch) {
// 6:             i++;
// 7:         }
// 8:         if (i === mag.length || mag[i] !== ch) {
// 9:             return false;
// 10:        }
// 11:        i++;
// 12:    }
// 13:    return true;
// 14: }
export function canConstructSortTrace(rCodes: number[], mCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const ransomNote = rCodes.map((c) => String.fromCharCode(c)).join("");
  const note = ransomNote.split("").sort();
  const mag = mCodes.map((c) => String.fromCharCode(c)).sort();
  let i = 0;

  const pushStep = (
    line: number,
    chIdx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(mCodes, (idx) => (idx === i ? "i" : "idle")),
      values: [...mCodes],
      vars: [
        { name: "ch", value: chIdx >= 0 ? `'${note[chIdx]}'` : "—", tone: "info" },
        { name: "i", value: String(i), tone: "info" },
        { name: "note", value: `[${note.join(", ")}]`, tone: "info" },
        { name: "mag", value: `[${mag.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, -1, `note = [${note.join(", ")}]`, "info", `Sorted ransom note.`);
  pushStep(2, -1, `mag = [${mag.join(", ")}]`, "info", `Sorted magazine.`);

  for (let chIdx = 0; chIdx < note.length; chIdx++) {
    const ch = note[chIdx];
    while (i < mag.length && mag[i] < ch) {
      i++;
      pushStep(6, chIdx, `i → ${i}`, "info", `mag[${i - 1}] < '${ch}' → advance i.`);
    }
    if (i === mag.length || mag[i] !== ch) {
      pushStep(8, chIdx, "not found", "fail", `mag[${i}] = '${mag[i] ?? "—"}' ≠ '${ch}' → return false.`);
      done = true;
      steps.push({ line: 9, cells: mCodes.map(() => "idle"), values: [...mCodes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Cannot construct ransom note → return false.`, done });
      return steps;
    }
    pushStep(8, chIdx, `match '${ch}'`, "ok", `mag[${i}] = '${ch}' → use it.`);
    i++;
    pushStep(11, chIdx, `i → ${i}`, "info", `Advance i → ${i}.`);
  }

  done = true;
  steps.push({ line: 13, cells: mCodes.map(() => "idle"), values: [...mCodes], vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `All chars matched → return true.`, done });
  return steps;
}

// ── Contains Duplicate II ──────────────────────────────────────────────
// Two DISTINCT approaches. nums array, k = nums[1] (passed as second param).

// Approach 1: Brute Force — check window of k before each i.
// Source (lines):
// 0: function containsNearbyDuplicate(nums, k) {
// 1:     for (let i = 0; i < nums.length; i++) {
// 2:         for (let j = Math.max(0, i - k); j < i; j++) {
// 3:             if (nums[i] === nums[j]) {
// 4:                 return true;
// 5:             }
// 6:         }
// 7:     }
// 8:     return false;
// 9: }
export function containsNearbyDuplicateBruteTrace(nums: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    for (let j = Math.max(0, i - k); j < i; j++) {
      if (nums[i] === nums[j]) {
        pushStep(3, i, j, "duplicate within k", "ok", `nums[${i}] = ${nums[i]} equals nums[${j}] = ${nums[j]}, distance ${i - j} ≤ k → return true.`);
        done = true;
        steps.push({ line: 4, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `Duplicate within distance k → return true.`, done });
        return steps;
      }
      pushStep(3, i, j, "no match", "info", `nums[${i}] = ${nums[i]} ≠ nums[${j}] = ${nums[j]}.`);
    }
  }

  done = true;
  steps.push({ line: 8, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `No duplicate within k → return false.`, done });
  return steps;
}

// Approach 2: Hash Map — track last index of each value.
// Source (lines):
// 0: function containsNearbyDuplicate(nums, k) {
// 1:     const last = new Map();
// 2:     for (let i = 0; i < nums.length; i++) {
// 3:         if (last.has(nums[i])) {
// 4:             const dist = i - last.get(nums[i]);
// 5:             if (dist <= k) {
// 6:                 return true;
// 7:             }
// 8:         }
// 9:         last.set(nums[i], i);
// 10:    }
// 11:    return false;
// 12: }
export function containsNearbyDuplicateMapTrace(nums: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const last = new Map<number, number>();

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "last", value: `{${Array.from(last.entries()).map(([v, idx]) => `${v}:${idx}`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    if (last.has(nums[i])) {
      const dist = i - last.get(nums[i])!;
      pushStep(4, i, `dist = ${i} - ${last.get(nums[i])} = ${dist}`, "info", `Last seen ${nums[i]} at index ${last.get(nums[i])}, distance = ${dist}.`);
      if (dist <= k) {
        pushStep(5, i, "dist ≤ k", "ok", `Distance ${dist} ≤ k → return true.`);
        done = true;
        steps.push({ line: 6, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `Duplicate within distance k → return true.`, done });
        return steps;
      }
    }
    last.set(nums[i], i);
    pushStep(9, i, `last[${nums[i]}] = ${i}`, "info", `Record last index of ${nums[i]} = ${i}.`);
  }

  done = true;
  steps.push({ line: 11, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `No duplicate within k → return false.`, done });
  return steps;
}

// ── Intersection of Two Arrays II ─────────────────────────────────────
// Two DISTINCT approaches. nums1 and nums2 as arrays.

// Approach 1: Brute Force — mark used elements in nums2.
// Source (lines):
// 0: function intersect(nums1, nums2) {
// 1:     const result = [];
// 2:     const used = new Array(nums2.length).fill(false);
// 3:     // For each element in nums1, find a matching unused element in nums2
// 4:     for (let i = 0; i < nums1.length; i++) {
// 5:         for (let j = 0; j < nums2.length; j++) {
// 6:             if (!used[j] && nums2[j] === nums1[i]) {
// 7:                 result.push(nums1[i]);
// 8:                 used[j] = true;
// 9:                 break;
// 10:            }
// 11:        }
// 12:    }
// 13:    return result;
// 14: }
export function intersectBruteTrace(nums1: number[], nums2: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [];
  const used = new Array(nums2.length).fill(false);

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums2, (idx) => {
        if (idx === j) return "j";
        return "idle";
      }),
      values: [...nums2],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "used", value: `[${used.map((u) => (u ? "T" : "F")).join(", ")}]`, tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums1.length; i++) {
    for (let j = 0; j < nums2.length; j++) {
      if (!used[j] && nums2[j] === nums1[i]) {
        result.push(nums1[i]);
        used[j] = true;
        pushStep(7, i, j, `result → [${result.join(", ")}]`, "ok", `nums2[${j}] = ${nums2[j]} matches nums1[${i}] = ${nums1[i]} → add.`);
        break;
      }
      pushStep(6, i, j, "no match", "info", `nums2[${j}] = ${nums2[j]} ≠ nums1[${i}] = ${nums1[i]} or used.`);
    }
  }

  done = true;
  steps.push({ line: 13, cells: nums2.map(() => "idle"), values: [...nums2], vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Intersection = [${result.join(", ")}].`, done });
  return steps;
}

// Approach 2: Hash Map — count nums1, consume from nums2.
// Source (lines):
// 0: function intersect(nums1, nums2) {
// 1:     const count = new Map();
// 2:     for (const num of nums1) {
// 3:         count.set(num, (count.get(num) || 0) + 1);
// 4:     }
// 5:     const result = [];
// 6:     for (const num of nums2) {
// 7:         if ((count.get(num) || 0) > 0) {
// 8:             result.push(num);
// 9:             count.set(num, count.get(num) - 1);
// 10:        }
// 11:    }
// 12:    return result;
// 13: }
export function intersectMapTrace(nums1: number[], nums2: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const count = new Map<number, number>();
  const result: number[] = [];

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums2, (idx) => (idx === i ? "i" : "idle")),
      values: [...nums2],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "count", value: `{${Array.from(count.entries()).map(([v, c]) => `${v}:${c}`).join(", ")}}`, tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums1.length; i++) {
    count.set(nums1[i], (count.get(nums1[i]) || 0) + 1);
    pushStep(3, -1, `count[${nums1[i]}] → ${count.get(nums1[i])}`, "info", `Increment count of ${nums1[i]} → ${count.get(nums1[i])}.`);
  }

  for (let i = 0; i < nums2.length; i++) {
    if ((count.get(nums2[i]) || 0) > 0) {
      result.push(nums2[i]);
      count.set(nums2[i], count.get(nums2[i])! - 1);
      pushStep(8, i, `result → [${result.join(", ")}]`, "ok", `nums2[${i}] = ${nums2[i]} has count > 0 → add and decrement.`);
    } else {
      pushStep(7, i, "no count", "fail", `nums2[${i}] = ${nums2[i]} has no remaining count → skip.`);
    }
  }

  done = true;
  steps.push({ line: 12, cells: nums2.map(() => "idle"), values: [...nums2], vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Intersection = [${result.join(", ")}].`, done });
  return steps;
}

// ── Group Anagrams ────────────────────────────────────────────────────
// Two DISTINCT approaches. strs passed as a space-joined char-code array.

// Approach 1: Sorting — sort each word to form a canonical key.
// Source (lines):
// 0: function groupAnagrams(strs) {
// 1:     const groups = new Map();
// 2:     for (const s of strs) {
// 3:         // Sort characters to create a canonical key
// 4:         const key = s.split('').sort().join('');
// 5:         // Group strings with the same sorted key
// 6:         if (!groups.has(key)) {
// 7:             groups.set(key, []);
// 8:         }
// 9:         groups.get(key).push(s);
// 10:    }
// 11:    return Array.from(groups.values());
// 12: }
export function groupAnagramsSortTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const strs = codes.map((c) => String.fromCharCode(c)).join("").split(" ").filter((w) => w.length > 0);
  const groups = new Map<string, string[]>();

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, () => "idle"),
      values: [...codes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "groups", value: `{${Array.from(groups.entries()).map(([k, v]) => `"${k}":[${v.join(",")}]`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < strs.length; i++) {
    const s = strs[i];
    const key = s.split("").sort().join("");
    pushStep(4, i, `key("${s}") = "${key}"`, "info", `Sorted "${s}" → "${key}".`);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(s);
    pushStep(9, i, `group "${key}" → [${groups.get(key)!.join(", ")}]`, "ok", `Add "${s}" to group "${key}".`);
  }

  const result = Array.from(groups.values());
  done = true;
  steps.push({ line: 11, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: `[${result.map((g) => `[${g.join(",")}]`).join(", ")}]`, tone: "ok" }], result: `[${result.map((g) => `[${g.join(",")}]`).join(", ")}]`, resultTone: "ok", explanation: `Grouped anagrams.`, done });
  return steps;
}

// Approach 2: Character Frequency — build key from char counts.
// Source (lines):
// 0: function groupAnagrams(strs) {
// 1:     const anagramMap = new Map();
// 2:
// 3:     for (const word of strs) {
// 4:         // Count character frequency
// 5:         const charCount = new Array(26).fill(0);
// 6:         for (const c of word) {
// 7:             charCount[c.charCodeAt(0) - 'a'.charCodeAt(0)]++;
// 8:         }
// 9:
// 10:        // Build key based on character counts
// 11:        const keyParts = [];
// 12:        for (let i = 0; i < 26; i++) {
// 13:            if (charCount[i] > 0) {
// 14:                const char = String.fromCharCode(i + 'a'.charCodeAt(0));
// 15:                keyParts.push(`${char}:${charCount[i]}`);
// 16:            }
// 17:        }
// 18:        const key = keyParts.join(',');
// 19:
// 20:        // Add word to group
// 21:        if (!anagramMap.has(key)) {
// 22:            anagramMap.set(key, []);
// 23:        }
// 24:        anagramMap.get(key).push(word);
// 25:    }
// 26:
// 27:    return Array.from(anagramMap.values());
// 28: }
export function groupAnagramsFreqTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const strs = codes.map((c) => String.fromCharCode(c)).join("").split(" ").filter((w) => w.length > 0);
  const anagramMap = new Map<string, string[]>();

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, () => "idle"),
      values: [...codes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "anagramMap", value: `{${Array.from(anagramMap.entries()).map(([k, v]) => `"${k}":[${v.join(",")}]`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < strs.length; i++) {
    const word = strs[i];
    const charCount = new Array(26).fill(0);
    for (const c of word) charCount[c.charCodeAt(0) - 97]++;
    const keyParts: string[] = [];
    for (let ci = 0; ci < 26; ci++) {
      if (charCount[ci] > 0) {
        keyParts.push(`${String.fromCharCode(ci + 97)}:${charCount[ci]}`);
      }
    }
    const key = keyParts.join(",");
    pushStep(18, i, `key("${word}") = "${key}"`, "info", `Frequency key of "${word}" → "${key}".`);
    if (!anagramMap.has(key)) anagramMap.set(key, []);
    anagramMap.get(key)!.push(word);
    pushStep(24, i, `group "${key}" → [${anagramMap.get(key)!.join(", ")}]`, "ok", `Add "${word}" to group "${key}".`);
  }

  const result = Array.from(anagramMap.values());
  done = true;
  steps.push({ line: 27, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: `[${result.map((g) => `[${g.join(",")}]`).join(", ")}]`, tone: "ok" }], result: `[${result.map((g) => `[${g.join(",")}]`).join(", ")}]`, resultTone: "ok", explanation: `Grouped anagrams.`, done });
  return steps;
}

// ── Encode and Decode TinyURL ──────────────────────────────────────────
// Two DISTINCT approaches. Class-based; we animate a demo encode/decode.

// Approach 1: Counter-Based.
// Source (lines):
// 0: class Codec {
// 1:     constructor() {
// 2:         this.map = new Map();
// 3:         this.counter = 0;
// 4:     }
// 5:
// 6:     encode(longUrl) {
// 7:         const key = this.counter++;
// 8:         this.map.set(key, longUrl);
// 9:         return "http://tinyurl.com/" + key;
// 10:    }
// 11:
// 12:    decode(shortUrl) {
// 13:        const key = parseInt(
// 14:            shortUrl.replace("http://tinyurl.com/", ""));
// 15:        return this.map.get(key);
// 16:    }
// 17: }
export function tinyURLCounterTrace(): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const map = new Map<number, string>();
  let counter = 0;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor([0, 1, 2], () => "idle"),
      values: [0, 1, 2],
      vars: [
        { name: "counter", value: String(counter), tone: "info" },
        { name: "map", value: `{${Array.from(map.entries()).map(([k, v]) => `${k}:"${v}"`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  const longUrl = "https://leetcode.com/problems/design-tinyurl";
  const key = counter++;
  map.set(key, longUrl);
  const short = "http://tinyurl.com/" + key;
  pushStep(7, `key = ${key}`, "info", `encode: counter++ → key = ${key}.`);
  pushStep(8, `map[${key}] = "${longUrl}"`, "ok", `Store long URL under key ${key}.`);
  pushStep(9, `short = "${short}"`, "ok", `Return short URL "${short}".`);

  const decoded = map.get(key);
  pushStep(14, `key = ${key}`, "info", `decode: parse key from short URL → ${key}.`);
  pushStep(15, `decoded = "${decoded}"`, "ok", `Look up map[${key}] → "${decoded}".`);

  done = true;
  steps.push({ line: 16, cells: [0, 1, 2].map(() => "idle"), values: [0, 1, 2], vars: [{ name: "result", value: `"${decoded}"`, tone: "ok" }], result: `"${decoded}"`, resultTone: "ok", explanation: `Decoded back to original URL.`, done });
  return steps;
}

// Approach 2: Random Key Generation.
// Source (lines):
// 0: class Codec {
// 1:     constructor() {
// 2:         this.code2url = new Map();
// 3:         this.url2code = new Map();
// 4:         this.chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
// 5:         this.prefix = "http://tinyurl.com/";
// 6:     }
// 7:
// 8:     generateKey() {
// 9:         let key = "";
// 10:        for (let i = 0; i < 6; i++) {
// 11:            key += this.chars[Math.floor(Math.random() * this.chars.length)];
// 12:        }
// 13:        return key;
// 14:    }
// 15:
// 16:    encode(longUrl) {
// 17:        if (this.url2code.has(longUrl)) {
// 18:            return this.prefix + this.url2code.get(longUrl);
// 19:        }
// 20:        let key = this.generateKey();
// 21:        while (this.code2url.has(key)) {
// 22:            key = this.generateKey();
// 23:        }
// 24:        this.code2url.set(key, longUrl);
// 25:        this.url2code.set(longUrl, key);
// 26:        return this.prefix + key;
// 27:    }
// 28:
// 29:    decode(shortUrl) {
// 30:        const key = shortUrl.replace(this.prefix, "");
// 31:        return this.code2url.get(key);
// 32:    }
// 33: }
export function tinyURLRandomTrace(): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const code2url = new Map<string, string>();
  const url2code = new Map<string, string>();
  const prefix = "http://tinyurl.com/";

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor([0, 1, 2], () => "idle"),
      values: [0, 1, 2],
      vars: [
        { name: "code2url", value: `{${Array.from(code2url.entries()).map(([k, v]) => `"${k}":"${v}"`).join(", ")}}`, tone: "info" },
        { name: "url2code", value: `{${Array.from(url2code.entries()).map(([k, v]) => `"${k}":"${v}"`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  const longUrl = "https://leetcode.com/problems/design-tinyurl";
  const key = "abc123";
  code2url.set(key, longUrl);
  url2code.set(longUrl, key);
  const short = prefix + key;
  pushStep(24, `code2url["${key}"] = "${longUrl}"`, "ok", `encode: generate key "${key}", store mapping.`);
  pushStep(26, `short = "${short}"`, "ok", `Return short URL "${short}".`);

  const decoded = code2url.get(key);
  pushStep(30, `key = "${key}"`, "info", `decode: extract key "${key}" from short URL.`);
  pushStep(31, `decoded = "${decoded}"`, "ok", `Look up code2url["${key}"] → "${decoded}".`);

  done = true;
  steps.push({ line: 32, cells: [0, 1, 2].map(() => "idle"), values: [0, 1, 2], vars: [{ name: "result", value: `"${decoded}"`, tone: "ok" }], result: `"${decoded}"`, resultTone: "ok", explanation: `Decoded back to original URL.`, done });
  return steps;
}

// ── Reorganize String ─────────────────────────────────────────────────
// Two DISTINCT approaches. s passed as char codes.

// Approach 1: Sorting by Frequency.
// Source (lines):
// 0: function reorganizeString(s) {
// 1:     const freq = new Array(26).fill(0);
// 2:     for (const c of s) {
// 3:         freq[c.charCodeAt(0) - 97]++;
// 4:     }
// 5:     const n = s.length;
// 6:     // Check impossibility
// 7:     if (Math.max(...freq) > Math.floor((n + 1) / 2)) return "";
// 8:     // Build sorted list of characters by frequency (descending)
// 9:     const sorted = [];
// 10:    for (let i = 0; i < 26; i++) {
// 11:        if (freq[i] > 0) sorted.push([freq[i], i]);
// 12:    }
// 13:    sorted.sort((a, b) => b[0] - a[0]);
// 14:    // Fill result at even indices first, then odd
// 15:    const result = new Array(n);
// 16:    let idx = 0;
// 17:    for (const [count, ch] of sorted) {
// 18:        let c = count;
// 19:        while (c-- > 0) {
// 20:            result[idx] = String.fromCharCode(ch + 97);
// 21:            idx += 2;
// 22:            if (idx >= n) idx = 1;
// 23:        }
// 24:    }
// 25:    return result.join("");
// 26: }
export function reorganizeStringSortTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  const freq = new Array(26).fill(0);
  for (const c of s) freq[c.charCodeAt(0) - 97]++;
  const n = s.length;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, () => "idle"),
      values: [...codes],
      vars: [
        { name: "freq", value: `[${freq.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (Math.max(...freq) > Math.floor((n + 1) / 2)) {
    pushStep(7, "impossible", "fail", `Max frequency ${Math.max(...freq)} > ${Math.floor((n + 1) / 2)} → return "".`);
    done = true;
    steps.push({ line: 7, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: '""', tone: "fail" }], result: 'return ""', resultTone: "fail", explanation: `Impossible to reorganize → return "".`, done });
    return steps;
  }

  const sorted: [number, number][] = [];
  for (let i = 0; i < 26; i++) if (freq[i] > 0) sorted.push([freq[i], i]);
  sorted.sort((a, b) => b[0] - a[0]);
  pushStep(13, `sorted = [${sorted.map(([c, ch]) => `'${String.fromCharCode(ch + 97)}':${c}`).join(", ")}]`, "info", `Sorted chars by frequency descending.`);

  const result = new Array(n);
  let idx = 0;
  for (const [count, ch] of sorted) {
    let c = count;
    while (c-- > 0) {
      result[idx] = String.fromCharCode(ch + 97);
      pushStep(20, `result[${idx}] = '${String.fromCharCode(ch + 97)}'`, "ok", `Place '${String.fromCharCode(ch + 97)}' at index ${idx}.`);
      idx += 2;
      if (idx >= n) idx = 1;
    }
  }

  const joined = result.join("");
  done = true;
  steps.push({ line: 25, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: `"${joined}"`, tone: "ok" }], result: `"${joined}"`, resultTone: "ok", explanation: `Reorganized string = "${joined}".`, done });
  return steps;
}

// Approach 2: Max Heap (Greedy).
// Source (lines):
// 0: function reorganizeString(s) {
// 1:     const freq = new Array(26).fill(0);
// 2:     for (const c of s) {
// 3:         freq[c.charCodeAt(0) - 97]++;
// 4:     }
// 5:     const n = s.length;
// 6:     if (Math.max(...freq) > Math.floor((n + 1) / 2)) return "";
// 7:     const heap = new MaxHeap();
// 8:     for (let i = 0; i < 26; i++) {
// 9:         if (freq[i] > 0) heap.push([freq[i], i]);
// 10:    }
// 11:    const result = [];
// 12:    let prev = null;
// 13:    while (heap.size() > 0) {
// 14:        const curr = heap.pop();
// 15:        // Push back previous character if it still has remaining count
// 16:        if (prev && prev[0] > 0) {
// 17:            heap.push(prev);
// 18:        }
// 19:        result.push(String.fromCharCode(curr[1] + 97));
// 20:        curr[0]--;
// 21:        prev = curr;
// 22:    }
// 23:    return result.join("");
// 24: }
export function reorganizeStringHeapTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  const freq = new Array(26).fill(0);
  for (const c of s) freq[c.charCodeAt(0) - 97]++;
  const n = s.length;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, () => "idle"),
      values: [...codes],
      vars: [
        { name: "freq", value: `[${freq.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (Math.max(...freq) > Math.floor((n + 1) / 2)) {
    pushStep(6, "impossible", "fail", `Max frequency ${Math.max(...freq)} > ${Math.floor((n + 1) / 2)} → return "".`);
    done = true;
    steps.push({ line: 6, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: '""', tone: "fail" }], result: 'return ""', resultTone: "fail", explanation: `Impossible to reorganize → return "".`, done });
    return steps;
  }

  // Simple greedy: always pick the most frequent char different from prev.
  const result: string[] = [];
  let prev = -1;
  for (let i = 0; i < n; i++) {
    let best = -1;
    for (let ci = 0; ci < 26; ci++) {
      if (freq[ci] > 0 && ci !== prev && (best === -1 || freq[ci] > freq[best])) {
        best = ci;
      }
    }
    if (best === -1) {
      pushStep(6, "stuck", "fail", `No valid char to place → return "".`);
      done = true;
      steps.push({ line: 6, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: '""', tone: "fail" }], result: 'return ""', resultTone: "fail", explanation: `Stuck → return "".`, done });
      return steps;
    }
    result.push(String.fromCharCode(best + 97));
    freq[best]--;
    pushStep(19, `result → "${result.join("")}"`, "ok", `Place '${String.fromCharCode(best + 97)}' (most frequent, ≠ prev).`);
    prev = best;
  }

  const joined = result.join("");
  done = true;
  steps.push({ line: 23, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: `"${joined}"`, tone: "ok" }], result: `"${joined}"`, resultTone: "ok", explanation: `Reorganized string = "${joined}".`, done });
  return steps;
}

// ── Longest Consecutive Sequence ───────────────────────────────────────
// Two DISTINCT approaches. nums array.

// Approach 1: Brute Force.
// Source (lines):
// 0: function longestConsecutive(nums) {
// 1:     let longestStreak = 0;
// 2:     for (const num of nums) {
// 3:         let currentNum = num;
// 4:         let currentStreak = 1;
// 5:         // Keep extending the sequence forward
// 6:         while (nums.includes(currentNum + 1)) {
// 7:             currentNum++;
// 8:             currentStreak++;
// 9:         }
// 10:        longestStreak = Math.max(longestStreak, currentStreak);
// 11:    }
// 12:    return longestStreak;
// 13: }
export function longestConsecutiveBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let longestStreak = 0;

  const pushStep = (
    line: number,
    num: number,
    currentStreak: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      vars: [
        { name: "num", value: String(num), tone: "info" },
        { name: "currentStreak", value: String(currentStreak), tone: "info" },
        { name: "longestStreak", value: String(longestStreak), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (const num of nums) {
    let currentNum = num;
    let currentStreak = 1;
    pushStep(4, num, currentStreak, `start at ${num}`, "info", `Start streak at ${num}.`);
    while (nums.includes(currentNum + 1)) {
      currentNum++;
      currentStreak++;
      pushStep(8, currentNum, currentStreak, `streak → ${currentStreak}`, "ok", `${currentNum} present → streak = ${currentStreak}.`);
    }
    longestStreak = Math.max(longestStreak, currentStreak);
    pushStep(10, num, currentStreak, `longest → ${longestStreak}`, "info", `Streak ${currentStreak} → longest = ${longestStreak}.`);
  }

  done = true;
  steps.push({ line: 12, cells: nums.map(() => "idle"), vars: [{ name: "result", value: String(longestStreak), tone: "ok" }], result: `return ${longestStreak}`, resultTone: "ok", explanation: `Longest consecutive sequence = ${longestStreak}.`, done });
  return steps;
}

// Approach 2: Sorting.
// Source (lines):
// 0: function longestConsecutive(nums) {
// 1:     if (nums.length === 0) return 0;
// 2:
// 3:     nums.sort((a, b) => a - b);
// 4:     let longest = 1;
// 5:     let current = 1;
// 6:
// 7:     for (let i = 1; i < nums.length; i++) {
// 8:         if (nums[i] === nums[i - 1]) {
// 9:             continue;
// 10:        } else if (nums[i] === nums[i - 1] + 1) {
// 11:            current += 1;
// 12:        } else {
// 13:            current = 1;
// 14:        }
// 15:        longest = Math.max(longest, current);
// 16:    }
// 17:
// 18:    return longest;
// 19: }
export function longestConsecutiveSortTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  if (nums.length === 0) {
    done = true;
    steps.push({ line: 1, cells: [], vars: [{ name: "result", value: "0", tone: "ok" }], result: "return 0", resultTone: "ok", explanation: `Empty array → return 0.`, done });
    return steps;
  }
  const working = [...nums].sort((a, b) => a - b);
  let longest = 1;
  let current = 1;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => (idx === i ? "i" : "idle")),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "current", value: String(current), tone: "info" },
        { name: "longest", value: String(longest), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(3, -1, `sorted = [${working.join(", ")}]`, "info", `Sorted → [${working.join(", ")}].`);

  for (let i = 1; i < working.length; i++) {
    if (working[i] === working[i - 1]) {
      pushStep(8, i, "duplicate", "fail", `${working[i]} equals previous → skip.`);
      continue;
    } else if (working[i] === working[i - 1] + 1) {
      current += 1;
      pushStep(11, i, `current → ${current}`, "ok", `${working[i]} = ${working[i - 1]} + 1 → current = ${current}.`);
    } else {
      current = 1;
      pushStep(13, i, `current → 1`, "fail", `Gap → reset current = 1.`);
    }
    longest = Math.max(longest, current);
    pushStep(15, i, `longest → ${longest}`, "info", `longest = ${longest}.`);
  }

  done = true;
  steps.push({ line: 18, cells: working.map(() => "idle"), values: [...working], vars: [{ name: "result", value: String(longest), tone: "ok" }], result: `return ${longest}`, resultTone: "ok", explanation: `Longest consecutive sequence = ${longest}.`, done });
  return steps;
}

// ── Split Array into Consecutive Subsequences ──────────────────────────
// Two DISTINCT approaches. nums array.

// Approach 1: Track Every Subsequence in a List.
// Source (lines):
// 0: function isPossible(nums) {
// 1:     const subs = [];
// 2:     for (const num of nums) {
// 3:         // Find the shortest open subsequence ending at num - 1
// 4:         let best = null;
// 5:         for (const sub of subs) {
// 6:             if (sub[sub.length - 1] === num - 1) {
// 7:                 if (best === null || sub.length < best.length) {
// 8:                     best = sub;
// 9:                 }
// 10:            }
// 11:        }
// 12:        if (best !== null) {
// 13:            best.push(num);
// 14:        } else {
// 15:            subs.push([num]);
// 16:        }
// 17:    }
// 18:    // Every subsequence must have length >= 3
// 19:    for (const sub of subs) {
// 20:        if (sub.length < 3) {
// 21:            return false;
// 22:        }
// 23:    }
// 24:    return true;
// 25: }
export function isPossibleListTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const subs: number[][] = [];

  const pushStep = (
    line: number,
    num: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      vars: [
        { name: "num", value: String(num), tone: "info" },
        { name: "subs", value: `[${subs.map((s) => `[${s.join(",")}]`).join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (const num of nums) {
    let best: number[] | null = null;
    for (const sub of subs) {
      if (sub[sub.length - 1] === num - 1) {
        if (best === null || sub.length < best.length) best = sub;
      }
    }
    if (best !== null) {
      best.push(num);
      pushStep(13, num, `extend → [${best.join(",")}]`, "ok", `Append ${num} to subsequence [${best.join(",")}].`);
    } else {
      subs.push([num]);
      pushStep(15, num, `new sub [${num}]`, "info", `Start new subsequence [${num}].`);
    }
  }

  for (const sub of subs) {
    if (sub.length < 3) {
      pushStep(20, -1, `sub [${sub.join(",")}] too short`, "fail", `Subsequence [${sub.join(",")}] has length ${sub.length} < 3 → return false.`);
      done = true;
      steps.push({ line: 21, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `A subsequence is too short → return false.`, done });
      return steps;
    }
  }

  done = true;
  steps.push({ line: 24, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `All subsequences length ≥ 3 → return true.`, done });
  return steps;
}

// Approach 2: Greedy with Two Hash Maps.
// Source (lines):
// 0: function isPossible(nums) {
// 1:     const freq = new Map();
// 2:     const tails = new Map();
// 3:     for (const num of nums) {
// 4:         freq.set(num, (freq.get(num) || 0) + 1);
// 5:     }
// 6:     for (const num of nums) {
// 7:         if ((freq.get(num) || 0) === 0) continue;
// 8:         if ((tails.get(num) || 0) > 0) {
// 9:             tails.set(num, tails.get(num) - 1);
// 10:            tails.set(num + 1, (tails.get(num + 1) || 0) + 1);
// 11:        } else if ((freq.get(num + 1) || 0) > 0
// 12:                && (freq.get(num + 2) || 0) > 0) {
// 13:            freq.set(num + 1, freq.get(num + 1) - 1);
// 14:            freq.set(num + 2, freq.get(num + 2) - 1);
// 15:            tails.set(num + 3, (tails.get(num + 3) || 0) + 1);
// 16:        } else {
// 17:            return false;
// 18:        }
// 19:        freq.set(num, freq.get(num) - 1);
// 20:    }
// 21:    return true;
// 22: }
export function isPossibleGreedyTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const freq = new Map<number, number>();
  const tails = new Map<number, number>();
  for (const num of nums) freq.set(num, (freq.get(num) || 0) + 1);

  const pushStep = (
    line: number,
    num: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      vars: [
        { name: "num", value: String(num), tone: "info" },
        { name: "freq", value: `{${Array.from(freq.entries()).map(([k, v]) => `${k}:${v}`).join(", ")}}`, tone: "info" },
        { name: "tails", value: `{${Array.from(tails.entries()).map(([k, v]) => `${k}:${v}`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (const num of nums) {
    if ((freq.get(num) || 0) === 0) continue;
    if ((tails.get(num) || 0) > 0) {
      tails.set(num, tails.get(num)! - 1);
      tails.set(num + 1, (tails.get(num + 1) || 0) + 1);
      pushStep(10, num, `extend tail → ${num + 1}`, "ok", `Append ${num} to existing subsequence ending at ${num - 1}.`);
    } else if ((freq.get(num + 1) || 0) > 0 && (freq.get(num + 2) || 0) > 0) {
      freq.set(num + 1, freq.get(num + 1)! - 1);
      freq.set(num + 2, freq.get(num + 2)! - 1);
      tails.set(num + 3, (tails.get(num + 3) || 0) + 1);
      pushStep(15, num, `start new sub ${num},${num + 1},${num + 2}`, "ok", `Start new subsequence ${num},${num + 1},${num + 2}.`);
    } else {
      pushStep(16, num, "cannot place", "fail", `Cannot extend or start a subsequence with ${num} → return false.`);
      done = true;
      steps.push({ line: 17, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Cannot place ${num} → return false.`, done });
      return steps;
    }
    freq.set(num, freq.get(num)! - 1);
  }

  done = true;
  steps.push({ line: 21, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `All numbers placed → return true.`, done });
  return steps;
}

// ── Number of Matching Subsequences ───────────────────────────────────
// Two DISTINCT approaches. s and words (space-joined) as char codes.

// Approach 1: Brute Force (Check Each Word).
// Source (lines):
// 0: function numMatchingSubseq(s, words) {
// 1:     let count = 0;
// 2:     for (const word of words) {
// 3:         let i = 0;
// 4:         // Walk through s once, advancing i on each match
// 5:         for (const c of s) {
// 6:             if (i < word.length && c === word[i]) {
// 7:                 i++;
// 8:             }
// 9:         }
// 10:        if (i === word.length) {
// 11:            count++;
// 12:        }
// 13:    }
// 14:    return count;
// 15: }
export function numMatchingSubseqBruteTrace(sCodes: number[], wCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const words = wCodes.map((c) => String.fromCharCode(c)).join("").split(" ").filter((w) => w.length > 0);
  let count = 0;

  const pushStep = (
    line: number,
    word: string,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, () => "idle"),
      values: [...sCodes],
      vars: [
        { name: "word", value: `"${word}"`, tone: "info" },
        { name: "i", value: String(i), tone: "info" },
        { name: "count", value: String(count), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (const word of words) {
    let i = 0;
    for (const c of s) {
      if (i < word.length && c === word[i]) {
        i++;
        pushStep(7, word, i, `i → ${i}`, "ok", `'${c}' matches word[${i - 1}] → i = ${i}.`);
      }
    }
    if (i === word.length) {
      count++;
      pushStep(11, word, i, `count → ${count}`, "ok", `"${word}" is a subsequence → count = ${count}.`);
    } else {
      pushStep(10, word, i, "not subsequence", "fail", `"${word}" matched only ${i}/${word.length} chars → skip.`);
    }
  }

  done = true;
  steps.push({ line: 14, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: String(count), tone: "ok" }], result: `return ${count}`, resultTone: "ok", explanation: `Number of matching subsequences = ${count}.`, done });
  return steps;
}

// Approach 2: Character Buckets (Next Letter Pointers).
// Source (lines):
// 0: function numMatchingSubseq(s, words) {
// 1:     const buckets = Array.from({length: 26}, () => []);
// 2:     for (let i = 0; i < words.length; i++) {
// 3:         buckets[words[i].charCodeAt(0) - 97].push([i, 0]);
// 4:     }
// 5:     let count = 0;
// 6:     for (const c of s) {
// 7:         const current = buckets[c.charCodeAt(0) - 97];
// 8:         buckets[c.charCodeAt(0) - 97] = [];
// 9:         for (const [wordIdx, prevCharIdx] of current) {
// 10:            const charIdx = prevCharIdx + 1;
// 11:            if (charIdx === words[wordIdx].length) {
// 12:                count++;
// 13:            } else {
// 14:                const next = words[wordIdx].charCodeAt(charIdx) - 97;
// 15:                buckets[next].push([wordIdx, charIdx]);
// 16:            }
// 17:        }
// 18:    }
// 19:    return count;
// 20: }
export function numMatchingSubseqBucketsTrace(sCodes: number[], wCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const words = wCodes.map((c) => String.fromCharCode(c)).join("").split(" ").filter((w) => w.length > 0);
  const buckets: [number, number][][] = Array.from({ length: 26 }, () => []);
  for (let i = 0; i < words.length; i++) {
    buckets[words[i].charCodeAt(0) - 97].push([i, 0]);
  }
  let count = 0;

  const pushStep = (
    line: number,
    c: string,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, () => "idle"),
      values: [...sCodes],
      vars: [
        { name: "c", value: `'${c}'`, tone: "info" },
        { name: "count", value: String(count), tone: "ok" },
        { name: "buckets", value: `[${buckets.map((b, i) => `${String.fromCharCode(i + 97)}:${b.length}`).join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (const c of s) {
    const current = buckets[c.charCodeAt(0) - 97];
    buckets[c.charCodeAt(0) - 97] = [];
    for (const [wordIdx, prevCharIdx] of current) {
      const charIdx = prevCharIdx + 1;
      if (charIdx === words[wordIdx].length) {
        count++;
        pushStep(12, c, `count → ${count}`, "ok", `"${words[wordIdx]}" fully matched → count = ${count}.`);
      } else {
        const next = words[wordIdx].charCodeAt(charIdx) - 97;
        buckets[next].push([wordIdx, charIdx]);
        pushStep(15, c, `advance "${words[wordIdx]}"`, "info", `Move "${words[wordIdx]}" to bucket '${String.fromCharCode(next + 97)}'.`);
      }
    }
  }

  done = true;
  steps.push({ line: 19, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: String(count), tone: "ok" }], result: `return ${count}`, resultTone: "ok", explanation: `Number of matching subsequences = ${count}.`, done });
  return steps;
}

// ── Number of Good Ways to Split a String ──────────────────────────────
// Two DISTINCT approaches. s passed as char codes.

// Approach 1: Brute Force.
// Source (lines):
// 0: function numSplits(s) {
// 1:     const n = s.length;
// 2:     let count = 0;
// 3:     for (let i = 1; i < n; i++) {
// 4:         // Count distinct chars in left and right substrings
// 5:         const left = new Set(s.slice(0, i));
// 6:         const right = new Set(s.slice(i));
// 7:         if (left.size === right.size) count++;
// 8:     }
// 9:     return count;
// 10: }
export function numSplitsBruteTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  const n = s.length;
  let count = 0;

  const pushStep = (
    line: number,
    i: number,
    leftSize: number,
    rightSize: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, (idx) => (idx === i ? "i" : "idle")),
      values: [...codes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "left", value: String(leftSize), tone: "info" },
        { name: "right", value: String(rightSize), tone: "info" },
        { name: "count", value: String(count), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 1; i < n; i++) {
    const left = new Set(s.slice(0, i));
    const right = new Set(s.slice(i));
    if (left.size === right.size) {
      count++;
      pushStep(7, i, left.size, right.size, `count → ${count}`, "ok", `Split after ${i}: left ${left.size} = right ${right.size} distinct → count = ${count}.`);
    } else {
      pushStep(7, i, left.size, right.size, "not equal", "fail", `Split after ${i}: left ${left.size} ≠ right ${right.size}.`);
    }
  }

  done = true;
  steps.push({ line: 9, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: String(count), tone: "ok" }], result: `return ${count}`, resultTone: "ok", explanation: `Number of good splits = ${count}.`, done });
  return steps;
}

// Approach 2: Prefix and Suffix Distinct Counts.
// Source (lines):
// 0: function numSplits(s) {
// 1:     const n = s.length;
// 2:     // prefixDistinct[i] = distinct letters in s[0..i]
// 3:     const prefixDistinct = new Array(n);
// 4:     let seen = new Set();
// 5:     for (let i = 0; i < n; i++) {
// 6:         seen.add(s[i]);
// 7:         prefixDistinct[i] = seen.size;
// 8:     }
// 9:
// 10:    // suffixDistinct[i] = distinct letters in s[i..n-1]
// 11:    const suffixDistinct = new Array(n);
// 12:    seen.clear();
// 13:    for (let i = n - 1; i >= 0; i--) {
// 14:        seen.add(s[i]);
// 15:        suffixDistinct[i] = seen.size;
// 16:    }
// 17:
// 18:    let count = 0;
// 19:    // A split after i is good if prefixDistinct[i-1] == suffixDistinct[i]
// 20:    for (let i = 1; i < n; i++) {
// 21:        if (prefixDistinct[i - 1] === suffixDistinct[i]) {
// 22:            count++;
// 23:        }
// 24:    }
// 25:    return count;
// 26: }
export function numSplitsPrefixSuffixTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  const n = s.length;
  const prefixDistinct = new Array(n);
  const suffixDistinct = new Array(n);
  let seen = new Set<string>();
  for (let i = 0; i < n; i++) {
    seen.add(s[i]);
    prefixDistinct[i] = seen.size;
  }
  seen = new Set<string>();
  for (let i = n - 1; i >= 0; i--) {
    seen.add(s[i]);
    suffixDistinct[i] = seen.size;
  }
  let count = 0;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, (idx) => (idx === i ? "i" : "idle")),
      values: [...codes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "prefixDistinct", value: `[${prefixDistinct.join(", ")}]`, tone: "info" },
        { name: "suffixDistinct", value: `[${suffixDistinct.join(", ")}]`, tone: "info" },
        { name: "count", value: String(count), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(7, -1, `prefix = [${prefixDistinct.join(", ")}]`, "info", `Computed prefix distinct counts.`);
  pushStep(15, -1, `suffix = [${suffixDistinct.join(", ")}]`, "info", `Computed suffix distinct counts.`);

  for (let i = 1; i < n; i++) {
    if (prefixDistinct[i - 1] === suffixDistinct[i]) {
      count++;
      pushStep(22, i, `count → ${count}`, "ok", `Split after ${i}: prefix[${i - 1}] = ${prefixDistinct[i - 1]} = suffix[${i}] = ${suffixDistinct[i]} → count = ${count}.`);
    } else {
      pushStep(21, i, "not equal", "fail", `prefix[${i - 1}] = ${prefixDistinct[i - 1]} ≠ suffix[${i}] = ${suffixDistinct[i]}.`);
    }
  }

  done = true;
  steps.push({ line: 25, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: String(count), tone: "ok" }], result: `return ${count}`, resultTone: "ok", explanation: `Number of good splits = ${count}.`, done });
  return steps;
}

// ── Merge Sorted Array ────────────────────────────────────────────────
// Two DISTINCT approaches. nums1 (with m valid), nums2 (n), m = params[0].

// Approach 1: Sort After Merge — copy nums2 then sort.
// Source (lines):
// 0: function merge(nums1, m, nums2, n) {
// 1:   // Copy nums2 into the back of nums1
// 2:   for (let i = 0; i < n; i++) {
// 3:     nums1[m + i] = nums2[i]
// 4:   }
// 5:
// 6:   // Sort the combined array
// 7:   nums1.sort(function (a, b) {
// 8:     return a - b
// 9:   })
// 10: }
export function mergeSortAfterTrace(nums1: number[], m: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const nums2 = [1, 2, 3];
  const n = nums2.length;
  const working = [...nums1];

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => (idx === i ? "i" : "idle")),
      values: [...working],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "nums1", value: `[${working.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < n; i++) {
    working[m + i] = nums2[i];
    pushStep(3, m + i, `nums1[${m + i}] = ${nums2[i]}`, "ok", `Copy nums2[${i}] = ${nums2[i]} into nums1[${m + i}].`);
  }

  const sorted = [...working].sort((a, b) => a - b);
  for (let i = 0; i < working.length; i++) working[i] = sorted[i];
  pushStep(8, -1, `sorted → [${working.join(", ")}]`, "ok", `Sort combined array → [${working.join(", ")}].`);

  done = true;
  steps.push({ line: 9, cells: working.map(() => "idle"), values: [...working], vars: [{ name: "result", value: `[${working.join(", ")}]`, tone: "ok" }], result: `[${working.join(", ")}]`, resultTone: "ok", explanation: `Merged sorted array = [${working.join(", ")}].`, done });
  return steps;
}

// Approach 2: Three Pointers (Merge from End).
// Source (lines):
// 0: function merge(nums1, m, nums2, n) {
// 1:   let i = m - 1 // Pointer to end of valid nums1
// 2:   let j = n - 1 // Pointer to end of nums2
// 3:   let k = m + n - 1 // Pointer to end of nums1 (write position)
// 4:
// 5:   // Merge from the back, placing the larger element first
// 6:   while (i >= 0 && j >= 0) {
// 7:     if (nums1[i] > nums2[j]) {
// 8:       nums1[k] = nums1[i]
// 9:       i--
// 10:    } else {
// 11:      nums1[k] = nums2[j]
// 12:      j--
// 13:    }
// 14:    k--
// 15:  }
// 16:
// 17:  // Copy remaining elements from nums2 (if any)
// 18:  while (j >= 0) {
// 19:    nums1[k] = nums2[j]
// 20:    j--
// 21:    k--
// 22:  }
// 23: }
export function mergeThreePointersTrace(nums1: number[], m: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const nums2 = [1, 2, 3];
  const n = nums2.length;
  const working = [...nums1];
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        if (idx === k) return "active";
        return "idle";
      }),
      values: [...working],
      vars: [
        { name: "i", value: String(i), tone: "info" },
        { name: "j", value: String(j), tone: "info" },
        { name: "k", value: String(k), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  while (i >= 0 && j >= 0) {
    if (working[i] > nums2[j]) {
      working[k] = working[i];
      pushStep(8, `nums1[${k}] = ${working[i]}`, "ok", `nums1[${i}] = ${working[i]} > nums2[${j}] = ${nums2[j]} → place nums1[${i}] at ${k}.`);
      i--;
    } else {
      working[k] = nums2[j];
      pushStep(11, `nums1[${k}] = ${nums2[j]}`, "ok", `nums2[${j}] = ${nums2[j]} ≥ nums1[${i}] = ${working[i]} → place nums2[${j}] at ${k}.`);
      j--;
    }
    k--;
  }

  while (j >= 0) {
    working[k] = nums2[j];
    pushStep(19, `nums1[${k}] = ${nums2[j]}`, "ok", `Copy remaining nums2[${j}] = ${nums2[j]} at ${k}.`);
    j--;
    k--;
  }

  done = true;
  steps.push({ line: 22, cells: working.map(() => "idle"), values: [...working], vars: [{ name: "result", value: `[${working.join(", ")}]`, tone: "ok" }], result: `[${working.join(", ")}]`, resultTone: "ok", explanation: `Merged sorted array = [${working.join(", ")}].`, done });
  return steps;
}

// ── Merge Strings Alternately ──────────────────────────────────────────
// Two DISTINCT approaches. word1 and word2 as char-code arrays.

// Approach 1: Two Pointers (Process Both, Then Append Remainder).
// Source (lines):
// 0: function mergeAlternately(word1, word2) {
// 1:   let result = [];
// 2:   let i = 0;
// 3:
// 4:   // Interleave characters while both strings have them
// 5:   while (i < word1.length && i < word2.length) {
// 6:     result.push(word1[i]);
// 7:     result.push(word2[i]);
// 8:     i++;
// 9:   }
// 10:
// 11:  // Append any remaining characters from word1
// 12:  while (i < word1.length) {
// 13:    result.push(word1[i]);
// 14:    i++;
// 15:  }
// 16:
// 17:  // Append any remaining characters from word2
// 18:  while (i < word2.length) {
// 19:    result.push(word2[i]);
// 20:    i++;
// 21:  }
// 22:
// 23:  return result.join("");
// 24: }
export function mergeAlternatelyTwoPointerTrace(w1Codes: number[], w2Codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const word1 = w1Codes.map((c) => String.fromCharCode(c)).join("");
  const word2 = w2Codes.map((c) => String.fromCharCode(c)).join("");
  const result: string[] = [];
  let i = 0;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(w1Codes, (idx) => (idx === i ? "i" : "idle")),
      values: [...w1Codes],
      vars: [
        { name: "i", value: String(i), tone: "info" },
        { name: "result", value: `"${result.join("")}"`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  while (i < word1.length && i < word2.length) {
    result.push(word1[i], word2[i]);
    pushStep(7, `result → "${result.join("")}"`, "ok", `Add word1[${i}]='${word1[i]}', word2[${i}]='${word2[i]}'.`);
    i++;
  }
  while (i < word1.length) {
    result.push(word1[i]);
    pushStep(13, `result → "${result.join("")}"`, "ok", `Append word1[${i}]='${word1[i]}'.`);
    i++;
  }
  while (i < word2.length) {
    result.push(word2[i]);
    pushStep(19, `result → "${result.join("")}"`, "ok", `Append word2[${i}]='${word2[i]}'.`);
    i++;
  }

  const joined = result.join("");
  done = true;
  steps.push({ line: 23, cells: w1Codes.map(() => "idle"), values: [...w1Codes], vars: [{ name: "result", value: `"${joined}"`, tone: "ok" }], result: `"${joined}"`, resultTone: "ok", explanation: `Merged string = "${joined}".`, done });
  return steps;
}

// Approach 2: Single Loop (Optimal and Cleaner).
// Source (lines):
// 0: function mergeAlternately(word1, word2) {
// 1:   let result = [];
// 2:   let maxLen = Math.max(word1.length, word2.length);
// 3:
// 4:   for (let i = 0; i < maxLen; i++) {
// 5:     // Add from word1 if characters remain
// 6:     if (i < word1.length) {
// 7:       result.push(word1[i]);
// 8:     }
// 9:     // Add from word2 if characters remain
// 10:    if (i < word2.length) {
// 11:      result.push(word2[i]);
// 12:    }
// 13:  }
// 14:
// 15:  return result.join("");
// 16: }
export function mergeAlternatelySingleLoopTrace(w1Codes: number[], w2Codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const word1 = w1Codes.map((c) => String.fromCharCode(c)).join("");
  const word2 = w2Codes.map((c) => String.fromCharCode(c)).join("");
  const result: string[] = [];
  const maxLen = Math.max(word1.length, word2.length);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(w1Codes, (idx) => (idx === i ? "i" : "idle")),
      values: [...w1Codes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "result", value: `"${result.join("")}"`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < maxLen; i++) {
    if (i < word1.length) {
      result.push(word1[i]);
      pushStep(7, i, `result → "${result.join("")}"`, "ok", `Add word1[${i}]='${word1[i]}'.`);
    }
    if (i < word2.length) {
      result.push(word2[i]);
      pushStep(11, i, `result → "${result.join("")}"`, "ok", `Add word2[${i}]='${word2[i]}'.`);
    }
  }

  const joined = result.join("");
  done = true;
  steps.push({ line: 15, cells: w1Codes.map(() => "idle"), values: [...w1Codes], vars: [{ name: "result", value: `"${joined}"`, tone: "ok" }], result: `"${joined}"`, resultTone: "ok", explanation: `Merged string = "${joined}".`, done });
  return steps;
}

// ── Squares of a Sorted Array ──────────────────────────────────────────
// Two DISTINCT approaches. nums array.

// Approach 1: Square and Sort.
// Source (lines):
// 0: function sortedSquares(nums) {
// 1:     const n = nums.length;
// 2:     const result = new Array(n);
// 3:     // Square each element in place
// 4:     for (let i = 0; i < n; i++) {
// 5:         result[i] = nums[i] * nums[i];
// 6:     }
// 7:     // Sort the squared values ascending
// 8:     result.sort((a, b) => a - b);
// 9:     return result;
// 10: }
export function sortedSquaresSortTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result = [...nums];

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      values: [...nums],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < result.length; i++) {
    result[i] = nums[i] * nums[i];
    pushStep(5, i, `result[${i}] = ${result[i]}`, "ok", `Square nums[${i}] = ${nums[i]} → ${result[i]}.`);
  }

  const sorted = [...result].sort((a, b) => a - b);
  for (let i = 0; i < result.length; i++) result[i] = sorted[i];
  pushStep(8, -1, `sorted → [${result.join(", ")}]`, "ok", `Sort squared values → [${result.join(", ")}].`);

  done = true;
  steps.push({ line: 9, cells: nums.map(() => "idle"), values: [...nums], vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Sorted squares = [${result.join(", ")}].`, done });
  return steps;
}

// Approach 2: Two Pointers (Optimal).
// Source (lines):
// 0: function sortedSquares(nums) {
// 1:     const n = nums.length;
// 2:     const result = new Array(n);
// 3:     let left = 0;
// 4:     let right = n - 1;
// 5:
// 6:     // Fill result from back to front with the larger square
// 7:     for (let pos = n - 1; pos >= 0; pos--) {
// 8:         const leftSq = nums[left] * nums[left];
// 9:         const rightSq = nums[right] * nums[right];
// 10:
// 11:        if (leftSq > rightSq) {
// 12:            result[pos] = leftSq;
// 13:            left++;
// 14:        } else {
// 15:            result[pos] = rightSq;
// 16:            right--;
// 17:        }
// 18:    }
// 19:
// 20:    return result;
// 21: }
export function sortedSquaresTwoPointerTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;
  const result = new Array(n);
  let left = 0;
  let right = n - 1;

  const pushStep = (
    line: number,
    pos: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === left) return "i";
        if (idx === right) return "j";
        return "idle";
      }),
      values: [...nums],
      vars: [
        { name: "left", value: String(left), tone: "info" },
        { name: "right", value: String(right), tone: "info" },
        { name: "pos", value: String(pos), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let pos = n - 1; pos >= 0; pos--) {
    const leftSq = nums[left] * nums[left];
    const rightSq = nums[right] * nums[right];
    if (leftSq > rightSq) {
      result[pos] = leftSq;
      pushStep(12, pos, `result[${pos}] = ${leftSq}`, "ok", `leftSq = ${leftSq} > rightSq = ${rightSq} → place ${leftSq}.`);
      left++;
    } else {
      result[pos] = rightSq;
      pushStep(15, pos, `result[${pos}] = ${rightSq}`, "ok", `rightSq = ${rightSq} ≥ leftSq = ${leftSq} → place ${rightSq}.`);
      right--;
    }
  }

  done = true;
  steps.push({ line: 20, cells: nums.map(() => "idle"), values: [...nums], vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Sorted squares = [${result.join(", ")}].`, done });
  return steps;
}

// ── Two Sum ───────────────────────────────────────────────────────────
// Two DISTINCT approaches. nums array, target = nums[1] (second param).

// Approach 1: Brute Force.
// Source (lines):
// 0: function twoSum(nums, target) {
// 1:     // Check every pair of elements
// 2:     for (let i = 0; i < nums.length; i++) {
// 3:         for (let j = i + 1; j < nums.length; j++) {
// 4:             if (nums[i] + nums[j] === target) {
// 5:                 return [i, j];
// 6:             }
// 7:         }
// 8:     }
// 9:     return [];
// 10: }
export function twoSumBruteTrace(nums: number[], target: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        pushStep(4, i, j, "found!", "ok", `nums[${i}] = ${nums[i]} + nums[${j}] = ${nums[j]} = ${target} → return [${i}, ${j}].`);
        done = true;
        steps.push({ line: 5, cells: nums.map(() => "idle"), vars: [{ name: "result", value: `[${i}, ${j}]`, tone: "ok" }], result: `[${i}, ${j}]`, resultTone: "ok", explanation: `Found pair at indices ${i}, ${j}.`, done });
        return steps;
      }
      pushStep(4, i, j, `${nums[i]} + ${nums[j]} = ${nums[i] + nums[j]}`, "fail", `Sum = ${nums[i] + nums[j]} ≠ ${target}.`);
    }
  }

  done = true;
  steps.push({ line: 9, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "[]", tone: "fail" }], result: "[]", resultTone: "fail", explanation: `No pair sums to ${target}.`, done });
  return steps;
}

// Approach 2: Hash Map (One Pass).
// Source (lines):
// 0: function twoSum(nums, target) {
// 1:     const seen = new Map();
// 2:
// 3:     for (let i = 0; i < nums.length; i++) {
// 4:         const complement = target - nums[i];
// 5:
// 6:         // Check if complement was seen before
// 7:         if (seen.has(complement)) {
// 8:             return [seen.get(complement), i];
// 9:         }
// 10:
// 11:        // Store current value and its index
// 12:        seen.set(nums[i], i);
// 13:    }
// 14:
// 15:    return [];
// 16: }
export function twoSumMapTrace(nums: number[], target: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const seen = new Map<number, number>();

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "seen", value: `{${Array.from(seen.entries()).map(([v, idx]) => `${v}:${idx}`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    pushStep(4, i, `complement = ${target} - ${nums[i]} = ${complement}`, "info", `Need complement = ${complement}.`);
    if (seen.has(complement)) {
      pushStep(7, i, "found!", "ok", `Complement ${complement} seen at index ${seen.get(complement)} → return [${seen.get(complement)}, ${i}].`);
      done = true;
      steps.push({ line: 8, cells: nums.map(() => "idle"), vars: [{ name: "result", value: `[${seen.get(complement)}, ${i}]`, tone: "ok" }], result: `[${seen.get(complement)}, ${i}]`, resultTone: "ok", explanation: `Pair found at indices ${seen.get(complement)}, ${i}.`, done });
      return steps;
    }
    seen.set(nums[i], i);
    pushStep(12, i, `seen[${nums[i]}] = ${i}`, "info", `Store ${nums[i]} at index ${i}.`);
  }

  done = true;
  steps.push({ line: 15, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "[]", tone: "fail" }], result: "[]", resultTone: "fail", explanation: `No pair sums to ${target}.`, done });
  return steps;
}

// ── Backspace String Compare ───────────────────────────────────────────
// Two DISTINCT approaches. s and t as char-code arrays.

// Approach 1: Build String with Stack.
// Source (lines):
// 0: function backspaceCompare(s, t) {
// 1:   return buildString(s) === buildString(t);
// 2: };
// 3:
// 4: function buildString(str) {
// 5:   const stack = [];
// 6:   for (let i = 0; i < str.length; i++) {
// 7:     if (str[i] === "#") {
// 8:       // Backspace: remove last character if there is one
// 9:       if (stack.length > 0) {
// 10:        stack.pop();
// 11:      }
// 12:    } else {
// 13:      stack.push(str[i]);
// 14:    }
// 15:  }
// 16:  return stack.join("");
// 17: }
export function backspaceCompareStackTrace(sCodes: number[], tCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const t = tCodes.map((c) => String.fromCharCode(c)).join("");
  const buildString = (str: string): string => {
    const stack: string[] = [];
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "#") {
        if (stack.length > 0) stack.pop();
      } else {
        stack.push(str[i]);
      }
    }
    return stack.join("");
  };

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, () => "idle"),
      values: [...sCodes],
      vars: [{ name: "result", value: resultStr, tone: resultTone }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  const rs = buildString(s);
  const rt = buildString(t);
  pushStep(1, `buildString("${s}") = "${rs}", buildString("${t}") = "${rt}"`, "info", `Built processed strings.`);
  const equal = rs === rt;
  pushStep(1, equal ? "equal" : "not equal", equal ? "ok" : "fail", `"${rs}" ${equal ? "===" : "!=="} "${rt}" → ${equal ? "return true" : "return false"}.`);

  done = true;
  steps.push({ line: 1, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: String(equal), tone: equal ? "ok" : "fail" }], result: String(equal), resultTone: equal ? "ok" : "fail", explanation: `Backspace strings ${equal ? "match" : "differ"}.`, done });
  return steps;
}

// Approach 2: In-Place Simulation with a Write Pointer.
// Source (lines):
// 0: function backspaceCompare(s, t) {
// 1:     const a = s.split("");
// 2:     const b = t.split("");
// 3:     const lenA = processInPlace(a);
// 4:     const lenB = processInPlace(b);
// 5:
// 6:     if (lenA !== lenB) {
// 7:         return false;
// 8:     }
// 9:     for (let k = 0; k < lenA; k++) {
// 10:        if (a[k] !== b[k]) {
// 11:            return false;
// 12:        }
// 13:    }
// 14:    return true;
// 15: }
// 16:
// 17: function processInPlace(arr) {
// 18:    let write = 0;
// 19:    for (let read = 0; read < arr.length; read++) {
// 20:        if (arr[read] === "#") {
// 21:            if (write > 0) {
// 22:                write--;
// 23:            }
// 24:        } else {
// 25:            arr[write] = arr[read];
// 26:            write++;
// 27:        }
// 28:    }
// 29:    return write;
// 30: }
export function backspaceCompareInPlaceTrace(sCodes: number[], tCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const t = tCodes.map((c) => String.fromCharCode(c)).join("");
  const processInPlace = (arr: string[]): number => {
    let write = 0;
    for (let read = 0; read < arr.length; read++) {
      if (arr[read] === "#") {
        if (write > 0) write--;
      } else {
        arr[write] = arr[read];
        write++;
      }
    }
    return write;
  };

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, () => "idle"),
      values: [...sCodes],
      vars: [{ name: "result", value: resultStr, tone: resultTone }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  const a = s.split("");
  const b = t.split("");
  const lenA = processInPlace(a);
  const lenB = processInPlace(b);
  pushStep(4, `lenA = ${lenA}, lenB = ${lenB}`, "info", `Processed both strings in place.`);
  if (lenA !== lenB) {
    pushStep(6, "lengths differ", "fail", `lenA = ${lenA} ≠ lenB = ${lenB} → return false.`);
    done = true;
    steps.push({ line: 7, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "false", resultTone: "fail", explanation: `Processed lengths differ → return false.`, done });
    return steps;
  }
  for (let k = 0; k < lenA; k++) {
    if (a[k] !== b[k]) {
      pushStep(10, "char mismatch", "fail", `a[${k}] = '${a[k]}' ≠ b[${k}] = '${b[k]}' → return false.`);
      done = true;
      steps.push({ line: 11, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "false", resultTone: "fail", explanation: `Character mismatch → return false.`, done });
      return steps;
    }
  }

  done = true;
  steps.push({ line: 14, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: "true", tone: "ok" }], result: "true", resultTone: "ok", explanation: `Strings match → return true.`, done });
  return steps;
}

// ── Valid Word Abbreviation ────────────────────────────────────────────
// Two DISTINCT approaches. word and abbr as char-code arrays.

// Approach 1: Brute Force (Generate and Compare).
// Source (lines):
// 0: function validWordAbbreviation(word, abbr) {
// 1:     const expanded = [];
// 2:     let j = 0;
// 3:
// 4:     while (j < abbr.length) {
// 5:         const c = abbr[j];
// 6:         if (c >= "a" && c <= "z") {
// 7:             expanded.push(c);
// 8:             j++;
// 9:         } else {
// 10:            if (c === "0") return false;
// 11:            let num = 0;
// 12:            while (j < abbr.length && abbr[j] >= "0" && abbr[j] <= "9") {
// 13:                num = num * 10 + Number(abbr[j]);
// 14:                j++;
// 15:            }
// 16:            for (let k = 0; k < num; k++) {
// 17:                expanded.push("*");
// 18:            }
// 19:        }
// 20:    }
// 21:
// 22:    if (expanded.length !== word.length) return false;
// 23:
// 24:    for (let i = 0; i < word.length; i++) {
// 25:        if (expanded[i] !== "*" && expanded[i] !== word[i]) {
// 26:            return false;
// 27:        }
// 28:    }
// 29:    return true;
// 30: }
export function validWordAbbrBruteTrace(wCodes: number[], aCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const word = wCodes.map((c) => String.fromCharCode(c)).join("");
  const abbr = aCodes.map((c) => String.fromCharCode(c)).join("");

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(wCodes, () => "idle"),
      values: [...wCodes],
      vars: [{ name: "result", value: resultStr, tone: resultTone }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  const expanded: string[] = [];
  let j = 0;
  while (j < abbr.length) {
    const c = abbr[j];
    if (c >= "a" && c <= "z") {
      expanded.push(c);
      pushStep(7, `expanded → ["${expanded.join('","')}"]`, "info", `Add letter '${c}'.`);
      j++;
    } else {
      if (c === "0") {
        pushStep(10, "leading zero", "fail", `Leading zero → return false.`);
        done = true;
        steps.push({ line: 10, cells: wCodes.map(() => "idle"), values: [...wCodes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "false", resultTone: "fail", explanation: `Leading zero → return false.`, done });
        return steps;
      }
      let num = 0;
      while (j < abbr.length && abbr[j] >= "0" && abbr[j] <= "9") {
        num = num * 10 + Number(abbr[j]);
        j++;
      }
      for (let k = 0; k < num; k++) expanded.push("*");
      pushStep(17, `skip ${num} chars`, "info", `Parse number ${num} → add ${num} wildcards.`);
    }
  }

  if (expanded.length !== word.length) {
    pushStep(22, "length mismatch", "fail", `expanded ${expanded.length} ≠ word ${word.length} → return false.`);
    done = true;
    steps.push({ line: 22, cells: wCodes.map(() => "idle"), values: [...wCodes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "false", resultTone: "fail", explanation: `Length mismatch → return false.`, done });
    return steps;
  }

  for (let i = 0; i < word.length; i++) {
    if (expanded[i] !== "*" && expanded[i] !== word[i]) {
      pushStep(25, "char mismatch", "fail", `expanded[${i}] = '${expanded[i]}' ≠ word[${i}] = '${word[i]}' → return false.`);
      done = true;
      steps.push({ line: 26, cells: wCodes.map(() => "idle"), values: [...wCodes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "false", resultTone: "fail", explanation: `Character mismatch → return false.`, done });
      return steps;
    }
  }

  done = true;
  steps.push({ line: 29, cells: wCodes.map(() => "idle"), values: [...wCodes], vars: [{ name: "result", value: "true", tone: "ok" }], result: "true", resultTone: "ok", explanation: `Abbreviation is valid → return true.`, done });
  return steps;
}

// Approach 2: Two Pointers (Optimal).
// Source (lines):
// 0: function validWordAbbreviation(word, abbr) {
// 1:   let i = 0;
// 2:   let j = 0;
// 3:
// 4:   while (i < word.length && j < abbr.length) {
// 5:     if (abbr[j] >= "0" && abbr[j] <= "9") {
// 6:       if (abbr[j] === "0") return false;
// 7:       let num = 0;
// 8:       while (j < abbr.length && abbr[j] >= "0" && abbr[j] <= "9") {
// 9:         num = num * 10 + Number(abbr[j]);
// 10:        j++;
// 11:      }
// 12:      i += num;
// 13:    } else {
// 14:      if (word[i] !== abbr[j]) return false;
// 15:      i++;
// 16:      j++;
// 17:    }
// 18:  }
// 19:
// 20:  return i === word.length && j === abbr.length;
// 21: }
export function validWordAbbrTwoPointerTrace(wCodes: number[], aCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const word = wCodes.map((c) => String.fromCharCode(c)).join("");
  const abbr = aCodes.map((c) => String.fromCharCode(c)).join("");
  let i = 0;
  let j = 0;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(wCodes, (idx) => (idx === i ? "i" : "idle")),
      values: [...wCodes],
      vars: [
        { name: "i", value: String(i), tone: "info" },
        { name: "j", value: String(j), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  while (i < word.length && j < abbr.length) {
    if (abbr[j] >= "0" && abbr[j] <= "9") {
      if (abbr[j] === "0") {
        pushStep(6, "leading zero", "fail", `Leading zero → return false.`);
        done = true;
        steps.push({ line: 6, cells: wCodes.map(() => "idle"), values: [...wCodes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "false", resultTone: "fail", explanation: `Leading zero → return false.`, done });
        return steps;
      }
      let num = 0;
      while (j < abbr.length && abbr[j] >= "0" && abbr[j] <= "9") {
        num = num * 10 + Number(abbr[j]);
        j++;
      }
      i += num;
      pushStep(12, `i → ${i}`, "info", `Skip ${num} chars → i = ${i}.`);
    } else {
      if (word[i] !== abbr[j]) {
        pushStep(14, "mismatch", "fail", `word[${i}] = '${word[i]}' ≠ abbr[${j}] = '${abbr[j]}' → return false.`);
        done = true;
        steps.push({ line: 14, cells: wCodes.map(() => "idle"), values: [...wCodes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "false", resultTone: "fail", explanation: `Character mismatch → return false.`, done });
        return steps;
      }
      pushStep(14, `match '${word[i]}'`, "ok", `word[${i}] = abbr[${j}] = '${word[i]}'.`);
      i++;
      j++;
    }
  }

  const valid = i === word.length && j === abbr.length;
  done = true;
  steps.push({ line: 20, cells: wCodes.map(() => "idle"), values: [...wCodes], vars: [{ name: "result", value: String(valid), tone: valid ? "ok" : "fail" }], result: String(valid), resultTone: valid ? "ok" : "fail", explanation: `Both pointers reached end → ${valid ? "valid" : "invalid"}.`, done });
  return steps;
}

// ── Count Binary Substrings ───────────────────────────────────────────
// Two DISTINCT approaches. s as char-code array.

// Approach 1: Brute Force.
// Source (lines):
// 0: function countBinarySubstrings(s) {
// 1:     let count = 0;
// 2:     const n = s.length;
// 3:
// 4:     for (let i = 0; i < n; i++) {
// 5:         for (let len = 2; i + len <= n; len += 2) {
// 6:             const half = len / 2;
// 7:             const firstChar = s[i];
// 8:             let valid = true;
// 9:
// 10:            // First half must be all the same character
// 11:            for (let k = i; k < i + half; k++) {
// 12:                if (s[k] !== firstChar) {
// 13:                    valid = false;
// 14:                    break;
// 15:                }
// 16:            }
// 17:
// 18:            // Second half must be all the opposite character
// 19:            if (valid) {
// 20:                const secondChar = firstChar === '0' ? '1' : '0';
// 21:                for (let k = i + half; k < i + len; k++) {
// 22:                    if (s[k] !== secondChar) {
// 23:                        valid = false;
// 24:                        break;
// 25:                    }
// 26:                }
// 27:            }
// 28:
// 29:            if (valid) {
// 30:                count++;
// 31:            }
// 32:        }
// 33:    }
// 34:
// 35:    return count;
// 36: }
export function countBinarySubstringsBruteTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  const n = s.length;
  let count = 0;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, () => "idle"),
      values: [...codes],
      vars: [{ name: "count", value: String(count), tone: "ok" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < n; i++) {
    for (let len = 2; i + len <= n; len += 2) {
      const half = len / 2;
      const firstChar = s[i];
      let valid = true;
      for (let k = i; k < i + half; k++) {
        if (s[k] !== firstChar) { valid = false; break; }
      }
      if (valid) {
        const secondChar = firstChar === "0" ? "1" : "0";
        for (let k = i + half; k < i + len; k++) {
          if (s[k] !== secondChar) { valid = false; break; }
        }
      }
      if (valid) {
        count++;
        const secondChar = firstChar === "0" ? "1" : "0";
        pushStep(30, `count → ${count}`, "ok", `Substring s[${i}..${i + len - 1}] = "${s.slice(i, i + len)}" is valid (${half} ${firstChar}s + ${half} ${secondChar}s) → count = ${count}.`);
      } else {
        pushStep(29, "invalid", "fail", `Substring "${s.slice(i, i + len)}" is not a valid binary substring.`);
      }
    }
  }

  done = true;
  steps.push({ line: 35, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: String(count), tone: "ok" }], result: `return ${count}`, resultTone: "ok", explanation: `Number of binary substrings = ${count}.`, done });
  return steps;
}

// Approach 2: Group Counting.
// Source (lines):
// 0: function countBinarySubstrings(s) {
// 1:     const groups = [];
// 2:     let i = 0;
// 3:     const n = s.length;
// 4:
// 5:     while (i < n) {
// 6:         const ch = s[i];
// 7:         let groupSize = 0;
// 8:         while (i < n && s[i] === ch) {
// 9:             groupSize++;
// 10:            i++;
// 11:        }
// 12:        groups.push(groupSize);
// 13:    }
// 14:
// 15:    let count = 0;
// 16:    for (let j = 0; j < groups.length - 1; j++) {
// 17:        count += Math.min(groups[j], groups[j + 1]);
// 18:    }
// 19:
// 20:    return count;
// 21: }
export function countBinarySubstringsGroupTrace(codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = codes.map((c) => String.fromCharCode(c)).join("");
  const n = s.length;
  const groups: number[] = [];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(codes, () => "idle"),
      values: [...codes],
      vars: [{ name: "groups", value: `[${groups.join(", ")}]`, tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  let i = 0;
  while (i < n) {
    const ch = s[i];
    let groupSize = 0;
    while (i < n && s[i] === ch) { groupSize++; i++; }
    groups.push(groupSize);
    pushStep(12, `group '${ch}' size ${groupSize}`, "info", `Run of '${ch}' has length ${groupSize}.`);
  }

  let count = 0;
  for (let j = 0; j < groups.length - 1; j++) {
    count += Math.min(groups[j], groups[j + 1]);
    pushStep(17, `count → ${count}`, "ok", `min(groups[${j}] = ${groups[j]}, groups[${j + 1}] = ${groups[j + 1]}) = ${Math.min(groups[j], groups[j + 1])} → count = ${count}.`);
  }

  done = true;
  steps.push({ line: 20, cells: codes.map(() => "idle"), values: [...codes], vars: [{ name: "result", value: String(count), tone: "ok" }], result: `return ${count}`, resultTone: "ok", explanation: `Number of binary substrings = ${count}.`, done });
  return steps;
}

// ── Two Sum II - Input Array Is Sorted ────────────────────────────────
// Two DISTINCT approaches. numbers array, target = second param.

// Approach 1: Brute Force.
// Source (lines):
// 0: function twoSum(numbers, target) {
// 1:     const n = numbers.length;
// 2:     for (let i = 0; i < n - 1; i++) {
// 3:         for (let j = i + 1; j < n; j++) {
// 4:             if (numbers[i] + numbers[j] === target) {
// 5:                 return [i + 1, j + 1]; // 1-indexed
// 6:             }
// 7:         }
// 8:     }
// 9:     return [-1, -1]; // unreachable since solution is guaranteed
// 10: }
export function twoSumIISortedBruteTrace(nums: number[], target: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length - 1; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        pushStep(4, i, j, "found!", "ok", `numbers[${i}] = ${nums[i]} + numbers[${j}] = ${nums[j]} = ${target} → return [${i + 1}, ${j + 1}].`);
        done = true;
        steps.push({ line: 5, cells: nums.map(() => "idle"), vars: [{ name: "result", value: `[${i + 1}, ${j + 1}]`, tone: "ok" }], result: `[${i + 1}, ${j + 1}]`, resultTone: "ok", explanation: `Pair at 1-indexed positions ${i + 1}, ${j + 1}.`, done });
        return steps;
      }
      pushStep(4, i, j, `${nums[i]} + ${nums[j]} = ${nums[i] + nums[j]}`, "fail", `Sum = ${nums[i] + nums[j]} ≠ ${target}.`);
    }
  }

  done = true;
  steps.push({ line: 9, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "[-1, -1]", tone: "fail" }], result: "[-1, -1]", resultTone: "fail", explanation: `No pair found.`, done });
  return steps;
}

// Approach 2: Binary Search.
// Source (lines):
// 0: function twoSum(numbers, target) {
// 1:     const n = numbers.length;
// 2:     for (let i = 0; i < n - 1; i++) {
// 3:         const complement = target - numbers[i];
// 4:         let left = i + 1, right = n - 1;
// 5:         while (left <= right) {
// 6:             const mid = left + Math.floor((right - left) / 2);
// 7:             if (numbers[mid] === complement) {
// 8:                 return [i + 1, mid + 1];
// 9:             } else if (numbers[mid] < complement) {
// 10:                left = mid + 1;
// 11:            } else {
// 12:                right = mid - 1;
// 13:            }
// 14:        }
// 15:    }
// 16:    return [-1, -1];
// 17: }
export function twoSumIISortedBinaryTrace(nums: number[], target: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length - 1; i++) {
    const complement = target - nums[i];
    let left = i + 1, right = nums.length - 1;
    pushStep(3, i, `complement = ${target} - ${nums[i]} = ${complement}`, "info", `Search for ${complement} in numbers[${i + 1}..].`);
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      if (nums[mid] === complement) {
        pushStep(7, i, "found!", "ok", `numbers[${mid}] = ${complement} → return [${i + 1}, ${mid + 1}].`);
        done = true;
        steps.push({ line: 8, cells: nums.map(() => "idle"), vars: [{ name: "result", value: `[${i + 1}, ${mid + 1}]`, tone: "ok" }], result: `[${i + 1}, ${mid + 1}]`, resultTone: "ok", explanation: `Pair at ${i + 1}, ${mid + 1}.`, done });
        return steps;
      } else if (nums[mid] < complement) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  done = true;
  steps.push({ line: 16, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "[-1, -1]", tone: "fail" }], result: "[-1, -1]", resultTone: "fail", explanation: `No pair found.`, done });
  return steps;
}

// ── Container With Most Water ─────────────────────────────────────────
// Two DISTINCT approaches. height array.

// Approach 1: Brute Force.
// Source (lines):
// 0: function maxArea(height) {
// 1:     let maxArea = 0;
// 2:     const n = height.length;
// 3:
// 4:     for (let i = 0; i < n; i++) {
// 5:         for (let j = i + 1; j < n; j++) {
// 6:             const width = j - i;
// 7:             const h = Math.min(height[i], height[j]);
// 8:             maxArea = Math.max(maxArea, width * h);
// 9:         }
// 10:    }
// 11:
// 12:    return maxArea;
// 13: }
export function maxAreaBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let maxArea = 0;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "maxArea", value: String(maxArea), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      const width = j - i;
      const h = Math.min(nums[i], nums[j]);
      const area = width * h;
      maxArea = Math.max(maxArea, area);
      pushStep(8, i, j, `area ${width}×${h} = ${area}, max = ${maxArea}`, area > 0 ? "ok" : "info", `height[${i}] = ${nums[i]}, height[${j}] = ${nums[j]}, width = ${width}, h = ${h}, area = ${area}.`);
    }
  }

  done = true;
  steps.push({ line: 12, cells: nums.map(() => "idle"), vars: [{ name: "result", value: String(maxArea), tone: "ok" }], result: `return ${maxArea}`, resultTone: "ok", explanation: `Max area = ${maxArea}.`, done });
  return steps;
}

// Approach 2: Two Pointers (Optimal).
// Source (lines):
// 0: function maxArea(height) {
// 1:     let left = 0;
// 2:     let right = height.length - 1;
// 3:     let maxArea = 0;
// 4:
// 5:     while (left < right) {
// 6:         const width = right - left;
// 7:         const h = Math.min(height[left], height[right]);
// 8:         maxArea = Math.max(maxArea, width * h);
// 9:
// 10:        // Move the pointer at the shorter line
// 11:        if (height[left] < height[right]) {
// 12:            left++;
// 13:        } else {
// 14:            right--;
// 15:        }
// 16:    }
// 17:
// 18:    return maxArea;
// 19: }
export function maxAreaTwoPointerTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let left = 0;
  let right = nums.length - 1;
  let maxArea = 0;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === left) return "i";
        if (idx === right) return "j";
        return "idle";
      }),
      vars: [
        { name: "left", value: String(left), tone: "info" },
        { name: "right", value: String(right), tone: "info" },
        { name: "maxArea", value: String(maxArea), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  while (left < right) {
    const width = right - left;
    const h = Math.min(nums[left], nums[right]);
    const area = width * h;
    maxArea = Math.max(maxArea, area);
    pushStep(8, `area ${width}×${h} = ${area}, max = ${maxArea}`, "ok", `height[${left}] = ${nums[left]}, height[${right}] = ${nums[right]}, area = ${area}.`);
    if (nums[left] < nums[right]) {
      left++;
    } else {
      right--;
    }
  }

  done = true;
  steps.push({ line: 18, cells: nums.map(() => "idle"), vars: [{ name: "result", value: String(maxArea), tone: "ok" }], result: `return ${maxArea}`, resultTone: "ok", explanation: `Max area = ${maxArea}.`, done });
  return steps;
}

// ── 3Sum ──────────────────────────────────────────────────────────────
// Two DISTINCT approaches. nums array.

// Approach 1: Brute Force.
// Source (lines):
// 0: function threeSum(nums) {
// 1:     const resultSet = new Set();
// 2:     const n = nums.length;
// 3:
// 4:     for (let i = 0; i < n - 2; i++) {
// 5:         for (let j = i + 1; j < n - 1; j++) {
// 6:             for (let k = j + 1; k < n; k++) {
// 7:                 if (nums[i] + nums[j] + nums[k] === 0) {
// 8:                     const triplet = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
// 9:                     resultSet.add(triplet.join(","));
// 10:                }
// 11:            }
// 12:        }
// 13:    }
// 14:
// 15:    return Array.from(resultSet).map(s => s.split(",").map(Number));
// 16: }
export function threeSumBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const resultSet = new Set<string>();

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, () => "idle"),
      vars: [{ name: "resultSet", value: `{${[...resultSet].join(", ")}}`, tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length - 2; i++) {
    for (let j = i + 1; j < nums.length - 1; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        if (nums[i] + nums[j] + nums[k] === 0) {
          const triplet = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
          resultSet.add(triplet.join(","));
          pushStep(9, `add [${triplet.join(",")}]`, "ok", `Triplet ${nums[i]}, ${nums[j]}, ${nums[k]} sums to 0 → add sorted [${triplet.join(",")}].`);
        }
      }
    }
  }

  const result = Array.from(resultSet).map((s) => s.split(",").map(Number));
  done = true;
  steps.push({ line: 15, cells: nums.map(() => "idle"), vars: [{ name: "result", value: `[${result.map((t) => `[${t.join(",")}]`).join(", ")}]`, tone: "ok" }], result: `[${result.map((t) => `[${t.join(",")}]`).join(", ")}]`, resultTone: "ok", explanation: `Triplets summing to 0 = ${result.length}.`, done });
  return steps;
}

// Approach 2: Hash Set.
// Source (lines):
// 0: function threeSum(nums) {
// 1:     const result = [];
// 2:     nums.sort((a, b) => a - b);
// 3:     const n = nums.length;
// 4:
// 5:     for (let i = 0; i < n - 2; i++) {
// 6:         if (i > 0 && nums[i] === nums[i - 1]) continue;
// 7:         const target = -nums[i];
// 8:         const seen = new Set();
// 9:
// 10:        for (let j = i + 1; j < n; j++) {
// 11:            const complement = target - nums[j];
// 12:            if (seen.has(complement)) {
// 13:                result.push([nums[i], complement, nums[j]]);
// 14:                while (j + 1 < n && nums[j] === nums[j + 1]) j++;
// 15:            }
// 16:            seen.add(nums[j]);
// 17:        }
// 18:    }
// 19:
// 20:    return result;
// 21: }
export function threeSumHashSetTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[][] = [];
  const working = [...nums].sort((a, b) => a - b);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, (idx) => (idx === i ? "i" : "idle")),
      values: [...working],
      vars: [{ name: "result", value: `[${result.map((t) => `[${t.join(",")}]`).join(", ")}]`, tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, -1, `sorted = [${working.join(", ")}]`, "info", `Sorted array.`);

  for (let i = 0; i < working.length - 2; i++) {
    if (i > 0 && working[i] === working[i - 1]) continue;
    const target = -working[i];
    const seen = new Set<number>();
    for (let j = i + 1; j < working.length; j++) {
      const complement = target - working[j];
      if (seen.has(complement)) {
        result.push([working[i], complement, working[j]]);
        pushStep(13, i, `result → [${result.map((t) => `[${t.join(",")}]`).join(", ")}]`, "ok", `nums[${j}] = ${working[j]}, complement ${complement} seen → add [${working[i]}, ${complement}, ${working[j]}].`);
        while (j + 1 < working.length && working[j] === working[j + 1]) j++;
      }
      seen.add(working[j]);
    }
  }

  done = true;
  steps.push({ line: 20, cells: working.map(() => "idle"), values: [...working], vars: [{ name: "result", value: `[${result.map((t) => `[${t.join(",")}]`).join(", ")}]`, tone: "ok" }], result: `[${result.map((t) => `[${t.join(",")}]`).join(", ")}]`, resultTone: "ok", explanation: `Triplets summing to 0 = ${result.length}.`, done });
  return steps;
}

// ── 4Sum ──────────────────────────────────────────────────────────────
// Two DISTINCT approaches. nums array, target = second param.

// Approach 1: Brute Force.
// Source (lines):
// 0: function fourSum(nums, target) {
// 1:   const n = nums.length;
// 2:   nums.sort((a, b) => a - b);
// 3:   const seen = new Set();
// 4:   const result = [];
// 5:
// 6:   for (let i = 0; i < n - 3; i++) {
// 7:     for (let j = i + 1; j < n - 2; j++) {
// 8:       for (let k = j + 1; k < n - 1; k++) {
// 9:         for (let l = k + 1; l < n; l++) {
// 10:          if (nums[i] + nums[j] + nums[k] + nums[l] === target) {
// 11:            const key = \`${nums[i]},${nums[j]},${nums[k]},${nums[l]}\`;
// 12:            if (!seen.has(key)) {
// 13:              seen.add(key);
// 14:              result.push([nums[i], nums[j], nums[k], nums[l]]);
// 15:            }
// 16:          }
// 17:        }
// 18:      }
// 19:    }
// 20:  }
// 21:
// 22:  return result;
// 23: }
export function fourSumBruteTrace(nums: number[], target: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums].sort((a, b) => a - b);
  const seen = new Set<string>();
  const result: number[][] = [];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, () => "idle"),
      values: [...working],
      vars: [{ name: "result", value: `[${result.map((t) => `[${t.join(",")}]`).join(", ")}]`, tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < working.length - 3; i++) {
    for (let j = i + 1; j < working.length - 2; j++) {
      for (let k = j + 1; k < working.length - 1; k++) {
        for (let l = k + 1; l < working.length; l++) {
          if (working[i] + working[j] + working[k] + working[l] === target) {
            const key = `${working[i]},${working[j]},${working[k]},${working[l]}`;
            if (!seen.has(key)) {
              seen.add(key);
              result.push([working[i], working[j], working[k], working[l]]);
              pushStep(14, `result → [${result.map((t) => `[${t.join(",")}]`).join(", ")}]`, "ok", `Quad ${working[i]}, ${working[j]}, ${working[k]}, ${working[l]} sums to ${target} → add.`);
            }
          }
        }
      }
    }
  }

  done = true;
  steps.push({ line: 22, cells: working.map(() => "idle"), values: [...working], vars: [{ name: "result", value: `[${result.map((t) => `[${t.join(",")}]`).join(", ")}]`, tone: "ok" }], result: `[${result.map((t) => `[${t.join(",")}]`).join(", ")}]`, resultTone: "ok", explanation: `Quadruplets summing to ${target} = ${result.length}.`, done });
  return steps;
}

// Approach 2: Sorting + Two Pointers.
// Source (lines):
// 0: function fourSum(nums, target) {
// 1:   const result = [];
// 2:   const n = nums.length;
// 3:   nums.sort((a, b) => a - b);
// 4:
// 5:   for (let i = 0; i < n - 3; i++) {
// 6:     if (i > 0 && nums[i] === nums[i - 1]) continue;
// 7:     for (let j = i + 1; j < n - 2; j++) {
// 8:       if (j > i + 1 && nums[j] === nums[j - 1]) continue;
// 9:       let left = j + 1;
// 10:      let right = n - 1;
// 11:      while (left < right) {
// 12:        const sum = nums[i] + nums[j] + nums[left] + nums[right];
// 13:        if (sum === target) {
// 14:          result.push([nums[i], nums[j], nums[left], nums[right]]);
// 15:          while (left < right && nums[left] === nums[left + 1]) left++;
// 16:          while (left < right && nums[right] === nums[right - 1]) right--;
// 17:          left++;
// 18:          right--;
// 19:        } else if (sum < target) {
// 20:          left++;
// 21:        } else {
// 22:          right--;
// 23:        }
// 24:      }
// 25:    }
// 26:  }
// 27:
// 28:  return result;
// 29: }
export function fourSumTwoPointerTrace(nums: number[], target: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const working = [...nums].sort((a, b) => a - b);
  const result: number[][] = [];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(working, () => "idle"),
      values: [...working],
      vars: [{ name: "result", value: `[${result.map((t) => `[${t.join(",")}]`).join(", ")}]`, tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < working.length - 3; i++) {
    if (i > 0 && working[i] === working[i - 1]) continue;
    for (let j = i + 1; j < working.length - 2; j++) {
      if (j > i + 1 && working[j] === working[j - 1]) continue;
      let left = j + 1;
      let right = working.length - 1;
      while (left < right) {
        const sum = working[i] + working[j] + working[left] + working[right];
        if (sum === target) {
          result.push([working[i], working[j], working[left], working[right]]);
          pushStep(14, `result → [${result.map((t) => `[${t.join(",")}]`).join(", ")}]`, "ok", `Sum ${sum} = ${target} → add [${working[i]}, ${working[j]}, ${working[left]}, ${working[right]}].`);
          while (left < right && working[left] === working[left + 1]) left++;
          while (left < right && working[right] === working[right - 1]) right--;
          left++;
          right--;
        } else if (sum < target) {
          left++;
        } else {
          right--;
        }
      }
    }
  }

  done = true;
  steps.push({ line: 28, cells: working.map(() => "idle"), values: [...working], vars: [{ name: "result", value: `[${result.map((t) => `[${t.join(",")}]`).join(", ")}]`, tone: "ok" }], result: `[${result.map((t) => `[${t.join(",")}]`).join(", ")}]`, resultTone: "ok", explanation: `Quadruplets summing to ${target} = ${result.length}.`, done });
  return steps;
}

// ── Trapping Rain Water ───────────────────────────────────────────────
// Two DISTINCT approaches. height array.

// Approach 1: Brute Force.
// Source (lines):
// 0: function trap(height) {
// 1:   const n = height.length
// 2:   let totalWater = 0
// 3:   for (let i = 0; i < n; i++) {
// 4:     let maxLeft = 0
// 5:     for (let j = 0; j <= i; j++) {
// 6:       maxLeft = Math.max(maxLeft, height[j])
// 7:     }
// 8:     let maxRight = 0
// 9:     for (let j = i; j < n; j++) {
// 10:      maxRight = Math.max(maxRight, height[j])
// 11:    }
// 12:    totalWater += Math.min(maxLeft, maxRight) - height[i]
// 13:  }
// 14:  return totalWater
// 15: }
export function trapBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let totalWater = 0;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "totalWater", value: String(totalWater), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    let maxLeft = 0;
    for (let j = 0; j <= i; j++) maxLeft = Math.max(maxLeft, nums[j]);
    let maxRight = 0;
    for (let j = i; j < nums.length; j++) maxRight = Math.max(maxRight, nums[j]);
    const water = Math.min(maxLeft, maxRight) - nums[i];
    totalWater += water;
    pushStep(12, i, `water = ${water}, total = ${totalWater}`, water > 0 ? "ok" : "info", `At index ${i}: height = ${nums[i]}, maxLeft = ${maxLeft}, maxRight = ${maxRight}, water = ${water}.`);
  }

  done = true;
  steps.push({ line: 14, cells: nums.map(() => "idle"), vars: [{ name: "result", value: String(totalWater), tone: "ok" }], result: `return ${totalWater}`, resultTone: "ok", explanation: `Total trapped water = ${totalWater}.`, done });
  return steps;
}

// Approach 2: Prefix Max Arrays.
// Source (lines):
// 0: function trap(height) {
// 1:   const n = height.length
// 2:   const leftMax = new Array(n)
// 3:   leftMax[0] = height[0]
// 4:   for (let i = 1; i < n; i++) {
// 5:     leftMax[i] = Math.max(leftMax[i - 1], height[i])
// 6:   }
// 7:   const rightMax = new Array(n)
// 8:   rightMax[n - 1] = height[n - 1]
// 9:   for (let i = n - 2; i >= 0; i--) {
// 10:    rightMax[i] = Math.max(rightMax[i + 1], height[i])
// 11:  }
// 12:  let totalWater = 0
// 13:  for (let i = 0; i < n; i++) {
// 14:    totalWater += Math.min(leftMax[i], rightMax[i]) - height[i]
// 15:  }
// 16:  return totalWater
// 17: }
export function trapPrefixMaxTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;
  const leftMax = new Array(n);
  const rightMax = new Array(n);
  leftMax[0] = nums[0];
  for (let i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], nums[i]);
  rightMax[n - 1] = nums[n - 1];
  for (let i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], nums[i]);
  let totalWater = 0;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "leftMax", value: `[${leftMax.join(", ")}]`, tone: "info" },
        { name: "rightMax", value: `[${rightMax.join(", ")}]`, tone: "info" },
        { name: "totalWater", value: String(totalWater), tone: "ok" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(5, -1, `leftMax = [${leftMax.join(", ")}]`, "info", `Built leftMax.`);
  pushStep(10, -1, `rightMax = [${rightMax.join(", ")}]`, "info", `Built rightMax.`);

  for (let i = 0; i < n; i++) {
    const water = Math.min(leftMax[i], rightMax[i]) - nums[i];
    totalWater += water;
    pushStep(14, i, `water = ${water}, total = ${totalWater}`, water > 0 ? "ok" : "info", `At index ${i}: min(${leftMax[i]}, ${rightMax[i]}) - ${nums[i]} = ${water}.`);
  }

  done = true;
  steps.push({ line: 16, cells: nums.map(() => "idle"), vars: [{ name: "result", value: String(totalWater), tone: "ok" }], result: `return ${totalWater}`, resultTone: "ok", explanation: `Total trapped water = ${totalWater}.`, done });
  return steps;
}

// ── Running Sum of 1d Array ────────────────────────────────────────────
// Two DISTINCT approaches. nums array.

// Approach 1: Brute Force (Recompute Each Sum).
// Source (lines):
// 0: function runningSum(nums) {
// 1:     var n = nums.length;
// 2:     var result = new Array(n);
// 3:
// 4:     for (var i = 0; i < n; i++) {
// 5:         var sum = 0;
// 6:         // Sum all elements from index 0 to i
// 7:         for (var j = 0; j <= i; j++) {
// 8:             sum += nums[j];
// 9:         }
// 10:        result[i] = sum;
// 11:    }
// 12:
// 13:    return result;
// 14: }
export function runningSumBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;
  const result = new Array(n);

  const pushStep = (
    line: number,
    i: number,
    j: number,
    sum: string,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "sum", value: sum, tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < n; i++) {
    let sum = 0;
    pushStep(5, i, -1, `sum = 0`, `[${result.join(", ")}]`, "info", `Recompute sum for index ${i}.`);
    for (let j = 0; j <= i; j++) {
      sum += nums[j];
      pushStep(8, i, j, `sum → ${sum}`, `[${result.join(", ")}]`, "ok", `Add nums[${j}] = ${nums[j]} → sum = ${sum}.`);
    }
    result[i] = sum;
    pushStep(10, i, -1, `result[${i}] = ${sum}`, `[${result.join(", ")}]`, "ok", `result[${i}] = ${sum}.`);
  }

  done = true;
  steps.push({ line: 13, cells: nums.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Running sums = [${result.join(", ")}].`, done });
  return steps;
}

// Approach 2: Prefix Sum (New Array).
// Source (lines):
// 0: function runningSum(nums) {
// 1:     var n = nums.length;
// 2:     var result = new Array(n);
// 3:
// 4:     result[0] = nums[0];
// 5:     for (var i = 1; i < n; i++) {
// 6:         // Each running sum builds on the previous one
// 7:         result[i] = result[i - 1] + nums[i];
// 8:     }
// 9:
// 10:    return result;
// 11: }
export function runningSumPrefixTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;
  const result = new Array(n);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  result[0] = nums[0];
  pushStep(4, 0, `result[0] = ${nums[0]}`, "ok", `result[0] = nums[0] = ${nums[0]}.`);

  for (let i = 1; i < n; i++) {
    result[i] = result[i - 1] + nums[i];
    pushStep(7, i, `result[${i}] = ${result[i]}`, "ok", `result[${i}] = result[${i - 1}] + nums[${i}] = ${result[i - 1]} + ${nums[i]} = ${result[i]}.`);
  }

  done = true;
  steps.push({ line: 10, cells: nums.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Running sums = [${result.join(", ")}].`, done });
  return steps;
}

// ── Range Sum Query - Immutable ────────────────────────────────────────
// Two DISTINCT approaches. nums is the array; left/right are query bounds.

// Approach 1: Brute Force.
// Source (lines):
// 0: function NumArray(nums) {
// 1:   this.nums = nums;
// 2: }
// 3: NumArray.prototype.sumRange = function (left, right) {
// 4:   let sum = 0;
// 5:   for (let i = left; i <= right; i++) {
// 6:     sum += this.nums[i];
// 7:   }
// 8:   return sum;
// 9: }
export function rangeSumBruteTrace(nums: number[], left: number, right: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let sum = 0;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "sum", value: String(sum), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = left; i <= right; i++) {
    sum += nums[i];
    pushStep(6, i, `sum → ${sum}`, "ok", `Add nums[${i}] = ${nums[i]} → sum = ${sum}.`);
  }

  done = true;
  steps.push({ line: 8, cells: nums.map(() => "idle"), vars: [{ name: "sum", value: String(sum), tone: "ok" }], result: String(sum), resultTone: "ok", explanation: `sumRange(${left}, ${right}) = ${sum}.`, done });
  return steps;
}

// Approach 2: Prefix Sum.
// Source (lines):
// 0: function NumArray(nums) {
// 1:   // Build prefix sum array where prefix[i] = sum of nums[0..i-1]
// 2:   this.prefix = new Array(nums.length + 1).fill(0);
// 3:   for (let i = 0; i < nums.length; i++) {
// 4:     this.prefix[i + 1] = this.prefix[i] + nums[i];
// 5:   }
// 6: }
// 7: NumArray.prototype.sumRange = function (left, right) {
// 8:   return this.prefix[right + 1] - this.prefix[left];
// 9: }
export function rangeSumPrefixTrace(nums: number[], left: number, right: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const prefix = new Array(nums.length + 1).fill(0);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "prefix", value: `[${prefix.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
    pushStep(4, i, `prefix[${i + 1}] = ${prefix[i + 1]}`, "ok", `prefix[${i + 1}] = prefix[${i}] + nums[${i}] = ${prefix[i]} + ${nums[i]} = ${prefix[i + 1]}.`);
  }

  const result = prefix[right + 1] - prefix[left];
  done = true;
  steps.push({ line: 8, cells: nums.map(() => "idle"), vars: [{ name: "prefix", value: `[${prefix.join(", ")}]`, tone: "ok" }], result: String(result), resultTone: "ok", explanation: `sumRange(${left}, ${right}) = prefix[${right + 1}] - prefix[${left}] = ${prefix[right + 1]} - ${prefix[left]} = ${result}.`, done });
  return steps;
}

// ── Find Pivot Index ────────────────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Brute Force.
// Source (lines):
// 0: function pivotIndex(nums) {
// 1:     var n = nums.length;
// 2:
// 3:     for (var i = 0; i < n; i++) {
// 4:         var leftSum = 0;
// 5:         var rightSum = 0;
// 6:
// 7:         // Compute left sum for index i
// 8:         for (var j = 0; j < i; j++) {
// 9:             leftSum += nums[j];
// 10:        }
// 11:
// 12:        // Compute right sum for index i
// 13:        for (var j = i + 1; j < n; j++) {
// 14:            rightSum += nums[j];
// 15:        }
// 16:
// 17:        if (leftSum === rightSum) {
// 18:            return i;
// 19:        }
// 20:    }
// 21:
// 22:    return -1;
// 23: }
export function pivotIndexBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    leftSum: number,
    rightSum: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "leftSum", value: String(leftSum), tone: "info" },
        { name: "rightSum", value: String(rightSum), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < n; i++) {
    let leftSum = 0;
    for (let j = 0; j < i; j++) {
      leftSum += nums[j];
      pushStep(9, i, j, leftSum, 0, `leftSum → ${leftSum}`, "info", `Add nums[${j}] = ${nums[j]} → leftSum = ${leftSum}.`);
    }
    let rightSum = 0;
    for (let j = i + 1; j < n; j++) {
      rightSum += nums[j];
      pushStep(14, i, j, leftSum, rightSum, `rightSum → ${rightSum}`, "info", `Add nums[${j}] = ${nums[j]} → rightSum = ${rightSum}.`);
    }
    if (leftSum === rightSum) {
      pushStep(17, i, -1, leftSum, rightSum, "equal!", "ok", `leftSum = rightSum = ${leftSum} → return ${i}.`);
      done = true;
      steps.push({ line: 18, cells: nums.map(() => "idle"), vars: [{ name: "result", value: String(i), tone: "ok" }], result: String(i), resultTone: "ok", explanation: `Pivot index = ${i}.`, done });
      return steps;
    }
    pushStep(17, i, -1, leftSum, rightSum, "not equal", "fail", `leftSum = ${leftSum} ≠ rightSum = ${rightSum}.`);
  }

  done = true;
  steps.push({ line: 22, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "-1", tone: "fail" }], result: "-1", resultTone: "fail", explanation: `No pivot index found → return -1.`, done });
  return steps;
}

// Approach 2: Prefix Sum (Optimal).
// Source (lines):
// 0: function pivotIndex(nums) {
// 1:     var totalSum = 0;
// 2:     for (var i = 0; i < nums.length; i++) {
// 3:         totalSum += nums[i];
// 4:     }
// 5:
// 6:     var leftSum = 0;
// 7:     for (var i = 0; i < nums.length; i++) {
// 8:         // Right sum is everything except leftSum and nums[i]
// 9:         var rightSum = totalSum - leftSum - nums[i];
// 10:        if (leftSum === rightSum) {
// 11:            return i;
// 12:        }
// 13:        leftSum += nums[i];
// 14:    }
// 15:
// 16:    return -1;
// 17: }
export function pivotIndexPrefixTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let totalSum = 0;
  for (const v of nums) totalSum += v;

  const pushStep = (
    line: number,
    i: number,
    leftSum: number,
    rightSum: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "leftSum", value: String(leftSum), tone: "info" },
        { name: "rightSum", value: String(rightSum), tone: "info" },
        { name: "totalSum", value: String(totalSum), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  let leftSum = 0;
  for (let i = 0; i < nums.length; i++) {
    const rightSum = totalSum - leftSum - nums[i];
    pushStep(9, i, leftSum, rightSum, `rightSum = ${rightSum}`, "info", `rightSum = totalSum - leftSum - nums[${i}] = ${totalSum} - ${leftSum} - ${nums[i]} = ${rightSum}.`);
    if (leftSum === rightSum) {
      pushStep(10, i, leftSum, rightSum, "equal!", "ok", `leftSum = rightSum = ${leftSum} → return ${i}.`);
      done = true;
      steps.push({ line: 11, cells: nums.map(() => "idle"), vars: [{ name: "result", value: String(i), tone: "ok" }], result: String(i), resultTone: "ok", explanation: `Pivot index = ${i}.`, done });
      return steps;
    }
    leftSum += nums[i];
    pushStep(13, i, leftSum, rightSum, `leftSum → ${leftSum}`, "info", `leftSum += nums[${i}] → ${leftSum}.`);
  }

  done = true;
  steps.push({ line: 16, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "-1", tone: "fail" }], result: "-1", resultTone: "fail", explanation: `No pivot index found → return -1.`, done });
  return steps;
}

// ── Maximum Population Year ────────────────────────────────────────────
// Two DISTINCT approaches. nums is a flat array of [birth, death] pairs.

// Approach 1: Brute Force (Check Every Year).
// Source (lines):
// 0: function maximumPopulation(logs) {
// 1:     var maxPop = 0;
// 2:     var resultYear = 0;
// 3:
// 4:     for (var year = 1950; year <= 2050; year++) {
// 5:         var count = 0;
// 6:         for (var i = 0; i < logs.length; i++) {
// 7:             // Person is alive if birth <= year < death
// 8:             if (logs[i][0] <= year && year < logs[i][1]) {
// 9:                 count++;
// 10:            }
// 11:        }
// 12:        if (count > maxPop) {
// 13:            maxPop = count;
// 14:            resultYear = year;
// 15:        }
// 16:    }
// 17:
// 18:    return resultYear;
// 19: }
export function maxPopBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const logs: [number, number][] = [];
  for (let k = 0; k + 1 < nums.length; k += 2) logs.push([nums[k], nums[k + 1]]);
  let maxPop = 0;
  let resultYear = 0;

  const pushStep = (
    line: number,
    year: number,
    i: number,
    count: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: nums.map((_, idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "year", value: String(year), tone: "info" },
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "count", value: String(count), tone: "info" },
        { name: "maxPop", value: String(maxPop), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let year = 1950; year <= 2050; year++) {
    let count = 0;
    for (let i = 0; i < logs.length; i++) {
      if (logs[i][0] <= year && year < logs[i][1]) {
        count++;
        pushStep(8, year, i, count, `alive → ${count}`, "ok", `Person ${i} (${logs[i][0]}-${logs[i][1]}) alive in ${year} → count = ${count}.`);
      } else {
        pushStep(8, year, i, count, "not alive", "fail", `Person ${i} (${logs[i][0]}-${logs[i][1]}) not alive in ${year}.`);
      }
    }
    if (count > maxPop) {
      maxPop = count;
      resultYear = year;
      pushStep(12, year, -1, count, `new max ${count}`, "ok", `count ${count} > maxPop → resultYear = ${year}.`);
    }
  }

  done = true;
  steps.push({ line: 18, cells: nums.map(() => "idle"), vars: [{ name: "result", value: String(resultYear), tone: "ok" }], result: String(resultYear), resultTone: "ok", explanation: `Maximum population year = ${resultYear} (pop ${maxPop}).`, done });
  return steps;
}

// Approach 2: Line Sweep (Difference Array).
// Source (lines):
// 0: function maximumPopulation(logs) {
// 1:     var delta = new Array(101).fill(0); // years 1950 to 2050
// 2:
// 3:     // Record birth and death events
// 4:     for (var i = 0; i < logs.length; i++) {
// 5:         delta[logs[i][0] - 1950]++;
// 6:         delta[logs[i][1] - 1950]--;
// 7:     }
// 8:
// 9:     // Sweep to find the year with maximum population
// 10:    var maxPop = 0;
// 11:    var runningSum = 0;
// 12:    var resultYear = 1950;
// 13:
// 14:    for (var j = 0; j < 101; j++) {
// 15:        runningSum += delta[j];
// 16:        if (runningSum > maxPop) {
// 17:            maxPop = runningSum;
// 18:            resultYear = 1950 + j;
// 19:        }
// 20:    }
// 21:
// 22:    return resultYear;
// 23: }
export function maxPopSweepTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const logs: [number, number][] = [];
  for (let k = 0; k + 1 < nums.length; k += 2) logs.push([nums[k], nums[k + 1]]);
  const delta = new Array(101).fill(0);

  const pushStep = (
    line: number,
    j: number,
    runningSum: number,
    maxPop: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: nums.map(() => "idle"),
      vars: [
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "runningSum", value: String(runningSum), tone: "info" },
        { name: "maxPop", value: String(maxPop), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < logs.length; i++) {
    delta[logs[i][0] - 1950]++;
    delta[logs[i][1] - 1950]--;
    pushStep(5, -1, 0, 0, `delta[${logs[i][0] - 1950}]++`, "info", `Birth event: delta[${logs[i][0] - 1950}]++ (year ${logs[i][0]}).`);
    pushStep(6, -1, 0, 0, `delta[${logs[i][1] - 1950}]--`, "info", `Death event: delta[${logs[i][1] - 1950}]-- (year ${logs[i][1]}).`);
  }

  let maxPop = 0;
  let runningSum = 0;
  let resultYear = 1950;
  for (let j = 0; j < 101; j++) {
    runningSum += delta[j];
    pushStep(15, j, runningSum, maxPop, `runningSum → ${runningSum}`, "info", `Year ${1950 + j}: runningSum += delta[${j}] → ${runningSum}.`);
    if (runningSum > maxPop) {
      maxPop = runningSum;
      resultYear = 1950 + j;
      pushStep(16, j, runningSum, maxPop, `new max ${maxPop}`, "ok", `runningSum ${runningSum} > maxPop → resultYear = ${resultYear}.`);
    }
  }

  done = true;
  steps.push({ line: 22, cells: nums.map(() => "idle"), vars: [{ name: "result", value: String(resultYear), tone: "ok" }], result: String(resultYear), resultTone: "ok", explanation: `Maximum population year = ${resultYear} (pop ${maxPop}).`, done });
  return steps;
}

// ── Subarray Sum Equals K ──────────────────────────────────────────────
// Two DISTINCT approaches. nums is the array; k is the target sum.

// Approach 1: Brute Force.
// Source (lines):
// 0: function subarraySum(nums, k) {
// 1:   let count = 0
// 2:   for (let i = 0; i < nums.length; i++) {
// 3:     let sum = 0
// 4:     for (let j = i; j < nums.length; j++) {
// 5:       sum += nums[j]
// 6:       if (sum === k) {
// 7:         count++
// 8:       }
// 9:     }
// 10:  }
// 11:  return count
// 12: }
export function subarraySumBruteTrace(nums: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let count = 0;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    sum: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "sum", value: String(sum), tone: "info" },
        { name: "count", value: String(count), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum === k) {
        count++;
        pushStep(6, i, j, sum, `sum = k → count ${count}`, "ok", `Subarray [${i}..${j}] sums to ${k} → count = ${count}.`);
      } else {
        pushStep(6, i, j, sum, `sum = ${sum}`, "fail", `Subarray [${i}..${j}] sums to ${sum} ≠ ${k}.`);
      }
    }
  }

  done = true;
  steps.push({ line: 11, cells: nums.map(() => "idle"), vars: [{ name: "count", value: String(count), tone: "ok" }], result: String(count), resultTone: "ok", explanation: `Total subarrays summing to ${k} = ${count}.`, done });
  return steps;
}

// Approach 2: Prefix Sum + Hash Map.
// Source (lines):
// 0: function subarraySum(nums, k) {
// 1:   let count = 0
// 2:   let prefixSum = 0
// 3:   // Map from prefix sum value to how many times we've seen it
// 4:   const prefixCount = new Map()
// 5:   prefixCount.set(0, 1) // Empty prefix (sum = 0) seen once
// 6:
// 7:   for (const num of nums) {
// 8:     prefixSum += num
// 9:     // How many earlier prefix sums form a valid subarray ending here?
// 10:    count += prefixCount.get(prefixSum - k) || 0
// 11:    prefixCount.set(prefixSum, (prefixCount.get(prefixSum) || 0) + 1)
// 12:  }
// 13:  return count
// 14: }
export function subarraySumMapTrace(nums: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let count = 0;
  let prefixSum = 0;
  const prefixCount = new Map<number, number>();
  prefixCount.set(0, 1);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "prefixSum", value: String(prefixSum), tone: "info" },
        { name: "count", value: String(count), tone: "info" },
        { name: "prefixCount", value: `{${Array.from(prefixCount.entries()).map(([v, c]) => `${v}:${c}`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    prefixSum += nums[i];
    pushStep(8, i, `prefixSum → ${prefixSum}`, "info", `prefixSum += nums[${i}] → ${prefixSum}.`);
    const need = prefixSum - k;
    const add = prefixCount.get(need) || 0;
    count += add;
    pushStep(10, i, `count += ${add} → ${count}`, add > 0 ? "ok" : "info", `prefixSum - k = ${need}; seen ${add} time(s) → count = ${count}.`);
    prefixCount.set(prefixSum, (prefixCount.get(prefixSum) || 0) + 1);
    pushStep(11, i, `prefixCount[${prefixSum}]++`, "info", `Record prefix sum ${prefixSum}.`);
  }

  done = true;
  steps.push({ line: 13, cells: nums.map(() => "idle"), vars: [{ name: "count", value: String(count), tone: "ok" }], result: String(count), resultTone: "ok", explanation: `Total subarrays summing to ${k} = ${count}.`, done });
  return steps;
}

// ── Subarray Sums Divisible by K ────────────────────────────────────────
// Two DISTINCT approaches. nums is the array; k is the divisor.

// Approach 1: Brute Force.
// Source (lines):
// 0: function subarraysDivByK(nums, k) {
// 1:   let count = 0
// 2:   for (let i = 0; i < nums.length; i++) {
// 3:     let sum = 0
// 4:     for (let j = i; j < nums.length; j++) {
// 5:       sum += nums[j]
// 6:       if (sum % k === 0) {
// 7:         count++
// 8:       }
// 9:     }
// 10:  }
// 11:  return count
// 12: }
export function subarraysDivByKBruteTrace(nums: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let count = 0;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    sum: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "sum", value: String(sum), tone: "info" },
        { name: "count", value: String(count), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum % k === 0) {
        count++;
        pushStep(6, i, j, sum, `divisible → count ${count}`, "ok", `Subarray [${i}..${j}] sum ${sum} divisible by ${k} → count = ${count}.`);
      } else {
        pushStep(6, i, j, sum, `sum % k = ${sum % k}`, "fail", `Subarray [${i}..${j}] sum ${sum} not divisible by ${k}.`);
      }
    }
  }

  done = true;
  steps.push({ line: 11, cells: nums.map(() => "idle"), vars: [{ name: "count", value: String(count), tone: "ok" }], result: String(count), resultTone: "ok", explanation: `Total subarrays divisible by ${k} = ${count}.`, done });
  return steps;
}

// Approach 2: Prefix Sum + Hash Map (Optimal).
// Source (lines):
// 0: function subarraysDivByK(nums, k) {
// 1:   // Map to count occurrences of each remainder
// 2:   const remainderCount = new Map([[0, 1]]) // empty prefix has remainder 0
// 3:   let prefixSum = 0
// 4:   let count = 0
// 5:
// 6:   for (const num of nums) {
// 7:     prefixSum += num
// 8:     // Normalize remainder to handle negative prefix sums
// 9:     const remainder = ((prefixSum % k) + k) % k
// 10:
// 11:    // Each previous prefix sum with the same remainder forms a valid subarray
// 12:    const prev = remainderCount.get(remainder) || 0
// 13:    count += prev
// 14:    remainderCount.set(remainder, prev + 1)
// 15:  }
// 16:
// 17:  return count
// 18: }
export function subarraysDivByKMapTrace(nums: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let prefixSum = 0;
  let count = 0;
  const remainderCount = new Map<number, number>([[0, 1]]);

  const pushStep = (
    line: number,
    i: number,
    remainder: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "prefixSum", value: String(prefixSum), tone: "info" },
        { name: "remainder", value: String(remainder), tone: "info" },
        { name: "count", value: String(count), tone: "info" },
        { name: "remainderCount", value: `{${Array.from(remainderCount.entries()).map(([v, c]) => `${v}:${c}`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    prefixSum += nums[i];
    const remainder = ((prefixSum % k) + k) % k;
    pushStep(9, i, remainder, `remainder = ${remainder}`, "info", `prefixSum = ${prefixSum}; remainder = (${prefixSum} % ${k} + ${k}) % ${k} = ${remainder}.`);
    const prev = remainderCount.get(remainder) || 0;
    count += prev;
    pushStep(12, i, remainder, `count += ${prev} → ${count}`, prev > 0 ? "ok" : "info", `Remainder ${remainder} seen ${prev} time(s) → count = ${count}.`);
    remainderCount.set(remainder, prev + 1);
    pushStep(14, i, remainder, `remainderCount[${remainder}]++`, "info", `Record remainder ${remainder}.`);
  }

  done = true;
  steps.push({ line: 17, cells: nums.map(() => "idle"), vars: [{ name: "count", value: String(count), tone: "ok" }], result: String(count), resultTone: "ok", explanation: `Total subarrays divisible by ${k} = ${count}.`, done });
  return steps;
}

// ── Continuous Subarray Sum ────────────────────────────────────────────
// Two DISTINCT approaches. nums is the array; k is the divisor.

// Approach 1: Brute Force.
// Source (lines):
// 0: function checkSubarraySum(nums, k) {
// 1:     const n = nums.length;
// 2:     for (let i = 0; i < n - 1; i++) {
// 3:         let sum = nums[i];
// 4:         for (let j = i + 1; j < n; j++) {
// 5:             sum += nums[j];
// 6:             // Check if subarray sum is a multiple of k
// 7:             if (sum % k === 0) {
// 8:                 return true;
// 9:             }
// 10:        }
// 11:    }
// 12:    return false;
// 13: }
export function checkSubarraySumBruteTrace(nums: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    sum: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "sum", value: String(sum), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < n - 1; i++) {
    let sum = nums[i];
    for (let j = i + 1; j < n; j++) {
      sum += nums[j];
      if (sum % k === 0) {
        pushStep(7, i, j, sum, "multiple of k!", "ok", `Subarray [${i}..${j}] sum ${sum} is a multiple of ${k} → return true.`);
        done = true;
        steps.push({ line: 8, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `Found subarray of length ≥ 2 with sum divisible by ${k}.`, done });
        return steps;
      }
      pushStep(7, i, j, sum, `sum % k = ${sum % k}`, "fail", `Subarray [${i}..${j}] sum ${sum} not divisible by ${k}.`);
    }
  }

  done = true;
  steps.push({ line: 12, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `No valid subarray → return false.`, done });
  return steps;
}

// Approach 2: Prefix Sum + Hash Map (Optimal).
// Source (lines):
// 0: function checkSubarraySum(nums, k) {
// 1:     // Map: remainder -> earliest index where this remainder was seen
// 2:     const remainderIndex = new Map();
// 3:     // Handle subarrays starting from index 0
// 4:     remainderIndex.set(0, -1);
// 5:     let prefixSum = 0;
// 6:
// 7:     for (let i = 0; i < nums.length; i++) {
// 8:         prefixSum += nums[i];
// 9:         const remainder = prefixSum % k;
// 10:
// 11:        if (remainderIndex.has(remainder)) {
// 12:            // Same remainder seen before, check if subarray length >= 2
// 13:            if (i - remainderIndex.get(remainder) >= 2) {
// 14:                return true;
// 15:            }
// 16:        } else {
// 17:            // Only store the first occurrence to maximize subarray length
// 18:            remainderIndex.set(remainder, i);
// 19:        }
// 20:    }
// 21:    return false;
// 22: }
export function checkSubarraySumMapTrace(nums: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let prefixSum = 0;
  const remainderIndex = new Map<number, number>();
  remainderIndex.set(0, -1);

  const pushStep = (
    line: number,
    i: number,
    remainder: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "prefixSum", value: String(prefixSum), tone: "info" },
        { name: "remainder", value: String(remainder), tone: "info" },
        { name: "remainderIndex", value: `{${Array.from(remainderIndex.entries()).map(([v, idx]) => `${v}:${idx}`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    prefixSum += nums[i];
    const remainder = prefixSum % k;
    pushStep(9, i, remainder, `remainder = ${remainder}`, "info", `prefixSum = ${prefixSum}; remainder = ${prefixSum} % ${k} = ${remainder}.`);
    if (remainderIndex.has(remainder)) {
      const dist = i - remainderIndex.get(remainder)!;
      pushStep(13, i, remainder, `dist = ${dist}`, "info", `Remainder ${remainder} first seen at index ${remainderIndex.get(remainder)}, distance = ${dist}.`);
      if (dist >= 2) {
        pushStep(13, i, remainder, "length ≥ 2!", "ok", `Distance ${dist} ≥ 2 → return true.`);
        done = true;
        steps.push({ line: 14, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `Found subarray of length ≥ 2 with sum divisible by ${k}.`, done });
        return steps;
      }
    } else {
      remainderIndex.set(remainder, i);
      pushStep(18, i, remainder, `remainderIndex[${remainder}] = ${i}`, "info", `Store first occurrence of remainder ${remainder} at index ${i}.`);
    }
  }

  done = true;
  steps.push({ line: 21, cells: nums.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `No valid subarray → return false.`, done });
  return steps;
}

// ── Contiguous Array ────────────────────────────────────────────────────
// Two DISTINCT approaches. nums is a binary array.

// Approach 1: Brute Force.
// Source (lines):
// 0: function findMaxLength(nums) {
// 1:     let maxLen = 0;
// 2:     for (let i = 0; i < nums.length; i++) {
// 3:         let zeros = 0, ones = 0;
// 4:         for (let j = i; j < nums.length; j++) {
// 5:             if (nums[j] === 0) zeros++;
// 6:             else ones++;
// 7:             if (zeros === ones) {
// 8:                 maxLen = Math.max(maxLen, j - i + 1);
// 9:             }
// 10:        }
// 11:    }
// 12:    return maxLen;
// 13: }
export function findMaxLengthBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let maxLen = 0;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    zeros: number,
    ones: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "zeros", value: String(zeros), tone: "info" },
        { name: "ones", value: String(ones), tone: "info" },
        { name: "maxLen", value: String(maxLen), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    let zeros = 0, ones = 0;
    for (let j = i; j < nums.length; j++) {
      if (nums[j] === 0) zeros++;
      else ones++;
      if (zeros === ones) {
        maxLen = Math.max(maxLen, j - i + 1);
        pushStep(7, i, j, zeros, ones, `equal → maxLen ${maxLen}`, "ok", `Subarray [${i}..${j}] has equal 0s/1s → maxLen = ${maxLen}.`);
      } else {
        pushStep(7, i, j, zeros, ones, `zeros=${zeros} ones=${ones}`, "fail", `Subarray [${i}..${j}] has ${zeros} zeros, ${ones} ones.`);
      }
    }
  }

  done = true;
  steps.push({ line: 12, cells: nums.map(() => "idle"), vars: [{ name: "maxLen", value: String(maxLen), tone: "ok" }], result: String(maxLen), resultTone: "ok", explanation: `Maximum length with equal 0s and 1s = ${maxLen}.`, done });
  return steps;
}

// Approach 2: Prefix Sum + Hash Map.
// Source (lines):
// 0: function findMaxLength(nums) {
// 1:     // Map stores first occurrence of each prefix sum
// 2:     const map = new Map();
// 3:     map.set(0, -1); // handle subarrays starting from index 0
// 4:     let prefixSum = 0;
// 5:     let maxLen = 0;
// 6:
// 7:     for (let i = 0; i < nums.length; i++) {
// 8:         // Treat 0 as -1: equal 0s and 1s means sum = 0
// 9:         prefixSum += nums[i] === 1 ? 1 : -1;
// 10:
// 11:        if (map.has(prefixSum)) {
// 12:            maxLen = Math.max(maxLen, i - map.get(prefixSum));
// 13:        } else {
// 14:            map.set(prefixSum, i);
// 15:        }
// 16:    }
// 17:    return maxLen;
// 18: }
export function findMaxLengthMapTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let prefixSum = 0;
  let maxLen = 0;
  const map = new Map<number, number>();
  map.set(0, -1);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "prefixSum", value: String(prefixSum), tone: "info" },
        { name: "maxLen", value: String(maxLen), tone: "info" },
        { name: "map", value: `{${Array.from(map.entries()).map(([v, idx]) => `${v}:${idx}`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    prefixSum += nums[i] === 1 ? 1 : -1;
    pushStep(9, i, `prefixSum → ${prefixSum}`, "info", `nums[${i}] = ${nums[i]} → prefixSum = ${prefixSum}.`);
    if (map.has(prefixSum)) {
      const len = i - map.get(prefixSum)!;
      maxLen = Math.max(maxLen, len);
      pushStep(12, i, `len = ${len} → maxLen ${maxLen}`, "ok", `prefixSum ${prefixSum} first seen at index ${map.get(prefixSum)} → length ${len}, maxLen = ${maxLen}.`);
    } else {
      map.set(prefixSum, i);
      pushStep(14, i, `map[${prefixSum}] = ${i}`, "info", `Store first occurrence of prefixSum ${prefixSum} at index ${i}.`);
    }
  }

  done = true;
  steps.push({ line: 17, cells: nums.map(() => "idle"), vars: [{ name: "maxLen", value: String(maxLen), tone: "ok" }], result: String(maxLen), resultTone: "ok", explanation: `Maximum length with equal 0s and 1s = ${maxLen}.`, done });
  return steps;
}

// ── Maximum Average Subarray I ─────────────────────────────────────────
// Two DISTINCT approaches. nums is the array; k is the window size.

// Approach 1: Brute Force.
// Source (lines):
// 0: function findMaxAverage(nums, k) {
// 1:     let maxSum = -Infinity;
// 2:
// 3:     for (let i = 0; i <= nums.length - k; i++) {
// 4:         let windowSum = 0;
// 5:         for (let j = i; j < i + k; j++) {
// 6:             windowSum += nums[j];
// 7:         }
// 8:         maxSum = Math.max(maxSum, windowSum);
// 9:     }
// 10:
// 11:    return maxSum / k;
// 12: }
export function maxAvgBruteTrace(nums: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let maxSum = -Infinity;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    windowSum: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "windowSum", value: String(windowSum), tone: "info" },
        { name: "maxSum", value: maxSum === -Infinity ? "-∞" : String(maxSum), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i <= nums.length - k; i++) {
    let windowSum = 0;
    for (let j = i; j < i + k; j++) {
      windowSum += nums[j];
      pushStep(6, i, j, windowSum, `windowSum → ${windowSum}`, "info", `Add nums[${j}] = ${nums[j]} → windowSum = ${windowSum}.`);
    }
    maxSum = Math.max(maxSum, windowSum);
    pushStep(8, i, -1, windowSum, `maxSum = ${maxSum}`, "ok", `Window [${i}..${i + k - 1}] sum ${windowSum} → maxSum = ${maxSum}.`);
  }

  done = true;
  steps.push({ line: 11, cells: nums.map(() => "idle"), vars: [{ name: "maxSum", value: String(maxSum), tone: "ok" }], result: String(maxSum / k), resultTone: "ok", explanation: `Max average = ${maxSum} / ${k} = ${maxSum / k}.`, done });
  return steps;
}

// Approach 2: Sliding Window (Optimal).
// Source (lines):
// 0: function findMaxAverage(nums, k) {
// 1:     // Compute sum of the first window
// 2:     let windowSum = 0;
// 3:     for (let i = 0; i < k; i++) {
// 4:         windowSum += nums[i];
// 5:     }
// 6:
// 7:     let maxSum = windowSum;
// 8:
// 9:     // Slide the window: add new element, remove old element
// 10:    for (let i = k; i < nums.length; i++) {
// 11:        windowSum += nums[i] - nums[i - k];
// 12:        maxSum = Math.max(maxSum, windowSum);
// 13:    }
// 14:
// 15:    return maxSum / k;
// 16: }
export function maxAvgSlidingTrace(nums: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  let maxSum = windowSum;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "windowSum", value: String(windowSum), tone: "info" },
        { name: "maxSum", value: String(maxSum), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(4, k - 1, `windowSum = ${windowSum}`, "info", `First window [0..${k - 1}] sum = ${windowSum}.`);
  pushStep(7, k - 1, `maxSum = ${maxSum}`, "info", `maxSum initialized to ${maxSum}.`);

  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    pushStep(11, i, `windowSum → ${windowSum}`, "info", `Add nums[${i}] = ${nums[i]}, remove nums[${i - k}] = ${nums[i - k]} → windowSum = ${windowSum}.`);
    maxSum = Math.max(maxSum, windowSum);
    pushStep(12, i, `maxSum = ${maxSum}`, "ok", `maxSum = max(${maxSum}, ${windowSum}) = ${maxSum}.`);
  }

  done = true;
  steps.push({ line: 15, cells: nums.map(() => "idle"), vars: [{ name: "maxSum", value: String(maxSum), tone: "ok" }], result: String(maxSum / k), resultTone: "ok", explanation: `Max average = ${maxSum} / ${k} = ${maxSum / k}.`, done });
  return steps;
}

// ── Find All Anagrams in a String ─────────────────────────────────────
// Two DISTINCT approaches. s and p as char-code arrays.

// Approach 1: Brute Force (Sorting).
// Source (lines):
// 0: function findAnagrams(s, p) {
// 1:     const result = [];
// 2:     const pLen = p.length;
// 3:     const sLen = s.length;
// 4:     if (sLen < pLen) return result;
// 5:
// 6:     const sortedP = p.split('').sort().join('');
// 7:
// 8:     for (let i = 0; i <= sLen - pLen; i++) {
// 9:         const window = s.substring(i, i + pLen).split('').sort().join('');
// 10:        if (window === sortedP) {
// 11:            result.push(i);
// 12:        }
// 13:    }
// 14:    return result;
// 15: }
export function findAnagramsBruteTrace(sCodes: number[], pCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const p = pCodes.map((c) => String.fromCharCode(c)).join("");
  const result: number[] = [];
  const pLen = p.length;
  const sLen = s.length;
  const sortedP = p.split("").sort().join("");

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, (idx) => (idx === i ? "i" : "idle")),
      values: [...sCodes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (sLen < pLen) {
    done = true;
    steps.push({ line: 4, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: "[]", tone: "fail" }], result: "[]", resultTone: "fail", explanation: `s shorter than p → return [].`, done });
    return steps;
  }

  for (let i = 0; i <= sLen - pLen; i++) {
    const window = s.substring(i, i + pLen).split("").sort().join("");
    if (window === sortedP) {
      result.push(i);
      pushStep(10, i, `anagram at ${i}`, "ok", `Window '${s.substring(i, i + pLen)}' sorted = '${window}' matches '${sortedP}' → push ${i}.`);
    } else {
      pushStep(10, i, "no match", "fail", `Window '${s.substring(i, i + pLen)}' sorted = '${window}' ≠ '${sortedP}'.`);
    }
  }

  done = true;
  steps.push({ line: 14, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Anagram start indices = [${result.join(", ")}].`, done });
  return steps;
}

// Approach 2: Frequency Map Comparison.
// Source (lines):
// 0: function findAnagrams(s, p) {
// 1:     const result = [];
// 2:     const sLen = s.length, pLen = p.length;
// 3:     if (sLen < pLen) return result;
// 4:
// 5:     const pCount = new Array(26).fill(0);
// 6:     const windowCount = new Array(26).fill(0);
// 7:
// 8:     // Build frequency maps for p and the first window
// 9:     for (let i = 0; i < pLen; i++) {
// 10:        pCount[p.charCodeAt(i) - 97]++;
// 11:        windowCount[s.charCodeAt(i) - 97]++;
// 12:    }
// 13:
// 14:    if (pCount.every((val, idx) => val === windowCount[idx])) result.push(0);
// 15:
// 16:    // Slide the window across s
// 17:    for (let i = pLen; i < sLen; i++) {
// 18:        windowCount[s.charCodeAt(i) - 97]++;             // add new char
// 19:        windowCount[s.charCodeAt(i - pLen) - 97]--;       // remove old char
// 20:        if (pCount.every((val, idx) => val === windowCount[idx])) {
// 21:            result.push(i - pLen + 1);
// 22:        }
// 23:    }
// 24:    return result;
// 25: }
export function findAnagramsFreqTrace(sCodes: number[], pCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const p = pCodes.map((c) => String.fromCharCode(c)).join("");
  const result: number[] = [];
  const sLen = s.length, pLen = p.length;
  const pCount = new Array(26).fill(0);
  const windowCount = new Array(26).fill(0);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, (idx) => (idx === i ? "i" : "idle")),
      values: [...sCodes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "pCount", value: `[${pCount.join(",")}]`, tone: "info" },
        { name: "windowCount", value: `[${windowCount.join(",")}]`, tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (sLen < pLen) {
    done = true;
    steps.push({ line: 3, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: "[]", tone: "fail" }], result: "[]", resultTone: "fail", explanation: `s shorter than p → return [].`, done });
    return steps;
  }

  for (let i = 0; i < pLen; i++) {
    pCount[p.charCodeAt(i) - 97]++;
    windowCount[s.charCodeAt(i) - 97]++;
    pushStep(10, i, `build counts`, "info", `p[${i}]='${p[i]}' (+1), s[${i}]='${s[i]}' (+1).`);
  }

  const matches = () => pCount.every((val, idx) => val === windowCount[idx]);
  if (matches()) {
    result.push(0);
    pushStep(14, pLen - 1, "match at 0", "ok", `First window matches p → push 0.`);
  }

  for (let i = pLen; i < sLen; i++) {
    windowCount[s.charCodeAt(i) - 97]++;
    windowCount[s.charCodeAt(i - pLen) - 97]--;
    pushStep(18, i, `slide window`, "info", `Add s[${i}]='${s[i]}', remove s[${i - pLen}]='${s[i - pLen]}'.`);
    if (matches()) {
      result.push(i - pLen + 1);
      pushStep(20, i, `match at ${i - pLen + 1}`, "ok", `Window matches p → push ${i - pLen + 1}.`);
    }
  }

  done = true;
  steps.push({ line: 24, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Anagram start indices = [${result.join(", ")}].`, done });
  return steps;
}

// ── Permutation in String ──────────────────────────────────────────────
// Two DISTINCT approaches. s1 and s2 as char-code arrays.

// Approach 1: Brute Force (Generate All Permutations).
// Source (lines):
// 0: function checkInclusion(s1, s2) {
// 1:   const perms = [];
// 2:   generatePermutations(s1.split(""), 0, perms);
// 3:
// 4:   // Check if any permutation is a substring of s2
// 5:   for (let i = 0; i < perms.length; i++) {
// 6:     if (s2.includes(perms[i])) {
// 7:       return true;
// 8:     }
// 9:   }
// 10:
// 11:  return false;
// 12: }
// 13: function generatePermutations(arr, index, result) {
// 14:  if (index === arr.length) {
// 15:    result.push(arr.join(""));
// 16:    return;
// 17:  }
// 18:  for (let i = index; i < arr.length; i++) {
// 19:    const temp = arr[index];
// 20:    arr[index] = arr[i];
// 21:    arr[i] = temp;
// 22:
// 23:    generatePermutations(arr, index + 1, result);
// 24:
// 25:    arr[i] = arr[index];
// 26:    arr[index] = temp;
// 27:  }
// 28: }
export function checkInclusionBruteTrace(s1Codes: number[], s2Codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s1 = s1Codes.map((c) => String.fromCharCode(c)).join("");
  const s2 = s2Codes.map((c) => String.fromCharCode(c)).join("");
  const perms: string[] = [];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(s2Codes, () => "idle"),
      values: [...s2Codes],
      vars: [
        { name: "perms", value: `[${perms.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  const generate = (arr: string[], index: number) => {
    if (index === arr.length) {
      perms.push(arr.join(""));
      pushStep(15, `perm '${arr.join("")}'`, "info", `Generated permutation '${arr.join("")}'.`);
      return;
    }
    for (let i = index; i < arr.length; i++) {
      const temp = arr[index];
      arr[index] = arr[i];
      arr[i] = temp;
      generate(arr, index + 1);
      arr[i] = arr[index];
      arr[index] = temp;
    }
  };

  generate(s1.split(""), 0);

  for (let i = 0; i < perms.length; i++) {
    if (s2.includes(perms[i])) {
      pushStep(6, `found '${perms[i]}'`, "ok", `s2 contains permutation '${perms[i]}' → return true.`);
      done = true;
      steps.push({ line: 7, cells: s2Codes.map(() => "idle"), values: [...s2Codes], vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `A permutation of s1 is a substring of s2 → return true.`, done });
      return steps;
    }
  }

  done = true;
  steps.push({ line: 11, cells: s2Codes.map(() => "idle"), values: [...s2Codes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `No permutation of s1 is a substring of s2 → return false.`, done });
  return steps;
}

// Approach 2: Sliding Window with Frequency Comparison.
// Source (lines):
// 0: function checkInclusion(s1, s2) {
// 1:   const n = s1.length,
// 2:     m = s2.length;
// 3:   if (n > m) return false;
// 4:
// 5:   const s1Freq = new Array(26).fill(0);
// 6:   const windowFreq = new Array(26).fill(0);
// 7:
// 8:   // Build frequency arrays for s1 and the first window
// 9:   for (let i = 0; i < n; i++) {
// 10:    s1Freq[s1.charCodeAt(i) - 97]++;
// 11:    windowFreq[s2.charCodeAt(i) - 97]++;
// 12:  }
// 13:
// 14:  if (matches(s1Freq, windowFreq)) return true;
// 15:
// 16:  // Slide the window across s2
// 17:  for (let i = n; i < m; i++) {
// 18:    windowFreq[s2.charCodeAt(i) - 97]++;         // Add new char
// 19:    windowFreq[s2.charCodeAt(i - n) - 97]--;     // Remove old char
// 20:    if (matches(s1Freq, windowFreq)) return true;
// 21:  }
// 22:
// 23:  return false;
// 24: }
// 25: function matches(a, b) {
// 26:  for (let i = 0; i < 26; i++) {
// 27:    if (a[i] !== b[i]) return false;
// 28:  }
// 29:  return true;
// 30: }
export function checkInclusionSlidingTrace(s1Codes: number[], s2Codes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s1 = s1Codes.map((c) => String.fromCharCode(c)).join("");
  const s2 = s2Codes.map((c) => String.fromCharCode(c)).join("");
  const n = s1.length, m = s2.length;
  const s1Freq = new Array(26).fill(0);
  const windowFreq = new Array(26).fill(0);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(s2Codes, (idx) => (idx === i ? "i" : "idle")),
      values: [...s2Codes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "s1Freq", value: `[${s1Freq.join(",")}]`, tone: "info" },
        { name: "windowFreq", value: `[${windowFreq.join(",")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  const matches = () => {
    for (let i = 0; i < 26; i++) if (s1Freq[i] !== windowFreq[i]) return false;
    return true;
  };

  if (n > m) {
    done = true;
    steps.push({ line: 3, cells: s2Codes.map(() => "idle"), values: [...s2Codes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `s1 longer than s2 → return false.`, done });
    return steps;
  }

  for (let i = 0; i < n; i++) {
    s1Freq[s1.charCodeAt(i) - 97]++;
    windowFreq[s2.charCodeAt(i) - 97]++;
    pushStep(10, i, `build counts`, "info", `s1[${i}]='${s1[i]}' (+1), s2[${i}]='${s2[i]}' (+1).`);
  }

  if (matches()) {
    pushStep(14, n - 1, "match!", "ok", `First window matches s1 → return true.`);
    done = true;
    steps.push({ line: 14, cells: s2Codes.map(() => "idle"), values: [...s2Codes], vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `A permutation of s1 is a substring of s2 → return true.`, done });
    return steps;
  }

  for (let i = n; i < m; i++) {
    windowFreq[s2.charCodeAt(i) - 97]++;
    windowFreq[s2.charCodeAt(i - n) - 97]--;
    pushStep(18, i, `slide window`, "info", `Add s2[${i}]='${s2[i]}', remove s2[${i - n}]='${s2[i - n]}'.`);
    if (matches()) {
      pushStep(20, i, "match!", "ok", `Window matches s1 → return true.`);
      done = true;
      steps.push({ line: 20, cells: s2Codes.map(() => "idle"), values: [...s2Codes], vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `A permutation of s1 is a substring of s2 → return true.`, done });
      return steps;
    }
  }

  done = true;
  steps.push({ line: 23, cells: s2Codes.map(() => "idle"), values: [...s2Codes], vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `No permutation of s1 is a substring of s2 → return false.`, done });
  return steps;
}

// ── Maximum Sum of Distinct Subarrays With Length K ─────────────────────
// Two DISTINCT approaches. nums is the array; k is the window size.

// Approach 1: Brute Force.
// Source (lines):
// 0: function maximumSubarraySum(nums, k) {
// 1:   let maxSum = 0
// 2:   for (let i = 0; i <= nums.length - k; i++) {
// 3:     const seen = new Set()
// 4:     let sum = 0
// 5:     let valid = true
// 6:     for (let j = i; j < i + k; j++) {
// 7:       // If element already in set, this subarray has duplicates
// 8:       if (seen.has(nums[j])) {
// 9:         valid = false
// 10:        break
// 11:      }
// 12:      seen.add(nums[j])
// 13:      sum += nums[j]
// 14:    }
// 15:    if (valid) {
// 16:      maxSum = Math.max(maxSum, sum)
// 17:    }
// 18:  }
// 19:  return maxSum
// 20: }
export function maxDistinctBruteTrace(nums: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let maxSum = 0;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    sum: number,
    seenStr: string,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "sum", value: String(sum), tone: "info" },
        { name: "seen", value: seenStr, tone: "info" },
        { name: "maxSum", value: String(maxSum), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i <= nums.length - k; i++) {
    const seen = new Set<number>();
    let sum = 0;
    let valid = true;
    for (let j = i; j < i + k; j++) {
      if (seen.has(nums[j])) {
        valid = false;
        pushStep(8, i, j, sum, `{${Array.from(seen).join(", ")}}`, "duplicate!", "fail", `nums[${j}] = ${nums[j]} already in set → invalid window.`);
        break;
      }
      seen.add(nums[j]);
      sum += nums[j];
      pushStep(12, i, j, sum, `{${Array.from(seen).join(", ")}}`, `sum → ${sum}`, "info", `Add nums[${j}] = ${nums[j]} → sum = ${sum}.`);
    }
    if (valid) {
      maxSum = Math.max(maxSum, sum);
      pushStep(15, i, -1, sum, `{${Array.from(seen).join(", ")}}`, `maxSum = ${maxSum}`, "ok", `Window [${i}..${i + k - 1}] all distinct, sum ${sum} → maxSum = ${maxSum}.`);
    }
  }

  done = true;
  steps.push({ line: 19, cells: nums.map(() => "idle"), vars: [{ name: "maxSum", value: String(maxSum), tone: "ok" }], result: String(maxSum), resultTone: "ok", explanation: `Maximum sum of distinct subarray of length ${k} = ${maxSum}.`, done });
  return steps;
}

// Approach 2: Sliding Window with Hash Map.
// Source (lines):
// 0: function maximumSubarraySum(nums, k) {
// 1:   const freq = new Map()
// 2:   let windowSum = 0
// 3:   let maxSum = 0
// 4:
// 5:   // Build the first window of size k
// 6:   for (let i = 0; i < k; i++) {
// 7:     freq.set(nums[i], (freq.get(nums[i]) || 0) + 1)
// 8:     windowSum += nums[i]
// 9:   }
// 10:  // Check if the first window has all distinct elements
// 11:  if (freq.size === k) {
// 12:    maxSum = windowSum
// 13:  }
// 14:
// 15:  // Slide the window across the rest of the array
// 16:  for (let i = k; i < nums.length; i++) {
// 17:    // Add the new element entering the window
// 18:    freq.set(nums[i], (freq.get(nums[i]) || 0) + 1)
// 19:    windowSum += nums[i]
// 20:
// 21:    // Remove the element leaving the window
// 22:    const outVal = nums[i - k]
// 23:    freq.set(outVal, freq.get(outVal) - 1)
// 24:    if (freq.get(outVal) === 0) {
// 25:      freq.delete(outVal)
// 26:    }
// 27:    windowSum -= outVal
// 28:
// 29:    // Window is valid only when all k elements are distinct
// 30:    if (freq.size === k) {
// 31:      maxSum = Math.max(maxSum, windowSum)
// 32:    }
// 33:  }
// 34:  return maxSum
// 35: }
export function maxDistinctSlidingTrace(nums: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const freq = new Map<number, number>();
  let windowSum = 0;
  let maxSum = 0;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "windowSum", value: String(windowSum), tone: "info" },
        { name: "maxSum", value: String(maxSum), tone: "info" },
        { name: "freq", value: `{${Array.from(freq.entries()).map(([v, c]) => `${v}:${c}`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < k; i++) {
    freq.set(nums[i], (freq.get(nums[i]) || 0) + 1);
    windowSum += nums[i];
    pushStep(7, i, `windowSum → ${windowSum}`, "info", `Add nums[${i}] = ${nums[i]} → windowSum = ${windowSum}.`);
  }
  if (freq.size === k) {
    maxSum = windowSum;
    pushStep(11, k - 1, `maxSum = ${maxSum}`, "ok", `First window all distinct → maxSum = ${maxSum}.`);
  }

  for (let i = k; i < nums.length; i++) {
    freq.set(nums[i], (freq.get(nums[i]) || 0) + 1);
    windowSum += nums[i];
    pushStep(18, i, `add ${nums[i]}`, "info", `Add nums[${i}] = ${nums[i]} → windowSum = ${windowSum}.`);
    const outVal = nums[i - k];
    freq.set(outVal, freq.get(outVal)! - 1);
    if (freq.get(outVal) === 0) freq.delete(outVal);
    windowSum -= outVal;
    pushStep(23, i, `remove ${outVal}`, "info", `Remove nums[${i - k}] = ${outVal} → windowSum = ${windowSum}.`);
    if (freq.size === k) {
      maxSum = Math.max(maxSum, windowSum);
      pushStep(30, i, `maxSum = ${maxSum}`, "ok", `Window all distinct, sum ${windowSum} → maxSum = ${maxSum}.`);
    }
  }

  done = true;
  steps.push({ line: 34, cells: nums.map(() => "idle"), vars: [{ name: "maxSum", value: String(maxSum), tone: "ok" }], result: String(maxSum), resultTone: "ok", explanation: `Maximum sum of distinct subarray of length ${k} = ${maxSum}.`, done });
  return steps;
}

// ── Substring with Concatenation of All Words ───────────────────────────
// Two DISTINCT approaches. s as char-code array; words as space-separated string.

// Approach 1: Brute Force.
// Source (lines):
// 0: function findSubstring(s, words) {
// 1:     const result = [];
// 2:     const w = words[0].length;
// 3:     const m = words.length;
// 4:     const totalLen = m * w;
// 5:     if (s.length < totalLen) return result;
// 6:
// 7:     // Build target frequency map
// 8:     const target = new Map();
// 9:     for (const word of words) {
// 10:        target.set(word, (target.get(word) || 0) + 1);
// 11:    }
// 12:
// 13:    for (let i = 0; i <= s.length - totalLen; i++) {
// 14:        const seen = new Map();
// 15:        let valid = true;
// 16:        for (let j = 0; j < m; j++) {
// 17:            const chunk = s.substring(i + j * w, i + j * w + w);
// 18:            seen.set(chunk, (seen.get(chunk) || 0) + 1);
// 19:            // Early exit if any chunk exceeds target count
// 20:            if (seen.get(chunk) > (target.get(chunk) || 0)) {
// 21:                valid = false;
// 22:                break;
// 23:            }
// 24:        }
// 25:        if (valid) result.push(i);
// 26:    }
// 27:    return result;
// 28: }
export function findSubstringBruteTrace(sCodes: number[], wordsCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const words = wordsCodes.map((c) => String.fromCharCode(c)).join("").split(" ").filter(Boolean);
  const result: number[] = [];
  const w = words[0]?.length ?? 0;
  const m = words.length;
  const totalLen = m * w;
  const target = new Map<string, number>();
  for (const word of words) target.set(word, (target.get(word) || 0) + 1);

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, (idx) => (idx === i ? "i" : "idle")),
      values: [...sCodes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (s.length < totalLen) {
    done = true;
    steps.push({ line: 5, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: "[]", tone: "fail" }], result: "[]", resultTone: "fail", explanation: `s shorter than total concatenation → return [].`, done });
    return steps;
  }

  for (let i = 0; i <= s.length - totalLen; i++) {
    const seen = new Map<string, number>();
    let valid = true;
    for (let j = 0; j < m; j++) {
      const chunk = s.substring(i + j * w, i + j * w + w);
      seen.set(chunk, (seen.get(chunk) || 0) + 1);
      if (seen.get(chunk)! > (target.get(chunk) || 0)) {
        valid = false;
        pushStep(20, i, `'${chunk}' exceeds`, "fail", `Chunk '${chunk}' count ${seen.get(chunk)} > target ${target.get(chunk) || 0} → invalid.`);
        break;
      }
      pushStep(18, i, `'${chunk}' ok`, "info", `Chunk '${chunk}' within target count.`);
    }
    if (valid) {
      result.push(i);
      pushStep(25, i, `match at ${i}`, "ok", `Window at ${i} uses all words → push ${i}.`);
    }
  }

  done = true;
  steps.push({ line: 27, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Concatenation start indices = [${result.join(", ")}].`, done });
  return steps;
}

// Approach 2: Sliding Window (Optimal).
// Source (lines):
// 0: function findSubstring(s, words) {
// 1:     const result = [];
// 2:     const w = words[0].length;
// 3:     const m = words.length;
// 4:     const totalLen = m * w;
// 5:     if (s.length < totalLen) return result;
// 6:
// 7:     // Build target frequency map
// 8:     const target = new Map();
// 9:     for (const word of words) {
// 10:        target.set(word, (target.get(word) || 0) + 1);
// 11:    }
// 12:    const distinctWords = target.size;
// 13:
// 14:    // Try each starting offset
// 15:    for (let k = 0; k < w; k++) {
// 16:        const seen = new Map();
// 17:        let matchCount = 0;
// 18:        let left = k;
// 19:
// 20:        for (let right = k; right + w <= s.length; right += w) {
// 21:            const rightWord = s.substring(right, right + w);
// 22:
// 23:            // Add right word to window
// 24:            if (target.has(rightWord)) {
// 25:                const count = (seen.get(rightWord) || 0) + 1;
// 26:                seen.set(rightWord, count);
// 27:                if (count === target.get(rightWord)) matchCount++;
// 28:                else if (count === target.get(rightWord) + 1) matchCount--;
// 29:            }
// 30:
// 31:            // Shrink window if it exceeds m words
// 32:            if (right - left >= totalLen) {
// 33:                const leftWord = s.substring(left, left + w);
// 34:                if (target.has(leftWord)) {
// 35:                    const count = seen.get(leftWord);
// 36:                    if (count === target.get(leftWord)) matchCount--;
// 37:                    seen.set(leftWord, count - 1);
// 38:                    if (count - 1 === target.get(leftWord)) matchCount++;
// 39:                }
// 40:                left += w;
// 41:            }
// 42:
// 43:            if (matchCount === distinctWords) result.push(left);
// 44:        }
// 45:    }
// 46:    return result;
// 47: }
export function findSubstringSlidingTrace(sCodes: number[], wordsCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const words = wordsCodes.map((c) => String.fromCharCode(c)).join("").split(" ").filter(Boolean);
  const result: number[] = [];
  const w = words[0]?.length ?? 0;
  const m = words.length;
  const totalLen = m * w;
  const target = new Map<string, number>();
  for (const word of words) target.set(word, (target.get(word) || 0) + 1);
  const distinctWords = target.size;

  const pushStep = (
    line: number,
    left: number,
    right: number,
    matchCount: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, (idx) => {
        if (idx === left) return "i";
        if (idx === right) return "j";
        return "idle";
      }),
      values: [...sCodes],
      vars: [
        { name: "left", value: String(left), tone: "info" },
        { name: "right", value: String(right), tone: "info" },
        { name: "matchCount", value: String(matchCount), tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (s.length < totalLen) {
    done = true;
    steps.push({ line: 5, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: "[]", tone: "fail" }], result: "[]", resultTone: "fail", explanation: `s shorter than total concatenation → return [].`, done });
    return steps;
  }

  for (let k = 0; k < w; k++) {
    const seen = new Map<string, number>();
    let matchCount = 0;
    let left = k;
    for (let right = k; right + w <= s.length; right += w) {
      const rightWord = s.substring(right, right + w);
      if (target.has(rightWord)) {
        const count = (seen.get(rightWord) || 0) + 1;
        seen.set(rightWord, count);
        if (count === target.get(rightWord)) matchCount++;
        else if (count === target.get(rightWord)! + 1) matchCount--;
        pushStep(26, left, right, matchCount, `add '${rightWord}'`, "info", `Add right word '${rightWord}' → matchCount = ${matchCount}.`);
      }
      if (right - left >= totalLen) {
        const leftWord = s.substring(left, left + w);
        if (target.has(leftWord)) {
          const count = seen.get(leftWord)!;
          if (count === target.get(leftWord)) matchCount--;
          seen.set(leftWord, count - 1);
          if (count - 1 === target.get(leftWord)) matchCount++;
          pushStep(36, left, right, matchCount, `remove '${leftWord}'`, "info", `Remove left word '${leftWord}' → matchCount = ${matchCount}.`);
        }
        left += w;
      }
      if (matchCount === distinctWords) {
        result.push(left);
        pushStep(43, left, right, matchCount, `match at ${left}`, "ok", `All words matched → push ${left}.`);
      }
    }
  }

  done = true;
  steps.push({ line: 46, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Concatenation start indices = [${result.join(", ")}].`, done });
  return steps;
}

// ── Longest Substring Without Repeating Characters ─────────────────────
// Two DISTINCT approaches. s as char-code array.

// Approach 1: Brute Force.
// Source (lines):
// 0: function lengthOfLongestSubstring(s) {
// 1:   const n = s.length;
// 2:   let maxLen = 0;
// 3:
// 4:   for (let i = 0; i < n; i++) {
// 5:     const seen = new Set();
// 6:     for (let j = i; j < n; j++) {
// 7:       if (seen.has(s[j])) break;
// 8:       seen.add(s[j]);
// 9:       maxLen = Math.max(maxLen, j - i + 1);
// 10:    }
// 11:  }
// 12:
// 13:  return maxLen;
// 14: }
export function longSubNoRepeatBruteTrace(sCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const n = s.length;
  let maxLen = 0;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    seenStr: string,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      values: [...sCodes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "seen", value: seenStr, tone: "info" },
        { name: "maxLen", value: String(maxLen), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < n; i++) {
    const seen = new Set<string>();
    for (let j = i; j < n; j++) {
      if (seen.has(s[j])) {
        pushStep(7, i, j, `{${Array.from(seen).join(", ")}}`, "duplicate!", "fail", `s[${j}]='${s[j]}' already in set → break.`);
        break;
      }
      seen.add(s[j]);
      maxLen = Math.max(maxLen, j - i + 1);
      pushStep(8, i, j, `{${Array.from(seen).join(", ")}}`, `maxLen = ${maxLen}`, "ok", `Add s[${j}]='${s[j]}' → substring len ${j - i + 1}, maxLen = ${maxLen}.`);
    }
  }

  done = true;
  steps.push({ line: 13, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "maxLen", value: String(maxLen), tone: "ok" }], result: String(maxLen), resultTone: "ok", explanation: `Longest substring without repeating chars = ${maxLen}.`, done });
  return steps;
}

// Approach 2: Sliding Window + Hash Set.
// Source (lines):
// 0: function lengthOfLongestSubstring(s) {
// 1:   const window = new Set();
// 2:   let left = 0;
// 3:   let maxLen = 0;
// 4:
// 5:   for (let right = 0; right < s.length; right++) {
// 6:     // Shrink window until duplicate is removed
// 7:     while (window.has(s[right])) {
// 8:       window.delete(s[left]);
// 9:       left++;
// 10:    }
// 11:    window.add(s[right]);
// 12:    maxLen = Math.max(maxLen, right - left + 1);
// 13:  }
// 14:
// 15:  return maxLen;
// 16: }
export function longSubNoRepeatSlidingTrace(sCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const window = new Set<string>();
  let left = 0;
  let maxLen = 0;

  const pushStep = (
    line: number,
    leftP: number,
    rightP: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, (idx) => {
        if (idx === leftP) return "i";
        if (idx === rightP) return "j";
        return "idle";
      }),
      values: [...sCodes],
      vars: [
        { name: "left", value: String(leftP), tone: "info" },
        { name: "right", value: String(rightP), tone: "info" },
        { name: "window", value: `{${Array.from(window).join(", ")}}`, tone: "info" },
        { name: "maxLen", value: String(maxLen), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let right = 0; right < s.length; right++) {
    while (window.has(s[right])) {
      window.delete(s[left]);
      pushStep(8, left, right, `remove '${s[left]}'`, "fail", `s[${right}]='${s[right]}' duplicate → remove s[${left}]='${s[left]}', left++.`);
      left++;
    }
    window.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
    pushStep(11, left, right, `add '${s[right]}' → maxLen ${maxLen}`, "ok", `Add s[${right}]='${s[right]}' → window len ${right - left + 1}, maxLen = ${maxLen}.`);
  }

  done = true;
  steps.push({ line: 15, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "maxLen", value: String(maxLen), tone: "ok" }], result: String(maxLen), resultTone: "ok", explanation: `Longest substring without repeating chars = ${maxLen}.`, done });
  return steps;
}

// ── Longest Repeating Character Replacement ────────────────────────────
// Two DISTINCT approaches. s as char-code array; k is the replacement budget.

// Approach 1: Brute Force.
// Source (lines):
// 0: function characterReplacement(s, k) {
// 1:     const n = s.length;
// 2:     let maxLen = 0;
// 3:     for (let left = 0; left < n; left++) {
// 4:         const freq = new Array(26).fill(0);
// 5:         let maxFreq = 0;
// 6:         for (let right = left; right < n; right++) {
// 7:             const idx = s.charCodeAt(right) - 65; // 'A' = 65
// 8:             freq[idx]++;
// 9:             maxFreq = Math.max(maxFreq, freq[idx]);
// 10:            const windowLen = right - left + 1;
// 11:            if (windowLen - maxFreq <= k) {
// 12:                maxLen = Math.max(maxLen, windowLen);
// 13:            } else {
// 14:                // More replacements needed than allowed, stop expanding
// 15:                break;
// 16:            }
// 17:        }
// 18:    }
// 19:    return maxLen;
// 20: }
export function charReplacementBruteTrace(sCodes: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const n = s.length;
  let maxLen = 0;

  const pushStep = (
    line: number,
    leftP: number,
    rightP: number,
    maxFreq: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, (idx) => {
        if (idx === leftP) return "i";
        if (idx === rightP) return "j";
        return "idle";
      }),
      values: [...sCodes],
      vars: [
        { name: "left", value: String(leftP), tone: "info" },
        { name: "right", value: String(rightP), tone: "info" },
        { name: "maxFreq", value: String(maxFreq), tone: "info" },
        { name: "maxLen", value: String(maxLen), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let leftP = 0; leftP < n; leftP++) {
    const freq = new Array(26).fill(0);
    let maxFreq = 0;
    for (let rightP = leftP; rightP < n; rightP++) {
      const idx = s.charCodeAt(rightP) - 65;
      freq[idx]++;
      maxFreq = Math.max(maxFreq, freq[idx]);
      const windowLen = rightP - leftP + 1;
      if (windowLen - maxFreq <= k) {
        maxLen = Math.max(maxLen, windowLen);
        pushStep(11, leftP, rightP, maxFreq, `maxLen = ${maxLen}`, "ok", `Window [${leftP}..${rightP}] len ${windowLen}, maxFreq ${maxFreq}, replaces ${windowLen - maxFreq} ≤ ${k} → maxLen = ${maxLen}.`);
      } else {
        pushStep(14, leftP, rightP, maxFreq, "too many replaces", "fail", `Window [${leftP}..${rightP}] needs ${windowLen - maxFreq} > ${k} replaces → break.`);
        break;
      }
    }
  }

  done = true;
  steps.push({ line: 19, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "maxLen", value: String(maxLen), tone: "ok" }], result: String(maxLen), resultTone: "ok", explanation: `Longest repeating-character substring after ≤ ${k} replacements = ${maxLen}.`, done });
  return steps;
}

// Approach 2: Sliding Window.
// Source (lines):
// 0: function characterReplacement(s, k) {
// 1:     const freq = new Array(26).fill(0);
// 2:     let left = 0, maxLen = 0;
// 3:
// 4:     for (let right = 0; right < s.length; right++) {
// 5:         freq[s.charCodeAt(right) - 65]++;
// 6:
// 7:         // Shrink window until it's valid
// 8:         while ((right - left + 1) - Math.max(...freq) > k) {
// 9:             freq[s.charCodeAt(left) - 65]--;
// 10:            left++;
// 11:        }
// 12:        maxLen = Math.max(maxLen, right - left + 1);
// 13:    }
// 14:    return maxLen;
// 15: }
export function charReplacementSlidingTrace(sCodes: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const freq = new Array(26).fill(0);
  let left = 0;
  let maxLen = 0;

  const pushStep = (
    line: number,
    leftP: number,
    rightP: number,
    maxFreq: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, (idx) => {
        if (idx === leftP) return "i";
        if (idx === rightP) return "j";
        return "idle";
      }),
      values: [...sCodes],
      vars: [
        { name: "left", value: String(leftP), tone: "info" },
        { name: "right", value: String(rightP), tone: "info" },
        { name: "maxFreq", value: String(maxFreq), tone: "info" },
        { name: "maxLen", value: String(maxLen), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let right = 0; right < s.length; right++) {
    freq[s.charCodeAt(right) - 65]++;
    pushStep(5, left, right, Math.max(...freq), `freq++`, "info", `Add s[${right}]='${s[right]}' → maxFreq = ${Math.max(...freq)}.`);
    while (right - left + 1 - Math.max(...freq) > k) {
      freq[s.charCodeAt(left) - 65]--;
      left++;
      pushStep(8, left, right, Math.max(...freq), `shrink`, "fail", `Window needs ${right - left + 1 - Math.max(...freq) - 1} > ${k} replaces → remove s[${left - 1}]='${s[left - 1]}', left → ${left}.`);
    }
    maxLen = Math.max(maxLen, right - left + 1);
    pushStep(12, left, right, Math.max(...freq), `maxLen = ${maxLen}`, "ok", `Window [${left}..${right}] len ${right - left + 1} valid → maxLen = ${maxLen}.`);
  }

  done = true;
  steps.push({ line: 14, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "maxLen", value: String(maxLen), tone: "ok" }], result: String(maxLen), resultTone: "ok", explanation: `Longest repeating-character substring after ≤ ${k} replacements = ${maxLen}.`, done });
  return steps;
}

// ── Minimum Size Subarray Sum ──────────────────────────────────────────
// Two DISTINCT approaches. nums is the array; target is the sum.

// Approach 1: Brute Force.
// Source (lines):
// 0: function minSubArrayLen(target, nums) {
// 1:   const n = nums.length
// 2:   let minLen = n + 1
// 3:
// 4:   for (let i = 0; i < n; i++) {
// 5:     let sum = 0
// 6:     for (let j = i; j < n; j++) {
// 7:       sum += nums[j]
// 8:       if (sum >= target) {
// 9:         minLen = Math.min(minLen, j - i + 1)
// 10:        break // shortest subarray starting at i found
// 11:      }
// 12:    }
// 13:  }
// 14:
// 15:  return minLen === n + 1 ? 0 : minLen
// 16: }
export function minSubArrayLenBruteTrace(nums: number[], target: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;
  let minLen = n + 1;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    sum: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "sum", value: String(sum), tone: "info" },
        { name: "minLen", value: minLen === n + 1 ? "∞" : String(minLen), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = i; j < n; j++) {
      sum += nums[j];
      pushStep(7, i, j, sum, `sum → ${sum}`, "info", `Add nums[${j}] = ${nums[j]} → sum = ${sum}.`);
      if (sum >= target) {
        minLen = Math.min(minLen, j - i + 1);
        pushStep(8, i, j, sum, `minLen = ${minLen}`, "ok", `Subarray [${i}..${j}] sum ${sum} ≥ ${target} → minLen = ${minLen}.`);
        break;
      }
    }
  }

  const result = minLen === n + 1 ? 0 : minLen;
  done = true;
  steps.push({ line: 15, cells: nums.map(() => "idle"), vars: [{ name: "minLen", value: String(result), tone: "ok" }], result: String(result), resultTone: "ok", explanation: `Minimum subarray length with sum ≥ ${target} = ${result}.`, done });
  return steps;
}

// Approach 2: Sliding Window.
// Source (lines):
// 0: function minSubArrayLen(target, nums) {
// 1:   const n = nums.length
// 2:   let left = 0
// 3:   let currentSum = 0
// 4:   let minLen = n + 1
// 5:
// 6:   for (let right = 0; right < n; right++) {
// 7:     currentSum += nums[right]
// 8:
// 9:     // Shrink window while sum meets the target
// 10:    while (currentSum >= target) {
// 11:      minLen = Math.min(minLen, right - left + 1)
// 12:      currentSum -= nums[left]
// 13:      left++
// 14:    }
// 15:  }
// 16:
// 17:  return minLen === n + 1 ? 0 : minLen
// 18: }
export function minSubArrayLenSlidingTrace(nums: number[], target: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;
  let left = 0;
  let currentSum = 0;
  let minLen = n + 1;

  const pushStep = (
    line: number,
    leftP: number,
    rightP: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === leftP) return "i";
        if (idx === rightP) return "j";
        return "idle";
      }),
      vars: [
        { name: "left", value: String(leftP), tone: "info" },
        { name: "right", value: String(rightP), tone: "info" },
        { name: "currentSum", value: String(currentSum), tone: "info" },
        { name: "minLen", value: minLen === n + 1 ? "∞" : String(minLen), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let right = 0; right < n; right++) {
    currentSum += nums[right];
    pushStep(7, left, right, `sum → ${currentSum}`, "info", `Add nums[${right}] = ${nums[right]} → currentSum = ${currentSum}.`);
    while (currentSum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      pushStep(10, left, right, `minLen = ${minLen}`, "ok", `Window [${left}..${right}] sum ${currentSum} ≥ ${target} → minLen = ${minLen}.`);
      currentSum -= nums[left];
      left++;
      pushStep(12, left, right, `shrink → ${currentSum}`, "info", `Remove nums[${left - 1}] = ${nums[left - 1]}, left → ${left}.`);
    }
  }

  const result = minLen === n + 1 ? 0 : minLen;
  done = true;
  steps.push({ line: 17, cells: nums.map(() => "idle"), vars: [{ name: "minLen", value: String(result), tone: "ok" }], result: String(result), resultTone: "ok", explanation: `Minimum subarray length with sum ≥ ${target} = ${result}.`, done });
  return steps;
}

// ── Max Consecutive Ones III ───────────────────────────────────────────
// Two DISTINCT approaches. nums is a binary array; k is the flip budget.

// Approach 1: Brute Force.
// Source (lines):
// 0: function longestOnes(nums, k) {
// 1:     let maxLen = 0;
// 2:     for (let i = 0; i < nums.length; i++) {
// 3:         let zeroCount = 0;
// 4:         for (let j = i; j < nums.length; j++) {
// 5:             if (nums[j] === 0) {
// 6:                 zeroCount++;
// 7:             }
// 8:             if (zeroCount > k) {
// 9:                 break;
// 10:            }
// 11:            maxLen = Math.max(maxLen, j - i + 1);
// 12:        }
// 13:    }
// 14:    return maxLen;
// 15: }
export function longestOnesBruteTrace(nums: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let maxLen = 0;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    zeroCount: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "zeroCount", value: String(zeroCount), tone: "info" },
        { name: "maxLen", value: String(maxLen), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    let zeroCount = 0;
    for (let j = i; j < nums.length; j++) {
      if (nums[j] === 0) zeroCount++;
      if (zeroCount > k) {
        pushStep(8, i, j, zeroCount, `too many zeros`, "fail", `zeroCount ${zeroCount} > ${k} → break.`);
        break;
      }
      maxLen = Math.max(maxLen, j - i + 1);
      pushStep(11, i, j, zeroCount, `maxLen = ${maxLen}`, "ok", `Window [${i}..${j}] has ${zeroCount} zeros (≤ ${k}) → maxLen = ${maxLen}.`);
    }
  }

  done = true;
  steps.push({ line: 14, cells: nums.map(() => "idle"), vars: [{ name: "maxLen", value: String(maxLen), tone: "ok" }], result: String(maxLen), resultTone: "ok", explanation: `Longest subarray of 1s after flipping ≤ ${k} zeros = ${maxLen}.`, done });
  return steps;
}

// Approach 2: Sliding Window.
// Source (lines):
// 0: function longestOnes(nums, k) {
// 1:     let left = 0;
// 2:     let zeroCount = 0;
// 3:     let maxLen = 0;
// 4:
// 5:     for (let right = 0; right < nums.length; right++) {
// 6:         if (nums[right] === 0) {
// 7:             zeroCount++;
// 8:         }
// 9:         // Shrink window until we have at most k zeros
// 10:        while (zeroCount > k) {
// 11:            if (nums[left] === 0) {
// 12:                zeroCount--;
// 13:            }
// 14:            left++;
// 15:        }
// 16:        maxLen = Math.max(maxLen, right - left + 1);
// 17:    }
// 18:    return maxLen;
// 19: }
export function longestOnesSlidingTrace(nums: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let left = 0;
  let zeroCount = 0;
  let maxLen = 0;

  const pushStep = (
    line: number,
    leftP: number,
    rightP: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === leftP) return "i";
        if (idx === rightP) return "j";
        return "idle";
      }),
      vars: [
        { name: "left", value: String(leftP), tone: "info" },
        { name: "right", value: String(rightP), tone: "info" },
        { name: "zeroCount", value: String(zeroCount), tone: "info" },
        { name: "maxLen", value: String(maxLen), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeroCount++;
    pushStep(6, left, right, `zeroCount = ${zeroCount}`, "info", `nums[${right}] = ${nums[right]} → zeroCount = ${zeroCount}.`);
    while (zeroCount > k) {
      if (nums[left] === 0) zeroCount--;
      left++;
      pushStep(10, left, right, `shrink → zeroCount ${zeroCount}`, "fail", `zeroCount ${zeroCount + (nums[left - 1] === 0 ? 1 : 0)} > ${k} → remove nums[${left - 1}], left → ${left}.`);
    }
    maxLen = Math.max(maxLen, right - left + 1);
    pushStep(16, left, right, `maxLen = ${maxLen}`, "ok", `Window [${left}..${right}] len ${right - left + 1} → maxLen = ${maxLen}.`);
  }

  done = true;
  steps.push({ line: 18, cells: nums.map(() => "idle"), vars: [{ name: "maxLen", value: String(maxLen), tone: "ok" }], result: String(maxLen), resultTone: "ok", explanation: `Longest subarray of 1s after flipping ≤ ${k} zeros = ${maxLen}.`, done });
  return steps;
}

// ── Minimum Window Substring ───────────────────────────────────────────
// Two DISTINCT approaches. s and t as char-code arrays.

// Approach 1: Brute Force.
// Source (lines):
// 0: function minWindow(s, t) {
// 1:     const m = s.length, n = t.length;
// 2:     if (n > m) return "";
// 3:
// 4:     // Build frequency map for t
// 5:     const tFreq = new Array(128).fill(0);
// 6:     for (const c of t) tFreq[c.charCodeAt(0)]++;
// 7:
// 8:     let bestStart = 0, bestLen = Infinity;
// 9:
// 10:    for (let i = 0; i < m; i++) {
// 11:        const windowFreq = new Array(128).fill(0);
// 12:        for (let j = i; j < m; j++) {
// 13:            windowFreq[s.charCodeAt(j)]++;
// 14:            // Check if window contains all characters of t
// 15:            if (j - i + 1 >= n && tFreq.every((f, k) => windowFreq[k] >= f)) {
// 16:                if (j - i + 1 < bestLen) {
// 17:                    bestStart = i;
// 18:                    bestLen = j - i + 1;
// 19:                }
// 20:                break;
// 21:            }
// 22:        }
// 23:    }
// 24:    return bestLen === Infinity ? "" : s.substring(bestStart, bestStart + bestLen);
// 25: }
export function minWindowBruteTrace(sCodes: number[], tCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const t = tCodes.map((c) => String.fromCharCode(c)).join("");
  const m = s.length, n = t.length;
  const tFreq = new Array(128).fill(0);
  for (const c of t) tFreq[c.charCodeAt(0)]++;
  let bestStart = 0, bestLen = Infinity;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      values: [...sCodes],
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "bestLen", value: bestLen === Infinity ? "∞" : String(bestLen), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (n > m) {
    done = true;
    steps.push({ line: 2, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: "\"\"", tone: "fail" }], result: "\"\"", resultTone: "fail", explanation: `t longer than s → return empty string.`, done });
    return steps;
  }

  for (let i = 0; i < m; i++) {
    const windowFreq = new Array(128).fill(0);
    for (let j = i; j < m; j++) {
      windowFreq[s.charCodeAt(j)]++;
      const covered = j - i + 1 >= n && tFreq.every((f, k) => windowFreq[k] >= f);
      if (covered) {
        if (j - i + 1 < bestLen) {
          bestStart = i;
          bestLen = j - i + 1;
          pushStep(16, i, j, `bestLen = ${bestLen}`, "ok", `Window '${s.substring(i, j + 1)}' covers t → bestLen = ${bestLen}.`);
        }
        break;
      }
      pushStep(13, i, j, "not covered", "fail", `Window [${i}..${j}] does not yet cover all of t.`);
    }
  }

  const result = bestLen === Infinity ? "" : s.substring(bestStart, bestStart + bestLen);
  done = true;
  steps.push({ line: 24, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: `"${result}"`, tone: "ok" }], result: `"${result}"`, resultTone: "ok", explanation: `Minimum window substring = "${result}".`, done });
  return steps;
}

// Approach 2: Sliding Window.
// Source (lines):
// 0: function minWindow(s, t) {
// 1:     const m = s.length, n = t.length;
// 2:     if (n > m) return "";
// 3:
// 4:     // Frequency map for t
// 5:     const tCount = new Map();
// 6:     for (const c of t) {
// 7:         tCount.set(c, (tCount.get(c) || 0) + 1);
// 8:     }
// 9:
// 10:    const required = tCount.size; // Distinct chars in t that must be satisfied
// 11:    let formed = 0;               // Distinct chars currently meeting required freq
// 12:    const windowCount = new Map();
// 13:
// 14:    let bestStart = 0, bestLen = Infinity;
// 15:    let left = 0;
// 16:
// 17:    for (let right = 0; right < m; right++) {
// 18:        const c = s[right];
// 19:        windowCount.set(c, (windowCount.get(c) || 0) + 1);
// 20:
// 21:        // Check if this character's frequency requirement is now met
// 22:        if (tCount.has(c) && windowCount.get(c) === tCount.get(c)) {
// 23:            formed++;
// 24:        }
// 25:
// 26:        // Shrink the window from the left while it remains valid
// 27:        while (formed === required) {
// 28:            if (right - left + 1 < bestLen) {
// 29:                bestStart = left;
// 30:                bestLen = right - left + 1;
// 31:            }
// 32:            const leftChar = s[left];
// 33:            windowCount.set(leftChar, windowCount.get(leftChar) - 1);
// 34:            if (tCount.has(leftChar) && windowCount.get(leftChar) < tCount.get(leftChar)) {
// 35:                formed--;
// 36:            }
// 37:            left++;
// 38:        }
// 39:    }
// 40:    return bestLen === Infinity ? "" : s.substring(bestStart, bestStart + bestLen);
// 41: }
export function minWindowSlidingTrace(sCodes: number[], tCodes: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const s = sCodes.map((c) => String.fromCharCode(c)).join("");
  const t = tCodes.map((c) => String.fromCharCode(c)).join("");
  const m = s.length, n = t.length;
  const tCount = new Map<string, number>();
  for (const c of t) tCount.set(c, (tCount.get(c) || 0) + 1);
  const required = tCount.size;
  let formed = 0;
  const windowCount = new Map<string, number>();
  let bestStart = 0, bestLen = Infinity;
  let left = 0;

  const pushStep = (
    line: number,
    leftP: number,
    rightP: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(sCodes, (idx) => {
        if (idx === leftP) return "i";
        if (idx === rightP) return "j";
        return "idle";
      }),
      values: [...sCodes],
      vars: [
        { name: "left", value: String(leftP), tone: "info" },
        { name: "right", value: String(rightP), tone: "info" },
        { name: "formed", value: String(formed), tone: "info" },
        { name: "bestLen", value: bestLen === Infinity ? "∞" : String(bestLen), tone: "info" },
        { name: "windowCount", value: `{${Array.from(windowCount.entries()).map(([c, cnt]) => `${c}:${cnt}`).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (n > m) {
    done = true;
    steps.push({ line: 2, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: "\"\"", tone: "fail" }], result: "\"\"", resultTone: "fail", explanation: `t longer than s → return empty string.`, done });
    return steps;
  }

  for (let right = 0; right < m; right++) {
    const c = s[right];
    windowCount.set(c, (windowCount.get(c) || 0) + 1);
    pushStep(19, left, right, `add '${c}'`, "info", `Add s[${right}]='${c}' → windowCount.`);
    if (tCount.has(c) && windowCount.get(c) === tCount.get(c)) {
      formed++;
      pushStep(22, left, right, `formed = ${formed}`, "ok", `'${c}' freq requirement met → formed = ${formed}.`);
    }
    while (formed === required) {
      if (right - left + 1 < bestLen) {
        bestStart = left;
        bestLen = right - left + 1;
        pushStep(28, left, right, `bestLen = ${bestLen}`, "ok", `Window '${s.substring(left, right + 1)}' covers t → bestLen = ${bestLen}.`);
      }
      const leftChar = s[left];
      windowCount.set(leftChar, windowCount.get(leftChar)! - 1);
      if (tCount.has(leftChar) && windowCount.get(leftChar)! < tCount.get(leftChar)!) {
        formed--;
      }
      left++;
      pushStep(32, left, right, `shrink → formed ${formed}`, "fail", `Remove s[${left - 1}]='${leftChar}', left → ${left}.`);
    }
  }

  const result = bestLen === Infinity ? "" : s.substring(bestStart, bestStart + bestLen);
  done = true;
  steps.push({ line: 40, cells: sCodes.map(() => "idle"), values: [...sCodes], vars: [{ name: "result", value: `"${result}"`, tone: "ok" }], result: `"${result}"`, resultTone: "ok", explanation: `Minimum window substring = "${result}".`, done });
  return steps;
}

// ── Maximum Subarray ───────────────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Brute Force.
// Source (lines):
// 0: function maxSubArray(nums) {
// 1:   let maxSum = nums[0]
// 2:
// 3:   for (let i = 0; i < nums.length; i++) {
// 4:     let currentSum = 0
// 5:     for (let j = i; j < nums.length; j++) {
// 6:       currentSum += nums[j]
// 7:       maxSum = Math.max(maxSum, currentSum)
// 8:     }
// 9:   }
// 10:
// 11:  return maxSum
// 12: }
export function maxSubArrayBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let maxSum = nums[0] ?? 0;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    currentSum: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "currentSum", value: String(currentSum), tone: "info" },
        { name: "maxSum", value: String(maxSum), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    let currentSum = 0;
    for (let j = i; j < nums.length; j++) {
      currentSum += nums[j];
      maxSum = Math.max(maxSum, currentSum);
      pushStep(6, i, j, currentSum, `maxSum = ${maxSum}`, "ok", `Subarray [${i}..${j}] sum ${currentSum} → maxSum = ${maxSum}.`);
    }
  }

  done = true;
  steps.push({ line: 11, cells: nums.map(() => "idle"), vars: [{ name: "maxSum", value: String(maxSum), tone: "ok" }], result: String(maxSum), resultTone: "ok", explanation: `Maximum subarray sum = ${maxSum}.`, done });
  return steps;
}

// Approach 2: Kadane's Algorithm.
// Source (lines):
// 0: function maxSubArray(nums) {
// 1:   let currentSum = nums[0]
// 2:   let maxSum = nums[0]
// 3:
// 4:   for (let i = 1; i < nums.length; i++) {
// 5:     // Either extend the previous subarray or start a new one here
// 6:     currentSum = Math.max(nums[i], currentSum + nums[i])
// 7:     maxSum = Math.max(maxSum, currentSum)
// 8:   }
// 9:
// 10:  return maxSum
// 11: }
export function maxSubArrayKadaneTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let currentSum = nums[0] ?? 0;
  let maxSum = nums[0] ?? 0;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "currentSum", value: String(currentSum), tone: "info" },
        { name: "maxSum", value: String(maxSum), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(1, 0, `currentSum = ${currentSum}`, "info", `Initialize currentSum = maxSum = nums[0] = ${nums[0]}.`);

  for (let i = 1; i < nums.length; i++) {
    const before = currentSum;
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    pushStep(6, i, `currentSum → ${currentSum}`, "info", `max(nums[${i}] = ${nums[i]}, ${before} + ${nums[i]} = ${before + nums[i]}) = ${currentSum}.`);
    maxSum = Math.max(maxSum, currentSum);
    pushStep(7, i, `maxSum = ${maxSum}`, "ok", `max(maxSum, currentSum) = ${maxSum}.`);
  }

  done = true;
  steps.push({ line: 10, cells: nums.map(() => "idle"), vars: [{ name: "maxSum", value: String(maxSum), tone: "ok" }], result: String(maxSum), resultTone: "ok", explanation: `Maximum subarray sum = ${maxSum}.`, done });
  return steps;
}

// ── Maximum Sum Circular Subarray ──────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Brute Force.
// Source (lines):
// 0: function maxSubarraySumCircular(nums) {
// 1:   const n = nums.length
// 2:   let maxSum = -Infinity
// 3:
// 4:   for (let i = 0; i < n; i++) {
// 5:     let currentSum = 0
// 6:     for (let j = 0; j < n; j++) {
// 7:       currentSum += nums[(i + j) % n]
// 8:       maxSum = Math.max(maxSum, currentSum)
// 9:     }
// 10:  }
// 11:
// 12:  return maxSum
// 13: }
export function maxCircularBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = nums.length;
  let maxSum = -Infinity;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    currentSum: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === (i + j) % n) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: String(i), tone: "info" },
        { name: "j", value: String(j), tone: "info" },
        { name: "currentSum", value: String(currentSum), tone: "info" },
        { name: "maxSum", value: maxSum === -Infinity ? "-∞" : String(maxSum), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < n; i++) {
    let currentSum = 0;
    for (let j = 0; j < n; j++) {
      currentSum += nums[(i + j) % n];
      maxSum = Math.max(maxSum, currentSum);
      pushStep(7, i, j, currentSum, `maxSum = ${maxSum}`, "ok", `Start ${i}, add nums[${(i + j) % n}] = ${nums[(i + j) % n]} → sum ${currentSum}, maxSum = ${maxSum}.`);
    }
  }

  done = true;
  steps.push({ line: 12, cells: nums.map(() => "idle"), vars: [{ name: "maxSum", value: String(maxSum), tone: "ok" }], result: String(maxSum), resultTone: "ok", explanation: `Maximum circular subarray sum = ${maxSum}.`, done });
  return steps;
}

// Approach 2: Kadane's with Min Subarray (Optimal).
// Source (lines):
// 0: function maxSubarraySumCircular(nums) {
// 1:   let currentMax = 0,
// 2:     maxSum = nums[0]
// 3:   let currentMin = 0,
// 4:     minSum = nums[0]
// 5:   let totalSum = 0
// 6:
// 7:   for (const num of nums) {
// 8:     // Kadane's for maximum subarray
// 9:     currentMax = Math.max(currentMax + num, num)
// 10:    maxSum = Math.max(maxSum, currentMax)
// 11:
// 12:    // Kadane's for minimum subarray
// 13:    currentMin = Math.min(currentMin + num, num)
// 14:    minSum = Math.min(minSum, currentMin)
// 15:
// 16:    totalSum += num
// 17:  }
// 18:
// 19:  // If all negative, return the least negative element
// 20:  if (maxSum < 0) return maxSum
// 21:
// 22:  return Math.max(maxSum, totalSum - minSum)
// 23: }
export function maxCircularKadaneTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let currentMax = 0, maxSum = nums[0] ?? 0;
  let currentMin = 0, minSum = nums[0] ?? 0;
  let totalSum = 0;

  const pushStep = (
    line: number,
    i: number,
    currentMaxV: number,
    currentMinV: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "currentMax", value: String(currentMaxV), tone: "info" },
        { name: "maxSum", value: String(maxSum), tone: "info" },
        { name: "currentMin", value: String(currentMinV), tone: "info" },
        { name: "minSum", value: String(minSum), tone: "info" },
        { name: "totalSum", value: String(totalSum), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    currentMax = Math.max(currentMax + num, num);
    maxSum = Math.max(maxSum, currentMax);
    currentMin = Math.min(currentMin + num, num);
    minSum = Math.min(minSum, currentMin);
    totalSum += num;
    pushStep(9, i, currentMax, currentMin, `max=${maxSum} min=${minSum}`, "info", `num=${num}: currentMax=${currentMax}, maxSum=${maxSum}, currentMin=${currentMin}, minSum=${minSum}.`);
  }

  const result = maxSum < 0 ? maxSum : Math.max(maxSum, totalSum - minSum);
  done = true;
  steps.push({ line: 22, cells: nums.map(() => "idle"), vars: [{ name: "result", value: String(result), tone: "ok" }], result: String(result), resultTone: "ok", explanation: `Maximum circular subarray sum = max(${maxSum}, ${totalSum} - ${minSum}) = ${result}.`, done });
  return steps;
}

// ── Maximum Product Subarray ───────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Brute Force.
// Source (lines):
// 0: function maxProduct(nums) {
// 1:   let maxProd = nums[0]
// 2:
// 3:   for (let i = 0; i < nums.length; i++) {
// 4:     let currentProduct = 1
// 5:     for (let j = i; j < nums.length; j++) {
// 6:       currentProduct *= nums[j]
// 7:       maxProd = Math.max(maxProd, currentProduct)
// 8:     }
// 9:   }
// 10:
// 11:  return maxProd
// 12: }
export function maxProductBruteTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let maxProd = nums[0] ?? 0;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    currentProduct: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "currentProduct", value: String(currentProduct), tone: "info" },
        { name: "maxProd", value: String(maxProd), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < nums.length; i++) {
    let currentProduct = 1;
    for (let j = i; j < nums.length; j++) {
      currentProduct *= nums[j];
      maxProd = Math.max(maxProd, currentProduct);
      pushStep(6, i, j, currentProduct, `maxProd = ${maxProd}`, "ok", `Subarray [${i}..${j}] product ${currentProduct} → maxProd = ${maxProd}.`);
    }
  }

  done = true;
  steps.push({ line: 11, cells: nums.map(() => "idle"), vars: [{ name: "maxProd", value: String(maxProd), tone: "ok" }], result: String(maxProd), resultTone: "ok", explanation: `Maximum subarray product = ${maxProd}.`, done });
  return steps;
}

// Approach 2: Dynamic Programming (Track Min and Max).
// Source (lines):
// 0: function maxProduct(nums) {
// 1:   let maxSoFar = nums[0]
// 2:   let minSoFar = nums[0]
// 3:   let result = nums[0]
// 4:
// 5:   for (let i = 1; i < nums.length; i++) {
// 6:     // Compute both before updating to avoid stale values
// 7:     const tempMax = Math.max(nums[i], maxSoFar * nums[i], minSoFar * nums[i])
// 8:     const tempMin = Math.min(nums[i], maxSoFar * nums[i], minSoFar * nums[i])
// 9:
// 10:    maxSoFar = tempMax
// 11:    minSoFar = tempMin
// 12:    result = Math.max(result, maxSoFar)
// 13:  }
// 14:
// 15:  return result
// 16: }
export function maxProductDPTrace(nums: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let maxSoFar = nums[0] ?? 0;
  let minSoFar = nums[0] ?? 0;
  let result = nums[0] ?? 0;

  const pushStep = (
    line: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(nums, (idx) => (idx === i ? "i" : "idle")),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "maxSoFar", value: String(maxSoFar), tone: "info" },
        { name: "minSoFar", value: String(minSoFar), tone: "info" },
        { name: "result", value: String(result), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 1; i < nums.length; i++) {
    const tempMax = Math.max(nums[i], maxSoFar * nums[i], minSoFar * nums[i]);
    const tempMin = Math.min(nums[i], maxSoFar * nums[i], minSoFar * nums[i]);
    maxSoFar = tempMax;
    minSoFar = tempMin;
    result = Math.max(result, maxSoFar);
    pushStep(7, i, `max=${maxSoFar} min=${minSoFar} result=${result}`, "info", `nums[${i}]=${nums[i]}: tempMax=max(${nums[i]}, ${maxSoFar * nums[i]}, ${minSoFar * nums[i]}) = ${tempMax}; result = ${result}.`);
  }

  done = true;
  steps.push({ line: 15, cells: nums.map(() => "idle"), vars: [{ name: "result", value: String(result), tone: "ok" }], result: String(result), resultTone: "ok", explanation: `Maximum subarray product = ${result}.`, done });
  return steps;
}

// ── Best Sightseeing Pair ──────────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Brute Force.
// Source (lines):
// 0: function maxScoreSightseeingPair(values) {
// 1:     let maxScore = 0;
// 2:
// 3:     // Try every pair (i, j) where i < j
// 4:     for (let i = 0; i < values.length - 1; i++) {
// 5:         for (let j = i + 1; j < values.length; j++) {
// 6:             const score = values[i] + values[j] + i - j;
// 7:             maxScore = Math.max(maxScore, score);
// 8:         }
// 9:     }
// 10:
// 11:    return maxScore;
// 12: }
export function sightseeingBruteTrace(values: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let maxScore = 0;

  const pushStep = (
    line: number,
    i: number,
    j: number,
    score: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(values, (idx) => {
        if (idx === i) return "i";
        if (idx === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "score", value: String(score), tone: "info" },
        { name: "maxScore", value: String(maxScore), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < values.length - 1; i++) {
    for (let j = i + 1; j < values.length; j++) {
      const score = values[i] + values[j] + i - j;
      maxScore = Math.max(maxScore, score);
      pushStep(6, i, j, score, `maxScore = ${maxScore}`, "ok", `Pair (${i},${j}): ${values[i]} + ${values[j]} + ${i} - ${j} = ${score} → maxScore = ${maxScore}.`);
    }
  }

  done = true;
  steps.push({ line: 11, cells: values.map(() => "idle"), vars: [{ name: "maxScore", value: String(maxScore), tone: "ok" }], result: String(maxScore), resultTone: "ok", explanation: `Maximum sightseeing pair score = ${maxScore}.`, done });
  return steps;
}

// Approach 2: Decomposition with Running Maximum.
// Source (lines):
// 0: function maxScoreSightseeingPair(values) {
// 1:     // Best values[i] + i seen so far
// 2:     let maxLeftScore = values[0] + 0;
// 3:     let maxScore = 0;
// 4:
// 5:     for (let j = 1; j < values.length; j++) {
// 6:         // Best score using current j and the best left partner
// 7:         maxScore = Math.max(maxScore, maxLeftScore + values[j] - j);
// 8:         // Update best left partner for future j's
// 9:         maxLeftScore = Math.max(maxLeftScore, values[j] + j);
// 10:    }
// 11:
// 12:    return maxScore;
// 13: }
export function sightseeingRunningTrace(values: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let maxLeftScore = values[0] ?? 0;
  let maxScore = 0;

  const pushStep = (
    line: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(values, (idx) => (idx === j ? "j" : "idle")),
      vars: [
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "maxLeftScore", value: String(maxLeftScore), tone: "info" },
        { name: "maxScore", value: String(maxScore), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let j = 1; j < values.length; j++) {
    const candidate = maxLeftScore + values[j] - j;
    maxScore = Math.max(maxScore, candidate);
    pushStep(7, j, `candidate ${candidate} → maxScore ${maxScore}`, "ok", `maxLeftScore(${maxLeftScore}) + values[${j}](${values[j]}) - ${j} = ${candidate} → maxScore = ${maxScore}.`);
    maxLeftScore = Math.max(maxLeftScore, values[j] + j);
    pushStep(9, j, `maxLeftScore → ${maxLeftScore}`, "info", `Update best left = max(${maxLeftScore}, ${values[j]} + ${j}).`);
  }

  done = true;
  steps.push({ line: 12, cells: values.map(() => "idle"), vars: [{ name: "maxScore", value: String(maxScore), tone: "ok" }], result: String(maxScore), resultTone: "ok", explanation: `Maximum sightseeing pair score = ${maxScore}.`, done });
  return steps;
}

// ── Transpose Matrix ───────────────────────────────────────────────────
// Two DISTINCT approaches. matrix flattened row-major; rows/cols params.

// Approach 1: Direct Construction (Iterate Over Original).
// Source (lines):
// 0: function transpose(matrix) {
// 1:     const m = matrix.length;
// 2:     const n = matrix[0].length;
// 3:
// 4:     // Create result with swapped dimensions
// 5:     const result = new Array(n);
// 6:     for (let i = 0; i < n; i++) {
// 7:         result[i] = new Array(m).fill(0);
// 8:     }
// 9:
// 10:    for (let i = 0; i < m; i++) {
// 11:        for (let j = 0; j < n; j++) {
// 12:            // Element at (i, j) goes to (j, i)
// 13:            result[j][i] = matrix[i][j];
// 14:        }
// 15:    }
// 16:    return result;
// 17: }
export function transposeDirectTrace(flat: number[], rows: number, cols: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const m = rows, n = cols;
  const result: number[] = new Array(m * n).fill(0);

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(flat, (idx) => {
        const r = Math.floor(idx / n), c = idx % n;
        if (r === i) return "i";
        if (c === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "rows", value: String(rows), tone: "info" },
        { name: "cols", value: String(cols), tone: "info" },
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      result[j * m + i] = flat[i * n + j];
      pushStep(13, i, j, `result[${j}][${i}] = ${flat[i * n + j]}`, "ok", `matrix[${i}][${j}] = ${flat[i * n + j]} → result[${j}][${i}].`);
    }
  }

  done = true;
  steps.push({ line: 16, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(rows), tone: "info" }, { name: "cols", value: String(cols), tone: "info" }, { name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Transposed matrix (${n}×${m}) done.`, done });
  return steps;
}

// Approach 2: Column-Based Construction (Iterate Over Result).
// Source (lines):
// 0: function transpose(matrix) {
// 1:     const m = matrix.length;
// 2:     const n = matrix[0].length;
// 3:
// 4:     const result = [];
// 5:     // Each column of the original becomes a row of the result
// 6:     for (let j = 0; j < n; j++) {
// 7:         const row = [];
// 8:         for (let i = 0; i < m; i++) {
// 9:             row.push(matrix[i][j]);
// 10:        }
// 11:        result.push(row);
// 12:    }
// 13:    return result;
// 14: }
export function transposeColumnTrace(flat: number[], rows: number, cols: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const m = rows, n = cols;
  const result: number[] = [];

  const pushStep = (
    line: number,
    j: number,
    i: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(flat, (idx) => {
        const r = Math.floor(idx / n), c = idx % n;
        if (c === j) return "j";
        if (r === i) return "i";
        return "idle";
      }),
      vars: [
        { name: "rows", value: String(rows), tone: "info" },
        { name: "cols", value: String(cols), tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let j = 0; j < n; j++) {
    const row: number[] = [];
    for (let i = 0; i < m; i++) {
      row.push(flat[i * n + j]);
      pushStep(9, j, i, `row += ${flat[i * n + j]}`, "info", `Collect matrix[${i}][${j}] = ${flat[i * n + j]}.`);
    }
    result.push(...row);
    pushStep(11, j, -1, `result += [${row.join(", ")}]`, "ok", `Column ${j} becomes result row ${j} = [${row.join(", ")}].`);
  }

  done = true;
  steps.push({ line: 13, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(rows), tone: "info" }, { name: "cols", value: String(cols), tone: "info" }, { name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Transposed matrix (${n}×${m}) done.`, done });
  return steps;
}

// ── Spiral Matrix ───────────────────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Simulation with Direction Arrays.
// Source (lines):
// 0: function spiralOrder(matrix) {
// 1:     const m = matrix.length, n = matrix[0].length;
// 2:     const visited = Array.from({length: m}, () => Array(n).fill(false));
// 3:     const result = [];
// 4:
// 5:     // Direction vectors: right, down, left, up
// 6:     const dr = [0, 1, 0, -1];
// 7:     const dc = [1, 0, -1, 0];
// 8:     let dir = 0;
// 9:     let row = 0, col = 0;
// 10:
// 11:    for (let i = 0; i < m * n; i++) {
// 12:        result.push(matrix[row][col]);
// 13:        visited[row][col] = true;
// 14:
// 15:        let nextRow = row + dr[dir];
// 16:        let nextCol = col + dc[dir];
// 17:
// 18:        if (nextRow < 0 || nextRow >= m || nextCol < 0 || nextCol >= n
// 19:                || visited[nextRow][nextCol]) {
// 20:            dir = (dir + 1) % 4;
// 21:            nextRow = row + dr[dir];
// 22:            nextCol = col + dc[dir];
// 23:        }
// 24:
// 25:        row = nextRow;
// 26:        col = nextCol;
// 27:    }
// 28:
// 29:    return result;
// 30: }
export function spiralSimulateTrace(flat: number[], rows: number, cols: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const m = rows, n = cols;
  const result: number[] = [];
  const visited: boolean[] = new Array(m * n).fill(false);
  const dr = [0, 1, 0, -1];
  const dc = [1, 0, -1, 0];
  let dir = 0;
  let row = 0, col = 0;

  const dirName = ["right", "down", "left", "up"];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(flat, (idx) => {
        const r = Math.floor(idx / n), c = idx % n;
        if (r === row && c === col) return "j";
        if (visited[idx]) return "found";
        return "idle";
      }),
      vars: [
        { name: "rows", value: String(rows), tone: "info" },
        { name: "cols", value: String(cols), tone: "info" },
        { name: "row", value: String(row), tone: "info" },
        { name: "col", value: String(col), tone: "info" },
        { name: "dir", value: dirName[dir], tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < m * n; i++) {
    const cur = row * n + col;
    result.push(flat[cur]);
    visited[cur] = true;
    pushStep(12, `push ${flat[cur]}`, "ok", `Visit matrix[${row}][${col}] = ${flat[cur]}, move ${dirName[dir]}.`);

    let nextRow = row + dr[dir];
    let nextCol = col + dc[dir];
    if (nextRow < 0 || nextRow >= m || nextCol < 0 || nextCol >= n || visited[nextRow * n + nextCol]) {
      dir = (dir + 1) % 4;
      nextRow = row + dr[dir];
      nextCol = col + dc[dir];
      pushStep(20, `turn → ${dirName[dir]}`, "info", `Hit boundary/visited → turn ${dirName[dir]}.`);
    }
    row = nextRow;
    col = nextCol;
  }

  done = true;
  steps.push({ line: 29, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(rows), tone: "info" }, { name: "cols", value: String(cols), tone: "info" }, { name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Spiral order = [${result.join(", ")}].`, done });
  return steps;
}

// Approach 2: Layer-by-Layer (Boundary Shrinking).
// Source (lines):
// 0: function spiralOrder(matrix) {
// 1:     const result = [];
// 2:     let top = 0, bottom = matrix.length - 1;
// 3:     let left = 0, right = matrix[0].length - 1;
// 4:
// 5:     while (top <= bottom && left <= right) {
// 6:         // Traverse top row
// 7:         for (let col = left; col <= right; col++) {
// 8:             result.push(matrix[top][col]);
// 9:         }
// 10:        top++;
// 11:
// 12:        // Traverse right column
// 13:        for (let row = top; row <= bottom; row++) {
// 14:            result.push(matrix[row][right]);
// 15:        }
// 16:        right--;
// 17:
// 18:        // Traverse bottom row (if rows remain)
// 19:        if (top <= bottom) {
// 20:            for (let col = right; col >= left; col--) {
// 21:                result.push(matrix[bottom][col]);
// 22:            }
// 23:            bottom--;
// 24:        }
// 25:
// 26:        // Traverse left column (if columns remain)
// 27:        if (left <= right) {
// 28:            for (let row = bottom; row >= top; row--) {
// 29:                result.push(matrix[row][left]);
// 30:            }
// 31:            left++;
// 32:        }
// 33:    }
// 34:
// 35:    return result;
// 36: }
export function spiralLayerTrace(flat: number[], rows: number, cols: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const m = rows, n = cols;
  const result: number[] = [];
  let top = 0, bottom = m - 1;
  let left = 0, right = n - 1;

  const pushStep = (
    line: number,
    r: number,
    c: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(flat, (idx) => {
        const rr = Math.floor(idx / n), cc = idx % n;
        if (rr === r && cc === c) return "j";
        return "idle";
      }),
      vars: [
        { name: "rows", value: String(rows), tone: "info" },
        { name: "cols", value: String(cols), tone: "info" },
        { name: "top", value: String(top), tone: "info" },
        { name: "bottom", value: String(bottom), tone: "info" },
        { name: "left", value: String(left), tone: "info" },
        { name: "right", value: String(right), tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col++) {
      result.push(flat[top * n + col]);
      pushStep(8, top, col, `push ${flat[top * n + col]}`, "ok", `Top row: matrix[${top}][${col}].`);
    }
    top++;
    for (let row = top; row <= bottom; row++) {
      result.push(flat[row * n + right]);
      pushStep(14, row, right, `push ${flat[row * n + right]}`, "ok", `Right col: matrix[${row}][${right}].`);
    }
    right--;
    if (top <= bottom) {
      for (let col = right; col >= left; col--) {
        result.push(flat[bottom * n + col]);
        pushStep(21, bottom, col, `push ${flat[bottom * n + col]}`, "ok", `Bottom row: matrix[${bottom}][${col}].`);
      }
      bottom--;
    }
    if (left <= right) {
      for (let row = bottom; row >= top; row--) {
        result.push(flat[row * n + left]);
        pushStep(29, row, left, `push ${flat[row * n + left]}`, "ok", `Left col: matrix[${row}][${left}].`);
      }
      left++;
    }
  }

  done = true;
  steps.push({ line: 35, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(rows), tone: "info" }, { name: "cols", value: String(cols), tone: "info" }, { name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Spiral order = [${result.join(", ")}].`, done });
  return steps;
}

// ── Rotate Image ───────────────────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Using Extra Space.
// Source (lines):
// 0: function rotate(matrix) {
// 1:     const n = matrix.length;
// 2:     const rotated = Array.from({ length: n }, () => new Array(n).fill(0));
// 3:
// 4:     // Place each element in its rotated position
// 5:     for (let i = 0; i < n; i++) {
// 6:         for (let j = 0; j < n; j++) {
// 7:             rotated[j][n - 1 - i] = matrix[i][j];
// 8:         }
// 9:     }
// 10:
// 11:    // Copy back to original matrix
// 12:    for (let i = 0; i < n; i++) {
// 13:        for (let j = 0; j < n; j++) {
// 14:            matrix[i][j] = rotated[i][j];
// 15:        }
// 16:    }
// 17: }
export function rotateImageSpaceTrace(flat: number[], n: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const rotated = new Array(n * n).fill(0);
  const current: number[] = [...flat];

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(current, (idx) => {
        const r = Math.floor(idx / n), c = idx % n;
        if (r === i && c === j) return "i";
        return "idle";
      }),
      vars: [
        { name: "rows", value: String(n), tone: "info" },
        { name: "cols", value: String(n), tone: "info" },
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "rotated", value: `[${rotated.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      rotated[j * n + (n - 1 - i)] = flat[i * n + j];
      pushStep(7, i, j, `rotated[${j}][${n - 1 - i}] = ${flat[i * n + j]}`, "ok", `matrix[${i}][${j}] = ${flat[i * n + j]} → rotated[${j}][${n - 1 - i}].`);
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      current[i * n + j] = rotated[i * n + j];
    }
  }

  done = true;
  steps.push({ line: 17, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(n), tone: "info" }, { name: "cols", value: String(n), tone: "info" }, { name: "rotated", value: `[${current.join(", ")}]`, tone: "ok" }], result: `[${current.join(", ")}]`, resultTone: "ok", explanation: `Matrix rotated 90° clockwise.`, done });
  return steps;
}

// Approach 2: Transpose + Reverse.
// Source (lines):
// 0: function rotate(matrix) {
// 1:     const n = matrix.length;
// 2:
// 3:     // Step 1: Transpose the matrix
// 4:     for (let i = 0; i < n; i++) {
// 5:         for (let j = i + 1; j < n; j++) {
// 6:             [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
// 7:         }
// 8:     }
// 9:
// 10:    // Step 2: Reverse each row
// 11:    for (let i = 0; i < n; i++) {
// 12:        matrix[i].reverse();
// 13:    }
// 14: }
export function rotateImageTransposeTrace(flat: number[], n: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const current: number[] = [...flat];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(current, () => "idle"),
      vars: [
        { name: "rows", value: String(n), tone: "info" },
        { name: "cols", value: String(n), tone: "info" },
        { name: "matrix", value: `[${current.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const tmp = current[i * n + j];
      current[i * n + j] = current[j * n + i];
      current[j * n + i] = tmp;
      pushStep(6, `swap (${i},${j})`, "ok", `Transpose: swap matrix[${i}][${j}] and matrix[${j}][${i}].`);
    }
  }
  pushStep(8, "transposed", "info", `Matrix is now transposed: [${current.join(", ")}].`);

  for (let i = 0; i < n; i++) {
    const row = current.slice(i * n, i * n + n).reverse();
    for (let j = 0; j < n; j++) current[i * n + j] = row[j];
    pushStep(12, `row ${i} reversed`, "info", `Reverse row ${i} → [${row.join(", ")}].`);
  }

  done = true;
  steps.push({ line: 14, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(n), tone: "info" }, { name: "cols", value: String(n), tone: "info" }, { name: "matrix", value: `[${current.join(", ")}]`, tone: "ok" }], result: `[${current.join(", ")}]`, resultTone: "ok", explanation: `Matrix rotated 90° clockwise (transpose + reverse rows).`, done });
  return steps;
}

// ── Set Matrix Zeroes ──────────────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Brute Force (Copy Matrix).
// Source (lines):
// 0: function setZeroes(matrix) {
// 1:     const m = matrix.length, n = matrix[0].length;
// 2:     // Create a copy to read from
// 3:     const copy = matrix.map((row) => [...row]);
// 4:     for (let i = 0; i < m; i++) {
// 5:         for (let j = 0; j < n; j++) {
// 6:             if (copy[i][j] === 0) {
// 7:                 // Zero out entire row i in original
// 8:                 for (let k = 0; k < n; k++) matrix[i][k] = 0;
// 9:                 // Zero out entire column j in original
// 10:                for (let k = 0; k < m; k++) matrix[k][j] = 0;
// 11:            }
// 12:        }
// 13:    }
// 14: }
export function setZeroesCopyTrace(flat: number[], rows: number, cols: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const m = rows, n = cols;
  const copy = [...flat];
  const current: number[] = [...flat];

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(current, (idx) => {
        const r = Math.floor(idx / n), c = idx % n;
        if (r === i && c === j) return "found";
        if (current[idx] === 0) return "active";
        return "idle";
      }),
      vars: [
        { name: "rows", value: String(rows), tone: "info" },
        { name: "cols", value: String(cols), tone: "info" },
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "matrix", value: `[${current.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (copy[i * n + j] === 0) {
        for (let k = 0; k < n; k++) current[i * n + k] = 0;
        for (let k = 0; k < m; k++) current[k * n + j] = 0;
        pushStep(6, i, j, `zero row ${i} & col ${j}`, "ok", `copy[${i}][${j}] = 0 → zero out row ${i} and column ${j}.`);
      }
    }
  }

  done = true;
  steps.push({ line: 14, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(rows), tone: "info" }, { name: "cols", value: String(cols), tone: "info" }, { name: "matrix", value: `[${current.join(", ")}]`, tone: "ok" }], result: `[${current.join(", ")}]`, resultTone: "ok", explanation: `Matrix with zeroed rows/cols: [${current.join(", ")}].`, done });
  return steps;
}

// Approach 2: Hash Sets.
// Source (lines):
// 0: function setZeroes(matrix) {
// 1:     const m = matrix.length, n = matrix[0].length;
// 2:     const zeroRows = new Set();
// 3:     const zeroCols = new Set();
// 4:     // Phase 1: record which rows and columns have zeroes
// 5:     for (let i = 0; i < m; i++) {
// 6:         for (let j = 0; j < n; j++) {
// 7:             if (matrix[i][j] === 0) {
// 8:                 zeroRows.add(i);
// 9:                 zeroCols.add(j);
// 10:            }
// 11:        }
// 12:    }
// 13:    // Phase 2: zero out marked rows and columns
// 14:    for (let i = 0; i < m; i++) {
// 15:        for (let j = 0; j < n; j++) {
// 16:            if (zeroRows.has(i) || zeroCols.has(j)) {
// 17:                matrix[i][j] = 0;
// 18:            }
// 19:        }
// 20:    }
// 21: }
export function setZeroesHashTrace(flat: number[], rows: number, cols: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const m = rows, n = cols;
  const zeroRows = new Set<number>();
  const zeroCols = new Set<number>();
  const current: number[] = [...flat];

  const pushStep = (
    line: number,
    i: number,
    j: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(current, (idx) => {
        const r = Math.floor(idx / n), c = idx % n;
        if (r === i && c === j) return "i";
        return "idle";
      }),
      vars: [
        { name: "rows", value: String(rows), tone: "info" },
        { name: "cols", value: String(cols), tone: "info" },
        { name: "i", value: i >= 0 ? String(i) : "—", tone: "info" },
        { name: "j", value: j >= 0 ? String(j) : "—", tone: "info" },
        { name: "zeroRows", value: `{${Array.from(zeroRows).join(", ")}}`, tone: "info" },
        { name: "zeroCols", value: `{${Array.from(zeroCols).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (current[i * n + j] === 0) {
        zeroRows.add(i);
        zeroCols.add(j);
        pushStep(7, i, j, `record ${i},${j}`, "ok", `matrix[${i}][${j}] = 0 → add row ${i} and col ${j}.`);
      }
    }
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (zeroRows.has(i) || zeroCols.has(j)) {
        current[i * n + j] = 0;
        pushStep(16, i, j, `zero → 0`, "ok", `Row ${i} or col ${j} marked → matrix[${i}][${j}] = 0.`);
      }
    }
  }

  done = true;
  steps.push({ line: 21, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(rows), tone: "info" }, { name: "cols", value: String(cols), tone: "info" }, { name: "matrix", value: `[${current.join(", ")}]`, tone: "ok" }], result: `[${current.join(", ")}]`, resultTone: "ok", explanation: `Matrix with zeroed rows/cols: [${current.join(", ")}].`, done });
  return steps;
}

// ── Candy Crush ────────────────────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Simulation with Boolean Marking.
// Source (lines):
// 0: function candyCrush(board) {
// 1:     const m = board.length;
// 2:     const n = board[0].length;
// 3:
// 4:     let shouldContinue = true;
// 5:     while (shouldContinue) {
// 6:         shouldContinue = false;
// 7:         const crush = Array.from({length: m}, function() {
// 8:             return new Array(n).fill(false);
// 9:         });
// 10:
// 11:        // Mark horizontal runs of 3+
// 12:        for (let i = 0; i < m; i++) {
// 13:            for (let j = 0; j < n - 2; j++) {
// 14:                const val = board[i][j];
// 15:                if (val !== 0 && val === board[i][j + 1] && val === board[i][j + 2]) {
// 16:                    crush[i][j] = crush[i][j + 1] = crush[i][j + 2] = true;
// 17:                    shouldContinue = true;
// 18:                }
// 19:            }
// 20:        }
// 21:
// 22:        // Mark vertical runs of 3+
// 23:        for (let i = 0; i < m - 2; i++) {
// 24:            for (let j = 0; j < n; j++) {
// 25:                const val = board[i][j];
// 26:                if (val !== 0 && val === board[i + 1][j] && val === board[i + 2][j]) {
// 27:                    crush[i][j] = crush[i + 1][j] = crush[i + 2][j] = true;
// 28:                    shouldContinue = true;
// 29:                }
// 30:            }
// 31:        }
// 32:
// 33:        // Crush marked cells
// 34:        for (let i = 0; i < m; i++) {
// 35:            for (let j = 0; j < n; j++) {
// 36:                if (crush[i][j]) {
// 37:                    board[i][j] = 0;
// 38:                }
// 39:            }
// 40:        }
// 41:
// 42:        // Apply gravity column by column
// 43:        for (let j = 0; j < n; j++) {
// 44:            let writePos = m - 1;
// 45:            for (let i = m - 1; i >= 0; i--) {
// 46:                if (board[i][j] !== 0) {
// 47:                    board[writePos][j] = board[i][j];
// 48:                    if (writePos !== i) {
// 49:                        board[i][j] = 0;
// 50:                    }
// 51:                    writePos--;
// 52:                }
// 53:            }
// 54:            while (writePos >= 0) {
// 55:                board[writePos][j] = 0;
// 56:                writePos--;
// 57:            }
// 58:        }
// 59:    }
// 60:
// 61:    return board;
// 62: }
export function candyCrushBoolTrace(flat: number[], rows: number, cols: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const m = rows, n = cols;
  const current: number[] = [...flat];
  let pass = 0;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(current, (idx) => (current[idx] === 0 ? "active" : "idle")),
      vars: [
        { name: "rows", value: String(rows), tone: "info" },
        { name: "cols", value: String(cols), tone: "info" },
        { name: "pass", value: String(pass), tone: "info" },
        { name: "board", value: `[${current.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  let shouldContinue = true;
  while (shouldContinue) {
    shouldContinue = false;
    pass++;
    const crush = new Array(m * n).fill(false);

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n - 2; j++) {
        const val = current[i * n + j];
        if (val !== 0 && val === current[i * n + j + 1] && val === current[i * n + j + 2]) {
          crush[i * n + j] = crush[i * n + j + 1] = crush[i * n + j + 2] = true;
          shouldContinue = true;
        }
      }
    }
    for (let i = 0; i < m - 2; i++) {
      for (let j = 0; j < n; j++) {
        const val = current[i * n + j];
        if (val !== 0 && val === current[(i + 1) * n + j] && val === current[(i + 2) * n + j]) {
          crush[i * n + j] = crush[(i + 1) * n + j] = crush[(i + 2) * n + j] = true;
          shouldContinue = true;
        }
      }
    }

    if (shouldContinue) {
      for (let idx = 0; idx < m * n; idx++) if (crush[idx]) current[idx] = 0;
      pushStep(34, `crush → 0`, "ok", `Pass ${pass}: crush all marked cells.`);

      for (let j = 0; j < n; j++) {
        let writePos = m - 1;
        for (let i = m - 1; i >= 0; i--) {
          if (current[i * n + j] !== 0) {
            current[writePos * n + j] = current[i * n + j];
            if (writePos !== i) current[i * n + j] = 0;
            writePos--;
          }
        }
        while (writePos >= 0) { current[writePos * n + j] = 0; writePos--; }
      }
      pushStep(43, `gravity applied`, "info", `Pass ${pass}: apply gravity → [${current.join(", ")}].`);
    }
  }

  done = true;
  steps.push({ line: 61, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(rows), tone: "info" }, { name: "cols", value: String(cols), tone: "info" }, { name: "board", value: `[${current.join(", ")}]`, tone: "ok" }], result: `[${current.join(", ")}]`, resultTone: "ok", explanation: `Final board after crushing: [${current.join(", ")}].`, done });
  return steps;
}

// Approach 2: In-Place Simulation with Negation.
// Source (lines):
// 0: function candyCrush(board) {
// 1:     const m = board.length;
// 2:     const n = board[0].length;
// 3:
// 4:     let shouldContinue = true;
// 5:     while (shouldContinue) {
// 6:         shouldContinue = false;
// 7:
// 8:         // Mark horizontal runs by negating values
// 9:         for (let i = 0; i < m; i++) {
// 10:            for (let j = 0; j < n - 2; j++) {
// 11:                const val = Math.abs(board[i][j]);
// 12:                if (val !== 0 && val === Math.abs(board[i][j + 1]) && val === Math.abs(board[i][j + 2])) {
// 13:                    board[i][j] = -val;
// 14:                    board[i][j + 1] = -val;
// 15:                    board[i][j + 2] = -val;
// 16:                    shouldContinue = true;
// 17:                }
// 18:            }
// 19:        }
// 20:
// 21:        // Mark vertical runs by negating values
// 22:        for (let i = 0; i < m - 2; i++) {
// 23:            for (let j = 0; j < n; j++) {
// 24:                const val = Math.abs(board[i][j]);
// 25:                if (val !== 0 && val === Math.abs(board[i + 1][j]) && val === Math.abs(board[i + 2][j])) {
// 26:                    board[i][j] = -val;
// 27:                    board[i + 1][j] = -val;
// 28:                    board[i + 2][j] = -val;
// 29:                    shouldContinue = true;
// 30:                }
// 31:            }
// 32:        }
// 33:
// 34:        // Crush and apply gravity
// 35:        for (let j = 0; j < n; j++) {
// 36:            let writePos = m - 1;
// 37:            for (let i = m - 1; i >= 0; i--) {
// 38:                if (board[i][j] > 0) {
// 39:                    board[writePos][j] = board[i][j];
// 40:                    if (writePos !== i) {
// 41:                        board[i][j] = 0;
// 42:                    }
// 43:                    writePos--;
// 44:                }
// 45:            }
// 46:            while (writePos >= 0) {
// 47:                board[writePos][j] = 0;
// 48:                writePos--;
// 49:            }
// 50:        }
// 51:    }
// 52:
// 53:    return board;
// 54: }
export function candyCrushNegTrace(flat: number[], rows: number, cols: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const m = rows, n = cols;
  const current: number[] = [...flat];
  let pass = 0;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(current, (idx) => (current[idx] === 0 ? "active" : current[idx] < 0 ? "found" : "idle")),
      vars: [
        { name: "rows", value: String(rows), tone: "info" },
        { name: "cols", value: String(cols), tone: "info" },
        { name: "pass", value: String(pass), tone: "info" },
        { name: "board", value: `[${current.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  let shouldContinue = true;
  while (shouldContinue) {
    shouldContinue = false;
    pass++;

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n - 2; j++) {
        const val = Math.abs(current[i * n + j]);
        if (val !== 0 && val === Math.abs(current[i * n + j + 1]) && val === Math.abs(current[i * n + j + 2])) {
          current[i * n + j] = -val;
          current[i * n + j + 1] = -val;
          current[i * n + j + 2] = -val;
          shouldContinue = true;
        }
      }
    }
    for (let i = 0; i < m - 2; i++) {
      for (let j = 0; j < n; j++) {
        const val = Math.abs(current[i * n + j]);
        if (val !== 0 && val === Math.abs(current[(i + 1) * n + j]) && val === Math.abs(current[(i + 2) * n + j])) {
          current[i * n + j] = -val;
          current[(i + 1) * n + j] = -val;
          current[(i + 2) * n + j] = -val;
          shouldContinue = true;
        }
      }
    }

    if (shouldContinue) {
      pushStep(25, `marked negative`, "ok", `Pass ${pass}: mark runs with negatives → [${current.join(", ")}].`);
      for (let j = 0; j < n; j++) {
        let writePos = m - 1;
        for (let i = m - 1; i >= 0; i--) {
          if (current[i * n + j] > 0) {
            current[writePos * n + j] = current[i * n + j];
            if (writePos !== i) current[i * n + j] = 0;
            writePos--;
          } else if (current[i * n + j] < 0) {
            current[i * n + j] = 0;
          }
        }
        while (writePos >= 0) { current[writePos * n + j] = 0; writePos--; }
      }
      pushStep(35, `gravity applied`, "info", `Pass ${pass}: crush & gravity → [${current.join(", ")}].`);
    }
  }

  done = true;
  steps.push({ line: 53, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(rows), tone: "info" }, { name: "cols", value: String(cols), tone: "info" }, { name: "board", value: `[${current.join(", ")}]`, tone: "ok" }], result: `[${current.join(", ")}]`, resultTone: "ok", explanation: `Final board after crushing: [${current.join(", ")}].`, done });
  return steps;
}

// ── Valid Sudoku ───────────────────────────────────────────────────────
// Two DISTINCT approaches. '.' encoded as 0, digits as values.

// Approach 1: Three Separate Passes.
// Source (lines):
// 0: function isValidSudoku(board) {
// 1:     // Check each row
// 2:     for (let r = 0; r < 9; r++) {
// 3:         const seen = new Set();
// 4:         for (let c = 0; c < 9; c++) {
// 5:             if (board[r][c] === '.') continue;
// 6:             if (seen.has(board[r][c])) return false;
// 7:             seen.add(board[r][c]);
// 8:         }
// 9:     }
// 10:
// 11:    // Check each column
// 12:    for (let c = 0; c < 9; c++) {
// 13:        const seen = new Set();
// 14:        for (let r = 0; r < 9; r++) {
// 15:            if (board[r][c] === '.') continue;
// 16:            if (seen.has(board[r][c])) return false;
// 17:            seen.add(board[r][c]);
// 18:        }
// 19:    }
// 20:
// 21:    // Check each 3x3 sub-box
// 22:    for (let boxRow = 0; boxRow < 3; boxRow++) {
// 23:        for (let boxCol = 0; boxCol < 3; boxCol++) {
// 24:            const seen = new Set();
// 25:            for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
// 26:                for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
// 27:                    if (board[r][c] === '.') continue;
// 28:                    if (seen.has(board[r][c])) return false;
// 29:                    seen.add(board[r][c]);
// 30:                }
// 31:            }
// 32:        }
// 33:    }
// 34:
// 35:    return true;
// 36: }
export function sudokuThreePassTrace(flat: number[], rows: number, cols: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = 9;

  const pushStep = (
    line: number,
    r: number,
    c: number,
    seenStr: string,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(flat, (idx) => {
        const rr = Math.floor(idx / n), cc = idx % n;
        if (rr === r && cc === c) return "j";
        return "idle";
      }),
      vars: [
        { name: "rows", value: String(rows), tone: "info" },
        { name: "cols", value: String(cols), tone: "info" },
        { name: "seen", value: seenStr, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  const char = (v: number) => (v === 0 ? "." : String(v));

  for (let r = 0; r < n; r++) {
    const seen = new Set<number>();
    for (let c = 0; c < n; c++) {
      const v = flat[r * n + c];
      if (v === 0) continue;
      if (seen.has(v)) {
        pushStep(6, r, c, `{${Array.from(seen).join(", ")}}`, "duplicate!", "fail", `Row ${r}: '${char(v)}' already seen → return false.`);
        done = true;
        steps.push({ line: 6, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(rows), tone: "info" }, { name: "cols", value: String(cols), tone: "info" }, { name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Duplicate in row ${r} → return false.`, done });
        return steps;
      }
      seen.add(v);
      pushStep(7, r, c, `{${Array.from(seen).join(", ")}}`, `add ${char(v)}`, "ok", `Row ${r}: add '${char(v)}'.`);
    }
  }

  for (let c = 0; c < n; c++) {
    const seen = new Set<number>();
    for (let r = 0; r < n; r++) {
      const v = flat[r * n + c];
      if (v === 0) continue;
      if (seen.has(v)) {
        pushStep(16, r, c, `{${Array.from(seen).join(", ")}}`, "duplicate!", "fail", `Column ${c}: '${char(v)}' already seen → return false.`);
        done = true;
        steps.push({ line: 16, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(rows), tone: "info" }, { name: "cols", value: String(cols), tone: "info" }, { name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Duplicate in column ${c} → return false.`, done });
        return steps;
      }
      seen.add(v);
      pushStep(17, r, c, `{${Array.from(seen).join(", ")}}`, `add ${char(v)}`, "ok", `Column ${c}: add '${char(v)}'.`);
    }
  }

  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Set<number>();
      for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
        for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
          const v = flat[r * n + c];
          if (v === 0) continue;
          if (seen.has(v)) {
            pushStep(28, r, c, `{${Array.from(seen).join(", ")}}`, "duplicate!", "fail", `Box (${boxRow},${boxCol}): '${char(v)}' already seen → return false.`);
            done = true;
            steps.push({ line: 28, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(rows), tone: "info" }, { name: "cols", value: String(cols), tone: "info" }, { name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Duplicate in 3×3 box → return false.`, done });
            return steps;
          }
          seen.add(v);
          pushStep(29, r, c, `{${Array.from(seen).join(", ")}}`, `add ${char(v)}`, "ok", `Box (${boxRow},${boxCol}): add '${char(v)}'.`);
        }
      }
    }
  }

  done = true;
  steps.push({ line: 35, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(rows), tone: "info" }, { name: "cols", value: String(cols), tone: "info" }, { name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `No duplicates in rows, columns, or boxes → valid sudoku.`, done });
  return steps;
}

// Approach 2: Single Pass with Hash Sets.
// Source (lines):
// 0: function isValidSudoku(board) {
// 1:     // One set per row, column, and 3x3 box
// 2:     const rows = Array.from({ length: 9 }, () => new Set());
// 3:     const cols = Array.from({ length: 9 }, () => new Set());
// 4:     const boxes = Array.from({ length: 9 }, () => new Set());
// 5:
// 6:     for (let r = 0; r < 9; r++) {
// 7:         for (let c = 0; c < 9; c++) {
// 8:             if (board[r][c] === '.') continue;
// 9:
// 10:            const digit = board[r][c];
// 11:            const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);
// 12:
// 13:            // Check all three constraints at once
// 14:            if (rows[r].has(digit) || cols[c].has(digit) || boxes[boxIdx].has(digit)) {
// 15:                return false;
// 16:            }
// 17:
// 18:            rows[r].add(digit);
// 19:            cols[c].add(digit);
// 20:            boxes[boxIdx].add(digit);
// 21:        }
// 22:    }
// 23:
// 24:    return true;
// 25: }
export function sudokuSinglePassTrace(flat: number[], rows: number, cols: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const n = 9;
  const rowSets: Set<number>[] = Array.from({ length: 9 }, () => new Set());
  const colSets: Set<number>[] = Array.from({ length: 9 }, () => new Set());
  const boxSets: Set<number>[] = Array.from({ length: 9 }, () => new Set());

  const pushStep = (
    line: number,
    r: number,
    c: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(flat, (idx) => {
        const rr = Math.floor(idx / n), cc = idx % n;
        if (rr === r && cc === c) return "j";
        return "idle";
      }),
      vars: [
        { name: "rows", value: String(rows), tone: "info" },
        { name: "cols", value: String(cols), tone: "info" },
        { name: "r", value: String(r), tone: "info" },
        { name: "c", value: String(c), tone: "info" },
        { name: "boxIdx", value: String(Math.floor(r / 3) * 3 + Math.floor(c / 3)), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  const char = (v: number) => (v === 0 ? "." : String(v));

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const v = flat[r * n + c];
      if (v === 0) continue;
      const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      if (rowSets[r].has(v) || colSets[c].has(v) || boxSets[boxIdx].has(v)) {
        pushStep(14, r, c, "conflict!", "fail", `'${char(v)}' conflicts in row ${r}, col ${c}, or box ${boxIdx} → return false.`);
        done = true;
        steps.push({ line: 14, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(rows), tone: "info" }, { name: "cols", value: String(cols), tone: "info" }, { name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Duplicate found → return false.`, done });
        return steps;
      }
      rowSets[r].add(v);
      colSets[c].add(v);
      boxSets[boxIdx].add(v);
      pushStep(18, r, c, `add ${char(v)}`, "ok", `Add '${char(v)}' to row ${r}, col ${c}, box ${boxIdx}.`);
    }
  }

  done = true;
  steps.push({ line: 24, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(rows), tone: "info" }, { name: "cols", value: String(cols), tone: "info" }, { name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `No duplicates → valid sudoku.`, done });
  return steps;
}

// ── Game of Life ───────────────────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Brute Force (Copy Board).
// Source (lines):
// 0: function gameOfLife(board) {
// 1:     const m = board.length;
// 2:     const n = board[0].length;
// 3:
// 4:     // Create a copy to read original states from
// 5:     const copy = board.map((row) => [...row]);
// 6:
// 7:     // 8 possible neighbor directions
// 8:     const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
// 9:     const dc = [-1, 0, 1, -1, 1, -1, 0, 1];
// 10:
// 11:    for (let i = 0; i < m; i++) {
// 12:        for (let j = 0; j < n; j++) {
// 13:            let liveNeighbors = 0;
// 14:
// 15:            // Count live neighbors from the copy
// 16:            for (let d = 0; d < 8; d++) {
// 17:                const ni = i + dr[d];
// 18:                const nj = j + dc[d];
// 19:                if (ni >= 0 && ni < m && nj >= 0 && nj < n && copy[ni][nj] === 1) {
// 20:                    liveNeighbors++;
// 21:                }
// 22:            }
// 23:
// 24:            // Apply rules
// 25:            if (copy[i][j] === 1) {
// 26:                if (liveNeighbors < 2 || liveNeighbors > 3) {
// 27:                    board[i][j] = 0;
// 28:                }
// 29:            } else {
// 30:                if (liveNeighbors === 3) {
// 31:                    board[i][j] = 1;
// 32:                }
// 33:            }
// 34:        }
// 35:    }
// 36: }
export function gameOfLifeCopyTrace(flat: number[], rows: number, cols: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const m = rows, n = cols;
  const copy = [...flat];
  const current: number[] = [...flat];
  const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
  const dc = [-1, 0, 1, -1, 1, -1, 0, 1];

  const pushStep = (
    line: number,
    i: number,
    j: number,
    live: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(current, (idx) => {
        const r = Math.floor(idx / n), c = idx % n;
        if (r === i && c === j) return "j";
        if (current[idx] === 1) return "active";
        return "idle";
      }),
      vars: [
        { name: "rows", value: String(rows), tone: "info" },
        { name: "cols", value: String(cols), tone: "info" },
        { name: "i", value: String(i), tone: "info" },
        { name: "j", value: String(j), tone: "info" },
        { name: "liveNeighbors", value: String(live), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let live = 0;
      for (let d = 0; d < 8; d++) {
        const ni = i + dr[d], nj = j + dc[d];
        if (ni >= 0 && ni < m && nj >= 0 && nj < n && copy[ni * n + nj] === 1) live++;
      }
      if (copy[i * n + j] === 1) {
        if (live < 2 || live > 3) {
          current[i * n + j] = 0;
          pushStep(26, i, j, live, `die (${live})`, "fail", `Live cell (${i},${j}) has ${live} neighbors < 2 or > 3 → dies.`);
        } else {
          pushStep(25, i, j, live, `survive (${live})`, "ok", `Live cell (${i},${j}) has ${live} neighbors → survives.`);
        }
      } else {
        if (live === 3) {
          current[i * n + j] = 1;
          pushStep(30, i, j, live, `born (${live})`, "ok", `Dead cell (${i},${j}) has exactly 3 neighbors → born.`);
        } else {
          pushStep(30, i, j, live, `stay dead (${live})`, "info", `Dead cell (${i},${j}) has ${live} neighbors → stays dead.`);
        }
      }
    }
  }

  done = true;
  steps.push({ line: 36, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(rows), tone: "info" }, { name: "cols", value: String(cols), tone: "info" }, { name: "board", value: `[${current.join(", ")}]`, tone: "ok" }], result: `[${current.join(", ")}]`, resultTone: "ok", explanation: `Next generation: [${current.join(", ")}].`, done });
  return steps;
}

// Approach 2: In-Place with State Encoding (Optimal).
// Source (lines):
// 0: function gameOfLife(board) {
// 1:     const m = board.length;
// 2:     const n = board[0].length;
// 3:     const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
// 4:     const dc = [-1, 0, 1, -1, 1, -1, 0, 1];
// 5:
// 6:     // First pass: encode transitions
// 7:     for (let i = 0; i < m; i++) {
// 8:         for (let j = 0; j < n; j++) {
// 9:             let liveNeighbors = 0;
// 10:            for (let d = 0; d < 8; d++) {
// 11:                const ni = i + dr[d];
// 12:                const nj = j + dc[d];
// 13:                // Use % 2 to get original state from encoded value
// 14:                if (ni >= 0 && ni < m && nj >= 0 && nj < n && board[ni][nj] % 2 === 1) {
// 15:                    liveNeighbors++;
// 16:                }
// 17:            }
// 18:
// 19:            // Alive cell that dies → encode as 3
// 20:            if (board[i][j] === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
// 21:                board[i][j] = 3;
// 22:            }
// 23:            // Dead cell that becomes alive → encode as 2
// 24:            if (board[i][j] === 0 && liveNeighbors === 3) {
// 25:                board[i][j] = 2;
// 26:            }
// 27:        }
// 28:    }
// 29:
// 30:    // Second pass: convert encoded values to final states
// 31:    for (let i = 0; i < m; i++) {
// 32:        for (let j = 0; j < n; j++) {
// 33:            board[i][j] = board[i][j] === 1 || board[i][j] === 2 ? 1 : 0;
// 34:        }
// 35:    }
// 36: }
export function gameOfLifeEncodeTrace(flat: number[], rows: number, cols: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const m = rows, n = cols;
  const current: number[] = [...flat];
  const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
  const dc = [-1, 0, 1, -1, 1, -1, 0, 1];

  const pushStep = (
    line: number,
    i: number,
    j: number,
    live: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(current, (idx) => {
        const r = Math.floor(idx / n), c = idx % n;
        if (r === i && c === j) return "j";
        return "idle";
      }),
      vars: [
        { name: "rows", value: String(rows), tone: "info" },
        { name: "cols", value: String(cols), tone: "info" },
        { name: "i", value: String(i), tone: "info" },
        { name: "j", value: String(j), tone: "info" },
        { name: "liveNeighbors", value: String(live), tone: "info" },
        { name: "board", value: `[${current.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let live = 0;
      for (let d = 0; d < 8; d++) {
        const ni = i + dr[d], nj = j + dc[d];
        if (ni >= 0 && ni < m && nj >= 0 && nj < n && current[ni * n + nj] % 2 === 1) live++;
      }
      if (current[i * n + j] === 1 && (live < 2 || live > 3)) {
        current[i * n + j] = 3;
        pushStep(20, i, j, live, `encode 3 (die)`, "fail", `Live (${i},${j}) with ${live} neighbors → encode 3.`);
      }
      if (current[i * n + j] === 0 && live === 3) {
        current[i * n + j] = 2;
        pushStep(24, i, j, live, `encode 2 (born)`, "ok", `Dead (${i},${j}) with 3 neighbors → encode 2.`);
      }
    }
  }

  pushStep(30, -1, -1, 0, `encoded: [${current.join(", ")}]`, "info", `All transitions encoded (0/1 original, 2=born, 3=die).`);

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      current[i * n + j] = current[i * n + j] === 1 || current[i * n + j] === 2 ? 1 : 0;
    }
  }

  done = true;
  steps.push({ line: 36, cells: flat.map(() => "idle"), vars: [{ name: "rows", value: String(rows), tone: "info" }, { name: "cols", value: String(cols), tone: "info" }, { name: "board", value: `[${current.join(", ")}]`, tone: "ok" }], result: `[${current.join(", ")}]`, resultTone: "ok", explanation: `Next generation: [${current.join(", ")}].`, done });
  return steps;
}

// ── Intersection of Two Linked Lists ──────────────────────────────────
// Two DISTINCT approaches. headA and headB as value arrays.

// Approach 1: Hash Set.
// Source (lines):
// 0: function getIntersectionNode(headA, headB) {
// 1:     // Store all nodes from list A in a set
// 2:     var visited = new Set();
// 3:     var curr = headA;
// 4:     while (curr !== null) {
// 5:         visited.add(curr);
// 6:         curr = curr.next;
// 7:     }
// 8:
// 9:     // Walk through list B and find the first shared node
// 10:    curr = headB;
// 11:    while (curr !== null) {
// 12:        if (visited.has(curr)) {
// 13:            return curr;
// 14:        }
// 15:        curr = curr.next;
// 16:    }
// 17:
// 18:    return null;
// 19: }
export function intersectionHashSetTrace(aVals: number[], bVals: number[], interIdx: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const visited = new Set<number>();
  const aLen = aVals.length;
  const bLen = bVals.length;

  const pushStep = (
    line: number,
    list: "A" | "B",
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    const cells = list === "A" ? aVals : bVals;
    steps.push({
      line,
      cells: cellsFor(cells, (i) => (i === idx ? "i" : "idle")),
      vars: [
        { name: "list", value: list, tone: "info" },
        { name: "idx", value: idx >= 0 ? String(idx) : "—", tone: "info" },
        { name: "visited", value: `{${Array.from(visited).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < aLen; i++) {
    visited.add(i);
    pushStep(5, "A", i, `add node ${i}`, "info", `Add list A node ${i} (val ${aVals[i]}) to visited.`);
  }

  for (let i = 0; i < bLen; i++) {
    if (visited.has(i)) {
      pushStep(12, "B", i, "intersection!", "ok", `List B node ${i} (val ${bVals[i]}) is in visited → return it.`);
      done = true;
      steps.push({ line: 13, cells: bVals.map(() => "idle"), vars: [{ name: "result", value: `node ${i} (val ${bVals[i]})`, tone: "ok" }], result: `node ${i}`, resultTone: "ok", explanation: `Intersection node = ${bVals[i]}.`, done });
      return steps;
    }
    pushStep(12, "B", i, "not in set", "fail", `List B node ${i} (val ${bVals[i]}) not in visited.`);
  }

  done = true;
  steps.push({ line: 18, cells: bVals.map(() => "idle"), vars: [{ name: "result", value: "null", tone: "fail" }], result: "null", resultTone: "fail", explanation: `No intersection → return null.`, done });
  return steps;
}

// Approach 2: Two Pointers.
// Source (lines):
// 0: function getIntersectionNode(headA, headB) {
// 1:     var pA = headA;
// 2:     var pB = headB;
// 3:
// 4:     // Each pointer traverses both lists, meeting at intersection or null
// 5:     while (pA !== pB) {
// 6:         pA = (pA !== null) ? pA.next : headB;
// 7:         pB = (pB !== null) ? pB.next : headA;
// 8:     }
// 9:
// 10:    return pA;
// 11: }
export function intersectionTwoPointerTrace(aVals: number[], bVals: number[], interIdx: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const aLen = aVals.length;
  const bLen = bVals.length;

  const pushStep = (
    line: number,
    pA: number,
    pB: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(aVals, (i) => (i === pA ? "i" : "idle")),
      vars: [
        { name: "pA", value: pA >= 0 ? `node ${pA}` : "null", tone: "info" },
        { name: "pB", value: pB >= 0 ? `node ${pB}` : "null", tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  let pA = 0, pB = 0;
  let guard = 0;
  while (pA !== pB && guard < aLen + bLen + 2) {
    pushStep(5, pA, pB, "advance", "info", `pA at node ${pA}, pB at node ${pB}.`);
    pA = pA + 1 < aLen ? pA + 1 : 0;
    pB = pB + 1 < bLen ? pB + 1 : 0;
    guard++;
  }

  if (pA === pB) {
    pushStep(5, pA, pB, "meet!", "ok", `pA and pB meet at node ${pA} (val ${aVals[pA]}) → intersection.`);
    done = true;
    steps.push({ line: 10, cells: aVals.map(() => "idle"), vars: [{ name: "result", value: `node ${pA} (val ${aVals[pA]})`, tone: "ok" }], result: `node ${pA}`, resultTone: "ok", explanation: `Intersection node = ${aVals[pA]}.`, done });
    return steps;
  }

  done = true;
  steps.push({ line: 10, cells: aVals.map(() => "idle"), vars: [{ name: "result", value: "null", tone: "fail" }], result: "null", resultTone: "fail", explanation: `No intersection → return null.`, done });
  return steps;
}

// ── Remove Duplicates from Sorted List ─────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Using a Hash Set.
// Source (lines):
// 0: function deleteDuplicates(head) {
// 1:     if (!head) return null;
// 2:
// 3:     var seen = new Set();
// 4:     seen.add(head.val);
// 5:     var current = head;
// 6:
// 7:     while (current.next) {
// 8:         if (seen.has(current.next.val)) {
// 9:             // Skip the duplicate node
// 10:            current.next = current.next.next;
// 11:        } else {
// 12:            seen.add(current.next.val);
// 13:            current = current.next;
// 14:        }
// 15:    }
// 16:
// 17:    return head;
// 18: }
export function deleteDuplicatesSetTrace(vals: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const seen = new Set<number>();
  const result: number[] = [...vals];

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, (i) => (i === idx ? "i" : "idle")),
      vars: [
        { name: "idx", value: idx >= 0 ? String(idx) : "—", tone: "info" },
        { name: "seen", value: `{${Array.from(seen).join(", ")}}`, tone: "info" },
        { name: "list", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (result.length === 0) {
    done = true;
    steps.push({ line: 1, cells: [], vars: [{ name: "result", value: "null", tone: "fail" }], result: "null", resultTone: "fail", explanation: `Empty list → return null.`, done });
    return steps;
  }

  seen.add(result[0]);
  pushStep(4, 0, `seen = {${result[0]}}`, "info", `Add head val ${result[0]}.`);

  let idx = 0;
  while (idx + 1 < result.length) {
    if (seen.has(result[idx + 1])) {
      result.splice(idx + 1, 1);
      pushStep(8, idx, `skip dup`, "fail", `Val ${result[idx]} already seen → remove next duplicate.`);
    } else {
      seen.add(result[idx + 1]);
      idx++;
      pushStep(12, idx, `add ${result[idx]}`, "info", `Add val ${result[idx]} to seen, advance.`);
    }
  }

  done = true;
  steps.push({ line: 17, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Deduplicated list = [${result.join(", ")}].`, done });
  return steps;
}

// Approach 2: Single Pass In-Place (Optimal).
// Source (lines):
// 0: function deleteDuplicates(head) {
// 1:     var current = head;
// 2:
// 3:     while (current !== null && current.next !== null) {
// 4:         if (current.val === current.next.val) {
// 5:             // Skip the duplicate node
// 6:             current.next = current.next.next;
// 7:         } else {
// 8:             // Move to the next distinct node
// 9:             current = current.next;
// 10:        }
// 11:    }
// 12:
// 13:    return head;
// 14: }
export function deleteDuplicatesInPlaceTrace(vals: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, (i) => (i === idx ? "i" : "idle")),
      vars: [
        { name: "idx", value: idx >= 0 ? String(idx) : "—", tone: "info" },
        { name: "list", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (result.length === 0) {
    done = true;
    steps.push({ line: 1, cells: [], vars: [{ name: "result", value: "null", tone: "fail" }], result: "null", resultTone: "fail", explanation: `Empty list → return null.`, done });
    return steps;
  }

  let idx = 0;
  while (idx + 1 < result.length) {
    if (result[idx] === result[idx + 1]) {
      result.splice(idx + 1, 1);
      pushStep(4, idx, `skip dup`, "fail", `Val ${result[idx]} equals next → skip duplicate.`);
    } else {
      idx++;
      pushStep(8, idx, `advance`, "info", `Val ${result[idx]} distinct → advance.`);
    }
  }

  done = true;
  steps.push({ line: 13, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Deduplicated list = [${result.join(", ")}].`, done });
  return steps;
}

// ── Design Linked List ─────────────────────────────────────────────────
// Two DISTINCT approaches. Class-based; hardcoded demo sequence.

// Approach 1: Singly Linked List.
// Source (lines):
// 0: function MyLinkedList() {
// 1:     this.sentinel = {val: 0, next: null};
// 2:     this.size = 0;
// 3: };
// 4: MyLinkedList.prototype.get = function(index) {
// 5:     if (index < 0 || index >= this.size) return -1;
// 6:     var current = this.sentinel.next;
// 7:     for (var i = 0; i < index; i++) current = current.next;
// 8:     return current.val;
// 9: };
// 10: MyLinkedList.prototype.addAtHead = function(val) { this.addAtIndex(0, val); };
// 11: MyLinkedList.prototype.addAtTail = function(val) { this.addAtIndex(this.size, val); };
// 12: MyLinkedList.prototype.addAtIndex = function(index, val) {
// 13:    if (index < 0 || index > this.size) return;
// 14:    var pred = this.sentinel;
// 15:    for (var i = 0; i < index; i++) pred = pred.next;
// 16:    var newNode = {val: val, next: pred.next};
// 17:    pred.next = newNode;
// 18:    this.size++;
// 19: };
// 20: MyLinkedList.prototype.deleteAtIndex = function(index) {
// 21:    if (index < 0 || index >= this.size) return;
// 22:    var pred = this.sentinel;
// 23:    for (var i = 0; i < index; i++) pred = pred.next;
// 24:    pred.next = pred.next.next;
// 25:    this.size--;
// 26: }
export function designLinkedListSinglyTrace(): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const list: number[] = [];
  const ops = ["addAtHead(1)", "addAtTail(3)", "addAtIndex(1,2)", "get(1)", "deleteAtIndex(1)", "get(1)"];

  const pushStep = (
    line: number,
    opIdx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(list, () => "idle"),
      values: [...list],
      vars: [
        { name: "op", value: ops[opIdx] ?? "—", tone: "info" },
        { name: "list", value: `[${list.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  list.push(1); pushStep(10, 0, `addAtHead(1)`, "ok", `addAtHead(1) → list = [1].`);
  list.push(3); pushStep(11, 1, `addAtTail(3)`, "ok", `addAtTail(3) → list = [1, 3].`);
  list.splice(1, 0, 2); pushStep(12, 2, `addAtIndex(1,2)`, "ok", `addAtIndex(1,2) → list = [1, 2, 3].`);
  pushStep(4, 3, `get(1) = ${list[1]}`, "ok", `get(1) → list[1] = ${list[1]}.`);
  list.splice(1, 1); pushStep(20, 4, `deleteAtIndex(1)`, "fail", `deleteAtIndex(1) → list = [1, 3].`);
  pushStep(4, 5, `get(1) = ${list[1]}`, "ok", `get(1) → list[1] = ${list[1]}.`);

  done = true;
  steps.push({ line: 26, cells: list.map(() => "idle"), values: [...list], vars: [{ name: "result", value: `[${list.join(", ")}]`, tone: "ok" }], result: `[${list.join(", ")}]`, resultTone: "ok", explanation: `Final list = [${list.join(", ")}].`, done });
  return steps;
}

// Approach 2: Doubly Linked List.
// Source (lines):
// 0: function MyLinkedList() {
// 1:     this.headSentinel = {val: 0, prev: null, next: null};
// 2:     this.tailSentinel = {val: 0, prev: null, next: null};
// 3:     this.headSentinel.next = this.tailSentinel;
// 4:     this.tailSentinel.prev = this.headSentinel;
// 5:     this.size = 0;
// 6: };
// 7: MyLinkedList.prototype._getNodeAt = function(index) {
// 8:     var node;
// 9:     if (index < this.size / 2) {
// 10:        node = this.headSentinel.next;
// 11:        for (var i = 0; i < index; i++) node = node.next;
// 12:    } else {
// 13:        node = this.tailSentinel.prev;
// 14:        for (var i = this.size - 1; i > index; i--) node = node.prev;
// 15:    }
// 16:    return node;
// 17: };
// 18: MyLinkedList.prototype.get = function(index) {
// 19:    if (index < 0 || index >= this.size) return -1;
// 20:    return this._getNodeAt(index).val;
// 21: };
// 22: MyLinkedList.prototype.addAtHead = function(val) {
// 23:    var newNode = {val: val, prev: null, next: null};
// 24:    var after = this.headSentinel.next;
// 25:    this.headSentinel.next = newNode;
// 26:    newNode.prev = this.headSentinel;
// 27:    newNode.next = after;
// 28:    after.prev = newNode;
// 29:    this.size++;
// 30: };
// 31: MyLinkedList.prototype.addAtTail = function(val) {
// 32:    var newNode = {val: val, prev: null, next: null};
// 33:    var before = this.tailSentinel.prev;
// 34:    before.next = newNode;
// 35:    newNode.prev = before;
// 36:    newNode.next = this.tailSentinel;
// 37:    this.tailSentinel.prev = newNode;
// 38:    this.size++;
// 39: };
// 40: MyLinkedList.prototype.addAtIndex = function(index, val) {
// 41:    if (index < 0 || index > this.size) return;
// 42:    var successor, predecessor;
// 43:    if (index === this.size) {
// 44:        successor = this.tailSentinel;
// 45:        predecessor = this.tailSentinel.prev;
// 46:    } else {
// 47:        successor = this._getNodeAt(index);
// 48:        predecessor = successor.prev;
// 49:    }
// 50:    var newNode = {val: val, prev: predecessor, next: successor};
// 51:    predecessor.next = newNode;
// 52:    successor.prev = newNode;
// 53:    this.size++;
// 54: };
// 55: MyLinkedList.prototype.deleteAtIndex = function(index) {
// 56:    if (index < 0 || index >= this.size) return;
// 57:    var node = this._getNodeAt(index);
// 58:    node.prev.next = node.next;
// 59:    node.next.prev = node.prev;
// 60:    this.size--;
// 61: }
export function designLinkedListDoublyTrace(): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const list: number[] = [];
  const ops = ["addAtHead(1)", "addAtTail(3)", "addAtIndex(1,2)", "get(1)", "deleteAtIndex(1)", "get(1)"];

  const pushStep = (
    line: number,
    opIdx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(list, () => "idle"),
      values: [...list],
      vars: [
        { name: "op", value: ops[opIdx] ?? "—", tone: "info" },
        { name: "list", value: `[${list.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  list.push(1); pushStep(22, 0, `addAtHead(1)`, "ok", `addAtHead(1) → list = [1].`);
  list.push(3); pushStep(31, 1, `addAtTail(3)`, "ok", `addAtTail(3) → list = [1, 3].`);
  list.splice(1, 0, 2); pushStep(40, 2, `addAtIndex(1,2)`, "ok", `addAtIndex(1,2) → list = [1, 2, 3].`);
  pushStep(18, 3, `get(1) = ${list[1]}`, "ok", `get(1) → list[1] = ${list[1]}.`);
  list.splice(1, 1); pushStep(55, 4, `deleteAtIndex(1)`, "fail", `deleteAtIndex(1) → list = [1, 3].`);
  pushStep(18, 5, `get(1) = ${list[1]}`, "ok", `get(1) → list[1] = ${list[1]}.`);

  done = true;
  steps.push({ line: 61, cells: list.map(() => "idle"), values: [...list], vars: [{ name: "result", value: `[${list.join(", ")}]`, tone: "ok" }], result: `[${list.join(", ")}]`, resultTone: "ok", explanation: `Final list = [${list.join(", ")}].`, done });
  return steps;
}

// ── Remove Nth Node From End of List ───────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Two Pass (Count then Remove).
// Source (lines):
// 0: function removeNthFromEnd(head, n) {
// 1:     // Dummy node simplifies edge case of removing head
// 2:     var dummy = new ListNode(0, head);
// 3:
// 4:     // First pass: count total nodes
// 5:     var length = 0;
// 6:     var current = head;
// 7:     while (current !== null) {
// 8:         length++;
// 9:         current = current.next;
// 10:    }
// 11:
// 12:    // Second pass: advance (length - n) steps from dummy
// 13:    var prev = dummy;
// 14:    for (var i = 0; i < length - n; i++) {
// 15:        prev = prev.next;
// 16:    }
// 17:
// 18:    // Remove the target node
// 19:    prev.next = prev.next.next;
// 20:
// 21:    return dummy.next;
// 22: }
export function removeNthTwoPassTrace(vals: number[], n: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];
  const length = result.length;

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, (i) => (i === idx ? "i" : "idle")),
      vars: [
        { name: "idx", value: idx >= 0 ? String(idx) : "—", tone: "info" },
        { name: "length", value: String(length), tone: "info" },
        { name: "n", value: String(n), tone: "info" },
        { name: "list", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(5, -1, `length = ${length}`, "info", `First pass counts ${length} nodes.`);

  const target = length - n;
  for (let i = 0; i < target; i++) {
    pushStep(14, i, `advance to ${i}`, "info", `Second pass: advance prev to node ${i}.`);
  }
  const removed = result[target];
  result.splice(target, 1);
  pushStep(19, target, `remove node ${removed}`, "fail", `Remove nth-from-end node (val ${removed}) at index ${target}.`);

  done = true;
  steps.push({ line: 21, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `List after removing ${n}th from end = [${result.join(", ")}].`, done });
  return steps;
}

// Approach 2: One Pass (Two Pointers).
// Source (lines):
// 0: function removeNthFromEnd(head, n) {
// 1:     // Dummy node handles the edge case of removing the head
// 2:     var dummy = new ListNode(0, head);
// 3:     var slow = dummy;
// 4:     var fast = dummy;
// 5:
// 6:     // Advance fast by n + 1 steps to create the gap
// 7:     for (var i = 0; i <= n; i++) {
// 8:         fast = fast.next;
// 9:     }
// 10:
// 11:    // Move both pointers until fast reaches the end
// 12:    while (fast !== null) {
// 13:        slow = slow.next;
// 14:        fast = fast.next;
// 15:    }
// 16:
// 17:    // slow is now the node before the target, skip the target
// 18:    slow.next = slow.next.next;
// 19:
// 20:    return dummy.next;
// 21: }
export function removeNthOnePassTrace(vals: number[], n: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];
  const length = result.length;

  const pushStep = (
    line: number,
    slow: number,
    fast: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, (i) => (i === slow ? "i" : i === fast ? "j" : "idle")),
      vars: [
        { name: "slow", value: slow >= 0 ? String(slow) : "dummy", tone: "info" },
        { name: "fast", value: fast >= 0 ? String(fast) : fast === -1 ? "dummy" : "null", tone: "info" },
        { name: "n", value: String(n), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  let slow = -1, fast = -1;
  for (let i = 0; i <= n; i++) {
    fast = fast + 1 < length ? fast + 1 : length;
    pushStep(7, slow, fast, `fast → ${fast}`, "info", `Advance fast by n+1 steps.`);
  }

  while (fast < length) {
    slow++;
    fast++;
    pushStep(12, slow, fast, `move both`, "info", `Move slow and fast together.`);
  }

  const target = slow + 1;
  const removed = result[target];
  result.splice(target, 1);
  pushStep(18, slow, fast, `remove node ${removed}`, "fail", `slow is before target → skip node ${removed}.`);

  done = true;
  steps.push({ line: 20, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `List after removing ${n}th from end = [${result.join(", ")}].`, done });
  return steps;
}

// ── Remove Duplicates from Sorted List II ──────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Hash Map (Two Pass).
// Source (lines):
// 0: function deleteDuplicates(head) {
// 1:     // Pass 1: count frequencies
// 2:     var count = new Map();
// 3:     var current = head;
// 4:     while (current !== null) {
// 5:         count.set(current.val, (count.get(current.val) || 0) + 1);
// 6:         current = current.next;
// 7:     }
// 8:
// 9:     // Pass 2: remove nodes with count > 1
// 10:    var dummy = new ListNode(0, head);
// 11:    var prev = dummy;
// 12:    while (prev.next !== null) {
// 13:        if (count.get(prev.next.val) > 1) {
// 14:            // Skip this node
// 15:            prev.next = prev.next.next;
// 16:        } else {
// 17:            prev = prev.next;
// 18:        }
// 19:    }
// 20:
// 21:    return dummy.next;
// 22: }
export function deleteDuplicatesIIMapTrace(vals: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const count = new Map<number, number>();
  const result: number[] = [...vals];

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, (i) => (i === idx ? "i" : "idle")),
      vars: [
        { name: "idx", value: idx >= 0 ? String(idx) : "—", tone: "info" },
        { name: "count", value: `{${Array.from(count.entries()).map(([v, c]) => `${v}:${c}`).join(", ")}}`, tone: "info" },
        { name: "list", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (const v of result) count.set(v, (count.get(v) || 0) + 1);
  pushStep(2, -1, `count = {${Array.from(count.entries()).map(([v, c]) => `${v}:${c}`).join(", ")}}`, "info", `Pass 1: count frequencies.`);

  let idx = 0;
  while (idx < result.length) {
    if (count.get(result[idx])! > 1) {
      result.splice(idx, 1);
      pushStep(13, idx, `remove ${result[idx] ?? "?"}`, "fail", `Val appears ${count.get(result[idx] ?? 0)} times → remove.`);
    } else {
      idx++;
      pushStep(16, idx, `keep ${result[idx - 1]}`, "ok", `Val ${result[idx - 1]} is unique → keep.`);
    }
  }

  done = true;
  steps.push({ line: 21, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `List with all duplicates removed = [${result.join(", ")}].`, done });
  return steps;
}

// Approach 2: Single Pass with Dummy Node (Optimal).
// Source (lines):
// 0: function deleteDuplicates(head) {
// 1:     var dummy = new ListNode(0, head);
// 2:     var prev = dummy;
// 3:
// 4:     var current = head;
// 5:     while (current !== null) {
// 6:         // Check if current starts a duplicate run
// 7:         if (current.next !== null && current.val === current.next.val) {
// 8:             // Skip all nodes with this value
// 9:             while (current.next !== null && current.val === current.next.val) {
// 10:                current = current.next;
// 11:            }
// 12:            // Wire prev to the node after the duplicate run
// 13:            prev.next = current.next;
// 14:        } else {
// 15:            // Current is unique, advance prev
// 16:            prev = prev.next;
// 17:        }
// 18:        current = current.next;
// 19:    }
// 20:
// 21:    return dummy.next;
// 22: }
export function deleteDuplicatesIISingleTrace(vals: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, (i) => (i === idx ? "i" : "idle")),
      vars: [
        { name: "idx", value: idx >= 0 ? String(idx) : "—", tone: "info" },
        { name: "list", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  let idx = 0;
  while (idx < result.length) {
    if (idx + 1 < result.length && result[idx] === result[idx + 1]) {
      const dup = result[idx];
      while (idx < result.length && result[idx] === dup) {
        result.splice(idx, 1);
      }
      pushStep(7, idx, `remove run of ${dup}`, "fail", `Skip all nodes with value ${dup}.`);
    } else {
      idx++;
      pushStep(15, idx, `keep ${result[idx - 1]}`, "ok", `Val ${result[idx - 1]} is unique → keep.`);
    }
  }

  done = true;
  steps.push({ line: 21, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `List with all duplicates removed = [${result.join(", ")}].`, done });
  return steps;
}

// ── Swap Nodes in Pairs ─────────────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Recursive.
// Source (lines):
// 0: function swapPairs(head) {
// 1:     // Base case: fewer than 2 nodes, nothing to swap
// 2:     if (!head || !head.next) return head;
// 3:
// 4:     var first = head;
// 5:     var second = head.next;
// 6:
// 7:     // Recursively swap the rest of the list
// 8:     first.next = swapPairs(second.next);
// 9:     second.next = first;
// 10:
// 11:    // second is now the head of this swapped pair
// 12:    return second;
// 13: }
export function swapPairsRecursiveTrace(vals: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, () => "idle"),
      vars: [{ name: "list", value: `[${result.join(", ")}]`, tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i + 1 < result.length; i += 2) {
    const tmp = result[i];
    result[i] = result[i + 1];
    result[i + 1] = tmp;
    pushStep(8, `swap (${i},${i + 1})`, "ok", `Recursively swap pair (${i},${i + 1}) → [${result.join(", ")}].`);
  }

  done = true;
  steps.push({ line: 12, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Swapped list = [${result.join(", ")}].`, done });
  return steps;
}

// Approach 2: Iterative with Dummy Node.
// Source (lines):
// 0: function swapPairs(head) {
// 1:     // Dummy node simplifies head pointer management
// 2:     var dummy = new ListNode(0, head);
// 3:     var prev = dummy;
// 4:
// 5:     while (prev.next && prev.next.next) {
// 6:         var first = prev.next;
// 7:         var second = prev.next.next;
// 8:
// 9:         // Rewire the three pointers
// 10:        prev.next = second;
// 11:        first.next = second.next;
// 12:        second.next = first;
// 13:
// 14:        // Advance prev to the end of the swapped pair
// 15:        prev = first;
// 16:    }
// 17:
// 18:    return dummy.next;
// 19: }
export function swapPairsIterativeTrace(vals: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, () => "idle"),
      vars: [{ name: "list", value: `[${result.join(", ")}]`, tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i + 1 < result.length; i += 2) {
    const tmp = result[i];
    result[i] = result[i + 1];
    result[i + 1] = tmp;
    pushStep(10, `swap (${i},${i + 1})`, "ok", `Rewire pair (${i},${i + 1}) → [${result.join(", ")}].`);
  }

  done = true;
  steps.push({ line: 18, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Swapped list = [${result.join(", ")}].`, done });
  return steps;
}

// ── Copy List with Random Pointer ──────────────────────────────────────
// Two DISTINCT approaches. Values + random indices.

// Approach 1: Hash Map (Two Pass).
// Source (lines):
// 0: function copyRandomList(head) {
// 1:     if (!head) return null;
// 2:
// 3:     // Pass 1: create copy nodes and build the mapping
// 4:     var map = new Map();
// 5:     var current = head;
// 6:     while (current) {
// 7:         map.set(current, new _Node(current.val));
// 8:         current = current.next;
// 9:     }
// 10:
// 11:    // Pass 2: wire up next and random pointers
// 12:    current = head;
// 13:    while (current) {
// 14:        map.get(current).next = map.get(current.next) || null;
// 15:        map.get(current).random = map.get(current.random) || null;
// 16:        current = current.next;
// 17:    }
// 18:
// 19:    return map.get(head);
// 20: }
export function copyRandomListMapTrace(vals: number[], randoms: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, (i) => (i === idx ? "i" : "idle")),
      vars: [
        { name: "idx", value: idx >= 0 ? String(idx) : "—", tone: "info" },
        { name: "random", value: `[${randoms.join(", ")}]`, tone: "info" },
        { name: "list", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < result.length; i++) {
    pushStep(7, i, `copy node ${i}`, "info", `Pass 1: create copy of node ${i} (val ${result[i]}).`);
  }
  for (let i = 0; i < result.length; i++) {
    pushStep(14, i, `wire next/random`, "info", `Pass 2: wire copy ${i} next → ${i + 1 < result.length ? i + 1 : "null"}, random → ${randoms[i]}.`);
  }

  done = true;
  steps.push({ line: 19, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Deep copy created with next and random pointers.`, done });
  return steps;
}

// Approach 2: Interleaving Nodes (O(1) Space).
// Source (lines):
// 0: function copyRandomList(head) {
// 1:     if (!head) return null;
// 2:
// 3:     // Pass 1: interleave copy nodes after each original
// 4:     var current = head;
// 5:     while (current) {
// 6:         var copy = new _Node(current.val);
// 7:         copy.next = current.next;
// 8:         current.next = copy;
// 9:         current = copy.next;
// 10:    }
// 11:
// 12:    // Pass 2: set random pointers for copy nodes
// 13:    current = head;
// 14:    while (current) {
// 15:        if (current.random) {
// 16:            current.next.random = current.random.next;
// 17:        }
// 18:        current = current.next.next;
// 19:    }
// 20:
// 21:    // Pass 3: separate the interleaved list into original and copy
// 22:    var copyHead = head.next;
// 23:    current = head;
// 24:    var copyCurrent = copyHead;
// 25:    while (current) {
// 26:        current.next = copyCurrent.next;
// 27:        current = current.next;
// 28:        if (current) {
// 29:            copyCurrent.next = current.next;
// 30:            copyCurrent = copyCurrent.next;
// 31:        } else {
// 32:            copyCurrent.next = null;
// 33:        }
// 34:    }
// 35:
// 36:    return copyHead;
// 37: }
export function copyRandomListInterleaveTrace(vals: number[], randoms: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, () => "idle"),
      vars: [{ name: "list", value: `[${result.join(", ")}]`, tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(5, `interleave`, "info", `Pass 1: interleave copy nodes after each original.`);
  pushStep(14, `set randoms`, "info", `Pass 2: set random pointers for copy nodes.`);
  pushStep(25, `separate`, "info", `Pass 3: separate interleaved list into original and copy.`);

  done = true;
  steps.push({ line: 36, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Deep copy created in O(1) space.`, done });
  return steps;
}

// ── Partition List ─────────────────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Collect into Array and Rebuild.
// Source (lines):
// 0: function partition(head, x) {
// 1:     // Collect values into two arrays based on partition value
// 2:     var less = [];
// 3:     var greater = [];
// 4:
// 5:     var current = head;
// 6:     while (current !== null) {
// 7:         if (current.val < x) {
// 8:             less.push(current.val);
// 9:         } else {
// 10:            greater.push(current.val);
// 11:        }
// 12:        current = current.next;
// 13:    }
// 14:
// 15:    // Build the result linked list
// 16:    var dummy = new ListNode(0);
// 17:    var tail = dummy;
// 18:
// 19:    var combined = less.concat(greater);
// 20:    for (var i = 0; i < combined.length; i++) {
// 21:        tail.next = new ListNode(combined[i]);
// 22:        tail = tail.next;
// 23:    }
// 24:
// 25:    return dummy.next;
// 26: }
export function partitionArrayTrace(vals: number[], x: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const less: number[] = [];
  const greater: number[] = [];

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(vals, (i) => (i === idx ? "i" : "idle")),
      vars: [
        { name: "idx", value: idx >= 0 ? String(idx) : "—", tone: "info" },
        { name: "x", value: String(x), tone: "info" },
        { name: "less", value: `[${less.join(", ")}]`, tone: "info" },
        { name: "greater", value: `[${greater.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < vals.length; i++) {
    if (vals[i] < x) {
      less.push(vals[i]);
      pushStep(7, i, `less += ${vals[i]}`, "ok", `Val ${vals[i]} < ${x} → add to less.`);
    } else {
      greater.push(vals[i]);
      pushStep(9, i, `greater += ${vals[i]}`, "info", `Val ${vals[i]} ≥ ${x} → add to greater.`);
    }
  }

  const result = [...less, ...greater];
  done = true;
  steps.push({ line: 25, cells: vals.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Partitioned list = [${result.join(", ")}].`, done });
  return steps;
}

// Approach 2: Two Dummy Lists (Optimal).
// Source (lines):
// 0: function partition(head, x) {
// 1:     // Two dummy heads for the less and greater chains
// 2:     var lessHead = new ListNode(0);
// 3:     var greaterHead = new ListNode(0);
// 4:     var lessTail = lessHead;
// 5:     var greaterTail = greaterHead;
// 6:
// 7:     // Distribute nodes into the two chains
// 8:     var current = head;
// 9:     while (current !== null) {
// 10:        if (current.val < x) {
// 11:            lessTail.next = current;
// 12:            lessTail = lessTail.next;
// 13:        } else {
// 14:            greaterTail.next = current;
// 15:            greaterTail = greaterTail.next;
// 16:        }
// 17:        current = current.next;
// 18:    }
// 19:
// 20:    // Connect the less chain to the greater chain
// 21:    lessTail.next = greaterHead.next;
// 22:    // Terminate the greater chain to prevent cycles
// 23:    greaterTail.next = null;
// 24:
// 25:    return lessHead.next;
// 26: }
export function partitionTwoDummyTrace(vals: number[], x: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const less: number[] = [];
  const greater: number[] = [];

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(vals, (i) => (i === idx ? "i" : "idle")),
      vars: [
        { name: "idx", value: idx >= 0 ? String(idx) : "—", tone: "info" },
        { name: "x", value: String(x), tone: "info" },
        { name: "less", value: `[${less.join(", ")}]`, tone: "info" },
        { name: "greater", value: `[${greater.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < vals.length; i++) {
    if (vals[i] < x) {
      less.push(vals[i]);
      pushStep(10, i, `less chain += ${vals[i]}`, "ok", `Val ${vals[i]} < ${x} → append to less chain.`);
    } else {
      greater.push(vals[i]);
      pushStep(13, i, `greater chain += ${vals[i]}`, "info", `Val ${vals[i]} ≥ ${x} → append to greater chain.`);
    }
  }

  const result = [...less, ...greater];
  done = true;
  steps.push({ line: 25, cells: vals.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Partitioned list = [${result.join(", ")}].`, done });
  return steps;
}

// ── Rotate List ───────────────────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Brute Force (Rotate One at a Time).
// Source (lines):
// 0: function rotateRight(head, k) {
// 1:     if (!head || !head.next || k === 0) return head;
// 2:
// 3:     // Count the length
// 4:     var n = 0;
// 5:     var temp = head;
// 6:     while (temp) {
// 7:         n++;
// 8:         temp = temp.next;
// 9:     }
// 10:
// 11:    k = k % n;
// 12:    if (k === 0) return head;
// 13:
// 14:    // Rotate one at a time, k times
// 15:    for (var i = 0; i < k; i++) {
// 16:        var prev = null;
// 17:        var curr = head;
// 18:        while (curr.next) {
// 19:            prev = curr;
// 20:            curr = curr.next;
// 21:        }
// 22:        // curr is the last node, prev is second-to-last
// 23:        prev.next = null;
// 24:        curr.next = head;
// 25:        head = curr;
// 26:    }
// 27:
// 28:    return head;
// 29: }
export function rotateListBruteTrace(vals: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];
  const n = result.length;
  const effK = n === 0 ? 0 : k % n;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, () => "idle"),
      vars: [
        { name: "k", value: String(k), tone: "info" },
        { name: "n", value: String(n), tone: "info" },
        { name: "list", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(4, `n = ${n}`, "info", `Count length = ${n}.`);
  pushStep(11, `k = ${effK}`, "info", `Effective rotation = ${k} % ${n} = ${effK}.`);

  for (let i = 0; i < effK; i++) {
    const last = result.pop()!;
    result.unshift(last);
    pushStep(15, `rotate → [${result.join(", ")}]`, "ok", `Rotate right by 1 → [${result.join(", ")}].`);
  }

  done = true;
  steps.push({ line: 28, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Rotated list = [${result.join(", ")}].`, done });
  return steps;
}

// Approach 2: Find Split Point (Optimal).
// Source (lines):
// 0: function rotateRight(head, k) {
// 1:     if (!head || !head.next || k === 0) return head;
// 2:
// 3:     // Find the length and the tail
// 4:     var n = 1;
// 5:     var tail = head;
// 6:     while (tail.next) {
// 7:         n++;
// 8:         tail = tail.next;
// 9:     }
// 10:
// 11:    // Compute effective rotation
// 12:    k = k % n;
// 13:    if (k === 0) return head;
// 14:
// 15:    // Form a circular list
// 16:    tail.next = head;
// 17:
// 18:    // Walk to the new tail: (n - k - 1) steps from head
// 19:    var newTail = head;
// 20:    for (var i = 0; i < n - k - 1; i++) {
// 21:        newTail = newTail.next;
// 22:    }
// 23:
// 24:    // Break the circle
// 25:    var newHead = newTail.next;
// 26:    newTail.next = null;
// 27:
// 28:    return newHead;
// 29: }
export function rotateListSplitTrace(vals: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];
  const n = result.length;
  const effK = n === 0 ? 0 : k % n;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, () => "idle"),
      vars: [
        { name: "k", value: String(k), tone: "info" },
        { name: "n", value: String(n), tone: "info" },
        { name: "list", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(4, `n = ${n}`, "info", `Find length and tail.`);
  pushStep(12, `k = ${effK}`, "info", `Effective rotation = ${effK}.`);
  pushStep(16, `form circle`, "info", `Form a circular list.`);

  const split = n - effK;
  const rotated = [...result.slice(split), ...result.slice(0, split)];
  pushStep(25, `break at ${split}`, "ok", `New head at index ${split} → [${rotated.join(", ")}].`);

  done = true;
  steps.push({ line: 28, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${rotated.join(", ")}]`, tone: "ok" }], result: `[${rotated.join(", ")}]`, resultTone: "ok", explanation: `Rotated list = [${rotated.join(", ")}].`, done });
  return steps;
}

// ── Add Two Numbers ────────────────────────────────────────────────────
// Two DISTINCT approaches. l1 and l2 as value arrays.

// Approach 1: Iterative with Carry.
// Source (lines):
// 0: function addTwoNumbers(l1, l2) {
// 1:     var dummy = new ListNode(0);
// 2:     var current = dummy;
// 3:     var carry = 0;
// 4:
// 5:     while (l1 !== null || l2 !== null || carry !== 0) {
// 6:         var val1 = l1 !== null ? l1.val : 0;
// 7:         var val2 = l2 !== null ? l2.val : 0;
// 8:         var sum = val1 + val2 + carry;
// 9:
// 10:        carry = Math.floor(sum / 10);
// 11:        current.next = new ListNode(sum % 10);
// 12:        current = current.next;
// 13:
// 14:        if (l1 !== null) l1 = l1.next;
// 15:        if (l2 !== null) l2 = l2.next;
// 16:    }
// 17:
// 18:    return dummy.next;
// 19: }
export function addTwoNumbersIterativeTrace(l1: number[], l2: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [];
  let carry = 0;
  const maxLen = Math.max(l1.length, l2.length);

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(l1, (i) => (i === idx ? "i" : "idle")),
      vars: [
        { name: "idx", value: idx >= 0 ? String(idx) : "—", tone: "info" },
        { name: "carry", value: String(carry), tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < maxLen || carry !== 0; i++) {
    const val1 = i < l1.length ? l1[i] : 0;
    const val2 = i < l2.length ? l2[i] : 0;
    const sum = val1 + val2 + carry;
    carry = Math.floor(sum / 10);
    result.push(sum % 10);
    pushStep(8, i, `sum = ${sum} → digit ${sum % 10}`, "ok", `l1[${i}]=${val1}, l2[${i}]=${val2}, carry=${carry} → digit ${sum % 10}.`);
  }

  done = true;
  steps.push({ line: 18, cells: l1.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Sum list = [${result.join(", ")}].`, done });
  return steps;
}

// Approach 2: Recursive.
// Source (lines):
// 0: function addTwoNumbers(l1, l2) {
// 1:     return addWithCarry(l1, l2, 0);
// 2: };
// 3: function addWithCarry(l1, l2, carry) {
// 4:     // Base case: both lists done and no carry
// 5:     if (l1 === null && l2 === null && carry === 0) {
// 6:         return null;
// 7:     }
// 8:
// 9:     var sum = carry;
// 10:    if (l1 !== null) sum += l1.val;
// 11:    if (l2 !== null) sum += l2.val;
// 12:
// 13:    var node = new ListNode(sum % 10);
// 14:    node.next = addWithCarry(
// 15:        l1 !== null ? l1.next : null,
// 16:        l2 !== null ? l2.next : null,
// 17:        Math.floor(sum / 10)
// 18:    );
// 19:
// 20:    return node;
// 21: }
export function addTwoNumbersRecursiveTrace(l1: number[], l2: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [];
  const maxLen = Math.max(l1.length, l2.length);

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(l1, (i) => (i === idx ? "i" : "idle")),
      vars: [
        { name: "idx", value: idx >= 0 ? String(idx) : "—", tone: "info" },
        { name: "result", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  let carry = 0;
  for (let i = 0; i < maxLen || carry !== 0; i++) {
    const val1 = i < l1.length ? l1[i] : 0;
    const val2 = i < l2.length ? l2[i] : 0;
    const sum = val1 + val2 + carry;
    carry = Math.floor(sum / 10);
    result.push(sum % 10);
    pushStep(13, i, `recurse → digit ${sum % 10}`, "ok", `Recursive call at index ${i}: sum = ${sum} → digit ${sum % 10}.`);
  }

  done = true;
  steps.push({ line: 20, cells: l1.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Sum list = [${result.join(", ")}].`, done });
  return steps;
}

// ── Flatten a Multilevel Doubly Linked List ────────────────────────────
// Two DISTINCT approaches. Values with child markers.

// Approach 1: DFS with Stack.
// Source (lines):
// 0: function flatten(head) {
// 1:     if (!head) return null;
// 2:
// 3:     // Use a stack to simulate DFS
// 4:     var stack = [head];
// 5:     var prev = new Node(0); // dummy previous node
// 6:
// 7:     while (stack.length > 0) {
// 8:         var curr = stack.pop();
// 9:
// 10:        // Link current node to previous
// 11:        prev.next = curr;
// 12:        curr.prev = prev;
// 13:
// 14:        // Push next first (processed later), then child (processed sooner)
// 15:        if (curr.next) {
// 16:            stack.push(curr.next);
// 17:        }
// 18:        if (curr.child) {
// 19:            stack.push(curr.child);
// 20:            curr.child = null; // clear the child pointer
// 21:        }
// 22:
// 23:        prev = curr;
// 24:    }
// 25:
// 26:    // Detach the dummy node
// 27:    head.prev = null;
// 28:    return head;
// 29: }
export function flattenDFSStackTrace(vals: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, () => "idle"),
      vars: [{ name: "list", value: `[${result.join(", ")}]`, tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(7, `DFS flatten`, "info", `Use a stack to flatten the multilevel list depth-first.`);

  done = true;
  steps.push({ line: 28, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Flattened list = [${result.join(", ")}].`, done });
  return steps;
}

// Approach 2: Iterative In-Place (Optimal).
// Source (lines):
// 0: function flatten(head) {
// 1:     var curr = head;
// 2:
// 3:     while (curr !== null) {
// 4:         if (curr.child !== null) {
// 5:             var next = curr.next; // save the current next
// 6:
// 7:             // Find the tail of the child chain
// 8:             var tail = curr.child;
// 9:             while (tail.next !== null) {
// 10:                tail = tail.next;
// 11:            }
// 12:
// 13:            // Splice child chain between curr and next
// 14:            curr.next = curr.child;
// 15:            curr.child.prev = curr;
// 16:            tail.next = next;
// 17:            if (next !== null) {
// 18:                next.prev = tail;
// 19:            }
// 20:
// 21:            // Clear the child pointer
// 22:            curr.child = null;
// 23:        }
// 24:        curr = curr.next;
// 25:    }
// 26:
// 27:    return head;
// 28: }
export function flattenIterativeTrace(vals: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, () => "idle"),
      vars: [{ name: "list", value: `[${result.join(", ")}]`, tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(3, `splice children`, "info", `Iteratively splice each child chain into the main list.`);

  done = true;
  steps.push({ line: 27, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `Flattened list = [${result.join(", ")}].`, done });
  return steps;
}

// ── Palindrome Linked List ─────────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Copy to Array.
// Source (lines):
// 0: var isPalindrome = function(head) {
// 1:     // Copy values into an array
// 2:     var vals = [];
// 3:     var curr = head;
// 4:     while (curr !== null) {
// 5:         vals.push(curr.val);
// 6:         curr = curr.next;
// 7:     }
// 8:
// 9:     // Two-pointer palindrome check
// 10:    var left = 0;
// 11:    var right = vals.length - 1;
// 12:    while (left < right) {
// 13:        if (vals[left] !== vals[right]) {
// 14:            return false;
// 15:        }
// 16:        left++;
// 17:        right--;
// 18:    }
// 19:    return true;
// 20: };
export function palindromeArrayTrace(vals: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const arr = [...vals];

  const pushStep = (
    line: number,
    left: number,
    right: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(arr, (i) => (i === left ? "i" : i === right ? "j" : "idle")),
      vars: [
        { name: "left", value: left >= 0 ? String(left) : "—", tone: "info" },
        { name: "right", value: right >= 0 ? String(right) : "—", tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  let left = 0, right = arr.length - 1;
  while (left < right) {
    if (arr[left] !== arr[right]) {
      pushStep(13, left, right, "not palindrome", "fail", `vals[${left}] = ${arr[left]} ≠ vals[${right}] = ${arr[right]} → return false.`);
      done = true;
      steps.push({ line: 14, cells: arr.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Not a palindrome → return false.`, done });
      return steps;
    }
    pushStep(13, left, right, "match", "ok", `vals[${left}] = vals[${right}] = ${arr[left]}.`);
    left++;
    right--;
  }

  done = true;
  steps.push({ line: 19, cells: arr.map(() => "idle"), vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `All pairs match → palindrome.`, done });
  return steps;
}

// Approach 2: Reverse Second Half (Optimal).
// Source (lines):
// 0: var isPalindrome = function(head) {
// 1:     if (head === null || head.next === null) {
// 2:         return true;
// 3:     }
// 4:
// 5:     // Step 1: Find the middle using slow/fast pointers
// 6:     var slow = head;
// 7:     var fast = head;
// 8:     while (fast !== null && fast.next !== null) {
// 9:         slow = slow.next;
// 10:        fast = fast.next.next;
// 11:    }
// 12:
// 13:    // Step 2: Reverse the second half
// 14:    var prev = null;
// 15:    var curr = slow;
// 16:    while (curr !== null) {
// 17:        var next = curr.next;
// 18:        curr.next = prev;
// 19:        prev = curr;
// 20:        curr = next;
// 21:    }
// 22:
// 23:    // Step 3: Compare both halves
// 24:    var left = head;
// 25:    var right = prev;
// 26:    while (right !== null) {
// 27:        if (left.val !== right.val) {
// 28:            return false;
// 29:        }
// 30:        left = left.next;
// 31:        right = right.next;
// 32:    }
// 33:    return true;
// 34: };
export function palindromeReverseHalfTrace(vals: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const arr = [...vals];
  const n = arr.length;

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(arr, () => "idle"),
      vars: [{ name: "list", value: `[${arr.join(", ")}]`, tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (n <= 1) {
    done = true;
    steps.push({ line: 2, cells: arr.map(() => "idle"), vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `Empty or single node → palindrome.`, done });
    return steps;
  }

  const mid = Math.floor(n / 2);
  pushStep(8, `middle at ${mid}`, "info", `Slow/fast finds middle at index ${mid}.`);

  const secondHalf = arr.slice(mid).reverse();
  pushStep(16, `reverse second half`, "info", `Reverse second half → [${secondHalf.join(", ")}].`);

  for (let i = 0; i < secondHalf.length; i++) {
    if (arr[i] !== secondHalf[i]) {
      pushStep(27, "not palindrome", "fail", `First half ${arr[i]} ≠ reversed second ${secondHalf[i]} → return false.`);
      done = true;
      steps.push({ line: 28, cells: arr.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Not a palindrome → return false.`, done });
      return steps;
    }
    pushStep(27, "match", "ok", `Compare ${arr[i]} vs ${secondHalf[i]} → match.`);
  }

  done = true;
  steps.push({ line: 33, cells: arr.map(() => "idle"), vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `Both halves match → palindrome.`, done });
  return steps;
}

// ── Reverse Linked List ─────────────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Iterative (Three Pointers).
// Source (lines):
// 0: function reverseList(head) {
// 1:     let prev = null;
// 2:     let curr = head;
// 3:
// 4:     while (curr !== null) {
// 5:         let next = curr.next;
// 6:         curr.next = prev;
// 7:         prev = curr;
// 8:         curr = next;
// 9:     }
// 10:
// 11:    return prev;
// 12: }
export function reverseListIterativeTrace(vals: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, (i) => (i === idx ? "i" : "idle")),
      vars: [
        { name: "idx", value: idx >= 0 ? String(idx) : "—", tone: "info" },
        { name: "list", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = result.length - 1; i >= 0; i--) {
    pushStep(6, i, `reverse node ${result[i]}`, "ok", `Point node ${result[i]} to previous → [${result.join(", ")}].`);
  }

  const reversed = [...result].reverse();
  done = true;
  steps.push({ line: 11, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${reversed.join(", ")}]`, tone: "ok" }], result: `[${reversed.join(", ")}]`, resultTone: "ok", explanation: `Reversed list = [${reversed.join(", ")}].`, done });
  return steps;
}

// Approach 2: Recursive.
// Source (lines):
// 0: var reverseList = function(head) {
// 1:     // Base case: empty list or single node
// 2:     if (head === null || head.next === null) {
// 3:         return head;
// 4:     }
// 5:
// 6:     // Reverse the rest of the list
// 7:     var newHead = reverseList(head.next);
// 8:
// 9:     // Fix the pointers
// 10:    head.next.next = head; // Next node points back to current
// 11:    head.next = null;      // Current node becomes tail
// 12:
// 13:    return newHead;
// 14: };
export function reverseListRecursiveTrace(vals: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, () => "idle"),
      vars: [{ name: "list", value: `[${result.join(", ")}]`, tone: "info" }],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = result.length - 1; i >= 0; i--) {
    pushStep(7, `recurse on node ${result[i]}`, "info", `Recursively reverse from node ${result[i]}.`);
  }

  const reversed = [...result].reverse();
  done = true;
  steps.push({ line: 13, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${reversed.join(", ")}]`, tone: "ok" }], result: `[${reversed.join(", ")}]`, resultTone: "ok", explanation: `Reversed list = [${reversed.join(", ")}].`, done });
  return steps;
}

// ── Reverse Linked List II ─────────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Extract, Reverse, and Reinsert.
// Source (lines):
// 0: var reverseBetween = function(head, left, right) {
// 1:     // Collect values from position left to right
// 2:     var values = [];
// 3:     var curr = head;
// 4:     var pos = 1;
// 5:     while (curr) {
// 6:         if (pos >= left && pos <= right) {
// 7:             values.push(curr.val);
// 8:         }
// 9:         curr = curr.next;
// 10:        pos++;
// 11:    }
// 12:
// 13:    // Reverse the collected values
// 14:    values.reverse();
// 15:
// 16:    // Write reversed values back into the list
// 17:    curr = head;
// 18:    pos = 1;
// 19:    var idx = 0;
// 20:    while (curr) {
// 21:        if (pos >= left && pos <= right) {
// 22:            curr.val = values[idx];
// 23:            idx++;
// 24:        }
// 25:        curr = curr.next;
// 26:        pos++;
// 27:    }
// 28:
// 29:    return head;
// 30: };
export function reverseBetweenExtractTrace(vals: number[], left: number, right: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, () => "idle"),
      vars: [
        { name: "left", value: String(left), tone: "info" },
        { name: "right", value: String(right), tone: "info" },
        { name: "list", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  const sub = result.slice(left - 1, right).reverse();
  pushStep(14, `extract & reverse [${sub.join(", ")}]`, "info", `Extract positions ${left}..${right} and reverse.`);

  for (let i = 0; i < sub.length; i++) {
    result[left - 1 + i] = sub[i];
  }
  pushStep(22, `write back → [${result.join(", ")}]`, "ok", `Write reversed values back into the list.`);

  done = true;
  steps.push({ line: 29, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `List with positions ${left}..${right} reversed = [${result.join(", ")}].`, done });
  return steps;
}

// Approach 2: In-Place Reversal with Pointer Manipulation.
// Source (lines):
// 0: var reverseBetween = function(head, left, right) {
// 1:     var dummy = new ListNode(0, head);
// 2:     var prev = dummy;
// 3:
// 4:     // Move prev to the node just before position left
// 5:     for (var i = 0; i < left - 1; i++) {
// 6:         prev = prev.next;
// 7:     }
// 8:
// 9:     var curr = prev.next; // First node in the reversal range
// 10:
// 11:    // Reverse by moving each next node to the front of the reversed section
// 12:    for (var i = 0; i < right - left; i++) {
// 13:        var nextNode = curr.next;
// 14:        curr.next = nextNode.next;
// 15:        nextNode.next = prev.next;
// 16:        prev.next = nextNode;
// 17:    }
// 18:
// 19:    return dummy.next;
// 20: };
export function reverseBetweenInPlaceTrace(vals: number[], left: number, right: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, () => "idle"),
      vars: [
        { name: "left", value: String(left), tone: "info" },
        { name: "right", value: String(right), tone: "info" },
        { name: "list", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  const sub = result.slice(left - 1, right).reverse();
  for (let i = 0; i < sub.length; i++) {
    result[left - 1 + i] = sub[i];
    pushStep(13, `move node ${sub[i]} to front`, "ok", `In-place reversal step → [${result.join(", ")}].`);
  }

  done = true;
  steps.push({ line: 19, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `List with positions ${left}..${right} reversed = [${result.join(", ")}].`, done });
  return steps;
}

// ── Reverse Nodes in k-Group ───────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Extract to Array and Rebuild.
// Source (lines):
// 0: var reverseKGroup = function(head, k) {
// 1:     // Collect values into array
// 2:     var values = [];
// 3:     var curr = head;
// 4:     while (curr) {
// 5:         values.push(curr.val);
// 6:         curr = curr.next;
// 7:     }
// 8:
// 9:     var n = values.length;
// 10:
// 11:    // Reverse each complete group of k
// 12:    for (var start = 0; start + k <= n; start += k) {
// 13:        var left = start;
// 14:        var right = start + k - 1;
// 15:        while (left < right) {
// 16:            var temp = values[left];
// 17:            values[left] = values[right];
// 18:            values[right] = temp;
// 19:            left++;
// 20:            right--;
// 21:        }
// 22:    }
// 23:
// 24:    // Write values back to linked list
// 25:    curr = head;
// 26:    for (var i = 0; i < values.length; i++) {
// 27:        curr.val = values[i];
// 28:        curr = curr.next;
// 29:    }
// 30:
// 31:    return head;
// 32: };
export function reverseKGroupArrayTrace(vals: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, () => "idle"),
      vars: [
        { name: "k", value: String(k), tone: "info" },
        { name: "list", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let start = 0; start + k <= result.length; start += k) {
    const group = result.slice(start, start + k).reverse();
    for (let i = 0; i < k; i++) result[start + i] = group[i];
    pushStep(12, `reverse group [${group.join(", ")}]`, "ok", `Reverse group starting at ${start} → [${result.join(", ")}].`);
  }

  done = true;
  steps.push({ line: 31, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `List with each k-group reversed = [${result.join(", ")}].`, done });
  return steps;
}

// Approach 2: Iterative In-Place Reversal.
// Source (lines):
// 0: var reverseKGroup = function(head, k) {
// 1:     var dummy = new ListNode(0);
// 2:     dummy.next = head;
// 3:     var groupPrev = dummy;
// 4:
// 5:     while (true) {
// 6:         // Check if k nodes remain
// 7:         var kthNode = getKthNode(groupPrev, k);
// 8:         if (!kthNode) break;
// 9:
// 10:        var groupNext = kthNode.next;
// 11:
// 12:        // Reverse k nodes starting from groupPrev.next
// 13:        var prev = groupNext;
// 14:        var curr = groupPrev.next;
// 15:        for (var i = 0; i < k; i++) {
// 16:            var next = curr.next;
// 17:            curr.next = prev;
// 18:            prev = curr;
// 19:            curr = next;
// 20:        }
// 21:
// 22:        // Reconnect
// 23:        var groupHead = groupPrev.next;
// 24:        groupPrev.next = kthNode;
// 25:        groupPrev = groupHead;
// 26:    }
// 27:
// 28:    return dummy.next;
// 29: };
// 30: function getKthNode(node, k) {
// 31:    while (node && k > 0) {
// 32:        node = node.next;
// 33:        k--;
// 34:    }
// 35:    return node;
// 36: }
export function reverseKGroupInPlaceTrace(vals: number[], k: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const result: number[] = [...vals];

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(result, () => "idle"),
      vars: [
        { name: "k", value: String(k), tone: "info" },
        { name: "list", value: `[${result.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let start = 0; start + k <= result.length; start += k) {
    const group = result.slice(start, start + k).reverse();
    for (let i = 0; i < k; i++) result[start + i] = group[i];
    pushStep(15, `reverse group [${group.join(", ")}]`, "ok", `In-place reverse group at ${start} → [${result.join(", ")}].`);
  }

  done = true;
  steps.push({ line: 28, cells: result.map(() => "idle"), vars: [{ name: "result", value: `[${result.join(", ")}]`, tone: "ok" }], result: `[${result.join(", ")}]`, resultTone: "ok", explanation: `List with each k-group reversed = [${result.join(", ")}].`, done });
  return steps;
}

// ── Middle of the Linked List ───────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Convert to Array.
// Source (lines):
// 0: var middleNode = function(head) {
// 1:     var nodes = [];
// 2:     var current = head;
// 3:
// 4:     // Collect all nodes into an array
// 5:     while (current) {
// 6:         nodes.push(current);
// 7:         current = current.next;
// 8:     }
// 9:
// 10:    // Return the middle node
// 11:    return nodes[Math.floor(nodes.length / 2)];
// 12: };
export function middleNodeArrayTrace(vals: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const arr = [...vals];
  const mid = Math.floor(arr.length / 2);

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(arr, (i) => (i === idx ? "i" : "idle")),
      vars: [
        { name: "idx", value: idx >= 0 ? String(idx) : "—", tone: "info" },
        { name: "nodes", value: `[${arr.join(", ")}]`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  for (let i = 0; i < arr.length; i++) {
    pushStep(6, i, `collect node ${arr[i]}`, "info", `Collect node ${i} (val ${arr[i]}).`);
  }

  done = true;
  steps.push({ line: 11, cells: arr.map(() => "idle"), vars: [{ name: "result", value: `node ${mid} (val ${arr[mid]})`, tone: "ok" }], result: `node ${mid}`, resultTone: "ok", explanation: `Middle node = ${arr[mid]} at index ${mid}.`, done });
  return steps;
}

// Approach 2: Two-Pass (Count then Traverse).
// Source (lines):
// 0: var middleNode = function(head) {
// 1:     // First pass: count the nodes
// 2:     var count = 0;
// 3:     var current = head;
// 4:     while (current) {
// 5:         count++;
// 6:         current = current.next;
// 7:     }
// 8:
// 9:     // Second pass: walk to the middle
// 10:    current = head;
// 11:    for (var i = 0; i < Math.floor(count / 2); i++) {
// 12:        current = current.next;
// 13:    }
// 14:
// 15:    return current;
// 16: };
export function middleNodeTwoPassTrace(vals: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const arr = [...vals];
  const count = arr.length;
  const mid = Math.floor(count / 2);

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(arr, (i) => (i === idx ? "i" : "idle")),
      vars: [
        { name: "idx", value: idx >= 0 ? String(idx) : "—", tone: "info" },
        { name: "count", value: String(count), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  pushStep(2, -1, `count = ${count}`, "info", `First pass counts ${count} nodes.`);

  for (let i = 0; i < mid; i++) {
    pushStep(11, i, `walk to ${i}`, "info", `Second pass: advance to node ${i}.`);
  }

  done = true;
  steps.push({ line: 15, cells: arr.map(() => "idle"), vars: [{ name: "result", value: `node ${mid} (val ${arr[mid]})`, tone: "ok" }], result: `node ${mid}`, resultTone: "ok", explanation: `Middle node = ${arr[mid]} at index ${mid}.`, done });
  return steps;
}

// ── Happy Number ───────────────────────────────────────────────────────
// Two DISTINCT approaches. n as single-value array.

// Approach 1: Hash Set.
// Source (lines):
// 0: var isHappy = function(n) {
// 1:     var seen = new Set();
// 2:
// 3:     while (n !== 1 && !seen.has(n)) {
// 4:         seen.add(n);
// 5:         n = getNext(n);
// 6:     }
// 7:
// 8:     return n === 1;
// 9: };
// 10: function getNext(n) {
// 11:    var sum = 0;
// 12:    while (n > 0) {
// 13:        var digit = n % 10;
// 14:        sum += digit * digit;
// 15:        n = Math.floor(n / 10);
// 16:    }
// 17:    return sum;
// 18: }
export function happyNumberSetTrace(vals: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  let n = vals[0] ?? 19;
  const seen = new Set<number>();

  const getNext = (x: number) => {
    let sum = 0;
    while (x > 0) {
      const digit = x % 10;
      sum += digit * digit;
      x = Math.floor(x / 10);
    }
    return sum;
  };

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(vals, () => "idle"),
      vars: [
        { name: "n", value: String(n), tone: "info" },
        { name: "seen", value: `{${Array.from(seen).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    const next = getNext(n);
    pushStep(3, `n → ${next}`, "info", `Add ${n} to seen; next = ${next}.`);
    n = next;
  }

  if (n === 1) {
    done = true;
    steps.push({ line: 8, cells: vals.map(() => "idle"), vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `Reached 1 → happy number.`, done });
  } else {
    done = true;
    steps.push({ line: 8, cells: vals.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Cycle detected → not a happy number.`, done });
  }
  return steps;
}

// Approach 2: Floyd's Cycle Detection (Two Pointers).
// Source (lines):
// 0: var isHappy = function(n) {
// 1:     var slow = n;
// 2:     var fast = getNext(n);
// 3:
// 4:     // Fast moves two steps, slow moves one step
// 5:     while (fast !== 1 && slow !== fast) {
// 6:         slow = getNext(slow);
// 7:         fast = getNext(getNext(fast));
// 8:     }
// 9:
// 10:    return fast === 1;
// 11: };
// 12: function getNext(n) {
// 13:    var sum = 0;
// 14:    while (n > 0) {
// 15:        var digit = n % 10;
// 16:        sum += digit * digit;
// 17:        n = Math.floor(n / 10);
// 18:    }
// 19:    return sum;
// 20: }
export function happyNumberFloydTrace(vals: number[]): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const start = vals[0] ?? 19;

  const getNext = (x: number) => {
    let sum = 0;
    while (x > 0) {
      const digit = x % 10;
      sum += digit * digit;
      x = Math.floor(x / 10);
    }
    return sum;
  };

  let slow = start;
  let fast = getNext(start);

  const pushStep = (
    line: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(vals, () => "idle"),
      vars: [
        { name: "slow", value: String(slow), tone: "info" },
        { name: "fast", value: String(fast), tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  while (fast !== 1 && slow !== fast) {
    slow = getNext(slow);
    fast = getNext(getNext(fast));
    pushStep(5, `slow=${slow} fast=${fast}`, "info", `Advance slow one step, fast two steps.`);
  }

  if (fast === 1) {
    done = true;
    steps.push({ line: 10, cells: vals.map(() => "idle"), vars: [{ name: "result", value: "true", tone: "ok" }], result: "return true", resultTone: "ok", explanation: `Fast reached 1 → happy number.`, done });
  } else {
    done = true;
    steps.push({ line: 10, cells: vals.map(() => "idle"), vars: [{ name: "result", value: "false", tone: "fail" }], result: "return false", resultTone: "fail", explanation: `Slow met fast → cycle → not happy.`, done });
  }
  return steps;
}

// ── Linked List Cycle II ───────────────────────────────────────────────
// Two DISTINCT approaches.

// Approach 1: Hash Set.
// Source (lines):
// 0: var detectCycle = function(head) {
// 1:     var seen = new Set();
// 2:
// 3:     var current = head;
// 4:     while (current !== null) {
// 5:         // If we've seen this node before, it's the cycle start
// 6:         if (seen.has(current)) {
// 7:             return current;
// 8:         }
// 9:         seen.add(current);
// 10:        current = current.next;
// 11:    }
// 12:
// 13:    // No cycle found
// 14:    return null;
// 15: };
export function detectCycleSetTrace(vals: number[], cycleStart: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const arr = [...vals];

  const pushStep = (
    line: number,
    idx: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(arr, (i) => (i === idx ? "i" : "idle")),
      vars: [
        { name: "idx", value: idx >= 0 ? String(idx) : "—", tone: "info" },
        { name: "seen", value: `{${Array.from({ length: idx + 1 }, (_, i) => i).join(", ")}}`, tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (cycleStart >= 0) {
    for (let i = 0; i < arr.length; i++) {
      if (i === cycleStart) {
        pushStep(6, i, "cycle start!", "ok", `Node ${i} (val ${arr[i]}) already seen → cycle starts here.`);
        done = true;
        steps.push({ line: 7, cells: arr.map(() => "idle"), vars: [{ name: "result", value: `node ${i} (val ${arr[i]})`, tone: "ok" }], result: `node ${i}`, resultTone: "ok", explanation: `Cycle start = node ${i} (val ${arr[i]}).`, done });
        return steps;
      }
      pushStep(9, i, `add node ${i}`, "info", `Add node ${i} (val ${arr[i]}) to seen.`);
    }
  }

  done = true;
  steps.push({ line: 14, cells: arr.map(() => "idle"), vars: [{ name: "result", value: "null", tone: "fail" }], result: "null", resultTone: "fail", explanation: `No cycle → return null.`, done });
  return steps;
}

// Approach 2: Floyd's Tortoise and Hare (Optimal).
// Source (lines):
// 0: var detectCycle = function(head) {
// 1:     var slow = head;
// 2:     var fast = head;
// 3:
// 4:     // Phase 1: Detect if a cycle exists
// 5:     while (fast !== null && fast.next !== null) {
// 6:         slow = slow.next;
// 7:         fast = fast.next.next;
// 8:
// 9:         if (slow === fast) {
// 10:            // Phase 2: Find the cycle start
// 11:            slow = head;
// 12:            while (slow !== fast) {
// 13:                slow = slow.next;
// 14:                fast = fast.next;
// 15:            }
// 16:            return slow;
// 17:        }
// 18:    }
// 19:
// 20:    // No cycle
// 21:    return null;
// 22: };
export function detectCycleFloydTrace(vals: number[], cycleStart: number): Trace {
  const steps: TraceStep[] = [];
  let done = false;
  const arr = [...vals];

  const pushStep = (
    line: number,
    slow: number,
    fast: number,
    resultStr: string,
    resultTone: "ok" | "fail" | "info",
    explanation: string
  ) => {
    steps.push({
      line,
      cells: cellsFor(arr, (i) => (i === slow ? "i" : i === fast ? "j" : "idle")),
      vars: [
        { name: "slow", value: slow >= 0 ? String(slow) : "—", tone: "info" },
        { name: "fast", value: fast >= 0 ? String(fast) : "—", tone: "info" },
      ],
      result: resultStr,
      resultTone,
      explanation,
      done,
    });
  };

  if (cycleStart >= 0) {
    let slow = 0, fast = 0;
    let guard = 0;
    while (guard < arr.length * 2) {
      slow = (slow + 1) % arr.length;
      fast = (fast + 2) % arr.length;
      guard++;
      if (slow === fast) {
        pushStep(9, slow, fast, "meet!", "ok", `Slow and fast meet at node ${slow}.`);
        let p1 = 0, p2 = slow;
        while (p1 !== p2) {
          p1 = (p1 + 1) % arr.length;
          p2 = (p2 + 1) % arr.length;
        }
        pushStep(12, p1, p2, "cycle start found", "ok", `Phase 2: cycle starts at node ${p1} (val ${arr[p1]}).`);
        done = true;
        steps.push({ line: 16, cells: arr.map(() => "idle"), vars: [{ name: "result", value: `node ${p1} (val ${arr[p1]})`, tone: "ok" }], result: `node ${p1}`, resultTone: "ok", explanation: `Cycle start = node ${p1} (val ${arr[p1]}).`, done });
        return steps;
      }
      pushStep(5, slow, fast, "advance", "info", `Advance slow to ${slow}, fast to ${fast}.`);
    }
  }

  done = true;
  steps.push({ line: 21, cells: arr.map(() => "idle"), vars: [{ name: "result", value: "null", tone: "fail" }], result: "null", resultTone: "fail", explanation: `No cycle → return null.`, done });
  return steps;
}

export const traceBuilders: Record<string, Record<string, TraceBuilder>> = {
  "max-consecutive-ones": {
    brute: (nums) => mcoBruteTrace(nums),
    single: (nums) => mcoSinglePassTrace(nums),
  },
  "third-maximum-number": {
    sort: (nums) => thirdMaxSortTrace(nums),
    track: (nums) => thirdMaxTrackTrace(nums),
  },
  "move-zeroes": {
    extraarray: (nums) => moveZeroesExtraArrayTrace(nums),
    swap: (nums) => moveZeroesSwapTrace(nums),
  },
  "shuffle-the-array": {
    interleave: (nums, n) => shuffleInterleaveTrace(nums, Number(n)),
    inplace: (nums, n) => shuffleInPlaceTrace(nums, Number(n)),
  },
  "majority-element": {
    hashmap: (nums) => majorityHashMapTrace(nums),
    sort: (nums) => majoritySortTrace(nums),
  },
  "remove-duplicates-from-sorted-array": {
    hashset: (nums) => removeDuplicatesHashSetTrace(nums),
    twopointer: (nums) => removeDuplicatesTwoPointerTrace(nums),
  },
  "remove-element": {
    extraarray: (nums, val) => removeElementExtraArrayTrace(nums, Number(val)),
    frontoverwrite: (nums, val) => removeElementFrontOverwriteTrace(nums, Number(val)),
  },
  "best-time-to-buy-and-sell-stock": {
    brute: (prices) => maxProfitBruteTrace(prices),
    onepass: (prices) => maxProfitOnePassTrace(prices),
  },
  "missing-ranges": {
    separate: (nums, lower, upper) => missingRangesSeparateTrace(nums, Number(lower), Number(upper)),
    unified: (nums, lower, upper) => missingRangesUnifiedTrace(nums, Number(lower), Number(upper)),
  },
  "majority-element-ii": {
    hashmap: (nums) => majority2HashMapTrace(nums),
    sort: (nums) => majority2SortTrace(nums),
  },
  "rotate-array": {
    brute: (nums, k) => rotateBruteTrace(nums, Number(k)),
    extraarray: (nums, k) => rotateExtraArrayTrace(nums, Number(k)),
  },
  "product-of-array-except-self": {
    brute: (nums) => productBruteTrace(nums),
    prefixsuffix: (nums) => productPrefixSuffixTrace(nums),
  },
  "remove-duplicates-from-sorted-array-ii": {
    count: (nums) => removeDuplicates2CountTrace(nums),
    twopos: (nums) => removeDuplicates2TwoPosTrace(nums),
  },
  "best-time-to-buy-and-sell-stock-ii": {
    brute: (prices) => maxProfit2BruteTrace(prices),
    dp: (prices) => maxProfit2DPTrace(prices),
  },
  "number-of-zero-filled-subarrays": {
    brute: (nums) => zeroFilledBruteTrace(nums),
    optimal: (nums) => zeroFilledOptimalTrace(nums),
  },
  "increasing-triplet-subsequence": {
    brute: (nums) => increasingTripletBruteTrace(nums),
    prefixsuffix: (nums) => increasingTripletPrefixSuffixTrace(nums),
  },
  "next-permutation": {
    brute: (nums) => nextPermutationBruteTrace(nums),
    optimal: (nums) => nextPermutationOptimalTrace(nums),
  },
  "first-missing-positive": {
    hashset: (nums) => firstMissingPositiveHashSetTrace(nums),
    sort: (nums) => firstMissingPositiveSortTrace(nums),
  },
  "reverse-string": {
    extraarray: (codes) => reverseStringExtraArrayTrace(codes),
    twopointer: (codes) => reverseStringTwoPointerTrace(codes),
  },
  "length-of-last-word": {
    split: (codes) => lengthOfLastWordSplitTrace(codes),
    end: (codes) => lengthOfLastWordEndTrace(codes),
  },
  "is-subsequence": {
    twopointer: (s, t) => isSubsequenceTwoPointerTrace(s, Array.isArray(t) ? t : [t]),
    binarysearch: (s, t) => isSubsequenceBinarySearchTrace(s, Array.isArray(t) ? t : [t]),
  },
  "valid-palindrome": {
    filter: (codes) => validPalindromeFilterTrace(codes),
    twopointer: (codes) => validPalindromeTwoPointerTrace(codes),
  },
  "valid-palindrome-ii": {
    brute: (codes) => validPalindromeIIBruteTrace(codes),
    greedy: (codes) => validPalindromeIIGreedyTrace(codes),
  },
  "valid-anagram": {
    sort: (s, t) => validAnagramSortTrace(s, Array.isArray(t) ? t : [t]),
    count: (s, t) => validAnagramCountTrace(s, Array.isArray(t) ? t : [t]),
  },
  "rotate-string": {
    brute: (s, g) => rotateStringBruteTrace(s, Array.isArray(g) ? g : [g]),
    concat: (s, g) => rotateStringConcatTrace(s, Array.isArray(g) ? g : [g]),
  },
  "longest-common-prefix": {
    vertical: (codes) => longestCommonPrefixVerticalTrace(codes),
    sort: (codes) => longestCommonPrefixSortTrace(codes),
  },
  "longest-palindrome": {
    greedy: (codes) => longestPalindromeGreedyTrace(codes),
    set: (codes) => longestPalindromeSetTrace(codes),
  },
  "find-the-index-of-the-first-occurrence-in-a-string": {
    brute: (h, n) => strStrBruteTrace(h, Array.isArray(n) ? n : [n]),
    rabinkarp: (h, n) => strStrRabinKarpTrace(h, Array.isArray(n) ? n : [n]),
  },
  "zigzag-conversion": {
    grid: (codes, numRows) => zigzagGridTrace(codes, Number(numRows)),
    rows: (codes, numRows) => zigzagRowsTrace(codes, Number(numRows)),
  },
  "reverse-words-in-a-string": {
    split: (codes) => reverseWordsSplitTrace(codes),
    twopointer: (codes) => reverseWordsTwoPointerTrace(codes),
  },
  "single-number": {
    brute: (nums) => singleNumberBruteTrace(nums),
    hashmap: (nums) => singleNumberHashMapTrace(nums),
  },
  "missing-number": {
    hashset: (nums) => missingNumberHashSetTrace(nums),
    gauss: (nums) => missingNumberGaussTrace(nums),
  },
  "set-mismatch": {
    sort: (nums) => setMismatchSortTrace(nums),
    hashmap: (nums) => setMismatchHashMapTrace(nums),
  },
  "power-of-two": {
    iterative: (nums) => powerOfTwoIterativeTrace(nums),
    bit: (nums) => powerOfTwoBitTrace(nums),
  },
  "number-of-1-bits": {
    bits: (nums) => hammingWeightBitsTrace(nums),
    kernighan: (nums) => hammingWeightKernighanTrace(nums),
  },
  "counting-bits": {
    brute: (nums) => countingBitsBruteTrace(nums),
    dp: (nums) => countingBitsDPTrace(nums),
  },
  "hamming-distance": {
    bits: (nums) => hammingDistanceBitsTrace(nums),
    kernighan: (nums) => hammingDistanceKernighanTrace(nums),
  },
  "reverse-bits": {
    bitwise: (nums) => reverseBitsBitwiseTrace(nums),
    lookup: (nums) => reverseBitsLookupTrace(nums),
  },
  "bitwise-and-of-numbers-range": {
    brute: (nums) => rangeBitwiseAndBruteTrace(nums),
    shift: (nums) => rangeBitwiseAndShiftTrace(nums),
  },
  "single-number-ii": {
    hashmap: (nums) => singleNumberIIHashMapTrace(nums),
    bitwise: (nums) => singleNumberIIBitwiseTrace(nums),
  },
  "single-number-iii": {
    hashmap: (nums) => singleNumberIIIHashMapTrace(nums),
    sort: (nums) => singleNumberIIISortTrace(nums),
  },
  "sum-of-two-integers": {
    increment: (nums) => getSumIncrementTrace(nums),
    bitwise: (nums) => getSumBitwiseTrace(nums),
  },
  "design-hashmap": {
    array: () => designHashMapArrayTrace(),
    chaining: () => designHashMapChainingTrace(),
  },
  "contains-duplicate": {
    brute: (nums) => containsDuplicateBruteTrace(nums),
    sort: (nums) => containsDuplicateSortTrace(nums),
  },
  "word-pattern": {
    twomap: (pattern, words) => wordPatternTwoMapTrace(pattern, Array.isArray(words) ? words : [words]),
    index: (pattern, words) => wordPatternIndexTrace(pattern, Array.isArray(words) ? words : [words]),
  },
  "first-unique-character-in-a-string": {
    brute: (codes) => firstUniqCharBruteTrace(codes),
    freq: (codes) => firstUniqCharFreqTrace(codes),
  },
  "find-all-numbers-disappeared-in-an-array": {
    hashset: (nums) => findDisappearedHashSetTrace(nums),
    negation: (nums) => findDisappearedNegationTrace(nums),
  },
  "maximum-number-of-balloons": {
    array: (codes) => maxBalloonsArrayTrace(codes),
    hashmap: (codes) => maxBalloonsHashMapTrace(codes),
  },
  "number-of-good-pairs": {
    brute: (nums) => numIdenticalPairsBruteTrace(nums),
    freq: (nums) => numIdenticalPairsFreqTrace(nums),
  },
  "isomorphic-strings": {
    brute: (s, t) => isIsomorphicBruteTrace(s, Array.isArray(t) ? t : [t]),
    twomap: (s, t) => isIsomorphicTwoMapTrace(s, Array.isArray(t) ? t : [t]),
  },
  "ransom-note": {
    brute: (r, m) => canConstructBruteTrace(r, Array.isArray(m) ? m : [m]),
    sort: (r, m) => canConstructSortTrace(r, Array.isArray(m) ? m : [m]),
  },
  "contains-duplicate-ii": {
    brute: (nums, k) => containsNearbyDuplicateBruteTrace(nums, Number(k)),
    map: (nums, k) => containsNearbyDuplicateMapTrace(nums, Number(k)),
  },
  "intersection-of-two-arrays-ii": {
    brute: (a, b) => intersectBruteTrace(a, Array.isArray(b) ? b : [b]),
    map: (a, b) => intersectMapTrace(a, Array.isArray(b) ? b : [b]),
  },
  "group-anagrams": {
    sort: (codes) => groupAnagramsSortTrace(codes),
    freq: (codes) => groupAnagramsFreqTrace(codes),
  },
  "encode-and-decode-tinyurl": {
    counter: () => tinyURLCounterTrace(),
    random: () => tinyURLRandomTrace(),
  },
  "reorganize-string": {
    sort: (codes) => reorganizeStringSortTrace(codes),
    heap: (codes) => reorganizeStringHeapTrace(codes),
  },
  "longest-consecutive-sequence": {
    brute: (nums) => longestConsecutiveBruteTrace(nums),
    sort: (nums) => longestConsecutiveSortTrace(nums),
  },
  "split-array-into-consecutive-subsequences": {
    list: (nums) => isPossibleListTrace(nums),
    greedy: (nums) => isPossibleGreedyTrace(nums),
  },
  "number-of-matching-subsequences": {
    brute: (s, w) => numMatchingSubseqBruteTrace(s, Array.isArray(w) ? w : [w]),
    buckets: (s, w) => numMatchingSubseqBucketsTrace(s, Array.isArray(w) ? w : [w]),
  },
  "number-of-good-ways-to-split-a-string": {
    brute: (codes) => numSplitsBruteTrace(codes),
    prefixsuffix: (codes) => numSplitsPrefixSuffixTrace(codes),
  },
  "merge-sorted-array": {
    sort: (nums1, m) => mergeSortAfterTrace(nums1, Number(m)),
    threepointers: (nums1, m) => mergeThreePointersTrace(nums1, Number(m)),
  },
  "merge-strings-alternately": {
    twopointer: (w1, w2) => mergeAlternatelyTwoPointerTrace(w1, Array.isArray(w2) ? w2 : [w2]),
    singleloop: (w1, w2) => mergeAlternatelySingleLoopTrace(w1, Array.isArray(w2) ? w2 : [w2]),
  },
  "squares-of-a-sorted-array": {
    sort: (nums) => sortedSquaresSortTrace(nums),
    twopointer: (nums) => sortedSquaresTwoPointerTrace(nums),
  },
  "two-sum": {
    brute: (nums, target) => twoSumBruteTrace(nums, Number(target)),
    map: (nums, target) => twoSumMapTrace(nums, Number(target)),
  },
  "backspace-string-compare": {
    stack: (s, t) => backspaceCompareStackTrace(s, Array.isArray(t) ? t : [t]),
    inplace: (s, t) => backspaceCompareInPlaceTrace(s, Array.isArray(t) ? t : [t]),
  },
  "valid-word-abbreviation": {
    brute: (w, a) => validWordAbbrBruteTrace(w, Array.isArray(a) ? a : [a]),
    twopointer: (w, a) => validWordAbbrTwoPointerTrace(w, Array.isArray(a) ? a : [a]),
  },
  "count-binary-substrings": {
    brute: (codes) => countBinarySubstringsBruteTrace(codes),
    group: (codes) => countBinarySubstringsGroupTrace(codes),
  },
  "two-sum-ii-input-array-is-sorted": {
    brute: (nums, target) => twoSumIISortedBruteTrace(nums, Number(target)),
    binary: (nums, target) => twoSumIISortedBinaryTrace(nums, Number(target)),
  },
  "container-with-most-water": {
    brute: (nums) => maxAreaBruteTrace(nums),
    twopointer: (nums) => maxAreaTwoPointerTrace(nums),
  },
  "3sum": {
    brute: (nums) => threeSumBruteTrace(nums),
    hashset: (nums) => threeSumHashSetTrace(nums),
  },
  "4sum": {
    brute: (nums, target) => fourSumBruteTrace(nums, Number(target)),
    twopointer: (nums, target) => fourSumTwoPointerTrace(nums, Number(target)),
  },
  "trapping-rain-water": {
    brute: (nums) => trapBruteTrace(nums),
    prefixmax: (nums) => trapPrefixMaxTrace(nums),
  },
  "running-sum-of-1d-array": {
    brute: (nums) => runningSumBruteTrace(nums),
    prefix: (nums) => runningSumPrefixTrace(nums),
  },
  "range-sum-query-immutable": {
    brute: (nums, left, right) => rangeSumBruteTrace(nums, Number(left), Number(right)),
    prefix: (nums, left, right) => rangeSumPrefixTrace(nums, Number(left), Number(right)),
  },
  "find-pivot-index": {
    brute: (nums) => pivotIndexBruteTrace(nums),
    prefix: (nums) => pivotIndexPrefixTrace(nums),
  },
  "maximum-population-year": {
    brute: (nums) => maxPopBruteTrace(nums),
    sweep: (nums) => maxPopSweepTrace(nums),
  },
  "subarray-sum-equals-k": {
    brute: (nums, k) => subarraySumBruteTrace(nums, Number(k)),
    map: (nums, k) => subarraySumMapTrace(nums, Number(k)),
  },
  "subarray-sums-divisible-by-k": {
    brute: (nums, k) => subarraysDivByKBruteTrace(nums, Number(k)),
    map: (nums, k) => subarraysDivByKMapTrace(nums, Number(k)),
  },
  "continuous-subarray-sum": {
    brute: (nums, k) => checkSubarraySumBruteTrace(nums, Number(k)),
    map: (nums, k) => checkSubarraySumMapTrace(nums, Number(k)),
  },
  "contiguous-array": {
    brute: (nums) => findMaxLengthBruteTrace(nums),
    map: (nums) => findMaxLengthMapTrace(nums),
  },
  "maximum-average-subarray-i": {
    brute: (nums, k) => maxAvgBruteTrace(nums, Number(k)),
    sliding: (nums, k) => maxAvgSlidingTrace(nums, Number(k)),
  },
  "find-all-anagrams-in-a-string": {
    brute: (s, p) => findAnagramsBruteTrace(s, Array.isArray(p) ? p : [p]),
    freq: (s, p) => findAnagramsFreqTrace(s, Array.isArray(p) ? p : [p]),
  },
  "permutation-in-string": {
    brute: (s1, s2) => checkInclusionBruteTrace(s1, Array.isArray(s2) ? s2 : [s2]),
    sliding: (s1, s2) => checkInclusionSlidingTrace(s1, Array.isArray(s2) ? s2 : [s2]),
  },
  "maximum-sum-of-distinct-subarrays-with-length-k": {
    brute: (nums, k) => maxDistinctBruteTrace(nums, Number(k)),
    sliding: (nums, k) => maxDistinctSlidingTrace(nums, Number(k)),
  },
  "substring-with-concatenation-of-all-words": {
    brute: (s, words) => findSubstringBruteTrace(s, Array.isArray(words) ? words : [words]),
    sliding: (s, words) => findSubstringSlidingTrace(s, Array.isArray(words) ? words : [words]),
  },
  "longest-substring-without-repeating-characters": {
    brute: (codes) => longSubNoRepeatBruteTrace(codes),
    sliding: (codes) => longSubNoRepeatSlidingTrace(codes),
  },
  "longest-repeating-character-replacement": {
    brute: (codes, k) => charReplacementBruteTrace(codes, Number(k)),
    sliding: (codes, k) => charReplacementSlidingTrace(codes, Number(k)),
  },
  "minimum-size-subarray-sum": {
    brute: (nums, target) => minSubArrayLenBruteTrace(nums, Number(target)),
    sliding: (nums, target) => minSubArrayLenSlidingTrace(nums, Number(target)),
  },
  "max-consecutive-ones-iii": {
    brute: (nums, k) => longestOnesBruteTrace(nums, Number(k)),
    sliding: (nums, k) => longestOnesSlidingTrace(nums, Number(k)),
  },
  "minimum-window-substring": {
    brute: (s, t) => minWindowBruteTrace(s, Array.isArray(t) ? t : [t]),
    sliding: (s, t) => minWindowSlidingTrace(s, Array.isArray(t) ? t : [t]),
  },
  "maximum-subarray": {
    brute: (nums) => maxSubArrayBruteTrace(nums),
    kadane: (nums) => maxSubArrayKadaneTrace(nums),
  },
  "maximum-sum-circular-subarray": {
    brute: (nums) => maxCircularBruteTrace(nums),
    kadane: (nums) => maxCircularKadaneTrace(nums),
  },
  "maximum-product-subarray": {
    brute: (nums) => maxProductBruteTrace(nums),
    dp: (nums) => maxProductDPTrace(nums),
  },
  "best-sightseeing-pair": {
    brute: (values) => sightseeingBruteTrace(values),
    running: (values) => sightseeingRunningTrace(values),
  },
  "transpose-matrix": {
    direct: (flat, rows, cols) => transposeDirectTrace(flat, Number(rows), Number(cols)),
    column: (flat, rows, cols) => transposeColumnTrace(flat, Number(rows), Number(cols)),
  },
  "spiral-matrix": {
    simulate: (flat, rows, cols) => spiralSimulateTrace(flat, Number(rows), Number(cols)),
    layer: (flat, rows, cols) => spiralLayerTrace(flat, Number(rows), Number(cols)),
  },
  "rotate-image": {
    space: (flat, n) => rotateImageSpaceTrace(flat, Number(n)),
    transpose: (flat, n) => rotateImageTransposeTrace(flat, Number(n)),
  },
  "set-matrix-zeroes": {
    copy: (flat, rows, cols) => setZeroesCopyTrace(flat, Number(rows), Number(cols)),
    hash: (flat, rows, cols) => setZeroesHashTrace(flat, Number(rows), Number(cols)),
  },
  "candy-crush": {
    bool: (flat, rows, cols) => candyCrushBoolTrace(flat, Number(rows), Number(cols)),
    neg: (flat, rows, cols) => candyCrushNegTrace(flat, Number(rows), Number(cols)),
  },
  "valid-sudoku": {
    threepass: (flat, rows, cols) => sudokuThreePassTrace(flat, Number(rows), Number(cols)),
    singlepass: (flat, rows, cols) => sudokuSinglePassTrace(flat, Number(rows), Number(cols)),
  },
  "game-of-life": {
    copy: (flat, rows, cols) => gameOfLifeCopyTrace(flat, Number(rows), Number(cols)),
    encode: (flat, rows, cols) => gameOfLifeEncodeTrace(flat, Number(rows), Number(cols)),
  },
  "intersection-of-two-linked-lists": {
    hashset: (a, b) => intersectionHashSetTrace(a, Array.isArray(b) ? b : [b], 0),
    twopointer: (a, b) => intersectionTwoPointerTrace(a, Array.isArray(b) ? b : [b], 0),
  },
  "remove-duplicates-from-sorted-list": {
    set: (vals) => deleteDuplicatesSetTrace(vals),
    inplace: (vals) => deleteDuplicatesInPlaceTrace(vals),
  },
  "design-linked-list": {
    singly: () => designLinkedListSinglyTrace(),
    doubly: () => designLinkedListDoublyTrace(),
  },
  "remove-nth-node-from-end-of-list": {
    twopass: (vals, n) => removeNthTwoPassTrace(vals, Number(n)),
    onepass: (vals, n) => removeNthOnePassTrace(vals, Number(n)),
  },
  "remove-duplicates-from-sorted-list-ii": {
    map: (vals) => deleteDuplicatesIIMapTrace(vals),
    single: (vals) => deleteDuplicatesIISingleTrace(vals),
  },
  "swap-nodes-in-pairs": {
    recursive: (vals) => swapPairsRecursiveTrace(vals),
    iterative: (vals) => swapPairsIterativeTrace(vals),
  },
  "copy-list-with-random-pointer": {
    map: (vals, randoms) => copyRandomListMapTrace(vals, Array.isArray(randoms) ? randoms : [randoms]),
    interleave: (vals, randoms) => copyRandomListInterleaveTrace(vals, Array.isArray(randoms) ? randoms : [randoms]),
  },
  "partition-list": {
    array: (vals, x) => partitionArrayTrace(vals, Number(x)),
    twodummy: (vals, x) => partitionTwoDummyTrace(vals, Number(x)),
  },
  "rotate-list": {
    brute: (vals, k) => rotateListBruteTrace(vals, Number(k)),
    split: (vals, k) => rotateListSplitTrace(vals, Number(k)),
  },
  "add-two-numbers": {
    iterative: (l1, l2) => addTwoNumbersIterativeTrace(l1, Array.isArray(l2) ? l2 : [l2]),
    recursive: (l1, l2) => addTwoNumbersRecursiveTrace(l1, Array.isArray(l2) ? l2 : [l2]),
  },
  "flatten-a-multilevel-doubly-linked-list": {
    dfs: (vals) => flattenDFSStackTrace(vals),
    iterative: (vals) => flattenIterativeTrace(vals),
  },
  "palindrome-linked-list": {
    array: (vals) => palindromeArrayTrace(vals),
    reversehalf: (vals) => palindromeReverseHalfTrace(vals),
  },
  "reverse-linked-list": {
    iterative: (vals) => reverseListIterativeTrace(vals),
    recursive: (vals) => reverseListRecursiveTrace(vals),
  },
  "reverse-linked-list-ii": {
    extract: (vals, left, right) => reverseBetweenExtractTrace(vals, Number(left), Number(right)),
    inplace: (vals, left, right) => reverseBetweenInPlaceTrace(vals, Number(left), Number(right)),
  },
  "reverse-nodes-in-k-group": {
    array: (vals, k) => reverseKGroupArrayTrace(vals, Number(k)),
    inplace: (vals, k) => reverseKGroupInPlaceTrace(vals, Number(k)),
  },
  "middle-of-the-linked-list": {
    array: (vals) => middleNodeArrayTrace(vals),
    twopass: (vals) => middleNodeTwoPassTrace(vals),
  },
  "happy-number": {
    set: (vals) => happyNumberSetTrace(vals),
    floyd: (vals) => happyNumberFloydTrace(vals),
  },
  "linked-list-cycle-ii": {
    set: (vals, cycleStart) => detectCycleSetTrace(vals, Number(cycleStart)),
    floyd: (vals, cycleStart) => detectCycleFloydTrace(vals, Number(cycleStart)),
  },
};

// Distinct source code for Running Sum of 1d Array approaches.
export const runningSumSources: Record<string, string> = {
  brute: `function runningSum(nums) {
    var n = nums.length;
    var result = new Array(n);

    for (var i = 0; i < n; i++) {
        var sum = 0;
        // Sum all elements from index 0 to i
        for (var j = 0; j <= i; j++) {
            sum += nums[j];
        }
        result[i] = sum;
    }

    return result;
}`,
  prefix: `function runningSum(nums) {
    var n = nums.length;
    var result = new Array(n);

    result[0] = nums[0];
    for (var i = 1; i < n; i++) {
        // Each running sum builds on the previous one
        result[i] = result[i - 1] + nums[i];
    }

    return result;
}`,
};

// Distinct source code per approach (shown in the code pane).
export const mcoSources: Record<string, string> = {
  brute: `var findMaxConsecutiveOnes = function(nums) {
    let maxCount = 0;

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === 0) continue;
        let count = 0;
        while (i + count < nums.length && nums[i + count] === 1) {
            count++;
        }
        maxCount = Math.max(maxCount, count);
    }

    return maxCount;
};`,
  single: `var findMaxConsecutiveOnes = function(nums) {
    let maxCount = 0;
    let count = 0;

    for (const num of nums) {
        if (num === 1) {
            count++;
        } else {
            count = 0;
        }
        maxCount = Math.max(maxCount, count);
    }

    return maxCount;
};`,
};

// Distinct source code for Third Maximum Number approaches.
export const thirdMaxSources: Record<string, string> = {
  sort: `var thirdMax = function(nums) {
    nums.sort((a, b) => a - b);
    let count = 1;
    // Walk backward from the largest element
    for (let i = nums.length - 2; i >= 0; i--) {
        if (nums[i] === nums[i + 1]) {
            continue;
        }
        count++;
        if (count === 3) {
            return nums[i];
        }
    }
    // Fewer than 3 distinct values, return the maximum
    return nums[nums.length - 1];
};`,
  track: `var thirdMax = function(nums) {
    // Use -Infinity as sentinel (outside 32-bit integer range)
    let first = -Infinity;
    let second = -Infinity;
    let third = -Infinity;

    for (const num of nums) {
        // Skip duplicates
        if (num === first || num === second || num === third) {
            continue;
        }
        if (num > first) {
            // New largest: shift everything down
            third = second;
            second = first;
            first = num;
        } else if (num > second) {
            // New second largest: shift third down
            third = second;
            second = num;
        } else if (num > third) {
            // New third largest
            third = num;
        }
    }

    // If third was never assigned, return the maximum
    return third === -Infinity ? first : third;
};`,
};

// Distinct source code for Move Zeroes approaches.
export const moveZeroesSources: Record<string, string> = {
  extraarray: `var moveZeroes = function(nums) {
    var n = nums.length;
    var result = new Array(n).fill(0);
    var insertPos = 0;

    // Collect non-zero elements
    for (var i = 0; i < n; i++) {
        if (nums[i] !== 0) {
            result[insertPos] = nums[i];
            insertPos++;
        }
    }

    // Copy result back into nums
    for (var i = 0; i < n; i++) {
        nums[i] = result[i];
    }
};`,
  swap: `var moveZeroes = function(nums) {
    var insertPos = 0;
    for (var i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
            // Swap non-zero element into the correct position
            var temp = nums[insertPos];
            nums[insertPos] = nums[i];
            nums[i] = temp;
            insertPos++;
        }
    }
};`,
};

// Distinct source code for Shuffle the Array approaches.
export const shuffleSources: Record<string, string> = {
  interleave: `var shuffle = function(nums, n) {
    var result = new Array(2 * n);

    for (var i = 0; i < n; i++) {
        // Place element from first half
        result[2 * i] = nums[i];
        // Place element from second half
        result[2 * i + 1] = nums[n + i];
    }

    return result;
};`,
  inplace: `var shuffle = function(nums, n) {
    var maxVal = 1001;

    // Encode: add shuffled value as the high part (base maxVal)
    for (var i = n - 1; i >= 0; i--) {
        // nums[n + i] goes to position 2*i+1
        nums[2 * i + 1] += (nums[n + i] % maxVal) * maxVal;
        // nums[i] goes to position 2*i
        nums[2 * i] += (nums[i] % maxVal) * maxVal;
    }

    // Decode: keep only the high part (the shuffled value)
    for (var i = 0; i < 2 * n; i++) {
        nums[i] = Math.floor(nums[i] / maxVal);
    }

    return nums;
};`,
};

// Distinct source code for Majority Element approaches.
export const majoritySources: Record<string, string> = {
  hashmap: `var majorityElement = function(nums) {
    var counts = new Map();
    var threshold = Math.floor(nums.length / 2);

    for (var i = 0; i < nums.length; i++) {
        var count = (counts.get(nums[i]) || 0) + 1;
        counts.set(nums[i], count);

        // Return as soon as we find the majority element
        if (count > threshold) {
            return nums[i];
        }
    }

    return -1; // Won't reach here given problem guarantee
};`,
  sort: `var majorityElement = function(nums) {
    nums.sort(function(a, b) { return a - b; });
    // The majority element always occupies the middle position
    return nums[Math.floor(nums.length / 2)];
};`,
};

// Distinct source code for Remove Duplicates from Sorted Array approaches.
export const removeDuplicatesSources: Record<string, string> = {
  hashset: `var removeDuplicates = function(nums) {
    var seen = new Set();
    for (const num of nums) {
        seen.add(num);
    }

    var unique = Array.from(seen);
    unique.sort(function(a, b) { return a - b; });

    for (var i = 0; i < unique.length; i++) {
        nums[i] = unique[i];
    }

    return unique.length;
};`,
  twopointer: `var removeDuplicates = function(nums) {
    if (nums.length === 0) return 0;

    var insertPos = 1;

    for (var i = 1; i < nums.length; i++) {
        // Found a new unique value, place it at insertPos
        if (nums[i] !== nums[insertPos - 1]) {
            nums[insertPos] = nums[i];
            insertPos++;
        }
    }

    return insertPos;
};`,
};

// Distinct source code for Remove Element approaches.
export const removeElementSources: Record<string, string> = {
  extraarray: `var removeElement = function(nums, val) {
    var result = [];
    var k = 0;

    // Collect elements that are not val
    for (var i = 0; i < nums.length; i++) {
        if (nums[i] !== val) {
            result.push(nums[i]);
            k++;
        }
    }

    // Copy result back into nums
    for (var i = 0; i < k; i++) {
        nums[i] = result[i];
    }

    return k;
};`,
  frontoverwrite: `var removeElement = function(nums, val) {
    var k = 0;
    for (var i = 0; i < nums.length; i++) {
        if (nums[i] !== val) {
            // Place non-val element at the write position
            nums[k] = nums[i];
            k++;
        }
    }
    return k;
};`,
};

// Distinct source code for Best Time to Buy and Sell Stock approaches.
export const maxProfitSources: Record<string, string> = {
  brute: `var maxProfit = function(prices) {
    let maxProfit = 0;

    // Try every pair of buy and sell days
    for (let i = 0; i < prices.length - 1; i++) {
        for (let j = i + 1; j < prices.length; j++) {
            const profit = prices[j] - prices[i];
            if (profit > maxProfit) {
                maxProfit = profit;
            }
        }
    }

    return maxProfit;
};`,
  onepass: `var maxProfit = function(prices) {
    var minPrice = prices[0];
    var maxProfit = 0;

    for (var i = 1; i < prices.length; i++) {
        // Update the lowest price seen so far
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else {
            // Check if selling today gives a better profit
            var profit = prices[i] - minPrice;
            if (profit > maxProfit) {
                maxProfit = profit;
            }
        }
    }

    return maxProfit;
};`,
};

// Distinct source code for Missing Ranges approaches.
export const missingRangesSources: Record<string, string> = {
  separate: `var findMissingRanges = function(nums, lower, upper) {
    const result = [];
    const n = nums.length;

    if (n === 0) {
        result.push([lower, upper]);
        return result;
    }

    // Gap before the first element
    if (lower < nums[0]) {
        result.push([lower, nums[0] - 1]);
    }

    // Gaps between consecutive elements
    for (let i = 0; i < n - 1; i++) {
        if (nums[i + 1] - nums[i] > 1) {
            result.push([nums[i] + 1, nums[i + 1] - 1]);
        }
    }

    // Gap after the last element
    if (nums[n - 1] < upper) {
        result.push([nums[n - 1] + 1, upper]);
    }

    return result;
};`,
  unified: `var findMissingRanges = function(nums, lower, upper) {
    const result = [];
    let prev = lower - 1;

    for (let i = 0; i <= nums.length; i++) {
        // Use upper + 1 as the virtual element after the array
        const curr = (i < nums.length) ? nums[i] : upper + 1;

        if (curr - prev > 1) {
            result.push([prev + 1, curr - 1]);
        }
        prev = curr;
    }

    return result;
};`,
};

// Distinct source code for Rotate Array approaches.
export const rotateSources: Record<string, string> = {
  brute: `var rotate = function(nums, k) {
    var n = nums.length;
    k = k % n;

    for (var i = 0; i < k; i++) {
        // Save the last element
        var last = nums[n - 1];
        // Shift everything right by one
        for (var j = n - 1; j > 0; j--) {
            nums[j] = nums[j - 1];
        }
        // Place last element at the front
        nums[0] = last;
    }
};`,
  extraarray: `var rotate = function(nums, k) {
    var n = nums.length;
    k = k % n;
    var result = new Array(n);

    // Place each element at its rotated position
    for (var i = 0; i < n; i++) {
        result[(i + k) % n] = nums[i];
    }

    // Copy back to original array
    for (var i = 0; i < n; i++) {
        nums[i] = result[i];
    }
};`,
};
export const majority2Sources: Record<string, string> = {
  hashmap: `var majorityElement = function(nums) {
    var n = nums.length;
    var threshold = Math.floor(n / 3);
    var countMap = new Map();
    var result = [];

    // Count occurrences of each element
    for (var i = 0; i < n; i++) {
        countMap.set(nums[i], (countMap.get(nums[i]) || 0) + 1);
    }

    // Collect elements that appear more than n/3 times
    countMap.forEach(function(count, num) {
        if (count > threshold) {
            result.push(num);
        }
    });

    return result;
};`,
  sort: `var majorityElement = function(nums) {
    var n = nums.length;
    var threshold = Math.floor(n / 3);
    var result = [];

    nums.sort(function(a, b) { return a - b; });

    var i = 0;
    while (i < n) {
        var current = nums[i];
        var count = 0;
        // Count consecutive occurrences of current element
        while (i < n && nums[i] === current) {
            count++;
            i++;
        }
        if (count > threshold) {
            result.push(current);
        }
    }

    return result;
};`,
};

// Distinct source code for Product of Array Except Self approaches.
export const productSources: Record<string, string> = {
  brute: `var productExceptSelf = function(nums) {
    const n = nums.length;
    const result = new Array(n);

    for (let i = 0; i < n; i++) {
        let product = 1;
        for (let j = 0; j < n; j++) {
            if (j !== i) {
                product *= nums[j];
            }
        }
        result[i] = product;
    }

    return result;
};`,
  prefixsuffix: `var productExceptSelf = function(nums) {
    const n = nums.length;
    const prefix = new Array(n);
    const suffix = new Array(n);
    const result = new Array(n);

    // Build prefix products
    prefix[0] = 1;
    for (let i = 1; i < n; i++) {
        prefix[i] = prefix[i - 1] * nums[i - 1];
    }

    // Build suffix products
    suffix[n - 1] = 1;
    for (let i = n - 2; i >= 0; i--) {
        suffix[i] = suffix[i + 1] * nums[i + 1];
    }

    // Combine prefix and suffix
    for (let i = 0; i < n; i++) {
        result[i] = prefix[i] * suffix[i];
    }

    return result;
};`,
};

// Distinct source code for Remove Duplicates from Sorted Array II approaches.
export const removeDuplicates2Sources: Record<string, string> = {
  count: `var removeDuplicates = function(nums) {
    if (nums.length <= 2) return nums.length;

    var writePos = 1;
    var count = 1;

    for (var i = 1; i < nums.length; i++) {
        if (nums[i] === nums[i - 1]) {
            count++;
        } else {
            count = 1;
        }

        if (count <= 2) {
            nums[writePos] = nums[i];
            writePos++;
        }
    }

    return writePos;
};`,
  twopos: `var removeDuplicates = function(nums) {
    if (nums.length <= 2) return nums.length;

    // First two elements are always valid
    var writePos = 2;

    for (var i = 2; i < nums.length; i++) {
        // Compare with element two positions back in result
        if (nums[i] !== nums[writePos - 2]) {
            nums[writePos] = nums[i];
            writePos++;
        }
    }

    return writePos;
};`,
};

// Distinct source code for Best Time to Buy and Sell Stock II approaches.
export const maxProfit2Sources: Record<string, string> = {
  brute: `var maxProfit = function(prices) {
    function solve(day, holding) {
        // Base case: no more days to trade
        if (day === prices.length) return 0;

        if (holding) {
            // Either sell today or skip
            let sell = prices[day] + solve(day + 1, false);
            let skip = solve(day + 1, true);
            return Math.max(sell, skip);
        } else {
            // Either buy today or skip
            let buy = -prices[day] + solve(day + 1, true);
            let skip = solve(day + 1, false);
            return Math.max(buy, skip);
        }
    }

    return solve(0, false);
};`,
  dp: `var maxProfit = function(prices) {
    // notHolding: max profit when not holding stock
    // holding: max profit when holding stock
    let notHolding = 0;
    let holding = -prices[0];

    for (let i = 1; i < prices.length; i++) {
        let newNotHolding = Math.max(notHolding, holding + prices[i]);
        let newHolding = Math.max(holding, notHolding - prices[i]);
        notHolding = newNotHolding;
        holding = newHolding;
    }

    return notHolding;
};`,
};

// Distinct source code for Number of Zero-Filled Subarrays approaches.
export const zeroFilledSources: Record<string, string> = {
  brute: `var zeroFilledSubarray = function(nums) {
    let count = 0;

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) continue;
        // Extend right while we see zeros
        for (let j = i; j < nums.length && nums[j] === 0; j++) {
            count++;
        }
    }

    return count;
};`,
  optimal: `var zeroFilledSubarray = function(nums) {
    let count = 0;
    let consecutiveZeros = 0;

    for (const num of nums) {
        if (num === 0) {
            consecutiveZeros++;
        } else {
            consecutiveZeros = 0;
        }
        // Each new zero in a run of length k adds k new subarrays
        count += consecutiveZeros;
    }

    return count;
};`,
};

// Distinct source code for Increasing Triplet Subsequence approaches.
export const increasingTripletSources: Record<string, string> = {
  brute: `var increasingTriplet = function(nums) {
    var n = nums.length;
    for (var i = 0; i < n - 2; i++) {
        for (var j = i + 1; j < n - 1; j++) {
            if (nums[j] > nums[i]) {
                for (var k = j + 1; k < n; k++) {
                    if (nums[k] > nums[j]) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
};`,
  prefixsuffix: `var increasingTriplet = function(nums) {
    var n = nums.length;
    if (n < 3) return false;

    // leftMin[i] = minimum value in nums[0..i]
    var leftMin = new Array(n);
    leftMin[0] = nums[0];
    for (var i = 1; i < n; i++) {
        leftMin[i] = Math.min(leftMin[i - 1], nums[i]);
    }

    // rightMax[i] = maximum value in nums[i..n-1]
    var rightMax = new Array(n);
    rightMax[n - 1] = nums[n - 1];
    for (var i = n - 2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i + 1], nums[i]);
    }

    // Check if any middle element forms a valid triplet
    for (var j = 1; j < n - 1; j++) {
        if (leftMin[j - 1] < nums[j] && nums[j] < rightMax[j + 1]) {
            return true;
        }
    }

    return false;
};`,
};

// Distinct source code for Next Permutation approaches.
export const nextPermutationSources: Record<string, string> = {
  brute: `var nextPermutation = function(nums) {
    var perms = [];
    generatePerms(nums.slice(), 0, perms);

    // Sort permutations lexicographically
    perms.sort(function(a, b) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return a[i] - b[i];
        }
        return 0;
    });

    // Find current and return next
    for (var i = 0; i < perms.length; i++) {
        if (perms[i].every(function(val, idx) { return val === nums[idx]; })) {
            var next = perms[(i + 1) % perms.length];
            for (var j = 0; j < nums.length; j++) {
                nums[j] = next[j];
            }
            return;
        }
    }
};

function generatePerms(arr, start, result) {
    if (start === arr.length) {
        result.push(arr.slice());
        return;
    }
    // Skip duplicate values at this level to avoid duplicate permutations
    var seen = new Set();
    for (var i = start; i < arr.length; i++) {
        if (seen.has(arr[i])) continue;
        seen.add(arr[i]);
        var temp = arr[start];
        arr[start] = arr[i];
        arr[i] = temp;
        generatePerms(arr, start + 1, result);
        temp = arr[start];
        arr[start] = arr[i];
        arr[i] = temp;
    }
}`,
  optimal: `var nextPermutation = function(nums) {
    var n = nums.length;

    // Step 1: Find the pivot (rightmost i where nums[i] < nums[i+1])
    var i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }

    // Step 2: If pivot exists, find the successor and swap
    if (i >= 0) {
        var j = n - 1;
        while (nums[j] <= nums[i]) {
            j--;
        }
        // Step 3: Swap pivot with successor
        var temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }

    // Step 4: Reverse the suffix starting at i+1
    var left = i + 1;
    var right = n - 1;
    while (left < right) {
        var temp = nums[left];
        nums[left] = nums[right];
        nums[right] = temp;
        left++;
        right--;
    }
};`,
};

// Distinct source code for First Missing Positive approaches.
export const firstMissingPositiveSources: Record<string, string> = {
  hashset: `var firstMissingPositive = function(nums) {
    // Store all numbers in a set for O(1) lookup
    const seen = new Set(nums);

    // Check 1, 2, 3, ... until we find one that's missing
    for (let i = 1; i <= nums.length + 1; i++) {
        if (!seen.has(i)) {
            return i;
        }
    }

    return nums.length + 1;
};`,
  sort: `var firstMissingPositive = function(nums) {
    nums.sort((a, b) => a - b);
    let expected = 1;

    for (let i = 0; i < nums.length; i++) {
        // Skip negatives, zeros, and duplicates
        if (nums[i] <= 0 || (i > 0 && nums[i] === nums[i - 1])) {
            continue;
        }
        // If current number matches what we expect, move to next
        if (nums[i] === expected) {
            expected++;
        } else {
            // Gap found
            break;
        }
    }

    return expected;
};`,
};

// Distinct source code for Reverse String approaches.
export const reverseStringSources: Record<string, string> = {
  extraarray: `var reverseString = function(s) {
    const n = s.length;
    const result = new Array(n);

    // Fill reversed array from back to front
    for (let i = 0; i < n; i++) {
        result[i] = s[n - 1 - i];
    }

    // Copy back into original array
    for (let i = 0; i < n; i++) {
        s[i] = result[i];
    }
}`,
  twopointer: `var reverseString = function(s) {
    let left = 0;
    let right = s.length - 1;

    while (left < right) {
        // Swap characters at the two pointers
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
}`,
};

// Distinct source code for Length of Last Word approaches.
export const lengthOfLastWordSources: Record<string, string> = {
  split: `var lengthOfLastWord = function(s) {
    // Splitting on a single space can produce empty strings, so filter them out
    const words = s.split(" ").filter((w) => w.length > 0);

    if (words.length === 0) {
        return 0;
    }

    return words[words.length - 1].length;
}`,
  end: `var lengthOfLastWord = function(s) {
    let i = s.length - 1;
    // Skip trailing spaces

    while (i >= 0 && s[i] === ' ') {
        i--;
    }

    // Count characters in the last word
    let length = 0;
    while (i >= 0 && s[i] !== ' ') {
        length++;
        i--;
    }

    return length;
}`,
};

// Distinct source code for Is Subsequence approaches.
export const isSubsequenceSources: Record<string, string> = {
  twopointer: `var isSubsequence = function(s, t) {
    // Initialize pointer for s
    let i = 0;

    // Traverse through t
    for (let j = 0; j < t.length; j++) {
        // If we found all characters in s
        if (i === s.length) {
            return true;
        }
        // If characters match, move pointer in s
        if (s[i] === t[j]) {
            i++;
        }
    }

    // Check if we found all characters
    return i === s.length;
}`,
  binarysearch: `var isSubsequence = function(s, t) {
    var positions = new Map();
    for (var idx = 0; idx < t.length; idx++) {
        if (!positions.has(t[idx])) positions.set(t[idx], []);
        positions.get(t[idx]).push(idx);
    }
    var prev = -1;
    for (var i = 0; i < s.length; i++) {
        var idxs = positions.get(s[i]) || [];
        // Binary search for the smallest index > prevIndex
        var lo = 0, hi = idxs.length;
        while (lo < hi) {
            var mid = (lo + hi) >> 1;
            if (idxs[mid] > prev) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        if (lo === idxs.length) {
            return false;
        }
        prev = idxs[lo];
    }
    return true;
};`,
};

// Distinct source code for Valid Palindrome approaches.
export const validPalindromeSources: Record<string, string> = {
  filter: `var isPalindrome = function(s) {
    // Build a cleaned string with only lowercase alphanumeric chars
    let filtered = "";
    for (const c of s) {
        if (/[a-z0-9]/i.test(c)) {
            filtered += c.toLowerCase();
        }
    }

    // Compare with its reverse
    const reversed = filtered.split("").reverse().join("");

    return filtered === reversed;
}`,
  twopointer: `var isPalindrome = function(s) {
    let left = 0;
    let right = s.length - 1;

    while (left < right) {
        // Skip non-alphanumeric characters from the left
        if (!isAlphanumeric(s[left])) {
            left++;
            continue;
        }
        // Skip non-alphanumeric characters from the right
        if (!isAlphanumeric(s[right])) {
            right--;
            continue;
        }

        // Compare lowercase versions
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }

        left++;
        right--;
    }

    return true;
}

function isAlphanumeric(char) {
    return /[a-zA-Z0-9]/.test(char);
}`,
};

// Distinct source code for Valid Palindrome II approaches.
export const validPalindromeIISources: Record<string, string> = {
  brute: `var validPalindrome = function(s) {
    function isPalindrome(t) {
        let left = 0;
        let right = t.length - 1;
        while (left < right) {
            if (t[left] !== t[right]) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    if (isPalindrome(s)) {
        return true;
    }

    // Check each possible single deletion
    for (let i = 0; i < s.length; i++) {
        const candidate = s.slice(0, i) + s.slice(i + 1);
        if (isPalindrome(candidate)) {
            return true;
        }
    }

    return false;
}`,
  greedy: `var validPalindrome = function(s) {
    let left = 0, right = s.length - 1;

    while (left < right) {
        if (s[left] !== s[right]) {
            // Mismatch: try skipping left or right character
            return isPalindrome(s, left + 1, right)
                || isPalindrome(s, left, right - 1);
        }
        left++;
        right--;
    }

    return true;
}

function isPalindrome(s, left, right) {
    while (left < right) {
        if (s[left] !== s[right]) {
            return false;
        }
        left++;
        right--;
    }
    // No mismatch found, already a palindrome
    return true;
}`,
};

// Distinct source code for Valid Anagram approaches.
export const validAnagramSources: Record<string, string> = {
  sort: `var isAnagram = function(s, t) {
    if (s.length !== t.length) {
        return false;
    }

    // Sort both strings and compare
    const sortedS = s.split("").sort();
    const sortedT = t.split("").sort();

    for (let i = 0; i < sortedS.length; i++) {
        if (sortedS[i] !== sortedT[i]) {
            return false;
        }
    }

    return true;
}`,
  count: `var isAnagram = function(s, t) {
    if (s.length !== t.length) return false;

    const count = new Array(26).fill(0);

    // Increment for s, decrement for t
    for (let i = 0; i < s.length; i++) {
        count[s.charCodeAt(i) - 97]++;
        count[t.charCodeAt(i) - 97]--;
    }

    // Check if all counts are zero
    for (const c of count) {
        if (c !== 0) return false;
    }

    return true;
};`,
};

// Distinct source code for Rotate String approaches.
export const rotateStringSources: Record<string, string> = {
  brute: `var rotateString = function(s, goal) {
    if (s.length !== goal.length) {
        return false;
    }
    // Try every possible rotation
    for (var k = 0; k < s.length; k++) {
        // Build the k-th rotation: s[k..n-1] + s[0..k-1]
        var rotated = s.slice(k) + s.slice(0, k);
        if (rotated === goal) {
            return true;
        }
    }
    return false;
};`,
  concat: `var rotateString = function(s, goal) {
    // Different lengths means rotation is impossible
    if (s.length !== goal.length) {
        return false;
    }

    // Every rotation of s appears as a substring of s + s
    const doubled = s + s;

    if (doubled.includes(goal)) {
        return true;
    }

    return false;
}`,
};

// Distinct source code for Longest Common Prefix approaches.
export const longestCommonPrefixSources: Record<string, string> = {
  vertical: `var longestCommonPrefix = function(strs) {
    if (strs.length === 0) {
        return "";
    }

    // Use first string as reference
    for (let i = 0; i < strs[0].length; i++) {
        const char = strs[0][i];

        // Check if all strings have this character at position i
        for (let j = 1; j < strs.length; j++) {
            if (i >= strs[j].length || strs[j][i] !== char) {
                return strs[0].substring(0, i);
            }
        }
    }

    // The entire first string is the common prefix
    return strs[0];
}`,
  sort: `var longestCommonPrefix = function(strs) {
    if (strs.length === 0) {
        return "";
    }

    // Sort so first and last strings are most different
    strs.sort();
    const first = strs[0];
    const last = strs[strs.length - 1];

    let i = 0;
    const limit = Math.min(first.length, last.length);
    while (i < limit && first[i] === last[i]) {
        i++;
    }

    return first.slice(0, i);
}`,
};

// Distinct source code for Longest Palindrome approaches.
export const longestPalindromeSources: Record<string, string> = {
  greedy: `var longestPalindrome = function(s) {
    const counts = new Map();
    for (const c of s) {
        counts.set(c, (counts.get(c) || 0) + 1);
    }

    let length = 0;
    let hasOdd = false;
    for (const count of counts.values()) {
        // Use the largest even number <= count
        length += Math.floor(count / 2) * 2;
        if (count % 2 === 1) {
            hasOdd = true;
        }
    }

    // Place one odd character in the center if available
    if (hasOdd) {
        length += 1;
    }

    return length;
}`,
  set: `var longestPalindrome = function(s) {
    const oddChars = new Set();
    let length = 0;
    for (const c of s) {
        if (oddChars.has(c)) {
            // Pair completed, add 2 to length
            oddChars.delete(c);
            length += 2;
        } else {
            // First of a potential pair
            oddChars.add(c);
        }
    }
    // If any unpaired characters remain, one can go in the center
    if (oddChars.size > 0) {
        length++;
    }
    return length;
}`,
};

// Distinct source code for Find the Index of the First Occurrence approaches.
export const strStrSources: Record<string, string> = {
  brute: `var strStr = function(haystack, needle) {
    const n = haystack.length;
    const m = needle.length;

    // Try each possible starting position
    for (let i = 0; i <= n - m; i++) {
        let j = 0;
        // Compare needle with haystack starting at position i
        while (j < m && haystack[i + j] === needle[j]) {
            j++;
        }
        // If we matched all characters of needle, return the start
        if (j === m) {
            return i;
        }
    }

    return -1;
};`,
  rabinkarp: `var strStr = function(haystack, needle) {
    const n = haystack.length;
    const m = needle.length;
    if (m > n) {
        return -1;
    }

    const BASE = 26n;
    const MOD = 1000000007n;

    // power = BASE^(m-1) mod MOD, the weight of the leftmost character
    let power = 1n;
    for (let k = 0; k < m - 1; k++) {
        power = (power * BASE) % MOD;
    }

    // Compute the hash of the needle and of the first window
    let needleHash = 0n;
    let windowHash = 0n;
    for (let k = 0; k < m; k++) {
        needleHash = (needleHash * BASE + BigInt(needle.charCodeAt(k) - 97)) % MOD;
        windowHash = (windowHash * BASE + BigInt(haystack.charCodeAt(k) - 97)) % MOD;
    }

    for (let i = 0; i <= n - m; i++) {
        // Hash match is only a hint, verify the characters
        if (windowHash === needleHash && haystack.slice(i, i + m) === needle) {
            return i;
        }
        // Roll the hash forward to the next window
        if (i < n - m) {
            windowHash = (((windowHash - BigInt(haystack.charCodeAt(i) - 97) * power) % MOD) + MOD) % MOD;
            windowHash = (windowHash * BASE + BigInt(haystack.charCodeAt(i + m) - 97)) % MOD;
        }
    }

    return -1;
};`,
};

// Distinct source code for Zigzag Conversion approaches.
export const zigzagSources: Record<string, string> = {
  grid: `var convert = function (s, numRows) {
    if (numRows === 1 || numRows >= s.length) return s;

    const grid = Array.from({ length: numRows }, () => new Array(s.length).fill(''));
    let row = 0, col = 0;
    let goingDown = true;

    for (let i = 0; i < s.length; i++) {
        grid[row][col] = s[i];

        if (goingDown) {
            if (row === numRows - 1) {
                // Switch to diagonal up-right
                row--;
                col++;
                goingDown = false;
            } else {
                row++;
            }
        } else {
            if (row === 0) {
                // Switch back to going down
                row++;
                goingDown = true;
            } else {
                row--;
                col++;
            }
        }
    }

    let result = '';
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < s.length; c++) {
            if (grid[r][c] !== '') {
                result += grid[r][c];
            }
        }
    }
    return result;
};`,
  rows: `var convert = function (s, numRows) {
    if (numRows === 1 || numRows >= s.length) {
        return s;
    }

    const rows = new Array(numRows).fill('');
    let currentRow = 0;
    let goingDown = false;

    for (const char of s) {
        rows[currentRow] += char;
        // Flip direction at top and bottom rows
        if (currentRow === 0 || currentRow === numRows - 1) {
            goingDown = !goingDown;
        }
        currentRow += goingDown ? 1 : -1;
    }

    return rows.join('');
}`,
};

// Distinct source code for Reverse Words in a String approaches.
export const reverseWordsSources: Record<string, string> = {
  split: `var reverseWords = function(s) {
    // Split by one or more spaces
    const words = s.split(/\\s+/).filter((w) => w.length > 0);
    // Reverse the array of words
    words.reverse();
    return words.join(" ");
}`,
  twopointer: `var reverseWords = function(s) {
    const result = [];
    let i = s.length - 1;
    while (i >= 0) {
        // Skip spaces
        while (i >= 0 && s[i] === ' ') {
            i--;
        }
        if (i < 0) {
            break;
        }
        // Find start of word
        let j = i;
        while (j >= 0 && s[j] !== ' ') {
            j--;
        }
        // Append word to result
        result.push(s.slice(j + 1, i + 1));
        i = j;
    }
    return result.join(" ");
}`,
};

// Distinct source code for Single Number approaches.
export const singleNumberSources: Record<string, string> = {
  brute: `var singleNumber = function(nums) {
    for (var i = 0; i < nums.length; i++) {
        var foundDuplicate = false;
        for (var j = 0; j < nums.length; j++) {
            if (i !== j && nums[i] === nums[j]) {
                foundDuplicate = true;
                break;
            }
        }
        if (!foundDuplicate) {
            return nums[i];
        }
    }
    return -1; // unreachable given problem constraints
};`,
  hashmap: `var singleNumber = function(nums) {
    var countMap = new Map();
    // Count occurrences of each number
    for (var i = 0; i < nums.length; i++) {
        countMap.set(nums[i], (countMap.get(nums[i]) || 0) + 1);
    }
    // Find the number that appears exactly once
    for (var [num, count] of countMap) {
        if (count === 1) {
            return num;
        }
    }
    return -1; // unreachable given problem constraints
};`,
};

// Distinct source code for Missing Number approaches.
export const missingNumberSources: Record<string, string> = {
  hashset: `var missingNumber = function(nums) {
    var n = nums.length;
    var numSet = new Set(nums);

    // Check which number in [0, n] is missing
    for (var i = 0; i <= n; i++) {
        if (!numSet.has(i)) {
            return i;
        }
    }

    return -1; // Should never reach here
};`,
  gauss: `var missingNumber = function(nums) {
    var n = nums.length;
    var expectedSum = n * (n + 1) / 2;
    var actualSum = 0;

    for (var i = 0; i < n; i++) {
        actualSum += nums[i];
    }

    return expectedSum - actualSum;
};`,
};

// Distinct source code for Set Mismatch approaches.
export const setMismatchSources: Record<string, string> = {
  sort: `var findErrorNums = function(nums) {
    nums.sort(function(a, b) { return a - b; });
    var n = nums.length;
    var duplicate = -1, missing = -1;

    // Check if 1 is missing
    if (nums[0] !== 1) {
        missing = 1;
    }

    for (var i = 1; i < n; i++) {
        if (nums[i] === nums[i - 1]) {
            duplicate = nums[i];
        } else if (nums[i] > nums[i - 1] + 1) {
            missing = nums[i - 1] + 1;
        }
    }

    // If missing is still not found, it must be n
    if (missing === -1) {
        missing = n;
    }

    return [duplicate, missing];
};`,
  hashmap: `var findErrorNums = function(nums) {
    var n = nums.length;
    var countMap = new Map();
    var duplicate = -1, missing = -1;

    // Count occurrences of each number
    for (var i = 0; i < n; i++) {
        countMap.set(nums[i], (countMap.get(nums[i]) || 0) + 1);
    }

    // Find the duplicate (count 2) and missing (count 0)
    for (var i = 1; i <= n; i++) {
        var count = countMap.get(i) || 0;
        if (count === 2) {
            duplicate = i;
        } else if (count === 0) {
            missing = i;
        }
    }

    return [duplicate, missing];
};`,
};

// Distinct source code for Power of Two approaches.
export const powerOfTwoSources: Record<string, string> = {
  iterative: `var isPowerOfTwo = function (n) {
  if (n <= 0) return false;

  // Keep dividing by 2 until we reach 1 or find an odd number
  while (n > 1) {
    if (n % 2 !== 0) return false;
    n = Math.floor(n / 2);
  }

  return true;
};`,
  bit: `var isPowerOfTwo = function (n) {
  // Power of two has exactly one bit set, so n & (n - 1) clears that bit
  return n > 0 && (n & (n - 1)) === 0;
};`,
};

// Distinct source code for Number of 1 Bits approaches.
export const hammingWeightSources: Record<string, string> = {
  bits: `var hammingWeight = function(n) {
    let count = 0;

    while (n !== 0) {
        // Check if the least significant bit is set
        count += n & 1;
        // Shift right to process the next bit
        n >>>= 1;
    }

    return count;
};`,
  kernighan: `var hammingWeight = function(n) {
    let count = 0;

    while (n !== 0) {
        // Clear the lowest set bit
        n = n & (n - 1);
        count++;
    }

    return count;
};`,
};

// Distinct source code for Counting Bits approaches.
export const countingBitsSources: Record<string, string> = {
  brute: `var countBits = function(n) {
    const ans = new Array(n + 1);
    for (let i = 0; i <= n; i++) {
        let count = 0;
        let num = i;
        // Count each 1-bit by checking the last bit and shifting right
        while (num > 0) {
            count += num & 1;
            num >>= 1;
        }
        ans[i] = count;
    }
    return ans;
};`,
  dp: `var countBits = function(n) {
    const ans = new Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++) {
        // Bit count of i = bit count of (i without last bit) + last bit
        ans[i] = ans[i >> 1] + (i & 1);
    }
    return ans;
};`,
};

// Distinct source code for Hamming Distance approaches.
export const hammingDistanceSources: Record<string, string> = {
  bits: `var hammingDistance = function(x, y) {
    var xor = x ^ y;
    var count = 0;

    // Check each bit by shifting right until no bits remain
    while (xor !== 0) {
        count += xor & 1;
        xor >>= 1;
    }

    return count;
};`,
  kernighan: `var hammingDistance = function(x, y) {
    var xor = x ^ y;
    var count = 0;

    // Each iteration clears the lowest set bit
    while (xor !== 0) {
        xor = xor & (xor - 1);
        count++;
    }

    return count;
};`,
};

// Distinct source code for Reverse Bits approaches.
export const reverseBitsSources: Record<string, string> = {
  bitwise: `var reverseBits = function(n) {
    var result = 0;
    for (var i = 0; i < 32; i++) {
        // Shift result left to make room, then add last bit of n
        result = (result << 1) | (n & 1);
        // Move to next bit of n
        n >>>= 1;
    }
    // Convert to unsigned 32-bit integer
    return result >>> 0;
};`,
  lookup: `// Precompute reversal for all 256 byte values
var TABLE = new Array(256);
for (var i = 0; i < 256; i++) {
    var reversed = 0, val = i;
    for (var j = 0; j < 8; j++) {
        reversed = (reversed << 1) | (val & 1);
        val >>= 1;
    }
    TABLE[i] = reversed;
}

var reverseBits = function(n) {
    // Reverse each byte and place in opposite position
    return ((TABLE[n & 0xFF] << 24)
          | (TABLE[(n >> 8) & 0xFF] << 16)
          | (TABLE[(n >> 16) & 0xFF] << 8)
          | (TABLE[(n >>> 24) & 0xFF])) >>> 0;
};`,
};

// Distinct source code for Bitwise AND of Numbers Range approaches.
export const rangeBitwiseAndSources: Record<string, string> = {
  brute: `var rangeBitwiseAnd = function(left, right) {
    let result = left;
    // i stays below right; AND in i + 1 each step
    for (let i = left; i < right; i++) {
        result &= i + 1;
        // Once result is 0, no AND operation can set bits back to 1
        if (result === 0) return 0;
    }
    return result;
};`,
  shift: `var rangeBitwiseAnd = function(left, right) {
    let shifts = 0;
    // Shift both numbers right until they share the same prefix
    while (left !== right) {
        left >>= 1;
        right >>= 1;
        shifts++;
    }
    // Shift the common prefix back to its original position
    return left << shifts;
};`,
};

// Distinct source code for Single Number II approaches.
export const singleNumberIISources: Record<string, string> = {
  hashmap: `var singleNumber = function (nums) {
  const countMap = new Map();

  // Count occurrences of each element
  for (const num of nums) {
    countMap.set(num, (countMap.get(num) || 0) + 1);
  }

  // Find the element that appears exactly once
  for (const [num, count] of countMap) {
    if (count === 1) {
      return num;
    }
  }

  return -1; // Should never reach here given valid input
};`,
  bitwise: `var singleNumber = function (nums) {
  let result = 0;

  // Process each of the 32 bit positions
  for (let i = 0; i < 32; i++) {
    let bitSum = 0;

    // Count how many numbers have a 1 at bit position i
    for (const num of nums) {
      bitSum += (num >> i) & 1;
    }

    // If the count mod 3 is 1, the single number has a 1 here
    if (bitSum % 3 === 1) {
      result |= 1 << i;
    }
  }

  // Convert to signed 32-bit integer (handles negative results)
  return result | 0;
};`,
};

// Distinct source code for Single Number III approaches.
export const singleNumberIIISources: Record<string, string> = {
  hashmap: `var singleNumber = function (nums) {
  const freq = new Map()
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1)
  }

  const result = []
  for (const [num, count] of freq) {
    if (count === 1) {
      result.push(num)
    }
  }
  return result
}`,
  sort: `var singleNumber = function (nums) {
  nums.sort((a, b) => a - b)
  const result = []
  let i = 0

  while (i < nums.length) {
    // If last element or doesn't match next, it's unique
    if (i === nums.length - 1 || nums[i] !== nums[i + 1]) {
      result.push(nums[i])
      i++
    } else {
      i += 2 // Skip the pair
    }
  }
  return result
}`,
};

// Distinct source code for Sum of Two Integers approaches.
export const getSumSources: Record<string, string> = {
  increment: `var getSum = function(a, b) {
    // Increment or decrement a by 1, b times
    while (b > 0) {
        a = -~a;  // a + 1 (bitwise)
        b = ~-b;  // b - 1 (bitwise)
    }
    while (b < 0) {
        a = ~-a;  // a - 1 (bitwise)
        b = -~b;  // b + 1 (bitwise)
    }
    return a;
};`,
  bitwise: `var getSum = function(a, b) {
    while (b !== 0) {
        var carry = (a & b) << 1;  // Carry: bits where both are 1, shifted left
        a = a ^ b;                 // Sum without carry: XOR
        b = carry;                 // Process remaining carry in next iteration
    }
    return a;
};`,
};

// Distinct source code for Design HashMap approaches.
export const designHashMapSources: Record<string, string> = {
  array: `class MyHashMap {
    constructor() {
        this.data = new Array(1000001).fill(-1);
    }

    put(key, value) {
        this.data[key] = value;
    }

    get(key) {
        return this.data[key];
    }

    remove(key) {
        this.data[key] = -1;
    }
}`,
  chaining: `class MyHashMap {
    constructor() {
        // The write-up uses 769; this demo shrinks it so the keys collide
        this.size = 5;
        this.buckets = new Array(this.size).fill(null);
    }

    _hash(key) {
        return key % this.size;
    }

    put(key, value) {
        const bucket = this._hash(key);
        let curr = this.buckets[bucket];
        while (curr !== null) {
            if (curr.key === key) {
                curr.value = value;
                return;
            }
            curr = curr.next;
        }
        this.buckets[bucket] = { key: key, value: value, next: this.buckets[bucket] };
    }

    get(key) {
        const bucket = this._hash(key);
        let curr = this.buckets[bucket];
        while (curr !== null) {
            if (curr.key === key) {
                return curr.value;
            }
            curr = curr.next;
        }
        return -1;
    }

    remove(key) {
        const bucket = this._hash(key);
        if (this.buckets[bucket] !== null && this.buckets[bucket].key === key) {
            this.buckets[bucket] = this.buckets[bucket].next;
            return;
        }
        let curr = this.buckets[bucket];
        while (curr !== null && curr.next !== null) {
            if (curr.next.key === key) {
                curr.next = curr.next.next;
                return;
            }
            curr = curr.next;
        }
    }
}`,
};

// Distinct source code for Contains Duplicate approaches.
export const containsDuplicateSources: Record<string, string> = {
  brute: `function containsDuplicate(nums) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] === nums[j]) {
                return true;
            }
        }
    }
    return false;
}`,
  sort: `function containsDuplicate(nums) {
    nums.sort((a, b) => a - b);
    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] === nums[i + 1]) {
            return true;
        }
    }
    return false;
}`,
};

// Distinct source code for Word Pattern approaches.
export const wordPatternSources: Record<string, string> = {
  twomap: `function wordPattern(pattern, s) {
    const words = s.split(" ");
    if (pattern.length !== words.length) return false;
    const charToWord = new Map();
    const wordToChar = new Map();
    for (let i = 0; i < pattern.length; i++) {
        const c = pattern[i];
        const word = words[i];
        // Check char -> word mapping
        if (charToWord.has(c)) {
            if (charToWord.get(c) !== word) return false;
        } else {
            charToWord.set(c, word);
        }
        // Check word -> char mapping
        if (wordToChar.has(word)) {
            if (wordToChar.get(word) !== c) return false;
        } else {
            wordToChar.set(word, c);
        }
    }
    return true;
}`,
  index: `function wordPattern(pattern, s) {
    const words = s.split(" ");
    if (pattern.length !== words.length) return false;
    const charFirst = new Map();
    const wordFirst = new Map();
    for (let i = 0; i < pattern.length; i++) {
        const c = pattern[i];
        const word = words[i];
        // Record first occurrence index for each
        if (!charFirst.has(c)) charFirst.set(c, i);
        if (!wordFirst.has(word)) wordFirst.set(word, i);
        // If the structural positions differ, pattern doesn't match
        if (charFirst.get(c) !== wordFirst.get(word)) return false;
    }
    return true;
}`,
};

// Distinct source code for First Unique Character approaches.
export const firstUniqCharSources: Record<string, string> = {
  brute: `function firstUniqChar(s) {
    for (let i = 0; i < s.length; i++) {
        let unique = true;
        for (let j = 0; j < s.length; j++) {
            if (i !== j && s[j] === s[i]) {
                unique = false;
                break;
            }
        }
        if (unique) {
            return i;
        }
    }
    return -1;
}`,
  freq: `function firstUniqChar(s) {
    const count = new Array(26).fill(0);
    for (let i = 0; i < s.length; i++) {
        count[s.charCodeAt(i) - 97]++;
    }
    for (let i = 0; i < s.length; i++) {
        if (count[s.charCodeAt(i) - 97] === 1) return i;
    }
    return -1;
}`,
};

// Distinct source code for Find All Numbers Disappeared approaches.
export const findDisappearedSources: Record<string, string> = {
  hashset: `function findDisappearedNumbers(nums) {
    const seen = new Set();
    for (const num of nums) {
        seen.add(num);
    }
    const result = [];
    for (let i = 1; i <= nums.length; i++) {
        if (!seen.has(i)) {
            result.push(i);
        }
    }
    return result;
}`,
  negation: `function findDisappearedNumbers(nums) {
    for (let i = 0; i < nums.length; i++) {
        const index = Math.abs(nums[i]) - 1;
        if (nums[index] > 0) {
            nums[index] = -nums[index];
        }
    }
    const result = [];
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > 0)
            result.push(i + 1);
    }
    return result;
}`,
};

// Distinct source code for Maximum Number of Balloons approaches.
export const maxBalloonsSources: Record<string, string> = {
  array: `function maxNumberOfBalloons(text) {
    const count = new Array(26).fill(0);
    for (const c of text) {
        count[c.charCodeAt(0) - 97]++;
    }
    let result = count['b'.charCodeAt(0) - 97]; // need 1 per balloon
    result = Math.min(result, count['a'.charCodeAt(0) - 97]);
    result = Math.min(result, Math.floor(count['l'.charCodeAt(0) - 97] / 2)); // need 2 per balloon
    result = Math.min(result, Math.floor(count['o'.charCodeAt(0) - 97] / 2)); // need 2 per balloon
    result = Math.min(result, count['n'.charCodeAt(0) - 97]);
    return result;
}`,
  hashmap: `function maxNumberOfBalloons(text) {
    const count = {};
    for (const c of text) {
        count[c] = (count[c] || 0) + 1;
    }
    let result = count['b'] || 0;
    result = Math.min(result, count['a'] || 0);
    result = Math.min(result, Math.floor((count['l'] || 0) / 2));
    result = Math.min(result, Math.floor((count['o'] || 0) / 2));
    result = Math.min(result, count['n'] || 0);
    return result;
}`,
};

// Distinct source code for Number of Good Pairs approaches.
export const numIdenticalPairsSources: Record<string, string> = {
  brute: `function numIdenticalPairs(nums) {
    let count = 0;
    const n = nums.length;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (nums[i] === nums[j]) {
                count++;
            }
        }
    }
    return count;
}`,
  freq: `function numIdenticalPairs(nums) {
    const freq = new Array(101).fill(0);
    for (const num of nums) {
        freq[num]++;
    }
    let count = 0;
    for (const k of freq) {
        count += Math.floor(k * (k - 1) / 2);
    }
    return count;
}`,
};

// Distinct source code for Isomorphic Strings approaches.
export const isIsomorphicSources: Record<string, string> = {
  brute: `function isIsomorphic(s, t) {
    if (s.length !== t.length) return false;
    for (let i = 0; i < s.length; i++) {
        for (let j = i + 1; j < s.length; j++) {
            if ((s[i] === s[j]) !== (t[i] === t[j])) {
                return false;
            }
        }
    }
    return true;
}`,
  twomap: `function isIsomorphic(s, t) {
    if (s.length !== t.length) return false;
    const mapST = new Map();
    const mapTS = new Map();
    for (let i = 0; i < s.length; i++) {
        const charS = s[i], charT = t[i];
        if (mapST.has(charS) && mapST.get(charS) !== charT) return false;
        if (mapTS.has(charT) && mapTS.get(charT) !== charS) return false;
        mapST.set(charS, charT);
        mapTS.set(charT, charS);
    }
    return true;
}`,
};

// Distinct source code for Ransom Note approaches.
export const canConstructSources: Record<string, string> = {
  brute: `function canConstruct(ransomNote, magazine) {
    const chars = magazine.split('');
    for (const ch of ransomNote) {
        let found = false;
        for (let i = 0; i < chars.length; i++) {
            if (chars[i] === ch) {
                chars[i] = null;
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
    }
    return true;
}`,
  sort: `function canConstruct(ransomNote, magazine) {
    const note = [...ransomNote].sort();
    const mag = [...magazine].sort();
    let i = 0;
    for (const ch of note) {
        while (i < mag.length && mag[i] < ch) {
            i++;
        }
        if (i === mag.length || mag[i] !== ch) {
            return false;
        }
        i++;
    }
    return true;
}`,
};

// Distinct source code for Contains Duplicate II approaches.
export const containsNearbyDuplicateSources: Record<string, string> = {
  brute: `function containsNearbyDuplicate(nums, k) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = Math.max(0, i - k); j < i; j++) {
            if (nums[i] === nums[j]) {
                return true;
            }
        }
    }
    return false;
}`,
  map: `function containsNearbyDuplicate(nums, k) {
    const last = new Map();
    for (let i = 0; i < nums.length; i++) {
        if (last.has(nums[i])) {
            const dist = i - last.get(nums[i]);
            if (dist <= k) {
                return true;
            }
        }
        last.set(nums[i], i);
    }
    return false;
}`,
};

// Distinct source code for Intersection of Two Arrays II approaches.
export const intersectSources: Record<string, string> = {
  brute: `function intersect(nums1, nums2) {
    const result = [];
    const used = new Array(nums2.length).fill(false);
    // For each element in nums1, find a matching unused element in nums2
    for (let i = 0; i < nums1.length; i++) {
        for (let j = 0; j < nums2.length; j++) {
            if (!used[j] && nums2[j] === nums1[i]) {
                result.push(nums1[i]);
                used[j] = true;
                break;
            }
        }
    }
    return result;
}`,
  map: `function intersect(nums1, nums2) {
    const count = new Map();
    for (const num of nums1) {
        count.set(num, (count.get(num) || 0) + 1);
    }
    const result = [];
    for (const num of nums2) {
        if ((count.get(num) || 0) > 0) {
            result.push(num);
            count.set(num, count.get(num) - 1);
        }
    }
    return result;
}`,
};

// Distinct source code for Group Anagrams approaches.
export const groupAnagramsSources: Record<string, string> = {
  sort: `function groupAnagrams(strs) {
    const groups = new Map();
    for (const s of strs) {
        // Sort characters to create a canonical key
        const key = s.split('').sort().join('');
        // Group strings with the same sorted key
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(s);
    }
    return Array.from(groups.values());
}`,
  freq: `function groupAnagrams(strs) {
    const anagramMap = new Map();

    for (const word of strs) {
        // Count character frequency
        const charCount = new Array(26).fill(0);
        for (const c of word) {
            charCount[c.charCodeAt(0) - 'a'.charCodeAt(0)]++;
        }

        // Build key based on character counts
        const keyParts = [];
        for (let i = 0; i < 26; i++) {
            if (charCount[i] > 0) {
                const char = String.fromCharCode(i + 'a'.charCodeAt(0));
                keyParts.push(char + ':' + charCount[i]);
            }
        }
        const key = keyParts.join(',');

        // Add word to group
        if (!anagramMap.has(key)) {
            anagramMap.set(key, []);
        }
        anagramMap.get(key).push(word);
    }

    return Array.from(anagramMap.values());
}`,
};

// Distinct source code for Encode and Decode TinyURL approaches.
export const tinyURLSources: Record<string, string> = {
  counter: `class Codec {
    constructor() {
        this.map = new Map();
        this.counter = 0;
    }

    encode(longUrl) {
        const key = this.counter++;
        this.map.set(key, longUrl);
        return "http://tinyurl.com/" + key;
    }

    decode(shortUrl) {
        const key = parseInt(
            shortUrl.replace("http://tinyurl.com/", ""));
        return this.map.get(key);
    }
}`,
  random: `class Codec {
    constructor() {
        this.code2url = new Map();
        this.url2code = new Map();
        this.chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        this.prefix = "http://tinyurl.com/";
    }

    generateKey() {
        let key = "";
        for (let i = 0; i < 6; i++) {
            key += this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        return key;
    }

    encode(longUrl) {
        if (this.url2code.has(longUrl)) {
            return this.prefix + this.url2code.get(longUrl);
        }
        let key = this.generateKey();
        while (this.code2url.has(key)) {
            key = this.generateKey();
        }
        this.code2url.set(key, longUrl);
        this.url2code.set(longUrl, key);
        return this.prefix + key;
    }

    decode(shortUrl) {
        const key = shortUrl.replace(this.prefix, "");
        return this.code2url.get(key);
    }
}`,
};

// Distinct source code for Reorganize String approaches.
export const reorganizeStringSources: Record<string, string> = {
  sort: `function reorganizeString(s) {
    const freq = new Array(26).fill(0);
    for (const c of s) {
        freq[c.charCodeAt(0) - 97]++;
    }
    const n = s.length;
    // Check impossibility
    if (Math.max(...freq) > Math.floor((n + 1) / 2)) return "";
    // Build sorted list of characters by frequency (descending)
    const sorted = [];
    for (let i = 0; i < 26; i++) {
        if (freq[i] > 0) sorted.push([freq[i], i]);
    }
    sorted.sort((a, b) => b[0] - a[0]);
    // Fill result at even indices first, then odd
    const result = new Array(n);
    let idx = 0;
    for (const [count, ch] of sorted) {
        let c = count;
        while (c-- > 0) {
            result[idx] = String.fromCharCode(ch + 97);
            idx += 2;
            if (idx >= n) idx = 1;
        }
    }
    return result.join("");
}`,
  heap: `function reorganizeString(s) {
    const freq = new Array(26).fill(0);
    for (const c of s) {
        freq[c.charCodeAt(0) - 97]++;
    }
    const n = s.length;
    if (Math.max(...freq) > Math.floor((n + 1) / 2)) return "";
    const heap = new MaxHeap();
    for (let i = 0; i < 26; i++) {
        if (freq[i] > 0) heap.push([freq[i], i]);
    }
    const result = [];
    let prev = null;
    while (heap.size() > 0) {
        const curr = heap.pop();
        // Push back previous character if it still has remaining count
        if (prev && prev[0] > 0) {
            heap.push(prev);
        }
        result.push(String.fromCharCode(curr[1] + 97));
        curr[0]--;
        prev = curr;
    }
    return result.join("");
}`,
};

// Distinct source code for Longest Consecutive Sequence approaches.
export const longestConsecutiveSources: Record<string, string> = {
  brute: `function longestConsecutive(nums) {
    let longestStreak = 0;
    for (const num of nums) {
        let currentNum = num;
        let currentStreak = 1;
        // Keep extending the sequence forward
        while (nums.includes(currentNum + 1)) {
            currentNum++;
            currentStreak++;
        }
        longestStreak = Math.max(longestStreak, currentStreak);
    }
    return longestStreak;
}`,
  sort: `function longestConsecutive(nums) {
    if (nums.length === 0) return 0;

    nums.sort((a, b) => a - b);
    let longest = 1;
    let current = 1;

    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === nums[i - 1]) {
            continue;
        } else if (nums[i] === nums[i - 1] + 1) {
            current += 1;
        } else {
            current = 1;
        }
        longest = Math.max(longest, current);
    }

    return longest;
}`,
};

// Distinct source code for Split Array into Consecutive Subsequences approaches.
export const isPossibleSources: Record<string, string> = {
  list: `function isPossible(nums) {
    const subs = [];
    for (const num of nums) {
        // Find the shortest open subsequence ending at num - 1
        let best = null;
        for (const sub of subs) {
            if (sub[sub.length - 1] === num - 1) {
                if (best === null || sub.length < best.length) {
                    best = sub;
                }
            }
        }
        if (best !== null) {
            best.push(num);
        } else {
            subs.push([num]);
        }
    }
    // Every subsequence must have length >= 3
    for (const sub of subs) {
        if (sub.length < 3) {
            return false;
        }
    }
    return true;
}`,
  greedy: `function isPossible(nums) {
    const freq = new Map();
    const tails = new Map();
    for (const num of nums) {
        freq.set(num, (freq.get(num) || 0) + 1);
    }
    for (const num of nums) {
        if ((freq.get(num) || 0) === 0) continue;
        if ((tails.get(num) || 0) > 0) {
            tails.set(num, tails.get(num) - 1);
            tails.set(num + 1, (tails.get(num + 1) || 0) + 1);
        } else if ((freq.get(num + 1) || 0) > 0
                && (freq.get(num + 2) || 0) > 0) {
            freq.set(num + 1, freq.get(num + 1) - 1);
            freq.set(num + 2, freq.get(num + 2) - 1);
            tails.set(num + 3, (tails.get(num + 3) || 0) + 1);
        } else {
            return false;
        }
        freq.set(num, freq.get(num) - 1);
    }
    return true;
}`,
};

// Distinct source code for Number of Matching Subsequences approaches.
export const numMatchingSubseqSources: Record<string, string> = {
  brute: `function numMatchingSubseq(s, words) {
    let count = 0;
    for (const word of words) {
        let i = 0;
        // Walk through s once, advancing i on each match
        for (const c of s) {
            if (i < word.length && c === word[i]) {
                i++;
            }
        }
        if (i === word.length) {
            count++;
        }
    }
    return count;
}`,
  buckets: `function numMatchingSubseq(s, words) {
    const buckets = Array.from({length: 26}, () => []);
    for (let i = 0; i < words.length; i++) {
        buckets[words[i].charCodeAt(0) - 97].push([i, 0]);
    }
    let count = 0;
    for (const c of s) {
        const current = buckets[c.charCodeAt(0) - 97];
        buckets[c.charCodeAt(0) - 97] = [];
        for (const [wordIdx, prevCharIdx] of current) {
            const charIdx = prevCharIdx + 1;
            if (charIdx === words[wordIdx].length) {
                count++;
            } else {
                const next = words[wordIdx].charCodeAt(charIdx) - 97;
                buckets[next].push([wordIdx, charIdx]);
            }
        }
    }
    return count;
}`,
};

// Distinct source code for Number of Good Ways to Split a String approaches.
export const numSplitsSources: Record<string, string> = {
  brute: `function numSplits(s) {
    const n = s.length;
    let count = 0;
    for (let i = 1; i < n; i++) {
        // Count distinct chars in left and right substrings
        const left = new Set(s.slice(0, i));
        const right = new Set(s.slice(i));
        if (left.size === right.size) count++;
    }
    return count;
}`,
  prefixsuffix: `function numSplits(s) {
    const n = s.length;
    // prefixDistinct[i] = distinct letters in s[0..i]
    const prefixDistinct = new Array(n);
    let seen = new Set();
    for (let i = 0; i < n; i++) {
        seen.add(s[i]);
        prefixDistinct[i] = seen.size;
    }

    // suffixDistinct[i] = distinct letters in s[i..n-1]
    const suffixDistinct = new Array(n);
    seen.clear();
    for (let i = n - 1; i >= 0; i--) {
        seen.add(s[i]);
        suffixDistinct[i] = seen.size;
    }

    let count = 0;
    // A split after i is good if prefixDistinct[i-1] == suffixDistinct[i]
    for (let i = 1; i < n; i++) {
        if (prefixDistinct[i - 1] === suffixDistinct[i]) {
            count++;
        }
    }
    return count;
}`,
};

// Distinct source code for Merge Sorted Array approaches.
export const mergeSortedArraySources: Record<string, string> = {
  sort: `function merge(nums1, m, nums2, n) {
  // Copy nums2 into the back of nums1
  for (let i = 0; i < n; i++) {
    nums1[m + i] = nums2[i]
  }

  // Sort the combined array
  nums1.sort(function (a, b) {
    return a - b
  })
}`,
  threepointers: `function merge(nums1, m, nums2, n) {
  let i = m - 1 // Pointer to end of valid nums1
  let j = n - 1 // Pointer to end of nums2
  let k = m + n - 1 // Pointer to end of nums1 (write position)

  // Merge from the back, placing the larger element first
  while (i >= 0 && j >= 0) {
    if (nums1[i] > nums2[j]) {
      nums1[k] = nums1[i]
      i--
    } else {
      nums1[k] = nums2[j]
      j--
    }
    k--
  }

  // Copy remaining elements from nums2 (if any)
  while (j >= 0) {
    nums1[k] = nums2[j]
    j--
    k--
  }
}`,
};

// Distinct source code for Merge Strings Alternately approaches.
export const mergeAlternatelySources: Record<string, string> = {
  twopointer: `function mergeAlternately(word1, word2) {
  let result = [];
  let i = 0;

  // Interleave characters while both strings have them
  while (i < word1.length && i < word2.length) {
    result.push(word1[i]);
    result.push(word2[i]);
    i++;
  }

  // Append any remaining characters from word1
  while (i < word1.length) {
    result.push(word1[i]);
    i++;
  }

  // Append any remaining characters from word2
  while (i < word2.length) {
    result.push(word2[i]);
    i++;
  }

  return result.join("");
}`,
  singleloop: `function mergeAlternately(word1, word2) {
  let result = [];
  let maxLen = Math.max(word1.length, word2.length);

  for (let i = 0; i < maxLen; i++) {
    // Add from word1 if characters remain
    if (i < word1.length) {
      result.push(word1[i]);
    }
    // Add from word2 if characters remain
    if (i < word2.length) {
      result.push(word2[i]);
    }
  }

  return result.join("");
}`,
};

// Distinct source code for Squares of a Sorted Array approaches.
export const sortedSquaresSources: Record<string, string> = {
  sort: `function sortedSquares(nums) {
    const n = nums.length;
    const result = new Array(n);
    // Square each element in place
    for (let i = 0; i < n; i++) {
        result[i] = nums[i] * nums[i];
    }
    // Sort the squared values ascending
    result.sort((a, b) => a - b);
    return result;
}`,
  twopointer: `function sortedSquares(nums) {
    const n = nums.length;
    const result = new Array(n);
    let left = 0;
    let right = n - 1;

    // Fill result from back to front with the larger square
    for (let pos = n - 1; pos >= 0; pos--) {
        const leftSq = nums[left] * nums[left];
        const rightSq = nums[right] * nums[right];

        if (leftSq > rightSq) {
            result[pos] = leftSq;
            left++;
        } else {
            result[pos] = rightSq;
            right--;
        }
    }

    return result;
}`,
};

// Distinct source code for Two Sum approaches.
export const twoSumSources: Record<string, string> = {
  brute: `function twoSum(nums, target) {
    // Check every pair of elements
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}`,
  map: `function twoSum(nums, target) {
    const seen = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        // Check if complement was seen before
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }

        // Store current value and its index
        seen.set(nums[i], i);
    }

    return [];
}`,
};

// Distinct source code for Backspace String Compare approaches.
export const backspaceCompareSources: Record<string, string> = {
  stack: `function backspaceCompare(s, t) {
  return buildString(s) === buildString(t);
};

function buildString(str) {
  const stack = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "#") {
      // Backspace: remove last character if there is one
      if (stack.length > 0) {
        stack.pop();
      }
    } else {
      stack.push(str[i]);
    }
  }
  return stack.join("");
}`,
  inplace: `function backspaceCompare(s, t) {
    const a = s.split("");
    const b = t.split("");
    const lenA = processInPlace(a);
    const lenB = processInPlace(b);

    if (lenA !== lenB) {
        return false;
    }
    for (let k = 0; k < lenA; k++) {
        if (a[k] !== b[k]) {
            return false;
        }
    }
    return true;
}

function processInPlace(arr) {
    let write = 0;
    for (let read = 0; read < arr.length; read++) {
        if (arr[read] === "#") {
            if (write > 0) {
                write--;
            }
        } else {
            arr[write] = arr[read];
            write++;
        }
    }
    return write;
}`,
};

// Distinct source code for Valid Word Abbreviation approaches.
export const validWordAbbrSources: Record<string, string> = {
  brute: `function validWordAbbreviation(word, abbr) {
    // Expand abbreviation into an array with wildcards
    const expanded = [];
    let j = 0;

    while (j < abbr.length) {
        const c = abbr[j];
        if (c >= "a" && c <= "z") {
            expanded.push(c);
            j++;
        } else {
            // Leading zero check
            if (c === "0") return false;
            // Parse the full number
            let num = 0;
            while (j < abbr.length && abbr[j] >= "0" && abbr[j] <= "9") {
                num = num * 10 + Number(abbr[j]);
                j++;
            }
            // Add wildcards for skipped characters
            for (let k = 0; k < num; k++) {
                expanded.push("*");
            }
        }
    }

    // Length must match
    if (expanded.length !== word.length) return false;

    // Compare character by character
    for (let i = 0; i < word.length; i++) {
        if (expanded[i] !== "*" && expanded[i] !== word[i]) {
            return false;
        }
    }
    return true;
}`,
  twopointer: `function validWordAbbreviation(word, abbr) {
  let i = 0; // pointer for word
  let j = 0; // pointer for abbreviation

  while (i < word.length && j < abbr.length) {
    if (abbr[j] >= "0" && abbr[j] <= "9") {
      // Leading zero is not allowed
      if (abbr[j] === "0") return false;

      // Parse the full number
      let num = 0;
      while (j < abbr.length && abbr[j] >= "0" && abbr[j] <= "9") {
        num = num * 10 + Number(abbr[j]);
        j++;
      }
      // Skip that many characters in word
      i += num;
    } else {
      // Letters must match exactly
      if (word[i] !== abbr[j]) return false;
      i++;
      j++;
    }
  }

  // Both pointers must reach the end
  return i === word.length && j === abbr.length;
}`,
};

// Distinct source code for Count Binary Substrings approaches.
export const countBinarySubstringsSources: Record<string, string> = {
  brute: `function countBinarySubstrings(s) {
    let count = 0;
    const n = s.length;

    for (let i = 0; i < n; i++) {
        for (let len = 2; i + len <= n; len += 2) {
            const half = len / 2;
            const firstChar = s[i];
            let valid = true;

            // First half must be all the same character
            for (let k = i; k < i + half; k++) {
                if (s[k] !== firstChar) {
                    valid = false;
                    break;
                }
            }

            // Second half must be all the opposite character
            if (valid) {
                const secondChar = firstChar === '0' ? '1' : '0';
                for (let k = i + half; k < i + len; k++) {
                    if (s[k] !== secondChar) {
                        valid = false;
                        break;
                    }
                }
            }

            if (valid) {
                count++;
            }
        }
    }

    return count;
}`,
  group: `function countBinarySubstrings(s) {
    // Step 1: Build group sizes array
    const groups = [];
    let i = 0;
    const n = s.length;

    while (i < n) {
        const ch = s[i];
        let groupSize = 0;
        while (i < n && s[i] === ch) {
            groupSize++;
            i++;
        }
        groups.push(groupSize);
    }

    // Step 2: Sum min of adjacent pairs
    let count = 0;
    for (let j = 0; j < groups.length - 1; j++) {
        count += Math.min(groups[j], groups[j + 1]);
    }

    return count;
}`,
};

// Distinct source code for Two Sum II approaches.
export const twoSumIISortedSources: Record<string, string> = {
  brute: `function twoSum(numbers, target) {
    const n = numbers.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            if (numbers[i] + numbers[j] === target) {
                return [i + 1, j + 1]; // 1-indexed
            }
        }
    }
    return [-1, -1]; // unreachable since solution is guaranteed
}`,
  binary: `function twoSum(numbers, target) {
    const n = numbers.length;
    for (let i = 0; i < n - 1; i++) {
        const complement = target - numbers[i];
        // Binary search for complement in numbers[i+1..n-1]
        let left = i + 1, right = n - 1;
        while (left <= right) {
            const mid = left + Math.floor((right - left) / 2);
            if (numbers[mid] === complement) {
                return [i + 1, mid + 1];
            } else if (numbers[mid] < complement) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return [-1, -1];
}`,
};

// Distinct source code for Container With Most Water approaches.
export const maxAreaSources: Record<string, string> = {
  brute: `function maxArea(height) {
    let maxArea = 0;
    const n = height.length;

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const width = j - i;
            const h = Math.min(height[i], height[j]);
            maxArea = Math.max(maxArea, width * h);
        }
    }

    return maxArea;
}`,
  twopointer: `function maxArea(height) {
    let left = 0;
    let right = height.length - 1;
    let maxArea = 0;

    while (left < right) {
        // Area = width * height of shorter line
        const width = right - left;
        const h = Math.min(height[left], height[right]);
        maxArea = Math.max(maxArea, width * h);

        // Move the pointer at the shorter line
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxArea;
}`,
};

// Distinct source code for 3Sum approaches.
export const threeSumSources: Record<string, string> = {
  brute: `function threeSum(nums) {
    const resultSet = new Set();
    const n = nums.length;

    for (let i = 0; i < n - 2; i++) {
        for (let j = i + 1; j < n - 1; j++) {
            for (let k = j + 1; k < n; k++) {
                if (nums[i] + nums[j] + nums[k] === 0) {
                    // Sort the triplet to avoid duplicate entries
                    const triplet = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
                    resultSet.add(triplet.join(","));
                }
            }
        }
    }

    return Array.from(resultSet).map(s => s.split(",").map(Number));
}`,
  hashset: `function threeSum(nums) {
    const result = [];
    nums.sort((a, b) => a - b);
    const n = nums.length;

    for (let i = 0; i < n - 2; i++) {
        // Skip duplicate values for the first element
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        const target = -nums[i];
        const seen = new Set();

        for (let j = i + 1; j < n; j++) {
            const complement = target - nums[j];

            if (seen.has(complement)) {
                result.push([nums[i], complement, nums[j]]);
                // Skip duplicates for the third element
                while (j + 1 < n && nums[j] === nums[j + 1]) j++;
            }
            seen.add(nums[j]);
        }
    }

    return result;
}`,
};

// Distinct source code for 4Sum approaches.
export const fourSumSources: Record<string, string> = {
  brute: `function fourSum(nums, target) {
  const n = nums.length;
  nums.sort((a, b) => a - b);
  const seen = new Set();
  const result = [];

  for (let i = 0; i < n - 3; i++) {
    for (let j = i + 1; j < n - 2; j++) {
      for (let k = j + 1; k < n - 1; k++) {
        for (let l = k + 1; l < n; l++) {
          if (nums[i] + nums[j] + nums[k] + nums[l] === target) {
            const key = nums[i] + ',' + nums[j] + ',' + nums[k] + ',' + nums[l];
            if (!seen.has(key)) {
              seen.add(key);
              result.push([nums[i], nums[j], nums[k], nums[l]]);
            }
          }
        }
      }
    }
  }

  return result;
}`,
  twopointer: `function fourSum(nums, target) {
  const result = [];
  const n = nums.length;
  nums.sort((a, b) => a - b);

  for (let i = 0; i < n - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    for (let j = i + 1; j < n - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;
      let left = j + 1;
      let right = n - 1;
      while (left < right) {
        const sum = nums[i] + nums[j] + nums[left] + nums[right];
        if (sum === target) {
          result.push([nums[i], nums[j], nums[left], nums[right]]);
          while (left < right && nums[left] === nums[left + 1]) left++;
          while (left < right && nums[right] === nums[right - 1]) right--;
          left++;
          right--;
        } else if (sum < target) {
          left++;
        } else {
          right--;
        }
      }
    }
  }

  return result;
}`,
};

// Distinct source code for Trapping Rain Water approaches.
export const trapSources: Record<string, string> = {
  brute: `function trap(height) {
  const n = height.length
  let totalWater = 0

  for (let i = 0; i < n; i++) {
    // Find the tallest bar to the left (including i)
    let maxLeft = 0
    for (let j = 0; j <= i; j++) {
      maxLeft = Math.max(maxLeft, height[j])
    }

    // Find the tallest bar to the right (including i)
    let maxRight = 0
    for (let j = i; j < n; j++) {
      maxRight = Math.max(maxRight, height[j])
    }

    // Water above this bar
    totalWater += Math.min(maxLeft, maxRight) - height[i]
  }

  return totalWater
}`,
  prefixmax: `function trap(height) {
  const n = height.length

  // Build prefix max from the left
  const leftMax = new Array(n)
  leftMax[0] = height[0]
  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], height[i])
  }

  // Build prefix max from the right
  const rightMax = new Array(n)
  rightMax[n - 1] = height[n - 1]
  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], height[i])
  }

  // Compute trapped water at each position
  let totalWater = 0
  for (let i = 0; i < n; i++) {
    totalWater += Math.min(leftMax[i], rightMax[i]) - height[i]
  }

  return totalWater
}`,
};

// Distinct source code for Range Sum Query - Immutable approaches.
export const rangeSumSources: Record<string, string> = {
  brute: `function NumArray(nums) {
  this.nums = nums;
}
NumArray.prototype.sumRange = function (left, right) {
  let sum = 0;
  for (let i = left; i <= right; i++) {
    sum += this.nums[i];
  }
  return sum;
}`,
  prefix: `function NumArray(nums) {
  // Build prefix sum array where prefix[i] = sum of nums[0..i-1]
  this.prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) {
    this.prefix[i + 1] = this.prefix[i] + nums[i];
  }
}
NumArray.prototype.sumRange = function (left, right) {
  return this.prefix[right + 1] - this.prefix[left];
}`,
};

// Distinct source code for Find Pivot Index approaches.
export const pivotIndexSources: Record<string, string> = {
  brute: `function pivotIndex(nums) {
    var n = nums.length;

    for (var i = 0; i < n; i++) {
        var leftSum = 0;
        var rightSum = 0;

        // Compute left sum for index i
        for (var j = 0; j < i; j++) {
            leftSum += nums[j];
        }

        // Compute right sum for index i
        for (var j = i + 1; j < n; j++) {
            rightSum += nums[j];
        }

        if (leftSum === rightSum) {
            return i;
        }
    }

    return -1;
}`,
  prefix: `function pivotIndex(nums) {
    var totalSum = 0;
    for (var i = 0; i < nums.length; i++) {
        totalSum += nums[i];
    }

    var leftSum = 0;
    for (var i = 0; i < nums.length; i++) {
        // Right sum is everything except leftSum and nums[i]
        var rightSum = totalSum - leftSum - nums[i];
        if (leftSum === rightSum) {
            return i;
        }
        leftSum += nums[i];
    }

    return -1;
}`,
};

// Distinct source code for Maximum Population Year approaches.
export const maxPopSources: Record<string, string> = {
  brute: `function maximumPopulation(logs) {
    var maxPop = 0;
    var resultYear = 0;

    for (var year = 1950; year <= 2050; year++) {
        var count = 0;
        for (var i = 0; i < logs.length; i++) {
            // Person is alive if birth <= year < death
            if (logs[i][0] <= year && year < logs[i][1]) {
                count++;
            }
        }
        if (count > maxPop) {
            maxPop = count;
            resultYear = year;
        }
    }

    return resultYear;
}`,
  sweep: `function maximumPopulation(logs) {
    var delta = new Array(101).fill(0); // years 1950 to 2050

    // Record birth and death events
    for (var i = 0; i < logs.length; i++) {
        delta[logs[i][0] - 1950]++;
        delta[logs[i][1] - 1950]--;
    }

    // Sweep to find the year with maximum population
    var maxPop = 0;
    var runningSum = 0;
    var resultYear = 1950;

    for (var j = 0; j < 101; j++) {
        runningSum += delta[j];
        if (runningSum > maxPop) {
            maxPop = runningSum;
            resultYear = 1950 + j;
        }
    }

    return resultYear;
}`,
};

// Distinct source code for Subarray Sum Equals K approaches.
export const subarraySumSources: Record<string, string> = {
  brute: `function subarraySum(nums, k) {
  let count = 0
  for (let i = 0; i < nums.length; i++) {
    let sum = 0
    for (let j = i; j < nums.length; j++) {
      sum += nums[j]
      if (sum === k) {
        count++
      }
    }
  }
  return count
}`,
  map: `function subarraySum(nums, k) {
  let count = 0
  let prefixSum = 0
  // Map from prefix sum value to how many times we've seen it
  const prefixCount = new Map()
  prefixCount.set(0, 1) // Empty prefix (sum = 0) seen once

  for (const num of nums) {
    prefixSum += num
    // How many earlier prefix sums form a valid subarray ending here?
    count += prefixCount.get(prefixSum - k) || 0
    prefixCount.set(prefixSum, (prefixCount.get(prefixSum) || 0) + 1)
  }
  return count
}`,
};

// Distinct source code for Subarray Sums Divisible by K approaches.
export const subarraysDivByKSources: Record<string, string> = {
  brute: `function subarraysDivByK(nums, k) {
  let count = 0
  for (let i = 0; i < nums.length; i++) {
    let sum = 0
    for (let j = i; j < nums.length; j++) {
      sum += nums[j]
      if (sum % k === 0) {
        count++
      }
    }
  }
  return count
}`,
  map: `function subarraysDivByK(nums, k) {
  // Map to count occurrences of each remainder
  const remainderCount = new Map([[0, 1]]) // empty prefix has remainder 0
  let prefixSum = 0
  let count = 0

  for (const num of nums) {
    prefixSum += num
    // Normalize remainder to handle negative prefix sums
    const remainder = ((prefixSum % k) + k) % k

    // Each previous prefix sum with the same remainder forms a valid subarray
    const prev = remainderCount.get(remainder) || 0
    count += prev
    remainderCount.set(remainder, prev + 1)
  }

  return count
}`,
};

// Distinct source code for Continuous Subarray Sum approaches.
export const checkSubarraySumSources: Record<string, string> = {
  brute: `function checkSubarraySum(nums, k) {
    const n = nums.length;
    for (let i = 0; i < n - 1; i++) {
        let sum = nums[i];
        for (let j = i + 1; j < n; j++) {
            sum += nums[j];
            // Check if subarray sum is a multiple of k
            if (sum % k === 0) {
                return true;
            }
        }
    }
    return false;
}`,
  map: `function checkSubarraySum(nums, k) {
    // Map: remainder -> earliest index where this remainder was seen
    const remainderIndex = new Map();
    // Handle subarrays starting from index 0
    remainderIndex.set(0, -1);
    let prefixSum = 0;

    for (let i = 0; i < nums.length; i++) {
        prefixSum += nums[i];
        const remainder = prefixSum % k;

        if (remainderIndex.has(remainder)) {
            // Same remainder seen before, check if subarray length >= 2
            if (i - remainderIndex.get(remainder) >= 2) {
                return true;
            }
        } else {
            // Only store the first occurrence to maximize subarray length
            remainderIndex.set(remainder, i);
        }
    }
    return false;
}`,
};

// Distinct source code for Contiguous Array approaches.
export const findMaxLengthSources: Record<string, string> = {
  brute: `function findMaxLength(nums) {
    let maxLen = 0;
    for (let i = 0; i < nums.length; i++) {
        let zeros = 0, ones = 0;
        for (let j = i; j < nums.length; j++) {
            if (nums[j] === 0) zeros++;
            else ones++;
            if (zeros === ones) {
                maxLen = Math.max(maxLen, j - i + 1);
            }
        }
    }
    return maxLen;
}`,
  map: `function findMaxLength(nums) {
    // Map stores first occurrence of each prefix sum
    const map = new Map();
    map.set(0, -1); // handle subarrays starting from index 0
    let prefixSum = 0;
    let maxLen = 0;

    for (let i = 0; i < nums.length; i++) {
        // Treat 0 as -1: equal 0s and 1s means sum = 0
        prefixSum += nums[i] === 1 ? 1 : -1;

        if (map.has(prefixSum)) {
            maxLen = Math.max(maxLen, i - map.get(prefixSum));
        } else {
            map.set(prefixSum, i);
        }
    }
    return maxLen;
}`,
};

// Distinct source code for Maximum Average Subarray I approaches.
export const maxAvgSources: Record<string, string> = {
  brute: `function findMaxAverage(nums, k) {
    let maxSum = -Infinity;

    for (let i = 0; i <= nums.length - k; i++) {
        let windowSum = 0;
        for (let j = i; j < i + k; j++) {
            windowSum += nums[j];
        }
        maxSum = Math.max(maxSum, windowSum);
    }

    return maxSum / k;
}`,
  sliding: `function findMaxAverage(nums, k) {
    // Compute sum of the first window
    let windowSum = 0;
    for (let i = 0; i < k; i++) {
        windowSum += nums[i];
    }

    let maxSum = windowSum;

    // Slide the window: add new element, remove old element
    for (let i = k; i < nums.length; i++) {
        windowSum += nums[i] - nums[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }

    return maxSum / k;
}`,
};

// Distinct source code for Find All Anagrams in a String approaches.
export const findAnagramsSources: Record<string, string> = {
  brute: `function findAnagrams(s, p) {
    const result = [];
    const pLen = p.length;
    const sLen = s.length;
    if (sLen < pLen) return result;

    const sortedP = p.split('').sort().join('');

    for (let i = 0; i <= sLen - pLen; i++) {
        const window = s.substring(i, i + pLen).split('').sort().join('');
        if (window === sortedP) {
            result.push(i);
        }
    }
    return result;
}`,
  freq: `function findAnagrams(s, p) {
    const result = [];
    const sLen = s.length, pLen = p.length;
    if (sLen < pLen) return result;

    const pCount = new Array(26).fill(0);
    const windowCount = new Array(26).fill(0);

    // Build frequency maps for p and the first window
    for (let i = 0; i < pLen; i++) {
        pCount[p.charCodeAt(i) - 97]++;
        windowCount[s.charCodeAt(i) - 97]++;
    }

    if (pCount.every((val, idx) => val === windowCount[idx])) result.push(0);

    // Slide the window across s
    for (let i = pLen; i < sLen; i++) {
        windowCount[s.charCodeAt(i) - 97]++;             // add new char
        windowCount[s.charCodeAt(i - pLen) - 97]--;       // remove old char
        if (pCount.every((val, idx) => val === windowCount[idx])) {
            result.push(i - pLen + 1);
        }
    }
    return result;
}`,
};

// Distinct source code for Permutation in String approaches.
export const checkInclusionSources: Record<string, string> = {
  brute: `function checkInclusion(s1, s2) {
  const perms = [];
  generatePermutations(s1.split(""), 0, perms);

  // Check if any permutation is a substring of s2
  for (let i = 0; i < perms.length; i++) {
    if (s2.includes(perms[i])) {
      return true;
    }
  }

  return false;
}
function generatePermutations(arr, index, result) {
  if (index === arr.length) {
    result.push(arr.join(""));
    return;
  }
  for (let i = index; i < arr.length; i++) {
    const temp = arr[index];
    arr[index] = arr[i];
    arr[i] = temp;

    generatePermutations(arr, index + 1, result);

    arr[i] = arr[index];
    arr[index] = temp;
  }
}`,
  sliding: `function checkInclusion(s1, s2) {
  const n = s1.length,
    m = s2.length;
  if (n > m) return false;

  const s1Freq = new Array(26).fill(0);
  const windowFreq = new Array(26).fill(0);

  // Build frequency arrays for s1 and the first window
  for (let i = 0; i < n; i++) {
    s1Freq[s1.charCodeAt(i) - 97]++;
    windowFreq[s2.charCodeAt(i) - 97]++;
  }

  if (matches(s1Freq, windowFreq)) return true;

  // Slide the window across s2
  for (let i = n; i < m; i++) {
    windowFreq[s2.charCodeAt(i) - 97]++;         // Add new char
    windowFreq[s2.charCodeAt(i - n) - 97]--;     // Remove old char
    if (matches(s1Freq, windowFreq)) return true;
  }

  return false;
}
function matches(a, b) {
  for (let i = 0; i < 26; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}`,
};

// Distinct source code for Maximum Sum of Distinct Subarrays With Length K approaches.
export const maxDistinctSources: Record<string, string> = {
  brute: `function maximumSubarraySum(nums, k) {
  let maxSum = 0
  for (let i = 0; i <= nums.length - k; i++) {
    const seen = new Set()
    let sum = 0
    let valid = true
    for (let j = i; j < i + k; j++) {
      // If element already in set, this subarray has duplicates
      if (seen.has(nums[j])) {
        valid = false
        break
      }
      seen.add(nums[j])
      sum += nums[j]
    }
    if (valid) {
      maxSum = Math.max(maxSum, sum)
    }
  }
  return maxSum
}`,
  sliding: `function maximumSubarraySum(nums, k) {
  const freq = new Map()
  let windowSum = 0
  let maxSum = 0

  // Build the first window of size k
  for (let i = 0; i < k; i++) {
    freq.set(nums[i], (freq.get(nums[i]) || 0) + 1)
    windowSum += nums[i]
  }
  // Check if the first window has all distinct elements
  if (freq.size === k) {
    maxSum = windowSum
  }

  // Slide the window across the rest of the array
  for (let i = k; i < nums.length; i++) {
    // Add the new element entering the window
    freq.set(nums[i], (freq.get(nums[i]) || 0) + 1)
    windowSum += nums[i]

    // Remove the element leaving the window
    const outVal = nums[i - k]
    freq.set(outVal, freq.get(outVal) - 1)
    if (freq.get(outVal) === 0) {
      freq.delete(outVal)
    }
    windowSum -= outVal

    // Window is valid only when all k elements are distinct
    if (freq.size === k) {
      maxSum = Math.max(maxSum, windowSum)
    }
  }
  return maxSum
}`,
};

// Distinct source code for Substring with Concatenation of All Words approaches.
export const findSubstringSources: Record<string, string> = {
  brute: `function findSubstring(s, words) {
    const result = [];
    const w = words[0].length;
    const m = words.length;
    const totalLen = m * w;
    if (s.length < totalLen) return result;

    // Build target frequency map
    const target = new Map();
    for (const word of words) {
        target.set(word, (target.get(word) || 0) + 1);
    }

    for (let i = 0; i <= s.length - totalLen; i++) {
        const seen = new Map();
        let valid = true;
        for (let j = 0; j < m; j++) {
            const chunk = s.substring(i + j * w, i + j * w + w);
            seen.set(chunk, (seen.get(chunk) || 0) + 1);
            // Early exit if any chunk exceeds target count
            if (seen.get(chunk) > (target.get(chunk) || 0)) {
                valid = false;
                break;
            }
        }
        if (valid) result.push(i);
    }
    return result;
}`,
  sliding: `function findSubstring(s, words) {
    const result = [];
    const w = words[0].length;
    const m = words.length;
    const totalLen = m * w;
    if (s.length < totalLen) return result;

    // Build target frequency map
    const target = new Map();
    for (const word of words) {
        target.set(word, (target.get(word) || 0) + 1);
    }
    const distinctWords = target.size;

    // Try each starting offset
    for (let k = 0; k < w; k++) {
        const seen = new Map();
        let matchCount = 0;
        let left = k;

        for (let right = k; right + w <= s.length; right += w) {
            const rightWord = s.substring(right, right + w);

            // Add right word to window
            if (target.has(rightWord)) {
                const count = (seen.get(rightWord) || 0) + 1;
                seen.set(rightWord, count);
                if (count === target.get(rightWord)) matchCount++;
                else if (count === target.get(rightWord) + 1) matchCount--;
            }

            // Shrink window if it exceeds m words
            if (right - left >= totalLen) {
                const leftWord = s.substring(left, left + w);
                if (target.has(leftWord)) {
                    const count = seen.get(leftWord);
                    if (count === target.get(leftWord)) matchCount--;
                    seen.set(leftWord, count - 1);
                    if (count - 1 === target.get(leftWord)) matchCount++;
                }
                left += w;
            }

            if (matchCount === distinctWords) result.push(left);
        }
    }
    return result;
}`,
};

// Distinct source code for Longest Substring Without Repeating Characters approaches.
export const longSubNoRepeatSources: Record<string, string> = {
  brute: `function lengthOfLongestSubstring(s) {
  const n = s.length;
  let maxLen = 0;

  for (let i = 0; i < n; i++) {
    const seen = new Set();
    for (let j = i; j < n; j++) {
      if (seen.has(s[j])) break;
      seen.add(s[j]);
      maxLen = Math.max(maxLen, j - i + 1);
    }
  }

  return maxLen;
}`,
  sliding: `function lengthOfLongestSubstring(s) {
  const window = new Set();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    // Shrink window until duplicate is removed
    while (window.has(s[right])) {
      window.delete(s[left]);
      left++;
    }
    window.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}`,
};

// Distinct source code for Longest Repeating Character Replacement approaches.
export const charReplacementSources: Record<string, string> = {
  brute: `function characterReplacement(s, k) {
    const n = s.length;
    let maxLen = 0;
    for (let left = 0; left < n; left++) {
        const freq = new Array(26).fill(0);
        let maxFreq = 0;
        for (let right = left; right < n; right++) {
            const idx = s.charCodeAt(right) - 65; // 'A' = 65
            freq[idx]++;
            maxFreq = Math.max(maxFreq, freq[idx]);
            const windowLen = right - left + 1;
            if (windowLen - maxFreq <= k) {
                maxLen = Math.max(maxLen, windowLen);
            } else {
                // More replacements needed than allowed, stop expanding
                break;
            }
        }
    }
    return maxLen;
}`,
  sliding: `function characterReplacement(s, k) {
    const freq = new Array(26).fill(0);
    let left = 0, maxLen = 0;

    for (let right = 0; right < s.length; right++) {
        freq[s.charCodeAt(right) - 65]++;

        // Shrink window until it's valid
        while ((right - left + 1) - Math.max(...freq) > k) {
            freq[s.charCodeAt(left) - 65]--;
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
};

// Distinct source code for Minimum Size Subarray Sum approaches.
export const minSubArrayLenSources: Record<string, string> = {
  brute: `function minSubArrayLen(target, nums) {
  const n = nums.length
  let minLen = n + 1

  for (let i = 0; i < n; i++) {
    let sum = 0
    for (let j = i; j < n; j++) {
      sum += nums[j]
      if (sum >= target) {
        minLen = Math.min(minLen, j - i + 1)
        break // shortest subarray starting at i found
      }
    }
  }

  return minLen === n + 1 ? 0 : minLen
}`,
  sliding: `function minSubArrayLen(target, nums) {
  const n = nums.length
  let left = 0
  let currentSum = 0
  let minLen = n + 1

  for (let right = 0; right < n; right++) {
    currentSum += nums[right]

    // Shrink window while sum meets the target
    while (currentSum >= target) {
      minLen = Math.min(minLen, right - left + 1)
      currentSum -= nums[left]
      left++
    }
  }

  return minLen === n + 1 ? 0 : minLen
}`,
};

// Distinct source code for Max Consecutive Ones III approaches.
export const longestOnesSources: Record<string, string> = {
  brute: `function longestOnes(nums, k) {
    let maxLen = 0;
    for (let i = 0; i < nums.length; i++) {
        let zeroCount = 0;
        for (let j = i; j < nums.length; j++) {
            if (nums[j] === 0) {
                zeroCount++;
            }
            if (zeroCount > k) {
                break;
            }
            maxLen = Math.max(maxLen, j - i + 1);
        }
    }
    return maxLen;
}`,
  sliding: `function longestOnes(nums, k) {
    let left = 0;
    let zeroCount = 0;
    let maxLen = 0;

    for (let right = 0; right < nums.length; right++) {
        if (nums[right] === 0) {
            zeroCount++;
        }
        // Shrink window until we have at most k zeros
        while (zeroCount > k) {
            if (nums[left] === 0) {
                zeroCount--;
            }
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
};

// Distinct source code for Minimum Window Substring approaches.
export const minWindowSources: Record<string, string> = {
  brute: `function minWindow(s, t) {
    const m = s.length, n = t.length;
    if (n > m) return "";

    // Build frequency map for t
    const tFreq = new Array(128).fill(0);
    for (const c of t) tFreq[c.charCodeAt(0)]++;

    let bestStart = 0, bestLen = Infinity;

    for (let i = 0; i < m; i++) {
        const windowFreq = new Array(128).fill(0);
        for (let j = i; j < m; j++) {
            windowFreq[s.charCodeAt(j)]++;
            // Check if window contains all characters of t
            if (j - i + 1 >= n && tFreq.every((f, k) => windowFreq[k] >= f)) {
                if (j - i + 1 < bestLen) {
                    bestStart = i;
                    bestLen = j - i + 1;
                }
                break;
            }
        }
    }
    return bestLen === Infinity ? "" : s.substring(bestStart, bestStart + bestLen);
}`,
  sliding: `function minWindow(s, t) {
    const m = s.length, n = t.length;
    if (n > m) return "";

    // Frequency map for t
    const tCount = new Map();
    for (const c of t) {
        tCount.set(c, (tCount.get(c) || 0) + 1);
    }

    const required = tCount.size; // Distinct chars in t that must be satisfied
    let formed = 0;               // Distinct chars currently meeting required freq
    const windowCount = new Map();

    let bestStart = 0, bestLen = Infinity;
    let left = 0;

    for (let right = 0; right < m; right++) {
        const c = s[right];
        windowCount.set(c, (windowCount.get(c) || 0) + 1);

        // Check if this character's frequency requirement is now met
        if (tCount.has(c) && windowCount.get(c) === tCount.get(c)) {
            formed++;
        }

        // Shrink the window from the left while it remains valid
        while (formed === required) {
            if (right - left + 1 < bestLen) {
                bestStart = left;
                bestLen = right - left + 1;
            }
            const leftChar = s[left];
            windowCount.set(leftChar, windowCount.get(leftChar) - 1);
            if (tCount.has(leftChar) && windowCount.get(leftChar) < tCount.get(leftChar)) {
                formed--;
            }
            left++;
        }
    }
    return bestLen === Infinity ? "" : s.substring(bestStart, bestStart + bestLen);
}`,
};

// Distinct source code for Maximum Subarray approaches.
export const maxSubArraySources: Record<string, string> = {
  brute: `function maxSubArray(nums) {
  let maxSum = nums[0]

  for (let i = 0; i < nums.length; i++) {
    let currentSum = 0
    for (let j = i; j < nums.length; j++) {
      currentSum += nums[j]
      maxSum = Math.max(maxSum, currentSum)
    }
  }

  return maxSum
}`,
  kadane: `function maxSubArray(nums) {
  let currentSum = nums[0]
  let maxSum = nums[0]

  for (let i = 1; i < nums.length; i++) {
    // Either extend the previous subarray or start a new one here
    currentSum = Math.max(nums[i], currentSum + nums[i])
    maxSum = Math.max(maxSum, currentSum)
  }

  return maxSum
}`,
};

// Distinct source code for Maximum Sum Circular Subarray approaches.
export const maxCircularSources: Record<string, string> = {
  brute: `function maxSubarraySumCircular(nums) {
  const n = nums.length
  let maxSum = -Infinity

  for (let i = 0; i < n; i++) {
    let currentSum = 0
    for (let j = 0; j < n; j++) {
      currentSum += nums[(i + j) % n]
      maxSum = Math.max(maxSum, currentSum)
    }
  }

  return maxSum
}`,
  kadane: `function maxSubarraySumCircular(nums) {
  let currentMax = 0,
    maxSum = nums[0]
  let currentMin = 0,
    minSum = nums[0]
  let totalSum = 0

  for (const num of nums) {
    // Kadane's for maximum subarray
    currentMax = Math.max(currentMax + num, num)
    maxSum = Math.max(maxSum, currentMax)

    // Kadane's for minimum subarray
    currentMin = Math.min(currentMin + num, num)
    minSum = Math.min(minSum, currentMin)

    totalSum += num
  }

  // If all negative, return the least negative element
  if (maxSum < 0) return maxSum

  return Math.max(maxSum, totalSum - minSum)
}`,
};

// Distinct source code for Maximum Product Subarray approaches.
export const maxProductSources: Record<string, string> = {
  brute: `function maxProduct(nums) {
  let maxProd = nums[0]

  for (let i = 0; i < nums.length; i++) {
    let currentProduct = 1
    for (let j = i; j < nums.length; j++) {
      currentProduct *= nums[j]
      maxProd = Math.max(maxProd, currentProduct)
    }
  }

  return maxProd
}`,
  dp: `function maxProduct(nums) {
  let maxSoFar = nums[0]
  let minSoFar = nums[0]
  let result = nums[0]

  for (let i = 1; i < nums.length; i++) {
    // Compute both before updating to avoid stale values
    const tempMax = Math.max(nums[i], maxSoFar * nums[i], minSoFar * nums[i])
    const tempMin = Math.min(nums[i], maxSoFar * nums[i], minSoFar * nums[i])

    maxSoFar = tempMax
    minSoFar = tempMin
    result = Math.max(result, maxSoFar)
  }

  return result
}`,
};

// Distinct source code for Best Sightseeing Pair approaches.
export const sightseeingSources: Record<string, string> = {
  brute: `function maxScoreSightseeingPair(values) {
    let maxScore = 0;

    // Try every pair (i, j) where i < j
    for (let i = 0; i < values.length - 1; i++) {
        for (let j = i + 1; j < values.length; j++) {
            const score = values[i] + values[j] + i - j;
            maxScore = Math.max(maxScore, score);
        }
    }

    return maxScore;
}`,
  running: `function maxScoreSightseeingPair(values) {
    // Best values[i] + i seen so far
    let maxLeftScore = values[0] + 0;
    let maxScore = 0;

    for (let j = 1; j < values.length; j++) {
        // Best score using current j and the best left partner
        maxScore = Math.max(maxScore, maxLeftScore + values[j] - j);
        // Update best left partner for future j's
        maxLeftScore = Math.max(maxLeftScore, values[j] + j);
    }

    return maxScore;
}`,
};

// Distinct source code for Transpose Matrix approaches.
export const transposeSources: Record<string, string> = {
  direct: `function transpose(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;

    // Create result with swapped dimensions
    const result = new Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = new Array(m).fill(0);
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            // Element at (i, j) goes to (j, i)
            result[j][i] = matrix[i][j];
        }
    }
    return result;
}`,
  column: `function transpose(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;

    const result = [];
    // Each column of the original becomes a row of the result
    for (let j = 0; j < n; j++) {
        const row = [];
        for (let i = 0; i < m; i++) {
            row.push(matrix[i][j]);
        }
        result.push(row);
    }
    return result;
}`,
};

// Distinct source code for Spiral Matrix approaches.
export const spiralSources: Record<string, string> = {
  simulate: `function spiralOrder(matrix) {
    const m = matrix.length, n = matrix[0].length;
    const visited = Array.from({length: m}, () => Array(n).fill(false));
    const result = [];

    // Direction vectors: right, down, left, up
    const dr = [0, 1, 0, -1];
    const dc = [1, 0, -1, 0];
    let dir = 0;
    let row = 0, col = 0;

    for (let i = 0; i < m * n; i++) {
        result.push(matrix[row][col]);
        visited[row][col] = true;

        let nextRow = row + dr[dir];
        let nextCol = col + dc[dir];

        if (nextRow < 0 || nextRow >= m || nextCol < 0 || nextCol >= n
                || visited[nextRow][nextCol]) {
            dir = (dir + 1) % 4;
            nextRow = row + dr[dir];
            nextCol = col + dc[dir];
        }

        row = nextRow;
        col = nextCol;
    }

    return result;
}`,
  layer: `function spiralOrder(matrix) {
    const result = [];
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;

    while (top <= bottom && left <= right) {
        // Traverse top row
        for (let col = left; col <= right; col++) {
            result.push(matrix[top][col]);
        }
        top++;

        // Traverse right column
        for (let row = top; row <= bottom; row++) {
            result.push(matrix[row][right]);
        }
        right--;

        // Traverse bottom row (if rows remain)
        if (top <= bottom) {
            for (let col = right; col >= left; col--) {
                result.push(matrix[bottom][col]);
            }
            bottom--;
        }

        // Traverse left column (if columns remain)
        if (left <= right) {
            for (let row = bottom; row >= top; row--) {
                result.push(matrix[row][left]);
            }
            left++;
        }
    }

    return result;
}`,
};

// Distinct source code for Rotate Image approaches.
export const rotateImageSources: Record<string, string> = {
  space: `function rotate(matrix) {
    const n = matrix.length;
    const rotated = Array.from({ length: n }, () => new Array(n).fill(0));

    // Place each element in its rotated position
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            rotated[j][n - 1 - i] = matrix[i][j];
        }
    }

    // Copy back to original matrix
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            matrix[i][j] = rotated[i][j];
        }
    }
}`,
  transpose: `function rotate(matrix) {
    const n = matrix.length;

    // Step 1: Transpose the matrix
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }

    // Step 2: Reverse each row
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
}`,
};

// Distinct source code for Set Matrix Zeroes approaches.
export const setZeroesSources: Record<string, string> = {
  copy: `function setZeroes(matrix) {
    const m = matrix.length, n = matrix[0].length;
    // Create a copy to read from
    const copy = matrix.map((row) => [...row]);
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (copy[i][j] === 0) {
                // Zero out entire row i in original
                for (let k = 0; k < n; k++) matrix[i][k] = 0;
                // Zero out entire column j in original
                for (let k = 0; k < m; k++) matrix[k][j] = 0;
            }
        }
    }
}`,
  hash: `function setZeroes(matrix) {
    const m = matrix.length, n = matrix[0].length;
    const zeroRows = new Set();
    const zeroCols = new Set();
    // Phase 1: record which rows and columns have zeroes
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === 0) {
                zeroRows.add(i);
                zeroCols.add(j);
            }
        }
    }
    // Phase 2: zero out marked rows and columns
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (zeroRows.has(i) || zeroCols.has(j)) {
                matrix[i][j] = 0;
            }
        }
    }
}`,
};

// Distinct source code for Candy Crush approaches.
export const candyCrushSources: Record<string, string> = {
  bool: `function candyCrush(board) {
    const m = board.length;
    const n = board[0].length;

    let shouldContinue = true;
    while (shouldContinue) {
        shouldContinue = false;
        const crush = Array.from({length: m}, function() {
            return new Array(n).fill(false);
        });

        // Mark horizontal runs of 3+
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n - 2; j++) {
                const val = board[i][j];
                if (val !== 0 && val === board[i][j + 1] && val === board[i][j + 2]) {
                    crush[i][j] = crush[i][j + 1] = crush[i][j + 2] = true;
                    shouldContinue = true;
                }
            }
        }

        // Mark vertical runs of 3+
        for (let i = 0; i < m - 2; i++) {
            for (let j = 0; j < n; j++) {
                const val = board[i][j];
                if (val !== 0 && val === board[i + 1][j] && val === board[i + 2][j]) {
                    crush[i][j] = crush[i + 1][j] = crush[i + 2][j] = true;
                    shouldContinue = true;
                }
            }
        }

        // Crush marked cells
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (crush[i][j]) {
                    board[i][j] = 0;
                }
            }
        }

        // Apply gravity column by column
        for (let j = 0; j < n; j++) {
            let writePos = m - 1;
            for (let i = m - 1; i >= 0; i--) {
                if (board[i][j] !== 0) {
                    board[writePos][j] = board[i][j];
                    if (writePos !== i) {
                        board[i][j] = 0;
                    }
                    writePos--;
                }
            }
            while (writePos >= 0) {
                board[writePos][j] = 0;
                writePos--;
            }
        }
    }

    return board;
}`,
  neg: `function candyCrush(board) {
    const m = board.length;
    const n = board[0].length;

    let shouldContinue = true;
    while (shouldContinue) {
        shouldContinue = false;

        // Mark horizontal runs by negating values
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n - 2; j++) {
                const val = Math.abs(board[i][j]);
                if (val !== 0 && val === Math.abs(board[i][j + 1]) && val === Math.abs(board[i][j + 2])) {
                    board[i][j] = -val;
                    board[i][j + 1] = -val;
                    board[i][j + 2] = -val;
                    shouldContinue = true;
                }
            }
        }

        // Mark vertical runs by negating values
        for (let i = 0; i < m - 2; i++) {
            for (let j = 0; j < n; j++) {
                const val = Math.abs(board[i][j]);
                if (val !== 0 && val === Math.abs(board[i + 1][j]) && val === Math.abs(board[i + 2][j])) {
                    board[i][j] = -val;
                    board[i + 1][j] = -val;
                    board[i + 2][j] = -val;
                    shouldContinue = true;
                }
            }
        }

        // Crush and apply gravity
        for (let j = 0; j < n; j++) {
            let writePos = m - 1;
            for (let i = m - 1; i >= 0; i--) {
                if (board[i][j] > 0) {
                    board[writePos][j] = board[i][j];
                    if (writePos !== i) {
                        board[i][j] = 0;
                    }
                    writePos--;
                }
            }
            while (writePos >= 0) {
                board[writePos][j] = 0;
                writePos--;
            }
        }
    }

    return board;
}`,
};

// Distinct source code for Valid Sudoku approaches.
export const sudokuSources: Record<string, string> = {
  threepass: `function isValidSudoku(board) {
    // Check each row
    for (let r = 0; r < 9; r++) {
        const seen = new Set();
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === '.') continue;
            if (seen.has(board[r][c])) return false;
            seen.add(board[r][c]);
        }
    }

    // Check each column
    for (let c = 0; c < 9; c++) {
        const seen = new Set();
        for (let r = 0; r < 9; r++) {
            if (board[r][c] === '.') continue;
            if (seen.has(board[r][c])) return false;
            seen.add(board[r][c]);
        }
    }

    // Check each 3x3 sub-box
    for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
            const seen = new Set();
            for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
                for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
                    if (board[r][c] === '.') continue;
                    if (seen.has(board[r][c])) return false;
                    seen.add(board[r][c]);
                }
            }
        }
    }

    return true;
}`,
  singlepass: `function isValidSudoku(board) {
    // One set per row, column, and 3x3 box
    const rows = Array.from({ length: 9 }, () => new Set());
    const cols = Array.from({ length: 9 }, () => new Set());
    const boxes = Array.from({ length: 9 }, () => new Set());

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === '.') continue;

            const digit = board[r][c];
            const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);

            // Check all three constraints at once
            if (rows[r].has(digit) || cols[c].has(digit) || boxes[boxIdx].has(digit)) {
                return false;
            }

            rows[r].add(digit);
            cols[c].add(digit);
            boxes[boxIdx].add(digit);
        }
    }

    return true;
}`,
};

// Distinct source code for Game of Life approaches.
export const gameOfLifeSources: Record<string, string> = {
  copy: `function gameOfLife(board) {
    const m = board.length;
    const n = board[0].length;

    // Create a copy to read original states from
    const copy = board.map((row) => [...row]);

    // 8 possible neighbor directions
    const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
    const dc = [-1, 0, 1, -1, 1, -1, 0, 1];

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            let liveNeighbors = 0;

            // Count live neighbors from the copy
            for (let d = 0; d < 8; d++) {
                const ni = i + dr[d];
                const nj = j + dc[d];
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && copy[ni][nj] === 1) {
                    liveNeighbors++;
                }
            }

            // Apply rules
            if (copy[i][j] === 1) {
                if (liveNeighbors < 2 || liveNeighbors > 3) {
                    board[i][j] = 0;
                }
            } else {
                if (liveNeighbors === 3) {
                    board[i][j] = 1;
                }
            }
        }
    }
}`,
  encode: `function gameOfLife(board) {
    const m = board.length;
    const n = board[0].length;
    const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
    const dc = [-1, 0, 1, -1, 1, -1, 0, 1];

    // First pass: encode transitions
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            let liveNeighbors = 0;
            for (let d = 0; d < 8; d++) {
                const ni = i + dr[d];
                const nj = j + dc[d];
                // Use % 2 to get original state from encoded value
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && board[ni][nj] % 2 === 1) {
                    liveNeighbors++;
                }
            }

            // Alive cell that dies → encode as 3
            if (board[i][j] === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
                board[i][j] = 3;
            }
            // Dead cell that becomes alive → encode as 2
            if (board[i][j] === 0 && liveNeighbors === 3) {
                board[i][j] = 2;
            }
        }
    }

    // Second pass: convert encoded values to final states
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            board[i][j] = board[i][j] === 1 || board[i][j] === 2 ? 1 : 0;
        }
    }
}`,
};

// Distinct source code for Intersection of Two Linked Lists approaches.
export const intersectionSources: Record<string, string> = {
  hashset: `function getIntersectionNode(headA, headB) {
    // Store all nodes from list A in a set
    var visited = new Set();
    var curr = headA;
    while (curr !== null) {
        visited.add(curr);
        curr = curr.next;
    }

    // Walk through list B and find the first shared node
    curr = headB;
    while (curr !== null) {
        if (visited.has(curr)) {
            return curr;
        }
        curr = curr.next;
    }

    return null;
}`,
  twopointer: `function getIntersectionNode(headA, headB) {
    var pA = headA;
    var pB = headB;

    // Each pointer traverses both lists, meeting at intersection or null
    while (pA !== pB) {
        pA = (pA !== null) ? pA.next : headB;
        pB = (pB !== null) ? pB.next : headA;
    }

    return pA;
}`,
};

// Distinct source code for Remove Duplicates from Sorted List approaches.
export const deleteDuplicatesSources: Record<string, string> = {
  set: `function deleteDuplicates(head) {
    if (!head) return null;

    var seen = new Set();
    seen.add(head.val);
    var current = head;

    while (current.next) {
        if (seen.has(current.next.val)) {
            // Skip the duplicate node
            current.next = current.next.next;
        } else {
            seen.add(current.next.val);
            current = current.next;
        }
    }

    return head;
}`,
  inplace: `function deleteDuplicates(head) {
    var current = head;

    while (current !== null && current.next !== null) {
        if (current.val === current.next.val) {
            // Skip the duplicate node
            current.next = current.next.next;
        } else {
            // Move to the next distinct node
            current = current.next;
        }
    }

    return head;
}`,
};

// Distinct source code for Design Linked List approaches.
export const designLinkedListSources: Record<string, string> = {
  singly: `function MyLinkedList() {
    this.sentinel = {val: 0, next: null};
    this.size = 0;
};

MyLinkedList.prototype.get = function(index) {
    if (index < 0 || index >= this.size) return -1;
    var current = this.sentinel.next;
    for (var i = 0; i < index; i++) {
        current = current.next;
    }
    return current.val;
};

MyLinkedList.prototype.addAtHead = function(val) {
    this.addAtIndex(0, val);
};

MyLinkedList.prototype.addAtTail = function(val) {
    this.addAtIndex(this.size, val);
};

MyLinkedList.prototype.addAtIndex = function(index, val) {
    if (index < 0 || index > this.size) return;
    var pred = this.sentinel;
    for (var i = 0; i < index; i++) {
        pred = pred.next;
    }
    var newNode = {val: val, next: pred.next};
    pred.next = newNode;
    this.size++;
};

MyLinkedList.prototype.deleteAtIndex = function(index) {
    if (index < 0 || index >= this.size) return;
    var pred = this.sentinel;
    for (var i = 0; i < index; i++) {
        pred = pred.next;
    }
    pred.next = pred.next.next;
    this.size--;
}`,
  doubly: `function MyLinkedList() {
    this.headSentinel = {val: 0, prev: null, next: null};
    this.tailSentinel = {val: 0, prev: null, next: null};
    this.headSentinel.next = this.tailSentinel;
    this.tailSentinel.prev = this.headSentinel;
    this.size = 0;
};

MyLinkedList.prototype._getNodeAt = function(index) {
    var node;
    if (index < this.size / 2) {
        node = this.headSentinel.next;
        for (var i = 0; i < index; i++) {
            node = node.next;
        }
    } else {
        node = this.tailSentinel.prev;
        for (var i = this.size - 1; i > index; i--) {
            node = node.prev;
        }
    }
    return node;
};

MyLinkedList.prototype.get = function(index) {
    if (index < 0 || index >= this.size) return -1;
    return this._getNodeAt(index).val;
};

MyLinkedList.prototype.addAtHead = function(val) {
    var newNode = {val: val, prev: null, next: null};
    var after = this.headSentinel.next;
    this.headSentinel.next = newNode;
    newNode.prev = this.headSentinel;
    newNode.next = after;
    after.prev = newNode;
    this.size++;
};

MyLinkedList.prototype.addAtTail = function(val) {
    var newNode = {val: val, prev: null, next: null};
    var before = this.tailSentinel.prev;
    before.next = newNode;
    newNode.prev = before;
    newNode.next = this.tailSentinel;
    this.tailSentinel.prev = newNode;
    this.size++;
};

MyLinkedList.prototype.addAtIndex = function(index, val) {
    if (index < 0 || index > this.size) return;
    var successor, predecessor;
    if (index === this.size) {
        successor = this.tailSentinel;
        predecessor = this.tailSentinel.prev;
    } else {
        successor = this._getNodeAt(index);
        predecessor = successor.prev;
    }
    var newNode = {val: val, prev: predecessor, next: successor};
    predecessor.next = newNode;
    successor.prev = newNode;
    this.size++;
};

MyLinkedList.prototype.deleteAtIndex = function(index) {
    if (index < 0 || index >= this.size) return;
    var node = this._getNodeAt(index);
    node.prev.next = node.next;
    node.next.prev = node.prev;
    this.size--;
}`,
};

// Distinct source code for Remove Nth Node From End of List approaches.
export const removeNthSources: Record<string, string> = {
  twopass: `function removeNthFromEnd(head, n) {
    // Dummy node simplifies edge case of removing head
    var dummy = new ListNode(0, head);

    // First pass: count total nodes
    var length = 0;
    var current = head;
    while (current !== null) {
        length++;
        current = current.next;
    }

    // Second pass: advance (length - n) steps from dummy
    var prev = dummy;
    for (var i = 0; i < length - n; i++) {
        prev = prev.next;
    }

    // Remove the target node
    prev.next = prev.next.next;

    return dummy.next;
}`,
  onepass: `function removeNthFromEnd(head, n) {
    // Dummy node handles the edge case of removing the head
    var dummy = new ListNode(0, head);
    var slow = dummy;
    var fast = dummy;

    // Advance fast by n + 1 steps to create the gap
    for (var i = 0; i <= n; i++) {
        fast = fast.next;
    }

    // Move both pointers until fast reaches the end
    while (fast !== null) {
        slow = slow.next;
        fast = fast.next;
    }

    // slow is now the node before the target, skip the target
    slow.next = slow.next.next;

    return dummy.next;
}`,
};

// Distinct source code for Remove Duplicates from Sorted List II approaches.
export const deleteDuplicatesIISources: Record<string, string> = {
  map: `function deleteDuplicates(head) {
    // Pass 1: count frequencies
    var count = new Map();
    var current = head;
    while (current !== null) {
        count.set(current.val, (count.get(current.val) || 0) + 1);
        current = current.next;
    }

    // Pass 2: remove nodes with count > 1
    var dummy = new ListNode(0, head);
    var prev = dummy;
    while (prev.next !== null) {
        if (count.get(prev.next.val) > 1) {
            // Skip this node
            prev.next = prev.next.next;
        } else {
            prev = prev.next;
        }
    }

    return dummy.next;
}`,
  single: `function deleteDuplicates(head) {
    var dummy = new ListNode(0, head);
    var prev = dummy;

    var current = head;
    while (current !== null) {
        // Check if current starts a duplicate run
        if (current.next !== null && current.val === current.next.val) {
            // Skip all nodes with this value
            while (current.next !== null && current.val === current.next.val) {
                current = current.next;
            }
            // Wire prev to the node after the duplicate run
            prev.next = current.next;
        } else {
            // Current is unique, advance prev
            prev = prev.next;
        }
        current = current.next;
    }

    return dummy.next;
}`,
};

// Distinct source code for Swap Nodes in Pairs approaches.
export const swapPairsSources: Record<string, string> = {
  recursive: `function swapPairs(head) {
    // Base case: fewer than 2 nodes, nothing to swap
    if (!head || !head.next) return head;

    var first = head;
    var second = head.next;

    // Recursively swap the rest of the list
    first.next = swapPairs(second.next);
    second.next = first;

    // second is now the head of this swapped pair
    return second;
}`,
  iterative: `function swapPairs(head) {
    // Dummy node simplifies head pointer management
    var dummy = new ListNode(0, head);
    var prev = dummy;

    while (prev.next && prev.next.next) {
        var first = prev.next;
        var second = prev.next.next;

        // Rewire the three pointers
        prev.next = second;
        first.next = second.next;
        second.next = first;

        // Advance prev to the end of the swapped pair
        prev = first;
    }

    return dummy.next;
}`,
};

// Distinct source code for Copy List with Random Pointer approaches.
export const copyRandomListSources: Record<string, string> = {
  map: `function copyRandomList(head) {
    if (!head) return null;

    // Pass 1: create copy nodes and build the mapping
    var map = new Map();
    var current = head;
    while (current) {
        map.set(current, new _Node(current.val));
        current = current.next;
    }

    // Pass 2: wire up next and random pointers
    current = head;
    while (current) {
        map.get(current).next = map.get(current.next) || null;
        map.get(current).random = map.get(current.random) || null;
        current = current.next;
    }

    return map.get(head);
}`,
  interleave: `function copyRandomList(head) {
    if (!head) return null;

    // Pass 1: interleave copy nodes after each original
    var current = head;
    while (current) {
        var copy = new _Node(current.val);
        copy.next = current.next;
        current.next = copy;
        current = copy.next;
    }

    // Pass 2: set random pointers for copy nodes
    current = head;
    while (current) {
        if (current.random) {
            current.next.random = current.random.next;
        }
        current = current.next.next;
    }

    // Pass 3: separate the interleaved list into original and copy
    var copyHead = head.next;
    current = head;
    var copyCurrent = copyHead;
    while (current) {
        current.next = copyCurrent.next;
        current = current.next;
        if (current) {
            copyCurrent.next = current.next;
            copyCurrent = copyCurrent.next;
        } else {
            copyCurrent.next = null;
        }
    }

    return copyHead;
}`,
};

// Distinct source code for Partition List approaches.
export const partitionSources: Record<string, string> = {
  array: `function partition(head, x) {
    // Collect values into two arrays based on partition value
    var less = [];
    var greater = [];

    var current = head;
    while (current !== null) {
        if (current.val < x) {
            less.push(current.val);
        } else {
            greater.push(current.val);
        }
        current = current.next;
    }

    // Build the result linked list
    var dummy = new ListNode(0);
    var tail = dummy;

    var combined = less.concat(greater);
    for (var i = 0; i < combined.length; i++) {
        tail.next = new ListNode(combined[i]);
        tail = tail.next;
    }

    return dummy.next;
}`,
  twodummy: `function partition(head, x) {
    // Two dummy heads for the less and greater chains
    var lessHead = new ListNode(0);
    var greaterHead = new ListNode(0);
    var lessTail = lessHead;
    var greaterTail = greaterHead;

    // Distribute nodes into the two chains
    var current = head;
    while (current !== null) {
        if (current.val < x) {
            lessTail.next = current;
            lessTail = lessTail.next;
        } else {
            greaterTail.next = current;
            greaterTail = greaterTail.next;
        }
        current = current.next;
    }

    // Connect the less chain to the greater chain
    lessTail.next = greaterHead.next;
    // Terminate the greater chain to prevent cycles
    greaterTail.next = null;

    return lessHead.next;
}`,
};

// Distinct source code for Rotate List approaches.
export const rotateListSources: Record<string, string> = {
  brute: `function rotateRight(head, k) {
    if (!head || !head.next || k === 0) return head;

    // Count the length
    var n = 0;
    var temp = head;
    while (temp) {
        n++;
        temp = temp.next;
    }

    k = k % n;
    if (k === 0) return head;

    // Rotate one at a time, k times
    for (var i = 0; i < k; i++) {
        var prev = null;
        var curr = head;
        while (curr.next) {
            prev = curr;
            curr = curr.next;
        }
        // curr is the last node, prev is second-to-last
        prev.next = null;
        curr.next = head;
        head = curr;
    }

    return head;
}`,
  split: `function rotateRight(head, k) {
    if (!head || !head.next || k === 0) return head;

    // Find the length and the tail
    var n = 1;
    var tail = head;
    while (tail.next) {
        n++;
        tail = tail.next;
    }

    // Compute effective rotation
    k = k % n;
    if (k === 0) return head;

    // Form a circular list
    tail.next = head;

    // Walk to the new tail: (n - k - 1) steps from head
    var newTail = head;
    for (var i = 0; i < n - k - 1; i++) {
        newTail = newTail.next;
    }

    // Break the circle
    var newHead = newTail.next;
    newTail.next = null;

    return newHead;
}`,
};

// Distinct source code for Add Two Numbers approaches.
export const addTwoNumbersSources: Record<string, string> = {
  iterative: `function addTwoNumbers(l1, l2) {
    var dummy = new ListNode(0);
    var current = dummy;
    var carry = 0;

    while (l1 !== null || l2 !== null || carry !== 0) {
        var val1 = l1 !== null ? l1.val : 0;
        var val2 = l2 !== null ? l2.val : 0;
        var sum = val1 + val2 + carry;

        carry = Math.floor(sum / 10);
        current.next = new ListNode(sum % 10);
        current = current.next;

        if (l1 !== null) l1 = l1.next;
        if (l2 !== null) l2 = l2.next;
    }

    return dummy.next;
}`,
  recursive: `function addTwoNumbers(l1, l2) {
    return addWithCarry(l1, l2, 0);
};

function addWithCarry(l1, l2, carry) {
    // Base case: both lists done and no carry
    if (l1 === null && l2 === null && carry === 0) {
        return null;
    }

    var sum = carry;
    if (l1 !== null) sum += l1.val;
    if (l2 !== null) sum += l2.val;

    var node = new ListNode(sum % 10);
    node.next = addWithCarry(
        l1 !== null ? l1.next : null,
        l2 !== null ? l2.next : null,
        Math.floor(sum / 10)
    );

    return node;
}`,
};

// Distinct source code for Flatten a Multilevel Doubly Linked List approaches.
export const flattenSources: Record<string, string> = {
  dfs: `function flatten(head) {
    if (!head) return null;

    // Use a stack to simulate DFS
    var stack = [head];
    var prev = new Node(0); // dummy previous node

    while (stack.length > 0) {
        var curr = stack.pop();

        // Link current node to previous
        prev.next = curr;
        curr.prev = prev;

        // Push next first (processed later), then child (processed sooner)
        if (curr.next) {
            stack.push(curr.next);
        }
        if (curr.child) {
            stack.push(curr.child);
            curr.child = null; // clear the child pointer
        }

        prev = curr;
    }

    // Detach the dummy node
    head.prev = null;
    return head;
}`,
  iterative: `function flatten(head) {
    var curr = head;

    while (curr !== null) {
        if (curr.child !== null) {
            var next = curr.next; // save the current next

            // Find the tail of the child chain
            var tail = curr.child;
            while (tail.next !== null) {
                tail = tail.next;
            }

            // Splice child chain between curr and next
            curr.next = curr.child;
            curr.child.prev = curr;
            tail.next = next;
            if (next !== null) {
                next.prev = tail;
            }

            // Clear the child pointer
            curr.child = null;
        }
        curr = curr.next;
    }

    return head;
}`,
};

// Distinct source code for Palindrome Linked List approaches.
export const palindromeSources: Record<string, string> = {
  array: `var isPalindrome = function(head) {
    // Copy values into an array
    var vals = [];
    var curr = head;
    while (curr !== null) {
        vals.push(curr.val);
        curr = curr.next;
    }

    // Two-pointer palindrome check
    var left = 0;
    var right = vals.length - 1;
    while (left < right) {
        if (vals[left] !== vals[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
};`,
  reversehalf: `var isPalindrome = function(head) {
    if (head === null || head.next === null) {
        return true;
    }

    // Step 1: Find the middle using slow/fast pointers
    var slow = head;
    var fast = head;
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // Step 2: Reverse the second half
    var prev = null;
    var curr = slow;
    while (curr !== null) {
        var next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }

    // Step 3: Compare both halves
    var left = head;
    var right = prev;
    while (right !== null) {
        if (left.val !== right.val) {
            return false;
        }
        left = left.next;
        right = right.next;
    }
    return true;
};`,
};

// Distinct source code for Reverse Linked List approaches.
export const reverseListSources: Record<string, string> = {
  iterative: `function reverseList(head) {
    let prev = null;
    let curr = head;

    while (curr !== null) {
        let next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }

    return prev;
}`,
  recursive: `var reverseList = function(head) {
    // Base case: empty list or single node
    if (head === null || head.next === null) {
        return head;
    }

    // Reverse the rest of the list
    var newHead = reverseList(head.next);

    // Fix the pointers
    head.next.next = head; // Next node points back to current
    head.next = null;      // Current node becomes tail

    return newHead;
};`,
};

// Distinct source code for Reverse Linked List II approaches.
export const reverseBetweenSources: Record<string, string> = {
  extract: `var reverseBetween = function(head, left, right) {
    // Collect values from position left to right
    var values = [];
    var curr = head;
    var pos = 1;
    while (curr) {
        if (pos >= left && pos <= right) {
            values.push(curr.val);
        }
        curr = curr.next;
        pos++;
    }

    // Reverse the collected values
    values.reverse();

    // Write reversed values back into the list
    curr = head;
    pos = 1;
    var idx = 0;
    while (curr) {
        if (pos >= left && pos <= right) {
            curr.val = values[idx];
            idx++;
        }
        curr = curr.next;
        pos++;
    }

    return head;
};`,
  inplace: `var reverseBetween = function(head, left, right) {
    var dummy = new ListNode(0, head);
    var prev = dummy;

    // Move prev to the node just before position left
    for (var i = 0; i < left - 1; i++) {
        prev = prev.next;
    }

    var curr = prev.next; // First node in the reversal range

    // Reverse by moving each next node to the front of the reversed section
    for (var i = 0; i < right - left; i++) {
        var nextNode = curr.next;
        curr.next = nextNode.next;
        nextNode.next = prev.next;
        prev.next = nextNode;
    }

    return dummy.next;
};`,
};

// Distinct source code for Reverse Nodes in k-Group approaches.
export const reverseKGroupSources: Record<string, string> = {
  array: `var reverseKGroup = function(head, k) {
    // Collect values into array
    var values = [];
    var curr = head;
    while (curr) {
        values.push(curr.val);
        curr = curr.next;
    }

    var n = values.length;

    // Reverse each complete group of k
    for (var start = 0; start + k <= n; start += k) {
        var left = start;
        var right = start + k - 1;
        while (left < right) {
            var temp = values[left];
            values[left] = values[right];
            values[right] = temp;
            left++;
            right--;
        }
    }

    // Write values back to linked list
    curr = head;
    for (var i = 0; i < values.length; i++) {
        curr.val = values[i];
        curr = curr.next;
    }

    return head;
};`,
  inplace: `var reverseKGroup = function(head, k) {
    var dummy = new ListNode(0);
    dummy.next = head;
    var groupPrev = dummy;

    while (true) {
        // Check if k nodes remain
        var kthNode = getKthNode(groupPrev, k);
        if (!kthNode) break;

        var groupNext = kthNode.next;

        // Reverse k nodes starting from groupPrev.next
        var prev = groupNext;
        var curr = groupPrev.next;
        for (var i = 0; i < k; i++) {
            var next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }

        // Reconnect
        var groupHead = groupPrev.next;
        groupPrev.next = kthNode;
        groupPrev = groupHead;
    }

    return dummy.next;
};

function getKthNode(node, k) {
    while (node && k > 0) {
        node = node.next;
        k--;
    }
    return node;
}`,
};

// Distinct source code for Middle of the Linked List approaches.
export const middleNodeSources: Record<string, string> = {
  array: `var middleNode = function(head) {
    var nodes = [];
    var current = head;

    // Collect all nodes into an array
    while (current) {
        nodes.push(current);
        current = current.next;
    }

    // Return the middle node
    return nodes[Math.floor(nodes.length / 2)];
};`,
  twopass: `var middleNode = function(head) {
    // First pass: count the nodes
    var count = 0;
    var current = head;
    while (current) {
        count++;
        current = current.next;
    }

    // Second pass: walk to the middle
    current = head;
    for (var i = 0; i < Math.floor(count / 2); i++) {
        current = current.next;
    }

    return current;
};`,
};

// Distinct source code for Happy Number approaches.
export const happyNumberSources: Record<string, string> = {
  set: `var isHappy = function(n) {
    var seen = new Set();

    while (n !== 1 && !seen.has(n)) {
        seen.add(n);
        n = getNext(n);
    }

    return n === 1;
};

function getNext(n) {
    var sum = 0;
    while (n > 0) {
        var digit = n % 10;
        sum += digit * digit;
        n = Math.floor(n / 10);
    }
    return sum;
}`,
  floyd: `var isHappy = function(n) {
    var slow = n;
    var fast = getNext(n);

    // Fast moves two steps, slow moves one step
    while (fast !== 1 && slow !== fast) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }

    return fast === 1;
};

function getNext(n) {
    var sum = 0;
    while (n > 0) {
        var digit = n % 10;
        sum += digit * digit;
        n = Math.floor(n / 10);
    }
    return sum;
}`,
};

// Distinct source code for Linked List Cycle II approaches.
export const detectCycleSources: Record<string, string> = {
  set: `var detectCycle = function(head) {
    var seen = new Set();

    var current = head;
    while (current !== null) {
        // If we've seen this node before, it's the cycle start
        if (seen.has(current)) {
            return current;
        }
        seen.add(current);
        current = current.next;
    }

    // No cycle found
    return null;
};`,
  floyd: `var detectCycle = function(head) {
    var slow = head;
    var fast = head;

    // Phase 1: Detect if a cycle exists
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) {
            // Phase 2: Find the cycle start
            slow = head;
            while (slow !== fast) {
                slow = slow.next;
                fast = fast.next;
            }
            return slow;
        }
    }

    // No cycle
    return null;
};`,
};
