. "$PSScriptRoot\load-env.ps1"

$headers = @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY"; "Content-Type" = "application/json"; "Prefer" = "return=minimal" }

function Get-ProblemId($slug) {
    $resp = Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems?select=id&slug=eq.$slug" -Headers @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY" }
    return $resp[0].id
}

function Add-Problem($slug, $title, $desc, $constraints, $sort) {
    $body = @{ slug=$slug; title=$title; category_id="sliding-window-fixed"; difficulty="medium"; description=$desc; constraints=$constraints; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems" -Method POST -Headers $headers -Body $body
    Write-Host "  problem $slug"
}

function Add-Version($problemId, $vid, $name, $src, $sort) {
    $body = @{ problem_id=$problemId; version_id=$vid; name=$name; source=$src; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problem_versions" -Method POST -Headers $headers -Body $body
    Write-Host "  version $vid"
}

# Category
$catBody = @{ id="sliding-window-fixed"; title="Sliding Window - Fixed Size"; description="Fixed-size window techniques for contiguous subarray/string problems."; icon="PanelRight"; color="from-cyan-500 to-sky-400"; sort_order=6 } | ConvertTo-Json -Compress
Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_categories" -Method POST -Headers $headers -Body $catBody
Write-Host "category sliding-window-fixed"

# Maximum Average Subarray I
Add-Problem "maximum-average-subarray-i" "Maximum Average Subarray I" "You are given an integer array nums consisting of n elements, and an integer k. Find a contiguous subarray whose length is equal to k that has the maximum average value and return this value. This trace shows both the brute-force recompute and the O(n) sliding-window approach." "1 <= k <= nums.length <= 10^5" 81
$p = Get-ProblemId "maximum-average-subarray-i"
$src = @'
function findMaxAverage(nums, k) {
    let maxSum = -Infinity;

    for (let i = 0; i <= nums.length - k; i++) {
        let windowSum = 0;
        for (let j = i; j < i + k; j++) {
            windowSum += nums[j];
        }
        maxSum = Math.max(maxSum, windowSum);
    }

    return maxSum / k;
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function findMaxAverage(nums, k) {
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
}
'@
Add-Version $p "sliding" "Sliding Window (Optimal)" $src 1

# Find All Anagrams in a String
Add-Problem "find-all-anagrams-in-a-string" "Find All Anagrams in a String" "Given two strings s and p, return an array of all the start indices of p's anagrams in s. You may return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once." "1 <= s.length, p.length <= 3 * 10^4" 82
$p = Get-ProblemId "find-all-anagrams-in-a-string"
$src = @'
function findAnagrams(s, p) {
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
}
'@
Add-Version $p "brute" "Brute Force (Sorting)" $src 0
$src = @'
function findAnagrams(s, p) {
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
}
'@
Add-Version $p "freq" "Frequency Map Comparison" $src 1

# Permutation in String
Add-Problem "permutation-in-string" "Permutation in String" "Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise. In other words, return true if one of s1's permutations is the substring of s2." "1 <= s1.length, s2.length <= 10^4" 83
$p = Get-ProblemId "permutation-in-string"
$src = @'
function checkInclusion(s1, s2) {
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
}
'@
Add-Version $p "brute" "Brute Force (Generate All Permutations)" $src 0
$src = @'
function checkInclusion(s1, s2) {
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
}
'@
Add-Version $p "sliding" "Sliding Window with Frequency Comparison" $src 1

# Maximum Sum of Distinct Subarrays With Length K
Add-Problem "maximum-sum-of-distinct-subarrays-with-length-k" "Maximum Sum of Distinct Subarrays With Length K" "You are given an integer array nums and an integer k. Find the maximum subarray sum of all the subarrays of nums that meet the following conditions: the length of the subarray is k, and all the elements of the subarray are distinct. Return the maximum subarray sum of all the subarrays that meet the conditions. If no subarray meets the conditions, return 0." "1 <= k <= nums.length <= 10^5" 84
$p = Get-ProblemId "maximum-sum-of-distinct-subarrays-with-length-k"
$src = @'
function maximumSubarraySum(nums, k) {
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
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function maximumSubarraySum(nums, k) {
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
}
'@
Add-Version $p "sliding" "Sliding Window with Hash Map" $src 1

# Substring with Concatenation of All Words
Add-Problem "substring-with-concatenation-of-all-words" "Substring with Concatenation of All Words" "You are given a string s and an array of strings words. All the strings of words are of the same length. A concatenated substring in s is a substring that contains all the strings of any permutation of words concatenated. Return the starting indices of all the concatenated substrings in s. You can return the answer in any order." "1 <= s.length <= 10^4" 85
$p = Get-ProblemId "substring-with-concatenation-of-all-words"
$src = @'
function findSubstring(s, words) {
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
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function findSubstring(s, words) {
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
}
'@
Add-Version $p "sliding" "Sliding Window (Optimal)" $src 1

Write-Host "OK: All 5 sliding-window problems seeded"
