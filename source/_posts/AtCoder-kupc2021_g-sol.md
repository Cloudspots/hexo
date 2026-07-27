---
title: 题解：AT_kupc2021_g Two Step Sort
date: 2026-7-16 15:13:03
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
我们两次操作，每次选择一个球的集合，重排之。最终的目标是把排列转化为恒等排列 $p_i=i$。

排列的问题考虑转为若干轮换。

显然各个轮换之间互不影响，我们考虑一个轮换怎么做。

我们考虑一次操作能够成功复位哪些元素。如果有 $i$ 需要满足选中的下标和值同时有 $i$。

也就是说，我们能且仅能复位所有下标和值的子集。

那么如果是一个连续段，其实就是这个连续段去掉开头。因为没有下标为开头的下标的值。

也就是说，第一轮选择的元素需要花费其 $A$ 的代价，其余需要花费 $B$ 的代价，但是每个第一次选中的连续段的开头要多花 $B$ 的代价。

这样我们断环成链，分类讨论一下最后一个元素是否选择（为了确定选择第一个元素是否需要额外代价），DP 即可。

时间复杂度 $O(n)$。

:::info[sub&code]

[sub](https://atcoder.jp/contests/kupc2021/submissions/77517970)。

```cpp
/*
给定一个排列

进行两次操作，每次选择若干个元素，重排之。

每次操作选择每个元素的代价都不同。

目标是 1~n 排序。

---

考虑 g <= 2

这个排列是由若干个二元环和自环构成的。

自环显然可以忽略。二元环？

显然，每次操作可以让选中的下标和值域的交集满足条件。

那一个二元环要么全选，要么全不选。如果只选一个显然没有用。

那么只需要确定每个二元环在第一轮的时候选还是第二轮即可。

---

考虑 g <= 10

由 g <= 2，我们知道每个环是相互独立的。

那么对于每个环，我们暴力 2^g 枚举一下哪些点在第一轮选择即可。

---

考虑无特殊性质。

显然要加速环的求解过程。

注意到假设一次选择的为若干个连续段，那么真正生效的就是这些连续段去掉开头。

我们考虑 dp。分类讨论结尾选或不选即可。
*/
#include <cstdio>
#include <bitset>
#include <vector>
#include <algorithm>

using namespace std;

int p[100005];
bitset<100005> vis;
long long x[100005], y[100005];
long long dp[100005][2];

int main()
{
	int n;
	scanf("%d", &n);
	for(int i=1;i<=n;i++)
	{
		int gg;
		scanf("%d", &gg);
		p[i] = gg;
	}
	for(int i=1;i<=n;i++)
	{
		scanf("%lld", x + i);
	}
	for(int i=1;i<=n;i++)
	{
		scanf("%lld", y + i);
	}
	long long sum = 0;
	for(int i=1;i<=n;i++)
	{
		if(vis[i]) continue;
		vector<int> vt;
		int g = i;
		do
		{
			vt.push_back(g);
			g = p[g];
			vis[g] = true;
		} while(g != i);
		if(vt.size() == 1) continue; // 无需操作
		// 末尾不选
		for(int j=0;j<vt.size();j++)
		{
			if(j == 0)
			{
				dp[j][0] = y[vt[j]];
				dp[j][1] = x[vt[j]] + y[vt[j]];
			}
			else if(j + 1 < vt.size())
			{
				dp[j][0] = min(dp[j-1][0], dp[j-1][1]) + y[vt[j]];
				dp[j][1] = min(dp[j-1][1], dp[j-1][0] + y[vt[j]]) + x[vt[j]];
			}
			else
			{
				dp[j][0] = min(dp[j-1][0], dp[j-1][1]) + y[vt[j]];
				dp[j][1] = 0x3f3f3f3f3f3f3f3f;
			}
			// printf("[No choose] dp[%d][0] = %lld, dp[%d][1] = %lld\n", vt[j], dp[j][0], vt[j], dp[j][1]);
		}
		long long alpha = dp[vt.size()-1][0];
		// 末尾选
		for(int j=0;j<vt.size();j++)
		{
			if(j == 0)
			{
				dp[j][0] = y[vt[j]];
				dp[j][1] = x[vt[j]];
			}
			else if(j + 1 < vt.size())
			{
				dp[j][0] = min(dp[j-1][0], dp[j-1][1]) + y[vt[j]];
				dp[j][1] = min(dp[j-1][1], dp[j-1][0] + y[vt[j]]) + x[vt[j]];
			}
			else
			{
				dp[j][0] = 0x3f3f3f3f3f3f3f3f;
				dp[j][1] = min(dp[j-1][1], dp[j-1][0] + y[vt[j]]) + x[vt[j]];
			}
			// printf("[Choose] dp[%d][0] = %lld, dp[%d][1] = %lld\n", vt[j], dp[j][0], vt[j], dp[j][1]);
		}
		sum += min(alpha, dp[vt.size()-1][1]);
	}
	printf("%lld\n", sum);
	return 0;
}
```

:::