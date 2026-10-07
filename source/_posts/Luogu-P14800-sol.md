---
title: 题解：P14800 [JOI 2026 二次预选] 船 / Ship
date: 2026-10-06 18:27:57
updated: 2026-10-07 21:51:39
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P14800 [JOI 2026 二次预选] 船 / Ship

首先若 $n$ 是偶数，则必然是 $i$ 与 $i+\dfrac{n}{2}$ 配对。调整法容易证明。

考虑 $n$ 是奇数。显然是一个长为 $3$ 的等差数列，剩下按照偶数情况配对。

容易发现对于中间数字相同的长为 $3$ 的等差数列显然是越长越好。这是因为贡献由三部分组成：

- 长为 $3$ 的等差数列自身。显然越长越好。
- 一个端点在长为 $3$ 的等差数列范围内部，一个在外部。显然越长就会有越多的配对属于这种情况，而这样显然更优。
- 被长为 $3$ 的等差数列包含或与其无交。此时和原数列相同。分讨可以发现长度大更优。
- 而对于包含长为 $3$ 的等差数列的，虽然长度小更优，但是不会对答案产生贡献（会被等差数列本身覆盖）。

枚举每个长为 $3$ 的等差数列的中心，求最长半径（双指针），然后暴力计算贡献即可。时间复杂度 $O(n^2)$。

是谁写了 $O(n^3)$ 还过了。

:::info[rec&code]

卡常后拿下了最优解。这是没卡常的代码。

[rec](https://www.luogu.com.cn/record/301398743)。

```cpp
/*
认为不可做然后发现是脑筋急转弯 XD

然后发现原来是最大值，不是和 :D

n 是偶数：1&n/2, 2&n/2+1, ...

n 是奇数：考虑每个位置能和什么构成 len=3 的等差数列。

容易发现大的更优。（对于完全包含这个 len=3 的会更劣，但这个必然不是瓶颈）。

直接做。不需要二分。
*/
#include <cstdio>
#include <cassert>
#include <algorithm>

using namespace std;

int a[3505], b[3505];

int main()
{
	int n;
	scanf("%d", &n);
	for(int i=1;i<=n;i++) scanf("%d", a + i);
	if(n % 2 == 0)
	{
		int minn = 0x3f3f3f3f;
		for(int i=1;i<=n/2;i++) minn = min(minn, a[i+n/2] - a[i]);
		printf("%d\n", minn);
		return 0;
	}
	int maxn = -1;
	for(int i=1;i<=n;i++)
	{
		int ansj = 0, anxc = 0;
		int xcur = i;
		for(int j=i-1;j>=1;j--)
		{
			while(xcur <= n && a[xcur] - a[i] < a[i] - a[j]) xcur++;
			if(a[xcur] - a[i] == a[i] - a[j])
			{
				ansj = j;
				anxc = xcur;
			}
		}
		if(!ansj) continue;
		int fc = 0;
		for(int j=1;j<=n;j++) if(j != i && j != ansj && j != anxc) b[++fc] = a[j];
		assert(fc == n - 3);
		int minn = a[anxc] - a[i];
		for(int j=1;j<=fc/2;j++) minn = min(minn, b[j+fc/2] - b[j]);
		maxn = max(maxn, minn);
	}
	printf("%d\n", maxn);
	return 0;
}
// 8s 是用来让暴力过去的吗？？？？？？？
```

:::
