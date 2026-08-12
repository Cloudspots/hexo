---
title: 二次互反律！
tags:
  - Number Theory
  - Mathematics
categories:
  - Algorithm & Theory
date: 2026-08-11 21:38:37
updated: 2026-08-11 21:38:37
---
# 二次互反律！

## 定义

### 二次剩余与二次非剩余

定义 $a$ 为模 $p$ 的**二次剩余**当且仅当 $p\not\mid a$ 且存在 $x$ 满足 $x^2\equiv a\pmod p$，即 $a$ 可以在模 $p$ 意义下开根号。

如果 $a$ 不是模 $p$ 的二次剩余且 $p\not\mid a$，则称 $a$ 为模 $p$ 的**二次非剩余**。

为了简单，我们有时候会用 QR 代表二次剩余，NR 代表二次非剩余。

### 勒让德符号（Legendre Symbol）

我们能够注意到一个显然的事实：两个 QR 相乘必然是 QR。若模数是质数，我们还能得到 QR 乘 NR 是 NR。我们猜想模质数意义下 NR 乘 NR 是 QR，经过简单的检验是正确的，待会儿再证明。当然，无论是 NR 还是 QR，乘 $p$ 的倍数都必然还是 $p$ 的倍数。

我们考虑使用 $1$ 和 $-1$ 来代表二次剩余和二次非剩余，因为 $1$ 和 $-1$ 在乘法意义下中的性质类似于 $0$ 和 $1$ 在异或意义下的结果。

$$ \left(\dfrac{a}{p}\right)=\begin{cases}0&p\mid a\\1&a\text{ 是模 }p\text{ 的二次剩余}\\-1&a\text{ 是模 }p\text{ 的二次非剩余}\end{cases} $$

## 二次剩余乘法法则

若 $p$ 是奇质数，则有：

$$\left(\dfrac{a}{p}\right)\left(\dfrac{b}{p}\right)=\left(\dfrac{ab}{p}\right)$$

### 引理：二次剩余个数

注意到若 $p$ 是奇质数，$a$ 不是 $p$ 的倍数，那么关于 $x$ 的方程 $x^2\equiv a\pmod p$ 的解的个数在 $[0,2]$ 中。如果 $x$ 是一个解，则 $-x$ 必然也是。但是 $x\not\equiv 0\pmod p$，并且 $x-(-x)=2x\not\equiv 0\pmod p$（$p$ 是奇质数），所以 $x\not\equiv -x\pmod p$。所以不可能恰好一个解，必然要么无解要么有两个不同解。

而一共有 $p-1$ 个非零的 $x$，也就必然有 $\dfrac{p-1}{2}$ 个 $a$ 是二次剩余。也就必然有 $\dfrac{p-1}{2}$ 个 $a$ 不是二次剩余。

### 二次剩余乘法法则证明

对于 $p\mid a$ 或 $p\mid b$ 的情况是显然的。若 $a,b$ 都是 QR 也是显然的。

若 $a$ 是 QR，$b$ 是 NR 那么也很显然。如果 $ab$ 是 QR，假设 $a\equiv x^2\pmod p,ab\equiv y^2\pmod p$，则必然有 $b\equiv (yx^{-1})^2\pmod p$，矛盾。

若 $a,b$ 都是 NR，考虑模 $p$ 的简化剩余系 $\{a,2a,3a,\dots,(p-1)a\}$。这其中有 $\dfrac{p-1}{2}$ 个 QR 和 $\dfrac{p-1}{2}$ 个 NR。然而我们证明了 QR 乘 NR 得 NR，所以所有 $\dfrac{p-1}{2}$ 个 QR 乘 $a$ 已经得到了 $\dfrac{p-1}{2}$ 个 NR，剩下的 NR 乘 $a$ 必然都是 QR。而 $b$ 是 NR，所以 $ab$ 是 QR。$\square$

## 欧拉准则（Euler's Criterion）

我们考虑能不能有一个通用的方法直接算出勒让德符号，至少是在模奇质数意义下。

注意到费马小定理 $a^{p-1}\equiv 1\pmod p$（$p$ 是奇质数）。若 $a$ 是 QR，$a\equiv b^2\pmod p$，则必然有 $a^{\frac{p-1}{2}}\equiv b^{p-1}\equiv 1\pmod p$。这非常好啊，并且同时……

