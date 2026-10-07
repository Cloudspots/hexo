---
title: 题解：P15810 [JOI 2013 Final] 冒泡排序 / Bubble Sort
date: 2026-09-24 21:17:50
updated: 2026-09-26 19:17:00
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P15810 [JOI 2013 Final] 冒泡排序 / Bubble Sort

> 现在想来确实不难，赛时都想到类似前缀最大值/后缀最小值了，死于太低的数据结构技术/dk/dk/ll。

---

经典结论：冒泡排序实际交换次数等于（严格）逆序对个数。证明是显然的，考虑每次交换逆序对个数必然恰好减少 $1$。

考虑交换 $i<j,a_i\le a_j$ 一定不优，所以除非本来就是非严格升序那么必然会交换 $i<j,a_i>a_j$。考虑贡献。对于 $k\not\in [i,j]$ 显然不变，$a_k\not\in [a_j,a_i]$ 也是不变的。若 $k\in [i,j],a_k\in [a_j,a_i]$，那么一般会减少两个逆序对，但如果 $a_k=a_i$ 或 $a_k=a_j$ 则会减少一个。

换句话说会减少 $\displaystyle\sum_{k=i}^j [a_k\in [a_j,a_i]]+[a_k\in (a_j,a_i)]$。

考虑转化为二维平面。如果 $(i,a_i)$ 的左上方（非严格，但不包括自己）有点那么显然选择 $(i,a_i)$ 必然不优，$(j,a_j)$ 的右下方同理。换句话说总是存在一个最优解满足 $(i,a_i)$ 左上方没有点，$(j,a_j)$ 右下方也没有。再换句话说，$(i,a_i)$ 是（严格）前缀最大值，$(j,a_j)$ 是（严格）后缀最小值。

直接计算是不好做的，况且还有 $O(n^2)$ 个前缀最大值-后缀最小值二元组。但是，反过来考虑每个点 $(i,a_i)$ 对于所有前缀最大值-后缀最小值二元组 $(x,y)$ 的贡献，显然对于 $x$ 的一个区间产生贡献，$y$ 也是。区间本身是好算的。

那么就转化为平面上有若干个长方形，求被最多长方形包含的点。扫描线一下就做完了。时间复杂度 $O(n\log n)$。喵！！

注意一些细节就是。比如边界和离散化。不过还是不难写的。使用了半个小时。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/299078777)。

文件最前面的注释可能是假的。

