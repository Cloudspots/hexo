---
title: 题解：CF1946E Girl Permutation
date: 2026-10-04 21:54:27
updated: 2026-10-07 21:52:59
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---

# 题解：CF1946E Girl Permutation

> 简单题，$^*800$！

---

考虑若只给定了前缀最大值位置。此时做法非常显然，考虑前 $i$ 段（每一段由一个前缀最大值和后面极长的非前缀最大值组成）中所有数字离散化后的方案数，反离散化只需要一个组合数就可以解决。

那么现在给定了前缀最大值和后缀最大值做法也是显然的。首先前缀最大值的最有一个元素和后缀最大值的最后一个元素（第一个元素）必然是相同的，都是全局最大值。那么对于前缀和后缀都按照上面的方法算一遍，然后乘起来并用反离散化合并即可。

特判一下无解，包括 $p_{m_1}\neq s_1$ 和 $p_1\neq 1$ 和 $s_{m_2}\neq n$。

时间复杂度 $O(n+\log P+Tm)$，预处理组合数。

:::info[sub&code]

[sub](https://codeforces.com/contest/1946/submission/393238701)。

```cpp
#include <cstdio>
#include <algorithm>

using namespace std;

long long fact[200005], ifact[200005];
int p[200005], q[200005];

long long qpow(long long x, long long y) { long long ans = 1; do { if(y & 1) ans = ans * x % 1000000007; x = x * x % 1000000007; } while(y >>= 1); return ans; }

int main()
{
	fact[0] = 1;
	for(int i=1;i<=200000;i++) fact[i] = fact[i-1] * i % 1000000007;
	ifact[200000] = qpow(fact[200000], 1000000005);
	for(int i=199999;i>=0;i--) ifact[i] = ifact[i+1] * (i+1) % 1000000007;
	auto comb = [](int x, int y) { return x < y || y < 0 ? 0 : fact[x] * ifact[y] % 1000000007 * ifact[x-y] % 1000000007; };
	int t;
	scanf("%d", &t);
	while(t--)
	{
		int n, m1, m2;
		scanf("%d%d%d", &n, &m1, &m2);
		for(int i=1;i<=m1;i++)
		{
			scanf("%d", p + i);
		}
		for(int i=1;i<=m2;i++)
		{
			scanf("%d", q + i);
		}
		if(p[1] != 1 || p[m1] != q[1] || q[m2] != n)
		{
			printf("0\n");
			continue;
		}
		long long x1 = 1, x2 = 1;
		for(int i=1;i<m1;i++)
		{
			x1 = x1 * comb(p[i+1]-2, p[i]-1) % 1000000007 * fact[p[i+1]-p[i]-1] % 1000000007;
		}
		for(int i=m2;i>1;i--)
		{
			x2 = x2 * comb(n-q[i-1]-1, n-q[i]) % 1000000007 * fact[q[i]-q[i-1]-1] % 1000000007;
		}
		printf("%lld\n", x1 * x2 % 1000000007 * comb(n-1, p[m1]-1) % 1000000007);
	}
	return 0;
}
```

:::
