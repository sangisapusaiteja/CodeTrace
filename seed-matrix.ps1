. "$PSScriptRoot\load-env.ps1"

$headers = @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY"; "Content-Type" = "application/json"; "Prefer" = "return=minimal" }

function Get-ProblemId($slug) {
    $resp = Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems?select=id&slug=eq.$slug" -Headers @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY" }
    return $resp[0].id
}

function Add-Problem($slug, $title, $desc, $constraints, $sort) {
    $body = @{ slug=$slug; title=$title; category_id="matrix"; difficulty="medium"; description=$desc; constraints=$constraints; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems" -Method POST -Headers $headers -Body $body
    Write-Host "  problem $slug"
}

function Add-Version($problemId, $vid, $name, $src, $sort) {
    $body = @{ problem_id=$problemId; version_id=$vid; name=$name; source=$src; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problem_versions" -Method POST -Headers $headers -Body $body
    Write-Host "  version $vid"
}

# Category
$catBody = @{ id="matrix"; title="Matrix (2D Array)"; description="Grid traversal, transposition, and transformation patterns on 2D arrays."; icon="Grid3x3"; color="from-purple-500 to-fuchsia-400"; sort_order=9 } | ConvertTo-Json -Compress
Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_categories" -Method POST -Headers $headers -Body $catBody
Write-Host "category matrix"

# Transpose Matrix
Add-Problem "transpose-matrix" "Transpose Matrix" "Given a 2D integer array matrix, return the transpose of matrix. The transpose of a matrix is the matrix flipped over its main diagonal, switching the matrix's row and column indices. Input is provided flattened row-major with rows/cols dimensions." "1 <= matrix.length, matrix[0].length <= 1000" 95
$p = Get-ProblemId "transpose-matrix"
$src = @'
function transpose(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;

    // Create result with swapped dimensions
    const result = new Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = new Array(m).fill(0);
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            // Element at (i, j) goes to (j, i)
            result[j][i] = matrix[i][j];
        }
    }
    return result;
}
'@
Add-Version $p "direct" "Direct Construction" $src 0
$src = @'
function transpose(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;

    const result = [];
    // Each column of the original becomes a row of the result
    for (let j = 0; j < n; j++) {
        const row = [];
        for (let i = 0; i < m; i++) {
            row.push(matrix[i][j]);
        }
        result.push(row);
    }
    return result;
}
'@
Add-Version $p "column" "Column-Based Construction" $src 1

# Spiral Matrix
Add-Problem "spiral-matrix" "Spiral Matrix" "Given an m x n matrix, return all elements of the matrix in spiral order. Input is provided flattened row-major with rows/cols dimensions." "1 <= matrix.length <= 10" 96
$p = Get-ProblemId "spiral-matrix"
$src = @'
function spiralOrder(matrix) {
    const m = matrix.length, n = matrix[0].length;
    const visited = Array.from({length: m}, () => Array(n).fill(false));
    const result = [];

    // Direction vectors: right, down, left, up
    const dr = [0, 1, 0, -1];
    const dc = [1, 0, -1, 0];
    let dir = 0;
    let row = 0, col = 0;

    for (let i = 0; i < m * n; i++) {
        result.push(matrix[row][col]);
        visited[row][col] = true;

        let nextRow = row + dr[dir];
        let nextCol = col + dc[dir];

        if (nextRow < 0 || nextRow >= m || nextCol < 0 || nextCol >= n
                || visited[nextRow][nextCol]) {
            dir = (dir + 1) % 4;
            nextRow = row + dr[dir];
            nextCol = col + dc[dir];
        }

        row = nextRow;
        col = nextCol;
    }

    return result;
}
'@
Add-Version $p "simulate" "Simulation with Direction Arrays" $src 0
$src = @'
function spiralOrder(matrix) {
    const result = [];
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;

    while (top <= bottom && left <= right) {
        // Traverse top row
        for (let col = left; col <= right; col++) {
            result.push(matrix[top][col]);
        }
        top++;

        // Traverse right column
        for (let row = top; row <= bottom; row++) {
            result.push(matrix[row][right]);
        }
        right--;

        // Traverse bottom row (if rows remain)
        if (top <= bottom) {
            for (let col = right; col >= left; col--) {
                result.push(matrix[bottom][col]);
            }
            bottom--;
        }

        // Traverse left column (if columns remain)
        if (left <= right) {
            for (let row = bottom; row >= top; row--) {
                result.push(matrix[row][left]);
            }
            left++;
        }
    }

    return result;
}
'@
Add-Version $p "layer" "Layer-by-Layer (Boundary Shrinking)" $src 1

