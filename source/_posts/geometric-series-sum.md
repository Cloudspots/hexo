---
title: 等比数列求和公式的 +∞ 种理解方式
date: 2024-12-19 13:04:54
categories:
  - K12 Study
tags: []
---
# $\#0.$ 任务简述

求 $\displaystyle\sum_{i=0}^{n-1}q^i$。

# $\#1.$ 方程法

设原式为 $S$，则 $qS = \displaystyle\sum_{i=1}^n q^i$，$qS-S=(q-1)S=q^n-q^0$，$S=\dfrac{q^n-1}{q-1}$。

这样我们就得到了等比数列求和公式。

# $\#10.$ 进制法

我们先来研究 $q=10$ 时。

显然，答案为 $\overline{\underbrace{111 \dots 1}_{n \text{ 个 }1}}$。

但是我们发现这个还是难以表示，但是我们知道 $\overline {\underbrace{999 \dots 9}_{n \text{ 个 }9}}$ 是 $10^n-1$，那么原式就是 $\dfrac{10^n-1}{9}$。

我们尝试研究 $q$ 为任何数字时的求和。

显然，答案是 $\left(\overline{\underbrace{111 \dots 1}_{n \text{ 个 }1}}\right)_q$，也就是 $q$ 进制下的 $\overline{\underbrace{111 \dots 1}_{n \text{ 个 }1}}$。

那么，考虑到 $\left(\overline{\underbrace{(q-1)(q-1)(q-1) \dots (q-1)}_{n \text{ 个 }(q-1)}}\right)_q = q^n-1$，所以原式等于 $\dfrac{q^n-1}{q-1}$。

# $\#11.$ 多项式法

我们把原式显然地转换一下：

$$ S(x)=\sum_{i=0}^{n-1} x^i$$

则我们要求的显然就是 $S(q)$。

> 小 $\lfloor$ 啊，你这也没用啊？

> 别急。

我们这里在列竖式的时候用 $a_n\,a_{n-1}\,a_{n-2}\,\dots\,a_0$ 来表示一个多项式 $\displaystyle\sum_{i=0}^n a_ix^i$。

那么 $S(x) = \underbrace{1\,1\,1\,\dots\,1}_{n \text{ 个 } 1}$。

那么，如果我们能够使用两个好求（这里指非 $0$ 系数的个数为 $O(1)$）的多项式的和/差/积/商来表示这个多项式，岂不美哉！

- 和：不行，因为 $O(1)+O(1)=O(1)$。
- 差：同上，不行。
- 积：一通捣鼓后，不大行。
- 商：qwq。

我们考虑使用两个好求值的多项式的商来表示这个多项式，我们可以使用**抵消**的思想。

那么，我们要让多项式的大部分项和自己抵消，就可以把它左移一位，然后再减去自己。

相应地，我们构造多项式 $x-1$，把这个多项式乘 $S$ 可以得到：

$$ \begin{array}{c c c c c}&1&1&1&\dots&1&1&1\\
\times&&&&&&1&-1\\
\hline &-1&-1&-1&\dots&-1&-1&-1\\
1&1&1&1&\dots&1&1\\
\hline 1&0&0&0&\dots&0&0&-1
\end{array} $$

所以最终，$S(x) \times (x-1)=x^n-1$，也就是 $S(x)=\dfrac{x^n-1}{x-1}$。

# $\#100\sim +\infty.$ 还是多项式法

我们同样使用**抵消**的思想，但是考虑换一个多项式。

考虑多项式 $x^2-1$？

列竖式（过程不写）之后，发现：

$$ \begin{aligned}S(x)&=\dfrac{x^{n+1}+x^n-x-1}{x^2-1}\\
&=\dfrac{x^n(x+1)-(x+1)}{(x-1)(x+1)}\\
&=\dfrac{x^n-1}{x-1}\end{aligned} $$

考虑多项式 $x^{\psi}-1$，名字是乱起的。

列奇奇怪怪的竖式之后，发现：

$$ 
\begin{aligned}S(x)&=\dfrac{\displaystyle\sum_{i=n}^{n+\psi-1}x^i-\sum_{i=0}^{\psi-1}x^i}{x^\psi - 1}\\
&=\dfrac{(x^n-1)\displaystyle\sum_{i=0}^{\psi-1}x^i}{x^{\psi}-1}\\
&=\dfrac{(x^n-1) \times \frac{x^\psi-1}{x-1}}{x^{\psi}-1}&(\text{由等比数列求和公式})\\
&=\dfrac{x^n-1}{x-1}\end{aligned}
$$

这样我们就得到了无穷多种等比数列求和公式的推导方法了。