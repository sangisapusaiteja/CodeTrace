. "$PSScriptRoot\load-env.ps1"

$headers = @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY"; "Content-Type" = "application/json"; "Prefer" = "return=minimal" }

function Get-ProblemId($slug) {
    $resp = Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems?select=id&slug=eq.$slug" -Headers @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY" }
    return $resp[0].id
}

function Add-Problem($slug, $title, $desc, $constraints, $sort) {
    $body = @{ slug=$slug; title=$title; category_id="fast-slow-pointers"; difficulty="medium"; description=$desc; constraints=$constraints; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems" -Method POST -Headers $headers -Body $body
    Write-Host "  problem $slug"
}

function Add-Version($problemId, $vid, $name, $src, $sort) {
    $body = @{ problem_id=$problemId; version_id=$vid; name=$name; source=$src; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problem_versions" -Method POST -Headers $headers -Body $body
    Write-Host "  version $vid"
}

# Middle of the Linked List
Add-Problem "middle-of-the-linked-list" "Middle of the Linked List" "Given the head of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node. Input is provided as a value array." "1 <= number of nodes <= 100" 117
$p = Get-ProblemId "middle-of-the-linked-list"
$src = @'
var middleNode = function(head) {
    var nodes = [];
    var current = head;

    // Collect all nodes into an array
    while (current) {
        nodes.push(current);
        current = current.next;
    }

    // Return the middle node
    return nodes[Math.floor(nodes.length / 2)];
};
'@
Add-Version $p "array" "Convert to Array" $src 0
$src = @'
var middleNode = function(head) {
    // First pass: count the nodes
    var count = 0;
    var current = head;
    while (current) {
        count++;
        current = current.next;
    }

    // Second pass: walk to the middle
    current = head;
    for (var i = 0; i < Math.floor(count / 2); i++) {
        current = current.next;
    }

    return current;
};
'@
Add-Version $p "twopass" "Two-Pass (Count then Traverse)" $src 1

# Happy Number
Add-Problem "happy-number" "Happy Number" "Write an algorithm to determine if a number n is happy. A happy number is a number defined by the following process: starting with any positive integer, replace the number by the sum of the squares of its digits, and repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1. Those numbers for which this process ends in 1 are happy. Input is provided as a single-value array." "1 <= n <= 2^31 - 1" 118
$p = Get-ProblemId "happy-number"
$src = @'
var isHappy = function(n) {
    var seen = new Set();

    while (n !== 1 && !seen.has(n)) {
        seen.add(n);
        n = getNext(n);
    }

    return n === 1;
};

function getNext(n) {
    var sum = 0;
    while (n > 0) {
        var digit = n % 10;
        sum += digit * digit;
        n = Math.floor(n / 10);
    }
    return sum;
}
'@
Add-Version $p "set" "Hash Set" $src 0
$src = @'
var isHappy = function(n) {
    var slow = n;
    var fast = getNext(n);

    // Fast moves two steps, slow moves one step
    while (fast !== 1 && slow !== fast) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }

    return fast === 1;
};

function getNext(n) {
    var sum = 0;
    while (n > 0) {
        var digit = n % 10;
        sum += digit * digit;
        n = Math.floor(n / 10);
    }
    return sum;
}
'@
Add-Version $p "floyd" "Floyd's Cycle Detection (Two Pointers)" $src 1

# Linked List Cycle II
Add-Problem "linked-list-cycle-ii" "Linked List Cycle II" "Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null. Input is provided as a value array with a cycleStart index parameter (-1 for no cycle)." "0 <= number of nodes <= 10^4" 119
$p = Get-ProblemId "linked-list-cycle-ii"
$src = @'
var detectCycle = function(head) {
    var seen = new Set();

    var current = head;
    while (current !== null) {
        // If we've seen this node before, it's the cycle start
        if (seen.has(current)) {
            return current;
        }
        seen.add(current);
        current = current.next;
    }

    // No cycle found
    return null;
};
'@
Add-Version $p "set" "Hash Set" $src 0
$src = @'
var detectCycle = function(head) {
    var slow = head;
    var fast = head;

    // Phase 1: Detect if a cycle exists
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) {
            // Phase 2: Find the cycle start
            slow = head;
            while (slow !== fast) {
                slow = slow.next;
                fast = fast.next;
            }
            return slow;
        }
    }

    // No cycle
    return null;
};
'@
Add-Version $p "floyd" "Floyd's Tortoise and Hare (Optimal)" $src 1

Write-Host "OK: All 3 fast-slow-pointer problems seeded"