# Rotate Image
Add-Problem "rotate-image" "Rotate Image" "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place. Input is provided flattened row-major with dimension n." "n == matrix.length == matrix[i].length" 97
$p = Get-ProblemId "rotate-image"
$src = @'
function rotate(matrix) {
    const n = matrix.length;
    const rotated = Array.from({ length: n }, () => new Array(n).fill(0));

    // Place each element in its rotated position
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            rotated[j][n - 1 - i] = matrix[i][j];
        }
    }

    // Copy back to original matrix
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            matrix[i][j] = rotated[i][j];
        }
    }
}
'@
Add-Version $p "space" "Using Extra Space" $src 0
$src = @'
function rotate(matrix) {
    const n = matrix.length;

    // Step 1: Transpose the matrix
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }

    // Step 2: Reverse each row
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
}
'@
Add-Version $p "transpose" "Transpose + Reverse" $src 1

# Set Matrix Zeroes
Add-Problem "set-matrix-zeroes" "Set Matrix Zeroes" "Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's. Input is provided flattened row-major with rows/cols dimensions." "1 <= m, n <= 200" 98
$p = Get-ProblemId "set-matrix-zeroes"
$src = @'
function setZeroes(matrix) {
    const m = matrix.length, n = matrix[0].length;
    // Create a copy to read from
    const copy = matrix.map((row) => [...row]);
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (copy[i][j] === 0) {
                // Zero out entire row i in original
                for (let k = 0; k < n; k++) matrix[i][k] = 0;
                // Zero out entire column j in original
                for (let k = 0; k < m; k++) matrix[k][j] = 0;
            }
        }
    }
}
'@
Add-Version $p "copy" "Brute Force (Copy Matrix)" $src 0
$src = @'
function setZeroes(matrix) {
    const m = matrix.length, n = matrix[0].length;
    const zeroRows = new Set();
    const zeroCols = new Set();
    // Phase 1: record which rows and columns have zeroes
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === 0) {
                zeroRows.add(i);
                zeroCols.add(j);
            }
        }
    }
    // Phase 2: zero out marked rows and columns
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (zeroRows.has(i) || zeroCols.has(j)) {
                matrix[i][j] = 0;
            }
        }
    }
}
'@
Add-Version $p "hash" "Hash Sets" $src 1

# Candy Crush
Add-Problem "candy-crush" "Candy Crush" "Given an m x n integer array board representing the game board, implement a candy crush algorithm that repeatedly eliminates horizontal or vertical lines of three or more identical candies, then gravity pulls remaining candies down. Input is provided flattened row-major with rows/cols dimensions." "3 <= board.length, board[i].length <= 50" 99
$p = Get-ProblemId "candy-crush"
$src = @'
function candyCrush(board) {
    const m = board.length;
    const n = board[0].length;

    let shouldContinue = true;
    while (shouldContinue) {
        shouldContinue = false;
        const crush = Array.from({length: m}, function() {
            return new Array(n).fill(false);
        });

        // Mark horizontal runs of 3+
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n - 2; j++) {
                const val = board[i][j];
                if (val !== 0 && val === board[i][j + 1] && val === board[i][j + 2]) {
                    crush[i][j] = crush[i][j + 1] = crush[i][j + 2] = true;
                    shouldContinue = true;
                }
            }
        }

        // Mark vertical runs of 3+
        for (let i = 0; i < m - 2; i++) {
            for (let j = 0; j < n; j++) {
                const val = board[i][j];
                if (val !== 0 && val === board[i + 1][j] && val === board[i + 2][j]) {
                    crush[i][j] = crush[i + 1][j] = crush[i + 2][j] = true;
                    shouldContinue = true;
                }
            }
        }

        // Crush marked cells
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (crush[i][j]) {
                    board[i][j] = 0;
                }
            }
        }

        // Apply gravity column by column
        for (let j = 0; j < n; j++) {
            let writePos = m - 1;
            for (let i = m - 1; i >= 0; i--) {
                if (board[i][j] !== 0) {
                    board[writePos][j] = board[i][j];
                    if (writePos !== i) {
                        board[i][j] = 0;
                    }
                    writePos--;
                }
            }
            while (writePos >= 0) {
                board[writePos][j] = 0;
                writePos--;
            }
        }
    }

    return board;
}
'@
Add-Version $p "bool" "Simulation with Boolean Marking" $src 0
$src = @'
function candyCrush(board) {
    const m = board.length;
    const n = board[0].length;

    let shouldContinue = true;
    while (shouldContinue) {
        shouldContinue = false;

        // Mark horizontal runs by negating values
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n - 2; j++) {
                const val = Math.abs(board[i][j]);
                if (val !== 0 && val === Math.abs(board[i][j + 1]) && val === Math.abs(board[i][j + 2])) {
                    board[i][j] = -val;
                    board[i][j + 1] = -val;
                    board[i][j + 2] = -val;
                    shouldContinue = true;
                }
            }
        }

        // Mark vertical runs by negating values
        for (let i = 0; i < m - 2; i++) {
            for (let j = 0; j < n; j++) {
                const val = Math.abs(board[i][j]);
                if (val !== 0 && val === Math.abs(board[i + 1][j]) && val === Math.abs(board[i + 2][j])) {
                    board[i][j] = -val;
                    board[i + 1][j] = -val;
                    board[i + 2][j] = -val;
                    shouldContinue = true;
                }
            }
        }

        // Crush and apply gravity
        for (let j = 0; j < n; j++) {
            let writePos = m - 1;
            for (let i = m - 1; i >= 0; i--) {
                if (board[i][j] > 0) {
                    board[writePos][j] = board[i][j];
                    if (writePos !== i) {
                        board[i][j] = 0;
                    }
                    writePos--;
                }
            }
            while (writePos >= 0) {
                board[writePos][j] = 0;
                writePos--;
            }
        }
    }

    return board;
}
'@
Add-Version $p "neg" "In-Place Simulation with Negation" $src 1

