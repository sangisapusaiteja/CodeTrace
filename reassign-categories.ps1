. "$PSScriptRoot\load-env.ps1"

$h = @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY" }
$ph = @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY"; "Content-Type" = "application/json"; "Prefer" = "return=minimal" }

# Category id -> title mapping from CodeTrace
$catMap = @{
  "arrays" = "Arrays"
  "strings" = "Strings"
  "bit-manipulation" = "Bit Manipulation"
  "hash-table" = "Hash Table"
  "two-pointers" = "Two Pointers"
  "prefix-sum" = "Prefix Sum"
  "sliding-window-fixed" = "Sliding Window - Fixed Size"
  "sliding-window-dynamic" = "Sliding Window - Dynamic Size"
  "kadanes" = "Kadane's Algorithm"
  "matrix" = "Matrix (2D Array)"
  "linked-list" = "Linked List"
  "linked-list-reversal" = "LinkedList In-place Reversal"
  "fast-slow-pointers" = "Fast and Slow Pointers"
}

# Load all code-battle problems and their current categories
$cb = Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/problems?select=slug,category" -Headers $h
# Load all CodeTrace problems with their category_id
$ct = Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems?select=slug,category_id" -Headers $h

# Build slug -> CodeTrace category title
$slugToCat = @{}
foreach ($p in $ct) {
  if ($catMap.ContainsKey($p.category_id)) {
    $slugToCat[$p.slug] = $catMap[$p.category_id]
  }
}

$updated = 0
$others = 0
foreach ($p in $cb) {
  $newCat = $null
  if ($slugToCat.ContainsKey($p.slug)) {
    $newCat = $slugToCat[$p.slug]
  } else {
    $newCat = "Others"
    $others++
  }
  if ($p.category -ne $newCat) {
    $body = @{ category = $newCat } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/problems?slug=eq.$($p.slug)" -Method PATCH -Headers $ph -Body $body
    Write-Host "  $($p.slug): '$($p.category)' -> '$newCat'"
    $updated++
  }
}

Write-Host "DONE. Updated $updated problems. Set to Others: $others"
