-- ============================================================
-- VIZ ARENA — seed data
-- Run after schema.sql. Idempotent (safe to re-run).
-- ============================================================

-- Categories
insert into public.viz_categories (id, title, description, icon, color, sort_order) values
  ('arrays', 'Arrays', 'Two-pointer, sliding-window, and brute-force array patterns.', 'Columns3', 'from-emerald-500 to-teal-400', 0),
  ('hashing', 'Hash Maps', 'O(1) lookup patterns for fast membership checks.', 'Hash', 'from-fuchsia-500 to-purple-400', 1),
  ('strings', 'Strings', 'Two-pointer, palindrome, and window techniques.', 'Type', 'from-blue-500 to-cyan-400', 2),
  ('stacks', 'Stacks', 'LIFO structures for nesting and matching.', 'Layers', 'from-amber-500 to-orange-400', 3),
  ('sorting', 'Sorting', 'Step through classic sort algorithms.', 'ArrowDownUp', 'from-rose-500 to-pink-400', 4)
on conflict (id) do nothing;

-- Problems
insert into public.viz_problems (slug, title, category_id, difficulty, description, constraints, sort_order) values
  ('two-sum', 'Two Sum', 'arrays', 'easy',
   'Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target. This trace uses the brute-force approach: check every pair.',
   '2 <= nums.length <= 10^4', 0),
  ('max-consecutive-ones', 'Max Consecutive Ones', 'arrays', 'easy',
   'Given a binary array nums, return the maximum number of consecutive 1s in the array.',
   '1 <= nums.length <= 10^5', 1)
on conflict (slug) do nothing;

-- Versions
insert into public.viz_problem_versions (problem_id, version_id, name, source, sort_order)
select p.id, 'brute', 'Brute Force', 'function twoSum(nums, target) {
    // Check every pair of elements
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}', 0
from public.viz_problems p where p.slug = 'two-sum'
on conflict (problem_id, version_id) do nothing;

insert into public.viz_problem_versions (problem_id, version_id, name, source, sort_order)
select
  p.id, 'brute', 'Brute Force',
  'var findMaxConsecutiveOnes = function(nums) {
    let maxCount = 0;

    for (let i = 0; i < nums.length; i++) {
        let count = 0;
        // Count consecutive 1''s starting at i
        for (let j = i; j < nums.length; j++) {
            if (nums[j] === 1) {
                count++;
            } else {
                break;
            }
        }
        maxCount = Math.max(maxCount, count);
    }

    return maxCount;
};', 0
from public.viz_problems p where p.slug = 'max-consecutive-ones'
on conflict (problem_id, version_id) do nothing;

from public.viz_problems p where p.slug = 'max-consecutive-ones'
on conflict (problem_id, version_id) do nothing;

-- Remove Duplicates from Sorted Array
insert into public.viz_problems (slug, title, category_id, difficulty, description, constraints, sort_order) values
  ('remove-duplicates-from-sorted-array', 'Remove Duplicates from Sorted Array', 'arrays', 'easy',
   'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in nums. Consider the number of unique elements of nums to be k. To get accepted, change the array nums such that the first k elements contain the unique elements in the order they were present initially; the rest are not important.',
   '1 <= nums.length <= 3 * 10^4
-100 <= nums[i] <= 100
nums is sorted in non-decreasing order.', 6)
on conflict (slug) do nothing;

insert into public.viz_problem_versions (problem_id, version_id, name, source, sort_order)
select
  p.id, 'hashset', 'Hash Set',
  'var removeDuplicates = function(nums) {
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
};', 0
from public.viz_problems p where p.slug = 'remove-duplicates-from-sorted-array'
on conflict (problem_id, version_id) do nothing;

insert into public.viz_problem_versions (problem_id, version_id, name, source, sort_order)
select
  p.id, 'twopointer', 'Two Pointers (Optimal)',
  'var removeDuplicates = function(nums) {
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
};', 1
from public.viz_problems p where p.slug = 'remove-duplicates-from-sorted-array'
on conflict (problem_id, version_id) do nothing;
