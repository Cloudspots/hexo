---
layout: blog
title: ABC468F 题解
date: 2026-07-25 21:52:09
tags:
  - Solution
  - Atcoder Problem Solution
categories:
  - Solution
updated: 2026-07-25 21:52:09
---
Observation 1. 任意时刻 $X,Y$ 的大小关系都是相同的。

Proof：不妨设 $X_1=a_1,Y_1=0$。数学归纳法。如果 $a_i<X_{i-1}$，那么显然大小关系不会变。如果 $a_i>X_{i-1}$，则 $Y_i\gets a_i$ 必然不优于 $X_i\gets a_i$。$\square$

Observation 2. 不妨设 $X_1=a_1$。最优解中前缀最大值必然全部在 $X$ 中。并且，$X$ 选择任意不是前缀最大值的元素也不会改变 Observation 1 中的合法性。

Proof：Trivial。$\square$

Observation 3. $Y$ 可以选择任意不是前缀最大值的元素。

Proof：不是前缀最大值且不在 $Y$ 中的可以被 $X$ 选掉。$\square$

Algorithm. 先求出前缀最大值，然后去掉前缀最大值再求 LIS，前缀最大值长度+LIS 长度即为答案。
