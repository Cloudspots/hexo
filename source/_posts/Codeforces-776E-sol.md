---
title: 题解：CF776E The Holmes Children
date: 2025-7-23 18:48:55
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
**这题目前中文翻译疑似不太有素质，答案要对 $\bm{10^9+7}$ 取模**。

容易发现 $f(x)=\varphi(x)$，也就是 $[1,x]$ 中与 $x$ 互质的元素个数。

> 证明：
>
> 首先理解方括号 $[P]$。这是艾弗森括号，当 $P$ 为真时值为 $1$ 否则为 $0$。
>
> 那么 $\gcd(i,n-i)=1$ 代表什么？我们有 $\gcd(x,y)=\gcd(x,x-y)$，反用就得到了 $\gcd(i,n-i)=\gcd(i,n)$。
>
> 所以是 $\displaystyle\sum_{i=1}^{n-1} [\gcd(n,i)=1]$。
>
> 而 $n$ 和 $n$ 必定不互质（因为 $n \ge 2$，$n=1$ 是显然成立的），所以把求和上界改为 $n$ 不会导致任何问题。

容易发现 $g(n)=n$。

> 证明：
>
> $\varphi$ 积性，不证。
> 
> 一个数因子的积性函数和还是积性函数。所以 $g$ 是积性的。当 $n=p^k$ 时因子有 $1,p,p^2,\dots,p^k$，而 $\varphi(p^k)=(p-1)p^{k-1}$，$\varphi(1)=1$，求和得到 $1+(p-1)\times\dfrac{p^k-1}{p-1}=p^k$，对于质数的幂证毕，所以对于所有的 $n$ 都成立。
>
> 其实这个有很多种证法。

所以我们得到：

$$ F_k(n)=\begin{cases} \varphi(n)&k=1\\F_{k-1}(n)&k>1,k\equiv 0\pmod 2\\\varphi(F_{k-1}(n))&k>1,k\equiv 1\pmod 2\end{cases} $$

显然当 $k\equiv 1$ 的时候可以直接减去 $2$。

从而可以得到，$F_k(n)=\varphi^{\left(\left\lceil\frac{k}{2}\right\rceil\right)}(n)$，其中 $f^{(k)}(x)$ 是函数迭代记号，也就是 $f(f(f(\dots f(n)\dots)))$，共有 $k$ 层。

计算 $\varphi(n)$ 有一种简单的方法，考虑其质因子分解，假设质数为 $p_1\dots p_k$，而 $\varphi(n)=n\left(1-\dfrac{1}{p_1}\right)\left(1-\dfrac{1}{p_2}\right)\left(1-\dfrac{1}{p_3}\right)\dots \left(1-\dfrac{1}{p_k}\right)$。

> 证明：
>
> $\varphi$ 积性。然后证毕。

可以在 $\mathcal O(\sqrt{n})$ 的时间复杂度之内计算出质因子分解，所以可以在相同的时间复杂度之内计算出 $\varphi$ 函数值。

然而 $k$ 可能很大，我们的算法是 $\mathcal O(k\sqrt{n})$ 的。

但是我们发现不停求 $\varphi$ 很容易就变为 $1$ 了。这时我们发现只要判断 $n=1$ 中途退出就能过。为什么？

当 $n$ 为奇数且 $n>1$ 时，我们有 $\varphi(n)$ 为偶数。我们把求 $\varphi$ 的式子中 $1-\dfrac{1}{p_i}$ 转化为 $\dfrac{p_i-1}{p_i}$，显然一个数所有质因子的乘积是自身的因子，所以如果分母上是偶数则整个式子都是偶数。而 $p_i$ 如果为偶数则 $n$ 为偶数，矛盾。所以 $\varphi(n)$ 是偶数。

当 $n$ 为偶数时，$\varphi(n)$ 的后面一串乘积中有 $(1-\dfrac{1}{p_1})$，而 $p_1=2$，所以 $\varphi(n)\le\dfrac{n}{2}$（实际上当 $n=2^k$ 时取等）。顺便可以证明 $\varphi(n)$ 为偶数（除非 $n=2$。证法是如果 $4\mid n$ 则显然。否则 $n$ 必然有非 $2$ 质因子，仿照我们证明 $n$ 为奇数时的过程即可）。

所以显然迭代次数是 $\mathcal O(\log k)$ 级别的。这样我们就放心了。作为娱乐，我们还可以干得更精确一些，可以得到：

- 刚开始可能有一次迭代，把 $n$ 变为偶数。这个过程进行 $\le 1$ 次。
- 此后 $n$ 一直是偶数（除了最后 $2\to 1$），每次至少减半。这个过程进行 $\le \log_2 n$ 次。

最终会迭代最多 $1+\log_2 n$ 次。

```cpp
#include <cstdio>

using namespace std;

long long getphi(long long x)
{
    long long res = x;
    for(long long i=2;i*i<=x;i++)
    {
        if(x%i==0)
        {
            while(x%i==0) x/=i;
            res = res / i * (i-1);
        }
    }
    if(x != 1) res = res / x * (x-1);
    return res;
}

int main()
{
    long long n, k;
    scanf("%lld%lld", &n, &k);
    k = (k+1)/2;
    while(k-- && n != 1)
    {
        n = getphi(n);
    }
    printf("%lld\n", n % 1000000007);
    return 0;
}
```

[sub](https://codeforces.com/contest/776/submission/330498695)。