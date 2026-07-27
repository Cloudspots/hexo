---
title: 题解：CF1866M Mighty Rock Tower
date: 2026-4-17 18:24:36
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
注意到往下掉不好处理。一种容易想到的方法是区间 dp，$f_{l,r}$ 代表从 $l$ 堆到 $r$ 的期望。但是这样描述不够精确，状态数量也直接爆炸，

我们考虑按照当前石子数量进行 dp。在某一个数量时，有两种可能的状态：目前叠到了这个个数和目前正在坍塌。坍塌有一个参数 $p$ 代表这一层坍塌的概率。而第一种情况可以看作坍塌概率为 $0$。特别地，当前石子个数为 $0$ 时无论 $p$ 是多少都不可能继续坍塌，所以值永远是 $0$。

那么我们设 $f_{i,j}$ 为当前在第 $i$ 层，坍塌概率为 $j$，要在此次坍塌结束后（可能就在这一层就结束，此时为 $0$）重新回到第 $i$ 层所需的期望石子数。在代码实现时，数组的下标 $j$ 实际上对应式子中是 $\dfrac{j}{100}$，而式子中的 $P_i$ 实际上也是输入中的 $\dfrac{P_i}{100}$。

那么对于状态转移方程：

- $i=0$：对于任意 $j$，$f_{i,j}=0$。
- $i\ge 1$：$f_{i,j}=(1-j)\times 0+j\times \left(f_{i-1,j}+1+(f_{i-1,P_i}+1)\left(\dfrac{1}{1-P_i}-1\right)\right)$。这个式子的意义是，有 $1-j$ 的概率直接停下，而有 $j$ 的概率坍塌到下一层需要重新堆回来。首先第一次堆到 $i$（对应 $f_{i-1,j}+1$）后可能坍塌，但是此时坍塌概率设为 $P_i$。期望下需要 $\dfrac{1}{1-P_i}$ 次达到 $i$ 才可以成功放上，但是 $f_{i-1,j}+1$ 已经有一次了，所以右边是 $\dfrac{1}{1-P_i}-1$。而第一次之后每次期望步数就是 $f_{i-1,P_i}+1$，因为坍塌概率为 $P_i$。

显然答案就是 $f_{n,1}$，因为可以看作从最后一层直接掉下来然后重堆。

时间复杂度为 $O(nV)$。如果不预处理 $\dfrac{i}{100}$ 和 $\dfrac{100}{i}$ 复杂度会多一个 $\log$，不知道能不能过，我没试。

:::info[sub&code]

[sub](https://codeforces.com/contest/1866/submission/371480350)。

```cpp
#include <cstdio>

using namespace std;

long long f[200005][105];
long long a[200005];

long long qpow(long long x, long long y)
{
	long long ans = 1;
	do
	{
		if(y & 1) ans = ans * x % 998244353;
		x = x * x % 998244353;
	} while(y >>= 1);
	return ans;
}

long long ppinv[105];

int main()
{
	int n;
	scanf("%d", &n);
	for(int i=1;i<=n;i++)
	{
		scanf("%lld", a + i);
	}
	long long i100 = 828542813;
	for(int i=0;i<=100;i++)
	{
		ppinv[i] = qpow(i * i100 % 998244353, 998244351);
	}
	for(int i=0;i<=n;i++)
	{
		for(int j=0;j<=100;j++)
		{
			// f[i][j] = 
			if(i == 0) f[i][j] = 0;
			else
			{
				f[i][j] = (j * i100) % 998244353 * (f[i-1][j] + 1 + (ppinv[100 - a[i]] + 998244352) % 998244353 * (f[i-1][a[i]] + 1) % 998244353) % 998244353;
				// printf("f[%d][%d] = (%d / 100) * (f[%d][%d] + 1 + ((100 / %lld) - 1) * (f[%d][%lld] + 1)) = %lld\n", i, j, j, i-1, j, a[i], i-1, a[i], f[i][j]);
			}
		}
	}
	printf("%lld\n", f[n][100]);
	return 0;
}
```

:::