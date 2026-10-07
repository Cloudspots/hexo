---
title: 题解：P14417 [JOISC 2015] 防壁 / Walls
date: 2026-10-04 19:49:21
updated: 2026-10-07 21:53:03
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P14417 [JOISC 2015] 防壁 / Walls

> 竞选最招笑做法。去掉奇奇怪怪的快读之后最长通过代码。$\gtrsim 6\mathrm{KB},\ 269\mathrm{L}$。常数倒还不算太大？目前所有人类中的最优解（\_aa\_ 的最优解记录是 AI）。
>
> 不过思维难度还是很小的。唯一的问题就是赛时没打完，痛失 $100\mathrm{pts}$。

---

首先初始状态没有任何性质，所以暴力模拟第一次操作。

对于 $i\ge 2$，若 $t_i\ge t_{i-1}$，则每个屏障都不会往左移动，否则每个屏障都不会往右移动。

并且如果 $t$ 单调递减，那么就是左端点全局取 $\min$。如果 $t$ 单调递增就是右端点全局取 $\max$。

考虑这是什么意思。转化到二维平面上，$[l,r]$ 转为一个点。如果直接用 $(l,r)$ 作为点其实不好考虑，考虑到区间长度必然不会变化，使用 $(r-l,l)$ 代表区间 $[l,r]$（为什么不是 $(r-l+1,l)$？显然两者是等价的，但是我们若对于右端点进行操作，那么就相当于对点的 $x+y$ 操作而不是 $x+y-1$，没有 $-1$ 比较省脑子）。

那么若是左端点全局取 $\min$，考虑 $y$ 坐标代表了左端点，那么就是相当于一条横向（$y=C$）的直线从上往下扫，直到 $y=t_i$，途径的所有点都要往下跑到 $y=t_i$ 的位置。

而若是右端点全局取 $\max$，考虑 $x+y$ 代表了右端点，那么就相当于一条斜向（$x+y=C$）的直线从下往上扫，直到 $x+y=t_i$，途径的所有点都要往上跑到 $y=t_i-x$ 的位置。

考虑若干次操作后（假设两者操作都有过），若原本平面上全是点，则最终的的点集可以这样描述：

- 存在一个阈值 $l$，对于 $x\le l$ 和 $x>l$ 分别讨论。
- 对于 $x\le l$，是若干条斜率为 $-1$ 的线段和若干条斜率为 $0$ 的线段拼起来。特别地，最左边的是射线，无限向左或左上延伸。
- 对于 $x>l$，考虑前一种情况中 $x=l$ 的点为 $(l,b)$，那么 $(x,y)$ 存在当且仅当 $l+b-x\le y\le b$。

证明是显然的，数学归纳即可，略去。

同时有一个非常优秀的性质就是每次修改波及到的都是 $x$ 坐标的一段前缀（存在阈值 $C$ 满足其波及到了所有 $x<C$ 的点，波及的意思是对 $y$ 坐标有修改；任何操作都无法修改 $x$ 坐标）。

可以用栈维护。栈从栈顶到栈底分别维护从左往右所有线段的端点（射线则用一条长度足够长的线段代替）。由于每次将一段前缀替换为一条（或两条，可能需要补上无穷长的射线）线段，拥有势能，可以暴力修改。

对于维护移动距离之和，分讨发现都是区间加 $ax+b$（$a,b$ 是修改参数，$x$ 是对应点的 $x$ 坐标）的形式，那么维护两个前缀和即可。

时间复杂度 $O((n+m)\log n)$，瓶颈在于排序（按 $x$ 排序）和二分（修改时求生效区间）。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/300982355)。

We warned you. 不会真有人想看这一坨代码吧。因为我的代码能力不行加上分讨情况数量比较多导致非常长。

哦对了今天是 wsx 的生日，让我们祝 wsx 生日快乐！

这个代码能过 $99.8244353\%$ 的原因都是膜拜了 wsx。

