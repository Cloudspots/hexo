---
title: 题解：P7530 [USACO21OPEN] United Cows of Farmer John P
date: 2026-6-6 15:11:30
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
# 题解：P7530 [USACO21OPEN] United Cows of Farmer John P

> United States of Donald Trum P。简单题，绿！
>
> 为什么这么多题解枚举右端点啊，不懂。我是从右往左枚举左端点。

首先条件转化为，有一个区间，满足区间左右两个端点的数字都只在这个区间内出现一次，还有一个中间点满足其数字也只在区间内出现一次。

换句话说，每个区间在左右两边数字仅出现一次时可以产生贡献，产生的贡献为区间去掉左右两边之后，仅出现一次的数字个数。

既然是每个区间有贡献，我们考虑定一求一（不行的话还可以考虑分治，但是这题不需要）。

同时根据经验，加数比较简单，删数比较困难，我们从右往左枚举左端点 $l$。

我们直接考虑设 $S_r$ 为“$[l,r]$ 能够产生的贡献”（如果无法产生就是 $0$）。当左端点从 $l+1$ 变为 $l$ 时，我们找到 $b_l$ 的后继（最小的 $b_j$，使得 $j>l$ 且 $b_j=b_l$）：

- 如果不存在：说明 $b_l$ 在 $[l,n]$ 中是唯一的。那么，它作为任何区间的左端点都是合法的，也就是贡献为 $\sum S_{l\dots n}$（即 $\displaystyle\sum_{i=l}^n S_i$）。同时，左端点变化引起所有合法的（即，可以作为右端点的）$S$ 增加 $1$。
- 如果存在：设它是 $j$。说明 $b_l$ 在 $[l,j)$ 中是唯一的，也就是贡献为 $\sum S_{l\dots j-1}$。同时，左端点变化引起所有合法的，位于 $[l,j)$ 中的贡献增加 $1$。但是注意，设 $b_j$ 的后继为 $k$（不存在则设为 $n+1$），那么 $b_j$ 原本在 $[j,k)$ 中是合法的，现在增加 $b_i$ 之后就不合法了！所以所有合法的 $S_{j\dots k-1}$ 要减少 $1$。那 $b_j$ 本身呢？它不再是唯一的了，它从合法变为了不合法。

综上，我们需要实现数据结构加速这一操作。数据结构需要支持：

- 初始化，所有元素均合法且为 $0$。
- 区间合法的元素加法。
- 区间合法元素求和。
- 将某个元素从合法变为不合法。

考虑线段树。根据我的习惯，我把“合法”称之为“激活”。我们对每一个节点记录一个值 `cnt`（active 缩写），代表这个节点所管辖的子树中，激活节点的个数。

那么只需要在区间加法打标记的时候，对于节点的区间和 `sum` 不再加上加的数字乘区间大小，而是加的数字乘区间 `cnt`。反激活的时候设置叶子节点的 `cnt` 为 $0$ 即可（当然记得 pushup）。

时间复杂度 $O(n\log n)$。

:::info[rec&code]

虽然我不是刻意进行防御性编程，但是好像不小心实现了这个效果。对此感到抱歉。

[rec](https://www.luogu.com.cn/record/280818138)。

```cpp
#include <cstdio>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

class segtree
{
	class node { public: long long add, sum; int cnt; } nodes[400005];
	constexpr int getr(int l, int r, int id) { return id + ((l + r) / 2 - l + 1) * 2; }
	void pushdown(int l, int r, int id) { nodes[id + 1].add += nodes[id].add; nodes[id + 1].sum += nodes[id + 1].cnt * nodes[id].add; nodes[getr(l, r, id)].add += nodes[id].add; nodes[getr(l, r, id)].sum += nodes[getr(l, r, id)].cnt * nodes[id].add; nodes[id].add = 0; }
	void pushup(int l, int r, int id) { nodes[id].sum = nodes[id + 1].sum + nodes[getr(l, r, id)].sum; nodes[id].cnt = nodes[id + 1].cnt + nodes[getr(l, r, id)].cnt; }
public:
	void build(int n) { U([&](auto &&self, int l, int r, int id) -> void { if(l == r) { nodes[id] = {0, 0, 1}; return; } self(self, l, (l + r) / 2, id + 1); self(self, (l + r) / 2 + 1, r, getr(l, r, id)); nodes[id] = {0, 0, r - l + 1}; })(1, n, 1); }
	long long qsum(int n, int L, int R) { return U([&](auto &&self, int l, int r, int vl, int vr, int id) -> long long { if(l == vl && r == vr) return nodes[id].sum; pushdown(l, r, id); long long sum = 0; if(vl <= (l + r) / 2) sum += self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1); if(vr > (l + r) / 2) sum += self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id)); return sum; })(1, n, L, R, 1); }
	void vadd(int n, int L, int R, int val) { U([&](auto &&self, int l, int r, int vl, int vr, int id) -> void { if(l == vl && r == vr) { nodes[id].add += val; nodes[id].sum += nodes[id].cnt * val; return; } pushdown(l, r, id); if(vl <= (l + r) / 2) self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1); if(vr > (l + r) / 2) self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id)); pushup(l, r, id); })(1, n, L, R, 1); }
	void vdeact(int n, int pos) { U([&](auto &&self, int l, int r, int id) -> void { if(l == r) { nodes[id].cnt = 0; nodes[id].sum = 0; return; } pushdown(l, r, id); if(pos <= (l + r) / 2) self(self, l, (l + r) / 2, id + 1); else self(self, (l + r) / 2 + 1, r, getr(l, r, id)); pushup(l, r, id); })(1, n, 1); }
} avi;

int a[200005];
int nxtspc[200005];
int lss[200005];
int cnt[200005];

int main()
{
	int n;
	scanf("%d", &n);
	for(int i=1;i<=n;i++)
	{
		scanf("%d", a + i);
		if(lss[a[i]]) nxtspc[lss[a[i]]] = i;
		lss[a[i]] = i;
	}
	avi.build(n);
	long long sum = 0;
	for(int i=n;i>=1;i--)
	{
		sum += avi.qsum(n, i, nxtspc[i] ? nxtspc[i] - 1 : n);
		// printf("i = %d, gets %lld\n", i, avi.qsum(n, i, nxtspc[i] ? nxtspc[i] - 1 : n));
		if(nxtspc[i])
		{
			avi.vdeact(n, nxtspc[i]);
			if(i + 1 <= nxtspc[i] - 1) avi.vadd(n, i + 1, nxtspc[i] - 1, 1);
			avi.vadd(n, nxtspc[i], nxtspc[nxtspc[i]] ? nxtspc[nxtspc[i]] - 1 : n, -1);
		}
		else
		{
			if(i + 1 <= n) avi.vadd(n, i + 1, n, 1);
		}
	}
	printf("%lld\n", sum);
	return 0;
}
```

:::