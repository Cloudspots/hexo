---
title: '题解：P15892 [COCI 2025/2026 #6] 教室 / Učionica'
date: 2026-09-25 21:41:25
updated: 2026-09-26 19:06:55
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
  - Segment Tree
---

# 题解：P15892 [COCI 2025/2026 #6] 教室 / Učionica

简单题。我看看这篇题解和[这个工单](https://www.luogu.com.cn/ticket/HYFR230651)谁先审完 XD。

首先显然 $a_{i,[j,j+k)}$ 合法当且仅当：

1. $a_{i,[j,j+k)}=0$（换句话说，$\forall p\in [j,j+k),a_{i,p}=0$）。
2. 设 $v_{i,j}=\displaystyle\min_{p\in [1,i]}a_{i,p}$，则 $v_{i,[j,j+k)}$ 排序后逐项严格小于 $h$ 排序后的值。如果存在 $h=0$ 的情况那么 $v$ 的计算中用的 $a$ 应该是负值而非 $0$。

那么考虑枚举每一行然后枚举每一列。显然求出 $v$ 后每行互不相干。$x_{1\dots k}$ 排序后逐项小于 $y_{1\dots k}$ 排序后的值等价于 $y$ 从小到大排序后对于每个 $i$，$x$ 中小于 $y_i$ 的个数都至少为 $i$。

那么维护 $h$ 排序后小于 $h_i$ 的数字的个数减去 $i$ 的最小值即可，区间加法，判断是否合法就是查询全局最小值。可以用线段树解决。时间复杂度 $O(nm\log k)$。赛时被卡常了/tuu。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/299154797)。

```cpp
#include <cstdio>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };
const auto getr = [](int l, int r, int id) { return id + ((l + r) / 2 - l + 1) * 2; };

class segtree
{
public:
	class node { public: int addn, minn; } nodes[4005];
	void pushup(int l, int r, int id) { nodes[id].minn = min(nodes[id + 1].minn, nodes[getr(l, r, id)].minn); nodes[id].addn = 0; }
	void pushdown(int l, int r, int id) { for(int x : {id + 1, getr(l, r, id)}) { nodes[x].addn += nodes[id].addn; nodes[x].minn += nodes[id].addn; } nodes[id].addn = 0; }
	void build(int n) { U([&](auto &&self, int l, int r, int id) -> void { if(l == r) { nodes[id] = {0, 0}; return; } self(self, l, (l + r) / 2, id + 1); self(self, (l + r) / 2 + 1, r, getr(l, r, id)); pushup(l, r, id); })(1, n, 1); }
	void vadd(int n, int L, int R, int val) { U([&](auto &&self, int l, int r, int vl, int vr, int id) -> void { if(l == r) { nodes[id].addn += val; nodes[id].minn += val; return; } pushdown(l, r, id); if(vl <= (l + r) / 2) self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1); if(vr > (l + r) / 2) self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id)); pushup(l, r, id); })(1, n, L, R, 1); }
	int qamin() { return nodes[1].minn; }
} seg;

int h[2005], t[2005];
int a[2005][2005], v[2005][2005];

char ibf[100000005];
unsigned li;

unsigned qread()
{
    char ch;
    unsigned res = 0;
    while((ch = ibf[li++]) < '0' || ch > '9');
    do
    {
        res = res * 10 + ch - '0';
    } while((ch = ibf[li++]) >= '0' && ch <= '9');
    return res;
}

int main()
{
    fread(ibf, 1, sizeof ibf, stdin);
	int n, m, k;
	// scanf("%d%d%d", &n, &m, &k);
    n = qread(); m = qread(); k = qread();
	for(int i=1;i<=k;i++)
	{
		// scanf("%d", h + i);
        h[i] = qread();
	}
	sort(h + 1, h + k + 1);
	for(int i=1;i<=n;i++)
	{
		for(int j=1;j<=m;j++)
		{
			// scanf("%d", a[i] + j);
            a[i][j] = qread();
			if(!a[i][j]) a[i][j] = -1;
			v[i][j] = i == 1 ? a[i][j] : max(a[i][j], v[i-1][j]);
		}
	}
	int cnt = 0;
	for(int i=1;i<=n;i++)
	{
		// printf("i = %d\n", i);
		// build once...
		int vc = 0;
		for(int j=1;j<=k;j++)
		{
			t[j] = v[i][j];
			if(a[i][j] != -1) vc++;
		}
		sort(t + 1, t + k + 1);
		seg.build(k);
		for(int j=1;j<=k;j++)
		{
			seg.vadd(k, j, j, lower_bound(t + 1, t + k + 1, h[j]) - t - j - 1);
			// printf("[%d] = %d\n", j, lower_bound(t + 1, t + k + 1, h[j]) - t - j - 1);
		}
		if(vc == 0 && seg.qamin() >= 0) cnt++;
		// run everywhere.
		// 宣布开除你的 C++ 籍。
		for(int j=k+1;j<=m;j++)
		{
			// if(i == 2) __debugbreak();
			// 将 v[i][j-k] 改成 v[i][j]
			int x1 = upper_bound(h + 1, h + k + 1, v[i][j-k]) - h;
			int x2 = upper_bound(h + 1, h + k + 1, v[i][j]) - h;
            if(x1 < x2) seg.vadd(k, x1, x2-1, -1);
            if(x1 > x2) seg.vadd(k, x2, x1-1, 1);
			// printf("[%d, %d]--, [%d, %d]++\n", x1, k, x2, k);
			if(a[i][j-k] != -1) vc--;
			if(a[i][j] != -1) vc++;
			if(vc == 0 && seg.qamin() >= 0) cnt++;
		}
	}
	printf("%d\n", cnt);
	return 0;
}
```
:::
