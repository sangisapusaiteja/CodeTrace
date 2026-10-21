. "$PSScriptRoot\load-env.ps1"

$headers = @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY"; "Content-Type" = "application/json"; "Prefer" = "return=minimal" }

function Get-ProblemId($slug) {
    $resp = Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems?select=id&slug=eq.$slug" -Headers @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY" }
    return $resp[0].id
}

function Add-Problem($slug, $title, $desc, $constraints, $sort) {
    $body = @{ slug=$slug; title=$title; category_id="kadanes"; difficulty="medium"; description=$desc; constraints=$constraints; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems" -Method POST -Headers $headers -Body $body
    Write-Host "  problem $slug"
}

function Add-Version($problemId, $vid, $name, $src, $sort) {
    $body = @{ problem_id=$problemId; version_id=$vid; name=$name; source=$src; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problem_versions" -Method POST -Headers $headers -Body $body
    Write-Host "  version $vid"
}

# Category
$catBody = @{ id="kadanes"; title="Kadane's Algorithm"; description="Optimal one-pass maximum subarray / product patterns."; icon="TrendingUp"; color="from-orange-500 to-amber-400"; sort_order=8 } | ConvertTo-Json -Compress
Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_categories" -Method POST -Headers $headers -Body $catBody
Write-Host "category kadanes"

# Maximum Subarray
Add-Problem "maximum-subarray" "Maximum Subarray" "Given an integer array nums, find the subarray with the largest sum, and return its sum. This trace shows both the brute-force enumeration and Kadane's algorithm." "1 <= nums.length <= 10^5" 91
$p = Get-ProblemId "maximum-subarray"
$src = @'
function maxSubArray(nums) {
  let maxSum = nums[0]

  for (let i = 0; i < nums.length; i++) {
    let currentSum = 0
    for (let j = i; j < nums.length; j++) {
      currentSum += nums[j]
      maxSum = Math.max(maxSum, currentSum)
    }
  }

  return maxSum
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function maxSubArray(nums) {
  let currentSum = nums[0]
  let maxSum = nums[0]

  for (let i = 1; i < nums.length; i++) {
    // Either extend the previous subarray or start a new one here
    currentSum = Math.max(nums[i], currentSum + nums[i])
    maxSum = Math.max(maxSum, currentSum)
  }

  return maxSum
}
'@
Add-Version $p "kadane" "Kadane's Algorithm" $src 1

# Maximum Sum Circular Subarray
Add-Problem "maximum-sum-circular-subarray" "Maximum Sum Circular Subarray" "Given a circular integer array nums of length n, return the maximum possible sum of a non-empty subarray of nums. A circular array means the end of the array connects to the beginning of the array." "1 <= nums.length <= 3 * 10^4" 92
$p = Get-ProblemId "maximum-sum-circular-subarray"
$src = @'
function maxSubarraySumCircular(nums) {
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
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function maxSubarraySumCircular(nums) {
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
}
'@
Add-Version $p "kadane" "Kadane's with Min Subarray (Optimal)" $src 1

# Maximum Product Subarray
Add-Problem "maximum-product-subarray" "Maximum Product Subarray" "Given an integer array nums, find a subarray that has the largest product, and return the product. The test cases are generated so that the answer will fit in a 32-bit integer." "1 <= nums.length <= 2 * 10^4" 93
$p = Get-ProblemId "maximum-product-subarray"
$src = @'
function maxProduct(nums) {
  let maxProd = nums[0]

  for (let i = 0; i < nums.length; i++) {
    let currentProduct = 1
    for (let j = i; j < nums.length; j++) {
      currentProduct *= nums[j]
      maxProd = Math.max(maxProd, currentProduct)
    }
  }

  return maxProd
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function maxProduct(nums) {
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
}
'@
Add-Version $p "dp" "Dynamic Programming (Track Min and Max)" $src 1

# Best Sightseeing Pair
Add-Problem "best-sightseeing-pair" "Best Sightseeing Pair" "You are given an integer array values where values[i] represents the value of the ith sightseeing spot. Two sightseeing spots i and j with i < j have a sightseeing score values[i] + values[j] + i - j. Return the maximum score of a pair of sightseeing spots." "2 <= values.length <= 5 * 10^4" 94
$p = Get-ProblemId "best-sightseeing-pair"
$src = @'
function maxScoreSightseeingPair(values) {
    let maxScore = 0;

    // Try every pair (i, j) where i < j
    for (let i = 0; i < values.length - 1; i++) {
        for (let j = i + 1; j < values.length; j++) {
            const score = values[i] + values[j] + i - j;
            maxScore = Math.max(maxScore, score);
        }
    }

    return maxScore;
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function maxScoreSightseeingPair(values) {
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
}
'@
Add-Version $p "running" "Decomposition with Running Maximum" $src 1

Write-Host "OK: All 4 Kadane's problems seeded"
