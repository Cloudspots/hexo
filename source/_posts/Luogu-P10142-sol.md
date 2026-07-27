---
title: 题解：P10142 [USACO24JAN] Mooball Teams III P
date: 2026-5-12 16:03:56
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
挺好玩的一个题。但是为什么我的代码跑这么慢。

---

首先显然交换两组是等价的，所以将答案除以 $2$。设两个组为 $A,B$ 组，交换后等价。

直接做非常不好考虑，考虑容斥。我们考虑如果不考虑横着的网，只考虑竖着的，那么不妨设左边是 $A$，右边是 $B$。考虑使用标志物去重，我们确定 $A$ 最靠右的奶牛。此时它左边（不包括它）都可以属于 $A$，或者不选。而右边（也不包括它）都可以属于 $B$ ，或者不选。注意每一队必须至少一个人。$A$ 已经有一个了，$B$ 却可能不符合。那么设它左边有 $x$ 头奶牛，右边有 $y$ 头，则有 $2^x(2^y-1)$ 种。

然后还需要考虑只有横着的。此时不妨设上面是红队，一样的方法即可。

什么情况下会出现重复？就是横竖都可以分的情况。具体来说有两种：$\begin{bmatrix}A&.\\.&B\end{bmatrix}$ 或 $\begin{bmatrix}.&B\\A&.\end{bmatrix}$。

我们发现，如果我们允许组为空，那么上下两边任意组为空的情况就直接抵消了！那么还不如允许组为空。

那么原本两种情况的答案就都是 $2^x2^y$，其中 $x+y+1=n$，也就是 $2^{n-1}$。有 $n$ 种选择方式，所以是 $n2^{n-1}$。同时，横竖都是 $n2^{n-1}$，所以总和是 $n2^n$。

现在考虑如何求出重复的情况。不妨只考虑第二种。与其直接对着这个图看，还不如考虑是如何引起重复的，也就是说，在上面一横一竖的统计方法种，横竖分别选取了哪些奶牛作为分界点。

假设选了奶牛 $a$ 作为 $x$ 坐标分界点（左边的都属于 $A$ 组），$b$ 作为 $y$ 坐标分界点（下面的都属于 $A$ 组），那么所有 $x$ 坐标小于 $a$（的 $x$ 坐标，下同。“$x/y$ 坐标小于/大于 $a/b$” 默认指 $x/y$ 坐标小于/大于 $a/b$ 的 $x/y$ 坐标），$y$ 坐标小于 $b$ 的奶牛都可以任选 $A$ 组或无组别；$x$ 坐标大于 $a$，$y$ 坐标大于 $b$ 的都可以选择 $B$ 组或无组别；$A,B$ 必须属于 $A$ 组；其它奶牛必须无组别。

那么就相当于统计 $x,y$ 坐标都分别小于 $a,b$ 的奶牛个数和 $x,y$ 坐标都大于 $a,b$ 的奶牛个数。我们不妨把前者改成小于等于，此时当 $a=b$ 时个数增加了 $1$，否则个数增加了 $2$，可以特判。

扫描线。设 $f_i$ 代表假设当前的 $x$ 坐标为 $j$，则 $x$ 坐标小于等于 $j$ 且 $y$ 坐标小于等于 $i$ 或 $x$ 坐标严格大于 $j$ 且 $y$ 坐标严格大于 $i$ 的点的个数。

但是别忘了，我们的 $a,b$ 选取有个条件：$a,b$ 都不能在对方的左下方（相同是可以的），否则会重复计数。所以，我们只能选择当前扫描线扫过的点（为了保证 $x$ 坐标，包括当前点）中 $y$ 坐标大于等于当前 $y$ 坐标的（为了保证 $y$ 坐标，注意 $y$ 坐标相同时需要特殊处理）。

后面的区间求和是简单的，线段树。前面如何判断“已经扫过的点呢”呢？

我采用的方法是，对于线段树的叶子节点增加“激活”标记。如果未激活，则标记上传时贡献强制设为 $0$（节点本身的乘法和值标记不变）。否则，当激活一个点时，一路标记上传更新祖先链。还有一个方法，开两棵线段树，一棵维护原值，一棵维护只考虑已经遇到的点的值，每次将第一棵线段树的对应位置复制到另外一棵即可。实际上，因为有两种可能的重复情况，所以一共要开四棵线段树，不好看。

细节比较多，需要仔细思考。对于另外一种重复情况，是对称的，可以自己思考。还是有很多细节。注意复制粘贴的话不要漏改了。

这样我们就以 $O(n\log n)$ 的优秀时间复杂度解决了这道题，但是大常数。分析一下，每扫到一个点最多需要进行 $2$ 次单点激活和 $4$ 次区间修改，还需要进行 $2$ 次区间求和和 $2$ 次单点求和。同时有大量的取模运算（虽然并不会很慢，因为有 O2 加持）。

另外，不怕死的可以去尝试一下不保证 $x,y$ 都为排列的情况。目测差不多，只是细节……

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/277550824)。

