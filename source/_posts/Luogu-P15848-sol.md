---
title: 题解：P15848 [NOISG 2026 Finals] 饿猫 / Famished Cats
date: 2026-09-25 21:24:23
updated: 2026-09-26 19:07:42
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P15848 [NOISG 2026 Finals] 饿猫 / Famished Cats

贪心简单题。

设 $g_i=x-\displaystyle\sum_{j=1}^i d_i+\sum_{j=1}^{i-1} f_i$。其意义是从起点走到 $i$，允许燃料为负，在点 $i$ 加油之前的燃料。

同时交换 $f_i,f_{n-i+1}$ 即为将 $g_{[i+1,n-i+1]}$ 增加 $f_{n-i+1}-f_i$。

我们要进行若干次这样的加法操作，同一个 $i$ 不能重复选，使得在 $g$ 的前缀非负长度最大的前提下操作次数最少。

最大长度是好算的，直接贪心进行所有贡献为正的操作即可。

这个东西是轴对称的，所以可以把对称的两个点合在一起，变成它们的 $\min$。但是若超过了最大长度就可以直接不考虑。那么现在变成每个操作是后缀（当然前缀野性）加法，变成全非负最小次数。

非常简单，每次如果出现了负值，就贪心找到能用且对它有贡献的操作中权值最大的一个。

直接做是 $O(n\log n)$ 的。用线性整数堆之类的东西可以做到 $O(n)$，但我不会。也可以离散化后 vEB 做到 $O(n\log \log n)$，不管。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/299127152)。

```cpp
#include <queue>
#include <cstdio>
#include <utility>
#include <cassert>

using namespace std;

long long d[500005], f[500005], dk[500005], fl[500005], kmin[500005];

int main()
{
	int n;
	long long x;
	scanf("%d%lld", &n, &x);
	long long xo_x = x;
	for(int i=1;i<=n;i++)
	{
		scanf("%lld", d + i);
	}
	for(int i=1;i<=n;i++)
	{
		scanf("%lld", f + i);
		dk[i] = f[i];
	}
	priority_queue<pair<long long, int>> pq;
	int cnt = 0;
	int ans = n;
	// 先算一遍。
	for(int i=1;i<=n;i++)
	{
		if(i <= n / 2 && dk[n-i+1] > dk[i]) swap(dk[i], dk[n-i+1]);
		if(xo_x < d[i])
		{
			ans = i-1;
			break;
		}
		xo_x = xo_x - d[i] + dk[i];
	}
	for(int i=1;i<=n;i++)
	{
		fl[i] = (x = x - d[i] + f[i]) - f[i];
	}
	priority_queue<long long> qp;
	long long delta = 0;
	for(int i=1;i <= n/2 && i <= ans;i++)
	{
		while(fl[i] + delta < 0)
		{
			assert(!qp.empty());
			delta += qp.top();
			qp.pop();
			cnt++;
		}
		if(f[i] < f[n-i+1]) qp.push(f[n-i+1] - f[i]);
		if(n-i+1 <= ans)
		{
			while(fl[n-i+1] + delta < 0)
			{
				assert(!qp.empty());
				delta += qp.top();
				qp.pop();
				cnt++;
			}
		}
	}
	printf("%d %d\n", ans, cnt);
	return 0;
}
```

:::
