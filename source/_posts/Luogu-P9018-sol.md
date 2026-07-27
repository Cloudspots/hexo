---
title: 题解：P9018 [USACO23JAN] Moo Route G
date: 2026-4-30 15:44:46
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
首先我们考虑特殊性质 $N=2$，给了很多分。

稍加思考发现，首先将 $x,y$ 都减半（如果是奇数显然无解，但是题目保证有解）。然后发现往回走（$\texttt L$）和往前走（$\texttt R$）的贡献是一样的，所以只考虑往前走。那就是若干个线段。

那么，$N=2$ 的情况只有长度为 $1$ 和长度为 $2$ 的。但是不可能同时出现在 $1$ 处的长度为 $1$ 和在 $2$ 处的长度为 $1$，因为这样就可以拼成长度为 $2$，显然更优。

:::info[关于合法性]

可能有较真的小朋友要看看这样做是否合法。

显然，一个方案合法当且仅当前一条线段的右端点大于后一条的左端点，且第一条线段左端点为 $1$。那么，显然 $[1,2]$ 前面和后面可以接任意线段，所以这个位置合法。而被删除的 $[1,1]$ 和 $[2,2]$ 对合法性没有“正贡献”，即如果原本合法，去掉后还必然合法，因为左右端点相等。甚至可能原本不合法，去掉之后合法了。

:::

所以答案是 $\dbinom{\max(a_1,a_2)}{\min(a_1,a_2)}$（除以二已经做过了，这里不再写出）……吗？

你发现如果只有 $[1,2]$ 和 $[2,2]$，那么这样还会计算 $[2,2]$ 在开头的情况，但是这样是不合法的！所以要减掉。当 $a_1<a_2$ 时要减去 $\dbinom{a_2-1}{a_1}$。

然后考虑 $N>2$（$N=1$ 答案显然为 $1$，本来就只有一种方案，那显然只有一种最优方案）。

容易发现，如果走到右端点则可以在右边任意走再走回来再继续走剩下的部分。比如 $\texttt{RRLR\#LLRRLL}$ 可以在 $\texttt{\#}$ 中插入任意不会走到左边，并且还会回来的字符串，比如 $\texttt{RRLLRLRRRLLRLL}$。

同时你发现 $N=2$ 已经够复杂了。并且刚刚的性质提示了一些……独立性？

你发现，如果把 $a_{i-1},a_i$ 的方案和 $a_i,a_{i+1}$ 的方案放到一起，那么两边包含 $i$ 的线段数量是相同的。可以直接合并！对于后者每条包含 $i$ 的线段，直接合并到对应前者中包含 $i$ 的线段上。那么如果有 $[i-1,i-1]$ 和 $[i+1,i+1]$ 呢？

这时候合法性就派上了用场。先 $[i-1,i-1]$ 后 $[i+1,i+1]$ 是不合法的！所以这样顺序也就确定了。

所以这两种方案可以唯一地合并成一种 $a_{i-1},a_i,a_{i+1}$ 的方案。

那么把所有的 $a_i,a_{i+1}$ 的方案相乘即可。时间复杂度 $O(n+V)$，$V$ 是预处理阶乘和逆元以计算组合数。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/276081281)。

```cpp
#include <cstdio>
#include <algorithm>

using namespace std;

long long fact[2000005], ifact[2000005];
long long qpow(long long x, long long y)
{
	long long ans = 1;
	do
	{
		if(y & 1) ans = ans * x % 1000000007;
		x = x * x % 1000000007;
	} while(y >>= 1);
	return ans;
}


int main()
{
	fact[0] = 1;
	for(int i=1;i<=2000000;i++)
	{
		fact[i] = fact[i-1] * i % 1000000007;
	}
	ifact[2000000] = qpow(fact[2000000], 1000000005);
	for(int i=1999999;i>=0;i--)
	{
		ifact[i] = ifact[i+1] * (i+1) % 1000000007;
	}
    auto s2 = [&](int x, int y)
    {
        x /= 2; y /= 2;
        long long ans = fact[max(x, y)] * ifact[min(x, y)] % 1000000007 * ifact[max(x, y) - min(x, y)] % 1000000007;
        if(y > x) ans -= fact[y-1] * ifact[x] % 1000000007 * ifact[y-x-1] % 1000000007;
        return (ans + 1000000007) % 1000000007;
    };
    int n;
    scanf("%d", &n);
    long long mul = 1;
    int lst = 0;
    for(int i=1;i<=n;i++)
    {
        int x;
        scanf("%d", &x);
        if(i > 1) mul = mul * s2(lst, x) % 1000000007;
        lst = x;
    }
    printf("%lld\n", mul);
    return 0;
}
```
:::