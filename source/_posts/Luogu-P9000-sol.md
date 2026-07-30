---
title: 题解：P9000 [CEOI 2022] Measures
tags:
  - Solution
  - Luogu P Problem Solution
categories:
  - Solution
date: 2026-07-27 19:13:38
updated: 2026-07-27 19:13:38
---
> 绝对值老师……刺杀失败。

---

大力矩阵做法，常数大的没边/fendou。

首先需要注意的是，题目要最小化的是每个人终点与起点距离的最大值，而不是和。我和某个神秘非人类都看错题了，喜提毫无思路 $\color{red}0\color{normal}\mathrm{pts}$。

首先我们考虑一个人能同时向左和向右，那距离里面带有绝对值，很不好考虑。那么我们就假设每个时刻每个人都会向右滑动一位（这个是连续的，也就是说你 $0.5$ 个时刻也会向右滑动 $0.5$ 位）。那么就可以转化为一个人向右滑动的速度在 $[0,2]$ 之间即可。显然不妨取到最大值 $2$，后面都是 $0$。

那么又转化回了距离，只是这里不能向左了。

那么我们开始 DP！先不考虑待修。设 $f_i$ 为 $i$ 所在的位置的最小值，那么 $f_i=\max(f_{i-1}+D,a_i)$，答案为 $\dfrac{\max\{f - a\}}{2}$（除以二是因为我们速度为 $2$，但是 $f$ 算的是距离）。

这个又怎么做？

我们考虑 $g_i=\max(g_{i-1},f_i-a_i)$。矩阵一下做完了！

当然这题需要带插入，所以平衡树（块状链表是不是应该也可以）维护 $3\times 3$ 矩阵（为什么多了一个？因为你需要有 $0$），时间复杂度 $O((N+M)\log N)$。带一个 $3^3$ 的常数，不大。

平衡树是啥？我离散化然后线段树过了这个题。坐等一个人类来把这个题强制在线我再写平衡树。

认为这个题最多 $2\times 10^5$ 的人的有辐了。

我擦，我怎么成矩阵仙人了。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/288985399)。

```cpp
#include <set>
#include <map>
#include <cstdio>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

class maxplus3
{
public:
	long long a, b, c, d, e, f, g, h, i;
	friend maxplus3 operator*(const maxplus3 &x, const maxplus3 &y)
	{
		return 
		{
			max({x.a + y.a, x.b + y.d, x.c + y.g, -0x3f3f3f3f3f3f3f3fll}), max({x.a + y.b, x.b + y.e, x.c + y.h, -0x3f3f3f3f3f3f3f3fll}), max({x.a + y.c, x.b + y.f, x.c + y.i, -0x3f3f3f3f3f3f3f3fll}), 
			max({x.d + y.a, x.e + y.d, x.f + y.g, -0x3f3f3f3f3f3f3f3fll}), max({x.d + y.b, x.e + y.e, x.f + y.h, -0x3f3f3f3f3f3f3f3fll}), max({x.d + y.c, x.e + y.f, x.f + y.i, -0x3f3f3f3f3f3f3f3fll}), 
			max({x.g + y.a, x.h + y.d, x.i + y.g, -0x3f3f3f3f3f3f3f3fll}), max({x.g + y.b, x.h + y.e, x.i + y.h, -0x3f3f3f3f3f3f3f3fll}), max({x.g + y.c, x.h + y.f, x.i + y.i, -0x3f3f3f3f3f3f3f3fll}), 
		};
	}
};

class segtree
{
public:
	maxplus3 vals[400035];
	constexpr int getr(int l, int r, int id) { return id + ((l + r) / 2 - l + 1) * 2; }
	void pushup(int l, int r, int id) { vals[id] = vals[getr(l, r, id)] * vals[id + 1]; }
	void build(int n) { U([&](auto &&self, int l, int r, int id) -> void { if(l == r) { vals[id] = {0, -0x3f3f3f3f3f3f3f3fll, -0x3f3f3f3f3f3f3f3fll, -0x3f3f3f3f3f3f3f3fll, 0, -0x3f3f3f3f3f3f3f3fll, -0x3f3f3f3f3f3f3f3fll, -0x3f3f3f3f3f3f3f3fll, 0}; return; } self(self, l, (l + r) / 2, id + 1); self(self, (l + r) / 2 + 1, r, getr(l, r, id)); pushup(l, r, id); })(1, n, 1); }
	void vmul(int n, int pos, const maxplus3 &val) { U([&](auto &&self, int l, int r, int id) -> void { if(l == r) { vals[id] = vals[id] * val; return; } if(pos <= (l + r) / 2) self(self, l, (l + r) / 2, id + 1); else self(self, (l + r) / 2 + 1, r, getr(l, r, id)); pushup(l, r, id); })(1, n, 1); }
	long long query() { return max(vals[1].e, vals[1].f); }
} sg;

int a[200005], b[200005];
int yx[400005];

int main()
{
	int n, m, d;
	scanf("%d%d%d", &n, &m, &d);
	map<int, int> mp;
	for(int i=1;i<=n;i++)
	{
		scanf("%d", a + i);
		mp[a[i]];
	}
	for(int i=1;i<=m;i++)
	{
		scanf("%d", b + i);
		mp[b[i]];
	}
	int cur = 0;
	for(auto &[x, y] : mp) yx[y = ++cur] = x;
	sg.build(cur);
	for(int i=1;i<=n;i++)
	{
		sg.vmul(cur, mp[a[i]], maxplus3{d, -0x3f3f3f3f3f3f3f3fll, a[i], d - a[i], 0, 0, -0x3f3f3f3f3f3f3f3fll, -0x3f3f3f3f3f3f3f3fll, 0});
	}
	for(int i=1;i<=m;i++)
	{
		sg.vmul(cur, mp[b[i]], maxplus3{d, -0x3f3f3f3f3f3f3f3fll, b[i], d - b[i], 0, 0, -0x3f3f3f3f3f3f3f3fll, -0x3f3f3f3f3f3f3f3fll, 0});
		// printf("got:\n[%d -inf %d\n %d 0 -inf\n -inf -inf 0]\n", d, b[i], -b[i]);
		long long res = sg.query();
		if(res & 1) printf("%lld.5 ", res / 2);
		else printf("%lld ", res / 2);
	}
	return 0;
}
// f[i] - a[i] = max(f[i-1] + d, a[i]) - a[i] = max(f[i-1] + d - a[i], 0)
```

:::
