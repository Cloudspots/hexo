---
title: 题解：P14408 [JOISC 2015] IOIOI 卡牌占卜 / IOIOI Cards
date: 2026-10-06 18:24:57
updated: 2026-10-07 21:51:42
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P14408 [JOISC 2015] IOIOI 卡牌占卜 / IOIOI Cards

> 通过  
> 67

---

区间不好操作，考虑差分数组。`I` 变 $0$，`O` 变 $1$。

相当于初始有四个 $1$，每次操作翻转两个位置，变为全零。

注意到操作可交换，同时若操作的一个端点是 $1$ 则相当于移动。两个 $1$ 撞到一起即可消除，这也是唯一的消除方式。

移动就考虑建图。

考虑初始四个位置假设为 $a,b,c,d$，则必然是下列三种情况之一：

- $a,b$ 消除，$c,d$ 消除。
- $a,c$ 消除，$b,d$ 消除。
- $a,d$ 消除，$b,c$ 消除。

对于 $x,y$ 消除，显然代价是 $x,y$ 的最短路。

那么跑三次单源最短路即可。

时间复杂度 $O(n\log n)$。运用正整数权值无向图线性时间单源最短路科技可以做到 $O(n)$，虽然根本不会有人写这个东西。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/301398611)。

```cpp
/*
正 => 0, 反 => 1

考虑异或差分

=> 初始只有 4 个 1。每次操作将选定的两个位置翻转。

先看是否有解。

a, b + a, c => b, c.

显然是图论。

建图。每次可以翻转连通的两个位置。

判断是否有解就做完了。为什么没有判断有没有解的分啊？？

这个拓展也是很简单的吧。

首先三种情况：

a, b, c, d

a&b, c&d
a&c, b&d
a&d, b&c

直接构造不一定是最优的吧 :thinking:

就是最优的。

那你跑最短路就做完了。

时间复杂度 O(n log n)。三次 Dijkstra。
*/
#include <queue>
#include <cstdio>
#include <vector>
#include <utility>
#include <algorithm>

using namespace std;

vector<pair<int, long long>> web[500005];
long long dist[500005];

int main()
{
	int a, b, c, d, e;
	scanf("%d%d%d%d%d", &a, &b, &c, &d, &e);
	// 四个为 1 的位置分别为 a+1, a+b+1, a+b+c+1, a+b+c+d+1.
	int x1 = a + 1, x2 = a + b + 1, x3 = a + b + c + 1, x4 = a + b + c + d + 1;
	int m = a + b + c + d + e + 1; // 点数。
	int n;
	scanf("%d", &n);
	for(int i=1;i<=n;i++)
	{
		int l, r;
		scanf("%d%d", &l, &r);
		// l 和 r+1.
		web[l].push_back({r + 1, r - l + 1});
		web[r + 1].push_back({l, r - l + 1});
	}
	auto dijkstra = [&](int s) -> void
	{
		for(int i=1;i<=m;i++) dist[i] = 0x3f3f3f3f3f3f3f3f;
		dist[s] = 0;
		class node
		{
		public:
			int id;
			long long dst;
			bool operator<(const node &r) const { return dst > r.dst; }
		};
		priority_queue<node> pq;
		pq.push({s, 0});
		while(!pq.empty())
		{
			auto [u, dst] = pq.top();
			pq.pop();
			if(dst != dist[u]) continue;
			for(const auto &[v, w] : web[u])
			{
				if(dst + w < dist[v])
				{
					dist[v] = dst + w;
					pq.push({v, dist[v]});
				}
			}
		}
	}; // 喵！喵！喵！喵！喵！
	dijkstra(x1);
	long long v12 = dist[x2], v13 = dist[x3], v14 = dist[x4];
	dijkstra(x2);
	long long v23 = dist[x3], v24 = dist[x4];
	dijkstra(x3);
	long long v34 = dist[x4];
	long long minn = min({v12 + v34, v13 + v24, v14 + v23});
	printf("%lld\n", minn < 0x3f3f3f3f3f3f3f3f ? minn : -1);
	return 0;
}
```

:::
