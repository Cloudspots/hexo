---
title: 题解：P10801 [CEOI 2024] 海战 a.k.a 对某树学校模拟赛在评测机性能不如 CCF 的情况下搬大模拟大卡常且不开大时空限制且不使用额外优化的严正谴责
tags:
  - Luogu P Problem Solution
  - Solution
categories:
  - Solution
date: 2026-07-29 17:18:57
updated: 2026-07-29 17:18:57
---
> 洛谷 $2.8\mathrm{s}$，模拟赛挂成 $50$？？

---

首先考虑两艘船什么情况下会撞上。

不妨假设船 $A$ 向右。显然有三种情况：

- $B$ 向左，其 $y$ 坐标相同。
- $B$ 向下，其 $x+y$ 相同。
- $B$ 向上，其 $x-y$ 相同。

计算可以使用 `set` 快速求解。

同时，注意到两艘船除非其中一艘撞上了其它船消失了，否则必然会相撞。特别地，“预计相撞事件”最早的船必然会撞上。

那么我们维护每艘船预计和哪些船相撞。每次取出预计相撞事件最早的船，同时对于预计和它们相撞但是预计相撞事件更晚的船更新预计相撞的船和时间。

思路只有黄题难度，难点在代码和卡常。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/289349529)。

```cpp
// 前几天看过这个题，但是没做，怎么说（
/*
每头战舰之多有四头相撞的“候选战舰”

显然，“预测相撞时间”最小的战舰一定会相撞

我们先让它撞上，然后这两头战舰爆了

但是这两头战舰也可能是一些战舰的候选战舰，这时要修改它们的候选战舰。

用可删堆维护每个战舰的预测相撞时间即可。
*/
/*
如何求解候选战舰和预测相撞时间？

显然只要求出候选战舰就可以求出相撞时间。

不妨假设这头战舰向右。那么

1. 它右边的向左的战舰中最靠左的一个。换句话说，和它 y 坐标相同的向左的战舰中，x 坐标的 lower_bound(它的 x 坐标)
2. 它正右下方的向上的战舰中最靠上的一个。换句话说，和它 x-y 相同的向上的战舰中，x 坐标的 lower_bound(x)
3. 它正右上方……最靠下的一个。换句话说，和它 x+y 相同的向下的战舰中，x 坐标的 lower_bound(x)。

于是我们维护

- 所有出现过的 y 坐标中，所有向左和向右的战舰的 y 坐标的 set
- x 坐标同理，向上和向下
- x-y 和 x+y 上下左右都要。

常数很大，但是值得一试。

其实也没很大……每头战舰最多处于 3 个 set 中。
*/
#include <cstdio>
#include <set>
#include <map>
#include <queue>
#include <bitset>
#include <algorithm>
#ifdef LB_IS_TIMING
#include <chrono>
#endif

using namespace std;

class fish // ?? little cyan fish ??
{
public:
	int x, y, id;
	enum { U, D, L, R } d;
} fsh[200005];
namespace cmps
{
	class xinc
	{
	public:
		bool operator()(const fish &x, const fish &y) const { return x.x < y.x || x.x == y.x && x.id < y.id; }
	};
	// class xdec
	// {
	// public:
	// 	bool operator()(const fish &x, const fish &y) const { return x.x > y.x || x.x == y.x && x.id < y.id; }
	// };
	class yinc
	{
	public:
		bool operator()(const fish &x, const fish &y) const { return x.y < y.y || x.y == y.y && x.id < y.id; }
	};
	// class ydec
	// {
	// public:
	// 	bool operator()(const fish &x, const fish &y) const { return x.y > y.y || x.y == y.y && x.id < y.id; }
	// };
}

set<fish, cmps::yinc> xpyu[200005], xpyd[200005], xpyl[200005], xpyr[200005];
set<fish, cmps::xinc> xmyu[200005], xmyd[200005], xmyl[200005], xmyr[200005];
set<fish, cmps::yinc> xu[200005], xd[200005];
set<fish, cmps::xinc> yl[200005], yr[200005];
int qsx[200005], qsy[200005], qsxpy[200005], qsxmy[200005];
set<pair<int, int>> stx;
set<int> frm[200005];
vector<int> rto[200005];
bitset<200005> del;
int tvxy[200005], txpy[200005], txmy[200005];

int main()
{
#ifdef LB_IS_TIMING
	auto bgn = chrono::high_resolution_clock::now();
#endif
	int n;
	scanf("%d", &n);
	map<int, int> lsx, lsy, lsxpy, lsxmy;
	for(int i=1;i<=n;i++)
	{
		char ch;
		scanf("%d%d %c", &fsh[i].x, &fsh[i].y, &ch);
		fsh[i].d = (ch == 'N' ? fish::U : (ch == 'S' ? fish::D : (ch == 'W' ? fish::L : fish::R)));
		fsh[i].id = i;
		if(fsh[i].d == fish::U || fsh[i].d == fish::D) lsx[fsh[i].x];
		if(fsh[i].d == fish::L || fsh[i].d == fish::R) lsy[fsh[i].y];
		lsxpy[fsh[i].x + fsh[i].y];
		lsxmy[fsh[i].x - fsh[i].y];
	}
	int curx = 0, cury = 0, curxpy = 0, curxmy = 0;
	for(auto &[x, y] : lsx) qsx[y = ++curx] = x;
	for(auto &[x, y] : lsy) qsy[y = ++cury] = x;
	for(auto &[x, y] : lsxpy) qsxpy[y = ++curxpy] = x;
	for(auto &[x, y] : lsxmy) qsxmy[y = ++curxmy] = x;
	for(int i=1;i<=n;i++)
	{
		switch(fsh[i].d)
		{
		case fish::U: tvxy[i] = lsx[fsh[i].x]; txpy[i] = lsxpy[fsh[i].x + fsh[i].y]; txmy[i] = lsxmy[fsh[i].x - fsh[i].y]; xpyu[txpy[i]].insert(fsh[i]); xmyu[txmy[i]].insert(fsh[i]); xu[tvxy[i]].insert(fsh[i]); break;
		case fish::D: tvxy[i] = lsx[fsh[i].x]; txpy[i] = lsxpy[fsh[i].x + fsh[i].y]; txmy[i] = lsxmy[fsh[i].x - fsh[i].y]; xpyd[txpy[i]].insert(fsh[i]); xmyd[txmy[i]].insert(fsh[i]); xd[tvxy[i]].insert(fsh[i]); break;
		case fish::L: tvxy[i] = lsy[fsh[i].y]; txpy[i] = lsxpy[fsh[i].x + fsh[i].y]; txmy[i] = lsxmy[fsh[i].x - fsh[i].y]; xpyl[txpy[i]].insert(fsh[i]); xmyl[txmy[i]].insert(fsh[i]); yl[tvxy[i]].insert(fsh[i]); break;
		case fish::R: tvxy[i] = lsy[fsh[i].y]; txpy[i] = lsxpy[fsh[i].x + fsh[i].y]; txmy[i] = lsxmy[fsh[i].x - fsh[i].y]; xpyr[txpy[i]].insert(fsh[i]); xmyr[txmy[i]].insert(fsh[i]); yr[tvxy[i]].insert(fsh[i]); break;
		}
	}
	auto qdist = [&](int x, int y) { return abs(fsh[x].x - fsh[y].x) + abs(fsh[x].y - fsh[y].y); };
	auto cpk = [&](int id) -> vector<int>
	{
		int qa = -1, qb = -1, qc = -1;
		switch(fsh[id].d)
		{
		case fish::U: { auto it = xd[tvxy[id]].lower_bound(fsh[id]); if(it != xd[tvxy[id]].begin()) qa = prev(it)->id; else qa = -1; } { auto it = xpyl[txpy[id]].lower_bound(fsh[id]); if(it != xpyl[txpy[id]].begin()) qb = prev(it)->id; else qb = -1; } { auto it = xmyr[txmy[id]].lower_bound(fsh[id]); if(it != xmyr[txmy[id]].begin()) qc = prev(it)->id; else qc = -1; } break;
		case fish::D: { auto it = xu[tvxy[id]].lower_bound(fsh[id]); if(it != xu[tvxy[id]].end()) qa = it->id; else qa = -1; } { auto it = xpyr[txpy[id]].lower_bound(fsh[id]); if(it != xpyr[txpy[id]].end()) qb = it->id; else qb = -1; } { auto it = xmyl[txmy[id]].lower_bound(fsh[id]); if(it != xmyl[txmy[id]].end()) qc = it->id; else qc = -1; } break;
		case fish::L: { auto it = yr[tvxy[id]].lower_bound(fsh[id]); if(it != yr[tvxy[id]].begin()) qa = prev(it)->id; else qa = -1; } { auto it = xpyu[txpy[id]].lower_bound(fsh[id]); if(it != xpyu[txpy[id]].end()) qb = it->id; else qb = -1; } { auto it = xmyd[txmy[id]].lower_bound(fsh[id]); if(it != xmyd[txmy[id]].begin()) qc = prev(it)->id; else qc = -1; } break;
		case fish::R: {	auto it = yl[tvxy[id]].lower_bound(fsh[id]); if(it != yl[tvxy[id]].end()) qa = it->id; else qa = -1; } { auto it = xpyd[txpy[id]].lower_bound(fsh[id]);	if(it != xpyd[txpy[id]].begin()) qb = prev(it)->id;	else qb = -1; } { auto it = xmyu[txmy[id]].lower_bound(fsh[id]); if(it != xmyu[txmy[id]].end()) qc = it->id; else qc = -1; } break;
		};
		vector<int> res;
		if(qa != -1)
		{
			if(!res.empty() && qdist(id, res[0]) > qdist(id, qa)) res.clear();
			if(res.empty() || qdist(id, res[0]) == qdist(id, qa)) res.push_back(qa);
		}
		if(qb != -1)
		{
			if(!res.empty() && qdist(id, res[0]) > qdist(id, qb)) res.clear();
			if(res.empty() || qdist(id, res[0]) == qdist(id, qb)) res.push_back(qb);
		}
		if(qc != -1)
		{
			if(!res.empty() && qdist(id, res[0]) > qdist(id, qc)) res.clear();
			if(res.empty() || qdist(id, res[0]) == qdist(id, qc)) res.push_back(qc);
		}
		return res;
	};
	auto vrec = [&](int i)
	{
		rto[i] = cpk(i);
		for(int x : rto[i])
		{
			frm[x].insert(i);
		}
		if(!rto[i].empty()) stx.insert({qdist(i, rto[i][0]), i});
	};
	for(int i=1;i<=n;i++)
	{
		vrec(i);
	}
	// while(true);
	while(!stx.empty())
	{
		int u = stx.begin()->second;
		stx.erase(stx.begin());
		// printf("remove %d (with %d)\n", u, rto[u]); fflush(stdout);
		if(del[u]) continue;
		switch(fsh[u].d)
		{
		case fish::U: xpyu[txpy[u]].erase(fsh[u]); xmyu[txmy[u]].erase(fsh[u]); xu[tvxy[u]].erase(fsh[u]); break;
		case fish::D: xpyd[txpy[u]].erase(fsh[u]); xmyd[txmy[u]].erase(fsh[u]); xd[tvxy[u]].erase(fsh[u]); break;
		case fish::L: xpyl[txpy[u]].erase(fsh[u]); xmyl[txmy[u]].erase(fsh[u]); yl[tvxy[u]].erase(fsh[u]); break;
		case fish::R: xpyr[txpy[u]].erase(fsh[u]); xmyr[txmy[u]].erase(fsh[u]); yr[tvxy[u]].erase(fsh[u]); break;
		}
		del[u] = true;
		for(int x : rto[u])
		{
			switch(fsh[x].d)
			{
			case fish::U: xpyu[txpy[x]].erase(fsh[x]); xmyu[txmy[x]].erase(fsh[x]); xu[tvxy[x]].erase(fsh[x]); break;
			case fish::D: xpyd[txpy[x]].erase(fsh[x]); xmyd[txmy[x]].erase(fsh[x]); xd[tvxy[x]].erase(fsh[x]); break;
			case fish::L: xpyl[txpy[x]].erase(fsh[x]); xmyl[txmy[x]].erase(fsh[x]); yl[tvxy[x]].erase(fsh[x]); break;
			case fish::R: xpyr[txpy[x]].erase(fsh[x]); xmyr[txmy[x]].erase(fsh[x]); yr[tvxy[x]].erase(fsh[x]); break;
			}
			del[x] = true;
		}
		for(int x : frm[u])
		{
			if(del[x]) continue;
			stx.erase({qdist(x, u), x});
			vrec(x);
		}
		frm[u].clear();
		for(int x : rto[u])
		{
			for(int v : frm[x])
			{
				if(del[v]) continue;
				stx.erase({qdist(v, x), v});
				vrec(v);
			}
			frm[x].clear();
		}
	}
	for(int i=1;i<=n;i++) if(!del[i]) printf("%d\n", i);
#ifdef LB_IS_TIMING
	fprintf(stderr, "Time: %llu ms\n", chrono::duration_cast<chrono::milliseconds>(chrono::high_resolution_clock::now() - bgn).count());
#endif
	return 0;
}
```

:::
