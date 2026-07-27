---
title: 题解：CF732F Tourist Reform
date: 2026-4-25 14:59:12
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
这题评绿吧。

---

首先容易发现，如果图是边双连通的，那么存在一种定向方式使得每个点都可以到达另外的任何点。感性理解是对于任意两个点，都有两条不包含公共边的路径。**构造的方法**是，对于 DFS 的树边从上往下，返祖边从下往上。

那么缩边双，得到一棵树。树上每个点都有一个权值，即点的个数。要求对树上的边定向，使得每个点能够到达的点的权值之和的最小值最大。

虽然“最小值最大”通常是二分，但这里并不是。显然，必然有一个点没有任何出边。那么答案一定不能大于这个点的权值。

那么这个点显然取点权最大的点，并让所有其它点都取到它即可。显然这是最优解。

综上，我们先跑 Tarjan 求出所有边双连通分量，然后求出点权，建树，找出权值最大的点，从这个点向外 DFS 即可。时间复杂度 $O(n+m)$。

:::info[sub&code]

[sub](https://codeforces.com/contest/732/submission/372422665)。

```cpp
#include <stack>
#include <cstdio>
#include <vector>
#include <utility>
#include <algorithm>

using namespace std;

class edge_info
{
public:
	int frm, to;
	bool cut;
} ufo[400005]; // awa
class changed_edge
{
public:
	int u, v, ru, rv, id;
};
vector<pair<int, int>> web[400005];
vector<changed_edge> nweb[400005];

int dfn[400005], low[400005];
vector<int> ecc[400005];
int eccid[400005];
stack<int> stk;
int eccur = 0;

void Tarjan(int u, int fa = 0)
{
	static int ddfn = 0;
	dfn[u] = low[u] = ++ddfn;
	stk.push(u);
	for(const auto &[v, id] : web[u])
	{
		if(!dfn[v])
		{
			Tarjan(v, u);
			if(low[v] < low[u]) low[u] = low[v];
			if(low[v] > dfn[u]) ufo[id].cut = true;
			ufo[id].frm = u;
			ufo[id].to = v;
		}
		else if(v != fa)
		{
			if(dfn[v] < low[u]) low[u] = dfn[v];
			if(dfn[v] < dfn[u])
			{
				ufo[id].frm = u;
				ufo[id].to = v;
			}
		}
	}
	if(dfn[u] == low[u])
	{
		eccur++;
		int r;
		do
		{
			r = stk.top();
			stk.pop();
			ecc[eccur].push_back(r);
			eccid[r] = eccur;
		} while(r != u);
	}
}

void dfs(int u, int fa = 0)
{
	for(const auto &[_, v, ru, rv, id] : nweb[u])
	{
		if(v != fa)
		{
			ufo[id].frm = rv;
			ufo[id].to = ru;
			dfs(v, u);
		}
	}
}

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	for(int i=1;i<=m;i++)
	{
		int u, v;
		scanf("%d%d", &u, &v);
		web[u].push_back({v, i});
		web[v].push_back({u, i});
	}
	Tarjan(1);
	int maxn = 0, maxid = 0;
	for(int i=1;i<=eccur;i++)
	{
		if(ecc[i].size() > maxn)
		{
			maxn = ecc[i].size();
			maxid = i;
		}
		// maxn = max(maxn, (int)ecc[i].size());
	}
	for(int i=1;i<=n;i++)
	{
		for(const auto &[v, id] : web[i])
		{
			if(eccid[i] != eccid[v])
			{
				nweb[eccid[i]].push_back({eccid[i], eccid[v], i, v, id});
			}
		}
	}
	dfs(maxid);
	printf("%d\n", maxn);
	for(int i=1;i<=m;i++)
	{
		printf("%d %d\n", ufo[i].frm, ufo[i].to);
	}
	return 0;
}
// ber land
// Berland is a tourist country!
// Berland is tourist's country!
```

:::