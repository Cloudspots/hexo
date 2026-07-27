---
title: 题解：P10596 BZOJ2839 集合计数
date: 2026-6-13 11:05:31
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
# 题解：P10596 BZOJ2839 集合计数

我的笔记没有人类可以看懂，所以在这里整理一下。

## 方法 $1$（二项式反演）

我们先不妨钦定交集是 $[1,k]\cap \N$，即 $\{1,2,3,\dots,k\}$。

然后我们发现在 $2^n$ 个子集中，有 $2^{n-k}$ 个子集可以选。我们不能都不选，所以一共有 $2^{2^{n-k}}-1$ 种选法。

所以我们就得到了式子 $\dbinom{n}{k}(2^{2^{n-k}}-1)$，前面的 $\dbinom{n}{k}$ 是因为实际上并出来的可以是任意大小为 $k$ 的集合，一共有 $\dbinom{n}{k}$ 个这样的集合。

这个显然不对。这个只能保证并出来的是 $[1,k]\cap \N$ 的超集，比如可能并出来 $[1,k+1]\cap \N$。

但是这个给了我们启发。做有些题目的时候也是限定某个值 $=k$，我们不小心求出了 $\ge k$，此时直接用 $\ge k$ 的减掉 $\ge k+1$ 的即可。

我们设 $g(k)=\dbinom{n}{k}(2^{2^{n-k}}-1)$，所以答案是 $g(k)-g(k+1)$？

还是不对。

究其原因是因为，我们减掉的不够多。比如我们并出了一个 $[1,k+1]\cap \N$，此时它会在 $g(k)$ 的计算中被重复计算 $k+1$ 次（分别是 $([1,k+1]\cap N)\backslash \{1\},([1,k+1]\cap N)\backslash \{2\},([1,k+1]\cap N)\backslash \{3\},\dots,([1,k+1]\cap N)\backslash \{k+1\}$（也就是 $[1,k+1]\cap N$ 分别去掉 $1,2,3,\dots,k+1$ 的结果）。但是我们只减掉了一次。

那正确的式子应该是 $g(k)-(k+1)g(k+1)$？

也不对。如果我们并出了 $[1,k+2]\cap N$，它就会在 $g(k)$ 中被计算 $\dbinom{k+2}{k}$ 次，在 $g(k+1)$ 中计算 $\dbinom{k+2}{k+1}$ 次，总共计算了 $\dbinom{k+2}{k}-(k+1)\dbinom{k+2}{k+1}=\dfrac{(k+2)(k+1)}{2}-(k+1)(k+2)=-\dfrac{(k+2)(k+1)}{2}$ 次。也就是说，我们减多了……

一个容易想到的解决方案是加上 $\dbinom{k+2}{k}g(k+2)$，但是你猜都猜得到这样还是错的。

但是，你观察这个式子 $g(k)-\dbinom{k+1}{k}g(k+1)+\dbinom{k+2}{k}g(k+2)$，稍微看一眼就能猜出来这个写完应该是 $\displaystyle\sum_{k\le i\le n}(-1)^{i-k}\dbinom{i}{k}g(i)$。

证明？

你考虑这个 $g$ 到底是什么东西。设 $f(i)$ 为 $k=i$ 的答案。那么每个 $f(i)$（$i\ge k$）都会在 $g(k)$ 中被计算 $\dbinom{i}{k}$ 次。

由于 $f$ 不会有重复，所以 $g(k)=\displaystyle\sum_{k\le i\le n}\dbinom{i}{k}f(i)$。

既然有了式子我们就直接证，看起来就非常容易。代入进去。

$$\begin{aligned}g(k)&=\sum_{k\le i\le n}\dbinom{i}{k}f(i)\\&=\sum_{k\le i\le n}\dbinom{i}{k}\sum_{i\le j\le n}(-1)^{j-i}\dbinom{j}{i}g(j)\\&=\sum_{k\le i\le j\le n}(-1)^{j-i}\dbinom{i}{k}\dbinom{j}{i}g(j)\\&=\sum_{k\le j\le n}\dbinom{j}{k}g(j)\sum_{k\le i\le j}(-1)^{j-i}\dbinom{j-k}{i-k}\end{aligned}\tag{0}$$

我们看看这个 $\displaystyle\sum_{k\le i\le j}(-1)^{j-i}\dbinom{j-k}{i-k}$ 是啥哦。

这个长得就很像二项式定理，并且我们希望这个是 $[j=k]$。感性的理解方式是，尽管 $0^0$ 无定义，但是绝大多数情况下 $0^0=1$ 是最好的。并且这个还可以当判别式用，$0^k=[k=0]$。实际上，$\displaystyle\sum_{i=0}^k (-1)^i\dbinom{k}{i}=[k=0]$（当 $k>0$ 时使用二项式定理得到 $0$，当 $k=0$ 时直接算得到 $1$）。所以我们希望我们能最终变成 $0^{j-k}$ 类似物。

那 $0^{j-k}=(1+(-1))^{j-k}=\displaystyle\sum_{i=0}^{j-k}(-1)^i\dbinom{j-k}{i}$。我们发现一个换元就基本上搞定了！

