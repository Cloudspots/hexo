---
title: 题解：CF2114G Build an Array
date: 2026-3-23 16:10:24
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
很神奇的题目。虽然但是：

![](peKZH2Q.png)

首先，注意到如果 $a>b$，能以 $a$ 次操作完成，则一定能以 $b$ 次操作完成（当然，$b\ge n$）。那么，我们只需要求最多的操作次数就好了。

一个显然的想法是，对于每个数字，把它拆成 $b2^k$，并且 $b$ 为奇数。那么，使用 $2^k$ 个 $b$ 合出 $b2^k$。那么所有 $2^k$ 之和就是最多的次数了！

样例一第二个点把你 hack 了。究其原因是因为可能不能合出来。单个 $2^k$ 个 $b$ 肯定是能够合出 $b2^k$ 的，但是如果多个 $b$ 相同的数字连在一起，后面的就可能“抢占”前面的 $b$。从而合出不同的数字。

那么，另外一个想法就是，从左到右依次考虑每个数字。对于每个数字，考虑在不出现问题的情况下，最多能用几个数字合出它。对算出的各个答案求和即可。

具体来讲，由于你已经合出了 $a_{i-1}$，那么：

- $i=1$：直接加上。
- $b_i$ 和 $b_{i-1}$ 不同：显然两者不会矛盾，不需要考虑。直接加上 $k_i$ 即可。
- $b_i$ 和 $b_{i-1}$ 相同，但是 $a_i<a_{i-1}$：由于之前合出的 $a_{i-1}$ 更大，所以 $b_i$ 永远不会和前面的 $b_{i-1}$ 合并。也是 $k_i$。
- $b_i=b_{i-1},a_i>a_{i-1}$：此时直接加上一定会爆炸。你需要先用一个 $2a_{i-1}$，再用剩下的 $k_i-2k_{i-1}$ 个来合成 $a_i$。所以贡献是 $k_i-2k_{i-1}+1$。

这依然不是正解。这是因为，我们只考虑了从左往右合并，实际上可能从右往左合并。

当然，从右往左合并也不对。实际上是，有一个中心，然后从这个中心向两边扩散。我们枚举这个中心 $i$，加上其左边的贡献、其右边的贡献和其自身的贡献 $k_i$，求 $\max$。

过了。

:::info[sub&code]

[sub](https://codeforces.com/contest/2114/submission/367868146)。

```cpp
#include <cstdio>
#include <algorithm>

using namespace std;

int a[100005];
int v[100005];
long long ls[100005], rs[100005], lc[100005], rc[100005];

int main()
{
	int q;
	scanf("%d", &q);
	for(int t=1;t<=q;t++)
	{
		int n, k;
		scanf("%d%d", &n, &k);
		for(int i=0;i<=n+1;i++)
		{
			a[i] = v[i] = ls[i] = rs[i] = lc[i] = rc[i] = 0;
		}
		for(int i=1;i<=n;i++)
		{
			scanf("%d", a + i);
			int b = a[i];
			v[i] = 1;
			while(b % 2 == 0)
			{
				b /= 2;
				v[i] *= 2;
			}
		}
		for(int i=1;i<=n;i++)
		{
			ls[i] = ls[i-1];
			if(i == n || a[i] / v[i] != a[i+1] / v[i+1] || a[i] < a[i+1]) ls[i] += v[i];
			else ls[i] += v[i] - (v[i+1] * 2) + 1;
		}
		for(int i=n;i>=1;i--)
		{
			rs[i] = rs[i+1];
			if(i == 1 || a[i] / v[i] != a[i-1] / v[i-1] || a[i] < a[i-1]) rs[i] += v[i];
			else rs[i] += v[i] - (v[i-1] * 2) + 1;
		}
		long long maxn = 0;
		for(int i=1;i<=n;i++)
		{
			long long mao = ls[i-1] + rs[i+1] + v[i];
			if(mao > maxn) maxn = mao;
		}
		printf(maxn >= k ? "YES\n" : "NO\n");
	}
	return 0;
}
```

:::