```cpp
/*
转为二维平面

那么操作：

1. 一个 --- 从上往下推
2. 一个 \\\ 从下往上推

分析性质。所有已经被两种操作波及到的点都可以用颜色段做，每次操作是前缀（这是梦话吗？）。而是否判断被波及过是简单的。
*/
#include <cstdio>
#include <vector>
#include <cassert>
#include <algorithm>
#ifdef WSXBIRTHDAY
#include <signal.h>
#define __debugbreak() raise(SIGTRAP)
#endif

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; }; // wsxwsxwsxwsxwsxwsxwsx akioi!!!!!

class pt { public: long long x, y; int id, vid; } pts[200005], ry[200005], rxpy[200005];

long long ksl[200005], ksv[200005];
long long ans[200005];
int t[200005];

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	for(int i=1;i<=n;i++)
	{
		int a, b;
		scanf("%d%d", &a, &b);
		pts[i].x = b - a;
		pts[i].y = a;
		pts[i].id = i;
	}
	sort(pts + 1, pts + n + 1, [](const auto &x, const auto &y) { return x.x < y.x; });
	for(int i=1;i<=m;i++)
	{
		scanf("%d", t + i);
	}
	// 模拟 t[1]
	for(int i=1;i<=n;i++)
	{
		long long vl = pts[i].y, vr = pts[i].y + pts[i].x;
		if(t[1] < vl)
		{
			ksv[i] = vl - t[1];
			vl = t[1];
			vr = t[1] + pts[i].x;
		}
		else if(t[1] > vr)
		{
			ksv[i] = t[1] - vr;
			vr = t[1];
			vl = t[1] - pts[i].x;
		}
		pts[i].y = vl;
		pts[i].vid = i;
		ry[i] = rxpy[i] = pts[i];
	}
	for(int i=n;i>=1;i--) ksv[i] -= ksv[i-1];
	sort(ry + 1, ry + n + 1, [](const auto &x, const auto &y) { return x.y > y.y; });
	sort(rxpy + 1, rxpy + n + 1, [](const auto &x, const auto &y) { return x.x + x.y < y.x + y.y; });
	int curx = 0;
	vector<pt> seg;
	seg.push_back({-1000000002, 1000000001});
	for(int i=2;i<=m;i++)
	{
		// if(i == 11) __debugbreak();
		if(t[i] < t[i-1]) // 左移，--- 上往下
		{
			if(t[i] < seg[0].y)
			{
				pt nx = {seg[0].x + seg[0].y - t[i], t[i]};
				while(seg.size() > 1)
				{
					pt a = seg.back(), b = seg[seg.size() - 2];
					seg.pop_back();
					int xa = upper_bound(pts + 1, pts + n + 1, a, [](const auto &x, const auto &y) { return x.x < y.x; }) - pts;
					int xb = upper_bound(pts + 1, pts + n + 1, b, [](const auto &x, const auto &y) { return x.x < y.x; }) - pts - 1;
					if(xb < xa) continue;
					if(a.y == b.y)
					{
						ksv[xa] += a.y - t[i];
						ksv[xb + 1] -= a.y - t[i];
					}
					else
					{
						assert(a.x + a.y == b.x + b.y);
						//   t[i] - y
						// = t[i] - (x + y - x)
						// = t[i] - (x + y) + x
						ksl[xa]--;
						ksl[xb+1]++;
						ksv[xa] -= t[i] - a.x - a.y;
						ksv[xb+1] += t[i] - a.x - a.y;
					}
				}
				assert(seg.size() == 1);
				auto vx = seg[0];
				seg.clear();
				seg.push_back(nx);
				seg.push_back({-1000000002, t[i]});
				while(curx < n && pts[curx + 1].x <= seg[0].x)
				{
					curx++;
					long long vr = max(vx.x + vx.y - pts[curx].x, min(vx.y, pts[curx].y)), vg = min(seg[0].y, vr);
					long long kv = abs(vg - vr) + abs(vr - pts[curx].y);
					ksv[curx] += kv;
					ksv[curx+1] -= kv;
				}
			}
			else
			{
				while(seg.size() > 1)
				{
					pt a = seg.back(), b = seg[seg.size() - 2];
					if(a.y <= t[i]) break;
					seg.pop_back();
					if(b.y < t[i])
					{
						// 拆！
						seg.push_back((b = {a.x + a.y - t[i], t[i]}));
					}
					int xa = upper_bound(pts + 1, pts + n + 1, a, [](const auto &x, const auto &y) { return x.x < y.x; }) - pts;
					int xb = upper_bound(pts + 1, pts + n + 1, b, [](const auto &x, const auto &y) { return x.x < y.x; }) - pts - 1;
					if(xb < xa) continue;
					if(a.y == b.y)
					{
						ksv[xa] += a.y - t[i];
						ksv[xb + 1] -= a.y - t[i];
					}
					else
					{
						assert(a.x + a.y == b.x + b.y);
						ksl[xa]--;
						ksl[xb+1]++;
						ksv[xa] -= t[i] - a.x - a.y;
						ksv[xb+1] += t[i] - a.x - a.y;
					}
				}
				assert(seg.back().y == t[i]);
				if(seg.back().x > 0) seg.push_back({-1000000002, t[i]});
			}
		}
		else
		{
			if(seg[0].x + seg[0].y < t[i])
			{
				pt nx = {t[i] - seg[0].y, seg[0].y};
				while(seg.size() > 1)
				{
					pt a = seg.back(), b = seg[seg.size() - 2];
					seg.pop_back();
					int xa = upper_bound(pts + 1, pts + n + 1, a, [](const auto &x, const auto &y) { return x.x < y.x; }) - pts;
					int xb = upper_bound(pts + 1, pts + n + 1, b, [](const auto &x, const auto &y) { return x.x < y.x; }) - pts - 1;
					if(xb < xa) continue;
					if(a.y == b.y)
					{
						// t - x - y
						ksl[xa]--;
						ksl[xb+1]++;
						ksv[xa] += t[i] - a.y;
						ksv[xb+1] -= t[i] - a.y;
					}
					else
					{
						ksv[xa] += t[i] - a.x - a.y;
						ksv[xb+1] -= t[i] - a.x - a.y;
					}
				}
				assert(seg.size() == 1);
				auto vx = seg[0];
				seg.clear();
				seg.push_back(nx);
				seg.push_back({-1000000002, t[i] + 1000000002});
				while(curx < n && pts[curx + 1].x <= seg[0].x)
				{
					curx++;
					long long vr = max(vx.x + vx.y - pts[curx].x, min(vx.y, pts[curx].y)), vg = max(seg[0].x + seg[0].y - pts[curx].x, vr);
					long long kv = abs(vg - vr) + abs(vr - pts[curx].y);
					ksv[curx] += kv;
					ksv[curx+1] -= kv;
				}
			}
			else
			{
				while(seg.size() > 1)
				{
					pt a = seg.back(), b = seg[seg.size() - 2];
					if(a.x + a.y >= t[i]) break;
					seg.pop_back();
					if(b.x + b.y > t[i])
					{
						b.x = t[i] - b.y;
						seg.push_back(b);
					}
					int xa = upper_bound(pts + 1, pts + n + 1, a, [](const auto &x, const auto &y) { return x.x < y.x; }) - pts;
					int xb = upper_bound(pts + 1, pts + n + 1, b, [](const auto &x, const auto &y) { return x.x < y.x; }) - pts - 1;
					if(xb < xa) continue;
					if(a.y == b.y)
					{
						// t - x - y
						ksl[xa]--;
						ksl[xb+1]++;
						ksv[xa] += t[i] - a.y;
						ksv[xb+1] -= t[i] - a.y;
					}
					else
					{
						ksv[xa] += t[i] - a.x - a.y;
						ksv[xb+1] -= t[i] - a.x - a.y;
					}
				}
				if(seg.back().x > 0) seg.push_back({-1000000002, t[i]+1000000002});
			}
		}
	}
	while(curx < n)
	{
		curx++;
		long long vr = max(seg[0].x + seg[0].y - pts[curx].x, min(seg[0].y, pts[curx].y)), vg = min(seg[0].y, vr);
		long long kv = abs(vg - vr) + abs(vr - pts[curx].y);
		ksv[curx] += kv;
		ksv[curx+1] -= kv;
	}
	for(int i=1;i<=n;i++)
	{
		ksl[i] += ksl[i-1];
		ksv[i] += ksv[i-1];
	}
	for(int i=1;i<=n;i++)
	{
		ans[pts[i].id] = 1ll * ksl[i] * pts[i].x + ksv[i];
	}
	for(int i=1;i<=n;i++) printf("%lld\n", ans[i]);
	return 0;
} // stO wsx Orz
  // wsx dsa
```

:::
