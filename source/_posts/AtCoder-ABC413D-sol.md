---
title: 题解：AT_abc413_d [ABC413D] Make Geometric Sequence
date: 2025-7-6 10:32:31
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
简单分讨题。不知道为啥大家都在说难做。

分类讨论：

1. 公比 $>0$：元素必须正负性相同，并且从小到大排列后为等比数列。
2. 公比 $=0$：不可能的。
3. 公比 $<0$ 且 $\neq -1$：元素绝对值应当互不相同，且按照绝对值从小到大排序后为等比数列且符号正负交替。
4. 公比 $=-1$：元素绝对值全部相同，且应当能够排列为正负两两交替。也就是说，绝对值全部相同且正数个数与负数个数相差不超过 $1$。

如何判断是不是等比数列：直接判断可能会被卡精度（参考以前某一次 ABC 的 B）并且不好写。实际上 $\dfrac{a_{i-1}}{a_i}=\dfrac{a_i}{a_{i+1}}$ 可以被表示为 $a_i^2=a_{i-1}a_{i+1}$，只需要开 `long long` 即可（实际上换一种写法也不需要只不过不用那么干）。

```cpp
/*
分讨【数据删除】题。
首先判断公比是否能够为正。这样，元素应当被从小到大排序或从大到小排序。判断。
然后如果为负。那么元素的绝对值应当被从小到大或从大到小，且正负性交替。
不可以为零。
*/
#include <cstdio>
#include <cmath>
#include <algorithm>

using namespace std;

long long a[200005];
bool isgeo(int n)
{
	for (int i = 2; i + 1 <= n; i++)
	{
		if (a[i] * a[i] != a[i - 1] * a[i + 1]) return false;
	}
	return true;
}

void solve()
{
	int n;
	scanf("%d", &n);
	bool hp = false, hn = false;
	for (int i = 1; i <= n; i++)
	{
		scanf("%lld", a + i);
		if (a[i] > 0) hp = true;
		else hn = true;
	}
	if (n == 2)
	{
		printf("Yes\n");
		return;
	}
	{
		// update.
		int hnp = 0, hpp = 0, r = abs(a[1]);
		for (int i = 1; i <= n; i++)
		{
			if (a[i] > 0) hpp++;
			else hnp++;
			if (abs(a[i]) != r) r = -1;
		}
		if (r != -1 && abs(hnp - hpp) <= 1)
		{
			printf("Yes\n");
			return;
		}
	}
	if (hp ^ hn)
	{
		sort(a + 1, a + n + 1);
		if (isgeo(n))
		{
			printf("Yes\n");
			return;
		}
	}
	// sort by absolute number
	sort(a + 1, a + n + 1, [](auto x, auto y) { return abs(x) < abs(y); });
	for (int i = 1; i <= n; i++)
	{
		if (i >= 2 && abs(a[i]) == abs(a[i - 1]) || i < n && abs(a[i]) == abs(a[i + 1]))
		{
			printf("No\n");
			return;
		}
		if (i >= 2 && a[i] * a[i - 1] > 0)
		{
			printf("No\n");
			return;
		}
	}
	if (isgeo(n)) printf("Yes\n");
	else printf("No\n");
}

int main()
{
	int t;
	scanf("%d", &t);
	while (t--) solve();
	return 0;
}
```

[sub](https://atcoder.jp/contests/abc413/submissions/67371025)