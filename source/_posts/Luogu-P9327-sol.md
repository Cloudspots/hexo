---
layout: blog
title: Luogu-P9327-sol
date: 2026-07-29 21:57:09
tags:
  - Solution
  - Luogu P Problem Solution
categories:
  - Solution
---
> ？？这题还能写题解？？

---

首先转化一下题意，求一个总边权最小的子图，使得子图上两个点的最短路长度和原图相同。

先考虑没有重边且边权均 $\ge 1$。能够很快想到一个做法：先求全源最短路（Dijkstra，$O(n^2\log n)$），然后对于每一条边分别判断这条边是不是这条边的两个端点之间唯一的最短路。如果会就不删，否则就删。

在边权均为正的情况下这样显然是正确的。

我们现在考虑重边。重边是很显然的，只需要取边权最小的边。如果有边权同样小的，取代价最小的。

现在考虑边权为 $0$。注意到这个是双向边，所以如果没有代价那么两个端点可以看作是等价的，直接缩起来。而如果有代价，那么由于 $0$ 边也可能成环，所以我们取出所有 $0$ 边，求最小生成树，然后缩到一起即可。这样就可以去掉所有 $0$。

时间复杂度 $O(n^2\log n)$ 全源最短路。

:::info[rec&code]
[rec](https://www.luogu.com.cn/record/288875829)。

```cpp
#include <queue>
#include <cstdio>
#include <vector>
#include <cassert>
#include <cstring>
#include <algorithm>

using namespace std;

class edge
{
public:
	int u, v;
	long long len, cost;
};

vector<edge> web[2005];

edge es[2005], ep[2005], qc[2005][2005], gc[2005][2005];
bool banned[2005];

long long adist[2005][2005];
long long acnt[2005][2005];
int from[2005];

class dsu
{
public:
	int fa[2005];
	int rk[2005];
	int getfa(int x) { while(x != fa[x]) x = fa[x] = fa[fa[x]]; return x; }
	void merge(int x, int y) { x = getfa(x); y = getfa(y); if(x == y) return; if(rk[x] < rk[y]) fa[x] = y; else if(rk[x] > rk[y]) fa[y] = x; else { fa[x] = y; rk[y]++; } }
} ds;

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	int cur = 0;
	for(int i=1;i<=m;i++)
	{
		int u, v;
		long long l, c;
		scanf("%d%d%lld%lld", &u, &v, &l, &c);
		if(u == v) continue;
		if(qc[u][v].u == 0 || qc[u][v].len > l || qc[u][v].len == l && qc[u][v].cost > c) qc[u][v] = {u, v, l, c};
		if(qc[v][u].u == 0 || qc[v][u].len > l || qc[v][u].len == l && qc[v][u].cost > c) qc[v][u] = {v, u, l, c};
	}
	for(int i=1;i<=n;i++)
	{
		ds.fa[i] = i;
		for(int j=1;j<=n;j++)
		{
			if(qc[i][j].u)
			{
				if(i < j) es[++cur] = qc[i][j];
			}
		}
	}
	sort(es + 1, es + cur + 1, [](const auto &x, const auto &y) { return x.len < y.len || x.len == y.len && x.cost < y.cost; });
	long long sum = 0;
	for(int i=1;i<=cur;i++)
	{
		if(es[i].len == 0)
		{
			if(ds.getfa(es[i].u) != ds.getfa(es[i].v))
			{
				sum += es[i].cost;
				ds.merge(es[i].u, es[i].v);
			}
		}
		else
		{
			if(ds.getfa(es[i].u) == ds.getfa(es[i].v)) continue;
			if(gc[ds.getfa(es[i].u)][ds.getfa(es[i].v)].u == 0) gc[ds.getfa(es[i].u)][ds.getfa(es[i].v)] = {ds.getfa(es[i].u), ds.getfa(es[i].v), es[i].len, es[i].cost};
			if(gc[ds.getfa(es[i].v)][ds.getfa(es[i].u)].u == 0) gc[ds.getfa(es[i].v)][ds.getfa(es[i].u)] = {ds.getfa(es[i].v), ds.getfa(es[i].u), es[i].len, es[i].cost};
		}
	}
	cur = 0;
	for(int i=1;i<=n;i++)
	{
		if(ds.getfa(i) != i) continue;
		for(int j=1;j<=n;j++)
		{
			if(ds.getfa(j) != j) continue;
			if(gc[i][j].u)
			{
				web[i].push_back(gc[i][j]);
				if(i < j) es[++cur] = gc[i][j];
				// printf("%d --- %d, len = %lld, cost = %lld\n", i, j, gc[i][j].len, gc[i][j].cost);
			}
		}
	}
	auto dijkstra = [&](int x, long long *dist, long long *cnt) -> void
	{
		for(int i=1;i<=n;i++)
		{
			dist[i] = 0x3f3f3f3f3f3f3f3f;
			cnt[i] = 0;
			from[i] = 0;
		}
		dist[x] = 0;
		from[x] = -1;
		cnt[x] = 1;
		class node
		{
		public:
			int id;
			long long dst;
			bool operator<(const node &r) const { return dst > r.dst; }
		};
		priority_queue<node> pq;
		pq.push({x, 0});
		while(!pq.empty())
		{
			auto [u, dst] = pq.top();
			pq.pop();
			if(dst != dist[u]) continue;
			for(const auto &[_, v, len, __] : web[u])
			{
				if(v == from[u]) continue;
				if(dst + len < dist[v])
				{
					dist[v] = dst + len;
					pq.push({v, dist[v]});
					cnt[v] = 0;
					from[v] = u;
				}
				if(dst + len == dist[v])
				{
					cnt[v] = (cnt[v] + cnt[u]) % 998244853;
					if(from[v] != u) from[v] = -1;
				}
			}
		}
	};
	for(int i=1;i<=n;i++) if(i == ds.getfa(i)) dijkstra(i, adist[i], acnt[i]);
	// for(int i=1;i<=n;i++)
	// {
	// 	for(int j=1;j<=n;j++)
	// 	{
	// 		printf("dist[%d][%d] = %lld, cnt[%d][%d] = %lld\n", i, j, adist[i][j], i, j, acnt[i][j]);
	// 	}
	// }
	for(int i=1;i<=cur;i++)
	{
		if(adist[es[i].u][es[i].v] == es[i].len)
		{
			if(acnt[es[i].u][es[i].v] == 1)
			{
				sum += es[i].cost;
				// printf("chosen: (%d, %d)\n", es[i].u, es[i].v);
				ds.merge(es[i].u, es[i].v);
			}
		}
	}
	printf("%lld\n", sum);
	return 0;
}
// 并查集一定要初始化/fendou
```
:::
