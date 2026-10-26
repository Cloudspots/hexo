---
title: 题解：P14434 [JOISC 2013] 建设项目 / Construction Project
date: 2026-10-16 22:02:17
updated: 2026-10-16 22:02:17
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P14434 [JOISC 2013] 建设项目 / Construction Project

:::info[烂题]

> > 一道好题不应该是两道题拼在一起，一道好题会有自己的 idea——而它应该不加过多包装地突出这个 idea．
> >
> > 一道好题应该新颖．真正的好题，应该是能让人脑洞出新的好题的好题．
> >
> > ——[vfk《UOJ 精神之源流》](https://vfleaking.blog.uoj.ac/blog/909)
>
> 例子：[「XR-1」柯南家族](https://www.luogu.com.cn/problem/P5346)，做法的前后两部分完全割裂，前半部分为 [「模板」树上后缀排序](https://www.luogu.com.cn/problem/P5353)，后半部分是经典树上问题．就算是随意输入树的点权，依然可以做第二部分，前后部分没有联系．
>
> ——[OI-wiki](https://oi-wiki.org/contest/problemsetting/)。

:::

烂题。

---

首先用扫描线建图。

现在问题转化为：

给定一个正权无向图 $G$，每次询问新增一个点 $S$（每次询问独立。其意义在于，建造国际机场就相当于向 $S$ 连边），将 $G$ 中每个点和 $S$ 连边，每条新连的边边权均为 $v$（每次询问给定）。在限定 $S$ 的度数不能超过 $k$（每次询问给定）的情况下，求 $G$ 的 MST 边权之和。

定理：先求出原图 $G$ 的 MST（此处指最小生成森林）为 $T$，设其连通块数量为 $c$，则：

1. 有解 $\iff k\ge c$。
2. 若有解，则最优解 $T'$ 为，先取出 $T$ 中所有权值 $>v$ 的边，将其从大到小排序为 $E_{1\dots p}$，则将 $E$ 中前 $\min(p,k-c)$ 条边断开，剩下的连通块都随便选个点和 $S$ 连边。

定理的第一部分是非常好证明的。第二部分有（至少）三种证明：

1. 从 Kruskal 的过程理解。
2. 从 Prim 的过程理解。
3. 考虑下面的证明。

:::info[Third Proof]

首先有一个显然的引理：如果在图中不断加边，维护最小生成森林 $T$，则一条边如果已经被加到图中了，但是在某一时刻并不在 $T$ 中，则之后也不会在 $T$ 中出现了。同时，一条边加入的时候要么最开始就没加到 $T$ 中，要么连通了两个不连通的连通块，要么替换掉了它在树上的一个环中边权最大的边（即删除那条边，同时加上这条边）。前两种情况对 MST 的边权之和都没有有意义的贡献（第二种情况的贡献没有意义），第三种情况有。

那么考虑从原本的 MST $T$ 开始，加上所有和 $S$ 连的边。我们的目标是最大化第三种情况的贡献（这里贡献的含义是，让 MST 的边权之和减少了多少）。

首先对于所有连通块乱连边，使 $T$ 为一棵树。我们还剩下 $k-c$ 条边用于替换。

显然只能替换掉 $T$ 中边权比 $v$ 大的边。那么，找到边权最大的边，设其连接 $u$ 和 $v$。断开这条边后必然有且仅有一个点和 $S$ 不连通了，此时让这个连通块中的任意一个点和 $S$ 连边，完成替换。

这样我们就可以替换掉 $T$ 中边权最大的 $k-c$ 条边，显然这是最优的。$\square$

:::

于是我们直接从大到小对于 MST 中的所有边排序，然后二分即可，时间复杂度 $O((n+m+q)\log (n+m))$。

然后你发现代码比思维难多了。主要是建图。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/303455046)。

```cpp
/*
转为 MST.

相当于在原图的基础上，所有点和一个特殊点连边，普通点和特殊点之间的边权相同但每次询问不同，且特殊点度数有限制？？

特殊点度数有限制太难做了。

MST 的性质是优秀的。考虑一下，首先掏出每个连通块和对应的边，然后选择前 k 条边替换为特殊边……这对吗？

先求，然后替换？

模拟样例。

哦，这个实际上相当于，加边 MST。

这个可做。

那你不就做完了吗。

什么玩意在 1h 之内获得 200 pts？？T2 你完了。
*/
// 有点难写，要写线段树+扫描线，感觉 30min 之内写不完。
/*
坐标：只考虑 x 或 y。矩形提供 2 个，点提供 1 个，总共 n+2m=600000.
*/
// 鉴定一下，这个被 OI-wiki 鉴定为烂题，因为完全是两个题（扫描线和 MST）拼起来的。
#include <cstdio>
#include <vector>
#include <algorithm>
#include <map>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };
const auto getr = [](int l, int r, int id) { return id + ((l + r) / 2 - l + 1) * 2; };

class constructor
{
public:
	int fa[200005], rk[200005];
	int getfa(int x) { while(x != fa[x]) x = fa[x] = fa[fa[x]]; return x; }
	void merge(int x, int y) { if((x = getfa(x)) == (y = getfa(y))) return; if(rk[x] < rk[y]) { fa[x] = y; } else if(rk[y] < rk[x]) { fa[y] = x; } else { fa[x] = y; rk[y]++; } }
} ds;

class segtree // 其实你本可以两棵树状数组搞定的……但是大力数据结构真的很好玩！
{
public:
	class node { public: int vadd, maxn; } nodes[1200005];
	void pushup(int l, int r, int id) { nodes[id].maxn = max(nodes[id + 1].maxn, nodes[getr(l, r, id)].maxn);/* if(nodes[id].maxn == 715) __debugbreak(); */}
	void pushdown(int l, int r, int id) { nodes[id + 1].vadd += nodes[id].vadd; nodes[id + 1].maxn += nodes[id].vadd; nodes[getr(l, r, id)].vadd += nodes[id].vadd; nodes[getr(l, r, id)].maxn += nodes[id].vadd; nodes[id].vadd = 0; }
	void build(int n) { U([&](auto &&self, int l, int r, int id) -> void { nodes[id] = {0, 0}; if(l == r) return; self(self, l, (l + r) / 2, id + 1); self(self, (l + r) / 2 + 1, r, getr(l, r, id)); })(1, n, 1); }
	void vadd(int n, int L, int R, int val) { U([&](auto &&self, int l, int r, int vl, int vr, int id) -> void { if(l == vl && r == vr) { nodes[id].vadd += val; nodes[id].maxn += val; return; } pushdown(l, r, id); if(vl <= (l + r) / 2) self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1); if(vr > (l + r) / 2) self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id)); pushup(l, r, id); })(1, n, L, R, 1); }
	bool qa0(int n, int L, int R) { return !U([&](auto &&self, int l, int r, int vl, int vr, int id) -> bool { if(l == vl && r == vr) return nodes[id].maxn > 0; pushdown(l, r, id); if(vl <= (l + r) / 2 && self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1)) return true; if(vr > (l + r) / 2 && self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id))) return true; return false; })(1, n, L, R, 1); }
} seg;

class pt { public: int x, y; } pts[200005];
class rect { public: int x1, y1, x2, y2; } rects[200005];
class vcx { public: int p, l, r, v; } vcxs[400005];
class edge { public: int u, v, w; };
vector<int> vxr[600005], vyr[600005];
int krx[600005], kry[600005];
long long ar[200005], sr[200005];

int main()
{
	int n, m, q;
	scanf("%d%d%d", &n, &m, &q);
	vector<edge> egs;
	map<int, int> qx, qy;
	for(int i=1;i<=n;i++)
	{
		scanf("%d%d", &pts[i].x, &pts[i].y);
		// pts[i].id = i;
		qx[pts[i].x]; qy[pts[i].y];
	}
	// printf("curx = %d, cury = %d\n", (int)qx.size(), (int)qy.size());
	for(int i=1;i<=m;i++)
	{
		scanf("%d%d%d%d", &rects[i].x1, &rects[i].y1, &rects[i].x2, &rects[i].y2);
		qx[rects[i].x1]; qx[rects[i].x2];
		qy[rects[i].y1]; qy[rects[i].y2];
	}
	int curx = 0, cury = 0;
	for(auto &[x, y] : qx) krx[y = ++curx] = x;
	for(auto &[x, y] : qy) kry[y = ++cury] = x;
	for(int i=1;i<=n;i++)
	{
		pts[i].x = qx[pts[i].x];
		pts[i].y = qy[pts[i].y];
		vxr[pts[i].x].push_back(i);
		vyr[pts[i].y].push_back(i);
	}
	for(int i=1;i<=m;i++)
	{
		rects[i].x1 = qx[rects[i].x1];
		rects[i].x2 = qx[rects[i].x2];
		rects[i].y1 = qy[rects[i].y1];
		rects[i].y2 = qy[rects[i].y2];
	}
	// 先按 x 扫描线
	for(int i=1;i<=m;i++)
	{
		vcxs[2 * i - 1] = {rects[i].x1, rects[i].y1, rects[i].y2, 1};
		vcxs[2 * i] = {rects[i].x2 + 1, rects[i].y1, rects[i].y2, -1};
	}
	sort(vcxs + 1, vcxs + 2 * m + 1, [](const auto &x, const auto &y) { return x.p < y.p; });
	seg.build(cury);
	int curp = 0;
	for(int i=1;i<=curx;i++)
	{
		while(curp < 2 * m && vcxs[curp + 1].p <= i)
		{
			curp++;
			// if(curp == 12) __debugbreak();
			seg.vadd(cury, vcxs[curp].l, vcxs[curp].r, vcxs[curp].v);
			// if(!seg.qa0(cury, 233279, 233279)) __debugbreak();
		}
		if(vxr[i].size() >= 2)
		{
			sort(vxr[i].begin(), vxr[i].end(), [](int x, int y) { return pts[x].y < pts[y].y; });
			for(int j=0;j+1<vxr[i].size();j++)
			{
				// if(!seg.qa0(cury, pts[vxr[i][j]].y, pts[vxr[i][j]].y)) __debugbreak();
				if(seg.qa0(cury, pts[vxr[i][j]].y, pts[vxr[i][j+1]].y)) egs.push_back({vxr[i][j], vxr[i][j+1], kry[pts[vxr[i][j+1]].y] - kry[pts[vxr[i][j]].y]});
			}
		}
	}
	// printf("x get: %lu\n", egs.size());
	// 按 y 扫描线
	for(int i=1;i<=m;i++)
	{
		vcxs[2 * i - 1] = {rects[i].y1, rects[i].x1, rects[i].x2, 1};
		vcxs[2 * i] = {rects[i].y2 + 1, rects[i].x1, rects[i].x2, -1};
	}
	sort(vcxs + 1, vcxs + 2 * m + 1, [](const auto &x, const auto &y) { return x.p < y.p; });
	seg.build(curx);
	curp = 0;
	for(int i=1;i<=cury;i++)
	{
		while(curp < 2 * m && vcxs[curp + 1].p <= i)
		{
			curp++;
			seg.vadd(curx, vcxs[curp].l, vcxs[curp].r, vcxs[curp].v);
		}
		if(vyr[i].size() >= 2)
		{
			sort(vyr[i].begin(), vyr[i].end(), [](int x, int y) { return pts[x].x < pts[y].x; });
			for(int j=0;j+1<vyr[i].size();j++)
			{
				if(seg.qa0(curx, pts[vyr[i][j]].x, pts[vyr[i][j+1]].x)) egs.push_back({vyr[i][j], vyr[i][j+1], krx[pts[vyr[i][j+1]].x] - krx[pts[vyr[i][j]].x]});
			}
		}
	}
	// printf("y get: %lu\n", egs.size());
	// for(const auto &[x, y, v] : egs) printf("Edge: %d --(%d)-- %d\n", x, v, y);
	sort(egs.begin(), egs.end(), [](const auto &x, const auto &y) { return x.w < y.w; });
	int vcnt = n;
	int cure = 0;
	for(int i=1;i<=n;i++) ds.fa[i] = i;
	for(const auto &[u, v, w] : egs)
	{
		if(ds.getfa(u) != ds.getfa(v))
		{
			ds.merge(u, v);
			ar[++cure] = w;
			vcnt--;
			// printf("on MST: %d ---(%d)--- %d\n", u, w, v);
		}
	}
	reverse(ar + 1, ar + cure + 1);
	for(int i=1;i<=cure;i++) sr[i] = sr[i-1] + ar[i];
	while(q--)
	{
		long long b, h;
		scanf("%lld%lld", &b, &h);
		if(h < vcnt)
		{
			printf("-1\n");
			continue;
		}
		h -= vcnt;
		int vr = min<int>(lower_bound(ar + 1, ar + cure + 1, b, [](long long x, long long y) { return x > y; }) - ar - 1, h);
		printf("%lld\n", sr[cure] - sr[vr] + b * vr + vcnt * b);
	}
	return 0;
} // construction!
```

:::
