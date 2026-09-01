$env:SUPABASE_URL="https://smskaqirzggxygoqhftm.supabase.co"
$env:SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtc2thcWlyemdneHlnb3FoZnRtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjY5MTExNiwiZXhwIjoyMTAyMjY3MTE2fQ.XnnGulcwGQ5t3bUFv6XwIpuMkx-g8UWWbl7n4uCAXYI"
$headers = @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY"; "Content-Type" = "application/json"; "Prefer" = "return=minimal" }

function Get-ProblemId($slug) {
    $resp = Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems?select=id&slug=eq.$slug" -Headers @{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY" }
    return $resp[0].id
}

function Add-Problem($slug, $title, $desc, $constraints, $sort) {
    $body = @{ slug=$slug; title=$title; category_id="linked-list"; difficulty="medium"; description=$desc; constraints=$constraints; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problems" -Method POST -Headers $headers -Body $body
    Write-Host "  problem $slug"
}

function Add-Version($problemId, $vid, $name, $src, $sort) {
    $body = @{ problem_id=$problemId; version_id=$vid; name=$name; source=$src; sort_order=$sort } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/ct_problem_versions" -Method POST -Headers $headers -Body $body
    Write-Host "  version $vid"
}

# Intersection of Two Linked Lists
Add-Problem "intersection-of-two-linked-lists" "Intersection of Two Linked Lists" "Given the heads of two singly linked-lists headA and headB, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return null. Inputs are provided as value arrays." "1 <= listA.length, listB.length <= 3 * 10^4" 102
$p = Get-ProblemId "intersection-of-two-linked-lists"
$src = @'
function getIntersectionNode(headA, headB) {
    // Store all nodes from list A in a set
    var visited = new Set();
    var curr = headA;
    while (curr !== null) {
        visited.add(curr);
        curr = curr.next;
    }

    // Walk through list B and find the first shared node
    curr = headB;
    while (curr !== null) {
        if (visited.has(curr)) {
            return curr;
        }
        curr = curr.next;
    }

    return null;
}
'@
Add-Version $p "hashset" "Hash Set" $src 0
$src = @'
function getIntersectionNode(headA, headB) {
    var pA = headA;
    var pB = headB;

    // Each pointer traverses both lists, meeting at intersection or null
    while (pA !== pB) {
        pA = (pA !== null) ? pA.next : headB;
        pB = (pB !== null) ? pB.next : headA;
    }

    return pA;
}
'@
Add-Version $p "twopointer" "Two Pointers" $src 1

# Remove Duplicates from Sorted List
Add-Problem "remove-duplicates-from-sorted-list" "Remove Duplicates from Sorted List" "Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list sorted as well. Input is provided as a value array." "0 <= number of nodes <= 3 * 10^4" 103
$p = Get-ProblemId "remove-duplicates-from-sorted-list"
$src = @'
function deleteDuplicates(head) {
    if (!head) return null;

    var seen = new Set();
    seen.add(head.val);
    var current = head;

    while (current.next) {
        if (seen.has(current.next.val)) {
            // Skip the duplicate node
            current.next = current.next.next;
        } else {
            seen.add(current.next.val);
            current = current.next;
        }
    }

    return head;
}
'@
Add-Version $p "set" "Using a Hash Set" $src 0
$src = @'
function deleteDuplicates(head) {
    var current = head;

    while (current !== null && current.next !== null) {
        if (current.val === current.next.val) {
            // Skip the duplicate node
            current.next = current.next.next;
        } else {
            // Move to the next distinct node
            current = current.next;
        }
    }

    return head;
}
'@
Add-Version $p "inplace" "Single Pass In-Place (Optimal)" $src 1

# Design Linked List
Add-Problem "design-linked-list" "Design Linked List" "Design your implementation of the linked list. You can choose to use a singly or doubly linked list. This trace animates a hardcoded demo sequence of addAtHead, addAtTail, addAtIndex, get, and deleteAtIndex operations." "0 <= index, val <= 1000" 104
$p = Get-ProblemId "design-linked-list"
$src = @'
function MyLinkedList() {
    this.sentinel = {val: 0, next: null};
    this.size = 0;
};

MyLinkedList.prototype.get = function(index) {
    if (index < 0 || index >= this.size) return -1;
    var current = this.sentinel.next;
    for (var i = 0; i < index; i++) {
        current = current.next;
    }
    return current.val;
};

MyLinkedList.prototype.addAtHead = function(val) {
    this.addAtIndex(0, val);
};

MyLinkedList.prototype.addAtTail = function(val) {
    this.addAtIndex(this.size, val);
};

MyLinkedList.prototype.addAtIndex = function(index, val) {
    if (index < 0 || index > this.size) return;
    var pred = this.sentinel;
    for (var i = 0; i < index; i++) {
        pred = pred.next;
    }
    var newNode = {val: val, next: pred.next};
    pred.next = newNode;
    this.size++;
};

MyLinkedList.prototype.deleteAtIndex = function(index) {
    if (index < 0 || index >= this.size) return;
    var pred = this.sentinel;
    for (var i = 0; i < index; i++) {
        pred = pred.next;
    }
    pred.next = pred.next.next;
    this.size--;
}
'@
Add-Version $p "singly" "Singly Linked List" $src 0
$src = @'
function MyLinkedList() {
    this.headSentinel = {val: 0, prev: null, next: null};
    this.tailSentinel = {val: 0, prev: null, next: null};
    this.headSentinel.next = this.tailSentinel;
    this.tailSentinel.prev = this.headSentinel;
    this.size = 0;
};

MyLinkedList.prototype._getNodeAt = function(index) {
    var node;
    if (index < this.size / 2) {
        node = this.headSentinel.next;
        for (var i = 0; i < index; i++) {
            node = node.next;
        }
    } else {
        node = this.tailSentinel.prev;
        for (var i = this.size - 1; i > index; i--) {
            node = node.prev;
        }
    }
    return node;
};

MyLinkedList.prototype.get = function(index) {
    if (index < 0 || index >= this.size) return -1;
    return this._getNodeAt(index).val;
};

MyLinkedList.prototype.addAtHead = function(val) {
    var newNode = {val: val, prev: null, next: null};
    var after = this.headSentinel.next;
    this.headSentinel.next = newNode;
    newNode.prev = this.headSentinel;
    newNode.next = after;
    after.prev = newNode;
    this.size++;
};

MyLinkedList.prototype.addAtTail = function(val) {
    var newNode = {val: val, prev: null, next: null};
    var before = this.tailSentinel.prev;
    before.next = newNode;
    newNode.prev = before;
    newNode.next = this.tailSentinel;
    this.tailSentinel.prev = newNode;
    this.size++;
};

MyLinkedList.prototype.addAtIndex = function(index, val) {
    if (index < 0 || index > this.size) return;
    var successor, predecessor;
    if (index === this.size) {
        successor = this.tailSentinel;
        predecessor = this.tailSentinel.prev;
    } else {
        successor = this._getNodeAt(index);
        predecessor = successor.prev;
    }
    var newNode = {val: val, prev: predecessor, next: successor};
    predecessor.next = newNode;
    successor.prev = newNode;
    this.size++;
};

MyLinkedList.prototype.deleteAtIndex = function(index) {
    if (index < 0 || index >= this.size) return;
    var node = this._getNodeAt(index);
    node.prev.next = node.next;
    node.next.prev = node.prev;
    this.size--;
}
'@
Add-Version $p "doubly" "Doubly Linked List" $src 1

# Remove Nth Node From End of List
Add-Problem "remove-nth-node-from-end-of-list" "Remove Nth Node From End of List" "Given the head of a linked list, remove the nth node from the end of the list and return its head. Input is provided as a value array with n as a parameter." "1 <= n <= number of nodes" 105
$p = Get-ProblemId "remove-nth-node-from-end-of-list"
$src = @'
function removeNthFromEnd(head, n) {
    // Dummy node simplifies edge case of removing head
    var dummy = new ListNode(0, head);

    // First pass: count total nodes
    var length = 0;
    var current = head;
    while (current !== null) {
        length++;
        current = current.next;
    }

    // Second pass: advance (length - n) steps from dummy
    var prev = dummy;
    for (var i = 0; i < length - n; i++) {
        prev = prev.next;
    }

    // Remove the target node
    prev.next = prev.next.next;

    return dummy.next;
}
'@
Add-Version $p "twopass" "Two Pass (Count then Remove)" $src 0
$src = @'
function removeNthFromEnd(head, n) {
    // Dummy node handles the edge case of removing the head
    var dummy = new ListNode(0, head);
    var slow = dummy;
    var fast = dummy;

    // Advance fast by n + 1 steps to create the gap
    for (var i = 0; i <= n; i++) {
        fast = fast.next;
    }

    // Move both pointers until fast reaches the end
    while (fast !== null) {
        slow = slow.next;
        fast = fast.next;
    }

    // slow is now the node before the target, skip the target
    slow.next = slow.next.next;

    return dummy.next;
}
'@
Add-Version $p "onepass" "One Pass (Two Pointers)" $src 1

# Remove Duplicates from Sorted List II
Add-Problem "remove-duplicates-from-sorted-list-ii" "Remove Duplicates from Sorted List II" "Given the head of a sorted linked list, delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list. Return the linked list sorted as well. Input is provided as a value array." "0 <= number of nodes <= 3 * 10^4" 106
$p = Get-ProblemId "remove-duplicates-from-sorted-list-ii"
$src = @'
function deleteDuplicates(head) {
    // Pass 1: count frequencies
    var count = new Map();
    var current = head;
    while (current !== null) {
        count.set(current.val, (count.get(current.val) || 0) + 1);
        current = current.next;
    }

    // Pass 2: remove nodes with count > 1
    var dummy = new ListNode(0, head);
    var prev = dummy;
    while (prev.next !== null) {
        if (count.get(prev.next.val) > 1) {
            // Skip this node
            prev.next = prev.next.next;
        } else {
            prev = prev.next;
        }
    }

    return dummy.next;
}
'@
Add-Version $p "map" "Hash Map (Two Pass)" $src 0
$src = @'
function deleteDuplicates(head) {
    var dummy = new ListNode(0, head);
    var prev = dummy;

    var current = head;
    while (current !== null) {
        // Check if current starts a duplicate run
        if (current.next !== null && current.val === current.next.val) {
            // Skip all nodes with this value
            while (current.next !== null && current.val === current.next.val) {
                current = current.next;
            }
            // Wire prev to the node after the duplicate run
            prev.next = current.next;
        } else {
            // Current is unique, advance prev
            prev = prev.next;
        }
        current = current.next;
    }

    return dummy.next;
}
'@
Add-Version $p "single" "Single Pass with Dummy Node (Optimal)" $src 1

# Swap Nodes in Pairs
Add-Problem "swap-nodes-in-pairs" "Swap Nodes in Pairs" "Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes. Input is provided as a value array." "0 <= number of nodes <= 100" 107
$p = Get-ProblemId "swap-nodes-in-pairs"
$src = @'
function swapPairs(head) {
    // Base case: fewer than 2 nodes, nothing to swap
    if (!head || !head.next) return head;

    var first = head;
    var second = head.next;

    // Recursively swap the rest of the list
    first.next = swapPairs(second.next);
    second.next = first;

    // second is now the head of this swapped pair
    return second;
}
'@
Add-Version $p "recursive" "Recursive" $src 0
$src = @'
function swapPairs(head) {
    // Dummy node simplifies head pointer management
    var dummy = new ListNode(0, head);
    var prev = dummy;

    while (prev.next && prev.next.next) {
        var first = prev.next;
        var second = prev.next.next;

        // Rewire the three pointers
        prev.next = second;
        first.next = second.next;
        second.next = first;

        // Advance prev to the end of the swapped pair
        prev = first;
    }

    return dummy.next;
}
'@
Add-Version $p "iterative" "Iterative with Dummy Node" $src 1

# Copy List with Random Pointer
Add-Problem "copy-list-with-random-pointer" "Copy List with Random Pointer" "A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null. Construct a deep copy of the list. Inputs are provided as a value array and a random-index array." "0 <= n <= 1000" 108
$p = Get-ProblemId "copy-list-with-random-pointer"
$src = @'
function copyRandomList(head) {
    if (!head) return null;

    // Pass 1: create copy nodes and build the mapping
    var map = new Map();
    var current = head;
    while (current) {
        map.set(current, new _Node(current.val));
        current = current.next;
    }

    // Pass 2: wire up next and random pointers
    current = head;
    while (current) {
        map.get(current).next = map.get(current.next) || null;
        map.get(current).random = map.get(current.random) || null;
        current = current.next;
    }

    return map.get(head);
}
'@
Add-Version $p "map" "Hash Map (Two Pass)" $src 0
$src = @'
function copyRandomList(head) {
    if (!head) return null;

    // Pass 1: interleave copy nodes after each original
    var current = head;
    while (current) {
        var copy = new _Node(current.val);
        copy.next = current.next;
        current.next = copy;
        current = copy.next;
    }

    // Pass 2: set random pointers for copy nodes
    current = head;
    while (current) {
        if (current.random) {
            current.next.random = current.random.next;
        }
        current = current.next.next;
    }

    // Pass 3: separate the interleaved list into original and copy
    var copyHead = head.next;
    current = head;
    var copyCurrent = copyHead;
    while (current) {
        current.next = copyCurrent.next;
        current = current.next;
        if (current) {
            copyCurrent.next = current.next;
            copyCurrent = copyCurrent.next;
        } else {
            copyCurrent.next = null;
        }
    }

    return copyHead;
}
'@
Add-Version $p "interleave" "Interleaving Nodes (O(1) Space)" $src 1

# Partition List
Add-Problem "partition-list" "Partition List" "Given the head of a linked list and a value x, partition it such that all nodes less than x come before nodes greater than or equal to x. You should preserve the original relative order of the nodes in each of the two partitions. Input is provided as a value array with x as a parameter." "0 <= number of nodes <= 200" 109
$p = Get-ProblemId "partition-list"
$src = @'
function partition(head, x) {
    // Collect values into two arrays based on partition value
    var less = [];
    var greater = [];

    var current = head;
    while (current !== null) {
        if (current.val < x) {
            less.push(current.val);
        } else {
            greater.push(current.val);
        }
        current = current.next;
    }

    // Build the result linked list
    var dummy = new ListNode(0);
    var tail = dummy;

    var combined = less.concat(greater);
    for (var i = 0; i < combined.length; i++) {
        tail.next = new ListNode(combined[i]);
        tail = tail.next;
    }

    return dummy.next;
}
'@
Add-Version $p "array" "Collect into Array and Rebuild" $src 0
$src = @'
function partition(head, x) {
    // Two dummy heads for the less and greater chains
    var lessHead = new ListNode(0);
    var greaterHead = new ListNode(0);
    var lessTail = lessHead;
    var greaterTail = greaterHead;

    // Distribute nodes into the two chains
    var current = head;
    while (current !== null) {
        if (current.val < x) {
            lessTail.next = current;
            lessTail = lessTail.next;
        } else {
            greaterTail.next = current;
            greaterTail = greaterTail.next;
        }
        current = current.next;
    }

    // Connect the less chain to the greater chain
    lessTail.next = greaterHead.next;
    // Terminate the greater chain to prevent cycles
    greaterTail.next = null;

    return lessHead.next;
}
'@
Add-Version $p "twodummy" "Two Dummy Lists (Optimal)" $src 1

# Rotate List
Add-Problem "rotate-list" "Rotate List" "Given the head of a linked list, rotate the list to the right by k places. Input is provided as a value array with k as a parameter." "0 <= number of nodes <= 500" 110
$p = Get-ProblemId "rotate-list"
$src = @'
function rotateRight(head, k) {
    if (!head || !head.next || k === 0) return head;

    // Count the length
    var n = 0;
    var temp = head;
    while (temp) {
        n++;
        temp = temp.next;
    }

    k = k % n;
    if (k === 0) return head;

    // Rotate one at a time, k times
    for (var i = 0; i < k; i++) {
        var prev = null;
        var curr = head;
        while (curr.next) {
            prev = curr;
            curr = curr.next;
        }
        // curr is the last node, prev is second-to-last
        prev.next = null;
        curr.next = head;
        head = curr;
    }

    return head;
}
'@
Add-Version $p "brute" "Brute Force (Rotate One at a Time)" $src 0
$src = @'
function rotateRight(head, k) {
    if (!head || !head.next || k === 0) return head;

    // Find the length and the tail
    var n = 1;
    var tail = head;
    while (tail.next) {
        n++;
        tail = tail.next;
    }

    // Compute effective rotation
    k = k % n;
    if (k === 0) return head;

    // Form a circular list
    tail.next = head;

    // Walk to the new tail: (n - k - 1) steps from head
    var newTail = head;
    for (var i = 0; i < n - k - 1; i++) {
        newTail = newTail.next;
    }

    // Break the circle
    var newHead = newTail.next;
    newTail.next = null;

    return newHead;
}
'@
Add-Version $p "split" "Find Split Point (Optimal)" $src 1

# Add Two Numbers
Add-Problem "add-two-numbers" "Add Two Numbers" "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list. Inputs are provided as value arrays." "1 <= number of nodes <= 100" 111
$p = Get-ProblemId "add-two-numbers"
$src = @'
function addTwoNumbers(l1, l2) {
    var dummy = new ListNode(0);
    var current = dummy;
    var carry = 0;

    while (l1 !== null || l2 !== null || carry !== 0) {
        var val1 = l1 !== null ? l1.val : 0;
        var val2 = l2 !== null ? l2.val : 0;
        var sum = val1 + val2 + carry;

        carry = Math.floor(sum / 10);
        current.next = new ListNode(sum % 10);
        current = current.next;

        if (l1 !== null) l1 = l1.next;
        if (l2 !== null) l2 = l2.next;
    }

    return dummy.next;
}
'@
Add-Version $p "iterative" "Iterative with Carry" $src 0
$src = @'
function addTwoNumbers(l1, l2) {
    return addWithCarry(l1, l2, 0);
};

function addWithCarry(l1, l2, carry) {
    // Base case: both lists done and no carry
    if (l1 === null && l2 === null && carry === 0) {
        return null;
    }

    var sum = carry;
    if (l1 !== null) sum += l1.val;
    if (l2 !== null) sum += l2.val;

    var node = new ListNode(sum % 10);
    node.next = addWithCarry(
        l1 !== null ? l1.next : null,
        l2 !== null ? l2.next : null,
        Math.floor(sum / 10)
    );

    return node;
}
'@
Add-Version $p "recursive" "Recursive" $src 1

# Flatten a Multilevel Doubly Linked List
Add-Problem "flatten-a-multilevel-doubly-linked-list" "Flatten a Multilevel Doubly Linked List" "You are given a doubly linked list which in addition to the next and previous pointers, it could have a child pointer, which may or may not point to a separate doubly linked list. Flatten the list so that all the nodes appear in a single-level, doubly linked list. Input is provided as a value array." "0 <= number of nodes <= 1000" 112
$p = Get-ProblemId "flatten-a-multilevel-doubly-linked-list"
$src = @'
function flatten(head) {
    if (!head) return null;

    // Use a stack to simulate DFS
    var stack = [head];
    var prev = new Node(0); // dummy previous node

    while (stack.length > 0) {
        var curr = stack.pop();

        // Link current node to previous
        prev.next = curr;
        curr.prev = prev;

        // Push next first (processed later), then child (processed sooner)
        if (curr.next) {
            stack.push(curr.next);
        }
        if (curr.child) {
            stack.push(curr.child);
            curr.child = null; // clear the child pointer
        }

        prev = curr;
    }

    // Detach the dummy node
    head.prev = null;
    return head;
}
'@
Add-Version $p "dfs" "DFS with Stack" $src 0
$src = @'
function flatten(head) {
    var curr = head;

    while (curr !== null) {
        if (curr.child !== null) {
            var next = curr.next; // save the current next

            // Find the tail of the child chain
            var tail = curr.child;
            while (tail.next !== null) {
                tail = tail.next;
            }

            // Splice child chain between curr and next
            curr.next = curr.child;
            curr.child.prev = curr;
            tail.next = next;
            if (next !== null) {
                next.prev = tail;
            }

            // Clear the child pointer
            curr.child = null;
        }
        curr = curr.next;
    }

    return head;
}
'@
Add-Version $p "iterative" "Iterative In-Place (Optimal)" $src 1

Write-Host "OK: All 11 linked-list problems seeded"