《具体数学》里面有一种有趣的多项式推理法。它是在证明若 $k$ 是非负整数，则 $k\dbinom{r}{k}=r\dbinom{r-1}{k-1}$，$r$ 是任意实数。首先书中证明了 $r$ 是所有正整数的时候都成立，要推广到所有实数，只需要观察到左右两边都是关于 $r$ 的次数固定的多项式。那么只要它们在足够多的点处相同就能证明处处相等。

而在模算术下，我们有拉格朗日定理：模质数意义下，关于 $x$ 的 $k$ 次非零多项式至多有 $k$ 个根。

而 $x^{\frac{p-1}{2}}\equiv 1\pmod p$ 本身就是一个 $\dfrac{p-1}{2}$ 次方程。我们已经找到了 $\dfrac{p-1}{2}$ 个解（所有 QR），所以所有 NR 都不是解！！

同时我们注意到若 $p\not\mid a$，则必然有 $a^{p-1}\equiv 1\pmod p$，也就是 $\left(a^{\frac{p-1}{2}}\right)^2\equiv 1\pmod p$。换句话说 $a^{\frac{p-1}{2}}\equiv \pm 1\pmod p$。如果 $a$ 是 NR，那么一定有 $a^{\frac{p-1}{2}}\equiv -1\pmod p$！

更完美的是我们发现 $p\mid a$ 的时候 $a^{\frac{p-1}{2}}\equiv 0\pmod p$！

我们就造出了欧拉准则：

$$ \left(\dfrac{a}{p}\right)\equiv a^{\frac{p-1}{2}}\pmod p$$

然后我们能顺便发现上面的乘法法则其实就是欧拉准则的直接推论。

另外这个式子可以 $O(\log p)$ 算。但我们还准备更进一步！

## $\left(\dfrac{-1}{p}\right)$ 与 $\left(\dfrac{2}{p}\right)$？

### $-1$

$(-1)^{\frac{p-1}{2}}$ 是很容易算的。如果 $p\equiv 1\pmod 4$，那么这个就是 $1$，否则就是 $-1$。

换句话说，若 $p$ 是模 $4$ 余 $1$ 的奇质数，那么 $-1$ 就是 QR，否则就是 NR。

欧拉准则还是太权威了。

### $2$

不对，欧拉准则也太没用了吧。对于 $2$ 都不能直接得出一个结论？？还不如写个程序找规律。

```python
In [5]: for i in range(1,200,2):
   ...:     if is_prime(i):
   ...:         print(f'{"1" if pow(2,(i-1)//2,i) == 1 else "-1"}', end=' ')
   ...:     else:
   ...:         print('!', end=' ')
   ...: 
! -1 -1 1 ! -1 -1 ! 1 -1 ! 1 ! ! -1 1 ! ! -1 ! 1 -1 ! 1 ! ! -1 ! ! -1 -1 ! ! -1 ! 1 1 ! ! 1 ! -1 ! ! 1 ! ! ! 1 ! -1 1 ! -1 -1 ! 1 ! ! ! ! ! ! 1 ! -1 ! ! 1 -1 ! ! ! ! -1 1 ! ! -1 ! ! -1 ! 1 ! ! -1 ! ! -1 -1 ! ! ! ! 1 1 ! -1 1 
```

稍微脑补一下就可以得到下面的规律：$1\ -1\ -1\ 1\ 1\ -1\ -1\ 1\ 1\ -1\ -1\ 1\ \dots$。其中任何数字都可能被替换为 $\texttt !$。当然这不意味着模 $4$，因为我们跳的步长是 $2$，这个的意思是模 $8$。

猜想：若 $p$ 是奇质数，则有：

$$ \left(\dfrac{2}{p}\right)=\begin{cases}1&p\equiv 1\pmod 8\lor p\equiv 7\pmod 8\\-1&p\equiv 3\pmod 8\lor p\equiv 5\pmod 8\end{cases} $$

不是这个咋证啊？如果用欧拉准则的话，$2^{\frac{p-1}{2}}\bmod p$ 咋算啊？ 

