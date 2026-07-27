---
title: 题解：UVA10934 装满水的气球 Dropping water balloons
date: 2025-7-3 17:14:13
categories:
  - Solution
tags:
  - Solution
  - UVA Problem Solution
---
> 楼真高啊/jy

题意简述（建议阅读原题面，挺好玩的）：

> 有一个 $n$ 层楼高的楼，你有 $k$ 个一模一样的装满水的气球。使用最少的试验次数决定至少需要在哪一层扔下去才能够让气球爆掉（或者最高层也爆不掉）。每次试验在某一层扔下一个气球，爆掉了就不能用了，没爆掉就能继续用并且无磨损。爆掉的层数满足单调性。如果最少次数 $>63$ 则输出 `More than 63 trials needed.`。
>
> 数据范围：题目中说“...positive $n$ that fits into a $64$ bit integer”，并没有说有无符号，所以按照无符号计算，为 $2^{64}-1$。而 $1\le k\le 100$。多组数据。

为了方便，我们令常数 $63$ 为 $M$。

$n$ 非常大。所以考虑作为 dp 的状态的答案（很明显，这题不是什么数位 dp）。

答案和什么有关？最多的试验次数 $i$（每次试验会让次数减少 $1$），还剩下多少个能用的气球 $j$。根据这些，就能够知道最多能够决定多少个楼层，也就是最大的 $n$ 使得在给定条件下能够得出结论，记为 $f_{i,j}$。

都放在状态中则有 $kM$ 个状态，很棒。状态转移？

显然是不能枚举要在哪个楼层摔的（二分？额，我们有更好的做法呢）。如果摔破了那么就变为了 $f_{i-1,j-1}$，没破就是 $f_{i-1,j}$。直觉告诉我们应该在 $f_{i-1,j}+1$ 楼摔，能够确定的楼层数量是把它们相加的结果，得到 $f_{i,j}=f_{i-1,j-1}+f_{i-1,j}+1$。实际上如果高于这个楼层那么如果摔破了则无法得出结果，而这个楼层是最高的可行的。

边界条件是 $f_{1,1}=1$ 和 $f_{i,0}=f_{0,j}=0$。使用 Python 在本地打一遍就能够发现 $f_{63,100}=9223372036854775807$。是不是个熟悉的数字？对，它就是 $2^{63}-1$。

所以我们就得到了优秀的 $\mathcal O(KM+QM)=\mathcal O((K+Q)M)$（$K$ 为 $k$ 最大值，也就是 $100$）做法，每次查询枚举摔的次数即可。更优秀的可以做到 $\mathcal O(KM+Q\log M)$，二分。

```cpp
#include <cstdio>

using namespace std;

unsigned long long f[105][65];

int main()
{
	for (int i = 1; i <= 100; i++)
	{
		for (int j = 1; j <= 63; j++)
		{
			f[i][j] = f[i - 1][j - 1] + f[i][j - 1] + 1;
		}
	}
	unsigned long long n;
	int k;
	while (scanf("%d%lld", &k, &n) == 2)
	{
		if (k == 0) break;
		if (f[k][63] < n)
		{
			printf("More than 63 trials needed.\n");
			continue;
		}
		int l = 1, r = 63;
		while (l < r)
		{
			int mid = (l + r) >> 1;
			if (f[k][mid] >= n) r = mid;
			else l = mid + 1;
		}
		printf("%d\n", l);
	}
	return 0;
}
```