---
title: 题解：AT_abc410_d [ABC410D] XOR Shortest Walk
date: 2025-6-15 09:45:05
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
这题是一个经典题，以前 ABC D 也有过这题，但是数据范围不一样是爆搜。首先讲一下为啥不能像 Dijkstra 或者 Bellman-Ford 一样跑最短路，因为 $\min(x,y)\operatorname{xor}z=\min(x\operatorname{xor}z,y\operatorname{xor}z)$ 可能不成立（如 $\min(1,2)\operatorname{xor}2=1\operatorname{xor}2=3$，但是 $\min(1\operatorname{xor}2,2\operatorname{xor}2)=\min(3,0)=0$），甚至可能重复走。

![](pVAhNdS.png)

这题官方正解我看了一下大概是分层图，但是~~太高级了~~赛时做法不是这个，所以讲一下赛时做法。

对每个节点维护一个“可能的权值”数组（实现时为了速度使用一个 `bitset<1024>` 维护），每次转移就很容易了。问题是图不是 DAG（有向无环图），不能直接 dp，怎么办呢？

其实很多情况下解决这类问题（能 dp，但是状态转移图不是 DAG，并且重复转移可能有影响）的做法是 Bellman-Ford（当然是变种）。

[这是](https://atcoder.jp/contests/abc410/submissions/66750216)这题 Bellman-Ford 代码，时间复杂度太高会超时。下面是队列优化的 Bellman-Ford 代码（即俗称的 SPFA，Shortest Path Fast Algorithm，卡完变成 Scary Path Finding Algorithm），会 AC（在研究怎么卡）：

```cpp
// 又是这个题/fn
// 不过怎么数据范围不太一样了
// 6
#include <cstdio>
#include <vector>
#include <algorithm>
#include <bitset>
#include <iostream>
#include <utility>
#include <queue>
#include <tuple>

using namespace std;

vector<pair<int, int>> web[1005];
bitset<1024> prob[1005];
vector<int> probs[1005];

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	for (int i = 1; i <= m; i++)
	{
		int u, v, w;
		scanf("%d%d%d", &u, &v, &w);
		web[u].push_back({ v, w });
	}
	prob[1] = 1;
	probs[1] = { 0 };
	queue<int> q;
	q.push(1);
	bitset<1024> ngfn;
	while (!q.empty())
	{
		int u = q.front();
		q.pop();
		for (const auto& [v, w] : web[u])
		{
			ngfn.reset();
			for (unsigned g : probs[u])
			{
				ngfn.set(g ^ w);
			}
			if ((prob[v] & ngfn) != ngfn) q.push(v);
			prob[v] |= ngfn;
			probs[v].clear();
			for (int i = 0; i < 1024; i++)
			{
				if (prob[v][i]) probs[v].push_back(i);
			}
		}
	}
	if (probs[n].empty()) printf("-1\n");
	else printf("%u\n", probs[n][0]);
	return 0;
}
// 悲报：LionBLAze 差点写不出来 Bellman-Ford。
```

[sub](https://atcoder.jp/contests/abc410/submissions/66752376)。