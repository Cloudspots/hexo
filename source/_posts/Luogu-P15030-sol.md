---
title: 题解：P15030 [UOI 2021 II Stage] A 先生的魔法球
date: 2026-10-05 10:19:59
updated: 2026-10-07 21:52:48
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P15030 [UOI 2021 II Stage] A 先生的魔法球

字典序最小，考虑贪心。

考虑一个 $Q$ 是如何构造来的。从前往后考虑？也就是每次选择两个在同一段中的元素，将其删除，空出的位置分段。

有解显然等价于每一段长度都是偶数。

那么我们每次找到最小的，在当前段中下标为偶数的数字（下标从 $0$ 开始），然后找到它右边最小的段中下标为奇数的数字，同时删掉，加入到 $Q$ 的开头即可。

删除两个数对奇偶性的影响只有区间取反。

那么用线段树维护区间奇数/偶数位置最小值，支持区间奇偶性取反即可。同时开另一棵线段树（或 `set`）维护所有被删除的位置，用于查询当前段右端点。具体操作是，每次将被删除的位置 $i$ 设为 $i$，还没被删除的位置设为 $+\infty$，查询后缀最小值即可。用 `set` 更简单。

时间复杂度 $O(n\log n)$。

:::info[rec&code]

不想卡最优解了，这个做法感觉也就这样了。

[rec](https://www.luogu.com.cn/record/300850958)。

```cpp
// 诅咒仅限定 T1
// T2 可以在 30min 内通过
// ……吗？
// 好消息：15min 打完了
// 坏消息：假了
#include <cstdio>
#include <vector>
#include <cassert>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };
const auto getr = [](int l, int r, int id) { return id + ((l + r) / 2 - l + 1) * 2; };

int a[1000005];

class segt1
{
public:
	int minn[2000005];
	void pushup(int l, int r, int id) { minn[id] = min(minn[id+1], minn[getr(l, r, id)]); }
	void build(int n) { U([&](auto &&self, int l, int r, int id) -> void { if(l == r) { minn[id] = 0x3f3f3f3f; return; } self(self, l, (l + r) / 2, id + 1); self(self, (l + r) / 2 + 1, r, getr(l, r, id)); pushup(l, r, id); })(1, n, 1); }
	void vset(int n, int pos, int val) { U([&](auto &&self, int l, int r, int id) -> void { if(l == r) { minn[id] = val; return; } if(pos <= (l + r) / 2) self(self, l, (l + r) / 2, id + 1); else self(self, (l + r) / 2 + 1, r, getr(l, r, id)); pushup(l, r, id); })(1, n, 1); }
	int qmin(int n, int L, int R) { return U([&](auto &&self, int l, int r, int vl, int vr, int id) -> int { if(l == vl && r == vr) return minn[id]; int res = 0x3f3f3f3f; if(vl <= (l + r) / 2) res = min(res, self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1)); if(vr > (l + r) / 2) res = min(res, self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id))); return res; })(1, n, L, R, 1); }
} seg; // 暴论：在 3min 内打完这个比打 One Forgotten Night 和 Thank You For Playing My Game 累多了

class god
{
public:
	class node { public: int xmin, ymin; bool rev; } nodes[2000005];
	void pushup(int l, int r, int id) { nodes[id].xmin = min(nodes[id + 1].xmin, nodes[getr(l, r, id)].xmin, [](int x, int y) { return a[x] < a[y]; }); nodes[id].ymin = min(nodes[id + 1].ymin, nodes[getr(l, r, id)].ymin, [](int x, int y) { return a[x] < a[y]; }); }
	void pushdown(int l, int r, int id) { if(nodes[id].rev) { nodes[id + 1].rev ^= 1; swap(nodes[id + 1].xmin, nodes[id + 1].ymin); nodes[getr(l, r, id)].rev ^= 1; swap(nodes[getr(l, r, id)].xmin, nodes[getr(l, r, id)].ymin); nodes[id].rev = false; } }
	void build(int n) { U([&](auto &&self, int l, int r, int id) -> void { if(l == r) { nodes[id] = {0, l, false}; return; } self(self, l, (l + r) / 2, id + 1); self(self, (l + r) / 2 + 1, r, getr(l, r, id)); pushup(l, r, id); })(1, n, 1); }
	void vflip(int n, int L, int R) { U([&](auto &&self, int l, int r, int vl, int vr, int id) -> void { if(l == vl && r == vr) { nodes[id].rev ^= 1; swap(nodes[id].xmin, nodes[id].ymin); return; } pushdown(l, r, id); if(vl <= (l + r) / 2) self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1); if(vr > (l + r) / 2) self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id)); pushup(l, r, id); })(1, n, L, R, 1); }
	int qamin() { return nodes[1].xmin; }
	int qxmin(int n, int L, int R) { return U([&](auto &&self, int l, int r, int vl, int vr, int id) -> int { if(l == vl && r == vr) return nodes[id].xmin; pushdown(l, r, id); int res = 0; if(vl <= (l + r) / 2) res = min(res, self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1), [](int x, int y) { return a[x] < a[y]; }); if(vr > (l + r) / 2) res = min(res, self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id)), [](int x, int y) { return a[x] < a[y]; }); return res; })(1, n, L, R, 1); }
	int qymin(int n, int L, int R) { return U([&](auto &&self, int l, int r, int vl, int vr, int id) -> int { if(l == vl && r == vr) return nodes[id].ymin; pushdown(l, r, id); int res = 0; if(vl <= (l + r) / 2) res = min(res, self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1), [](int x, int y) { return a[x] < a[y]; }); if(vr > (l + r) / 2) res = min(res, self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id)), [](int x, int y) { return a[x] < a[y]; }); return res; })(1, n, L, R, 1); }
} wsx; // The power of wsx!!

// int minpos[25][1000005];

int tpos[1000005];
int ans[1000005];

int main()
{
	a[0] = 0x3f3f3f3f;
	int n, k;
	scanf("%d%d", &n, &k);
	for(int i=1;i<=n;i++)
	{
		scanf("%d", a + i);
		tpos[a[i]] = i;
		// minpos[0][i] = i;
		// for(int j=1;(1<<j)<=i;j++)
		// {
		// 	minpos[j][i] = min(minpos[j-1][i], minpos[j-1][i-(1<<(j-1))], [](int x, int y) { return a[x] < a[y]; });
		// }
	}
	// auto vqmin = [](int l, int r) { int llen = __lg(r - l + 1), lllen = 1 << llen; return min(minpos[llen][l+lllen-1], minpos[llen][r], [](int x, int y) { return a[x] < a[y]; }); };
	seg.build(n);
	wsx.build(n);
	for(int i=1;i<=n;i+=2) wsx.vflip(n, i, i);
	for(int i=1;i<=k;i+=2)
	{
		int l = wsx.qamin();
		assert(l);
		int vr = min(n, seg.qmin(n, l, n) - 1);
		assert(l + 1 <= vr);
		int r = wsx.qymin(n, l + 1, vr);
		ans[i] = a[l];
		ans[i+1] = a[r];
		wsx.vflip(n, l, r - 1);
		seg.vset(n, l, l);
		seg.vset(n, r, r);
	}
	for(int i=1;i<=k;i++) printf("%d ", ans[i]);
	printf("\n");
	// printf("? %d\n", wsx.qxmin(n, 1, 1));
	return 0;
}
// 诅咒再次发力
// T2 同样使用 1h 通过
```

:::
