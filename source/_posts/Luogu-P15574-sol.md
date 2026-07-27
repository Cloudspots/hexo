---
title: 题解：P15574 [USACO26FEB] Milk Buckets S
date: 2026-3-14 21:56:15
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
线段树板子题没切掉/ll

首先样例有着非常大的提示性。

:::info[性质 $1$：所有桶的翻转时刻为等差数列]

证明是显然的，使用归纳法即可。

:::

:::error[性质 $2$：所有桶的翻转时刻的公差相同]{open}

这个是错的。反例：容量分别为 $1,100$。

:::

:::error[性质 $3$：所有桶的翻转时刻的首项为等差数列]{open}

这个也是错的。反例：$1,1,114514$。

:::

需要理性分析。

首先我们考虑公差。显然第 $i-1$ 桶把第 $i$ 桶倒满需要 $\left\lceil\dfrac{a_{i}}{a_{i-1}}\right\rceil$ 次，那么乘上上一个桶的公差就得到这一个桶的公差。

第一个桶呢？你可能想当然地以为就是第一个桶的容量 $a_1$，实则不然。由于每次翻转需要时间，会浪费掉一次滴水，所以实际上是 $a_1+1$。

那为什么其它桶不会有这样的问题呢？因为实际上每个桶的公差都 $\ge 2$，所以下一个桶翻转的时候上一个桶必然不在倒水，所以不会浪费掉水和时间。

然后考虑首项。这个也是简单的，在上一个桶开始倒水之后，上一个桶还是需要 $\left\lceil\dfrac{a_{i}}{a_{i-1}}\right\rceil$ 次倒满。那么，由于首项指的是第一桶往下倒的时间，所以在开始之后所需的时间实际上是 $\left(\left\lceil\dfrac{a_{i}}{a_{i-1}}\right\rceil-1\right)d_{i-1}+1$，其中 $d_i$ 为第 $i$ 个桶的公差。

同时特殊考虑第一个桶的首项，这个是 $a_1+1$。

考虑如何维护答案。显然，答案就是最后一个桶倒水的次数乘上每次的水量。有了首项和公差，倒水的次数就很容易求了。

有一个细节问题，如果首项或公差过大则需要直接设为 $10^{18}+1$，这个东西等价于无穷大。判断 $ab > M$ 不需要用 `__int128`，可以直接使用 `a > M/b`。虽然可能不对但是误差不会太大，所以是正确的。

:::info[暴力代码]

```cpp
/*
水龙头	×
牛奶龙头	√

我超，这个样例提示也太明显了吧

都是等差数列，并且公差相同，首项递增 1

好吧，是错的

考虑两个桶，第一个容量为 1，第二个容量为 3，那么第二个翻转的时间间隔更长

但是，总而言之，必然是等差数列

公差为 ceil(自身容量 / 上层容量) * 上层时间间隔

特别地，第一个的公差为容量加一。

首项？是上层首项 + (ceil(自身容量 / 上层容量) - 1) * 上层时间间隔 + 1

那就相当于，你求最后一个桶翻转的次数

这个是好做的吧

你只需要知道最后一个桶的首项和公差。

公差是非常好做的，你线段树一遍就做完了。一些细节，如果太大则直接设为 1e18+1

首项也是极为好做的，和公差一起做！
*/
#include <cstdio>

using namespace std;

int a[200005];

int main()
{
	int n;
	scanf("%d", &n);
	for (int i = 1; i <= n; i++)
	{
		scanf("%d", a + i);
	}
	int q;
	scanf("%d", &q);
	while (q--)
	{
		int i, v;
		long long t;
		scanf("%d%d%lld", &i, &v, &t);
		a[i] = v;
		long long mul = a[1] + 1, ff = a[1] + 1;
		for (int i = 2; i <= n; i++)
		{
			long long gg = (a[i] + a[i - 1] - 1) / a[i - 1];
			if ((gg - 1) > (999999999999999999 - ff) / mul)
			{
				ff = 1000000000000000001;
				break;
			}
			ff += (gg - 1) * mul + 1;
			if (gg > 1000000000000000000 / mul)
			{
				mul = 1000000000000000001;
				// break;
			}
			else mul *= gg;
		}
		if (t < ff)
		{
			printf("0\n");
		}
		else printf("%lld\n", ((t - ff) / mul + 1) * a[n]);
	}
	return 0;
}
```

