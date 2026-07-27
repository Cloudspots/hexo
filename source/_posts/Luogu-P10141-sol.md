---
title: 题解：P10141 [USACO24JAN] Merging Cells P
date: 2026-5-2 21:37:24
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
提供一个树状数组解法。

首先暴力是 $f_{i,j,k}$ 代表 $[i,j]$ 最终编号为 $k$ 的概率。这个状态数量就爆炸了，不好优化。

这个区间很难去掉，而 $k$ 我们发现按有点冗余。我们考虑正难则反。$f_{i,j}$ 表示 $[i,j]$ 中的某个元素成为 $[1,n]$ 的最终结果的概率，也就是先把 $[i,j]$ 合并起来（这一步不算概率，是 $1$），然后合并成的元素成为 $[1,n]$ 的最终结果的概率。显然 $f_{1,n}=1$。

考虑转移。首先打出 $s$ 的前缀和 $S$。暴力是枚举 $k\in[l,r)$，检查是否有 $s_k-s_{l-1}>s_r-s_k$，如果是则转移到 $f_{l,k}$（即，$f_{l,k}\gets f_{l,k}+P_{l,r}f_{l,r}$，其中 $P_{l,r}$ 是“合并 $[l,r]$ 的过程中出现某个细胞刚好是 $[l,k]$ 的概率”。而如果不是则转移到 $f_{k+1,r}$。

首先这个 $P$ 怎么求？一种组合意义的方案别人都讲了。这里有个暴力推式子的方法。首先合并前 $k$ 个，方案数是 $(k-1)!$。然后把剩下 $\text{len}-k$ 个也合并了，是 $(\text{len}-k-1)!$。这两种合并可以穿插进行，所以还有 $\dbinom{\text{len}-2}{k-1}$ 的系数。最后合并两个大区间，只有一种方案，并且一定在最后，没有贡献。最后总方案数是 $(n-1)!$。所以是 $\dfrac{(k-1)!(\text{len}-k-1)!\dbinom{\text{len}-2}{k-1}}{(n-1)!}$，展开组合数得到 $\dfrac{1}{\text{len}-1}$。

然后这个和 $k$ 无关！！！也就是可以在转移的时候先将 $f_{l,r}\gets f_{l,r}\times P$，后面直接加 $f_{l,r}$ 即可。

> upd：另一种理解方法。一共是 $n-1$ 步，第 $i$ 步有 $n-i$ 种选法，其中当 $i<n-1$ 时有一种不能选，$i=n-1$ 时可以选，所以是 $\displaystyle\prod_{i=1}^{n-2}\dfrac{n-i-1}{n-i}$，约分得到 $\dfrac{1}{n-1}$。

然后考虑怎么维护。发现这个有单调性，即前一部分是 $f_{k+1,r}$，后一部分是 $f_{l,k}$。也就是两个区间加……只不过维度不同。

这个也是简单的。你开两个树状数组数组（即，多个树状数组放在一起的数组），分别求两个维度的值（实际上维护的是差分，因为是树状数组）。求值的时候将两个维度的值相加即可。

$O(n^2\log n)$。区间 DP 本身小常数，树状数组也是小常数。可过。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/276364871)。

```cpp
/*
Q. SClan_Official 通过 T2，给了你什么启示？
A. 提交的时候挂着拍子，并且要在浏览器之上，可以增加 rp。
*/
#include <cstdio>
#include <algorithm>

using namespace std;

unsigned long long qpow(unsigned long long x, unsigned long long y)
{
	long long ans = 1;
	do
	{
		if(y & 1) ans = ans * x % 1000000007;
		x = x * x % 1000000007;
	} while(y >>= 1);
	return ans;
}

unsigned long long dp[5005][5005];
unsigned long long prob[5005];
unsigned long long a[5005], s[5005];

class bit
{
	long long val[5005];
public:
	void vadd(int id, long long v, int n)
	{
		if(id > n) return;
		do
		{
			val[id] += v;
		} while((id += id & -id) <= n);
	}
	long long qsum(int id)
	{
		long long ss = 0;
		do
		{
			ss += val[id];
		} while(id -= id & -id);
		return ss;
	}
} sgs[5005];

int main()
{
	// sgs[0].vadd(1, 1, 10);
	// sgs[0].vadd(5, -1, 10);
	// printf("%d\n", sgs[0].qsum(0));
	int n;
	scanf("%d", &n);
	// n = 5000;
	for(int i=1;i<=n;i++)
	{
		scanf("%llu", a + i);
		// a[i] = i;
		s[i] = s[i-1] + a[i];
	}
	auto getprob = [](int x) -> unsigned long long
	{
		return qpow(x-1, 1000000005);
	};
	for(int i=1;i<=n;i++)
	{
		prob[i] = getprob(i);
	}
	prob[1] = 1;
	sgs[1].vadd(n, 1, n);
	// dp[1][n] = 1;
	for(int l=1;l<=n;l++)
	{
		for(int r=n;r>=l;r--)
		{
			if(l == r) dp[l][r] = sgs[l].qsum(r);
			// printf("dp[%d][%d] = %lld - %lld + %lld - %lld = %lld\n", l, r, sgs[l].qsum(r), sgs[l].qsum(r-1), sgs[r].qsum(l), sgs[r].qsum(l-1), (sgs[l].qsum(r) - sgs[l].qsum(r-1) + sgs[r].qsum(l) - sgs[r].qsum(l-1)) % 1000000007);
			else dp[l][r] = (sgs[l].qsum(r) + sgs[r].qsum(l)) % 1000000007 * prob[r-l+1] % 1000000007;
			// for(int k=l;k<r;k++)
			// {
			// 	if(s[k] - s[l-1] <= s[r] - s[k]) dp[k+1][r] = dp[k+1][r] + dp[l][r];
			// 	else dp[l][k] = dp[l][k] + dp[l][r];
			// }
			if(l == r) continue;
			int pos = upper_bound(s + l, s + r + 1, (s[r] + s[l-1]) / 2) - s;
			//     s[k] - s[l-1] <= s[r] - s[k]
			// <=> s[k] <= (s[r] + s[l-1]) / 2
			// <=> k < pos
			// printf("l = %d, r = %d, pos = %d\n", l, r, pos);
			// printf("sgs[%d][%d] += %lld, sgs[%d][%d] -= %lld\n", l, pos, dp[l][r], l, r+1, dp[l][r]);
			sgs[l].vadd(pos, dp[l][r], n);
			sgs[l].vadd(r + 1, -dp[l][r], n);
			// printf("dp[%d][%d...%d] += %lld\n", l, pos, r, dp[l][r]);
			// printf("sgs[%d][%d] += %lld, sgs[%d][%d] -= %lld\n", r, l+1, dp[l][r], r, pos+1, dp[l][r]);
			sgs[r].vadd(l + 1, dp[l][r], n);
			sgs[r].vadd(pos + 1, -dp[l][r], n);
			// printf("dp[%d...%d][%d] += %lld\n", l + 1, pos, r, dp[l][r]);
		}
	}
	for(int i=1;i<=n;i++)
	{
		printf("%llu\n", dp[i][i] % 1000000007);
	}
	return 0;
}
/*
s[r] - s[?] >= s[?] - s[l-1]
s[r] + s[l-1] >= 2s[?]

s[?] <= (s[r] + s[l-1]) / 2
*/
```
:::