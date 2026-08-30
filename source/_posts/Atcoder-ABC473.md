---
title: Atcoder-ABC473
tags:
  - Solution
  - Atcoder Problem Solution
categories:
  - Solution
date: 2026-08-29 21:47:29
updated: 2026-08-29 21:47:29
---
# ABC473 题解

## C

一个班级合法当且仅当其原人数 $\ge m-1$，其中 $m$ 是所有班级的原人数的最大值。

$O(n+V)$。

## D

搜索，考虑如何不搜到无解情况。注意到 $A_1=\displaystyle K-\sum_{i\ge 2}iA_i$，只要 $\displaystyle\sum_{i\ge 2}A_i\le K$ 就一定有对应的 $A_1$，那么从后往前搜索即可。当然也可以从 $2$ 开始搜索。

$O(A\log A)$，$A$ 是答案个数。

## E

首先如果一个连续段不是 $K$ 的倍数那么它怎么搞都行，我们不妨把它砍成一个一个的，即每一段要么和是 $K$ 的倍数，要么长度为 $1$。考虑 dp，$f_i$ 表示考虑 $1\sim i$ 的答案，则 $f_i=\max(f_{i-1},f_{l_i}+1)$，其中 $l_i$ 为最大的满足 $K\mid \sum_{j<p\le i}a_p$ 的 $j$，这个可以直接算。

时间复杂度 $O(N\log \min(N,K))$ 或 $O(N)$。

## F

显然可以不考虑冗余 $\texttt A$。考虑括号匹配。那么问题转化为，判断 $\displaystyle\min\limits_{l\le i\le r}\sum_{l\le j\le i}a_j\ge 0$ 是否成立。支持单点修改 $a$。

首先都转化为前缀和，那么要求一段前缀和的 $\min$。考虑修改，此时相当于对前缀的后缀修改。那么线段树即可。$O(N+Q\log N)$。

## G

首先转化为“一次刚好蒙对的个数为 $M=2N-K$”。列出这个问题的 dp 式子，显然是第一类斯特林数。

赛时做法：考虑其生成函数为 $(x+0)(x+1)(x+2)\dots (x+N-1)$，分治卷积即可。$O(N\log^2 N)$。

听说可以做到 $O(N\log N)$，反正第一类斯特林数求值是很典的问题，不管了。

真正的问题是：

![笑点解析：](passed-after-22sec.png)
