---
title: 题解：AT_abc268_g [ABC268G] Random Student ID
date: 2025-10-5 20:51:19
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
友链：P11226。

样例很良心。

你会发现两个字符串有前缀关系的时候，它们的大小关系是确定的。否则，显然它们的大小关系不确定，两种情况可能性都是 $50\%$。

所以，一个字符串的前缀对它的排名贡献为 $1$，有它作为前缀的字符串对它排名贡献为 $0$，而其它字符串对它的贡献为 $\dfrac{1}{2}$，因为是排名所以还有一个额外的 $1$。我们只需要计数它有多少个前缀，它是多少个字符串的前缀即可。都是 Trie 树容易解决的问题。

[千字提交记录](https://atcoder.jp/contests/abc268/submissions/69813959)。