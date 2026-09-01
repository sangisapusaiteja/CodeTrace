export interface ApproachInfo {
  id: string;
  name: string;
  description: string;
  time: string;
  space: string;
  accent: string; // tailwind gradient
}

export const APPROACH_INFO: Record<string, Record<string, ApproachInfo>> = {
  "max-consecutive-ones": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every starting index, count how many consecutive 1s follow. The answer is the largest of those counts. It recounts the same 1s from each position inside a run, which makes it slower.",
      time: "O(n²)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    single: {
      id: "single",
      name: "Single Pass",
      description:
        "Walk the array once, keeping a running counter. On a 1 it grows; on a 0 it resets. Track the largest count seen. This is a simplified Kadane's algorithm.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "third-maximum-number": {
    sort: {
      id: "sort",
      name: "Sorting",
      description:
        "Sort the array, then walk backward from the largest element counting distinct values. The third distinct value reached is the answer; if fewer than three exist, return the maximum.",
      time: "O(n log n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
    track: {
      id: "track",
      name: "Track Three Maximums",
      description:
        "Maintain the top three distinct values in a single pass. For each number, place it in the highest slot it qualifies for and shift the lower values down. Skip duplicates so one value can't occupy two slots.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-violet-500 to-purple-500",
    },
  },
  "move-zeroes": {
    extraarray: {
      id: "extraarray",
      name: "Extra Array",
      description:
        "Build the answer in a second array: append each non-zero element to the next slot, leaving the rest as zero. Then copy result back over nums. Simple but uses O(n) extra space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-cyan-500 to-sky-500",
    },
    swap: {
      id: "swap",
      name: "Two Pointers (Swap)",
      description:
        "A single pointer insertPos marks where the next non-zero belongs. Scan with i; whenever nums[i] is non-zero, swap it into nums[insertPos] and advance. Zeroes get pushed to the end in place.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-orange-500 to-amber-500",
    },
  },
  "shuffle-the-array": {
    interleave: {
      id: "interleave",
      name: "New Array (Interleave)",
      description:
        "Create a fresh result array and fill it by reading alternately from the two halves: nums[i] goes to result[2i], nums[n+i] goes to result[2i+1].",
      time: "O(n)",
      space: "O(n)",
      accent: "from-sky-500 to-blue-500",
    },
    inplace: {
      id: "inplace",
      name: "In-Place (Encode Two Values)",
      description:
        "Store two numbers in one slot using a base maxVal = 1001. Encode each shuffled value as the high part, then decode by dividing. No second array — O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-fuchsia-500 to-pink-500",
    },
  },
  "majority-element": {
    hashmap: {
      id: "hashmap",
      name: "Hash Map",
      description:
        "Count how many times each element appears in a map. Return the first element whose count exceeds n/2. O(1) lookups make the counting fast.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-green-500",
    },
    sort: {
      id: "sort",
      name: "Sorting",
      description:
        "After sorting, the majority element (appearing more than n/2 times) always occupies the middle index. Sort and read nums[n/2] — no counting needed.",
      time: "O(n log n)",
      space: "O(1)",
      accent: "from-sky-500 to-indigo-500",
    },
  },
  "remove-duplicates-from-sorted-array": {
    hashset: {
      id: "hashset",
      name: "Using a Hash Set",
      description:
        "Collect every value into a set (duplicates vanish), sort the distinct results, and write them back to the front of the array. Simple but uses O(n) extra space.",
      time: "O(n log n)",
      space: "O(n)",
      accent: "from-violet-500 to-purple-500",
    },
    twopointer: {
      id: "twopointer",
      name: "Two Pointers (Optimal)",
      description:
        "Since the array is sorted, duplicates are adjacent. A write pointer insertPos compacts each new unique value to the front in one pass — O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
  },
  "remove-element": {
    extraarray: {
      id: "extraarray",
      name: "Extra Array",
      description:
        "Build a new result array: iterate through nums and collect every element that isn't equal to val. Then copy the result back into the front of nums. Simple and clear but uses O(n) extra space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-cyan-500 to-teal-500",
    },
    frontoverwrite: {
      id: "frontoverwrite",
      name: "Two Pointers (Front Overwrite)",
      description:
        "A write pointer k tracks where the next kept element belongs. When nums[i] ≠ val, copy it to nums[k] and advance k. Elements equal to val are skipped, so later kept elements overwrite them. In-place, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-orange-500 to-amber-500",
    },
  },
  "best-time-to-buy-and-sell-stock": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "Try every valid pair of buy day i and sell day j (i < j). Compute prices[j] - prices[i] for each pair and keep the largest profit. Guarantees the best answer but checks O(n²) pairs, which times out on large inputs.",
      time: "O(n²)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    onepass: {
      id: "onepass",
      name: "One Pass (Optimal)",
      description:
        "Track the minimum price seen so far. For each day, the best profit selling today is currentPrice - minPrice. Update maxProfit whenever this beats the record. One scan, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "missing-ranges": {
    separate: {
      id: "separate",
      name: "Check Each Gap Separately",
      description:
        "Handle three kinds of gaps in three steps: before the first element, between consecutive elements, and after the last element. Clear boundary logic at the cost of repetition.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-violet-500 to-purple-500",
    },
    unified: {
      id: "unified",
      name: "Unified Boundary Scan (Optimal)",
      description:
        "Treat lower-1 and upper+1 as virtual anchors. With those in place, every gap check follows the same rule — one loop handles before, between, and after without special cases.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-sky-500 to-indigo-500",
    },
  },
  "majority-element-ii": {
    hashmap: {
      id: "hashmap",
      name: "Hash Map Counting",
      description:
        "Count every element in a map, then filter keys whose count exceeds n/3. At most two such elements can exist. Simple O(n) time but O(n) space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-green-500",
    },
    sort: {
      id: "sort",
      name: "Sorting",
      description:
        "After sorting, equal values form contiguous runs. Scan each run, measure its length, and keep it if it exceeds n/3. Trades time for O(1) extra space beyond the sort.",
      time: "O(n log n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "rotate-array": {
    brute: {
      id: "brute",
      name: "Brute Force (Rotate One by One)",
      description:
        "Repeat k times: save the last element, shift every other element one position to the right, place the saved element at index 0. Simple but O(n × k) time.",
      time: "O(n × k)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    extraarray: {
      id: "extraarray",
      name: "Extra Array",
      description:
        "Element at index i goes to position (i + k) % n. Write all elements into a fresh array at their rotated positions, then copy back. O(n) time with O(n) extra space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-cyan-500 to-teal-500",
    },
  },
  "product-of-array-except-self": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For each index i, scan the entire array and multiply together every element except nums[i]. Straightforward but O(n²) time.",
      time: "O(n²)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    prefixsuffix: {
      id: "prefixsuffix",
      name: "Prefix and Suffix Products (Optimal)",
      description:
        "Split the product into prefix (everything left of i) and suffix (everything right of i). Build both in O(n) with two passes, then combine: result[i] = prefix[i] × suffix[i].",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "remove-duplicates-from-sorted-array-ii": {
    count: {
      id: "count",
      name: "Count and Overwrite",
      description:
        "Track how many times the current value has appeared in a row. Write only when count ≤ 2, reset when the value changes. One pass, O(1) extra space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    twopos: {
      id: "twopos",
      name: "Compare with Two Positions Back (Optimal)",
      description:
        "Compare the current element with the element two positions back in the result prefix. If they differ, it is safe to keep. No counter variable needed.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "best-time-to-buy-and-sell-stock-ii": {
    brute: {
      id: "brute",
      name: "Brute Force (Recursion)",
      description:
        "Explore every buy/sell/skip decision with recursion. Each day offers two choices depending on whether we hold a share. Guaranteed optimal but exponential.",
      time: "O(2^n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    dp: {
      id: "dp",
      name: "Dynamic Programming",
      description:
        "Track two states per day: notHolding (max profit without a share) and holding (max profit with a share). Each day only depends on the previous, so two variables suffice.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "number-of-zero-filled-subarrays": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every index containing a zero, extend a subarray to the right while elements stay zero. Each valid extension is another zero-filled subarray to count.",
      time: "O(n^2)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    optimal: {
      id: "optimal",
      name: "Counting Consecutive Zeros (Optimal)",
      description:
        "Each zero in a run of length k contributes k new subarrays ending at that position. A running counter of consecutive zeros sums to k*(k+1)/2 in one pass.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "increasing-triplet-subsequence": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "Try every combination of three indices i < j < k and check whether the values are strictly increasing. Direct translation of the problem statement.",
      time: "O(n^3)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    prefixsuffix: {
      id: "prefixsuffix",
      name: "Prefix Min and Suffix Max",
      description:
        "Precompute the smallest value to the left and largest value to the right of every position. A middle element j forms a triplet if leftMin[j-1] < nums[j] < rightMax[j+1].",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "next-permutation": {
    brute: {
      id: "brute",
      name: "Generate All Permutations (Brute Force)",
      description:
        "Generate every distinct permutation, sort them lexicographically, find the current one, and return the next. Correct but impractical for large n.",
      time: "O(n!)",
      space: "O(n!)",
      accent: "from-rose-500 to-pink-500",
    },
    optimal: {
      id: "optimal",
      name: "Single Pass with Suffix Reversal (Optimal)",
      description:
        "Find the rightmost pivot where the sequence can still grow, swap it with the smallest larger element to its right, then reverse the suffix to make it the smallest arrangement.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "first-missing-positive": {
    hashset: {
      id: "hashset",
      name: "Hash Set",
      description:
        "Put every number into a hash set, then check 1, 2, 3, ... in order until one is not in the set. Clean baseline but uses O(n) extra space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    sort: {
      id: "sort",
      name: "Sorting",
      description:
        "Sort the array, then walk through tracking the next expected positive integer. The first expected value that does not appear is the answer.",
      time: "O(n log n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "reverse-string": {
    extraarray: {
      id: "extraarray",
      name: "Extra Array",
      description:
        "Fill a reversed copy of the array from back to front, then copy it back into the original. Simple but uses O(n) extra space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    twopointer: {
      id: "twopointer",
      name: "Two Pointers",
      description:
        "Use two pointers starting at both ends and swap characters inward until they meet. In-place with O(1) extra space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "length-of-last-word": {
    split: {
      id: "split",
      name: "Split and Filter",
      description:
        "Split the string on spaces, filter out empty strings, and return the length of the last word. Simple but allocates an array.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    end: {
      id: "end",
      name: "Traverse from End (Optimal)",
      description:
        "Skip trailing spaces from the end, then count characters until the next space. Single pass with O(1) extra space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "is-subsequence": {
    twopointer: {
      id: "twopointer",
      name: "Two Pointers",
      description:
        "Scan t with a pointer j, advancing a pointer i in s whenever characters match. If i reaches the end of s, it is a subsequence.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    binarysearch: {
      id: "binarysearch",
      name: "Binary Search with Preprocessing",
      description:
        "Preprocess t to store the positions of each character, then binary search for the smallest index after the previous match for each character of s.",
      time: "O(m log n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "valid-palindrome": {
    filter: {
      id: "filter",
      name: "Filter and Reverse",
      description:
        "Build a cleaned string with only lowercase alphanumeric characters, then compare it with its reverse. Simple but allocates extra strings.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    twopointer: {
      id: "twopointer",
      name: "Two Pointers (Optimal)",
      description:
        "Use two pointers from both ends, skipping non-alphanumeric characters, and compare lowercase versions. In-place with O(1) extra space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "valid-palindrome-ii": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "Check if the string is already a palindrome, then try deleting each single character and re-checking. Correct but O(n^2).",
      time: "O(n^2)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    greedy: {
      id: "greedy",
      name: "Two Pointers (Greedy)",
      description:
        "Scan from both ends. On the first mismatch, try skipping either the left or right character and check if the remaining range is a palindrome.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "valid-anagram": {
    sort: {
      id: "sort",
      name: "Sorting",
      description:
        "Sort both strings and compare them element by element. If the sorted versions are identical, they are anagrams.",
      time: "O(n log n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    count: {
      id: "count",
      name: "Hash Map (Frequency Count)",
      description:
        "Use a 26-slot count array. Increment for characters in s and decrement for characters in t. If all counts are zero, they are anagrams.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "rotate-string": {
    brute: {
      id: "brute",
      name: "Brute Force (Try All Rotations)",
      description:
        "Try every possible rotation of s and check if it equals goal. Correct but O(n^2) due to string slicing.",
      time: "O(n^2)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    concat: {
      id: "concat",
      name: "Concatenate and Search",
      description:
        "Every rotation of s appears as a substring of s + s. Check if goal is a substring of the doubled string.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "longest-common-prefix": {
    vertical: {
      id: "vertical",
      name: "Vertical Scanning",
      description:
        "Compare characters column by column across all strings, using the first string as a reference. Stop at the first mismatch.",
      time: "O(n·m)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    sort: {
      id: "sort",
      name: "Sorting",
      description:
        "Sort the strings so the first and last are most different, then compare only those two to find the common prefix.",
      time: "O(n log n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "longest-palindrome": {
    greedy: {
      id: "greedy",
      name: "Greedy with Hash Map",
      description:
        "Count character frequencies. Use the largest even number ≤ each count, then add one odd character in the center if any odd count exists.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    set: {
      id: "set",
      name: "Optimal (Single Pass with Set)",
      description:
        "Scan once, pairing characters in a set. Each completed pair adds 2 to length; any unpaired character left can go in the center.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "find-the-index-of-the-first-occurrence-in-a-string": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "Try each possible starting position in the haystack and compare the needle character by character. Return the first match index.",
      time: "O(n·m)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    rabinkarp: {
      id: "rabinkarp",
      name: "Rabin-Karp (Rolling Hash)",
      description:
        "Compute a rolling hash of each window and compare it to the needle's hash. On a hash match, verify the characters to avoid false positives.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "zigzag-conversion": {
    grid: {
      id: "grid",
      name: "Simulation with 2D Grid",
      description:
        "Place each character into a 2D grid following the zigzag pattern, then read the rows in order. Intuitive but uses O(n·numRows) space.",
      time: "O(n)",
      space: "O(n·numRows)",
      accent: "from-rose-500 to-pink-500",
    },
    rows: {
      id: "rows",
      name: "Row-by-Row Collection",
      description:
        "Append each character to the current row, flipping direction at the top and bottom rows. Collects rows directly with O(n) space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "reverse-words-in-a-string": {
    split: {
      id: "split",
      name: "Split and Reverse (Built-in Functions)",
      description:
        "Split the string on whitespace, filter empty words, reverse the array, and join with single spaces. Concise but allocates arrays.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    twopointer: {
      id: "twopointer",
      name: "Two Pointers (Reverse Traversal)",
      description:
        "Scan from the end, skipping spaces and extracting each word, then join the words in reverse order. Single pass with O(n) space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "single-number": {
    brute: {
      id: "brute",
      name: "Brute Force (Nested Loops)",
      description:
        "For each element, scan the whole array to check for a duplicate. The element with no duplicate is the single number. O(n^2) time.",
      time: "O(n^2)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    hashmap: {
      id: "hashmap",
      name: "Hash Map (Count Occurrences)",
      description:
        "Count how many times each number appears in a hash map, then return the number that appears exactly once. O(n) time and space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "missing-number": {
    hashset: {
      id: "hashset",
      name: "Hash Set",
      description:
        "Put every number into a hash set, then check 0, 1, 2, ... n in order until one is not in the set. The missing value is returned.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    gauss: {
      id: "gauss",
      name: "Gauss' Formula (Sum)",
      description:
        "The sum of 0..n is n*(n+1)/2. Subtract the actual sum of the array from this expected sum to find the missing number. O(1) extra space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "set-mismatch": {
    sort: {
      id: "sort",
      name: "Sorting",
      description:
        "Sort the array, then scan for an adjacent equal pair (duplicate) and a gap between consecutive values (missing). If no gap, the missing value is n.",
      time: "O(n log n)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    hashmap: {
      id: "hashmap",
      name: "Hash Map Counting",
      description:
        "Count occurrences of each number in a hash map. The number with count 2 is the duplicate; the number in [1, n] with count 0 is missing.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "power-of-two": {
    iterative: {
      id: "iterative",
      name: "Iterative Division",
      description:
        "Keep dividing n by 2 until it reaches 1. If we ever encounter an odd number greater than 1, n is not a power of two.",
      time: "O(log n)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    bit: {
      id: "bit",
      name: "Bit Manipulation (n & (n-1))",
      description:
        "A power of two has exactly one bit set. n & (n-1) clears the lowest set bit, so the result is 0 only for powers of two.",
      time: "O(1)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "number-of-1-bits": {
    bits: {
      id: "bits",
      name: "Check Each Bit",
      description:
        "Inspect the least significant bit of n and add it to the count, then shift right to process the next bit. Iterates over all 32 bits.",
      time: "O(32)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    kernighan: {
      id: "kernighan",
      name: "Brian Kernighan's Algorithm",
      description:
        "Repeatedly clear the lowest set bit with n = n & (n-1) and increment the count. Runs in O(number of 1 bits), which is optimal.",
      time: "O(k)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "counting-bits": {
    brute: {
      id: "brute",
      name: "Brute Force (Count Bits Individually)",
      description:
        "For each number from 0 to n, count its 1-bits by checking the last bit and shifting right. O(n log n) total.",
      time: "O(n log n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    dp: {
      id: "dp",
      name: "DP with Right Shift",
      description:
        "The bit count of i equals the bit count of i without its last bit (i >> 1) plus the last bit (i & 1). Each value computed in O(1).",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "hamming-distance": {
    bits: {
      id: "bits",
      name: "Bit-by-Bit Comparison",
      description:
        "XOR the two numbers to get bits that differ, then count the 1-bits by checking the last bit and shifting right.",
      time: "O(32)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    kernighan: {
      id: "kernighan",
      name: "Brian Kernighan's Algorithm (Optimal)",
      description:
        "XOR the two numbers, then repeatedly clear the lowest set bit with xor = xor & (xor - 1) and count. Runs in O(number of differing bits).",
      time: "O(k)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "reverse-bits": {
    bitwise: {
      id: "bitwise",
      name: "Bit-by-Bit Reversal",
      description:
        "Shift result left to make room, add the last bit of n, then shift n right. Repeat 32 times to reverse all bits.",
      time: "O(32)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    lookup: {
      id: "lookup",
      name: "Byte-Level Lookup Table",
      description:
        "Precompute the reversal of all 256 byte values, then reverse each byte of the 32-bit number and reassemble it in the opposite position.",
      time: "O(1)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "bitwise-and-of-numbers-range": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "AND every number from left to right. Early-exits when the running AND becomes 0, since it can never become non-zero again.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    shift: {
      id: "shift",
      name: "Bit Shift (Common Prefix)",
      description:
        "Shift both numbers right until they are equal (the common prefix), then shift that prefix back left. The common prefix is the answer.",
      time: "O(32)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "single-number-ii": {
    hashmap: {
      id: "hashmap",
      name: "Hash Map Counting",
      description:
        "Count how many times each element appears in a hash map, then return the element that appears exactly once.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    bitwise: {
      id: "bitwise",
      name: "Bitwise Counting (Bit-by-Bit)",
      description:
        "For each of the 32 bit positions, count how many numbers have a 1 there. If the count mod 3 is 1, the single number has a 1 in that position.",
      time: "O(32n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "single-number-iii": {
    hashmap: {
      id: "hashmap",
      name: "Hash Map",
      description:
        "Count how many times each element appears, then collect the elements that appear exactly once.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    sort: {
      id: "sort",
      name: "Sorting",
      description:
        "Sort the array, then scan it. Elements that don't match their next neighbor are unique; skip pairs for the rest.",
      time: "O(n log n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "sum-of-two-integers": {
    increment: {
      id: "increment",
      name: "Successive Increment/Decrement",
      description:
        "Add or subtract 1 from a for each unit of b, using bitwise increment/decrement operations. Simple but O(|b|) time.",
      time: "O(|b|)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    bitwise: {
      id: "bitwise",
      name: "Bit Manipulation (XOR + AND + Shift)",
      description:
        "Use XOR for the sum without carry and AND-then-shift for the carry. Repeat until there is no carry left. O(1) per bit.",
      time: "O(1)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "design-hashmap": {
    array: {
      id: "array",
      name: "Brute Force (Direct Address Array)",
      description:
        "Use a large array indexed directly by the key. put and remove write to the key index, get reads it. Simple but uses O(maxKey) space.",
      time: "O(1)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    chaining: {
      id: "chaining",
      name: "Array of Linked Lists (Chaining)",
      description:
        "Hash the key into one of a fixed number of buckets, each holding a linked list. Colliding keys chain together in the same bucket.",
      time: "O(n/k)",
      space: "O(k + n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "contains-duplicate": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "Compare every pair of elements with nested loops. If any two are equal, a duplicate exists. O(n^2) time.",
      time: "O(n^2)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    sort: {
      id: "sort",
      name: "Sorting",
      description:
        "Sort the array, then check adjacent elements. Equal values become neighbors, so a duplicate is easy to spot. O(n log n) time.",
      time: "O(n log n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "word-pattern": {
    twomap: {
      id: "twomap",
      name: "Two Hash Maps (Bijection Check)",
      description:
        "Maintain char-to-word and word-to-char maps. If a char or word is remapped to a different value, the pattern doesn't match.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    index: {
      id: "index",
      name: "Index Mapping (Single-Pass Structure Comparison)",
      description:
        "Record the first occurrence index of each char and each word. If the structural positions differ at any position, the pattern doesn't match.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "first-unique-character-in-a-string": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For each character, scan the whole string to check if it repeats anywhere else. The first character with no repeat is the answer.",
      time: "O(n^2)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    freq: {
      id: "freq",
      name: "Two-Pass Frequency Count",
      description:
        "First pass counts occurrences of each character. Second pass returns the index of the first character with count 1. O(n) time.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "find-all-numbers-disappeared-in-an-array": {
    hashset: {
      id: "hashset",
      name: "Hash Set",
      description:
        "Store all numbers in a set, then check which numbers from 1 to n are missing. Simple but uses O(n) extra space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    negation: {
      id: "negation",
      name: "Negation Marking (Optimal)",
      description:
        "For each number, mark the value at its index as negative. Numbers whose index stays positive are the missing ones. O(1) extra space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "maximum-number-of-balloons": {
    array: {
      id: "array",
      name: "Character Frequency with Array",
      description:
        "Count each character in a 26-slot array, then take the minimum of the required counts. 'l' and 'o' need 2 per balloon, so divide by 2.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    hashmap: {
      id: "hashmap",
      name: "Hash Map with Target Word Frequency",
      description:
        "Count each character in a hash map, then take the minimum of the required counts for the letters of 'balloon'.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "number-of-good-pairs": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "Count every pair (i, j) with i < j where the values are equal. O(n^2) time.",
      time: "O(n^2)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    freq: {
      id: "freq",
      name: "Frequency Counting with Math",
      description:
        "Count how many times each value appears, then for each value with frequency k, add k*(k-1)/2 pairs. O(n) time.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "isomorphic-strings": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every pair of positions, check that the equality relationship in s matches the equality relationship in t. O(n^2) time.",
      time: "O(n^2)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    twomap: {
      id: "twomap",
      name: "Two Hash Maps (Bijection Check)",
      description:
        "Maintain s→t and t→s mappings. If a character is remapped to a different value in either direction, the strings are not isomorphic.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "ransom-note": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For each character in the ransom note, scan the magazine for a matching unused character and mark it used. O(n·m) time.",
      time: "O(n·m)",
      space: "O(m)",
      accent: "from-rose-500 to-pink-500",
    },
    sort: {
      id: "sort",
      name: "Sorting",
      description:
        "Sort both strings, then use two pointers to greedily match each ransom note character against the magazine. O(n log n) time.",
      time: "O(n log n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "contains-duplicate-ii": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For each element, check the k elements before it for a duplicate. O(n·k) time.",
      time: "O(n·k)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    map: {
      id: "map",
      name: "Hash Map",
      description:
        "Track the last index of each value in a hash map. If a value reappears within distance k, return true. O(n) time.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "intersection-of-two-arrays-ii": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For each element in nums1, find a matching unused element in nums2 and mark it used. O(n·m) time.",
      time: "O(n·m)",
      space: "O(m)",
      accent: "from-rose-500 to-pink-500",
    },
    map: {
      id: "map",
      name: "Hash Map",
      description:
        "Count occurrences in nums1, then consume from nums2. Each element in the intersection is added once per available count. O(n) time.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "group-anagrams": {
    sort: {
      id: "sort",
      name: "Sorting",
      description:
        "Sort each word to form a canonical key, then group words with the same key. O(n·k log k) time.",
      time: "O(n·k log k)",
      space: "O(n·k)",
      accent: "from-rose-500 to-pink-500",
    },
    freq: {
      id: "freq",
      name: "Character Frequency",
      description:
        "Build a key from the character frequency counts of each word, then group words with the same key. O(n·k) time.",
      time: "O(n·k)",
      space: "O(n·k)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "encode-and-decode-tinyurl": {
    counter: {
      id: "counter",
      name: "Counter-Based",
      description:
        "Assign each long URL an incrementing integer key and store it in a map. Encode returns the key, decode looks it up.",
      time: "O(1)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    random: {
      id: "random",
      name: "Random Key Generation",
      description:
        "Generate a random 6-character key for each URL, retrying on collision. Maintains both code→url and url→code maps.",
      time: "O(1)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "reorganize-string": {
    sort: {
      id: "sort",
      name: "Sorting by Frequency",
      description:
        "Sort characters by frequency descending, then place them at even indices first and odd indices second. O(n log n) time.",
      time: "O(n log n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    heap: {
      id: "heap",
      name: "Max Heap (Greedy)",
      description:
        "Repeatedly pop the most frequent character, place it, and push back the previous character if it still has count. O(n log k) time.",
      time: "O(n log k)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "longest-consecutive-sequence": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For each number, extend the sequence forward while the next number exists in the array. O(n^2) time.",
      time: "O(n^2)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    sort: {
      id: "sort",
      name: "Sorting",
      description:
        "Sort the array, then scan for consecutive runs, skipping duplicates. O(n log n) time.",
      time: "O(n log n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "split-array-into-consecutive-subsequences": {
    list: {
      id: "list",
      name: "Track Every Subsequence in a List",
      description:
        "Maintain a list of open subsequences. For each number, extend the shortest subsequence ending at num-1, or start a new one. O(n^2) time.",
      time: "O(n^2)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    greedy: {
      id: "greedy",
      name: "Greedy with Two Hash Maps",
      description:
        "Use freq and tails maps. For each number, extend an existing subsequence or start a new one of length 3. O(n) time.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "number-of-matching-subsequences": {
    brute: {
      id: "brute",
      name: "Brute Force (Check Each Word)",
      description:
        "For each word, walk through s once advancing a pointer on each match. O(n·m) time.",
      time: "O(n·m)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    buckets: {
      id: "buckets",
      name: "Character Buckets (Next Letter Pointers)",
      description:
        "Bucket words by their next needed character. As we scan s, advance each word in the current bucket. O(n + total word length) time.",
      time: "O(n + L)",
      space: "O(L)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "number-of-good-ways-to-split-a-string": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For each split position, count distinct characters in the left and right substrings with sets. O(n^2) time.",
      time: "O(n^2)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    prefixsuffix: {
      id: "prefixsuffix",
      name: "Prefix and Suffix Distinct Counts",
      description:
        "Precompute the number of distinct characters in every prefix and suffix, then compare at each split. O(n) time.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "merge-sorted-array": {
    sort: {
      id: "sort",
      name: "Sort After Merge",
      description:
        "Copy the second array into the back of the first, then sort the combined array. Simple but O((m+n) log(m+n)) time.",
      time: "O((m+n) log(m+n))",
      space: "O(m+n)",
      accent: "from-rose-500 to-pink-500",
    },
    threepointers: {
      id: "threepointers",
      name: "Three Pointers (Merge from End)",
      description:
        "Use i, j, k pointers starting from the ends. Place the larger element at the write position, merging from the back in O(m+n) time.",
      time: "O(m+n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "merge-strings-alternately": {
    twopointer: {
      id: "twopointer",
      name: "Two Pointers (Process Both, Then Append Remainder)",
      description:
        "Interleave characters while both strings have them, then append the remaining characters of the longer string. O(n+m) time.",
      time: "O(n+m)",
      space: "O(n+m)",
      accent: "from-rose-500 to-pink-500",
    },
    singleloop: {
      id: "singleloop",
      name: "Single Loop (Optimal and Cleaner)",
      description:
        "Loop up to the max length, adding a character from each string if it still has one. Cleaner single-pass O(n+m) time.",
      time: "O(n+m)",
      space: "O(n+m)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "squares-of-a-sorted-array": {
    sort: {
      id: "sort",
      name: "Square and Sort",
      description:
        "Square each element, then sort the result. Simple but O(n log n) time.",
      time: "O(n log n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    twopointer: {
      id: "twopointer",
      name: "Two Pointers (Optimal)",
      description:
        "The largest square comes from the leftmost or rightmost element. Use two pointers inward, filling the result from the back. O(n) time.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "two-sum": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "Check every pair of elements for a sum equal to the target. O(n^2) time.",
      time: "O(n^2)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    map: {
      id: "map",
      name: "Hash Map (One Pass)",
      description:
        "Store each element's index as we scan. For each element, check if its complement has been seen before. O(n) time.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "backspace-string-compare": {
    stack: {
      id: "stack",
      name: "Build String with Stack",
      description:
        "Process each string with a stack: push characters, pop on backspace. Compare the final strings. O(n+m) time and space.",
      time: "O(n+m)",
      space: "O(n+m)",
      accent: "from-rose-500 to-pink-500",
    },
    inplace: {
      id: "inplace",
      name: "In-Place Simulation with a Write Pointer",
      description:
        "Overwrite each array in place using a write pointer, simulating backspaces. Compare the processed results. O(n+m) time, O(1) extra space.",
      time: "O(n+m)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "valid-word-abbreviation": {
    brute: {
      id: "brute",
      name: "Brute Force (Generate and Compare)",
      description:
        "Expand the abbreviation into an array with wildcards, then compare with the word. O(n) time and space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    twopointer: {
      id: "twopointer",
      name: "Two Pointers (Optimal)",
      description:
        "Walk both the word and abbreviation with two pointers, skipping the parsed number of characters. O(n) time, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "count-binary-substrings": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For each position, check every even-length substring for the pattern of consecutive 0s followed by 1s or vice versa. O(n^3) time.",
      time: "O(n^3)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    group: {
      id: "group",
      name: "Group Counting",
      description:
        "Group consecutive identical characters into runs, then sum the minimum of adjacent run lengths. O(n) time.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "two-sum-ii-input-array-is-sorted": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "Check every pair of elements for a sum equal to the target. O(n^2) time.",
      time: "O(n^2)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    binary: {
      id: "binary",
      name: "Binary Search",
      description:
        "For each element, binary search the rest of the sorted array for its complement. O(n log n) time.",
      time: "O(n log n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "container-with-most-water": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "Check every pair of lines and compute the area. O(n^2) time.",
      time: "O(n^2)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    twopointer: {
      id: "twopointer",
      name: "Two Pointers (Optimal)",
      description:
        "Start with the widest container and move the pointer at the shorter line inward. The area is bounded by the shorter line, so moving it is always safe. O(n) time.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "3sum": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "Check every triplet for a sum of zero, deduplicating via a sorted set. O(n^3) time.",
      time: "O(n^3)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    hashset: {
      id: "hashset",
      name: "Hash Set",
      description:
        "Sort, then for each first element use a set to find pairs summing to the complement. O(n^2) time.",
      time: "O(n^2)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "4sum": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "Check every quadruple for a sum equal to the target, deduplicating via a set. O(n^4) time.",
      time: "O(n^4)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    twopointer: {
      id: "twopointer",
      name: "Sorting + Two Pointers",
      description:
        "Fix the first two elements, then use two pointers for the remaining pair, skipping duplicates. O(n^3) time.",
      time: "O(n^3)",
      space: "O(1)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "trapping-rain-water": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For each bar, find the tallest bars to its left and right, then add the trapped water above it. O(n^2) time.",
      time: "O(n^2)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    prefixmax: {
      id: "prefixmax",
      name: "Prefix Max Arrays",
      description:
        "Precompute the tallest bar to the left and right of every position, then sum the water in O(n) time.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-amber-500 to-orange-500",
    },
  },
  "running-sum-of-1d-array": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For each index i, recompute the sum from index 0 to i using an inner loop, then store it in result[i]. Simple but repeats work, giving O(n^2) time.",
      time: "O(n^2)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    prefix: {
      id: "prefix",
      name: "Prefix Sum (Optimal)",
      description:
        "Each running sum builds on the previous one: result[i] = result[i-1] + nums[i]. A single pass computes all running sums in O(n) time.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "range-sum-query-immutable": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For each sumRange(left, right) query, loop from left to right and add up the elements. Simple but each query costs O(n) time.",
      time: "O(n) per query",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    prefix: {
      id: "prefix",
      name: "Prefix Sum",
      description:
        "Precompute a prefix array where prefix[i] = sum of nums[0..i-1]. Then any range sum is prefix[right+1] - prefix[left] in O(1) time.",
      time: "O(1) per query",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "find-pivot-index": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For each index i, compute the sum of everything to its left and right with two inner loops, then check if they are equal. O(n^2) time.",
      time: "O(n^2)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    prefix: {
      id: "prefix",
      name: "Prefix Sum (Optimal)",
      description:
        "Compute the total sum once. Then walk left to right, tracking leftSum; rightSum = totalSum - leftSum - nums[i]. Return the first index where they match. O(n) time.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "maximum-population-year": {
    brute: {
      id: "brute",
      name: "Brute Force (Check Every Year)",
      description:
        "For each year from 1950 to 2050, count how many people are alive (birth <= year < death). Track the year with the maximum count. O(101 * n) time.",
      time: "O(101n)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    sweep: {
      id: "sweep",
      name: "Line Sweep (Difference Array)",
      description:
        "Record +1 at each birth year and -1 at each death year in a difference array. Sweep across years accumulating the running sum to find the peak population. O(n + 101) time.",
      time: "O(n)",
      space: "O(101)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "subarray-sum-equals-k": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every starting index i, extend the subarray to the right with j, accumulating the sum. Count how many subarrays sum to exactly k. O(n^2) time.",
      time: "O(n^2)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    map: {
      id: "map",
      name: "Prefix Sum + Hash Map",
      description:
        "Track how many times each prefix sum has appeared. A subarray ending at i sums to k when an earlier prefix sum equals prefixSum - k. O(n) time.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "subarray-sums-divisible-by-k": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every subarray, compute its sum and check if it is divisible by k. Count the divisible ones. O(n^2) time.",
      time: "O(n^2)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    map: {
      id: "map",
      name: "Prefix Sum + Hash Map (Optimal)",
      description:
        "Two subarrays have sums divisible by k when their prefix sums share the same remainder mod k. Count prefix-sum remainders in a map. O(n) time.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "continuous-subarray-sum": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every subarray of length at least 2, compute its sum and check if it is a multiple of k. Return true on the first match. O(n^2) time.",
      time: "O(n^2)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    map: {
      id: "map",
      name: "Prefix Sum + Hash Map (Optimal)",
      description:
        "Store the earliest index where each prefix-sum remainder was seen. If the same remainder recurs at distance >= 2, a valid subarray exists. O(n) time.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "contiguous-array": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every subarray, count the zeros and ones. If they are equal, update the maximum length. O(n^2) time.",
      time: "O(n^2)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    map: {
      id: "map",
      name: "Prefix Sum + Hash Map",
      description:
        "Treat 0 as -1 and 1 as +1. A subarray has equal 0s and 1s when its prefix sums match. Store the first occurrence of each prefix sum. O(n) time.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "maximum-average-subarray-i": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every starting index i, sum the k elements that follow with an inner loop, then track the maximum. Recomputes each window from scratch, giving O(n*k) time.",
      time: "O(n·k)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    sliding: {
      id: "sliding",
      name: "Sliding Window (Optimal)",
      description:
        "Compute the first window's sum once, then slide: add the new element and subtract the one leaving. Each window is updated in O(1), giving O(n) time.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "find-all-anagrams-in-a-string": {
    brute: {
      id: "brute",
      name: "Brute Force (Sorting)",
      description:
        "For each window of length p, sort its characters and compare to the sorted p. Simple but each window costs O(p log p) to sort.",
      time: "O((n-p)·p log p)",
      space: "O(p)",
      accent: "from-rose-500 to-pink-500",
    },
    freq: {
      id: "freq",
      name: "Frequency Map Comparison",
      description:
        "Maintain a 26-slot frequency array for p and the current window. Slide the window, updating counts in O(1), and compare arrays to find anagrams. O(n) time.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "permutation-in-string": {
    brute: {
      id: "brute",
      name: "Brute Force (Generate All Permutations)",
      description:
        "Generate every permutation of s1 and check whether any is a substring of s2. Correct but factorial in the length of s1.",
      time: "O(n!·m)",
      space: "O(n!)",
      accent: "from-rose-500 to-pink-500",
    },
    sliding: {
      id: "sliding",
      name: "Sliding Window with Frequency Comparison",
      description:
        "Compare the 26-slot frequency array of s1 against a sliding window of s2. Slide the window in O(1) per step, giving O(n) time.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "maximum-sum-of-distinct-subarrays-with-length-k": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For each window of length k, use a set to check for duplicates while summing. Only update maxSum for windows with all distinct elements. O(n*k) time.",
      time: "O(n·k)",
      space: "O(k)",
      accent: "from-rose-500 to-pink-500",
    },
    sliding: {
      id: "sliding",
      name: "Sliding Window with Hash Map",
      description:
        "Track element frequencies in a map and the window sum. Slide the window, adding/removing one element each step; the window is valid when the map has exactly k distinct keys. O(n) time.",
      time: "O(n)",
      space: "O(k)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "substring-with-concatenation-of-all-words": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For each starting index, split the window into word-length chunks and count them against the target frequency map. O(n·m·w) time.",
      time: "O(n·m·w)",
      space: "O(m)",
      accent: "from-rose-500 to-pink-500",
    },
    sliding: {
      id: "sliding",
      name: "Sliding Window (Optimal)",
      description:
        "Slide a window word-by-word across each starting offset, tracking how many distinct words match the target. O(n·w) time.",
      time: "O(n·w)",
      space: "O(m)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "longest-substring-without-repeating-characters": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every starting index i, extend a substring to the right with j while all characters are unique (tracked in a set). Track the longest length. O(n²) time.",
      time: "O(n²)",
      space: "O(n)",
      accent: "from-rose-500 to-pink-500",
    },
    sliding: {
      id: "sliding",
      name: "Sliding Window + Hash Set",
      description:
        "Move a right pointer, adding characters to a set. When a duplicate appears, shrink from the left until it's gone. Each character is visited at most twice, giving O(n) time.",
      time: "O(n)",
      space: "O(min(n, alphabet))",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "longest-repeating-character-replacement": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every starting index, expand a window tracking character frequencies and the max frequency. A window is valid when windowLen - maxFreq ≤ k. O(n²) time.",
      time: "O(n²)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    sliding: {
      id: "sliding",
      name: "Sliding Window",
      description:
        "Maintain a frequency array and slide a window. Shrink from the left whenever windowLen - maxFreq > k. Each character moves at most twice, giving O(n) time.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "minimum-size-subarray-sum": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every starting index i, accumulate a sum moving right. As soon as sum ≥ target, record the length and stop that start. O(n²) time.",
      time: "O(n²)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    sliding: {
      id: "sliding",
      name: "Sliding Window",
      description:
        "Move a right pointer accumulating a sum. While the sum ≥ target, shrink from the left, recording the shortest window. Each element is visited at most twice, giving O(n) time.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "max-consecutive-ones-iii": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every starting index i, extend a window counting zeros. A window is valid while zeroCount ≤ k. Track the longest valid window. O(n²) time.",
      time: "O(n²)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    sliding: {
      id: "sliding",
      name: "Sliding Window",
      description:
        "Move a right pointer counting zeros. While zeroCount > k, shrink from the left. Each element is visited at most twice, giving O(n) time.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "minimum-window-substring": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every starting index i, extend a window to the right and check if it covers all of t using frequency arrays. Track the shortest covering window. O(n²·m) time.",
      time: "O(n²·m)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    sliding: {
      id: "sliding",
      name: "Sliding Window",
      description:
        "Expand a window with a right pointer, tracking how many distinct characters of t are satisfied. When all are met, shrink from the left to find the shortest. O(n) time.",
      time: "O(n)",
      space: "O(m)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "maximum-subarray": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every starting index i, extend a subarray to the right, accumulating the sum and tracking the maximum. Checks every subarray, giving O(n²) time.",
      time: "O(n²)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    kadane: {
      id: "kadane",
      name: "Kadane's Algorithm",
      description:
        "Maintain the best subarray sum ending at each position. Either extend the previous subarray or start a new one at the current element. O(n) time.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "maximum-sum-circular-subarray": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every starting index i, walk around the circular array with j, accumulating a running sum and tracking the maximum. O(n²) time.",
      time: "O(n²)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    kadane: {
      id: "kadane",
      name: "Kadane's with Min Subarray (Optimal)",
      description:
        "Compute the max non-wrapping subarray with Kadane's and the min subarray too. The best wrapping subarray is totalSum - minSum. O(n) time.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "maximum-product-subarray": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every starting index i, extend a subarray to the right, accumulating the product and tracking the maximum. O(n²) time.",
      time: "O(n²)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    dp: {
      id: "dp",
      name: "Dynamic Programming (Track Min and Max)",
      description:
        "Track both the max and min product ending at each position, since a negative times a negative can become large. O(n) time.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "best-sightseeing-pair": {
    brute: {
      id: "brute",
      name: "Brute Force",
      description:
        "For every pair (i, j) with i < j, compute values[i] + values[j] + i - j and track the maximum. O(n²) time.",
      time: "O(n²)",
      space: "O(1)",
      accent: "from-rose-500 to-pink-500",
    },
    running: {
      id: "running",
      name: "Decomposition with Running Maximum",
      description:
        "Rewrite the score as (values[i] + i) + (values[j] - j). Keep the best values[i] + i seen so far as j advances, giving O(n) time.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-emerald-500 to-teal-500",
    },
  },
  "transpose-matrix": {
    direct: {
      id: "direct",
      name: "Direct Construction",
      description:
        "Create a result with swapped dimensions, then iterate over the original matrix placing matrix[i][j] into result[j][i]. Straightforward and easy to follow.",
      time: "O(m·n)",
      space: "O(m·n)",
      accent: "from-emerald-500 to-teal-500",
    },
    column: {
      id: "column",
      name: "Column-Based Construction",
      description:
        "Iterate over the result matrix instead: each column of the original becomes a row of the result by reading matrix[i][j] down each column j.",
      time: "O(m·n)",
      space: "O(m·n)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "spiral-matrix": {
    simulate: {
      id: "simulate",
      name: "Simulation with Direction Arrays",
      description:
        "Walk through the matrix using direction vectors (right, down, left, up). Track visited cells and turn right whenever the next step is out of bounds or already visited.",
      time: "O(m·n)",
      space: "O(m·n)",
      accent: "from-emerald-500 to-teal-500",
    },
    layer: {
      id: "layer",
      name: "Layer-by-Layer (Boundary Shrinking)",
      description:
        "Traverse the outer ring first, then shrink the top/bottom/left/right boundaries inward and repeat. No extra space needed.",
      time: "O(m·n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "rotate-image": {
    space: {
      id: "space",
      name: "Using Extra Space",
      description:
        "Copy each element into a rotated array where matrix[i][j] goes to rotated[j][n-1-i], then copy back. Simple but uses O(n²) space.",
      time: "O(n²)",
      space: "O(n²)",
      accent: "from-emerald-500 to-teal-500",
    },
    transpose: {
      id: "transpose",
      name: "Transpose + Reverse",
      description:
        "First transpose the matrix in place (swap across the diagonal), then reverse each row. Rotates 90° clockwise using O(1) extra space.",
      time: "O(n²)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "set-matrix-zeroes": {
    copy: {
      id: "copy",
      name: "Brute Force (Copy Matrix)",
      description:
        "Copy the matrix, then for each zero in the copy, zero out the corresponding row and column in the original. Simple but uses O(m·n) space.",
      time: "O(m·n·(m+n))",
      space: "O(m·n)",
      accent: "from-emerald-500 to-teal-500",
    },
    hash: {
      id: "hash",
      name: "Hash Sets",
      description:
        "First pass records which rows and columns contain zeroes in sets. Second pass zeroes any cell whose row or column is marked. O(m·n) time, O(m+n) space.",
      time: "O(m·n)",
      space: "O(m+n)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "candy-crush": {
    bool: {
      id: "bool",
      name: "Simulation with Boolean Marking",
      description:
        "Repeatedly mark horizontal and vertical runs of 3+ with a boolean grid, crush marked cells to 0, then apply gravity. Uses a separate marking grid.",
      time: "O((m·n)²)",
      space: "O(m·n)",
      accent: "from-emerald-500 to-teal-500",
    },
    neg: {
      id: "neg",
      name: "In-Place Simulation with Negation",
      description:
        "Mark runs in place by negating their values, then crush and apply gravity in one pass. Uses O(1) extra space.",
      time: "O((m·n)²)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "valid-sudoku": {
    threepass: {
      id: "threepass",
      name: "Three Separate Passes",
      description:
        "Check each row, then each column, then each 3×3 sub-box for duplicates using a set. Clear and straightforward.",
      time: "O(81)",
      space: "O(9)",
      accent: "from-emerald-500 to-teal-500",
    },
    singlepass: {
      id: "singlepass",
      name: "Single Pass with Hash Sets",
      description:
        "Maintain a set per row, column, and box. As you scan each cell, check all three constraints at once and add to each set.",
      time: "O(81)",
      space: "O(81)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "game-of-life": {
    copy: {
      id: "copy",
      name: "Brute Force (Copy Board)",
      description:
        "Copy the board to read original states, then count live neighbors for each cell and apply the four rules. Uses O(m·n) space.",
      time: "O(m·n)",
      space: "O(m·n)",
      accent: "from-emerald-500 to-teal-500",
    },
    encode: {
      id: "encode",
      name: "In-Place with State Encoding",
      description:
        "Encode transitions in place: 2 for dead→alive and 3 for alive→dead. Original state is read via % 2. Final pass decodes to 0/1. O(1) space.",
      time: "O(m·n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "intersection-of-two-linked-lists": {
    hashset: {
      id: "hashset",
      name: "Hash Set",
      description:
        "Store every node of list A in a set, then walk list B and return the first node that is already in the set. O(m+n) time, O(m) space.",
      time: "O(m+n)",
      space: "O(m)",
      accent: "from-emerald-500 to-teal-500",
    },
    twopointer: {
      id: "twopointer",
      name: "Two Pointers",
      description:
        "Each pointer traverses both lists; when one reaches the end it switches to the other list's head. They meet at the intersection or null. O(m+n) time, O(1) space.",
      time: "O(m+n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "remove-duplicates-from-sorted-list": {
    set: {
      id: "set",
      name: "Using a Hash Set",
      description:
        "Track seen values in a set and skip any node whose value is already present. Simple but uses O(n) extra space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
    inplace: {
      id: "inplace",
      name: "Single Pass In-Place (Optimal)",
      description:
        "Since the list is sorted, duplicates are adjacent. Compare each node with its next and skip duplicates in place. O(n) time, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "design-linked-list": {
    singly: {
      id: "singly",
      name: "Singly Linked List",
      description:
        "Implement the list with a single sentinel node and a size counter. Each operation walks from the sentinel to the target index.",
      time: "O(n) per op",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
    doubly: {
      id: "doubly",
      name: "Doubly Linked List",
      description:
        "Use head and tail sentinels with prev/next pointers. Access from whichever end is closer, halving the average walk distance.",
      time: "O(n) per op",
      space: "O(n)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "remove-nth-node-from-end-of-list": {
    twopass: {
      id: "twopass",
      name: "Two Pass (Count then Remove)",
      description:
        "First pass counts the total length. Second pass advances (length - n) steps from a dummy node to reach the predecessor, then removes the target.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-emerald-500 to-teal-500",
    },
    onepass: {
      id: "onepass",
      name: "One Pass (Two Pointers)",
      description:
        "Advance a fast pointer n+1 steps ahead, then move slow and fast together. When fast reaches the end, slow is before the target. O(n) time, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "remove-duplicates-from-sorted-list-ii": {
    map: {
      id: "map",
      name: "Hash Map (Two Pass)",
      description:
        "First pass counts each value's frequency. Second pass removes every node whose value appears more than once. O(n) time, O(n) space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
    single: {
      id: "single",
      name: "Single Pass with Dummy Node (Optimal)",
      description:
        "Walk the list once; when a run of equal values is found, skip the entire run. Uses a dummy node to handle head removal. O(n) time, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "swap-nodes-in-pairs": {
    recursive: {
      id: "recursive",
      name: "Recursive",
      description:
        "Swap the first two nodes, then recursively swap the rest of the list. Clean and elegant, but uses O(n) call-stack space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
    iterative: {
      id: "iterative",
      name: "Iterative with Dummy Node",
      description:
        "Use a dummy node and rewire three pointers per pair in a loop. O(n) time, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "copy-list-with-random-pointer": {
    map: {
      id: "map",
      name: "Hash Map (Two Pass)",
      description:
        "First pass creates a copy node for each original and maps original→copy. Second pass wires up next and random pointers using the map. O(n) time, O(n) space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
    interleave: {
      id: "interleave",
      name: "Interleaving Nodes (O(1) Space)",
      description:
        "Interleave copy nodes after each original, set random pointers, then separate the two lists. O(n) time, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "partition-list": {
    array: {
      id: "array",
      name: "Collect into Array and Rebuild",
      description:
        "Collect values into less and greater arrays, concatenate, and rebuild a new list. Simple but uses O(n) extra space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
    twodummy: {
      id: "twodummy",
      name: "Two Dummy Lists (Optimal)",
      description:
        "Distribute nodes into two chains (less and greater) using dummy heads, then connect them. O(n) time, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "rotate-list": {
    brute: {
      id: "brute",
      name: "Brute Force (Rotate One at a Time)",
      description:
        "Rotate the list right by one position k times, each time moving the last node to the front. O(n·k) time.",
      time: "O(n·k)",
      space: "O(1)",
      accent: "from-emerald-500 to-teal-500",
    },
    split: {
      id: "split",
      name: "Find Split Point (Optimal)",
      description:
        "Find the length and tail, form a circular list, then break it at the new tail after (n - k) steps. O(n) time, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "add-two-numbers": {
    iterative: {
      id: "iterative",
      name: "Iterative with Carry",
      description:
        "Walk both lists together, adding digits and carrying. Handles unequal lengths and a final carry. O(max(m,n)) time, O(max(m,n)) space.",
      time: "O(m+n)",
      space: "O(m+n)",
      accent: "from-emerald-500 to-teal-500",
    },
    recursive: {
      id: "recursive",
      name: "Recursive",
      description:
        "Recursively add digits with a carry, building the result list from the tail. Clean but uses O(max(m,n)) call-stack space.",
      time: "O(m+n)",
      space: "O(m+n)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "flatten-a-multilevel-doubly-linked-list": {
    dfs: {
      id: "dfs",
      name: "DFS with Stack",
      description:
        "Use a stack to simulate a depth-first traversal, linking each node to the previous one and pushing next then child. O(n) time, O(n) space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
    iterative: {
      id: "iterative",
      name: "Iterative In-Place (Optimal)",
      description:
        "Walk the list; when a child exists, splice the entire child chain between the current node and its next. O(n) time, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "palindrome-linked-list": {
    array: {
      id: "array",
      name: "Copy to Array",
      description:
        "Copy all values into an array, then use two pointers to check if it reads the same forward and backward. O(n) time, O(n) space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
    reversehalf: {
      id: "reversehalf",
      name: "Reverse Second Half (Optimal)",
      description:
        "Find the middle with slow/fast pointers, reverse the second half in place, then compare both halves. O(n) time, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "reverse-linked-list": {
    iterative: {
      id: "iterative",
      name: "Iterative (Three Pointers)",
      description:
        "Walk the list with prev, curr, and next pointers, reversing each link as you go. O(n) time, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-emerald-500 to-teal-500",
    },
    recursive: {
      id: "recursive",
      name: "Recursive",
      description:
        "Recursively reverse the rest of the list, then fix the pointers so the next node points back to the current. O(n) time, O(n) space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "reverse-linked-list-ii": {
    extract: {
      id: "extract",
      name: "Extract, Reverse, and Reinsert",
      description:
        "Collect the values in the range, reverse them, and write them back. Simple but uses O(n) extra space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
    inplace: {
      id: "inplace",
      name: "In-Place Reversal with Pointer Manipulation",
      description:
        "Use a dummy node and repeatedly move each next node to the front of the reversed section. O(n) time, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "reverse-nodes-in-k-group": {
    array: {
      id: "array",
      name: "Extract to Array and Rebuild",
      description:
        "Collect values into an array, reverse each complete group of k, then write them back. Simple but uses O(n) extra space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
    inplace: {
      id: "inplace",
      name: "Iterative In-Place Reversal",
      description:
        "Use a dummy node and reverse each group of k nodes in place, reconnecting after each group. O(n) time, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "middle-of-the-linked-list": {
    array: {
      id: "array",
      name: "Convert to Array",
      description:
        "Collect all nodes into an array, then return the node at index floor(n/2). O(n) time, O(n) space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
    twopass: {
      id: "twopass",
      name: "Two-Pass (Count then Traverse)",
      description:
        "First pass counts the nodes, second pass walks to the middle. O(n) time, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "happy-number": {
    set: {
      id: "set",
      name: "Hash Set",
      description:
        "Repeatedly replace n with the sum of the squares of its digits, tracking seen values in a set. If we reach 1 it's happy; if we see a repeat, it's a cycle. O(log n) time, O(log n) space.",
      time: "O(log n)",
      space: "O(log n)",
      accent: "from-emerald-500 to-teal-500",
    },
    floyd: {
      id: "floyd",
      name: "Floyd's Cycle Detection (Two Pointers)",
      description:
        "Use slow and fast pointers. If fast reaches 1 it's happy; if slow meets fast, a cycle exists. O(log n) time, O(1) space.",
      time: "O(log n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
  "linked-list-cycle-ii": {
    set: {
      id: "set",
      name: "Hash Set",
      description:
        "Walk the list storing each node in a set. The first node already in the set is the cycle start. O(n) time, O(n) space.",
      time: "O(n)",
      space: "O(n)",
      accent: "from-emerald-500 to-teal-500",
    },
    floyd: {
      id: "floyd",
      name: "Floyd's Tortoise and Hare (Optimal)",
      description:
        "Phase 1 detects the cycle with slow/fast pointers. Phase 2 resets slow to head and advances both one step to find the cycle start. O(n) time, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      accent: "from-sky-500 to-blue-500",
    },
  },
};

export function getApproachInfos(slug: string): ApproachInfo[] {
  const map = APPROACH_INFO[slug];
  if (!map) return [];
  return Object.values(map);
}
