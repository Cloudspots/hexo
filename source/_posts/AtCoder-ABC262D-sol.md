---
title: 题解：AT_abc262_d [ABC262D] I Hate Non-integer Number
date: 2025-5-16 17:04:47
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
I Hate Non-integer Number.

---

如果你把子序列看成了子串那么恭喜你和我一样。如果真的是子串那么这题前缀和秒了。

> 本文通篇省略取模，因为不重要且太简单。所有运算均在模意义下进行。

首先显然答案的紧的上界是 $2^N$，最优秀（指没有任何冗余枚举）的暴力也不能通过。考虑 DP。

根据直觉可得设 $f_{i,j,k,l}$ 表示考虑前 $i$ 个元素，选取 $j$ 个，模 $k$ 余 $l$ 的方案数（空间问题？不存在的，内存限制 $1.00\mathrm{GB}$，实在担心也可以滚动数组省略 $i$）。显然需要满足条件 $0 \le j \le i\le N,0 \le l < k \le N$（原则上 $i=j=0$ 不可以，但是为了方便转移这里表示不考虑任何元素，而 $k>N$ 实际上有意义但是用不上）。

则此题答案为 $\displaystyle \sum_{j=1}^N f_{N,j,j,0}$，也就是长度为 $j$ 的和模 $j$ 余 $0$ 的方案数之和。长度不能为 $0$。

考虑如何进行状态转移。第 $i$ 个元素可以选或者不选，若选则会让和 $+a_i$ 且长度 $+1$，不选则不变。

故 $f_{i,j,k,l}=f_{i-1,j-1,k,l-a_i}+f_{i-1,j,k,l}$。如果 $j=0$ 则没有加号左边的那一坨。

边界条件是 $f_{0,0,k,0}=1$。

那么我们就可以愉快地解决这题啦！如果你用滚动数组（下面的代码就是用的）那么注意 $j,l$ 需要降序枚举。

代码：

```cpp
#include <cstdio>

using namespace std;

int f[105][105][105];

int main()
{
	int n;
	scanf("%d", &n);
	for (int k = 1; k <= n; k++)
	{
		for (int l = 0; l < k; l++)
		{
			f[0][k][0] = 1;
		}
	}
	for (int i = 1; i <= n; i++)
	{
		int a;
		scanf("%d", &a);
		for (int j = i; j >= 1; j--)
		{
			for (int k = 1; k <= n; k++)
			{
				for (int l = k - 1; l >= 0; l--)
				{
					f[j][k][l] = (f[j][k][l] + f[j-1][k][((l - a) % k + k) % k]) % 998244353;
					// printf("f[%d][%d][%d][%d] = %d （考虑前 %d 个，选取 %d 个，模 %d 余 %d）\n", i, j, k, l, f[j][k][l], i, j, k, l);
				}
			}
		}
	}
	int sum = 0;
	for (int i = 1; i <= n; i++)
	{
		sum = (sum + f[i][i][0]) % 998244353;
	}
	printf("%d\n", sum);
	return 0;
}
```

[submission](https://atcoder.jp/contests/abc262/submissions/65825183)。