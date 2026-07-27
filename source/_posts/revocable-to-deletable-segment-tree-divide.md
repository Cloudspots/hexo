---
title: 从可撤销到可删除——线段树分治
date: 2025-12-31 12:50:32
categories:
  - Algorithm & Theory
tags: []
---
并查集支持撤销，但不支持删除（好像是支持的？但假设我们不会它。毕竟这里并查集可以改成任意可撤销但不可删除的数据结构）。

如果我们硬要删除呢？

## P5227 [AHOI2013] 连通图

给定无向图，每次删边（删除的边数 $\le 4$），求图是否连通。允许离线。询问之间相互独立。$n\le 10^5,m\le 2\times 10^5,q\le 10^5$。

如果只有一个询问呢？并查集板子题。这也提示我们这题大概率需要并查集（也可能不需要因为一个询问 dfs 也能做）。

注意到这个题可以离线，我们考虑离线算法。莫队显然跟这个没有关系。我们考虑依靠时间轴（就比如说永久删边的连通性可以用时光倒流）。

dfs 很适合配合撤销，因为回溯的时候就是在撤销。

我们就考虑按照时间轴分治。诶这样分治树可以看成一棵线段树。

我们可以在线段树的每个节点记录那些边在这个点管辖的区间内一直存在。容易发现，一个节点的父节点记录的集合必然是自身记录的集合的子集（因为一个节点自身管辖的区间必然是其父节点的子集）。那我们就考虑只记录深度最大的位置。也就是说，只有当其父节点没有某条边而自己有的时候才记录。

如图：

![](pZNQO0g.png)

这棵线段树就表示，$e_1$ 从始至终一直存在，$e_2$ 在时间 $1\sim 6$ 都存在（也就是在查询 $7,8$ 时被删除），$e_3$ 在时间 $3,5,6$ 存在（也就是在查询 $1,2,4,7,8$ 被删除），$e_4$ 在时间 $1,3,4,5,6,7,8$ 存在（在查询 $2$ 被删除）。

我们考虑在这个线段树上 dfs。dfs 的过程中维护一个可撤销并查集。并查集可以维护整个图的连通性。dfs 到某个节点的时候加边，dfs 回溯时删边，dfs 到叶子结点则记录答案（我们是按照时间轴进行的，所以每个叶子结点都代表一个询问）。

我们考虑如何记录某个边什么时候存在？显然是若干个区间的并，这些集合没有交集。某个时刻删除了这条边就相当于找到这个时刻所在的区间，将其断开。那么每次删边最多增加一个区间，也就是最后的区间个数为 $\mathcal O(m+\sum c)$，而每个区间放到线段树上就有 $O(\log k)$ 个小区间，所以总共是 $\mathcal O((m+\sum c)\log (m+\sum c))$ 个小区间。后面处理的因为有个不能路径压缩的可持久化并查集要多个 $\log$。实际上跑不满因为如果区间很多则区间都会比较小，放到线段树上区间个数就比较少。

总时间复杂度是两只 $\log$。

:::info[代码&提交记录]

代码比较长（没到 $200$ 行），但应该还比较好看（？）