好的，《数论概论》（A Friendly Introduction to Number Theory）的作者 Joseph H. Silverman 的注意力发力了。

我们先看 $p=13$ 怎么算，作为一个例子。当然，我们知道这个是 NR。

我们考察 $\displaystyle\prod_{i=1}^{\frac{p-1}{2}} 2i$，也就是 $2\times 4\times 6\times 8\times 10\times 12$。当然，我们知道这个就是 $2^6\times 6!$。我们考虑模 $13$，得到：

$$ \begin{aligned}2\times 4\times 6\times 8\times 10\times 12&\equiv 2\times 4\times 6\times (-5)\times (-3)\times (-1)\\&\equiv (-1)^3\times 6!\\&\equiv -6! \end{aligned}$$

所以 $2^6\equiv -1\pmod 13$。不是哥们，这么牛的？

我们只需要考察 $\displaystyle\prod_{i=1}^{\frac{p-1}{2}} 2i$ 到底是多少个 $-1$ 乘 $\dfrac{p-1}{2}!$。

注意到所有 $<\dfrac{p}{2}$ 的符号都为正，提供了 $\dfrac{p-1}{2}!$ 中的偶数项。$>\dfrac{p}{2}$ 的都为负，提供了奇数项（$\dfrac{p}{2}\not\in \Z$）。所以我们只需要求 $\left[\dfrac{p}{2},p-1\right]$ 中有多少个偶数。换句话说，$\left[\dfrac{p}{4},\dfrac{p-1}{2}\right]$ 中有多少个整数。我们能知道这是 $\dfrac{p-1}{2}-\left\lceil\dfrac{p}{4}\right\rceil+1$ 个。对于 $p\bmod 8$ 分类讨论即可证明上述结论。$\square$

## 二次互反律

### 互反

二次互反律一定要互反！我们考虑 $\left(\dfrac{p}{q}\right)$ 和 $\left(\dfrac{p}{q}\right)$ 之间的关系。

我们考虑 $p,q$ 是奇质数的时候 $\left(\dfrac{p}{q}\right)\left(\dfrac{p}{q}\right)$ 的值。T 代表 Trivial，即 $1$。

| $p\backslash q$ | $3$ | $5$ | $7$ | $11$ | $13$ | $17$ | $19$ | $23$ | $29$ | $31$ | $37$ |
|:---------------:|:---:|:---:|:---:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
| $3$ | T | $1$ | $-1$ | $-1$ | $1$ | $1$ | $-1$ | $-1$ | $1$ | $-1$ | $1$ |
| $5$ | $1$ | T | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ |
| $7$ | $-1$ | $1$ | T | $-1$ | $1$ | $1$ | $-1$ | $-1$ | $1$ | $-1$ | $1$ |
| $11$ | $-1$ | $1$ | $-1$ | T | $1$ | $1$ | $-1$ | $-1$ | $1$ | $-1$ | $1$ |
| $13$ | $1$ | $1$ | $1$ | $1$ | T | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ |
| $17$ | $1$ | $1$ | $1$ | $1$ | $1$ | T | $1$ | $1$ | $1$ | $1$ | $1$ |
| $19$ | $-1$ | $1$ | $-1$ | $-1$ | $1$ | $1$ | T | $-1$ | $1$ | $-1$ | $1$ |
| $23$ | $-1$ | $1$ | $-1$ | $-1$ | $1$ | $1$ | $-1$ | T | $1$ | $-1$ | $1$ |
| $29$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | T | $1$ | $1$ |
| $31$ | $-1$ | $1$ | $-1$ | $-1$ | $1$ | $1$ | $-1$ | $-1$ | $1$ | T | $1$ |
| $37$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | T |

我们注意到有一些行和列非常善良，没有 $-1$。进一步地我们发现若一个格子不在全 $1$ 的行中也不在全 $1$ 的列中，那么它就是 $-1$。

取出所有全 $1$ 的列。$5,13,17,29,37,\dots$。这是模 $4$ 余 $1$ 的奇质数！剩下的都是模 $4$ 余 $3$ 的。

诶这个就很正义了。但是它为什么是对的？先别急，待会儿再说。我们先把现在的二次互反律的各个部分综合一下，并看看能不能得到更一般的东西。

