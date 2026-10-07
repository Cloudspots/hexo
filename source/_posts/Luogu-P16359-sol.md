---
title: 题解：P16359 [BalticOI 2026] Tourist's Journey
date: 2026-10-05 11:11:22
updated: 2026-10-07 21:49:58
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P16359 [BalticOI 2026] Tourist's Journey

考虑最多 $11$ 条非树边，且不能往回走，还句话说从一个点到另一个点若只能走树边则只有一种走法。

考虑抽出所有非树边，然后按边 dp。$f_{i,j,0/1}$ 表示目前经过 $i$ 的时间，刚刚走过了第 $j$ 条非树边，是正着/反着经过的。

对于转移，只需要枚举上一次经过的特殊边即可（枚举下一次也可以）。对于距离，只有 $1$ 和非树边的端点可能成为要求距离的点。暴力 DFS 预处理即可。

时间复杂度 $O(k(m-n)^2+n(m-n))$。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/300055909)。

```cpp
#include <cstdio>
#include <vector>
#include <cassert>
#include <numeric>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

class dsu
{
public:
	int fa[200005], rk[200005];
	int getfa(int x) { while(x != fa[x]) x = fa[x] = fa[fa[x]]; return x; }
	void merge(int x, int y) { if((x = getfa(x)) == (y = getfa(y))) return; if(rk[x] < rk[y]) fa[x] = y; else if(rk[x] > rk[y]) fa[y] = x; else { fa[x] = y; rk[y]++; } }
} ds;

vector<int> web[200005];

pair<int, int> exeg[30];
int exu[30];
int exid[200005];
int dst[30][30];
long long dp[10005][15][2];

int main()
{
	int n, m, t;
	scanf("%d%d%d", &n, &m, &t);
	iota(ds.fa, ds.fa + n + 5, 0);
	int cur = 0;
	for(int i=1;i<=m;i++)
	{
		int u, v;
		scanf("%d%d", &u, &v);
		if(ds.getfa(u) == ds.getfa(v))
		{
			exeg[++cur] = {u, v};
			exu[cur * 2 - 1] = u;
			exu[cur * 2] = v;
			exid[u] = cur * 2 - 1;
			exid[v] = cur * 2;
			// printf("extend: %d --- %d\n", u, v);
		}
		else
		{
			web[u].push_back(v);
			web[v].push_back(u);
			ds.merge(u, v);
		}
	}
	int pcur = cur * 2 + 1;
	exu[0] = 1;
	exu[pcur] = n;
	exid[n] = pcur;
	for(int i=0;i<=cur*2+1;i++)
	{
		if(i == 0 || exid[exu[i]] == i) U([&](auto &&self, int u, int fa, int len) -> void { /*printf("[dfs] i = %d, exu[%d] = %d, u = %d, exid[%d] = %d, len = %d\n", i, i, exu[i], u, u, exid[u], len);*/ if(exid[u]) dst[i][exid[u]] = len; for(int v : web[u]) if(v != fa) self(self, v, u, len + 1); })(exu[i], 0, 0);
	}
	auto qdist = [&](int u, int v) { if(u > v) swap(u, v); /*if(!((u == 1 || exid[u]) && (v == 1 || exid[v]))) __debugbreak();*/ assert((u == 1 || exid[u]) && (v == 1 || exid[v])); if(u == v) return 0; if(u == 1) return dst[0][exid[v]]; else return dst[exid[u]][exid[v]]; };
	// printf("Preprocessing...\n");
	for(int i=1;i<=cur;i++)
	{
		int l = qdist(1, exeg[i].first) + 1;
		// printf("i = %d, first: u = %d, len = %d\n", i, exeg[i].first, l);
		if(l <= t) dp[l][i][1]++;
		l = qdist(1, exeg[i].second) + 1;
		// printf("i = %d, second: u = %d, len = %d\n", i, exeg[i].second, l);
		if(l <= t) dp[l][i][0]++;
	}
	for(int i=1;i<=t;i++)
	{
		for(int j=1;j<=cur;j++)
		{
			if(dp[i][j][0])
			{
				for(int k=1;k<=cur;k++)
				{
					int l = qdist(exeg[j].first, exeg[k].first) + i + 1;
					if(l <= t && j != k) dp[l][k][1] = (dp[l][k][1] + dp[i][j][0]) % 1000000007;
					l = qdist(exeg[j].first, exeg[k].second) + i + 1;
					if(l <= t) dp[l][k][0] = (dp[l][k][0] + dp[i][j][0]) % 1000000007;
				}
			}
			if(dp[i][j][1])
			{
				for(int k=1;k<=cur;k++)
				{
					int l = qdist(exeg[j].second, exeg[k].first) + i + 1;
					if(l <= t) dp[l][k][1] = (dp[l][k][1] + dp[i][j][1]) % 1000000007;
					l = qdist(exeg[j].second, exeg[k].second) + i + 1;
					if(l <= t && j != k) dp[l][k][0] = (dp[l][k][0] + dp[i][j][1]) % 1000000007;
				}
			}
			// printf("dp[%d][%d][0] = %lld, dp[%d][%d][1] = %lld\n", i, j, dp[i][j][0], i, j, dp[i][j][1]);
		}
	}
	long long sum = 0;
	if(qdist(1, n) == t) sum++;
	for(int i=1;i<=cur;i++)
	{
		int l = t - qdist(exeg[i].first, n);
		if(l >= 1) sum = (sum + dp[l][i][0]) % 1000000007;
		l = t - qdist(exeg[i].second, n);
		if(l >= 1) sum = (sum + dp[l][i][1]) % 1000000007;
	}
	printf("%lld\n", sum);
	return 0;
}
```

:::
