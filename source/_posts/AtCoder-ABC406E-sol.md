---
title: 题解：AT_abc406_e [ABC406E] Popcount Sum 3
date: 2025-5-18 10:34:34
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
简单题。

# 引入

考虑这样一道小学奥数题目：

> 有多少个 $(1,2,3,4,5,6)$ 的排列的字典序比 $(2,4,3,1,6,5)$ 小？

解法是：

> 首先考虑第一位是 $1$，这样显然是更小的。一共有 $A_5^5=120$ 个。
> 
> 然后考虑前两位是 $(2,k)$ 的情况，其中 $1 \le k \le 3$。一共有 $2 \times A_4^4=48$ 种（因为 $k \neq 2$）。
>
> 然后考虑前三位是 $(2,4,k)$ 的情况，其中 $1 \le k \le 2$。一共有 $A_3^3=6$ 种。
>
> 然后考虑前四位是 $(2,4,3,k)$ 的情况，其中 $1 \le k \le 0$，数学老师爆炸了。
>
> 然后考虑前五位是 $(2,4,3,1,k)$ 的情况，其中 $1 \le k \le 5$，一共有 $1$ 种。
>
> 最后考虑 $(2,4,3,1,6,k)$ 的情况，其中 $k=5$，不符合。
>
> 求和得到 $120+48+6+\text{爆炸的数学老师}_{(=0)}+1+0=175$ 个。

这里的原理是，我们逐个考虑每一位，然后再这一位上分为两种情况：收紧限制和放宽限制。

收紧限制就是指这里选原本排列 $(2,4,3,1,6,5)$ 中的位，无法保证后面任意排列都可以。放宽就是指选择比原本排列小的，这样可以保证，可以直接计数。

> update：发现这是[康托展开](https://www.luogu.com.cn/problem/P5367)。但是我真的是在做小学奥数题的时候第一次遇见了这种题，并且独立想出了做法。~~虽然当时算错了。~~

对应的思想也可以拓展到这题。

# 此题解法

我们同样逐位考虑。位权从大到小。

如果考虑到第 $i$ 位（位权为 $2^i$），我们默认位权更大的位都选了（即有 $1$ 选 $1$，没 $1$ 选 $0$），则如果第 $i$ 位为 $0$ 则必然不能选，对答案无影响。如果为 $1$ 则还是不选，后面可以任意选，但是需要保证 $\mathrm{popcount}=K$。

如何保证后者？

因为我们前面的位都已经选了，所以对 popcount 已经有了一定贡献。设剩下还需要 $K'$，显然剩下还有 $i$ 位。

一种显而易见的做法是，先 DP 求出所有“$i$ 位二进制数中 popcount 为 $j$ 的数字的和”$S_{i,j}$，然后答案就是 $S_{i,K'}$。

*这个结论是错的*。因为我们没有加上前面的位的和。正确做法是再预处理出对应的方案数 $C_{i,j}$，贡献为 $S_{i,j}+C_{i,j} \times \text{前面的位}$。

这样就正确了。*吗？*

我们注意到我们只考虑了“第一个不选的位为 $i$”的情况，如果所有位都选上则没有考虑。怎么做那也是非常显然的，如果 $\mathrm{popcount}(N)=K$ 则将最终答案加上 $N$。

记得取模。做完了。

什么你问 $S$ 和 $C$ 怎么求？首先注意到一个没啥用的性质 $C_{i,j}=C_i^j$。

当然我们根据 $C$ 的意义或者组合数的递推式就可以得到 $C$ 的递推式 $C_{i,j}=C_{i-1,j-1}+C_{i-1,j}$（分类讨论第 $i$ 位选不选）。$S$ 类似。

代码。

```cpp
#include <cstdio>
#include <bit>

using namespace std;

// c 表示 count，[i][j] 表示 i 位，1 为 j
unsigned long long c[64][64], p[64][64];

unsigned long long calc(unsigned long long k, unsigned long long r)
{
	unsigned long long sum = 0;
	for (int i = 59; i >= 0; i--)
	{
		if ((1ull << i) > k) continue;
		if ((k & (1ull << i)) == 0) continue;
		if (popcount(k >> (i + 1)) > r) break;
		sum += p[i][r - popcount(k >> (i + 1))] + ((k >> (i + 1) << (i + 1)) % 998244353) * c[i][r - popcount(k >> (i + 1))];
		sum %= 998244353;
	}
	return (sum + k * int(popcount(k) == r)) % 998244353;
}

int main()
{
	c[0][0] = 1;
	for (int i = 1; i < 60; i++)
	{
		c[i][0] = 1;
		p[i][0] = 0;
		for (int j = 1; j <= i; j++)
		{
			c[i][j] = (c[i - 1][j] + c[i - 1][j - 1]) % 998244353;
			p[i][j] = (p[i - 1][j] + c[i - 1][j - 1] * ((1ull << (i - 1)) % 998244353) % 998244353 + p[i - 1][j - 1]) % 998244353;
		}
	}
	int t;
	scanf("%d", &t);
	while (t--)
	{
		unsigned long long n, k;
		scanf("%llu%llu", &n, &k);
		printf("%llu\n", calc(n, k));
	}
	return 0;
}
```

[sub](https://atcoder.jp/contests/ABC406/submissions/65938615)。