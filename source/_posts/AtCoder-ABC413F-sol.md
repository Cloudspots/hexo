---
title: 题解：AT_abc413_f [ABC413F] No Passage
date: 2025-7-6 10:53:08
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
> > 存在错别字。四联快
>
> 你说得对但是当我看到的时候这题已经交不了题解了。
>
> 语文不好，亏了。

萌新第一次做 ABC F。

首先 Aoki 和 Takahashi 的操作可以转化为，Takahashi 每次可以向上下左右走，但是 Aoki 可以在每次操作之前禁用 Takahashi 的一个方向。

注意到如果每个格子周围（四联快，下同）都只有最多一个目标点，那么在任何非目标点的起点处都是无解的。这是因为，每当走到一个目标点旁边，Aoki 都禁用掉往那个目标点的方向，这样 Takahashi 永远赢不了。

但是，如果有至少两个是目标点就不一样了！此时 Aoki 禁用掉一个方向之后 Takahashi 可以向另一个方向走！所以 Takahashi 走到这个点一样可以获胜，标记为“一阶目标点”，因为最多只需要走一次就可以到达了。

而如果一个点周围有两个一阶目标点，或者一个一阶目标点和一个零阶目标点（题目中给出的直接目标点，下同）呢？那么这个点就是一个二阶目标点，因为走至多两次就能够到达了。

为什么周围有一个零阶和一个一阶的时候不是一阶？因为可以禁用掉走到零阶的方向。

以此类推。我们发现这不是……多源 bfs 吗？？

只是能够转移到一个点的条件是周围至少两个点是已经标记过的目标点。代码！

```cpp
#include <cstdio>
#include <queue>
#include <cstring>

using namespace std;

int dist[3005][3005];

bool check(int n, int m, int x, int y, int u)
{
	if (x < 1 || y < 1 || x > n || y > m) return false;
	if (dist[x][y] != 0x3f3f3f3f) return false;
	return 
		int(dist[x - 1][y] <= u) + 
		int(dist[x][y - 1] <= u) + 
		int(dist[x + 1][y] <= u) + 
		int(dist[x][y + 1] <= u) 
		>= 2;
}

constexpr int dx[] = { 0, 0, 1, -1 };
constexpr int dy[] = { 1, -1, 0, 0 };

int main()
{
	int h, w, k;
	scanf("%d%d%d", &h, &w, &k);
	queue<pair<int, int>> qp;
	memset(dist, 0x3f, sizeof dist);
	for (int i = 1; i <= k; i++)
	{
		int x, y;
		scanf("%d%d", &x, &y);
		qp.push({ x, y });
		dist[x][y] = 0;
	}
	while (!qp.empty())
	{
		auto u = qp.front();
		qp.pop();
		int x = u.first, y = u.second;
		for (int i = 0; i < 4; i++)
		{
			int ux = x + dx[i], uy = y + dy[i];
			if (check(h, w, ux, uy, dist[x][y]))
			{
				dist[ux][uy] = dist[x][y] + 1;
				qp.push({ ux, uy });
			}
		}
	}
	long long sum = 0;
	for (int i = 1; i <= h; i++)
	{
		for (int j = 1; j <= w; j++)
		{
			if (dist[i][j] != 0x3f3f3f3f) sum += dist[i][j];
		}
	}
	printf("%lld\n", sum);
	return 0;
}
```

[sub](https://atcoder.jp/contests/abc413/submissions/67362347)。