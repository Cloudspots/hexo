---
title: SPOJ GCDEX2 题解
tags:
  - Number Theory
  - Solution
  - SPOJ Problem Solution
categories:
  - Solution
date: 2026-09-27 09:31:28
updated: 2026-09-27 09:31:28
published: false
---
给定 $n$，求 $G(n)=\displaystyle\sum_{1\le i<j\le n}\gcd(i,j)$，答案对 $2^{64}$ 取模。多测。

## Task $1$

$T=1,n\le 1000$。老师这题我会！暴力 $O(n^2\log n)$。

## Task $2$

$n\le 10^6$。老师这题我会！考虑 $f(n)=\displaystyle\sum_{1\le i<n}\gcd(n,i)$，考虑枚举 $\gcd(n,i)=d\mid n$，则有 $\varphi\left(\dfrac{n}{d}\right)$ 种选法。那么枚举倍数做到 $O(n\log n)$！套一个前缀和做到 $O(n\log n)$ 预处理，$O(1)$ 查询。

## Task $3$

老师这题我……

$n\le 235711131719\approx 2\times 10^{11},T\le 10^4$。

……啊？

推式子，启动！

$$\begin{aligned}\sum_{i=1}^n \sum_{j=1}^n\gcd(i,j)&=\sum_{i=1}^n \sum_{j=1}^n \sum_{d\mid i,j} d[d=\gcd(i,j)]\\&=\sum_{i=1}^n\sum_{j=1}^n\sum_{d\mid i,j}d\left[\dfrac{i}{d}\perp \dfrac{j}{d}\right]\\&=\sum_{1\le d\le n}d\sum_{1\le i, j\le \frac{n}{d}}[i\perp j]\end{aligned}$$

非常好，我们现在只需要求 $f(n)=\displaystyle\sum_{1\le i, j\le n}[i\perp j]$ 了。同时如果这个可以 $O(1)$ 算，那么套一个数论分块就可以做到 $O(\sqrt n)$ 单次询问了！

$$\begin{aligned}f(n)&=\sum_{i=1}^n\sum_{j=1}^n\sum_{d\mid i,j}\mu(d)\\&=\sum_{1\le d\le n}\mu(d)\sum_{1\le i, j\le \frac{n}{d}}1\\&=\sum_{1\le d\le n}\mu(d)\left\lfloor\dfrac{n}{d}\right\rfloor^2\end{aligned}$$

这个显然没法 $O(1)$ 做，两个根号合起来就是 $O(n)$ 的，况且 Task $2$ 用线性筛也可以做到 $O(n)$，还支持 $O(n)-O(1)$，这个只能 $O(1)-O(n)$。但是我们还有一招——代入。

$$\begin{aligned}\sum_{1\le i,j\le n}\gcd(i,j)&=\sum_{1\le d\le n}df\left(\dfrac{n}{d}\right)\\&=\sum_{1\le d\le n}d\sum_{1\le x\le \frac{n}{d}}\mu(x)\left\lfloor\dfrac{n}{dx}\right\rfloor^2\\&=\sum_{1\le xy\le n}x\mu(y)\left\lfloor\dfrac{n}{xy}\right\rfloor^2\end{aligned}$$

这个真的有救吗？？不过这个还算是比较好看的。首先右边的 $\left\lfloor\dfrac{n}{xy}\right\rfloor^2$ 看着就是数论分块。考虑对于每个 $k=xy$ 求 $g(n)=\displaystyle\sum_{d\mid k}\dfrac{k}{d}\mu(d)$。这是两个积性函数的卷积，所以还是积性的。考虑它在质数幂 $p^k$ 处的取值，$g\left(p^k\right)=p^k-p^{k-1}=p^k\left(1-\dfrac{1}{p}\right)$。这不是我们欧拉函数吗。$g(n)=\varphi(n)$。

这个时候我们发现我们推复杂了，一开始枚举 $\gcd$ 可以直接得到这个结果。不管，莫比乌斯反演就是最强的。

$$ \begin{aligned}\sum_{1\le i\le n}\varphi(i)\left\lfloor\dfrac{n}{i}\right\rfloor^2&=\end{aligned}$$
