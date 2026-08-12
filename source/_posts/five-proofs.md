---
title: 五个定理的证明
tags:
  - Mathematics
  - Number Theory
  - Probability
categories:
  - Mathematics
date: 2026-08-04 20:54:26
updated: 2026-08-04 20:54:26
---
# 五个定理的证明

这些题目是从哪来的呢，好难猜啊。

## 整除分块时间复杂度

难度：$0.01/5$。

形式化地，我们要证明 $\left\{\left\lfloor\dfrac{n}{k}\right\rfloor\middle|k\in [1,n]\cap \Z\right\}=\Theta(\sqrt n)$。

> 太简单了！分讨。

对于 $k\le \sqrt n$ 的情况，显然只有 $\lfloor\sqrt n\rfloor$ 种，对于 $k>\sqrt n$ 的情况，由于 $1\le \left\lfloor\dfrac{n}{k}\right\rfloor<\left\lfloor\dfrac{n}{\sqrt n}\right\rfloor=\lfloor\sqrt n\rfloor$，所以最多只有 $\sqrt n-1$ 中。所以 $\Omega(\sqrt n)=\lfloor\sqrt n\rfloor\le \left\{\left\lfloor\dfrac{n}{k}\right\rfloor\middle|k\in [1,n]\cap \Z\right\}\le 2\sqrt n - 1=O(\sqrt n)$。

## 正整数集和为 $n$ 则大小为根号级别

难度：$0.01/5$。

形式化地，我们要证明 $S\subseteq \N^+,\sum S=n\Rightarrow \lvert S\rvert=O(\sqrt n)$。

更一般地，右边的 $O(\sqrt n)$ 可以写成 $\sqrt{2n}$。

> 太简单了！一句话题解：考虑 $\{1,2,3,\dots\}$ 最多能写几项。不过为了严谨，我们需要……

设 $f(n)=\max\limits_{S\sebseteq \N^+,\sum S=n}\lvert S\rvert$。显然，$f$ 单调不降（我们将上一个 $f(n)$ 的最大集合的 $\max$ 增加 $1$ 就可以得到 $f(n+1)$ 的一个可能解）。

我们归纳证明所有 $f(n)$ 的最优解中都有一个解满足 $T\backslash \max T=[1,\lvert T\rvert-1]\cap \Z$。显然 $n=1$ 满足。

，假设 $S_n$ 是 $f(n)$ 的最优解。如果 $f(n)=f(n-1)$，那么显然我们把 $S_{n-1}$ 的最优解抄过来然后把 $\max$ 增加 $1$ 就可以得到一个等价的解，满足条件；否则，如果它不形如 $[1,f(n)]\cap \Z$，则一定会 $\exist k\ge 1,k\not\in S_n,k+1\in S_n$，此时把 $k+1$ 减少 $1$ 就得到了 $f(n-1)$ 的一组解，项数不变，所以 $f(n)=f(n-1)$，矛盾。所以一定形如 $[1,f(n)]\cap \Z$，满足条件。

所以有 $f(n)=f(n-\max S_n)+1$。对于 $f(n-\max S_n)$，其构造一定形如 $[1,k]\cap \Z$，必然不多于 $\sqrt{2n}-1$。所以 $f(n)\le \sqrt{2n}$，证毕。$\square$

## 生日悖论

难度：$2/5$。

我们要证明：每次从 $[1,n]\cap \Z$ 中随机选择数字，第一次出现重复的期望次数是 $O(n)$ 的。

设 $f(n,k)$ 为从 $1\dots n$ 中选择 $k$ 个正整数，选到的正整数互不相同的概率。显然 $f(n,k)=\dfrac{n!}{n^k(n-k)!}$。考虑 $P(n,k)$ 为第一次出现重复是在第 $k$ 步的概率，容易发现 $P(n,k)=f(n,k-1)\dfrac{k-1}{n}=\dfrac{(n-1)!(k-1)}{n^k(n-k)!}$。我们要求的是 $\displaystyle\sum_k kP(n,k)$。

待补。

## 一维随机游走

难度：$1/5$。入门级的堆板子。没什么很牛的观察/trick。只有最后一步斯特林公式有点难度，可能没见过。

证明：从数轴原点出发，每次随机往一个方向走一步，$n$ 步后离原点的期望距离是 $Theta(\sqrt n)$。

证：考虑到 $n$ 步之后如果在点 $k$，首先要 $n\equiv k\pmod 2$。然后你发现你有 $\dfrac{n+k}{2}$ 步向右，$\dfrac{n-k}{2}$ 步向左，也就是概率为 $\dfrac{\dbinom{n}{\frac{n+k}{2}}}{2^n}$。

也就是说我们要求：

$$\dfrac{\displaystyle\sum_{\substack{-n\le k\le n\\k\equiv n\pmod 2}}\lvert k\rvert \dbinom{n}{\frac{n+k}{2}}}{2^n}$$

显然只需要考虑 $k>0$。注意到我们可以枚举 $p=\dfrac{n+k}{2}$，满足范围 $\dfrac{n}{2}\le p\le n$。此时 $k=2p-n$。

$$\sum_{\frac{n}{2}\le p\le n}2p\dbinom{n}{p}-n\dbinom{n}{p}$$

这个东西是 trivial 的，以防你没见过这个 trick：注意到 $p\dbinom{n}{p}=\dfrac{n!}{(p-1)!(n-p)!}=n\dfrac{(n-1)!}{(p-1)!(n-p)!}=n\dbinom{n-1}{p-1}$。所以这个就是：

$$n\sum_{\frac{n}{2}\le p\le n}2\dbinom{n-1}{p-1}-\dbinom{n}{p}$$

你注意到 $\dbinom{n-1}{p-1}=\dbinom{n-1}{n-p},\dbinom{n}{p}=\dbinom{n}{n-p}$。而 $\dbinom{n-1}{n-p}+\dbinom{n-1}{n-p}-\dbinom{n-1}{n-p}-\dbinom{n-1}{n-p-1}=\dbinom{n-1}{n-p}-\dbinom{n-1}{n-p-1}$。这不是个差分吗！然后发现这个大概就是 $n\dbinom{n}{\lfloor\frac{n}{2}\rfloor}$（记得乘上前面的 $n$）。

（虽然你会发现上面的推导极不严谨，但是它在 $n$ 是偶数的时候 **完 全 胜 利**。令人惊讶的是，一个 $2$ 的系数前面省略了，后面也省略了，然后抵消了成功得到正确答案。考虑到 $2n$ 和 $2n+1$ 答案相同，我们只考虑偶数。）

这个 $\dfrac{n\dbinom{n}{\lfloor\frac{n}{2}\rfloor}}{2^n}$ 大概是多少？

由斯特林公式（$\lim_{n\to +\infty}\dfrac{\sqrt{2\pi n}\left(\dfrac{n}{e}\right)^n}{n!}=1$）可得，$\dfrac{n}{\frac{n}{2}}=\dfrac{n!}{\left(\frac{n}{2}\right)!^2}\sim \dfrac{2^{n+0.5}}{\sqrt{\pi n}}$。带回原式得到 $\dfrac{n\dbinom{n}{\lfloor\frac{n}{2}\rfloor}}{2^n}\sim \sqrt{\dfrac{2n}{\pi}}=\Theta(\sqrt n)$。$\square$
