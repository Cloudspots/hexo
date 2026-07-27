---
title: lowbit(a^n-b^n)
date: 2025-11-26 16:02:21
categories:
  - Algorithm & Theory
tags: []
---
给定 $a,b,n\le 10^6$，求 $\mathrm{lowbit}(a^n-b^n)$。有原题，但是在哪呢。

显然 $a,b$ 不都是奇数的情况下可以转化为都是奇数的情况或者直接求出结果，问题就在于都是奇数怎么求。

有因式分解：$a^n-b^n=(a-b)(a^{n-1}+a^{n-2}b+a^{n-3}b^2+\dots+ab^{n-2}+b^{n-1})$，当 $n$ 是奇数时右边显然时奇数，故答案为 $\mathrm{lowbit}(a-b)$。如果 $n$ 是偶数？

$n=2k$，则 $a^n-b^n=(a^k)^2-(b^k)^2=(a^k-b^k)(a^k+b^k)$。那么左边可以递归下去，右边呢？

如果 $k$ 是偶数，由于 $a,b$ 都是奇数，他们的平方模四必然余 $1$，加起来余 $2$，所以右边的 $\mathrm{lowbit}$ 必然为 $2$。而如果 $k$ 是奇数，有因式分解但是我不想打 $\KaTeX$ 了，反正是 $(a+b)$ 乘一个奇数，显然其 $\mathrm{lowbit}$ 就是 $\mathrm{lowbit}(a+b)$。

总共递归 $\log_2\left(\mathrm{lowbit}\left(\dfrac{n}{2}\right)\right)$ 层，除了最后一层之外对于答案的贡献均只为 $2$，而最后一层是 $\newcommand{\lowbit}{\mathrm{lowbit}}\lowbit(a-b)\lowbit(a+b) = \lowbit(a^2-b^2)$，故答案为 $\newcommand{\lowbit}{\mathrm{lowbit}}\lowbit(a^2-b^2)(\lowbit(n)-1)$。

前面对于不全是奇数套的壳需要快速幂。所以时间复杂度是 $\mathcal O(\log n+\log \log a)$。