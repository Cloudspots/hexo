---
title: 题解：P17271 [eJOI 2026] Reconstruct
tags:
  - Solutoin
  - Luogu Problem Solution
  - Interactive
  - Tree
categories:
  - Solution
date: 2026-09-07 18:28:55
updated: 2026-09-07 18:28:55
---
> 简单题，红！

---

设 $P$ 为从根节点（任选一个根节点）开始的 DFS 序，得到她需要 $n-1$ 次查询喵……

性质 $1$：对于任意非根节点 $i$，其父节点一定是从它开始的任意一个 DFS 序上，第一个在 $P$ 中排在 $i$ 前面的点喵。

证明非常显然。$\square$

那么你考虑如何优化这个过程喵。

考虑到我们其实遍历了很多无意义的子树。而如果我们从后往前（$P$ 逆序顺序），则它的所有子树的信息我们都是知道的喵！！

那么我们可以处理出子树大小，就可以直接跳过这个子树。那么无意义的跳跃最多有其子树个数个，加上 $1$ 求和再加上开始时求 $P$ 的次数，总共 $3n-2$ 次，足够优秀喵。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/297020407)。

```cpp
/*
key observation:

1. 一个点的父亲一定是从它开始的 DFS 序中，第一个在从根开始的 DFS 序中在它前面的节点。

=> 这样就知道了怎么做，可以通过 Subtask 0~5，同时在 Subtask 6 中获得 20% 的分数。

先 DFS(0)，然后注意到如果从后往前，那么所有点的所有儿子都是它后面的点。而它们的儿子实际上已经求出来了！！所以可以直接跳过去，size 是知道的（每个节点累加到 fa 即可）。

那么最终 DFS(1) 用 n-1 发，每个节点首先一次，然后最多【儿子个数】次，总和至多 n + (n-1)，所以最终是 3n-2 发。过了！！！！！！！！！！！！！！！！！！！！！！！！！！！
*/
#include <vector>
#include <utility>

using namespace std;

int guess(int i, int j);

vector<pair<int, int>> find_tree(int n)
{
    vector<int> sz(n, 1), fa(n, 0), vpos(n, 0);
    vector<int> d0;
    d0.push_back(1);
    for(int i=1;i<n;i++)
    {
        d0.push_back(guess(0, i));
        vpos[d0.back()] = i;
    }
    for(int i=n-1;i>=1;i--)
    {
        int g, pc = 1;
        while(vpos[g = guess(d0[i], pc)] > i) pc += sz[g];
        sz[fa[d0[i]] = g] += sz[d0[i]];
    }
    vector<pair<int, int>> res;
    for(int i=1;i<n;i++) res.push_back({i, fa[i]});
    return res;
}
// 好的，过了
```

:::