$$\begin{aligned}\sum_{i=k}^j (-1)^{j-i}\dbinom{j-k}{i-k}&=\sum_{i=k}^j(-1)^{(j-k)-(i-k)}\dbinom{j-k}{i-k}\\&=(-1)^{j-k}\sum_{i=0}^{j-k}(-1)^i\dbinom{j-k}{i}\\&=(-1)^{j-k}[j=k]\\&=[j=k]\end{aligned}$$

代入 $(0)$ 得到 $g(k)=\displaystyle\sum_{k\le j\le n}\dbinom{i}{k}g(j) [j=k]=g(k)$，符合定义！

综上我们证明了 $f(k)=\displaystyle\sum_{k\le i\le n}(-1)^{i-k}\dbinom{n}{i}g(i)$。

> 对于追求严谨的读者，可能会有疑问为什么 $f$ 不会有其它解，毕竟这可以看成一个 $n$ 元一次方程组。
>
> 这个你只需要证明它的系数矩阵是可逆的。一方面，你可以直接根据 $f$ 得到它的逆矩阵，直接做完了。另一方面，写出原矩阵，发现是下三角矩阵，然后主对角线上没有 $0$，行列式非零，做完了。再一方面，在系数矩阵固定的情况下无论是什么 $g$ 都可以得到解，所以一定是非奇异的。三种方法。
>
> 当然如果有不用矩阵的方法欢迎提出！

直接算就做完了，时间复杂度 $O(n)$。如果用快速幂实现会多一个 $\log$。

## 方法 $2$（广义容斥）

我们不妨还是设 $f(k)$ 为答案，而 $g(S)$ 为选取的集合的交集恰好为 $S$ 的方案数。

容易发现 $f(k)=\displaystyle\sum_{\lvert S\rvert=k}g(S)$。或者，$f(k)=\dbinom{n}{k}g([1,k]\cap \N)$。

容易写出一个错误的式子，$g(S)=2^{2^{n-\lvert S\rvert}}-1$。究其原因是计算了交集为 $S$ 的超集的选取方式。

我们设 $h(S)=2^{2^{n-\lvert S\rvert}}-1$。为了方便，我们同时设 $h(k)=2^{2^{n-k}}-1$，其中 $k$ 是一个数字。容易发现 $h(S)=h(\lvert S\rvert)$。

那么我们发现 $h(S)=\displaystyle\sum_{T\supseteq S}g(T)$。

这个看起来非常好做，我们考虑广义容斥，直接得到 $g(S)=\displaystyle\sum_{T\supseteq S}(-1)^{\lvert T\rvert - \lvert S\rvert} h(T)$。

这个怎么算？

还是容易发现大小相同的集合的 $h$ 相同，所以枚举大小。就有 $g(S)=\displaystyle\sum_{i\ge\lvert S\rvert}(-1)^{i - \lvert S\rvert}\dbinom{n-\lvert S\rvert}{i-\lvert S\rvert}h(i)$。

这个东西可以 $O(n)$ 算（如果用快速幂实现会多一个 $\log$），乘 $\dbinom{n}{\lvert S\rvert}$ 即得答案，做完了。

## 二项式反演的其它形式

我们证明了：

$$f(k)=\sum_{i\ge k}\dbinom{i}{k}g(i)\iff g(k)=\sum_{i\ge k}(-1)^{i-k}\dbinom{i}{k}f(i)\tag{1}$$

虽然非常美观，但是下面这个 $i\ge k$ 看起来并不是必须是 $\ge$。如果是 $\le$ 式子还一样吗？显然组合数要反过来。

这个显然是对的，我们假设有一个上界 $n$，那么设 $f'(k)=f(n-k)$，$g'(k)=g(n-k)$，对 $f'$ 和 $g'$ 进行上面的二项式反演然后带入回来就好了。当然如果没有这样的上界你把上面关于 $(1)$ 的证明复制粘贴然后改一改就行了。

我们得到了：

$$f(k)=\sum_{i\le k}\dbinom{k}{i}g(i)\iff g(k)=\sum_{i\le k}(-1)^{k-i}\dbinom{k}{i}f(i)\tag{2}$$

还可以有其它形式吗？

我们注意到有时候我们有一个“上界”，在这里是 $n$。这就不是简单的 $\le$ 的关系了。同时 $(2)$ 中有上界但没有下界。既有上界又有下界呢？

$$f(k)=\sum_{k\le i\le n}\dbinom{i}{k}g(i)\iff g(k)=\sum_{k\le i\le n}(-1)^{i-k}\dbinom{i}{k}f(i)$$

我们使 $i>n$ 时 $f(i)=g(i)=0$ 使用 $(1)$ 直接得到结果，太简单，我甚至懒得标号了。

这个组合数和上界无关，如果有关呢？

$$f(k)=\sum_{k\le i\le n}\dbinom{n}{i}g(i)\iff g(k)=\sum_{k\le i\le n}(-1)^{n-i}\dbinom{n}{i}f(i)\tag{3}$$

证明留作练习。

由 $(2)$ 还可以得到一个推论。

