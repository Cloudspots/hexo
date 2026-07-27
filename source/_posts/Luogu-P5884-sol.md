---
title: P5884 [IOI 2014] game 游戏 题解
date: 2026-5-3 14:22:56
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
比较复杂，但是还算好想。目前题解区没有。不需要惊人的注意力，也不需要离线（模拟赛做的是交互版本，无法离线）。

首先，显然我们要实现的效果是，最后一条边（最后一个询问）决定了整个图是否连通。也就是说，考虑除了最后一条边之外的所有边：

- 图有两个连通分量。
- 最后一条边连接这两个连通分量。

那么我们的想法就是，让两个连通分量在最后一条可能的边的时候再连上！也就是对于一条边，如果它两边不属于同一个连通分量（如果属于则这条边是什么都不影响答案），那么如果这条边没有则两边不可能连通（即，考虑所有目前没有删除的边，即所有存在和未确定的边后，这条边是一条割边），则使这条边存在。否则不存在。

这样时间复杂度会爆炸，我们总不能每次询问跑一遍 DFS 判断连通吧。不过好在我们可以弱化条件。

我们考虑最后只有两个连通块，那么连接这两个连通块的只可能是直接连接这两个连通块之内的点的边（即，不可能出现 $u\to w\to v$ 的中转情况）。那么我们设 $c_{i,j}$ 为，编号为 $i$ 的连通块和编号为 $j$ 的连通块之间有多少条还未决定的边（因为是两个不同的连通块，所以必然没有直接相连的边，所以也就是有多少条未被删除的边）。这个编号是什么我们待会再看，先设为 $\text{id}_u$。如果 $c_{\text{id}_u,\text{id}_v}>1$，则这条边不要，同时让 $c_{\text{id}_u,\text{id}_v}$ 减少 $1$。否则，这条边必须选上。

我们考虑选上一条边时 $c$ 如何变化。假设我们合并了 $i$ 和 $j$，新的编号为 $i'$，则对于所有 $k$ 都有 $c_{i',k}=c_{i,k}+c_{j,k}$ 和 $c_{k,i'}=c_{k,i}+c_{k,j}$（两者对称）。

既然只需要合并连通块，和寻找节点所在连通块的编号，那么显然并查集就好了。$i'$ 就是根节点。

还没完，还需要证明时间复杂度。显然只会有 $O(n)$ 次连通块合并，所以合并所带来的时间复杂度是 $O(n^2+n\alpha (n))=O(n^2)$（$\alpha$ 是并查集带来的时间复杂度）。而其余操作耗时只有并查集判断连通性。总时间复杂度为 $O(n^2\alpha(n))$。可过。

这里只给出关键代码，否则会非常丑陋，因为我把 grader 和头文件直接粘贴到代码里面了，才能在洛谷上提交。可以看提交记录获取完整代码。

:::info[rec&code]
[rec](https://www.luogu.com.cn/record/276419754)。

```cpp
#pragma GCC optimize("Ofast")
#include "game.h"
#include <vector>
#include <algorithm>
#include <numeric>
#include <set>

using namespace std;

int fa[1505], rk[1505];
int getfa(int x) { while(x != fa[x]) x = fa[x] = fa[fa[x]]; return x; }
int merge(int x, int y) { x = getfa(x); y = getfa(y); if(x == y) return -1; if(rk[x] < rk[y]) { fa[x] = y; return y; } else if(rk[y] < rk[x]) { fa[y] = x; return x; } else { fa[x] = y; rk[y]++; return y; }}

int N;
int cnt[1505][1505];
set<int> alive;

void initialize(int n)
{
	N = n;
	iota(fa, fa + n + 5, 0);
	for(int i=0;i<n;i++)
	{
		alive.insert(i);
		for(int j=0;j<n;j++)
		{
			cnt[i][j] = 1;
		}
	}
}


int hasEdge(int u, int v)
{
	// printf("u = %d, v = %d, getfa(%d) = %d, getfa(%d) = %d, cnt[%d][%d] = %d\n", u, v, u, getfa(u), v, getfa(v), getfa(u), getfa(v), cnt[getfa(u)][getfa(v)]);
	if(getfa(u) == getfa(v) || cnt[getfa(u)][getfa(v)] > 1)
	{
		cnt[getfa(u)][getfa(v)]--;
		cnt[getfa(v)][getfa(u)]--;
		return 0;
	}
	else
	{
		if(getfa(u) == getfa(v)) return 1;
		int s = getfa(u) + getfa(v);
		int t = merge(u, v), r = s - t;
		for(int k : alive)
		{
			cnt[t][k] += cnt[r][k];
			cnt[k][t] += cnt[k][r];
		}
		alive.erase(r);
		return 1;
	}
}
// 你需要写一个自适应交互库.jpg
```
:::