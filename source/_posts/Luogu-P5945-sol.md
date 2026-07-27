---
title: 题解：P5945 [POI 2002] 协议
date: 2025-6-23 18:32:53
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
> 题外话：众所周知，不能连续发送相同电平是非常真实的，因为这样难以知道你发送了几个这样的电平。比如 `_—_—_——_`（`_` 为 $0$，`—` 为 $1$）很容易看清，而 `——————` 不是很容易。现在的解法大概是，异或上一个相位差距为半个脉冲时间的时钟信号，可能比较抽象但是确实能够解决问题。比如 `——————`，为了便于表示我们拉长为两倍，也就是 `————————————`，而时钟信号是 `_——__——__——_`（同样扩倍，但是已经加上相位），异或结果就是 `—__——__——__—`，这样脉冲最多 $1$ 个频率的时间就会变化一次了（注意，这里两个字符表示一个脉冲的时间）。

先不考虑如何进行大数运算（这也是一个不算很简单的地方，难度大概是黄），考虑算法主体部分。

由于 $\dfrac{n}{m}$ 是整数，我们只考虑单个数据包。如果一个数据包能够表示 $x$ 种不同的脉冲波，则包含 $\log_2 x$ 位信息，而 $y$ 个这样的数据包能够包含 $\log_2(x^y)$ 位信息，显然这东西等于 $y\log_2x$。也就是答案为 $\dfrac{n}{m}\log_2x$，其中 $x$ 是单个数据包（也就是 $m$ 个连续脉冲）能够包含的不同包数量。

这也就说明，实际上 $n$ 的范围是 $100$（也就是 $m$ 的范围），因为我们只需要考虑 $m$。

那么自然地，设 $f_{i,j,p}$ 为考虑前 $i$ 个脉冲，最后 $j$ 个脉冲都是 $p$，但是倒数第 $j+1$ 个不是，有多少种可能性。

这样并不好，注意到 $p$ 为任何数字的时候答案都一样（$i,j$ 相同），这一点是显然的。所以我们只需要固定 $p$，答案乘上 $k$ 即可。

分类讨论 $j=1$ 和 $j\ge 2$ 的情况。前者只可能是把一个连续段（长度可能为 $1$）打断而来，状态转移方程详见代码，读者也可以自己推一推。后者只可能是把一个连续段再接上一个同样的，不能包含更多信息（新增的数字唯一）。

边界条件显然是 $f_{1,1}=1$。

那么考虑如何进行大数运算。由于我们只需要直到结果的 $\log$，那么我们可以只存储 $\log$。这样算乘法非常容易，而加法呢，如果差距过于悬殊可以直接将大的作为结果（如 $1+2^{-100}$ 直接当做 $1$），否则就正常地进行计算（展开然后化简，然后求值）。

代码。

```cpp
#include <cstdio>
#include <cmath>
#include <algorithm>

using namespace std;

class logic
{
public:
    long double lglg;
    logic() : lglg(-1e18) {}
    logic(const logic &r) : lglg(r.lglg) {}
    logic(const long double &r) : lglg(log2(r)) {}
    logic(int r) : lglg(log2(r)) {}
    operator long double() const { return pow(2, lglg); }
    friend logic operator+(logic x, logic y)
    {
        if(x.lglg < y.lglg) swap(x, y);
        // 如果差距太大，超过 2^100
        if(x.lglg - y.lglg >= 100) return x;
        // 否则，x+y=2^a+2^b=2^b(2^(a-b)+1)
        return {y.lglg + log2(pow(2, x.lglg - y.lglg) + 1)};
    }
    friend logic operator*(logic x, logic y) { return {x.lglg + y.lglg}; }
    const logic &operator+=(logic y)
    {
        if(lglg < y.lglg) swap(lglg, y.lglg);
        // 如果差距太大，超过 2^100
        if(lglg - y.lglg >= 100) return *this;
        // 否则，x+y=2^a+2^b=2^b(2^(a-b)+1)
        lglg = y.lglg + log2(pow(2, lglg - y.lglg) + 1);
        return *this;
    }
    const logic &operator*=(logic y) { lglg += y.lglg; return *this; }
};

logic f[105][105];

logic solve(int k, int m, int l)
{
    f[1][1] = 1;
    for(int i=2;i<=m;i++)
    {
        // 处理 j=1
        for(int j=1;j<i&&j<l;j++)
        {
            f[i][1] += f[i-1][j];
        }
        f[i][1] *= k - 1; // 其实应该是上面 f[i][1] += f[i-1][j] * (k - 1)，显然这样写对正确性也没有影响。
        for(int j=2;j<=i&&j<l;j++)
        {
            f[i][j] = f[i-1][j-1];
        }
    }
    logic sum = 0;
    for(int i=1;i<l;i++)
    {
        sum += f[m][i];
    }
    return sum *= k;
}

int main()
{
    int k, n, m, l;
    scanf("%d%d%d%d", &k, &n, &m, &l);
    // printf("result of solve: 2^%.10Lf\n", solve(k, m, l).lglg);
    printf("%d\n", (int)(n / m * solve(k, m, l).lglg));
    return 0;
}
```