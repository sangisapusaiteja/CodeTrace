$env:SUPABASE_URL="https://smskaqirzggxygoqhftm.supabase.co"
$env:SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtc2thcWlyemdneHlnb3FoZnRtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjY5MTExNiwiZXhwIjoyMTAyMjY3MTE2fQ.XnnGulcwGQ5t3bUFv6XwIpuMkx-g8UWWbl7n4uCAXYI"
$headers = @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY"; "Content-Type" = "application/json"; "Prefer" = "return=minimal" }
$resp = Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems?select=id&slug=eq.game-of-life" -Headers @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY" }
$id = $resp[0].id
$src = @'
function gameOfLife(board) {
    const m = board.length;
    const n = board[0].length;
    const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
    const dc = [-1, 0, 1, -1, 1, -1, 0, 1];

    // First pass: encode transitions
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            let liveNeighbors = 0;
            for (let d = 0; d < 8; d++) {
                const ni = i + dr[d];
                const nj = j + dc[d];
                // Use % 2 to get original state from encoded value
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && board[ni][nj] % 2 === 1) {
                    liveNeighbors++;
                }
            }

            // Alive cell that dies → encode as 3
            if (board[i][j] === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
                board[i][j] = 3;
            }
            // Dead cell that becomes alive → encode as 2
            if (board[i][j] === 0 && liveNeighbors === 3) {
                board[i][j] = 2;
            }
        }
    }

    // Second pass: convert encoded values to final states
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            board[i][j] = board[i][j] === 1 || board[i][j] === 2 ? 1 : 0;
        }
    }
}
'@
$body = @{ problem_id=$id; version_id="encode"; name="In-Place with State Encoding"; source=$src; sort_order=1 } | ConvertTo-Json -Compress
Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problem_versions" -Method POST -Headers $headers -Body $body
Write-Host "OK: encode version added"
