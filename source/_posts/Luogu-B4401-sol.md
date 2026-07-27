---
title: 题解：B4401 [蓝桥杯青少年组国赛 2025] 第六题
date: 2025-8-29 20:23:25
categories:
  - Solution
tags:
  - Solution
  - Luogu B Problem Solution
---
> 赛时在代码中复制粘贴数十行“我不会 MLE！”最终真的没有 MLE。其实那个做法极限数据下是会爆炸的。

$11$ 是质数，所以乘积是 $11$ 的倍数当且仅当经过了至少一个 $11$ 的倍数格。我们把这种格子称作“关键格”。

如何计数？赛时思路是考虑第一个经过的关键格是哪一个。赛后发现把问题复杂化了（不过这个做法的好处是当关键格数量不多但是矩阵很大的时候还是能处理），只需要 dp 出一个关键格都不经过的方案数然后拿 $\dbinom{h+w-2}{h-1}$ 减去它即可。

时间复杂度达到了 $\Theta(hw+h+w)=\Theta(hw)$，最优。空间复杂度呢？

算组合数可以 $\Theta(\log h+\log w)$ 解决，滚动数组可以 $\Theta(w)$ 解决 dp，所以可以做到 $\Theta(\log h+w)$ 空间复杂度，不存在任何爆空间问题，代码也很简单。

:::info[代码&提交记录]
```cpp
#include <cstdio>

using namespace std;

int dp[10000005];

long long qpow(long long x, unsigned long long y)
{
    if(y == 0) return 1;
    if(y == 1) return x;
    auto res = qpow(x, y >> 1);
    res = res * res % 1000000007;
    if(y & 1) res = res * x % 1000000007;
    return res;
}
int ninvert(int x) { return qpow(x, 1000000005); }

int main()
{
    int n, m;
    scanf("%d%d", &n, &m);
    dp[1] = 1;
    for(int i=1;i<=n;i++)
    {
        for(int j=1;j<=m;j++)
        {
            int a;
            scanf("%d", &a);
            if(a % 11 == 0) dp[j] = 0;
            else dp[j] = (dp[j] + dp[j-1]) % 1000000007;
        }
    }
    long long mul = 1, fact = 1;
    for(int i=1;i<=n+m-2;i++)
    {
        mul = mul * i % 1000000007;
        fact = fact * i % 1000000007;
        if(i == n - 1) mul = mul * ninvert(fact) % 1000000007;
        if(i == m - 1) mul = mul * ninvert(fact) % 1000000007;
    }
    printf("%lld\n", (mul - dp[m] + 1000000007) % 1000000007);
    return 0;
}
```

[record](https://www.luogu.com.cn/record/233759531)。
:::

整场比赛难度评价：红（算上理解题目难度是黑/fn）橙黄黄绿黄。