. "$PSScriptRoot\load-env.ps1"

$headers = @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY"; "Content-Type" = "application/json"; "Prefer" = "return=minimal" }

function Get-ProblemId($slug) {
    $resp = Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems?select=id&slug=eq.$slug" -Headers @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY" }
    return $resp[0].id
}

function Add-Problem($slug, $title, $desc, $constraints, $sort) {
    $body = @{ slug=$slug; title=$title; category_id="linked-list-reversal"; difficulty="medium"; description=$desc; constraints=$constraints; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems" -Method POST -Headers $headers -Body $body
    Write-Host "  problem $slug"
}

function Add-Version($problemId, $vid, $name, $src, $sort) {
    $body = @{ problem_id=$problemId; version_id=$vid; name=$name; source=$src; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problem_versions" -Method POST -Headers $headers -Body $body
    Write-Host "  version $vid"
}

# Palindrome Linked List
Add-Problem "palindrome-linked-list" "Palindrome Linked List" "Given the head of a singly linked list, return true if it is a palindrome or false otherwise. Input is provided as a value array." "1 <= number of nodes <= 10^5" 113
$p = Get-ProblemId "palindrome-linked-list"
$src = @'
var isPalindrome = function(head) {
    // Copy values into an array
    var vals = [];
    var curr = head;
    while (curr !== null) {
        vals.push(curr.val);
        curr = curr.next;
    }

    // Two-pointer palindrome check
    var left = 0;
    var right = vals.length - 1;
    while (left < right) {
        if (vals[left] !== vals[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
};
'@
Add-Version $p "array" "Copy to Array" $src 0
$src = @'
var isPalindrome = function(head) {
    if (head === null || head.next === null) {
        return true;
    }

    // Step 1: Find the middle using slow/fast pointers
    var slow = head;
    var fast = head;
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // Step 2: Reverse the second half
    var prev = null;
    var curr = slow;
    while (curr !== null) {
        var next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }

    // Step 3: Compare both halves
    var left = head;
    var right = prev;
    while (right !== null) {
        if (left.val !== right.val) {
            return false;
        }
        left = left.next;
        right = right.next;
    }
    return true;
};
'@
Add-Version $p "reversehalf" "Reverse Second Half (Optimal)" $src 1

# Reverse Linked List
Add-Problem "reverse-linked-list" "Reverse Linked List" "Given the head of a singly linked list, reverse the list, and return the reversed list. Input is provided as a value array." "0 <= number of nodes <= 5000" 114
$p = Get-ProblemId "reverse-linked-list"
$src = @'
function reverseList(head) {
    let prev = null;
    let curr = head;

    while (curr !== null) {
        let next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }

    return prev;
}
'@
Add-Version $p "iterative" "Iterative (Three Pointers)" $src 0
$src = @'
var reverseList = function(head) {
    // Base case: empty list or single node
    if (head === null || head.next === null) {
        return head;
    }

    // Reverse the rest of the list
    var newHead = reverseList(head.next);

    // Fix the pointers
    head.next.next = head; // Next node points back to current
    head.next = null;      // Current node becomes tail

    return newHead;
};
'@
Add-Version $p "recursive" "Recursive" $src 1

# Reverse Linked List II
Add-Problem "reverse-linked-list-ii" "Reverse Linked List II" "Given the head of a singly linked list and two integers left and right where left <= right, reverse the nodes of the list from position left to position right, and return the reversed list. Input is provided as a value array with left/right parameters." "1 <= number of nodes <= 500" 115
$p = Get-ProblemId "reverse-linked-list-ii"
$src = @'
var reverseBetween = function(head, left, right) {
    // Collect values from position left to right
    var values = [];
    var curr = head;
    var pos = 1;
    while (curr) {
        if (pos >= left && pos <= right) {
            values.push(curr.val);
        }
        curr = curr.next;
        pos++;
    }

    // Reverse the collected values
    values.reverse();

    // Write reversed values back into the list
    curr = head;
    pos = 1;
    var idx = 0;
    while (curr) {
        if (pos >= left && pos <= right) {
            curr.val = values[idx];
            idx++;
        }
        curr = curr.next;
        pos++;
    }

    return head;
};
'@
Add-Version $p "extract" "Extract, Reverse, and Reinsert" $src 0
$src = @'
var reverseBetween = function(head, left, right) {
    var dummy = new ListNode(0, head);
    var prev = dummy;

    // Move prev to the node just before position left
    for (var i = 0; i < left - 1; i++) {
        prev = prev.next;
    }

    var curr = prev.next; // First node in the reversal range

    // Reverse by moving each next node to the front of the reversed section
    for (var i = 0; i < right - left; i++) {
        var nextNode = curr.next;
        curr.next = nextNode.next;
        nextNode.next = prev.next;
        prev.next = nextNode;
    }

    return dummy.next;
};
'@
Add-Version $p "inplace" "In-Place Reversal with Pointer Manipulation" $src 1

# Reverse Nodes in k-Group
Add-Problem "reverse-nodes-in-k-group" "Reverse Nodes in k-Group" "Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list. k is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of k then left-out nodes, in the end, should remain as it is. Input is provided as a value array with k as a parameter." "1 <= k <= number of nodes <= 5000" 116
$p = Get-ProblemId "reverse-nodes-in-k-group"
$src = @'
var reverseKGroup = function(head, k) {
    // Collect values into array
    var values = [];
    var curr = head;
    while (curr) {
        values.push(curr.val);
        curr = curr.next;
    }

    var n = values.length;

    // Reverse each complete group of k
    for (var start = 0; start + k <= n; start += k) {
        var left = start;
        var right = start + k - 1;
        while (left < right) {
            var temp = values[left];
            values[left] = values[right];
            values[right] = temp;
            left++;
            right--;
        }
    }

    // Write values back to linked list
    curr = head;
    for (var i = 0; i < values.length; i++) {
        curr.val = values[i];
        curr = curr.next;
    }

    return head;
};
'@
Add-Version $p "array" "Extract to Array and Rebuild" $src 0
$src = @'
var reverseKGroup = function(head, k) {
    var dummy = new ListNode(0);
    dummy.next = head;
    var groupPrev = dummy;

    while (true) {
        // Check if k nodes remain
        var kthNode = getKthNode(groupPrev, k);
        if (!kthNode) break;

        var groupNext = kthNode.next;

        // Reverse k nodes starting from groupPrev.next
        var prev = groupNext;
        var curr = groupPrev.next;
        for (var i = 0; i < k; i++) {
            var next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }

        // Reconnect
        var groupHead = groupPrev.next;
        groupPrev.next = kthNode;
        groupPrev = groupHead;
    }

    return dummy.next;
};

function getKthNode(node, k) {
    while (node && k > 0) {
        node = node.next;
        k--;
    }
    return node;
}
'@
Add-Version $p "inplace" "Iterative In-Place Reversal" $src 1

Write-Host "OK: All 4 linked-list reversal problems seeded"
