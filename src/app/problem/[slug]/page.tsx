"use client";

import { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ApproachPlayer } from "@/components/ApproachPlayer";
import { EmptyState } from "@/components/EmptyState";
import LogoMark from "@/components/LogoMark";
import { useProblems } from "@/hooks/useProblems";
import { getApproachInfos } from "@/lib/approaches";
import { mcoSources, thirdMaxSources, moveZeroesSources, shuffleSources, majoritySources, removeDuplicatesSources, removeElementSources, maxProfitSources, missingRangesSources, majority2Sources, rotateSources, productSources, removeDuplicates2Sources, maxProfit2Sources, zeroFilledSources, increasingTripletSources, nextPermutationSources, firstMissingPositiveSources, reverseStringSources, lengthOfLastWordSources, isSubsequenceSources, validPalindromeSources, validPalindromeIISources, validAnagramSources, rotateStringSources, longestCommonPrefixSources, longestPalindromeSources, strStrSources, zigzagSources, reverseWordsSources, singleNumberSources, missingNumberSources, setMismatchSources, powerOfTwoSources, hammingWeightSources, countingBitsSources, hammingDistanceSources, reverseBitsSources, rangeBitwiseAndSources, singleNumberIISources, singleNumberIIISources, getSumSources, designHashMapSources, containsDuplicateSources, wordPatternSources, firstUniqCharSources, findDisappearedSources, maxBalloonsSources, numIdenticalPairsSources, isIsomorphicSources, canConstructSources, containsNearbyDuplicateSources, intersectSources, groupAnagramsSources, tinyURLSources, reorganizeStringSources, longestConsecutiveSources, isPossibleSources, numMatchingSubseqSources, numSplitsSources, mergeSortedArraySources, mergeAlternatelySources, sortedSquaresSources, twoSumSources, backspaceCompareSources, validWordAbbrSources, countBinarySubstringsSources, twoSumIISortedSources, maxAreaSources, threeSumSources, fourSumSources, trapSources, runningSumSources, rangeSumSources, pivotIndexSources, maxPopSources, subarraySumSources, subarraysDivByKSources, checkSubarraySumSources, findMaxLengthSources, maxAvgSources, findAnagramsSources, checkInclusionSources, maxDistinctSources, findSubstringSources, longSubNoRepeatSources, charReplacementSources, minSubArrayLenSources, longestOnesSources, minWindowSources, maxSubArraySources, maxCircularSources, maxProductSources, sightseeingSources, transposeSources, spiralSources, rotateImageSources, setZeroesSources, candyCrushSources, sudokuSources, gameOfLifeSources, intersectionSources, deleteDuplicatesSources, designLinkedListSources, removeNthSources, deleteDuplicatesIISources, swapPairsSources, copyRandomListSources, partitionSources, rotateListSources, addTwoNumbersSources, flattenSources, palindromeSources, reverseListSources, reverseBetweenSources, reverseKGroupSources, middleNodeSources, happyNumberSources, detectCycleSources } from "@/lib/traces";

function DifficultyBadge({ d }: { d: string }) {
  const cls =
    d === "easy"
      ? "bg-accent/10 text-accent border-accent/20"
      : d === "medium"
      ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
      : "bg-rose-400/10 text-rose-400 border-rose-400/20";
  return <span className={`rounded-md px-2.5 py-1 text-xs font-bold border ${cls}`}>{d}</span>;
}

