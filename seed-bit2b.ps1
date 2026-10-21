. "$PSScriptRoot\load-env.ps1"

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

# Power of Two
$p = Get-ProblemId "power-of-two"
$src = @'
var isPowerOfTwo = function (n) {
  if (n <= 0) return false;

  // Keep dividing by 2 until we reach 1 or find an odd number
  while (n > 1) {
    if (n % 2 !== 0) return false;
    n = Math.floor(n / 2);
  }

  return true;
};
'@
Add-Version $p "iterative" "Iterative Division" $src 0
$src = @'
var isPowerOfTwo = function (n) {
  // Power of two has exactly one bit set, so n & (n - 1) clears that bit
  return n > 0 && (n & (n - 1)) === 0;
};
'@
Add-Version $p "bit" "Bit Manipulation (n & (n-1))" $src 1

# Number of 1 Bits
$p = Get-ProblemId "number-of-1-bits"
$src = @'
var hammingWeight = function(n) {
    let count = 0;

    while (n !== 0) {
        // Check if the least significant bit is set
        count += n & 1;
        // Shift right to process the next bit
        n >>>= 1;
    }

    return count;
};
'@
Add-Version $p "bits" "Check Each Bit" $src 0
$src = @'
var hammingWeight = function(n) {
    let count = 0;

    while (n !== 0) {
        // Clear the lowest set bit
        n = n & (n - 1);
        count++;
    }

    return count;
};
'@
Add-Version $p "kernighan" "Brian Kernighan's Algorithm" $src 1

Write-Host "OK: All versions seeded"
