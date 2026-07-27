---
title: 题解：CF1525E Assimilation IV
date: 2026-3-28 08:54:04
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
拆贡献。对于每个点求其被覆盖到的概率。

直接做不好求（因为是被**任意一个纪念碑**覆盖），考虑正难则反，求没有被覆盖的概率（就是**不被任何纪念碑**覆盖）。

那么，考虑每一个纪念碑。设其和这个点的距离为 $d_i$，那么显然它在 $\le n-d_i+1$ 的时间内被建造都可以覆盖这个点，而在 $\ge n-d_i+2$ 的时间建造都不能覆盖。

那么我们就得到了一系列约束条件：每个条件形如“纪念碑 $i$ 需要在 $a_i=n-d_i+2$ 时间或之后建造”。

考虑到建造的时间是一个排列，为了避免后效性，我们将 $a_i$ 从大到小排序为 $b$ 数组。那么对于 $b_i$，在它的可行区间 $[b_i,n]$ 内，已经有 $i-1$ 个元素了（因为对于任意 $j<i$，都有 $[b_j,n]\subseteq [b_i,n]$），所以可行方案数是 $n-b_i+1-(i-1)$，而总方案数是 $n-(i-1)$，故对于概率的贡献为 $\dfrac{n-b_i+1-(i-1)}{n-(i-1)}$。

对于所有的贡献相乘得到某一个点没有被覆盖的概率 $p$，将所有点被覆盖的概率 $1-p$ 相加即可。时间复杂度 $\mathcal O(nm\log n)$。

:::info[sub&code]
[sub](https://codeforces.com/contest/1525/submission/368439316)。

```cpp
/*
拆贡献

对于每个点，它不被覆盖的概率是多少？

那么，对于每座纪念碑，设其到这个点的距离为 d_i，那么它要位于时间 n - d_i + 2 或其之后被建造

那么按照 n - d + 2 从大到小排序

对于每个 a_i = n - d_i + 2 (sorted)，其之后已经有 i-1 个被占用了

所以概率系数为 (n - a_i + 1 - (i - 1)) / (n - (i - 1))

比如，点 5

d: 4 2 3
a: 1 3 2
=> 3 2 1

Factor: (3-3+1)/3 * (3-2+1-1)/2 * (3-1+1-2)/1
      = 1/3 * 1/2 * 1/1
      = 1/6

确实，在所有 6 种情况中，只有 1 中没有覆盖 5。
*/
#include <cstdio>
#include <algorithm>

using namespace std;

long long qpow(long long x, long long y)
{
	long long p = x, ans = 1;
	do
	{
		if(y & 1) ans = ans * p % 998244353;
		p = p * p % 998244353;
	} while(y >>= 1);
	return ans;
}

int a[25], d[25][500005];

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	for(int i=1;i<=n;i++)
	{
		for(int j=1;j<=m;j++)
		{
			scanf("%d", d[i] + j);
		}
	}
	long long sum = 0;
	for(int i=1;i<=m;i++)
	{
		for(int j=1;j<=n;j++)
		{
			a[j] = n + 2 - d[j][i];
		}
		sort(a + 1, a + n + 1, [](int x, int y) { return x > y; });
		long long mul = 1;
		for(int j=1;j<=n;j++)
		{
			mul = mul * (n - a[j] + 1 - (j - 1)) % 998244353 * qpow(n - (j - 1), 998244351) % 998244353;
		}
		sum = (sum + 998244354 - mul) % 998244353;
	}
	printf("%lld\n", sum);
	return 0;
}
```
:::