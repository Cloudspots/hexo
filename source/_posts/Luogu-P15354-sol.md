---
title: 题解：P15354 [COCI 2025/2026 #4] 体育课 / Tjelesni
date: 2026-3-19 16:04:17
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
只追踪一个元素，这个比较奇怪。

显然，一次操作相当于，取最小的元素、最大的元素、第二小的元素、第二大的元素，以此类推。我们设每次取到的最大值为“上边界”，最小值为“下边界”。

如果我们**只需要支持一次操作**，并且可以任意预处理，怎么快速维护查询的答案呢？

首先，如果修改的区间不包含 $m$，则啥都不用干。否则，我们先求出区间长度 $l$ 和比 $m$ 小的元素个数 $b$。如果 $b\ge \dfrac{l}{2}$，那么说明 $m$ 应该在上边界上。否则，应该在下边界上。这两种情况得知了 $l$ 和 $b$ 之后，$m$ 的位置都是很好算的。

也就是说，我们需要快速知道某个区间内比 $m$ 小的元素个数。

现在来考虑多次修改。一次操作后，要么变成若干个 $10$ 后接若干个 $0$，要么是若干个 $10$ 后接若干个 $1$，看 $m$ 在上边界还是下边界上。那么，我们需要一个数据结构，支持如下操作：

- 初始化。
- 将一个区间改变为 $1010\dots 10$。
- 将一个区间全部清 $0$。
- 将一个区间全部置 $1$。

线段树可以完成这一点。使用 $4$ 个 tag（也可以用一个 `int` 实现，因为四个 tag 是互斥的，真正生效的是时间最晚的 tag；代码实现中也始终只有最多一个 tag 被激活）。分别表示清零，置一，置为 $101010\dots$ 和置为 $010101\dots$。为什么有 $010101\dots$？线段树会把区间进行划分，那么 $1010\dots$ 就可能被划分为 $0101\dots$。

时间复杂度 $O(n+q\log n)$。

:::info[rec&code]
[rec](https://www.luogu.com.cn/record/268129240)。

```cpp
#include <cstdio>
#include <algorithm>

using namespace std;

int sum[400005];
class tag
{
public:
	bool clr, fil, bc1, bc0;
} tg[400005];

bool fg[100005];

void pushdown(int id, int l, int r)
{
	if(tg[id].clr)
	{
		tg[id].clr = false;
		tg[id * 2] = tg[id * 2 + 1] = {true, false, false, false};
		sum[id * 2] = sum[id * 2 + 1] = 0;
	}
	if(tg[id].fil)
	{
		tg[id].fil = false;
		tg[id * 2] = tg[id * 2 + 1] = {false, true, false, false};
		sum[id * 2] = ((l + r) / 2 - l + 1);
		sum[id * 2 + 1] = (r - ((l + r) / 2 + 1) + 1);
	}
	if(tg[id].bc1)
	{
		tg[id].bc1 = false;
		tg[id * 2] = {false, false, true, false};
		sum[id * 2] = ((l + r) / 2 - l) / 2 + 1;
		// printf("[pushdown] id = %d, l = %d, r = %d, bc1 = true\n", id, l, r);
		if(((l + r) / 2 - l + 1) % 2 == 0)
		{
			// printf("right is bc1\n");
			tg[id * 2 + 1] = {false, false, true, false};
			sum[id * 2 + 1] = (r - ((l + r) / 2 + 1)) / 2 + 1;
		}
		else
		{
			// printf("right is bc0\n");
			tg[id * 2 + 1] = {false, false, false, true};
			sum[id * 2 + 1] = (r - ((l + r) / 2 + 1) + 1) / 2;
		}
	}
	if(tg[id].bc0)
	{
		tg[id].bc0 = false;
		tg[id * 2] = {false, false, false, true};
		sum[id * 2] = ((l + r) / 2 - l + 1) / 2;
		// printf("[pushdown] id = %d, l = %d, r = %d, bc0 = true\n", id, l, r);
		if(((l + r) / 2 - l + 1) % 2 == 0)
		{
			tg[id * 2 + 1] = {false, false, false, true};
			sum[id * 2 + 1] = (r - ((l + r) / 2 + 1) + 1) / 2;
		}
		else
		{
			tg[id * 2 + 1] = {false, false, true, false};
			sum[id * 2 + 1] = (r - ((l + r) / 2 + 1)) / 2 + 1;
		}
	}
}

void build(int l, int r, int id)
{
	if(l == r)
	{
		sum[id] = (int)fg[l];
		tg[id] = {false, false, false, false};
		return;
	}
	build(l, (l + r) / 2, id * 2);
	build((l + r) / 2 + 1, r, id * 2 + 1);
	sum[id] = sum[id * 2] + sum[id * 2 + 1];
	tg[id] = {false, false, false, false};
}

void meow(int l, int r, int vl, int vr, int id, bool bgw = true)
{
	// printf("[meow] l = %d, r = %d, vl = %d, vr = %d, id = %d, bgw = %d\n", l, r, vl, vr, id, (int)bgw);
	if(l == vl && r == vr)
	{
		tg[id] = {false, false, bgw, !bgw};
		if(bgw) sum[id] = (r - l) / 2 + 1;
		else sum[id] = (r - l + 1) / 2;
		return;
	}
	pushdown(id, l, r);
	if(vl <= (l + r) / 2) meow(l, (l + r) / 2, vl, min(vr, (l + r) / 2), id * 2, bgw);
	if(vr > (l + r) / 2) meow((l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, id * 2 + 1, bgw ^ (max(0, (l + r) / 2 - vl + 1) & 1));
	sum[id] = sum[id * 2] + sum[id * 2 + 1];
}

void mfil(int l, int r, int vl, int vr, int id)
{
	if(l == vl && r == vr)
	{
		tg[id] = {false, true, false, false};
		sum[id] = (r - l + 1);
		return;
	}
	pushdown(id, l, r);
	if(vl <= (l + r) / 2) mfil(l, (l + r) / 2, vl, min(vr, (l + r) / 2), id * 2);
	if(vr > (l + r) / 2) mfil((l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, id * 2 + 1);
	sum[id] = sum[id * 2] + sum[id * 2 + 1];
}

void mclr(int l, int r, int vl, int vr, int id)
{
	if(l == vl && r == vr)
	{
		tg[id] = {true, false, false, false};
		sum[id] = 0;
		return;
	}
	pushdown(id, l, r);
	if(vl <= (l + r) / 2) mclr(l, (l + r) / 2, vl, min(vr, (l + r) / 2), id * 2);
	if(vr > (l + r) / 2) mclr((l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, id * 2 + 1);
	sum[id] = sum[id * 2] + sum[id * 2 + 1];
}

int qsum(int l, int r, int vl, int vr, int id)
{
	// printf("[qsum] l = %d, r = %d, vl = %d, vr = %d, id = %d\n", l, r, vl, vr, id);
	if(l == vl && r == vr)
	{
		// printf("return directly. answer is %d\n", sum[id]);
		return sum[id];
	}
	pushdown(id, l, r);
	int s = 0;
	if(vl <= (l + r) / 2) s += qsum(l, (l + r) / 2, vl, min(vr, (l + r) / 2), id * 2);
	if(vr > (l + r) / 2) s += qsum((l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, id * 2 + 1);
	return s;
}

int main()
{
	int n, q, m;
	scanf("%d%d%d", &n, &q, &m);
	int mpos;
	for(int i=1;i<=n;i++)
	{
		int a;
		scanf("%d", &a);
		// scanf("%d", a + i);
		if(a == m) mpos = i;
		if(a < m) fg[i] = true;
	}
	build(1, n, 1);
	while(q--)
	{
		int l, r;
		scanf("%d%d", &l, &r);
		// 101010...1111 or 101010...0000
		int bcc = qsum(1, n, l, r, 1);
		int len = r - l + 1;
		// printf("l = %d, r = %d, bcc = %d\n", l, r, bcc);
		if(bcc == len) continue;
		if(bcc == 0)
		{
			if(l <= mpos && mpos <= r) mpos = l;
			continue;
		}
		// printf("there are %d numbers < %d in [%d, %d]\n", bcc, m, l, r);
		if(bcc * 2 >= len)
		{
			// 大多数都是 < 的，所以是 101010...1111
			// 计算从 10 到全 1 的分界线
			// 分界线为 k
			// k / 2 + (l - k) = b
			// k + 2l - 2k = 2b
			// k = 2l - 2b.
			// k = 2(l-b) 
			int k = 2 * (len - bcc);
			// printf("k = %d\n", k);
			// if(l + k - 1 < l) return 1;
			meow(1, n, l, l+k-1, 1);
			if(l + k <= r) mfil(1, n, l+k, r, 1);
			// printf("[%d, %d]: 1010...10, [%d, %d]: 111...1\n", l, l+k-1, l+k, r);
			// 同时计算位置
			if(l <= mpos && mpos <= r) mpos = l + k - 1;
		}
		else
		{
			int k = 2 * bcc;
			// if(l + k - 1 < l) return 2;
			if(l + k > r) return 1;
			meow(1, n, l, l+k-1, 1);
			if(l + k <= r) mclr(1, n, l+k, r, 1);
			// printf("[%d, %d]: 1010...10, [%d, %d]: 000...0\n", l, l+k-1, l+k, r);
			if(l <= mpos && mpos <= r) mpos = l + k;
		}
		// printf("mpos = %d\n", mpos);
	}
	printf("%d\n", mpos);
	return 0;
}
```
:::