```cpp
#include <cstdio>
#include <algorithm>
#include <cassert>

using namespace std;

class cow
{
public:
	int x, y;
} cows[200005];

long long po2[200005];
int initval[200005];

class segtree
{
	class inf { public: long long sum, mul; bool act; } tags[400005];
	constexpr int getr(int l, int r, int id) { return id + ((l + r) / 2 - l + 1) * 2; }
	void pushdown(int l, int r, int id) { tags[id + 1].sum = tags[id + 1].sum * tags[id].mul % 1000000007; tags[id + 1].mul = tags[id + 1].mul * tags[id].mul % 1000000007; tags[getr(l, r, id)].sum = tags[getr(l, r, id)].sum * tags[id].mul % 1000000007; tags[getr(l, r, id)].mul = tags[getr(l, r, id)].mul * tags[id].mul % 1000000007; tags[id].mul = 1; }
	void pushup(int l, int r, int id) { tags[id].sum = ((tags[id + 1].act ? tags[id + 1].sum : 0) + (tags[getr(l, r, id)].act ? tags[getr(l, r, id)].sum : 0)) % 1000000007; tags[id].act = true; }
public:
	void build(int l, int r, int id)
	{
		if(l == r)
		{
			tags[id] = {po2[initval[l]], 1, false};
			return;
		}
		build(l, (l + r) / 2, id + 1);
		build((l + r) / 2 + 1, r, getr(l, r, id));
		tags[id].mul = 1;
		pushup(l, r, id);
	}
	long long qsum(int l, int r, int vl, int vr, int id)
	{
		if(l == vl && r == vr) return tags[id].act ? tags[id].sum : 0;
		long long sum = 0;
		pushdown(l, r, id);
		if(vl <= (l + r) / 2) sum = (sum + qsum(l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1)) % 1000000007;
		if(vr > (l + r) / 2) sum = (sum + qsum((l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id))) % 1000000007;
		return sum;
	}
	void vmul(int l, int r, int vl, int vr, int val, int id)
	{
		if(l == vl && r == vr)
		{
			// if(!tags[id].act) return;
			tags[id].sum = tags[id].sum * val % 1000000007;
			tags[id].mul = tags[id].mul * val % 1000000007;
			return;
		}
		pushdown(l, r, id);
		if(vl <= (l + r) / 2) vmul(l, (l + r) / 2, vl, min(vr, (l + r) / 2), val, id + 1);
		if(vr > (l + r) / 2) vmul((l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, val, getr(l, r, id));
		pushup(l, r, id);
	}
	void activate(int l, int r, int pos, int id)
	{
		if(l == r)
		{
			tags[id].act = true;
			return;
		}
		pushdown(l, r, id);
		if(pos <= (l + r) / 2) activate(l, (l + r) / 2, pos, id + 1);
		else activate((l + r) / 2 + 1, r, pos, getr(l, r, id));
		pushup(l, r, id);
	}
} s1, s2;

class bit
{
	int v[200005];
public:
	void vadd(int pos, int val, int n)
	{
		do
		{
			v[pos] += val;
		} while((pos += pos & -pos) <= n);
	}
	int qsum(int pos)
	{
		int sum = 0;
		do
		{
			sum += v[pos];
		} while(pos -= pos & -pos);
		return sum;
	}
} bt;

int main()
{
	int n;
	scanf("%d", &n);
	po2[0] = 1;
	for(int i=1;i<=n;i++)
	{
		scanf("%d%d", &cows[i].x, &cows[i].y);
		po2[i] = po2[i-1] * 2 % 1000000007;
	}
	long long sum = 2 * po2[n-1] % 1000000007 * n % 1000000007;
	// printf("sum = %lld\n", sum);
	sort(cows + 1, cows + n + 1, [](const auto &x, const auto &y) { return x.y < y.y; });
	for(int i=1;i<=n;i++)
	{
		initval[i] = n - i;
		// printf("1: %d is 2^%d\n", i, initval[i]);
	}
	s1.build(1, n, 1);
	for(int i=1;i<=n;i++)
	{
		initval[i] = i - 1;
		// printf("2: %d is 2^%d\n", i, initval[i]);
	}
	s2.build(1, n, 1);
	sort(cows + 1, cows + n + 1, [](const auto &x, const auto &y) { return x.x < y.x; });
	for(int i=1;i<=n;i++)
	{
		// printf("1: activate %d\n", cows[i].y);
		// printf("2: activate %d\n", cows[i].y);
		s1.activate(1, n, cows[i].y, 1); s2.activate(1, n, cows[i].y, 1);
		// printf("1: [%d, %d] * 2\n", cows[i].y, n);
		s1.vmul(1, n, cows[i].y, n, 2, 1);
		if(cows[i].y > 1)
		{
			// printf("1: [%d, %d] / 2\n", 1, cows[i].y - 1);
			s1.vmul(1, n, 1, cows[i].y - 1, 500000004, 1);
		}
		// printf("2: [%d, %d] * 2\n", 1, cows[i].y);
		s2.vmul(1, n, 1, cows[i].y, 2, 1);
		if(cows[i].y < n)
		{
			// printf("2: [%d, %d] / 2\n", cows[i].y + 1, n);
			s2.vmul(1, n, cows[i].y + 1, n, 500000004, 1);
		}
		long long val = ((cows[i].y > 1 ? s2.qsum(1, n, 1, cows[i].y - 1, 1) : 0) + (cows[i].y < n ? s1.qsum(1, n, cows[i].y + 1, n, 1) : 0)) % 1000000007 * 500000004 % 1000000007 + s1.qsum(1, n, cows[i].y, cows[i].y, 1) + s2.qsum(1, n, cows[i].y, cows[i].y, 1);
		sum = (sum - val % 1000000007 * 500000004 % 1000000007 + 1000000007) % 1000000007;
		// printf("i = %d, subtract %lld\n", i, val / 2);
		// printf("----------\nBtw:\n");
		// printf("s1:");
		// for(int i=1;i<=n;i++)
		// {
		// 	printf(" %lld", s1.qsum(1, n, i, i, 1));
		// }
		// printf("\ns2:");
		// for(int i=1;i<=n;i++)
		// {
		// 	printf(" %lld", s2.qsum(1, n, i, i, 1));
		// }
		// printf("\n");
	}
	printf("%lld\n", sum * 2 % 1000000007);
	return 0;
}
```

:::