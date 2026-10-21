. "$PSScriptRoot\load-env.ps1"

$headers = @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY"; "Content-Type" = "application/json"; "Prefer" = "return=minimal" }

function Get-ProblemId($slug) {
    $resp = Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems?select=id&slug=eq.$slug" -Headers @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY" }
    return $resp[0].id
}

function Add-Problem($slug, $title, $desc, $constraints, $sort) {
    $body = @{ slug=$slug; title=$title; category_id="sliding-window-dynamic"; difficulty="medium"; description=$desc; constraints=$constraints; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems" -Method POST -Headers $headers -Body $body
    Write-Host "  problem $slug"
}

function Add-Version($problemId, $vid, $name, $src, $sort) {
    $body = @{ problem_id=$problemId; version_id=$vid; name=$name; source=$src; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problem_versions" -Method POST -Headers $headers -Body $body
    Write-Host "  version $vid"
}

# Category
$catBody = @{ id="sliding-window-dynamic"; title="Sliding Window - Dynamic Size"; description="Variable-size window techniques that expand and shrink to satisfy a constraint."; icon="Maximize2"; color="from-teal-500 to-emerald-400"; sort_order=7 } | ConvertTo-Json -Compress
Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_categories" -Method POST -Headers $headers -Body $catBody
Write-Host "category sliding-window-dynamic"

# Longest Substring Without Repeating Characters
Add-Problem "longest-substring-without-repeating-characters" "Longest Substring Without Repeating Characters" "Given a string s, find the length of the longest substring without repeating characters. This trace shows both the brute-force substring enumeration and the O(n) sliding-window with hash set." "0 <= s.length <= 5 * 10^4" 86
$p = Get-ProblemId "longest-substring-without-repeating-characters"
$src = @'
function lengthOfLongestSubstring(s) {
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
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function lengthOfLongestSubstring(s) {
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
}
'@
Add-Version $p "sliding" "Sliding Window + Hash Set" $src 1

# Longest Repeating Character Replacement
Add-Problem "longest-repeating-character-replacement" "Longest Repeating Character Replacement" "You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times. Return the length of the longest substring containing the same letter you can get after performing the above operations." "1 <= s.length <= 10^5" 87
$p = Get-ProblemId "longest-repeating-character-replacement"
$src = @'
function characterReplacement(s, k) {
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
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function characterReplacement(s, k) {
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
}
'@
Add-Version $p "sliding" "Sliding Window" $src 1

# Minimum Size Subarray Sum
Add-Problem "minimum-size-subarray-sum" "Minimum Size Subarray Sum" "Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target. If there is no such subarray, return 0 instead." "1 <= target <= 10^9" 88
$p = Get-ProblemId "minimum-size-subarray-sum"
$src = @'
function minSubArrayLen(target, nums) {
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
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function minSubArrayLen(target, nums) {
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
}
'@
Add-Version $p "sliding" "Sliding Window" $src 1

# Max Consecutive Ones III
Add-Problem "max-consecutive-ones-iii" "Max Consecutive Ones III" "Given a binary array nums and an integer k, return the maximum number of consecutive 1's in the array if you can flip at most k 0's." "1 <= nums.length <= 10^5" 89
$p = Get-ProblemId "max-consecutive-ones-iii"
$src = @'
function longestOnes(nums, k) {
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
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function longestOnes(nums, k) {
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
}
'@
Add-Version $p "sliding" "Sliding Window" $src 1

# Minimum Window Substring
Add-Problem "minimum-window-substring" "Minimum Window Substring" "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string. The test cases will generate the answer as unique." "1 <= s.length, t.length <= 10^5" 90
$p = Get-ProblemId "minimum-window-substring"
$src = @'
function minWindow(s, t) {
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
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function minWindow(s, t) {
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
}
'@
Add-Version $p "sliding" "Sliding Window" $src 1

Write-Host "OK: All 5 dynamic sliding-window problems seeded"
