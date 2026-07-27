---
title: 题解：CF405E Graph Cutting
date: 2026-3-25 16:12:25
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
首先显然 $m$ 为奇数时无解。

一条链的左右端点都不好考虑，那么在中间考虑。不妨让中间点向两边的点分别连一条有向边。

那么问题转化为给图定向，使得每个点出度都为奇数。

我们考虑先随便定向，然后修正。如何修正呢？反转一条边。这就相当于分别反转两边的出度的奇偶性。不妨设 $1$ 表示奇数，$0$ 表示偶数。

分类讨论。首先如果两边都是 $0$ 则反转不优。如果都是 $1$ 显然反转一次之后都变成偶数。否则，一个 $0$ 和一个 $1$，相当于把 $1$ 移动到 $0$（原本 $1$ 的位置变成 $0$）。

并且，能够操作的图是双向的，也就是原图，而不是定向之后的图。定向的图只是答案而已。

那么我们就搞出一棵生成树，然后考虑把每个 $1$ 移动到根节点然后消掉。实际上实现的时候，如果一个节点 $u$ 的子树中有奇数个 $1$ 那么 $u$ 到父亲的边就需要反转，否则不需要反转。

关于实现：记录一条边是否反转，对于邻接表来说，不太好做。我的实现方法是使用一个 `l2r`（Left to Right）代表这条边的状态是从编号较小的节点指向编号较大的，还是从编号较大的指向编号较小的。

如何输出答案？你已经得到了定向的图。那么，对于每个点的出边，进行两两配对即可。

:::info[sub&code]

[sub](https://codeforces.com/contest/405/submission/368113028)。

```cpp
/*
左右端点都不好考虑，在中间点考虑。

那么，转化为，给图定向，使得每个点的出度都是偶数。

看起来就好做多了。

--

首先随机定向

然后转化为，选择一些边，每选择一条边相当于把两边的值都 ^ 1。

换句话说，每次可以把一个 1 移动到相邻的 0，或者直接删掉相邻的两个 1。

注意是无向图！

那么你搞出一棵生成树，然后每个节点向上跳就行了！
*/
#include <cstdio>
#include <vector>
#include <algorithm>
#include <random>

using namespace std;

constexpr auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

class edge
{
public:
	int u, v, id;
};
bool vis[100005];
vector<edge> web[100005];
bool l2r[100005];
vector<int> gt[100005];
int sz[100005];
bool black[100005];

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	if(m % 2 == 1)
	{
		printf("No solution\n");
		return 0;
	}
	for(int i=1;i<=m;i++)
	{
		int u, v;
		scanf("%d%d", &u, &v);
		web[u].push_back({u, v, i});
		web[v].push_back({v, u, i});
		// deg[u]++; deg[v]++;
		// if(u < v) black[u] ^= 1;
		// else black[v] ^= 1;
		black[u] ^= 1;
		l2r[i] = (u < v);
	}
	auto dfs = U([&](auto self, int u) -> void
	{
		vis[u] = true;
		if(black[u]) sz[u] = 1;
		for(const auto &[_, v, i] : web[u])
		{
			if(!vis[v])
			{
				self(self, v);
				sz[u] += sz[v];
				if(sz[v] & 1) l2r[i] ^= 1;
			}
		}
	});
	dfs(1);
	for(int i=1;i<=n;i++)
	{
		int ltt = -1;
		for(const auto &[_, j, id] : web[i])
		{
			if(i < j && l2r[id] || i > j && !l2r[id])
			{
				if(ltt == -1) ltt = j;
				else
				{
					printf("%d %d %d\n", ltt, i, j);
					ltt = -1;
				}
			}
		}
	}
	return 0;
}
```

:::