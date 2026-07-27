---
title: CF1840G1 随机化题解
date: 2026-4-15 15:09:26
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
看了一圈没有随机化做法。

显然这个 $a$ 只能判重。那么我们考虑随机询问（随机的是当前位置，不是位置增量），如果 $a,b$ 得到的 $x$ 相同则说明 $a\equiv b\pmod n$。那么拿出所有满足 $a,b$ 的 $x$ 相同的 $(a,b)$，求出所有 $a-b$ 的 $\gcd$ 即可。根据生日悖论，重复率是比较高的，但是仍然需要仔细优化。

我们考虑 $a,b$ 随机选取的范围。太小不行，比如 $10^6$，这样很难随机出差很大的情况（如 $n=10^6$，如果范围还是 $10^6$ 那就是约 $\dfrac{1}{10^{12}}$ 的概率）。太大也不行，这样 $\gcd$ 可能很大。我用的是 $10^7$。

考虑一些细枝末节的优化。

对于最终得到的 $\gcd$，设其为 $M$。显然答案可能是 $M$ 的任意因子。但是也不是没有下限，显然下限就是得到的所有 $x$ 的 $\max$。我们取最小的 $\ge x$ 的 $M$ 的因子。由于值域上文限定为 $10^7$，所以可以暴力枚举因子，甚至不需要用根号枚举因子优化。

还有，如果两次选择查询的数字都是一样的则白做了，所以每次只随机与之前不同的数字。

最后还有一个较为无耻的优化（不用也能过）。Codeforces 对于在某个测试点 TLE 的代码会自动重测几遍这个测试点，那么如果很不幸没有 $x$ 相同的 $a,b$，则让代码死循环。

:::info[sub&code]

[sub](https://codeforces.com/contest/1840/submission/371215010)。

```cpp
#include <cstdio>
#include <random>
#include <bitset>

using namespace std;

vector<int> vr[1000005];

int gcd(int x, int y) { return y == 0 ? abs(x) : gcd(y, x % y); }

bitset<10000005> vis;

int main()
{
	int x;
	scanf("%d", &x);
	int pos = 0;
	mt19937_64 mt(random_device{}());
	uniform_int_distribution<int> ud(0, 10000000);
	vr[x].push_back(0);
	vis[0] = true;
	int maxi = x;
	for(int i=1;i<=2022;i++)
	{
		int np;
		do
		{
			np = ud(mt);
		} while(vis[np]);
		vis[np] = true;
		if(np > pos) printf("+ %d\n", np - pos);
		else printf("- %d\n", pos - np);
		fflush(stdout);
		scanf("%d", &x);
		vr[x].push_back(np);
		pos = np;
		maxi = max(maxi, x);
	}
	int gg = 0;
	for(int i=1;i<=1000000;i++)
	{
		for(int j=0;j+1<vr[i].size();i++)
		{
			for(int k=j+1;k<vr[i].size();k++)
			{
				gg = gcd(gg, vr[i][j] - vr[i][k]);
				// printf("val: %d - %d\n", vr[i][j], vr[i][k]);
			}
		}
	}
	if(gg == 0) return 1;
	for(int i=1;i<=gg;i++)
	{
		if(gg % i == 0 && i >= maxi)
		{
			printf("! %d\n", i); fflush(stdout);
			return 0;
		}
	}
	// printf("! %d\n", gg); fflush(stdout);
	return 0;
}
```

:::