哦对了，高斯在十九岁的时候就独立发现了二次互反律，一生中给出了 $7$ 种证明，你也来试试吧。

### 二次互反律（完全体）

$p,q$ 是不同的奇质数，则：

$$\begin{array}{ll}\left(\dfrac{-1}{p}\right)&=\begin{cases}1&p\equiv 1\pmod 4\\-1&p\equiv 3\pmod 4\end{cases}\\\left(\dfrac{2}{p}\right)&=\begin{cases}1&p\equiv 1\pmod 8\lor p\equiv 7\pmod 8\\-1&p\equiv 3\pmod 8\lor p\equiv 5\pmod 8\end{cases}\\\left(\dfrac{q}{p}\right)&=\begin{cases}\left(\dfrac{p}{q}\right)&p\equiv 1\pmod 4\land q\equiv 1\pmod 4\\-\left(\dfrac{p}{q}\right)&p\equiv 3\pmod 4\land q\equiv 3\pmod 4\end{cases}\end{array}$$

这样我们得到了一种不用人肉快速幂来坐牢的，人工计算勒让德符号 $\left(\dfrac{a}{p}\right)$ 的方法，要求 $p$ 是奇质数：

- 将 $a$ 分解质因数，两个相同的质因子全部消掉。换句话说一个质因子如果有偶数个则不保留，奇数个则保留一个。假设 $a$ 分解为 $p_1,p_2,\dots,p_k$。
- 有 $\left(\dfrac{a}{p}\right)=\prod \left(\dfrac{p_i}{p}\right)$。
- 如果不小心 $p_i>p$ 了，则转而计算 $\left(\dfrac{p\bmod p_i}{p_i}\right)$，递归计算。

## 雅克比符号

我们现在先考虑一下模数不是奇质数的情况。

定义雅克比符号（Jacobi Symbol）：$\left(\dbinom{a}{b}\right)=\displaystyle\prod \left(\dfrac{a}{p_i}\right)$，其中 $p_i$ 是 $b$ 的质因数分解中所有指数为奇数的质因子。$\left(\dbinom{a}{1}\right)=1$，因为 $0$ 个数字相乘是 $1$。

注意若 $\left(\dbinom{a}{b}\right)$ 是 $-1$ 则显然 $a$ 必然不是模 $b$ 的 QR。反之则不一定。

### 广义二次互反律

Reinforce！

代入一下定义就可以得到原本关于勒让德符号的二次互反律套用到雅克比符号上也是完全成立的。

$a,b$ 是正奇数，则：

$$\begin{array}{ll}\left(\dfrac{-1}{a}\right)&=\begin{cases}1&a\equiv 1\pmod 4\\-1&a\equiv 3\pmod 4\end{cases}\\\left(\dfrac{2}{a}\right)&=\begin{cases}1&a\equiv 1\pmod 8\lor a\equiv 7\pmod 8\\-1&a\equiv 3\pmod 8\lor a\equiv 5\pmod 8\end{cases}\\\left(\dfrac{b}{a}\right)&=\begin{cases}\left(\dfrac{a}{b}\right)&a\equiv 1\pmod 4\land b\equiv 1\pmod 4\\-\left(\dfrac{a}{b}\right)&a\equiv 3\pmod 4\land b\equiv 3\pmod 4\end{cases}\end{array}$$

同时，乘法法则也是成立的。

我们就得到了更强的，不用质因子分解的方法：

【这个我没完全搞懂，我的理解和树上的不太一样……有时间补一下】

## 二次互反律（完全体）证明

我们使用艾森斯坦的证法。首先证明一个引理：高斯准则。

### 高斯准则

考虑 $\left(\dfrac{a}{p}\right)$。我们设 $P=\frac{p-1}{2}$。将 $\{a,2a,3a,\dots,Pa\}$ 模 $p$ 并简化到 $[-P,P]$ 之间。容易证明，这样简化之后每个正的绝对值都会出现恰好一次（即我们会得到 $\{\pm 1,\pm 2,\pm 3,\dots,\pm P\}$，其中每个 $\pm$ 相互独立且表示”正和负恰好出现一个“。

设 $\mu(a,p)$ 为上面的集合模 $p$ 简化之后负数的个数。

