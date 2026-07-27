---
title: 题解：P10278 [USACO24OPEN] Painting Fence Posts S
date: 2026-4-22 15:09:31
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
> 如果你看不到图片：关闭你的上网魔法。我题解因为这个被打回，有点生气。

神秘码农题。

首先考虑如何拆出所有边。考虑扫描线，从左往右扫。遇到一批 $x$ 值相同，$y$ 从小到大排序的点 $p_1,p_2,\dots,p_k$，那么：

- 显然 $k$ 一定为偶数。
- 对于任意 $i$，$p_{2i}$ 和 $p_{2i+1}$ 之间有边。然而，$p_k$ 和 $p_1$ **无边**（不是环形的）。
- 存储一个“当前存活的下标”，即当前所有未闭合的横着的直线的左端点。
- 对于任意 $i$，如果有和 $p_i$ 的 $y$ 坐标相同的存活下标，则连边并删除。否则添加。

然后我们重构一下整个多边形，相邻的点放在一起。这个先求出每个点的相邻两个点，然后走一遍即可。前缀和一下很容易就能得到任意两个点的距离。

那么考虑边上的点的距离。我们不妨考虑最复杂的情况，即两个点都在边上。有两种情况：

![](pe2bGmq.png)

$l_1,l_2$ 分别为 $A$ 所在的边的两个端点。$r_1,r_2$ 同理。注意顺序，不妨让 $l_2=l_1+1,r_2=r_1+1$。

那么容易发现，如果某一个点本身就是端点，那么让 $l_1=l_2=A$（$r_1=r_2=B$）即可。

如何找到所在边？对于相同的 $x$ 坐标的点 $p_1,p_2,\dots,p_k$，$p_{2i}$ 和 $p_{2i+1}$ 有边，$y$ 坐标同理。那么在 $x$ 坐标对应的桶中二分这个点所在位置，如果是奇数下标和偶数下标之间则在边上，否则不在（注意 STL 数据结构，如 `std::vector`，是 0-index 的，所以奇偶性要反过来）。如果不在横边上自然就在竖边上了。

注意细节！写代码之前先想好，写代码不要偷懒想当然地认为一种情况不会出现（是有一些情况不会出现，但是要仔细思考），不然就会像我一样调半天调不出来。

:::info[sub&code]

