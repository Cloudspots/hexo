---
title: 题解：CF1919E Counting Prefixes
date: 2026-10-05 15:31:11
updated: 2026-10-07 21:51:52
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---

# 题解：CF1919E Counting Prefixes

> $^*800$。

---

考虑枚举终点，此时你可以得到每个 $i-1\to i$ 和 $i\to i-1$ 的个数，简单组合数插板就可以得到结果。总时间复杂度 $O(n^2)$。

:::info[rec&code]

[rec](https://codeforces.com/contest/1919/submission/393280721)。

```cpp
#include <cstdio>
#include <algorithm>

using namespace std;

long long fact[10005], ifact[10005];
long long qpow(long long x, long long y) { long long ans = 1; do { if(y & 1) ans = ans * x % 998244353; x = x * x % 998244353; } while(y >>= 1); return ans; }

int *a = new int[10005]{} + 5002;
int *qd = new int[10005]{} + 5002, *qu = new int[10005]{} + 5002;

int main()
{
	fact[0] = 1;
	for(int i=1;i<=10002;i++) fact[i] = fact[i-1] * i % 998244353;
	ifact[10002] = qpow(fact[10002], 998244351);
	for(int i=10001;i>=0;i--) ifact[i] = ifact[i+1] * (i+1) % 998244353;
	auto comb = [](int x, int y) { return x < y || y < 0 ? 0 : fact[x] * ifact[y] % 998244353 * ifact[x-y] % 998244353; };
	int t;
	scanf("%d", &t);
	while(t--)
	{
		int n;
		scanf("%d", &n);
		int minn = 0, maxn = 0;
		for(int i=-n;i<=n;i++) a[i] = 0;
		for(int i=1;i<=n;i++)
		{
			int x;
			scanf("%d", &x);
			if(x < minn) minn = x;
			if(x > maxn) maxn = x;
			a[x]++;
		}
		long long s = 0;
		for(int e=minn;e<=maxn;e++)
		{
			bool fg = false;
			int rnl = min(0, e), rnr = max(0, e);
			for(int i=min(0, e); i<=max(0, e); i++) a[i]++;
			a[e]--;
			qd[minn] = a[minn];
			for(int i=minn+1;i<=maxn;i++)
			{
				qd[i] = a[i] - qd[i-1];
			}
			for(int i=min(0, e); i<=max(0, e); i++) a[i]--;
			a[e]++;
			if(e > 0)
			{
				for(int i=e-1;i>=0;i--) qd[i]--;			
			}
			for(int i=minn;i<maxn;i++) qu[i] = a[i+1] - qd[i+1];
			qu[maxn] = 0;
			// printf("e = %d:\nqd = ", e);
			// for(int i=minn;i<=maxn;i++) printf("%d ", qd[i]);
			// printf("\nqu = ");
			// for(int i=minn;i<=maxn;i++) printf("%d ", qu[i]);
			// printf("\n");
			for(int i=minn;i<maxn;i++)
			{
				if(qu[i] < 0 || qd[i] < 0 || (qu[i] == 0 && qd[i] == 0) || abs(qu[i] - qd[i]) > 1)
				{
					fg = true;
					break;
				}
			}
			if(fg || qd[maxn] || qu[maxn]) continue;
			long long mul = 1;
			for(int i=minn+1;i<maxn;i++)
			{
				if(i < 0) mul = mul * comb(qd[i]-1+qu[i-1], qd[i]-1) % 998244353;
				else if(i > 0) mul = mul * comb(qu[i-1]-1+qd[i], qu[i-1]-1) % 998244353;
				else mul = mul * comb(qd[i]+qu[i-1], qd[i]) % 998244353;
			}
			s = (s + mul) % 998244353;
		}
		printf("%lld\n", s);
	}
	return 0;
}
```

:::