:::

我们观察这个式子。

$$ \begin{aligned}d_i&=d_{i-1}\left\lceil\dfrac{a_i}{a_{i-1}}\right\rceil\\f_i&=f_{i-1}+\left\lceil\dfrac{a_i}{a_{i-1}}\right\rceil d_{i-1}-d_{i-1}+1\end{aligned} $$

额等一下，$f$ 的转移式子里面 $\left\lceil\dfrac{a_i}{a_{i-1}}\right\rceil d_{i-1}$ 是什么？这不就是 $d_i$ 吗！

$$f_i=f_{i-1}+d_i-d_{i-1}+1$$

当然，这个通项是非常好求的。

$$f_i=\left(\sum_{j=2}^i d_j-d_{j-1}+1\right)+a_1+1$$

诶我们发现这个东西抵消掉了！

$$f_i=d_i-d_1+a_1+i$$

诶这个 $d_1-a_1$ 是什么？$d_1=a_1+1$ 啊！也就是说，$f_i=d_i+i-1$。

也就是说你求出了 $d$ 就能直接求出 $f$ 了！那我们只需要考虑 $d$ 怎么求。

我们知道，$d_i=(a_1+1)\displaystyle\prod_{j=2}^i\left\lceil\dfrac{a_i}{a_{i-1}}\right\rceil$。我们单点修改 $a_i$ 的时候，其实也就只会修改后面 $\prod$ 的 $j=i$ 和 $j=i+1$ 项。线段树即可。

赛时为什么没有做出来应当好好反省。这题真就是 $800$ 吧。

:::success[提交记录&代码]
[rec](https://www.luogu.com.cn/record/267275134)。

```cpp
/*
水龙头  	×
牛奶龙头	√
*/
#include <cstdio>

using namespace std;

int a[200005];
long long mul[800005];
void init(int l, int r, int id)
{
	if (l == r)
	{
		if (l == 1) mul[id] = a[l] + 1;
		else mul[id] = (a[l] + a[l - 1] - 1) / a[l - 1];
		return;
	}
	init(l, (l + r) / 2, id * 2);
	init((l + r) / 2 + 1, r, id * 2 + 1);
	if (mul[id * 2] > 1000000000000000000 / mul[id * 2 + 1]) mul[id] = 1000000000000000001;
	else mul[id] = mul[id * 2] * mul[id * 2 + 1];
}
void modify(int l, int r, int pos, int id)
{
	if (l == r)
	{
		if (l == 1) mul[id] = a[l] + 1;
		else mul[id] = (a[l] + a[l - 1] - 1) / a[l - 1];
		return;
	}
	if (pos <= (l + r) / 2) modify(l, (l + r) / 2, pos, id * 2);
	else modify((l + r) / 2 + 1, r, pos, id * 2 + 1);
	if (mul[id * 2] > 1000000000000000000 / mul[id * 2 + 1]) mul[id] = 1000000000000000001;
	else mul[id] = mul[id * 2] * mul[id * 2 + 1];
}
long long qmul() { return mul[1]; }

int main()
{
	int n;
	scanf("%d", &n);
	for(int i=1;i<=n;i++)
	{
		scanf("%d", a + i);
	}
	init(1, n, 1);
	int q;
	scanf("%d", &q);
	while(q--)
	{
		int i, v;
		long long t;
		scanf("%d%d%lld", &i, &v, &t);
		a[i] = v;
		modify(1, n, i, 1);
		if (i + 1 <= n) modify(1, n, i + 1, 1);
		long long ff = qmul() + n - 1;
		if(t < ff) printf("0\n");
		else printf("%lld\n", ((t - ff) / qmul() + 1) * a[n]);
	}
	return 0;
}
// You are watching:
//             ABTV
```
:::