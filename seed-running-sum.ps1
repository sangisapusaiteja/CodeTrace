$env:SUPABASE_URL="https://smskaqirzggxygoqhftm.supabase.co"
$env:SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtc2thcWlyemdneHlnb3FoZnRtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjY5MTExNiwiZXhwIjoyMTAyMjY3MTE2fQ.XnnGulcwGQ5t3bUFv6XwIpuMkx-g8UWWbl7n4uCAXYI"
$headers = @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY"; "Content-Type" = "application/json"; "Prefer" = "return=minimal" }

function Get-ProblemId($slug) {
    $resp = Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems?select=id&slug=eq.$slug" -Headers @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY" }
    return $resp[0].id
}

function Add-Version($problemId, $vid, $name, $src, $sort) {
    $body = @{ problem_id=$problemId; version_id=$vid; name=$name; source=$src; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problem_versions" -Method POST -Headers $headers -Body $body
    Write-Host "  version $vid"
}

# Running Sum of 1d Array
$problemBody = @{
    slug="running-sum-of-1d-array"; title="Running Sum of 1d Array"; category_id="arrays"; difficulty="easy";
    description="Given an array nums, return an array where runningSum[i] is the sum of the elements nums[0]..nums[i]. This trace shows both the brute-force recompute and the optimal prefix-sum approach.";
    constraints="1 <= nums.length <= 1000"; sort_order=73
} | ConvertTo-Json -Compress
Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems" -Method POST -Headers $headers -Body $problemBody
Write-Host "  problem inserted"
$p = Get-ProblemId "running-sum-of-1d-array"
$src = @'
function runningSum(nums) {
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
}
'@
Add-Version $p "brute" "Brute Force" $src 0
$src = @'
function runningSum(nums) {
    var n = nums.length;
    var result = new Array(n);

    result[0] = nums[0];
    for (var i = 1; i < n; i++) {
        // Each running sum builds on the previous one
        result[i] = result[i - 1] + nums[i];
    }

    return result;
}
'@
Add-Version $p "prefix" "Prefix Sum (Optimal)" $src 1

Write-Host "OK: running-sum-of-1d-array seeded"
