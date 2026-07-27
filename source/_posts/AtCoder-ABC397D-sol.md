---
title: 题解：AT_abc397_d [ABC397D] Cubes
date: 2025-3-16 10:24:50
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
首先我们思考能不能直接枚举 $x$ 和 $y$。

但是这俩邪恶的玩意儿并没有显然的上界。

显然 $x$ 和 $y$ 尽量接近时（差 $1$）则差最小，如果给定差则 $x$ 和 $y$ 最大。

假设 $x=y+1$，则 $(y+1)^3-y^3$ 是一个二次多项式，故时间复杂度是 $\mathcal O(\sqrt N)$ 级别的，无法承受。

上面的推导启发我们设 $x=y+k$。

一通推导猛如虎，我们知道 $k(3y^2 + 3yk + k^2) = N$。这样显然左式大于等于 $k^3$，故枚举 $k$ 是 $\mathcal O(\sqrt[3] N)$ 级别的。

那么我们知道了 $k$（显然 $k$ 需要是 $N$ 的因数），就可以列方程了。

$$ 3y^2 + 3ky + \left(k^2 - \dfrac{N}{k}\right) = 0 $$

使用求根公式。注意到求根公式中有根号，所以如果 $\sqrt \Delta$ 不是整数，则这种情况直接无解，因为 $\sqrt \Delta$ 不是整数而 $b,a$ 是整数，则 $\dfrac{-b \pm \sqrt \Delta}{2a}$ 不可能是整数，然而 $x,y$ 是正整数。

具体地，我们注意到 $\Delta = 9k^2 + 12(\frac{N}{k}-k^2)$。使用大脑思考就可以知道，最大是 $9k^2+\frac{12N}{k}$，当 $k=1$ 时达到 $12N$，超出 C/C++ 中的 `long long` 类型，需要使用 `unsigned long long`（Python 等自带高精度的语言就无此问题）。

同时，因为 $k^3 \le N$，所以 $\Delta\ge 0$ 恒成立，无需判断。

因为 C/C++ 的 `sqrt` 函数有精度问题（其它语言我不太清楚，不过应该多多少少都有一些精度问题吧），所以我们需要自己实现一个二分计算。

在二分 $\sqrt m$ 过程中，因为我们知道的二分上界就是 $m$，故 $\text{mid}^2$ 会达到一个 `long long * long long` 的级别，可以用 `__int128`，但是为了可移植性可以把 $\text{mid}^2 \ge m$ 转化为 $\text{mid} \ge \dfrac{m}{\text{mid}}$。

[Accepted](https://atcoder.jp/contests/abc397/submissions/63815671)。同时吐槽一下洛谷 RMJ。