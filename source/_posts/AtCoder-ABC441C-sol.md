---
title: 题解：AT_abc441_c [ABC441C] Sake or Water
date: 2026-1-19 13:48:33
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
贪心题。

由于是要保证能够喝到这么多酒，所以我们考虑最坏情况。

首先，你喝到的液体中，是酒的杯数应当尽量小。这是好算的，因为有 $N-K$ 瓶不是酒，那么假设你选了 $N-K+p$ 瓶，就只会喝到 $p$ 瓶酒。

然后，在这 $p$ 瓶酒中，你喝到的总酒量也会是最小的。也就是说，你喝到的液体中，液体体积最小的 $p$ 瓶会是酒。

虽然你运气非常不好选到了最坏情况，但是你也是聪明的。你会让你选的液体中，水量最少的 $p$ 瓶的总水量尽量大。一个显然的想法是选择水量最多的 $p$ 瓶，但是这样不行——还剩下 $N-K$ 瓶的水量必然更少，那么这 $p$ 瓶水量就不是最少的了。

所以你会选择酒量最多的 $N-K+p$ 瓶。

我们先将酒量从小到大排序，那么你喝到的总酒量就应该是 $A_{K-p+1}+A_{K-p+2}+\dots+A_K$。从大到小枚举 $p$。

直接加会超时，时间复杂度是 $\mathcal O(K^2)$ 的。但是，注意到 $p$ 每减少 $1$，和都增加 $A_{K-p}$（这里的 $p$ 是减少 $1$ 之前的原来的 $p$），那么复用上一次的计算结果即可。时间复杂度 $\mathcal O(N\log N)$。

:::info[代码&提交记录]

[submission](https://atcoder.jp/contests/abc441/submissions/72522352)。

```cpp
#include <cstdio>
#include <string>
#include <iostream>
#include <algorithm>

using namespace std;

long long qwq[300005];

int main()
{
	long long n, k, x;
	scanf("%lld%lld%lld", &n, &k, &x);
	for (int i = 1; i <= n; i++)
	{
		scanf("%lld", qwq + i);
	}
	sort(qwq + 1, qwq + n + 1);
	long long sum = 0;
	for (int i = k; i >= 1; i--)
	{
		sum += qwq[i];
		if (sum >= x)
		{
			printf("%lld\n", n - i + 1);
			return 0;
		}
	}
	printf("-1\n");
	return 0;
}
/*
哎哎好坏啊这个

设选择的集合为 S

则交集大小至少为 |S| - (n - k)

嗯


*/
```

:::