高斯准则：$\left(\dfrac{a}{p}\right)=(-1)^{\mu(a,p)}$。

这个是 $\left(\dfrac{2}{p}\right)$ 的情况的推广，正确性非常显然。

然后我们需要证明一个关键的结论，这个式子的左边想必 OIer 们都非常熟悉，是经典的类欧几里得算法或万能欧几里得算法：

### 引理

$$\sum_{1\le k\le P} \left\lfloor\dfrac{ka}{p}\right\rfloor\equiv \mu(a,p)\pmod 2$$

证明：我们考虑将 $ka$ 表示为 $ka=q_kp+r_k$，其中 $r_k\in [-P,P]$。

两边除 $p$ 得到 $\dfrac{ka}{p}=q_k+\dfrac{r_k}{p}$，同时下取整（《数论概论》中翻译为地板函数 xd）得到 $\left\lfloor\dfrac{ka}{p}\right\rfloor=q_k-[r_k<0]$。所以：

$$\sum_{1\le k\le P} \left\lfloor\dfrac{ka}{p}\right\rfloor = \sum_{1\le k\le P}q_k-\mu(a,p)$$

然后我们只需要考察 $\sum q\bmod 2$ 即可。我们注意到由于 $a\equiv p\equiv 1\pmod 2$，因为 $ka=q_kp+r_k$，所以 $k\equiv q_k+r_k\pmod 2$。求和得到：

$$\sum_{1\le k\le P}k\equiv \sum q + \sum r\pmod 2$$

同时我们注意到 $r$ 是上面说的 $\{\pm 1,\pm 2,\pm 3,\dots,\pm P\}$，所以 $\sum q\equiv 0\pmod 2$，代回去就证毕了。$\square$

### 二次互反律证明

当然我们只需要证明互反的部分。

我们需要证明高斯二次互反律：

$$ \left(\dfrac{p}{q}\right)\left(\dfrac{q}{p}\right)\equiv (-1)^{\frac{p-1}{2}\cdot \frac{q-1}{2}} $$

显然根据这个可以得到原二次互反律。

换句话说，我们要证明 $\mu(q,p)+\mu(p,q)\equiv \dfrac{p-1}{2}\cdot \dfrac{q-1}{2}\pmod 2$。

我们考察一个长方形，两个顶点为 $P(0,0)$ 和 $Q\left(\dfrac{p}{2},\dfrac{q}{2}\right)$。将其按照对角线 $PQ$ 切割。右下部分（直角为 $\left(\dfrac{p}{2},0\right)$）的横纵坐标均非零的整点个数为 $\displaystyle\sum_{1\le k\le \frac{p}{2}} \left\lfloor\dfrac{qk}{p}\right\rfloor$。注意这个就是 $\mu(q,p)$（模 $2$）。同理，左上部分的横纵坐标非零整点个数就是 $\displaystyle\sum_{1\le k\le \frac{q}{2}}\left\lfloor\dfrac{pk}{q}\right\rfloor$，也就是 $\mu(p,q)$。注意到对角线上的整点只有 $(0,0)$，没有也不应该被数进去。

我们这样计算出长方形内横纵坐标均非零的整点个数的奇偶性和 $\mu(p,q)+\mu(q,p)$ 相同。同时，显然这个个数是 $\dfrac{p-1}{2}\cdot \dfrac{q-1}{2}$。

证毕。我们完成了高斯 $19$ 岁时独立完成的事情。

## 关于 OI 中计算二次剩余

我要告诉你们，哈哈，二次互反律批用没有！！

讲真二次互反律在 OI 中应该是没什么用的。你就算要判断是否是二次剩余应该也是直接用欧拉准则算，时间复杂度 $O(\log p)$。你甚至可以光速幂优化，做到预处理 $O(\sqrt p)$，查询 $O(1)$。

至于 Cipolla 算法……我不会！等我先学学。

## 参考文献

- 《数论概论》（A Friendly Introduction to Number Theory）by Joseph H. Silverman。
- 《数论：概念和问题》（Number Theory: Concepts and Problems）by Titu Andreescu, Gabriel Dospinescu, Oleg Mushkarov。罗炜好牛。
- OI-wiki by Lots of helpful OIers!! orz.
