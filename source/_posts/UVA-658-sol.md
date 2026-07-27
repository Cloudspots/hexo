---
title: 题解：UVA658 这不是bug，而是特性 It's not a Bug, it's a Feature!
date: 2025-2-5 17:28:20
categories:
  - Solution
tags:
  - Solution
  - UVA Problem Solution
---
这题居然还能交题解。

显然，通过“最短时间”想到 Dijkstra，状态可以使用 `array<bool, 20>` 表示，但是我们可以使用 `bitset` 的策略——状压。

考虑二进制，每一位对应一个 bug，如果是 $1$ 则表示有这个 bug，如果是 $0$ 则表示没有这个 bug。

考虑时间复杂度。对于每一种状态，打完补丁后的状态都是唯一确定的（可能不存在），最多有 $m2^n$ 条边，显然有 $2^n$ 个点，优先队列（二叉堆）优化的时间复杂度是 $\mathcal O(nm2^n)$，理论上可能不行，实际上可以通过。

但是可能这题实际上并不会有这么多边，有时间搞个严谨证明或者 hack。

斐波那契堆优化的时间复杂度是正确的。