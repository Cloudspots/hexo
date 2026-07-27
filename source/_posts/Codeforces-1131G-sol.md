---
title: 题解：CF1131G Most Dangerous Shark
date: 2025-12-12 18:28:33
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
首先考虑只能向左倒。那么显然，如果第 $i$ 个骨牌能够推倒第 $j$ 个，则 $i$ 能推倒的骨牌是 $j$ 的超集。而显然一个骨牌能够推倒的骨牌是一个区间。所以可以建成一棵树。而对于只能向右倒则同理。

我们先忽略这个性质，考虑直接 dp。显然考虑前 $i$ 个骨牌。第 $i$ 个骨牌是一定要推倒的，所以有两种可能：

1. 直接推倒它：预处理出每个骨牌向左推倒能够达到的最远距离 $L_i$ 和向右的 $R_i$，那么 $f_i=\mathrm{cost}_i+f_{L_i-1}$。
2. 由左边的骨牌向右推倒来推倒它：枚举左边推倒的是哪个骨牌（$j$），需要满足 $R_j\ge i$，那么 $f_i=\mathrm{cost}_j+f_{j-1}$。

现在来尝试优化。显然可以树状数组优化但是我们需要线性算法或者卡常带师。我们考虑线性做法。

前者是好办的，而 $R_j\ge i$ 这个条件不是很好办。并且我们会发现，$R_j$ 没有单调性。但是由性质，我们有 $R_j\ge i$ 就必定满足 $R_j\ge R_i$。

而这样，就会发现 $[i,R_i]$ 是 $[j,R_j]$ 的子区间。

可以使用单调栈优化。栈中 dp 值从栈底到栈顶单调不降，而 $R$ 值单调不增。那么首先依次弹出栈顶满足 $R_j<i$ 的元素，如果栈为空则这一项为 $-\infty$，否则为栈顶的 dp 值。

:::info[code&submission]

[sub](https://codeforces.com/contest/1131/submission/353303381)。

```cpp
#include <cstdio>
#include <stack>
#include <algorithm>
#include <cstring>
#include <utility>
#include <vector>
#include <queue>

using namespace std;

long long ht[10000005], cost[10000005];
long long l[10000005], f[10000005];
long long r[10000005];
stack<pair<int, int>> stk;

vector<long long> a[250005], c[250005];

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	for (int i = 1; i <= n; i++)
	{
		int k;
		scanf("%d", &k);
		for (int j = 1; j <= k; j++)
		{
			int aa;
			scanf("%d", &aa);
			a[i].push_back(aa);
		}
		for (int j = 1; j <= k; j++)
		{
			int aa;
			scanf("%d", &aa);
			c[i].push_back(aa);
		}
	}
	int q;
	scanf("%d", &q);
	int cur = 0;
	for (int i = 1; i <= q; i++)
	{
		int id, mul;
		scanf("%d%d", &id, &mul);
		for (int j = 1; j <= c[id].size(); j++)
		{
			ht[j + cur] = a[id][j - 1];
			cost[j + cur] = c[id][j - 1] * mul;
		}
		cur += c[id].size();
	}
	stack<pair<int, int>> qu;
	for (int i = 1; i <= m; i++)
	{
		while (!qu.empty() && qu.top().second >= i - ht[i]) qu.pop();
		if (qu.empty() || i - ht[i] >= qu.top().first) l[i] = max(1ll, i - ht[i] + 1);
		else l[i] = l[qu.top().first];
		qu.push({ i, i - ht[i] });
		//printf("l[%d] = %d, r[%d] = %d\n", i, l[i], i, r[i]);
	}
	while (!qu.empty()) qu.pop();
	for (int i = m; i >= 1; i--)
	{
		while (!qu.empty() && qu.top().second <= i + ht[i]) qu.pop();
		if (qu.empty() || i + ht[i] <= qu.top().first) r[i] = min((long long)m, i + ht[i] - 1);
		else r[i] = r[qu.top().first];
		qu.push({ i, i + ht[i] });
		//printf("l[%d] = %d, r[%d] = %d\n", i, l[i], i, r[i]);
	}
	while (!qu.empty()) qu.pop();
	stack<pair<long long, long long>> stk;
	for (int i = 1;i <= m;i++)
	{
		//printf("cost[%d] = %d\n", i, cost[i]);
		f[i] = f[l[i] - 1] + cost[i];
		while (!stk.empty() && r[stk.top().first] < i) stk.pop();
		if (!stk.empty() && stk.top().second < f[i]) f[i] = stk.top().second;
		if (stk.empty() || f[i - 1] + cost[i] < stk.top().second) stk.push({ i, f[i - 1] + cost[i] });
		//printf("f[%d] = %d\n", i, f[i]);
	}
	printf("%lld\n", f[m]);
	return 0;
}
```

:::