$$f(k)=\sum_{i\le k}\dbinom{k}{i}(-1)^ig(i)\iff g(k)=\sum_{i\le k}(-1)^{i}\dbinom{k}{i}f(i)\tag{4}$$

这个你设 $g(i)=(-1)^i g'(i)$ 代入 $(2)$ 即可。使用同样的方式，得到 $(1)$ 的推论：

$$f(k)=\sum_{i\ge k}(-1)^i\dbinom{i}{k}g(i)\iff g(k)=\sum_{i\ge k}(-1)^i\dbinom{i}{k}f(i)\tag{5}$$

在一些题目中，我们会遇到二维的式子。比如：

$$ f(n,m)=\sum_{\substack{i\le n \\j\le m}} \dbinom{n}{i} \dbinom{m}{j} g(i,j) $$

这个看起来就很能做。通过先固定一维，设 $h(n,m)=\displaystyle\sum_{j\le m}\dbinom{m}{j} g(n,j)$ 然后两次普通二项式反演可以得到：

$$ g(n,m)=\sum_{\substack{i\le n\\j\le m}} (-1)^{n+m-i-j} \dbinom{n}{i} \dbinom{m}{j} f(i,j) \tag{6}$$

其它类似的一维式子也可以扩展成二维。留作课后习题。

我们还可以尝试拓展到更高维。通过数学归纳法，我们可以得到：

$$ \begin{aligned}&f(x_1,x_2,\dots,x_k)=\sum_{\substack{y_1\le x_1\\y_2\le x_2\\y_3\le x_3\\[-11px]\\\vdots\\y_k\le x_k}}  g(y_1,y_2,\dots,y_k) \prod_{1\le i\le k} \dbinom{x_i}{y_i} \\\iff& g(x_1,x_2,\dots,x_k)=\sum_{\substack{y_1\le x_1\\y_2\le x_2\\y_3\le x_3\\[-11px]\\\vdots\\y_k\le x_k}} (-1)^{\sum\limits_{1\le i\le k}x_i - \sum\limits_{1\le i\le k}y_i}f(y_1,y_2,\dots,y_k) \prod_{1\le i\le k} \dbinom{x_i}{y_i} \end{aligned}\tag 7$$

证明比上面这个式子的 $\KaTeX$ 还要简单，略去。

## 代码实现

:::info[方法 $1$]

[rec](https://www.luogu.com.cn/record/281616233)。

```cpp
#include <cstdio>

using namespace std;

long long fact[1000005], ifact[1000005];

long long qpow(long long x, long long y, long long mod = 1000000007)
{
    long long ans = 1;
    do
    {
        if(y & 1) ans = ans * x % mod;
        x = x * x % mod;
    } while(y >>= 1);
    return ans;
}

int main()
{
    int n, k;
    scanf("%d%d", &n, &k);
    fact[0] = 1;
    for(int i=1;i<=n;i++) fact[i] = fact[i-1] * i % 1000000007;
    ifact[n] = qpow(fact[n], 1000000005);
    for(int i=n-1;i>=0;i--) ifact[i] = ifact[i+1] * (i+1) % 1000000007;
    auto comb = [](int n, int m) { return fact[n] * ifact[m] % 1000000007 * ifact[n-m] % 1000000007; };
    long long sum = 0;
    for(int i=k;i<=n;i++)
    {
        sum = (sum + (i % 2 == k % 2 ? 1 : 1000000006) * comb(i, k) % 1000000007 * comb(n, i) % 1000000007 * ((qpow(2, qpow(2, n-i, 1000000006)) + 1000000006) % 1000000007) % 1000000007) % 1000000007;
    }
    printf("%lld\n", sum);
    return 0;
}
```

:::

:::info[方法 $2$]

[rec](https://www.luogu.com.cn/record/281635640)。

```cpp
#include <cstdio>

using namespace std;

long long fact[1000005], ifact[1000005];

long long qpow(long long x, long long y, long long mod = 1000000007)
{
    long long ans = 1;
    do
    {
        if(y & 1) ans = ans * x % mod;
        x = x * x % mod;
    } while(y >>= 1);
    return ans;
}

int main()
{
    int n, k;
    scanf("%d%d", &n, &k);
    fact[0] = 1;
    for(int i=1;i<=n;i++) fact[i] = fact[i-1] * i % 1000000007;
    ifact[n] = qpow(fact[n], 1000000005);
    for(int i=n-1;i>=0;i--) ifact[i] = ifact[i+1] * (i+1) % 1000000007;
    auto comb = [](int n, int m) { return fact[n] * ifact[m] % 1000000007 * ifact[n-m] % 1000000007; };
    long long sum = 0;
    for(int i=k;i<=n;i++)
    {
        sum = (sum + (i % 2 == k % 2 ? 1 : 1000000006) * comb(n-k, i-k) % 1000000007 * ((qpow(2, qpow(2, n-i, 1000000006)) + 1000000006) % 1000000007) % 1000000007) % 1000000007;
    }
    printf("%lld\n", sum * comb(n, k) % 1000000007);
    return 0;
}
```

:::