```cpp
/*
NO MORE BUBBLE SORTING PROBLEMS!!!!!!!!!!
*/
/*
逆序对数。

选择两个数 l,r，满足 a[l] > a[r]，最大化满足 a[l] > a[i] > a[r], l < i < r 的 i 的数量。

哦，给定二维平面上若干个点，要求选择两个点分别作为左上角、右下角，求张成的长方形内部（不包括边界）的点数的最大值。

看起来很好玩.jpg

This ought be fun!!
*/
/*
不会，又是，计算几何，吧

我不喜欢计算几何 :(
*/
/*
你 cdq 吗

首先翻转一遍然后 a[l] < a[i] < a[r].

cdq.

cdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdqcdq

不对直接分治就做完了，需要一个支持单点激活（其实可以用单点修改实现，未激活 = -inf，激活 => 0），区间加法，全局求 max 的线段树，记得离散化。

> 我最喜欢的数据结构之一：激活线段树。

同时对于相同的数字下标大的在先，相当于小下标 + eps。

总时间复杂度 O(n log^2 n)。
*/
// 非常好，假了，那就乱搞吧。
#include <map>
#include <vector>
#include <cstdio>
#include <random>
#include <chrono>
#include <bitset>
#include <utility>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };
const auto getr = [](int l, int r, int id) { return id + ((l + r) / 2 - l + 1) * 2; };

class segtree
{
public:
	class node { public: int maxn, minn, addn; } nodes[400005];
	void pushup(int l, int r, int id) { nodes[id].maxn = max(nodes[id + 1].maxn, nodes[getr(l, r, id)].maxn); nodes[id].minn = min(nodes[id + 1].minn, nodes[getr(l, r, id)].minn); nodes[id].addn = 0; }
	void pushdown(int l, int r, int id) { nodes[id + 1].maxn += nodes[id].addn; nodes[id + 1].minn += nodes[id].addn; nodes[id + 1].addn += nodes[id].addn; nodes[getr(l, r, id)].maxn += nodes[id].addn; nodes[getr(l, r, id)].minn += nodes[id].addn; nodes[getr(l, r, id)].addn += nodes[id].addn; nodes[id + 1].minn = max(nodes[id + 1].minn, nodes[id].minn); nodes[id + 1].maxn = max(nodes[id + 1].maxn, nodes[id].minn); nodes[getr(l, r, id)].minn = max(nodes[getr(l, r, id)].minn, nodes[id].minn); nodes[getr(l, r, id)].maxn = max(nodes[getr(l, r, id)].maxn, nodes[id].minn); nodes[id].addn = 0; }
	void build(int n) { U([&](auto &&self, int l, int r, int id) -> void { if(l == r) { nodes[id] = {0, 0, 0}; return; } self(self, l, (l + r) / 2, id + 1); self(self, (l + r) / 2 + 1, r, getr(l, r, id)); pushup(l, r, id); })(1, n, 1); }
	void vadd(int n, int L, int R, int val) { U([&](auto &&self, int l, int r, int vl, int vr, int id) -> void { if(l == vl && r == vr) { nodes[id].addn += val; nodes[id].maxn += val; nodes[id].minn += val; return; } pushdown(l, r, id); if(vl <= (l + r) / 2) self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1); if(vr > (l + r) / 2) self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id)); pushup(l, r, id); })(1, n, L, R, 1); }
	void vmax(int n, int L, int R, int val) { U([&](auto &&self, int l, int r, int vl, int vr, int id) -> void { if(l == vl && r == vr) { nodes[id].minn = max(nodes[id].minn, val); return; } pushdown(l, r, id); if(vl <= (l + r) / 2) self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1); if(vr > (l + r) / 2) self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id)); pushup(l, r, id); })(1, n, L, R, 1); }
	int qamax() { return nodes[1].maxn; }
} seg; // meow!

class fenwick
{
public:
	int st[100005];
	void vadd(int pos, int val, int n) { do { st[pos] += val; } while((pos += pos & -pos) <= n); }
	int qsum(int pos) { int sum = 0; do { sum += st[pos]; } while(pos -= pos & -pos); return sum; }
} fw;

int a[100005];
int pmxp[100005], smnp[100005];
class pt { public: int x, y, v; } pts[800005];

int main()
{
	int n;
	scanf("%d", &n);
	map<int, int> concrete;
	for(int i=1;i<=n;i++)
	{
		scanf("%d", a + i);
		concrete[a[i]];
	}
	if(is_sorted(a + 1, a + n + 1))
	{
		printf("%d\n", concrete.size() == n ? 1 : 0);
		return 0; // Meow!!
	}
	int mathematics = 0;
	for(auto &[x, y] : concrete) y = ++mathematics;
	for(int i=1;i<=n;i++) a[i] = concrete[a[i]];
	long long vk = 0;
	for(int i=n;i>=1;i--)
	{
		vk += fw.qsum(a[i]-1);
		fw.vadd(a[i], 1, n);
	}
	for(int i=1;i<=n;i++)
	{
		fw.vadd(a[i], -1, n);
	} // 离散化 & 算逆序对
	pmxp[1] = 1;
	int mxcur = 1;
	for(int i=2;i<=n;i++)
	{
		if(a[i] > a[pmxp[mxcur]]) pmxp[++mxcur] = i;
	}
	int mncur = 1;
	smnp[1] = n;
	for(int i=n-1;i>=1;i--)
	{
		if(a[i] < a[smnp[mncur]]) smnp[++mncur] = i;
	}
	reverse(smnp + 1, smnp + mncur + 1); // 图灵机无法跨越的一道大关 XD
	int cur = 0;
	for(int i=1;i<=n;i++)
	{
		// 1) 非严格
		// 先算 prefix max range
		// 左端点是第一个 >= a[i] 的位置，右端点是最后一个 <= i 的下标。
		int val1 = lower_bound(pmxp + 1, pmxp + mxcur + 1, i, [](int x, int y) { return a[x] < a[y]; }) - pmxp;
		int var1 = upper_bound(pmxp + 1, pmxp + mxcur + 1, i) - pmxp - 1;
		// suffix min range
		// 左端点是 >= i 下标，右端点是 <= a[i] 位置。
		int vbl1 = lower_bound(smnp + 1, smnp + mncur + 1, i) - smnp;
		int vbr1 = upper_bound(smnp + 1, smnp + mncur + 1, i, [](int x, int y) { return a[x] < a[y]; }) - smnp - 1;
		if(val1 > var1 || vbl1 > vbr1) continue; // 爆炸
		pts[++cur] = {val1, vbl1, 1};
		pts[++cur] = {val1, vbr1 + 1, -1};
		pts[++cur] = {var1 + 1, vbl1, -1};
		pts[++cur] = {var1 + 1, vbr1 + 1, 1};
		// printf("1) [%d, %d] & [%d, %d]\n", val1, var1, vbl1, vbr1);
		// 2) 严格
		// 同理
		int val2 = upper_bound(pmxp + 1, pmxp + mxcur + 1, i, [](int x, int y) { return a[x] < a[y]; }) - pmxp;
		int var2 = lower_bound(pmxp + 1, pmxp + mxcur + 1, i) - pmxp - 1;
		int vbl2 = upper_bound(smnp + 1, smnp + mncur + 1, i) - smnp;
		int vbr2 = lower_bound(smnp + 1, smnp + mncur + 1, i, [](int x, int y) { return a[x] < a[y]; }) - smnp - 1;
		if(val2 > var2 || vbl2 > vbr2) continue; // 爆炸
		pts[++cur] = {val2, vbl2, 1};
		pts[++cur] = {val2, vbr2 + 1, -1};
		pts[++cur] = {var2 + 1, vbl2, -1};
		pts[++cur] = {var2 + 1, vbr2 + 1, 1};
		// printf("2) [%d, %d] & [%d, %d]\n", val2, var2, vbl2, vbr2);
	}
	sort(pts + 1, pts + cur + 1, [](const auto &x, const auto &y) { return x.x < y.x || x.x == y.x && x.v < y.v; });
	seg.build(n + 1);
	int maxn = 0;
	for(int i=1;i<=cur;i++)
	{
		auto [x, y, d] = pts[i];
		// printf("x = %d, y = %d, d = %d\n", x, y, d);
		seg.vadd(n + 1, y + 1, n + 1, d);
		// if(pts[i].x > pts[i-1].x) seg.vmax(n+1, 1, n+1, 0);
		maxn = max(maxn, seg.qamax());
	}
	// printf("maxn = %d\n", maxn);
	printf("%lld\n", vk - maxn + 1);
	return 0;
}
```

:::