[sub](https://www.luogu.com.cn/record/275048759)。

```cpp
#include <cstdio>
#include <unordered_set>
#include <unordered_map> // USACO 卡哈希吗？？？？
#include <vector>
#include <utility>
#include <algorithm>
// #include <carrot> // carrot!
#include <cassert>
#include <tuple>

class point
{
public:
	long long x, y;
	friend bool operator==(const point &x, const point &y) { return x.x == y.x && x.y == y.y; }
	friend bool operator!=(const point &x, const point &y) { return x.x != y.x || x.y != y.y; }
	friend bool operator<(const point &x, const point &y) { return x.x < y.x || x.x == y.x && x.y < y.y; }
} pts[200005];

namespace std
{
	// template<>
	// class hash<pair<int, int>>
	// {
	// public:
	// 	size_t operator()(const pair<int, int> &x) const { return (((unsigned long long)x.first) << 32) | (unsigned long long) x.second; }
	// };
	template<>
	class hash<point>
	{
	public:
		size_t operator()(const point &x) const { return (((unsigned long long)x.x) << 32) | (unsigned long long) x.y; }
	};
}

class seg
{
public:
	point s, t;
} segs[200005];

using namespace std;

long long dist[200005];
long long mhdist(const point &x, const point &y) { return 0ll + abs(x.x - y.x) + abs(x.y - y.y); }
unordered_map<long long, vector<long long>> xp;
unordered_map<long long, vector<long long>> yp;
long long cnt[200005];
long long ans[200005];

int main()
{
	// freopen("P10278.in", "r", stdin);
	// freopen("P10278.out", "w", stdout);
	unordered_map<point, int> ur;
	int n, p;
	scanf("%d%d", &n, &p);
	unordered_map<long long, long long> um;
	for(int i=1;i<=p;i++)
	{
		int x, y;
		scanf("%d%d", &x, &y);
		pts[i] = {x, y};
		ur[{x, y}] = i;
	}
	sort(pts + 1, pts + p + 1, [](const auto &x, const auto &y) { return x.x < y.x || x.x == y.x && x.y < y.y; });
	vector<point> vt;
	int cur = 0;
	for(int i=1;i<=p + 1;i++)
	{
		if(i == p + 1 || !vt.empty() && pts[i].x != vt.back().x)
		{
			// printf("vt: ");
			// for(const auto &x : vt) printf("(%d, %d) ", x.x, x.y);
			// printf("\n");
			// if(vt.size() % 2 != 0) __debugbreak();
			assert(vt.size() % 2 == 0);
			for(const point &x : vt)
			{
				if(um.count(x.y))
				{
					segs[++cur] = {{um[x.y], x.y}, x};
					// yp[x.y].push_back(um[x.y]);
					// yp[x.y].push_back(x.x);
					// printf("yp[%d] += %d, %d\n", um[x.y], x.x);
				}
			}
			for(int j=0;j<vt.size();j+=2)
			{
				segs[++cur] = {vt[j], vt[j+1]};
				xp[vt[j].x].push_back(vt[j].y);
				xp[vt[j].x].push_back(vt[j+1].y);
				yp[vt[j].y].push_back(vt[j].x);
				yp[vt[j+1].y].push_back(vt[j].x);
				if(!um.count(vt[j].y)) um[vt[j].y] = vt[j].x;
				else um.erase(vt[j].y);
				if(!um.count(vt[j+1].y)) um[vt[j+1].y] = vt[j].x;
				else um.erase(vt[j+1].y);
			}
			vt.clear();
		}
		if(i <= p) vt.push_back(pts[i]);
	}
	assert(um.empty());
	// 成功拆分为线段。
	// for(int i=1;i<=cur;i++)
	// {
	// 	printf("(%d, %d) --- (%d, %d)\n", segs[i].s.x, segs[i].s.y, segs[i].t.x, segs[i].t.y);
	// }
	// 三个样例都是对的。
	unordered_map<point, vector<point>> toto;
	for(int i=1;i<=cur;i++)
	{
		toto[segs[i].s].push_back(segs[i].t);
		toto[segs[i].t].push_back(segs[i].s);
	}
	// printf("cur = %d\n", cur);
	p = 0;
	point fst = pts[1];
	point now = fst, lst = pts[0];
	do
	{
		pts[p = p + 1] = now;
		assert(toto[now].size() == 2);
		point nw = (toto[now][0] != lst ? toto[now][0] : toto[now][1]);
		lst = now;
		now = nw;
	} while(now != fst);
	// for(int i=1;i<=p;i++)
	// {
	// 	printf("(%d, %d)\n", pts[i].x, pts[i].y);
	// }
	// 正确的。
	pts[0] = pts[p];
	for(int i=1;i<=p;i++)
	{
		// printf("pts[%d] = (%d, %d)\n", i, pts[i].x, pts[i].y);
		dist[i] = dist[i-1] + mhdist(pts[i], pts[i-1]);
	}
	for(auto &[x, y] : xp) sort(y.begin(), y.end());
	for(auto &[x, y] : yp) sort(y.begin(), y.end());
	unordered_map<point, int> gid;
	for(int i=1;i<=p;i++) gid[pts[i]] = i;
	// auto cvdist = [&](int x, int y) { return x > y ? y + p - x + 1 : y - x + 1; };
	auto calcdist = [&](int x, int y) { if(x > y) return dist[p] - (dist[x] - dist[y]); else return dist[y] - dist[x]; };
	auto cmindist = [&](int x, int y) { return min(calcdist(x, y), calcdist(y, x)); };
	auto gmindist = [&](int x, int y) { if(calcdist(x, y) < calcdist(y, x)) return 1; else return -1; };
	// auto con = [&](point s, point t, point k) { return mhdist(s, k) + mhdist(t, k) == mhdist(s, t); };
	// auto cdirect = [&](point s, int id) { if(con(pts[(id+p-2)%p + 1], pts[id], s)) return 1; else return -1; };
	// auto gqdist = [&](point x, int l, int r, int v) { return min(cmindist(l, v) + mhdist(pts[l], x), cmindist(r, v) + mhdist(pts[r], x)); };
	// auto cqdist = [&](point x, int l, int r, int v) { printf("[cqdist] x = (%d, %d), l = %d, r = %d, v = %d, lval = %lld + %lld = %lld, rval = %lld\n", x.x, x.y, l, r, v, cmindist(l, v), mhdist(pts[l], x), cmindist(l, v) + mhdist(pts[l], x), cmindist(r, v) + mhdist(pts[r], x)); if(cmindist(l, v) + mhdist(pts[l], x) < cmindist(r, v) + mhdist(pts[r], x)) return l; else return r; };
	for(int i=1;i<=n;i++)
	{
		int x1, y1, x2, y2;
		scanf("%d%d%d%d", &x1, &y1, &x2, &y2);
		int l1, l2, r1, r2;
		if(gid.count({x1, y1})) l1 = l2 = gid[{x1, y1}];
		else
		{
			// 横边？
			if(xp.count(x1) && (lower_bound(xp[x1].begin(), xp[x1].end(), y1) - xp[x1].begin()) % 2 == 1)
			{
				int ir = (lower_bound(xp[x1].begin(), xp[x1].end(), y1) - xp[x1].begin());
				l1 = gid[{x1, xp[x1][ir-1]}];
				l2 = gid[{x1, xp[x1][ir]}];
			}
			else // 竖边！
			{
				if(!yp.count(y1)) abort();
				int ir = (lower_bound(yp[y1].begin(), yp[y1].end(), x1) - yp[y1].begin());
				// if(ir == 0) abort();
				// if(ir == 0)
				// {
					// printf("a = (%d, %d)\n", x1, y1);
					// printf("yp[%d] = ", y1);
					// for(int x : yp[y1]) printf("%d ", x);
					// printf("\n"); fflush(stdout);
					// abort();
				// }
				l1 = gid[{yp[y1][ir-1], y1}];
				l2 = gid[{yp[y1][ir], y1}];
			}
		}
		// if(l1 > l2) swap(l1, l2);
		if(l1 == l2 % p + 1) swap(l1, l2);
		if(gid.count({x2, y2})) r1 = r2 = gid[{x2, y2}];
		else
		{
			// 横边？
			if(xp.count(x2) && (lower_bound(xp[x2].begin(), xp[x2].end(), y2) - xp[x2].begin()) % 2 == 1)
			{
				int ir = (lower_bound(xp[x2].begin(), xp[x2].end(), y2) - xp[x2].begin());
				r1 = gid[{x2, xp[x2][ir-1]}];
				r2 = gid[{x2, xp[x2][ir]}];
			}
			else // 竖边！
			{
				int ir = (lower_bound(yp[y2].begin(), yp[y2].end(), x2) - yp[y2].begin());
				r1 = gid[{yp[y2][ir-1], y2}];
				r2 = gid[{yp[y2][ir], y2}];
			}
		}
		// if(r1 > r2) swap(r1, r2);
		if(r1 == r2 % p + 1) swap(r1, r2);
		// printf("l1 = %d, l2 = %d, r1 = %d, r2 = %d\n", l1, l2, r1, r2); fflush(stdout);
		assert((r2 == r1 % p + 1 || r1 == r2) && (l2 == l1 % p + 1 || l1 == l2));
		assert((pts[l1].x == x1 || pts[l1].y == y1) && (pts[l2].x == x1 || pts[l2].y == y1) && (pts[r1].x == x2 || pts[r1].y == y2) && (pts[r2].x == x2 || pts[r2].y == y2));
		// printf("l1 = %d, l2 = %d, r1 = %d, r2 = %d\n", l1, l2, r1, r2);
		if(l1 != l2 && l1 == r1 && l2 == r2) continue;
		if(l1 == l2 && r1 == r2)
		{
			if(l1 == r1)
			{
				cnt[l1]++;
				cnt[l1+1]--;
				continue;
			}
			if(gmindist(l1, r1) == 1)
			{
				if(l1 <= r1)
				{
					cnt[l1]++;
					cnt[r1+1]--;
				}
				else
				{
					cnt[1]++;
					cnt[r1+1]--;
					cnt[l1]++;
				}
			}
			else
			{
				if(r1 <= l1)
				{
					cnt[r1]++;
					cnt[l1+1]--;
				}
				else
				{
					cnt[1]++;
					cnt[l1+1]--;
					cnt[r1]++;
				}
			}
			continue;
		}
		assert(cmindist(l2, r1) + mhdist(pts[l2], {x1, y1}) + mhdist(pts[r1], {x2, y2}) != cmindist(l1, r2) + mhdist(pts[l1], {x1, y1}) + mhdist(pts[r2], {x2, y2}));
		if(cmindist(l2, r1) + mhdist(pts[l2], {x1, y1}) + mhdist(pts[r1], {x2, y2}) < cmindist(l1, r2) + mhdist(pts[l1], {x1, y1}) + mhdist(pts[r2], {x2, y2}))
		{
			// printf("(%d, %d) -> pts[%d] = (%d, %d) -> ... -> pts[%d] = (%d, %d) -> (%d, %d)\n", x1, y1, l2, pts[l2].x, pts[l2].y, r1, pts[r1].x, pts[r1].y, x2, y2);
			// choose (x1, y1) -> pts[l2] -> pts[r1] -> (x2, y2)
			// that is, l2, l2 + 1, ..., r1
			if(l2 <= r1)
			{
				cnt[l2]++;
				cnt[r1+1]--;
			}
			else
			{
				cnt[1]++;
				cnt[r1+1]--;
				cnt[l2]++;
			}
		}
		else
		{
			// r2, r2 + 1, ..., l1
			// printf("(%d, %d) -> pts[%d] = (%d, %d) -> ... -> pts[%d] = (%d, %d) -> (%d, %d)\n", x2, y2, r2, pts[r2].x, pts[r2].y, l1, pts[l1].x, pts[l1].y, x1, y1);
			if(r2 <= l1)
			{
				cnt[r2]++;
				cnt[l1+1]--;
			}
			else
			{
				cnt[1]++;
				cnt[l1+1]--;
				cnt[r2]++;
			}
		}
	}
	for(int i=1;i<=p;i++)
	{
		ans[ur[pts[i]]] = cnt[i] += cnt[i-1];
		// printf("%d\n", cnt[i] += cnt[i-1]);
	}
	for(int i=1;i<=p;i++)
	{
		printf("%lld\n", ans[i]);
	}
	return 0;
}
// 【数据删除】计算几何题。
```
:::