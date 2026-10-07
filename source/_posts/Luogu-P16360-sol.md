---
title: 题解：P16360 [BalticOI 2026] Distances
date: 2026-09-24 19:18:54
updated: 2026-09-26 19:08:23
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P16360 [BalticOI 2026] Distances

简单题，红吧。

首先考虑 $k=\dfrac{n(n-1)}{2}-1$ 怎么做，此时只有一对点距离不是整数。

若 $n=5$，考虑到 $3^2+4^2=5^2$，我们构造 $(-3,0),(0,0),(0,4),(3,0),(114514,0)$ 即可。

拓展一下，一些点在 x 轴上，一个点在 y 轴上，和 x 轴上的其中一些点距离为整数，剩下的点随便放只要没有整数距离即可。

那么 y 轴上的那个点如何选取？

随便枚举一下发现基本上是质因子越多解越多，那么来一个 $2\times 3\times 5\times 7\times 11\times 13\times 17=510510$ 即可。实际上如果把 $19\times 23$ 也乘上会有更多解。小一点的 $2\times 3\times 5\times 7\times 11$ 也有足够多的解。

剩下的点随机选，正确率非常高。由于给伪证会被撤题解但是不写证明不会，所以我不给证明了。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/299051829)。

```cpp
/*
必杀技：观察大样例+手模小数据。

首先考虑 k=n(n-1)/2-1 怎么做，只有一组不符合。

手模 n=4,5 的时候就知道怎么干了。

【图片】Never gonna give you up XD

然后观察大样例 5，发现就是 x 轴上有一堆点，y 上有一个点 P，同时 x 轴上的点分为两类：

1. 普通点：不和 P 配对。
2. 特殊点：和 P 配对。

点的数量不多，是 O(n) 的。

设 P = (0, y)，那么需要构造若干个特殊点满足 a^2+y^2 为整数。

观察大样例，7 个特殊点，y = 510510。我见过这个数……510510=2*3*5*7*11*13*17，挺经典的（小奥经历发力了）。

它有什么用？

21392=2*2*2*2*7*191。没懂。
22600=2*2*2*5*5*113。

不懂，能不能自己构造一下。

考虑这个。考虑给任意奇数 k 找 (k^2-1)/2，偶数 k 找 k^2/4-1，剩下的直接乘起来。

非常有前途啊，考虑 510510 有 7 个质因子，也就是说有 2^7=128 种可以构造出的（非本原）勾股数。

考虑大小会不会很大？还真是，但是考虑若不选 17 则最大合法，同时不选 17 也有 64 中可能，剩下的 36 种可能中 popcnt = 1 有 6，2 有 15，3 有 20，这个最大是

……假了。

……直接搜。

搜出来了一坨解，随便取前 100 个。

最后考虑冗余点，考虑随机数即可。
*/
// 我终于看懂 21392, 22600, ... 是什么了，原来也是搜出来的。XD
#include <cmath>
#include <cstdio>
#include <random>
#include <utility>
#include <algorithm>

using namespace std;

const int pval = 30030, vals[100] = {21392, 22600, 30056, 34848, 38584, 50544, 55352, 64064, 73304, 85680, 86904, 94320, 107696, 108680, 125048, 138600, 151312, 160208, 160888, 169832, 169984, 175032, 178976, 196768, 197800, 216320, 229320, 238680, 254320, 262504, 268056, 272272, 277704, 291344, 298152, 311272, 312032, 312400, 322048, 327888, 336600, 353600, 364000, 373184, 374680, 383776, 400320, 401544, 415976, 427856, 434304, 439208, 445536, 474320, 486200, 514800, 516168, 535000, 545632, 547400, 558376, 565488, 571064, 592416, 599768, 611320, 624184, 624680, 643680, 645624, 680680, 695200, 707608, 731952, 740344, 746928, 768248, 792792, 799696, 833000, 835312, 849400, 849680, 866320, 909216, 936320, 936976, 962136, 970112, 980424, 1000728, 1011296, 1019592, 1047200, 1099800, 1128400, 1149200, 1167664, 1170680, 1215568};
pair<int, int> res[105];

int main()
{
	// freopen("distances.in", "r", stdin);
	// freopen("distances.out", "w", stdout);
	auto chkfsg = [](long long x)
	{
		long long v = sqrtl(x) + 0.5;
		if((v-1) * (v-1) == x || v * v == x || (v+1) * (v+1) == x) return true;
		else return false;
	};
	for(int i=1;i<=1000000000;i++)
	{
		if(chkfsg(1ll * pval * pval + 1ll * i * i)) printf("%d\n", i);
	}
	int n, k;
	scanf("%d%d", &n, &k);
	int v = 0;
	for(int i=0;i<=n;i++)
	{
		if(i*(i-1)/2 >= k)
		{
			v = i;
			break;
		}
	}
	if(v * (v-1) / 2 == k)
	{
		for(int i=1;i<=v;i++) res[i] = {i, 0};
	}
	else
	{
		long long spcnt = k - (v-1) * (v-2) / 2; // 需要这么多个特殊点。
		res[1] = {0, pval};
		int cp = 0;
		for(int i=2;i<=v-spcnt;i++)
		{
			cp++;
			if(chkfsg(1ll * i * i + 1ll * pval * pval))
			{
				i--;
				continue;
			}
			res[i] = {cp, 0};
		}
		for(int i=v-spcnt+1;i<=v;i++)
		{
			res[i] = {vals[i-(v-spcnt+1)], 0};
		}
	}
	mt19937_64 mt(random_device{}());
	uniform_int_distribution<int> ud(0, 1000000000);
	for(int i=v+1;i<=n;i++)
	{
		bool flag;
		int x, y;
		do
		{
			flag = true;
			x = ud(mt), y = ud(mt);
			for(int j=1;j<i;j++)
			{
				if(chkfsg(1ll * (x - res[j].first) * (x - res[j].first) + 1ll * (y - res[j].second) * (y - res[j].second)))
				{
					flag = false;
					break;
				}
			}
		} while(!flag);
		res[i] = {x, y};
	}
	for(int i=1;i<=n;i++)
	{
		printf("%d %d\n", res[i].first, res[i].second);
	}
	return 0;
}
```

:::