export default function ProblemPage() {
  const params = useParams<{ slug: string }>();
  const { problems, loaded } = useProblems();
  const isStringInput = params.slug === "reverse-string" || params.slug === "length-of-last-word" || params.slug === "valid-palindrome" || params.slug === "valid-palindrome-ii" || params.slug === "longest-common-prefix" || params.slug === "longest-palindrome" || params.slug === "zigzag-conversion" || params.slug === "reverse-words-in-a-string" || params.slug === "first-unique-character-in-a-string" || params.slug === "maximum-number-of-balloons" || params.slug === "group-anagrams" || params.slug === "reorganize-string" || params.slug === "number-of-good-ways-to-split-a-string" || params.slug === "count-binary-substrings" || params.slug === "longest-substring-without-repeating-characters" || params.slug === "longest-repeating-character-replacement";
  const isTwoStringInput = params.slug === "is-subsequence" || params.slug === "valid-anagram" || params.slug === "rotate-string" || params.slug === "find-the-index-of-the-first-occurrence-in-a-string" || params.slug === "word-pattern" || params.slug === "isomorphic-strings" || params.slug === "ransom-note" || params.slug === "number-of-matching-subsequences" || params.slug === "merge-strings-alternately" || params.slug === "backspace-string-compare" || params.slug === "valid-word-abbreviation" || params.slug === "find-all-anagrams-in-a-string" || params.slug === "permutation-in-string" || params.slug === "substring-with-concatenation-of-all-words" || params.slug === "minimum-window-substring";

  // Per-problem default input (string for string problems, number array otherwise).
  const DEFAULT_INPUT: Record<string, number[] | string> = {
    "max-consecutive-ones": [1, 1, 0, 1, 1, 1],
    "third-maximum-number": [3, 2, 1],
    "move-zeroes": [0, 1, 0, 3, 12],
    "shuffle-the-array": [2, 5, 1, 3, 4, 7],
    "majority-element": [3, 2, 3],
    "remove-duplicates-from-sorted-array": [1, 1, 2],
    "remove-element": [3, 2, 2, 3],
    "best-time-to-buy-and-sell-stock": [7, 1, 5, 3, 6, 4],
    "missing-ranges": [0, 1, 3, 50, 75],
    "majority-element-ii": [3, 2, 3],
    "rotate-array": [1, 2, 3, 4, 5, 6, 7],
    "product-of-array-except-self": [1, 2, 3, 4],
    "remove-duplicates-from-sorted-array-ii": [1, 1, 1, 2, 2, 3],
    "best-time-to-buy-and-sell-stock-ii": [7, 1, 5, 3, 6, 4],
    "number-of-zero-filled-subarrays": [1, 3, 0, 0, 2, 0, 0, 4],
    "increasing-triplet-subsequence": [2, 1, 5, 0, 4, 6],
    "next-permutation": [1, 2, 3],
    "first-missing-positive": [3, 4, -1, 1],
    "reverse-string": "hello",
    "length-of-last-word": "hello world",
    "is-subsequence": "abc",
    "valid-palindrome": "A man, a plan, a canal: Panama",
    "valid-palindrome-ii": "abca",
    "valid-anagram": "anagram",
    "rotate-string": "abcde",
    "longest-common-prefix": "flower flow flight",
    "longest-palindrome": "abccccdd",
    "find-the-index-of-the-first-occurrence-in-a-string": "sadbutsad",
    "zigzag-conversion": "PAYPALISHIRING",
    "reverse-words-in-a-string": "the sky is blue",
    "single-number": [4, 1, 2, 1, 2],
    "missing-number": [3, 0, 1],
    "set-mismatch": [1, 2, 2, 4],
    "power-of-two": [16],
    "number-of-1-bits": [11],
    "counting-bits": [5],
    "hamming-distance": [1, 4],
    "reverse-bits": [43261596],
    "bitwise-and-of-numbers-range": [5, 7],
    "single-number-ii": [2, 2, 3, 2],
    "single-number-iii": [1, 2, 1, 3, 2, 5],
    "sum-of-two-integers": [1, 2],
    "design-hashmap": [1, 2, 3],
    "contains-duplicate": [1, 2, 3, 1],
    "word-pattern": "abba",
    "first-unique-character-in-a-string": "leetcode",
    "find-all-numbers-disappeared-in-an-array": [4, 3, 2, 7, 8, 2, 3, 1],
    "maximum-number-of-balloons": "nlaebolko",
    "number-of-good-pairs": [1, 2, 3, 1, 1, 3],
    "isomorphic-strings": "egg",
    "ransom-note": "aa",
    "contains-duplicate-ii": [1, 2, 3, 1],
    "intersection-of-two-arrays-ii": [1, 2, 2, 1],
    "group-anagrams": "eat tea tan ate nat bat",
    "encode-and-decode-tinyurl": [0],
    "reorganize-string": "aab",
    "longest-consecutive-sequence": [100, 4, 200, 1, 3, 2],
    "split-array-into-consecutive-subsequences": [1, 2, 3, 3, 4, 5],
    "number-of-matching-subsequences": "abcde",
    "number-of-good-ways-to-split-a-string": "aacaba",
    "merge-sorted-array": [1, 2, 3, 0, 0, 0],
    "merge-strings-alternately": "abc",
    "squares-of-a-sorted-array": [-4, -1, 0, 3, 10],
    "two-sum": [2, 7, 11, 15],
    "backspace-string-compare": "ab#c",
    "valid-word-abbreviation": "internationalization",
    "count-binary-substrings": "00110011",
    "two-sum-ii-input-array-is-sorted": [2, 7, 11, 15],
    "container-with-most-water": [1, 8, 6, 2, 5, 4, 8, 3, 7],
    "3sum": [-1, 0, 1, 2, -1, -4],
    "4sum": [1, 0, -1, 0, -2, 2],
    "trapping-rain-water": [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
    "running-sum-of-1d-array": [1, 2, 3, 4],
    "range-sum-query-immutable": [-2, 0, 3, -5, 2, -1],
    "find-pivot-index": [1, 7, 3, 6, 5, 6],
    "maximum-population-year": [1993, 1999, 2000, 2010],
    "subarray-sum-equals-k": [1, 1, 1],
    "subarray-sums-divisible-by-k": [4, 5, 0, -2, -3, 1],
    "continuous-subarray-sum": [23, 2, 4, 6, 7],
    "contiguous-array": [0, 1, 0],
    "maximum-average-subarray-i": [1, 12, -5, -6, 50, 3],
    "find-all-anagrams-in-a-string": "cbaebabacd",
    "permutation-in-string": "ab",
    "maximum-sum-of-distinct-subarrays-with-length-k": [1, 5, 4, 2, 9, 9, 9],
    "substring-with-concatenation-of-all-words": "barfoothefoobarman",
    "longest-substring-without-repeating-characters": "abcabcbb",
    "longest-repeating-character-replacement": "ABAB",
    "minimum-size-subarray-sum": [2, 3, 1, 2, 4, 3],
    "max-consecutive-ones-iii": [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
    "minimum-window-substring": "ADOBECODEBANC",
    "maximum-subarray": [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    "maximum-sum-circular-subarray": [1, -2, 3, -2],
    "maximum-product-subarray": [2, 3, -2, 4],
    "best-sightseeing-pair": [8, 1, 5, 2, 6],
    "transpose-matrix": [1, 2, 3, 4, 5, 6],
    "spiral-matrix": [1, 2, 3, 4, 5, 6, 7, 8, 9],
    "rotate-image": [1, 2, 3, 4, 5, 6, 7, 8, 9],
    "set-matrix-zeroes": [1, 1, 1, 1, 0, 1, 1, 1, 1],
    "candy-crush": [110, 5, 112, 113, 114, 210, 5, 112, 113, 114, 110, 5, 112, 113, 114, 110, 5, 112, 113, 114, 110, 5, 112, 113, 114, 110, 5, 112, 113, 114],
    "valid-sudoku": [5,3,0,0,7,0,0,0,0, 6,0,0,1,9,5,0,0,0, 0,9,8,0,0,0,0,6,0, 8,0,0,0,6,0,0,0,3, 4,0,0,8,0,3,0,0,1, 7,0,0,0,2,0,0,0,6, 0,6,0,0,0,0,2,8,0, 0,0,0,4,1,9,0,0,5, 0,0,0,0,8,0,0,7,9],
    "game-of-life": [0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    "intersection-of-two-linked-lists": [4, 1, 8, 4, 5],
    "remove-duplicates-from-sorted-list": [1, 1, 2],
    "design-linked-list": [1, 2, 3],
    "remove-nth-node-from-end-of-list": [1, 2, 3, 4, 5],
    "remove-duplicates-from-sorted-list-ii": [1, 2, 3, 3, 4, 4, 5],
    "swap-nodes-in-pairs": [1, 2, 3, 4],
    "copy-list-with-random-pointer": [7, 13, 11, 10, 1],
    "partition-list": [1, 4, 3, 2, 5, 2],
    "rotate-list": [1, 2, 3, 4, 5],
    "add-two-numbers": [2, 4, 3],
    "flatten-a-multilevel-doubly-linked-list": [1, 2, 3, 4, 5, 6],
    "palindrome-linked-list": [1, 2, 2, 1],
    "reverse-linked-list": [1, 2, 3, 4, 5],
    "reverse-linked-list-ii": [1, 2, 3, 4, 5],
    "reverse-nodes-in-k-group": [1, 2, 3, 4, 5],
    "middle-of-the-linked-list": [1, 2, 3, 4, 5],
    "happy-number": [19],
    "linked-list-cycle-ii": [3, 2, 0, -4],
  };

  const DEFAULT_INPUT2: Record<string, string> = {
    "is-subsequence": "ahbgdc",
    "valid-anagram": "nagaram",
    "rotate-string": "cdeab",
    "find-the-index-of-the-first-occurrence-in-a-string": "sad",
    "word-pattern": "dog cat cat dog",
    "isomorphic-strings": "add",
    "ransom-note": "aab",
    "number-of-matching-subsequences": "a bb acd ace",
    "merge-strings-alternately": "pqr",
    "backspace-string-compare": "ad#c",
    "valid-word-abbreviation": "i12iz4n",
    "find-all-anagrams-in-a-string": "abc",
    "permutation-in-string": "eidbaooo",
    "substring-with-concatenation-of-all-words": "foo bar",
    "minimum-window-substring": "ABC",
  };

  const DEFAULT_LIST2: Record<string, number[]> = {
    "intersection-of-two-linked-lists": [5, 6, 1, 8, 4, 5],
    "add-two-numbers": [5, 6, 4],
    "copy-list-with-random-pointer": [0, 1, 2, 3, 4],
  };

  const defaultInput = DEFAULT_INPUT[params.slug] ?? [1, 1, 0, 1, 1, 1];
  const defaultStr = typeof defaultInput === "string" ? defaultInput : "hello";
  const defaultStr2 = DEFAULT_INPUT2[params.slug] ?? "";
  const defaultList2 = DEFAULT_LIST2[params.slug] ?? [];
  const [nums, setNums] = useState<number[]>(isStringInput || isTwoStringInput ? defaultStr.split("").map((c) => c.charCodeAt(0)) : (defaultInput as number[]));
  const [str, setStr] = useState<string>(defaultStr);
  const [str2, setStr2] = useState<string>(defaultStr2);
  const [list2, setList2] = useState<number[]>(defaultList2);
  const [n, setN] = useState<number>(3);
  const [val, setVal] = useState<number>(0);
  const [lower, setLower] = useState<number>(0);
  const [upper, setUpper] = useState<number>(99);
  const [k, setK] = useState<number>(3);
  const [numRows, setNumRows] = useState<number>(3);
  const [k2, setK2] = useState<number>(3);
  const [mergeM, setMergeM] = useState<number>(3);
  const [target, setTarget] = useState<number>(9);
  const [left, setLeft] = useState<number>(0);
  const [right, setRight] = useState<number>(2);
  const [kVal, setKVal] = useState<number>(2);
  const [winK, setWinK] = useState<number>(4);
  const [mRows, setMRows] = useState<number>(3);
  const [mCols, setMCols] = useState<number>(3);
  const [cycleStart, setCycleStart] = useState<number>(1);

  const problem = problems.find((p) => p.slug === params.slug) ?? null;

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-text-muted">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
        <span className="ml-3 text-sm">Loading…</span>
      </div>
    );
  }

  if (!problem) {
    return <EmptyState title="Problem not found" message="The problem doesn't exist in the database." />;
  }

  const approachInfos = getApproachInfos(problem.slug);
  const sources =
    problem.slug === "third-maximum-number"
      ? (thirdMaxSources as Record<string, string>)
      : problem.slug === "move-zeroes"
      ? (moveZeroesSources as Record<string, string>)
      : problem.slug === "shuffle-the-array"
      ? (shuffleSources as Record<string, string>)
      : problem.slug === "majority-element"
      ? (majoritySources as Record<string, string>)
      : problem.slug === "remove-duplicates-from-sorted-array"
      ? (removeDuplicatesSources as Record<string, string>)
      : problem.slug === "remove-element"
      ? (removeElementSources as Record<string, string>)
      : problem.slug === "best-time-to-buy-and-sell-stock"
      ? (maxProfitSources as Record<string, string>)
      : problem.slug === "missing-ranges"
      ? (missingRangesSources as Record<string, string>)
      : problem.slug === "majority-element-ii"
      ? (majority2Sources as Record<string, string>)
      : problem.slug === "rotate-array"
      ? (rotateSources as Record<string, string>)
      : problem.slug === "product-of-array-except-self"
      ? (productSources as Record<string, string>)
      : problem.slug === "remove-duplicates-from-sorted-array-ii"
      ? (removeDuplicates2Sources as Record<string, string>)
      : problem.slug === "best-time-to-buy-and-sell-stock-ii"
      ? (maxProfit2Sources as Record<string, string>)
      : problem.slug === "number-of-zero-filled-subarrays"
      ? (zeroFilledSources as Record<string, string>)
      : problem.slug === "increasing-triplet-subsequence"
      ? (increasingTripletSources as Record<string, string>)
      : problem.slug === "next-permutation"
      ? (nextPermutationSources as Record<string, string>)
      : problem.slug === "first-missing-positive"
      ? (firstMissingPositiveSources as Record<string, string>)
      : problem.slug === "reverse-string"
      ? (reverseStringSources as Record<string, string>)
      : problem.slug === "length-of-last-word"
      ? (lengthOfLastWordSources as Record<string, string>)
      : problem.slug === "is-subsequence"
      ? (isSubsequenceSources as Record<string, string>)
      : problem.slug === "valid-palindrome"
      ? (validPalindromeSources as Record<string, string>)
      : problem.slug === "valid-palindrome-ii"
      ? (validPalindromeIISources as Record<string, string>)
      : problem.slug === "valid-anagram"
      ? (validAnagramSources as Record<string, string>)
      : problem.slug === "rotate-string"
      ? (rotateStringSources as Record<string, string>)
      : problem.slug === "longest-common-prefix"
      ? (longestCommonPrefixSources as Record<string, string>)
      : problem.slug === "longest-palindrome"
      ? (longestPalindromeSources as Record<string, string>)
      : problem.slug === "find-the-index-of-the-first-occurrence-in-a-string"
      ? (strStrSources as Record<string, string>)
      : problem.slug === "zigzag-conversion"
      ? (zigzagSources as Record<string, string>)
      : problem.slug === "reverse-words-in-a-string"
      ? (reverseWordsSources as Record<string, string>)
      : problem.slug === "single-number"
      ? (singleNumberSources as Record<string, string>)
      : problem.slug === "missing-number"
      ? (missingNumberSources as Record<string, string>)
      : problem.slug === "set-mismatch"
      ? (setMismatchSources as Record<string, string>)
      : problem.slug === "power-of-two"
      ? (powerOfTwoSources as Record<string, string>)
      : problem.slug === "number-of-1-bits"
      ? (hammingWeightSources as Record<string, string>)
      : problem.slug === "counting-bits"
      ? (countingBitsSources as Record<string, string>)
      : problem.slug === "hamming-distance"
      ? (hammingDistanceSources as Record<string, string>)
      : problem.slug === "reverse-bits"
      ? (reverseBitsSources as Record<string, string>)
      : problem.slug === "bitwise-and-of-numbers-range"
      ? (rangeBitwiseAndSources as Record<string, string>)
      : problem.slug === "single-number-ii"
      ? (singleNumberIISources as Record<string, string>)
      : problem.slug === "single-number-iii"
      ? (singleNumberIIISources as Record<string, string>)
      : problem.slug === "sum-of-two-integers"
      ? (getSumSources as Record<string, string>)
      : problem.slug === "design-hashmap"
      ? (designHashMapSources as Record<string, string>)
      : problem.slug === "contains-duplicate"
      ? (containsDuplicateSources as Record<string, string>)
      : problem.slug === "word-pattern"
      ? (wordPatternSources as Record<string, string>)
      : problem.slug === "first-unique-character-in-a-string"
      ? (firstUniqCharSources as Record<string, string>)
      : problem.slug === "find-all-numbers-disappeared-in-an-array"
      ? (findDisappearedSources as Record<string, string>)
      : problem.slug === "maximum-number-of-balloons"
      ? (maxBalloonsSources as Record<string, string>)
      : problem.slug === "number-of-good-pairs"
      ? (numIdenticalPairsSources as Record<string, string>)
      : problem.slug === "isomorphic-strings"
      ? (isIsomorphicSources as Record<string, string>)
      : problem.slug === "ransom-note"
      ? (canConstructSources as Record<string, string>)
      : problem.slug === "contains-duplicate-ii"
      ? (containsNearbyDuplicateSources as Record<string, string>)
      : problem.slug === "intersection-of-two-arrays-ii"
      ? (intersectSources as Record<string, string>)
      : problem.slug === "group-anagrams"
      ? (groupAnagramsSources as Record<string, string>)
      : problem.slug === "encode-and-decode-tinyurl"
      ? (tinyURLSources as Record<string, string>)
      : problem.slug === "reorganize-string"
      ? (reorganizeStringSources as Record<string, string>)
      : problem.slug === "longest-consecutive-sequence"
      ? (longestConsecutiveSources as Record<string, string>)
      : problem.slug === "split-array-into-consecutive-subsequences"
      ? (isPossibleSources as Record<string, string>)
      : problem.slug === "number-of-matching-subsequences"
      ? (numMatchingSubseqSources as Record<string, string>)
      : problem.slug === "number-of-good-ways-to-split-a-string"
      ? (numSplitsSources as Record<string, string>)
      : problem.slug === "merge-sorted-array"
      ? (mergeSortedArraySources as Record<string, string>)
      : problem.slug === "merge-strings-alternately"
      ? (mergeAlternatelySources as Record<string, string>)
      : problem.slug === "squares-of-a-sorted-array"
      ? (sortedSquaresSources as Record<string, string>)
      : problem.slug === "two-sum"
      ? (twoSumSources as Record<string, string>)
      : problem.slug === "backspace-string-compare"
      ? (backspaceCompareSources as Record<string, string>)
      : problem.slug === "valid-word-abbreviation"
      ? (validWordAbbrSources as Record<string, string>)
      : problem.slug === "count-binary-substrings"
      ? (countBinarySubstringsSources as Record<string, string>)
      : problem.slug === "two-sum-ii-input-array-is-sorted"
      ? (twoSumIISortedSources as Record<string, string>)
      : problem.slug === "container-with-most-water"
      ? (maxAreaSources as Record<string, string>)
      : problem.slug === "3sum"
      ? (threeSumSources as Record<string, string>)
      : problem.slug === "4sum"
      ? (fourSumSources as Record<string, string>)
      : problem.slug === "trapping-rain-water"
      ? (trapSources as Record<string, string>)
      : problem.slug === "running-sum-of-1d-array"
      ? (runningSumSources as Record<string, string>)
      : problem.slug === "range-sum-query-immutable"
      ? (rangeSumSources as Record<string, string>)
      : problem.slug === "find-pivot-index"
      ? (pivotIndexSources as Record<string, string>)
      : problem.slug === "maximum-population-year"
      ? (maxPopSources as Record<string, string>)
      : problem.slug === "subarray-sum-equals-k"
      ? (subarraySumSources as Record<string, string>)
      : problem.slug === "subarray-sums-divisible-by-k"
      ? (subarraysDivByKSources as Record<string, string>)
      : problem.slug === "continuous-subarray-sum"
      ? (checkSubarraySumSources as Record<string, string>)
      : problem.slug === "contiguous-array"
      ? (findMaxLengthSources as Record<string, string>)
      : problem.slug === "maximum-average-subarray-i"
      ? (maxAvgSources as Record<string, string>)
      : problem.slug === "find-all-anagrams-in-a-string"
      ? (findAnagramsSources as Record<string, string>)
      : problem.slug === "permutation-in-string"
      ? (checkInclusionSources as Record<string, string>)
      : problem.slug === "maximum-sum-of-distinct-subarrays-with-length-k"
      ? (maxDistinctSources as Record<string, string>)
      : problem.slug === "substring-with-concatenation-of-all-words"
      ? (findSubstringSources as Record<string, string>)
      : problem.slug === "longest-substring-without-repeating-characters"
      ? (longSubNoRepeatSources as Record<string, string>)
      : problem.slug === "longest-repeating-character-replacement"
      ? (charReplacementSources as Record<string, string>)
      : problem.slug === "minimum-size-subarray-sum"
      ? (minSubArrayLenSources as Record<string, string>)
      : problem.slug === "max-consecutive-ones-iii"
      ? (longestOnesSources as Record<string, string>)
      : problem.slug === "minimum-window-substring"
      ? (minWindowSources as Record<string, string>)
      : problem.slug === "maximum-subarray"
      ? (maxSubArraySources as Record<string, string>)
      : problem.slug === "maximum-sum-circular-subarray"
      ? (maxCircularSources as Record<string, string>)
      : problem.slug === "maximum-product-subarray"
      ? (maxProductSources as Record<string, string>)
      : problem.slug === "best-sightseeing-pair"
      ? (sightseeingSources as Record<string, string>)
      : problem.slug === "transpose-matrix"
      ? (transposeSources as Record<string, string>)
      : problem.slug === "spiral-matrix"
      ? (spiralSources as Record<string, string>)
      : problem.slug === "rotate-image"
      ? (rotateImageSources as Record<string, string>)
      : problem.slug === "set-matrix-zeroes"
      ? (setZeroesSources as Record<string, string>)
      : problem.slug === "candy-crush"
      ? (candyCrushSources as Record<string, string>)
      : problem.slug === "valid-sudoku"
      ? (sudokuSources as Record<string, string>)
      : problem.slug === "game-of-life"
      ? (gameOfLifeSources as Record<string, string>)
      : problem.slug === "intersection-of-two-linked-lists"
      ? (intersectionSources as Record<string, string>)
      : problem.slug === "remove-duplicates-from-sorted-list"
      ? (deleteDuplicatesSources as Record<string, string>)
      : problem.slug === "design-linked-list"
      ? (designLinkedListSources as Record<string, string>)
      : problem.slug === "remove-nth-node-from-end-of-list"
      ? (removeNthSources as Record<string, string>)
      : problem.slug === "remove-duplicates-from-sorted-list-ii"
      ? (deleteDuplicatesIISources as Record<string, string>)
      : problem.slug === "swap-nodes-in-pairs"
      ? (swapPairsSources as Record<string, string>)
      : problem.slug === "copy-list-with-random-pointer"
      ? (copyRandomListSources as Record<string, string>)
      : problem.slug === "partition-list"
      ? (partitionSources as Record<string, string>)
      : problem.slug === "rotate-list"
      ? (rotateListSources as Record<string, string>)
      : problem.slug === "add-two-numbers"
      ? (addTwoNumbersSources as Record<string, string>)
      : problem.slug === "flatten-a-multilevel-doubly-linked-list"
      ? (flattenSources as Record<string, string>)
      : problem.slug === "palindrome-linked-list"
      ? (palindromeSources as Record<string, string>)
      : problem.slug === "reverse-linked-list"
      ? (reverseListSources as Record<string, string>)
      : problem.slug === "reverse-linked-list-ii"
      ? (reverseBetweenSources as Record<string, string>)
      : problem.slug === "reverse-nodes-in-k-group"
      ? (reverseKGroupSources as Record<string, string>)
      : problem.slug === "middle-of-the-linked-list"
      ? (middleNodeSources as Record<string, string>)
      : problem.slug === "happy-number"
      ? (happyNumberSources as Record<string, string>)
      : problem.slug === "linked-list-cycle-ii"
      ? (detectCycleSources as Record<string, string>)
      : (mcoSources as Record<string, string>);

  return (
    <div className="min-h-screen bg-surface text-text">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors duration-200">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <div className="h-5 w-px bg-border" />
            <LogoMark size="xs" />
            <span className="text-sm font-bold text-accent">
              Code<span className="text-text">Trace</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-text">{problem.title}</span>
            <DifficultyBadge d={problem.difficulty} />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="text-3xl font-black text-text">{problem.title}</h1>
          <p className="mt-3 max-w-2xl text-text-muted">{problem.description}</p>

          <div className="mt-6 flex flex-wrap items-end gap-6">
            <label className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">Input</span>
              {isStringInput || isTwoStringInput ? (
                <input
                  value={str}
                  onChange={(e) => {
                    setStr(e.target.value);
                    setNums(e.target.value.split("").map((c) => c.charCodeAt(0)));
                  }}
                  className="rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                  placeholder="hello"
                />
              ) : (
                <input
                  value={nums.join(", ")}
                  onChange={(e) => {
                    const raw = e.target.value.split(",").map((s) => Number(s.trim()));
                    // max-consecutive-ones is binary; others accept any integer.
                    const filtered = problem.slug === "max-consecutive-ones"
                      ? raw.filter((n) => !isNaN(n) && (n === 0 || n === 1))
                      : raw.filter((n) => !isNaN(n));
                    setNums(filtered);
                  }}
                  className="rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                  placeholder={problem.slug === "max-consecutive-ones" ? "1, 1, 0, 1, 1, 1" : "3, 2, 1"}
                />
              )}
            </label>
            {isTwoStringInput && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">t</span>
                <input
                  value={str2}
                  onChange={(e) => setStr2(e.target.value)}
                  className="rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                  placeholder="second string"
                />
              </label>
            )}
            {(problem.slug === "intersection-of-two-linked-lists" || problem.slug === "add-two-numbers" || problem.slug === "copy-list-with-random-pointer") && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">list2</span>
                <input
                  value={list2.join(", ")}
                  onChange={(e) => {
                    const raw = e.target.value.split(",").map((s) => Number(s.trim()));
                    setList2(raw.filter((n) => !isNaN(n)));
                  }}
                  className="rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                  placeholder="second list"
                />
              </label>
            )}
            {problem.slug === "shuffle-the-array" && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">n</span>
                <input
                  type="number"
                  value={n}
                  onChange={(e) => setN(Number(e.target.value) || 0)}
                  className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                />
              </label>
            )}
            {problem.slug === "zigzag-conversion" && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">numRows</span>
                <input
                  type="number"
                  value={numRows}
                  onChange={(e) => setNumRows(Number(e.target.value) || 1)}
                  className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                />
              </label>
            )}
            {problem.slug === "contains-duplicate-ii" && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">k</span>
                <input
                  type="number"
                  value={k2}
                  onChange={(e) => setK2(Number(e.target.value) || 0)}
                  className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                />
              </label>
            )}
            {problem.slug === "merge-sorted-array" && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">m</span>
                <input
                  type="number"
                  value={mergeM}
                  onChange={(e) => setMergeM(Number(e.target.value) || 0)}
                  className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                />
              </label>
            )}
            {(problem.slug === "two-sum" || problem.slug === "two-sum-ii-input-array-is-sorted" || problem.slug === "4sum") && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">target</span>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value) || 0)}
                  className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                />
              </label>
            )}
            {problem.slug === "remove-element" && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">val</span>
                <input
                  type="number"
                  value={val}
                  onChange={(e) => setVal(Number(e.target.value))}
                  className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                />
              </label>
            )}
            {problem.slug === "missing-ranges" && (
              <>
                <label className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">lower</span>
                  <input
                    type="number"
                    value={lower}
                    onChange={(e) => setLower(Number(e.target.value))}
                    className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">upper</span>
                  <input
                    type="number"
                    value={upper}
                    onChange={(e) => setUpper(Number(e.target.value))}
                    className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                  />
                </label>
              </>
            )}
            {problem.slug === "rotate-array" && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">k</span>
                <input
                  type="number"
                  value={k}
                  onChange={(e) => setK(Number(e.target.value) || 0)}
                  className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                />
              </label>
            )}
            {problem.slug === "range-sum-query-immutable" && (
              <>
                <label className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">left</span>
                  <input
                    type="number"
                    value={left}
                    onChange={(e) => setLeft(Number(e.target.value) || 0)}
                    className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">right</span>
                  <input
                    type="number"
                    value={right}
                    onChange={(e) => setRight(Number(e.target.value) || 0)}
                    className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                  />
                </label>
              </>
            )}
            {problem.slug === "reverse-linked-list-ii" && (
              <>
                <label className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">left</span>
                  <input
                    type="number"
                    value={left}
                    onChange={(e) => setLeft(Number(e.target.value) || 1)}
                    className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">right</span>
                  <input
                    type="number"
                    value={right}
                    onChange={(e) => setRight(Number(e.target.value) || 1)}
                    className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                  />
                </label>
              </>
            )}
            {problem.slug === "reverse-nodes-in-k-group" && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">k</span>
                <input
                  type="number"
                  value={kVal}
                  onChange={(e) => setKVal(Number(e.target.value) || 1)}
                  className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                />
              </label>
            )}
            {problem.slug === "linked-list-cycle-ii" && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">cycleStart</span>
                <input
                  type="number"
                  value={cycleStart}
                  onChange={(e) => setCycleStart(Number(e.target.value) || -1)}
                  className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                />
              </label>
            )}
            {(problem.slug === "subarray-sum-equals-k" || problem.slug === "subarray-sums-divisible-by-k" || problem.slug === "continuous-subarray-sum") && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">k</span>
                <input
                  type="number"
                  value={kVal}
                  onChange={(e) => setKVal(Number(e.target.value) || 0)}
                  className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                />
              </label>
            )}
            {(problem.slug === "maximum-average-subarray-i" || problem.slug === "maximum-sum-of-distinct-subarrays-with-length-k") && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">k</span>
                <input
                  type="number"
                  value={winK}
                  onChange={(e) => setWinK(Number(e.target.value) || 0)}
                  className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                />
              </label>
            )}
            {(problem.slug === "transpose-matrix" || problem.slug === "spiral-matrix" || problem.slug === "set-matrix-zeroes" || problem.slug === "candy-crush" || problem.slug === "game-of-life") && (
              <>
                <label className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">rows</span>
                  <input
                    type="number"
                    value={mRows}
                    onChange={(e) => setMRows(Number(e.target.value) || 1)}
                    className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">cols</span>
                  <input
                    type="number"
                    value={mCols}
                    onChange={(e) => setMCols(Number(e.target.value) || 1)}
                    className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                  />
                </label>
              </>
            )}
            {problem.slug === "rotate-image" && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">n</span>
                <input
                  type="number"
                  value={mRows}
                  onChange={(e) => setMRows(Number(e.target.value) || 1)}
                  className="w-20 rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-text focus:outline-none focus:border-accent/40"
                />
              </label>
            )}
            {problem.constraints && (
              <p className="text-xs text-text-dim">Constraints: {problem.constraints.replace(/\n/g, " · ")}</p>
            )}
          </div>
        </div>
      </section>

      {/* Approaches — one card per approach, all shown */}
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        {approachInfos.length === 0 && (
          <p className="py-16 text-center text-text-muted">No approaches defined for this problem yet.</p>
        )}

        {approachInfos.map((info) => (
          <ApproachPlayer
            key={info.id}
            slug={problem.slug}
            versionId={info.id}
            name={info.name}
            description={info.description}
            time={info.time}
            space={info.space}
            source={sources[info.id] ?? problem.versions.find((v) => v.id === info.id)?.source ?? ""}
            nums={nums}
            params={
              problem.slug === "shuffle-the-array"
                ? [n]
                : problem.slug === "remove-element"
                ? [val]
                : problem.slug === "missing-ranges"
                ? [lower, upper]
                : problem.slug === "rotate-array"
                ? [k]
                : problem.slug === "zigzag-conversion"
                ? [numRows]
                : problem.slug === "contains-duplicate-ii"
                ? [k2]
                : problem.slug === "merge-sorted-array"
                ? [mergeM]
                : problem.slug === "two-sum"
                ? [target]
                : problem.slug === "two-sum-ii-input-array-is-sorted" || problem.slug === "4sum"
                ? [target]
                : problem.slug === "range-sum-query-immutable"
                ? [left, right]
                : problem.slug === "subarray-sum-equals-k" || problem.slug === "subarray-sums-divisible-by-k" || problem.slug === "continuous-subarray-sum"
                ? [kVal]
                : problem.slug === "maximum-average-subarray-i" || problem.slug === "maximum-sum-of-distinct-subarrays-with-length-k"
                ? [winK]
                : problem.slug === "longest-repeating-character-replacement" || problem.slug === "max-consecutive-ones-iii"
                ? [kVal]
                : problem.slug === "minimum-size-subarray-sum"
                ? [target]
                : problem.slug === "transpose-matrix" || problem.slug === "spiral-matrix" || problem.slug === "set-matrix-zeroes" || problem.slug === "candy-crush" || problem.slug === "game-of-life"
                ? [mRows, mCols]
                : problem.slug === "rotate-image"
                ? [mRows]
                : problem.slug === "valid-sudoku"
                ? [9, 9]
                : problem.slug === "remove-nth-node-from-end-of-list"
                ? [kVal]
                : problem.slug === "partition-list"
                ? [val]
                : problem.slug === "rotate-list"
                ? [kVal]
                : problem.slug === "intersection-of-two-linked-lists" || problem.slug === "add-two-numbers" || problem.slug === "copy-list-with-random-pointer"
                ? [list2]
                : problem.slug === "reverse-linked-list-ii"
                ? [left, right]
                : problem.slug === "reverse-nodes-in-k-group"
                ? [kVal]
                : problem.slug === "linked-list-cycle-ii"
                ? [cycleStart]
                : isTwoStringInput
                ? [str2.split("").map((c) => c.charCodeAt(0))]
                : []
            }
            accent={info.accent}
          />
        ))}
      </main>
    </div>
  );
}
