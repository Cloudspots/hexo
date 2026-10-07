---
title: 题解：P15402 [NOISG 2026 Prelim] Digits
date: 2026-10-07 21:49:29
updated: 2026-10-07 21:49:52
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P15402 [NOISG 2026 Prelim] Digits

注意到 $1\le m\le 5,2\le k\le 10$，换句话说只可能有 $10^5$ 种不同的数字。

考虑 Dijkstra，可以做到 $O(m^2k^m\log k^m)=O(m^3k^m\log k)$，显然可以通过。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/299278877)。

```cpp
#include <queue>
#include <cstdio>
#include <cassert>
#include <cstring>
#include <algorithm>
#ifdef LB_IS_DEBUGGING
#include <signal.h>
#define __debugbreak() raise(SIGTRAP);
#else
#define __debugbreak()
#endif

using namespace std;

unsigned gcd(unsigned x, unsigned y) { return y == 0 ? x : gcd(y, x % y); }

int a[10], c[10];
long long dist[1000005];
int p10[10] = {1, 10, 100, 1000, 10000, 100000, 1000000, 114514, 1919810};

int main()
{
	int n, m, k;
	scanf("%d%d%d", &n, &m, &k);
	for(int i=1;i<=m;i++) scanf("%d", a + i);
	for(int i=1;i<=m;i++) scanf("%d", c + i);
	int x;
	scanf("%d", &x);
	auto vop = [&](int l, int r, int v) { for(int i=l;i<=r;i++) v = v - (v / p10[m-i] % 10 * p10[m-i]) + ((v / p10[m-i] % 10 - a[i] + k) % k * p10[m-i]); return v; };
	// while(true)
	// {
	// 	int l, r, v;
	// 	scanf("%d%d%d", &l, &r, &v);
	// 	printf("%d\n", vop(l, r, v));
	// }
	class node
	{
	public:
		int id;
		long long dst;
		bool operator<(const node &r) const { return dst > r.dst; }
	};
	priority_queue<node> pq;
	memset(dist, 0x3f, sizeof dist);
	dist[x] = 0;
	pq.push({x, 0});
	while(!pq.empty())
	{
		auto [u, d] = pq.top();
		pq.pop();
		if(d != dist[u]) continue;
		// printf("u = %d, d = %lld\n", u, d);
		for(int l=1;l<=m;l++)
		{
			for(int r=l;r<=m;r++)
			{
				// if(vop(l, r, u) == 3776) __debugbreak();
				int v = vop(l, r, u);
				if(dist[u] + c[l] + c[r] < dist[v])
				{
					dist[v] = dist[u] + c[l] + c[r];
					pq.push({v, dist[v]});
					// printf("%d -> %d, dist = %lld\n", u, v, dist[v]);
				}
			}
		}
	}
	while(n--)
	{
		int v;
		scanf("%d", &v);
		printf("%lld\n", dist[v] == 0x3f3f3f3f3f3f3f3f ? -1 : dist[v]);
	}
	return 0;
}
```
:::
