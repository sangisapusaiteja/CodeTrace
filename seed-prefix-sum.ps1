$env:SUPABASE_URL="https://smskaqirzggxygoqhftm.supabase.co"
$env:SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtc2thcWlyemdneHlnb3FoZnRtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjY5MTExNiwiZXhwIjoyMTAyMjY3MTE2fQ.XnnGulcwGQ5t3bUFv6XwIpuMkx-g8UWWbl7n4uCAXYI"
$headers = @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY"; "Content-Type" = "application/json"; "Prefer" = "return=minimal" }

function Get-ProblemId($slug) {
    $resp = Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems?select=id&slug=eq.$slug" -Headers @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY" }
    return $resp[0].id
}

function Add-Problem($slug, $title, $desc, $constraints, $sort) {
    $body = @{ slug=$slug; title=$title; category_id="prefix-sum"; difficulty="medium"; description=$desc; constraints=$constraints; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems" -Method POST -Headers $headers -Body $body
    Write-Host "  problem $slug"
}

function Add-Version($problemId, $vid, $name, $src, $sort) {
    $body = @{ problem_id=$problemId; version_id=$vid; name=$name; source=$src; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problem_versions" -Method POST -Headers $headers -Body $body
    Write-Host "  version $vid"
}

# Range Sum Query - Immutable
Add-Problem "range-sum-query-immutable" "Range Sum Query - Immutable" "Given an integer array nums, handle multiple queries of the form sumRange(left, right) which returns the sum of the elements nums[left]..nums[right]. This trace shows both the brute-force per-query loop and the O(1) prefix-sum approach." "1 <= nums.length <= 10^4" 74
$p = Get-ProblemId "range-sum-query-immutable"
$src = @'
function NumArray(nums) {
  this.nums = nums;
}
NumArray.prototype.sumRange = function (left, right) {
  let sum = 0;
  for (let i = left; i <= right; i++) {
    sum += this.nums[i];
  }
  return sum;
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function NumArray(nums) {
  // Build prefix sum array where prefix[i] = sum of nums[0..i-1]
  this.prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) {
    this.prefix[i + 1] = this.prefix[i] + nums[i];
  }
}
NumArray.prototype.sumRange = function (left, right) {
  return this.prefix[right + 1] - this.prefix[left];
}
'@
Add-Version $p "prefix" "Prefix Sum" $src 1

# Find Pivot Index
Add-Problem "find-pivot-index" "Find Pivot Index" "Given an array of integers nums, calculate the pivot index of this array. The pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right. Return the leftmost pivot index, or -1 if none exists." "1 <= nums.length <= 10^4" 75
$p = Get-ProblemId "find-pivot-index"
$src = @'
function pivotIndex(nums) {
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
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function pivotIndex(nums) {
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
}
'@
Add-Version $p "prefix" "Prefix Sum (Optimal)" $src 1

# Maximum Population Year
Add-Problem "maximum-population-year" "Maximum Population Year" "You are given a 2D integer array logs where each logs[i] = [birthi, deathi] indicates the birth and death years of the ith person. The population of some year x is the number of people alive during that year. The ith person is counted in year x's population if x is in the inclusive range [birthi, deathi - 1]. Return the earliest year with the maximum population." "1 <= logs.length <= 100" 76
$p = Get-ProblemId "maximum-population-year"
$src = @'
function maximumPopulation(logs) {
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
}
'@
Add-Version $p "brute" "Brute Force (Check Every Year)" $src 0
$src = @'
function maximumPopulation(logs) {
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
}
'@
Add-Version $p "sweep" "Line Sweep (Difference Array)" $src 1

# Subarray Sum Equals K
Add-Problem "subarray-sum-equals-k" "Subarray Sum Equals K" "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k. A subarray is a contiguous non-empty sequence of elements within an array." "1 <= nums.length <= 2 * 10^4" 77
$p = Get-ProblemId "subarray-sum-equals-k"
$src = @'
function subarraySum(nums, k) {
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
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function subarraySum(nums, k) {
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
}
'@
Add-Version $p "map" "Prefix Sum + Hash Map" $src 1

# Subarray Sums Divisible by K
Add-Problem "subarray-sums-divisible-by-k" "Subarray Sums Divisible by K" "Given an integer array nums and an integer k, return the number of non-empty subarrays that have a sum divisible by k. A subarray is a contiguous part of an array." "1 <= nums.length <= 3 * 10^4" 78
$p = Get-ProblemId "subarray-sums-divisible-by-k"
$src = @'
function subarraysDivByK(nums, k) {
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
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function subarraysDivByK(nums, k) {
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
}
'@
Add-Version $p "map" "Prefix Sum + Hash Map (Optimal)" $src 1

# Continuous Subarray Sum
Add-Problem "continuous-subarray-sum" "Continuous Subarray Sum" "Given an integer array nums and an integer k, return true if nums has a good subarray or false otherwise. A good subarray is a subarray of length at least 2 whose sum is a multiple of k." "1 <= nums.length <= 10^5" 79
$p = Get-ProblemId "continuous-subarray-sum"
$src = @'
function checkSubarraySum(nums, k) {
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
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function checkSubarraySum(nums, k) {
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
}
'@
Add-Version $p "map" "Prefix Sum + Hash Map (Optimal)" $src 1

# Contiguous Array
Add-Problem "contiguous-array" "Contiguous Array" "Given a binary array nums, return the maximum length of a contiguous subarray with an equal number of 0s and 1s." "1 <= nums.length <= 10^5" 80
$p = Get-ProblemId "contiguous-array"
$src = @'
function findMaxLength(nums) {
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
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function findMaxLength(nums) {
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
}
'@
Add-Version $p "map" "Prefix Sum + Hash Map" $src 1

Write-Host "OK: All 7 prefix-sum problems seeded"
