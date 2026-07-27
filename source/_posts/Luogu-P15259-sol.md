---
title: 题解：P15259 [USACO26JAN2] Farmer John Loves Rotations S
date: 2026-5-2 12:11:26
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
首先显然对整个数组循环移位相当于对指针 $p$ 循环移位。那么首先考虑只能左移（为什么首先考虑这个？因为我把题目名称看成了 Farmer John Left Rotations 然后以为只能左移）。

这个是简单的，你可以双指针。首先为了方便把数组复制成两份，然后双指针就好了。

这样还可以找到所有极小合法区间。

现在来考虑原题。假设我们有 $[l,r]$ 满足条件，那么对于 $l\le i\le r$，有 $\text{Ans}_i=\min(\text{Ans}_i,r-l+i-l,r-l+r-i)$。这样，所有项都是 $x-i$ 或 $x+i$ 的形式。开两棵线段树，分别记录两个的 $x$ 的最小值即可。

时间复杂度 $O(n\log n)$，大常数。

:::info[rec&code]
[rec](https://www.luogu.com.cn/record/276258911)。

```cpp
#include <cstdio>
#include <map>

using namespace std;

int a[1500005];

class minsegtree
{
	class tag { public: int minn, setmin; } tags[2000005];
	constexpr int getr(int l, int r, int id) { return id + ((l + r) / 2 - l + 1) * 2; }
	void pushup(int l, int r, int id) { tags[id].minn = min(tags[id+1].minn, tags[getr(l, r, id)].minn); }
	void pushdown(int l, int r, int id) { tags[id+1].setmin = min(tags[id+1].setmin, tags[id].setmin); tags[id+1].minn = min(tags[id+1].minn, tags[id].setmin); tags[getr(l, r, id)].setmin = min(tags[getr(l, r, id)].setmin, tags[id].setmin); tags[getr(l, r, id)].minn = min(tags[getr(l, r, id)].minn, tags[id].setmin); tags[id].setmin = 0x3f3f3f3f; }
public:
	void build(int l, int r, int id)
	{
		if(l == r) tags[id] = {0x3f3f3f3f, 0x3f3f3f3f};
		else
		{
			tags[id] = {0x3f3f3f3f, 0x3f3f3f3f};
			build(l, (l + r) / 2, id + 1);
			build((l + r) / 2 + 1, r, getr(l, r, id));
		}
	}
	void vmin(int l, int r, int vl, int vr, int val, int id)
	{
		if(l == vl && r == vr)
		{
			tags[id].minn = min(tags[id].minn, val);
			tags[id].setmin = min(tags[id].setmin, val);
		}
		else
		{
			pushdown(l, r, id);
			if(vl <= (l + r) / 2) vmin(l, (l + r) / 2, vl, min(vr, (l + r) / 2), val, id + 1);
			if(vr > (l + r) / 2) vmin((l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, val, getr(l, r, id));
			pushup(l, r, id);
		}
	}
	int qmin(int l, int r, int vl, int vr, int id)
	{
		if(l == vl && r == vr) return tags[id].minn;
		pushdown(l, r, id);
		int minn = 0x3f3f3f3f;
		if(vl <= (l + r) / 2) minn = min(minn, qmin(l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1));
		if(vr > (l + r) / 2) minn = min(minn, qmin((l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id)));
		return minn;
	}
} mn1, mn2;

int main()
{
	int n;
	scanf("%d", &n);
	for(int i=1;i<=n;i++)
	{
		scanf("%d", a + i);
		a[n+i] = a[n+n+i] = a[i];
	}
	int l = 1;
	map<int, int> mp;
	for(int i=1;i<=n;i++) mp[a[i]]++;
	mn1.build(1, 2 * n + 1, 0);
	mn2.build(1, 2 * n + 1, 0);
	for(int i=n+1;i<=3*n;i++)
	{
		mp[a[i]]++;
		while(mp[a[l]] > 1)
		{
			mp[a[l]]--;
			l++;
		}
		if(l <= 2 * n)
		{
			mn1.vmin(1, 2 * n + 1, l, min(2 * n + 1, i), i - l + 1 - l, 1);
			mn2.vmin(1, 2 * n + 1, l, min(2 * n + 1, i), i - l + 1 + i, 1);
			// printf("[%d, %d]: setmin %d + i\n", l, i, i - l + 1 - l);
			// printf("[%d, %d]: setmin %d -/ i\n", l, i, i - l + 1 + i);
		}
		// printf("[%d, %d]: setmin %d - i\n", 1, l - 1, i + 1);
		mn2.vmin(1, 2 * n + 1, 1, min(2 * n + 1, l - 1), i + 1, 1);
	}
	for(int i=n+1;i<=2*n;i++)
	{
		printf("%d ", min(mn1.qmin(1, 2 * n + 1, i, i, 1) + i, mn2.qmin(1, 2 * n + 1, i, i, 1) - i) - 1);
	}
	return 0;
}
/*
given a range [l, r]

forall l <= i <= r

give

val[i] = min(val[i], len + i - l, len + r - i)

ok.

and for i < l

val[i] = min(val[i], r - i + 1)
*/
```
:::