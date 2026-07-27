---
title: 题解：CF938E Max History
date: 2025-12-18 21:25:05
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
哎首先关注这个 $f$ 是什么东西，显然就是我们考虑对一个数列求最大值的过程，过程中所有不同的“当前最大值”的和，但是不包括最终求得的最大值。也就是说，一个数字可能被统计一次也可能没被统计。

然后因为我们是对所有排列求和所以显然不能对所有排列求和。

我们考虑每个数字一共被统计了多少次。如果它是整个数列的最大值则显然不可能被统计（根据 $f$ 的性质）。那么我们就考虑它在哪个位置。

假设整个数列中有 $k$ 个数字比数字 $g$ 小，那么如果它在 $i$ 的位置（$i$ 从 $0$ 开始）（$0\le i\le k$）那么由于它被统计了所以在它左边的 $i$ 个元素都比它小，而右边必然存在比它大的元素。因为它不是最大值所有后面那个条件可以忽略。

那么显然此时数字只有两类：$<g$ 的和 $\ge g$ 的。前者有 $k$ 个而后者有 $n-k-1$ 个。而它左边只有第一类的，右边有 $k-i$ 个第一类的和 $n-k-1$ 个第二类的。所以总方案数是 $k!(n-k-1)!\dbinom{n-i-1}{k-i}$。

而这个东西对于所有 $0\le i\le k$ 求和，首先把常数提到外面，然后用平行求和得到右边的组合数求和是 $\dbinom{n}{k}$。所以总共就是 $k!(n-k-1)!\dbinom{n}{k}$。

至于这个 $k$ 怎么处理，你排序一遍（因为排序不改变所有排列）然后双指针就好了。

至于为什么我赛时没做出来：

```cpp
		if(l+1 <= n && a[l+1] < a[i]) l++;
```

哎哎到底还是菜。给个代码和提交记录。

:::info[代码&提交记录]

[submission](https://codeforces.com/contest/938/submission/353810136)。

```cpp
#include <cstdio>
#include <algorithm>

using namespace std;

int a[1000005];
long long fact[1000005], ifact[1000005];

long long qpow(long long x, long long y)
{
	long long p = x, ans = 1;
	do
	{
		if(y & 1) ans = ans * p % 1000000007;
		p = p * p % 1000000007;
	} while(y >>= 1);
	return ans;
}

int main()
{
	int n;
	scanf("%d", &n);
	fact[0] = 1;
	for(int i=1;i<=n;i++)
	{
		fact[i] = fact[i-1] * i % 1000000007;
	}
	ifact[n] = qpow(fact[n], 1000000005);
	for(int i=n-1;i>=0;i--)
	{
		ifact[i] = ifact[i+1] * (i+1) % 1000000007;
	}
	long long ygg = 0;
	int l = 0;
	for(int i=1;i<=n;i++)
	{
		scanf("%d", a + i);
	}
	sort(a + 1, a + n + 1);
	long long sum = 0;
	for(int i=1;i<=n;i++)
	{
		if(a[i] == a[n]) break;
		while(l+1 <= n && a[l+1] < a[i]) l++;
		ygg += fact[l] * fact[n-l-1] % 1000000007 * fact[n] % 1000000007 * ifact[n-l] % 1000000007 * ifact[l] % 1000000007 * a[i] % 1000000007;
		// printf("i = %d, l = %d, a[i] = %d, delta = %d\n", i, l, a[i], fact[l] * fact[n-l-1] % 1000000007 * fact[n] % 1000000007 * ifact[n-l] % 1000000007 * ifact[l] % 1000000007 * a[i] % 1000000007);
		ygg %= 1000000007;
	}
	printf("%lld\n", ygg);
	return 0;
}
```
:::