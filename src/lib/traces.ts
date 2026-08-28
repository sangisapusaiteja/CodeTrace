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