[record](https://www.luogu.com.cn/record/255904277)。

```cpp
#include <cstdio>
#include <stack>
#include <vector>
#include <utility>
#include <algorithm>
#include <numeric>

using namespace std;

class ufs
{
public:
	int fa[100005], rk[100005];
	int cnt = 0;
	ufs()
	{
		iota(fa, fa + 100005, 0);
	}
	// 不可以路径压缩！
	int getfa(int x) { while (x != fa[x]) x = fa[x]; return x; }
	// 并查集的操作
	class op
	{
	public:
		int x, y, res;
		// res = 0: 无修改
		// res = 1: fa[x] = y
		// res = 2: fa[y] = x
		// res = 3: fa[x] = y, rk[y]++
	};
	stack<op> stk;
	// 可以按秩合并！
	void merge(int x, int y)
	{
		x = getfa(x); y = getfa(y);
		if (x == y)
		{
			stk.push({ x, y, 0 });
			return;
		}
		if (rk[x] < rk[y])
		{
			fa[x] = y;
			stk.push({ x, y, 1 });
			cnt++;
		}
		else if (rk[x] > rk[y])
		{
			fa[y] = x;
			stk.push({ x, y, 2 });
			cnt++;
		}
		else
		{
			fa[x] = y;
			rk[y]++;
			stk.push({ x, y, 3 });
			cnt++;
		}
	}
	void revoke()
	{
		auto g = stk.top();
		stk.pop();
		if (g.res == 0) return;
		if (g.res == 1) fa[g.x] = g.x;
		if (g.res == 2) fa[g.y] = g.y;
		if (g.res == 3)
		{
			fa[g.x] = g.x;
			rk[g.y]--;
		}
		cnt--;
	}
} perfect; // perfect! Perfect!! PERFECT!!!

class splitter
{
public:
	vector<int> pos;
	splitter() { pos.push_back(0); }
	void split(int x) { pos.push_back(x); }
	vector<pair<int, int>> get(int n)
	{
		vector<pair<int, int>> vt;
		pos.push_back(n + 1);
		for (int i = 0; i + 1 < pos.size(); i++)
		{
			if (pos[i] + 1 != pos[i + 1]) vt.push_back({ pos[i] + 1, pos[i + 1] - 1 });
		}
		return vt;
	}
};

class edge
{
public:
	int u, v;
	splitter x;
} egs[200005];

class segtree
{
public:
	vector<int> rgs[400005];
	bool ans[100005];
	ufs u;
	void insert(int l, int r, int vl, int vr, int val, int id)
	{
		if (vl == l && vr == r)
		{
			rgs[id].push_back(val);
			return;
		}
		if (vl <= (l + r) / 2) insert(l, (l + r) / 2, vl, min(vr, (l + r) / 2), val, id * 2);
		if (vr >= (l + r) / 2 + 1) insert((l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, val, id * 2 + 1);
	}
	void solve(int n, int l, int r, int id)
	{
		for (int x : rgs[id])
		{
			u.merge(egs[x].u, egs[x].v);
		}
		if (l == r) ans[l] = u.cnt == n - 1;
		else
		{
			solve(n, l, (l + r) / 2, id * 2);
			solve(n, (l + r) / 2 + 1, r, id * 2 + 1);
		}
		for (int x : rgs[id])
		{
			u.revoke();
		}
	}
} solver;

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	for (int i = 1; i <= m; i++)
	{
		int x, y;
		scanf("%d%d", &x, &y);
		egs[i].u = x;
		egs[i].v = y;
	}
	int k;
	scanf("%d", &k);
	for (int i = 1; i <= k; i++)
	{
		int c;
		scanf("%d", &c);
		for (int j = 1; j <= c; j++)
		{
			int x;
			scanf("%d", &x);
			egs[x].x.split(i);
		}
	}
	for (int i = 1; i <= m; i++)
	{
		auto res = egs[i].x.get(k);
		for (const auto& x : res)
		{
			solver.insert(1, k, x.first, x.second, i, 1);
		}
	}
	solver.solve(n, 1, k, 1);
	for (int i = 1; i <= k; i++)
	{
		printf(solver.ans[i] ? "Connected\n" : "Disconnected\n");
	}
	return 0;
}
```

:::

## P5787 【模板】线段树分治 / 二分图

线段树分治和并查集真是一对好搭档/qq。

可以用带权并查集，也可以用种类并查集。这个蒟蒻从来都不会带权并查集。

## P4588 [TJOI2018] 数学计算

有点线段树。

我们不考虑线段树。

一个数字会在一个区间内作为乘数（从遇到它开始，到它被删除的时刻的前一个时刻，或者到最终时间）。

那么我们做线段树分治时只需要维护一个栈，代表目前线段树每一层的乘积。栈是最能够支持撤销的数据结构。

## P4121 [WC2005] 双面棋盘

这题看着不太像线段树分治，但是可以用线段树分治做。

我们只需要给一个格子三种状态：黑，白，待定。使用并查集造一个数据结构，统计黑色连通块和白色连通块数量，支持把一个待定点改成黑点，把一个待定点改成白点和撤销操作。

这样，在线段树的每个节点，一个格子可能一直是黑，一直是白，或者有时黑有时白。如果一直是同一个颜色就直接加入到这个数据结构中统计黑色连通块和白色连通块数量。否则就以后再处理。

显然到了叶子结点因为只有一个时刻所以不可能出现待定点（这个时刻要么是黑要么是白），可以直接用数据结构的结果。

:::info[并查集和神秘数据结构]
class ufs
{
public:
    int fa[40005], rk[40005];
    int ltks;
    class state
    {
    public:
        int rfid, rfval, rkid, rkval, rltk;
    };
    stack<state> stk;
    ufs()
    {
        iota(fa, fa + 40005, 0);
        fill(rk, rk + 40005, 0);
    }
    void setltks(int x) { ltks = x; }
    int getfa(int x) const { while(x != fa[x]) x = fa[x]; return x; }
    void merge(int x, int y)
    {
        x = getfa(x); y = getfa(y);
        if(x == y)
        {
            stk.push({0, 0, 0, 0, ltks});
            return;
        }
        if(rk[x] < rk[y])
        {
            stk.push({x, fa[x], 0, 0, ltks});
            fa[x] = y;
            ltks--;
        }
        else if(rk[x] > rk[y])
        {
            stk.push({y, fa[y], 0, 0, ltks});
            fa[y] = x;
            ltks--;
        }
        else
        {
            stk.push({x, fa[x], y, rk[y], ltks});
            fa[x] = y;
            rk[y]++;
            ltks--;
        }
    }
    void recall()
    {
        fa[stk.top().rfid] = stk.top().rfval;
        rk[stk.top().rkid] = stk.top().rkval;
        ltks = stk.top().rltk;
        stk.pop();
    }
};

class mysterious_ds
{
public:
    ufs u0, u1;
    class state
    {
    public:
        int c0c, c1c, x, y;
    };
    stack<state> cnts;
    int a[205][205];
    mysterious_ds()
    {
        for(int i=0;i<205;i++) for(int j=0;j<205;j++) a[i][j] = -1;
    }
    void recall()
    {
        for(int x=0;x<cnts.top().c0c;x++) u0.recall();
        for(int x=0;x<cnts.top().c1c;x++) u1.recall();
        a[cnts.top().x][cnts.top().y] = -1;
        if(cnts.top().c0c+1) u1.ltks++;
        else u0.ltks++;
        cnts.pop();
    }
    constexpr int getid(int x, int y) const { return (x-1) * 200 + y; }
    void set(int x, int y, int v, int n)
    {
        a[x][y] = v;
        ufs &ax = (v == 0 ? u0 : u1);
        int ccc = 0;
        if(x > 1 && a[x-1][y] == a[x][y]) { ax.merge(getid(x, y), getid(x-1, y)); ccc++; }
        if(x < n && a[x+1][y] == a[x][y]) { ax.merge(getid(x, y), getid(x+1, y)); ccc++; }
        if(y > 1 && a[x][y-1] == a[x][y]) { ax.merge(getid(x, y), getid(x, y-1)); ccc++; }
        if(y < n && a[x][y+1] == a[x][y]) { ax.merge(getid(x, y), getid(x, y+1)); ccc++; }
        if(v == 0) u1.ltks--;
        else u0.ltks--;
        if(v == 0) cnts.push({ccc, -1, x, y});
        else cnts.push({-1, ccc, x, y});
    }
} md;
:::