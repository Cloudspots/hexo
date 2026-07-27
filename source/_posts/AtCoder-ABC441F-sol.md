---
title: 题解：AT_abc441_f [ABC441F] Must Buy
date: 2026-1-19 13:24:10
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
典中典板子题吧。

你会发现背包这个东西满足交换律和结合律，也就是说你改变物品的顺序并不影响结果。这个东西也是可合并的。无论是总重量恰好为某一个值的背包还是至多为某一个值的背包都是满足的。

显然一个物品必选等价于，如果规定它必然不选，那么一定达不到最优解。也就是对所有除了它的物品做一个背包（重量限制为 $M$），结果达不到原本的最优解。

一个物品必然不选等价于，如果规定它必须选择，那么得到的最优解一定劣与原本的最优解。也就是设其重量为 $w$，价值为 $v$，那么对于除了它之外的物品做一个重量限制为 $M-w$ 的背包，结果加上 $v$ 也达不到最优解。

如果不是上面两种情况，那就显然是可选可不选。

所以我们考虑如何快速求出不包含某个元素的背包。

我们发现，去掉 $i$ 就相当于选择 $i$ 之前和之后的元素。我们就 dp 出一个前缀背包数组和后缀背包数组，对其进行合并。

然而我们发现这样时间复杂度会爆炸。合并是 $\mathcal O(M^2)$ 的。但是我们只需要知道合并的一个前缀最大值，所以我们实际上预处理前缀最大值背包和后缀最大值背包（即，限定了重量的上限而不是重量本身），这样我们只需要求出合并后的结果的一个位置的值就行了。这个是 $\mathcal O(M)$ 的。

总时间复杂度是 $\mathcal O(NM)$。

:::info[代码&提交记录]

[submission](https://atcoder.jp/contests/abc441/submissions/72589418)。

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>

using namespace std;

long long premx[1005][50005], sufmx[1005][50005];
long long p[1005], v[1005], merged[50005];

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	for (int i = 1; i <= n; i++)
	{
		scanf("%lld%lld", p + i, v + i);
	}
	memset(premx, -0x3f, sizeof premx);
	memset(sufmx, -0x3f, sizeof sufmx);
	memset(premx[0], 0, sizeof premx[0]);
	memset(sufmx[n+1], 0, sizeof sufmx[n+1]);
	for (int i = 1; i <= n; i++)
	{
		for (int j = m; j >= 0; j--)
		{
			premx[i][j] = premx[i - 1][j];
			if (j >= p[i]) premx[i][j] = max(premx[i][j], premx[i - 1][j - p[i]] + v[i]);
		}
		for (int j = 1; j <= m; j++)
		{
			premx[i][j] = max(premx[i][j], premx[i][j - 1]);
		}
	}
	for (int i = n; i >= 1; i--)
	{
		for (int j = m; j >= 0; j--)
		{
			sufmx[i][j] = sufmx[i + 1][j];
			if (j >= p[i]) sufmx[i][j] = max(sufmx[i][j], sufmx[i + 1][j - p[i]] + v[i]);
		}
		for (int j = 1; j <= m; j++)
		{
			sufmx[i][j] = max(sufmx[i][j], sufmx[i][j - 1]);
		}
	}
	long long ans = premx[n][m];
	for (int i = 1; i <= n; i++)
	{
		long long maxn = 0;
		for (int k = 0; k <= m; k++)
		{
			if (premx[i - 1][k] + sufmx[i + 1][m - k] > maxn) maxn = premx[i - 1][k] + sufmx[i + 1][m - k];
		}
		if (maxn < ans)
		{
			putchar('A');
			continue;
		}
		maxn = 0;
		for (int k = 0; k <= m - p[i]; k++)
		{
			if (premx[i - 1][k] + sufmx[i + 1][m - p[i] - k] > maxn) maxn = premx[i - 1][k] + sufmx[i + 1][m - p[i] - k];
		}
		if (maxn + v[i] < ans)
		{
			putchar('C');
		}
		else putchar('B');
	}
	return 0;
}
```

:::