---
title: 题解：AT_abc441_d [ABC441D] Paid Walk
date: 2026-1-19 13:41:21
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
每个点的出度不大于 $4$。起点是固定的（$1$）。

这是在干什么？

这样因为一共只会经过 $L$ 个点，所以从 $1$ 开始的不同路径数量最多是 $4^L\le 1048576$。

那么你使用 DFS 暴力枚举路径，在中途记录还需要经过多少个点和当前的边权之和，枚举到路径结尾的时候判断是否符合条件即可。时间复杂度 $\mathcal O(N+M+4^L)$。

:::info[代码&提交记录]

[submission](https://atcoder.jp/contests/abc441/submissions/72528702)。

```cpp
#include <cstdio>
#include <algorithm>
#include <utility>
#include <vector>

using namespace std;

vector<pair<int, long long>> web[200005];
bool ans[200005];

void dfs(int u, int l, long long s, long long t, long long sum)
{
	if (l == 0)
	{
		if (s <= sum && sum <= t) ans[u] = true;
		return;
	}
	for (auto [v, w] : web[u])
	{
		dfs(v, l - 1, s, t, sum + w);
	}
}

int main()
{
	int n, m, l;
	long long s, t;
	scanf("%d%d%d%lld%lld", &n, &m, &l, &s, &t);
	for (int i = 1; i <= m; i++)
	{
		int u, v, w;
		scanf("%d%d%d", &u, &v, &w);
		web[u].push_back({ v, w });
	}
	dfs(1, l, s, t, 0);
	for (int i = 1; i <= n; i++)
	{
		if (ans[i]) printf("%d ", i);
	}
	return 0;
}
```

:::