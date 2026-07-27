---
title: 题解：CF1418E Expected Damage
date: 2026-3-31 15:39:29
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
注意到我们可以对每个怪物计算它的伤害的期望。也就是需要计算它的伤害有效的概率。进一步地，概率只由力量 $\ge b$ 的怪物个数和 $a$ 决定，这个怪物造成的伤害有效当且仅当它前面有 $\ge a$ 个力量 $\ge b$ 的怪物。不妨假设一共有 $k$ 个力量 $\ge b$ 的怪物。注意，这个怪物本身**不算**力量 $\ge b$ 的怪物。因为它自己不会对自己产生贡献，换句话说就是“它前面的怪物”不包含它本身。

我们规定这个怪物一定是力量 $\ge b$ 的怪物（然而不计入 $k$）。因为无论这个怪物的力量是多少，它的攻击有效的概率都不会变。我们先使用阶乘 $k!(n-k-1)!$ 消序（但是这个怪物的位置是重要的，所以是 $k!(n-k-1)!$，不是 $k!(n-k)!$）。

我们考虑力量 $\ge b$ 的怪物的位置，显然有 $\dbinom{n}{k+1}$ 种选法。而对于每种选法，都有 $k-a+1$ 种可能的这个怪物的位置。所以答案是 $\dfrac{\dbinom{n}{k+1}\times (k-a+1)\times k!(n-k-1)!}{n!}$。除 $n!$ 是因为我们在算的是概率。

那么剩下的问题就很简单了。一是如何计算 $k$，这个你排序然后二分一下就好了（也可以对询问离线然后双指针）。二是如何计算怪物的攻击力之和，注意这里要对力量 $<b$ 的和 $\ge b$ 的分开算，那么你维护一下前缀和和后缀和就好了（也可以只维护前缀和）。

:::info[sub&code]

[sub](https://codeforces.com/contest/1418/submission/368947537)。

```cpp
#include <chrono>
#include <cstdio>
#include <algorithm>

using namespace std;

int d[200005];
unsigned long long ps[200005], ss[200005];
unsigned long long fact[200005], ifact[200005];
unsigned long long irs[200005];

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

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	for(int i=1;i<=n;i++)
	{
		scanf("%d", d + i);
	}
	sort(d + 1, d + n + 1, [](int x, int y) { return x > y; });
	for(int i=1;i<=n;i++)
	{
		ps[i] = (ps[i-1] + d[i]) % 998244353;
	}
	for(int i=n;i>=1;i--)
	{
		ss[i] = (ss[i+1] + d[i]) % 998244353;
	}
	fact[0] = 1;
	for(int i=1;i<=n+1;i++)
	{
		fact[i] = fact[i-1] * i % 998244353;
	}
	ifact[n+1] = qpow(fact[n+1], 998244351);
	for(int i=n;i>=0;i--)
	{
		ifact[i] = ifact[i+1] * (i+1) % 998244353;
	}
	for(int i=1;i<=n;i++)
	{
		irs[i] = fact[i-1] * fact[n-i+1] % 998244353;
	}
	auto comb = [](int x, int y) { return fact[x] * ifact[y] % 998244353 * ifact[x-y] % 998244353; };
	auto calc = [&comb](int n, int r, int a) -> unsigned long long
	{
		if(r < a || a < 1) return 0ull;
		return comb(n, r + 1) * (r - a + 1) % 998244353 * fact[r] % 998244353 * fact[n-r-1] % 998244353;
	};
	unsigned long long xorsum = 0;
	while(m--)
	{
		int a, b;
		scanf("%d%d", &a, &b);
		int c = upper_bound(d + 1, d + n + 1, b, [](int x, int y) { return x > y; }) - d - 1;
		long long v0 = calc(n, c, a) * ifact[n] % 998244353, v1 = calc(n, c-1, a) * ifact[n] % 998244353;
		printf("%lld\n", (v1 * ps[c] + v0 * ss[c+1]) % 998244353);
	}
	return 0;
}
```

:::