# Valid Sudoku
Add-Problem "valid-sudoku" "Valid Sudoku" "Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the rules: each row, column, and 3x3 sub-box must contain the digits 1-9 without repetition. Empty cells are encoded as 0. Input is provided flattened row-major (81 values)." "board.length == 9" 100
$p = Get-ProblemId "valid-sudoku"
$src = @'
function isValidSudoku(board) {
    // Check each row
    for (let r = 0; r < 9; r++) {
        const seen = new Set();
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === '.') continue;
            if (seen.has(board[r][c])) return false;
            seen.add(board[r][c]);
        }
    }

    // Check each column
    for (let c = 0; c < 9; c++) {
        const seen = new Set();
        for (let r = 0; r < 9; r++) {
            if (board[r][c] === '.') continue;
            if (seen.has(board[r][c])) return false;
            seen.add(board[r][c]);
        }
    }

    // Check each 3x3 sub-box
    for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
            const seen = new Set();
            for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
                for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
                    if (board[r][c] === '.') continue;
                    if (seen.has(board[r][c])) return false;
                    seen.add(board[r][c]);
                }
            }
        }
    }

    return true;
}
'@
Add-Version $p "threepass" "Three Separate Passes" $src 0
$src = @'
function isValidSudoku(board) {
    // One set per row, column, and 3x3 box
    const rows = Array.from({ length: 9 }, () => new Set());
    const cols = Array.from({ length: 9 }, () => new Set());
    const boxes = Array.from({ length: 9 }, () => new Set());

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === '.') continue;

            const digit = board[r][c];
            const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);

            // Check all three constraints at once
            if (rows[r].has(digit) || cols[c].has(digit) || boxes[boxIdx].has(digit)) {
                return false;
            }

            rows[r].add(digit);
            cols[c].add(digit);
            boxes[boxIdx].add(digit);
        }
    }

    return true;
}
'@
Add-Version $p "singlepass" "Single Pass with Hash Sets" $src 1

# Game of Life
Add-Problem "game-of-life" "Game of Life" "According to Wikipedia's article: 'The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.' Given an m x n board of 0s and 1s, compute the next state by applying the four rules based on live neighbors. Input is provided flattened row-major with rows/cols dimensions." "1 <= board.length <= 25" 101
$p = Get-ProblemId "game-of-life"
$src = @'
function gameOfLife(board) {
    const m = board.length;
    const n = board[0].length;

    // Create a copy to read original states from
    const copy = board.map((row) => [...row]);

    // 8 possible neighbor directions
    const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
    const dc = [-1, 0, 1, -1, 1, -1, 0, 1];

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            let liveNeighbors = 0;

            // Count live neighbors from the copy
            for (let d = 0; d < 8; d++) {
                const ni = i + dr[d];
                const nj = j + dc[d];
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && copy[ni][nj] === 1) {
                    liveNeighbors++;
                }
            }

            // Apply rules
            if (copy[i][j] === 1) {
                if (liveNeighbors < 2 || liveNeighbors > 3) {
                    board[i][j] = 0;
                }
            } else {
                if (liveNeighbors === 3) {
                    board[i][j] = 1;
                }
            }
        }
    }
}
'@
Add-Version $p "copy" "Brute Force (Copy Board)" $src 0
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
Add-Version $p "encode" "In-Place with State Encoding" $src 1

Write-Host "OK: All 7 matrix problems seeded"
