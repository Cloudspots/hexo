---
title: 题解：CF1580B Mathematics Curriculum
date: 2026-7-14 20:55:09
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
> 没优化取模就直接跑了 $1203\mathrm{ms}$，太炫酷了！

---

首先最大值的取值个数就是从这个位置开始向前的后缀 $\max$ 的个数和从这个位置开始向后的前缀 $\max$ 个数减 $1$。

容易想到 dp。如果从前往后填数字是不行的，插数字也是不行的。从值域角度考虑（因为排列本来就很适合同时从下标和值域考虑）。

我们考虑整个数列的 $\max$，即 $n$。我们发现一个数字往前/后的前/后缀最大值中必然有一个包含 $n$。同时，在 $n$ 之后就不会有其它最大值了。也就是说，其实这个 $n$ 把序列分成了互不相关的两段。

互不相关？那我们就 dp。设 $f_{i,j,k}$ 分别为题面中 $(n,m,k)$ 为 $(i,j,k)$ 的答案，我们枚举最大值 $i$ 所在位置，计算两边再乘一个混合两边值域的组合数即可。

边界条件是简单的。

对于卡常：对答案贡献几乎是 $0$（指几乎每一项都是 $0$）的循环特判。耗时的循环减少分支。减少无意义状态。

还可以优化取模，但那个是技术活，我做不来。

:::info[sub&code]

[sub](https://codeforces.com/contest/1581/submission/382551275)。

```cpp
#pragma GCC optimize("Ofast")
#include <cstdio>

using namespace std;

unsigned long long f[105][105][105];
unsigned long long comb[105][105], fact[105];

int main()
{
	unsigned _n, _m, _k, mod;
	scanf("%u%u%u%u", &_n, &_m, &_k, &mod);
	comb[0][0] = 1 % mod;
	fact[0] = 1 % mod;
	for(unsigned i=1;i<=_n;i++)
	{
		for(unsigned j=0;j<=i;j++)
		{
			comb[i][j] = ((j ? comb[i-1][j-1] : 0) + comb[i-1][j]) % mod;
		}
		fact[i] = fact[i-1] * i % mod;
	}
	for(unsigned i=0;i<=_n;i++) f[0][i][0] = 1 % mod;
	for(unsigned n=1;n<=_n;n++)
	{
		for(unsigned m=1;m<=n;m++)
		{
			for(unsigned k=0;k+m-1<=n;k++)
			{
				if(n == 1)
				{
					f[n][m][k] = (k == 1 ? 1 : 0) % mod;
					// printf("f[%u][%u][%u] = %llu\n", n, m, k, f[n][m][k]);
					continue;
				}
				if(m > 1)
				{
					for(unsigned p=1;p<=n;p++)
					{
						if(m>p)
						{
							f[n][m][k] = (f[n][m][k] + fact[p-1] * (m-1<=n-p?f[n-p][m-1][k]:(k==0?fact[n-p]:0)) % mod * comb[n - 1][p - 1]) % mod;
						}
						else if(m-1>n-p)
						{
							f[n][m][k] = (f[n][m][k] + f[p-1][m-1][k] * fact[n-p] % mod * comb[n - 1][p - 1]) % mod;
						}
						else
						{
							unsigned long long ss = 0;
							for(unsigned lc=0;lc<=p&&lc<=k;lc++)
							{
								ss = ss + f[p-1][m-1][lc] * f[n-p][m-1][k-lc] % mod;
							}
							f[n][m][k] = (f[n][m][k] + ss * comb[n-1][p-1]) % mod;
						}
					}
				}
				else f[n][m][k] = (k == 1 ? fact[n] : 0);
				// printf("f[%u][%u][%u] = %llu\n", n, m, k, f[n][m][k]);
			}
		}
	}
	printf("%llu\n", f[_n][_m][_k]);
	return 0;
}
```

:::