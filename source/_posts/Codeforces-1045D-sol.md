---
title: 题解：CF1045D Interstellar battle
date: 2026-3-28 11:22:21
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
如何表示连通块数量？因为是森林，所以是点数减边数。而由于期望的线性性，所以可以分别维护点数的期望和边数的期望。

点数的期望非常好做。就是 $\displaystyle\sum_{i=1}^n 1-p_i$，每次单点修改也只会修改到一个值。

对于边数，我们考虑维护每条边没有被删除的概率，那就是它两边的点都没有被删除的概率，也就是 $(1-p_u)(1-p_v)$。暴力修改是不行的，菊花图会爆炸。

一个经典的 trick 是维护树上邻域信息，单点修改的时候使用根号分治。当邻居数量 $\le B$ 的时候暴力修改，否则直接维护与这个点相邻的边的贡献之和。具体来讲，我们对于每一个“大点”（邻居数量 $>B$ 的点）维护一个 $S$ 数组，$S_u=\displaystyle\sum_{(u,v)\in E}(1-p_v)$。修改的时候，如果这个点是小点，那就直接暴力修改，同时维护邻居中大点的 $S$。否则，使用 $S$ 维护答案，同时也维护邻居中大点的 $S$。

时间复杂度 $\mathcal O(n+q\sqrt n)$。

:::info[sub&code]
[sub](https://codeforces.com/contest/1045/submission/368445082)。

```cpp
/*
首先【连通分量个数】如何表示？

(剩余点数) - (剩余边数)

考虑每条边，求出其被保留的概率即可。

比如，对于样例，在第一个修改完成之后

      0   1    2    3    4
p = [0.5 0.29 0.49 0.95 0.66]

第一条边 (2 3)：0.0255
第二条边 (0 3)：0.025
第三条边 (3 4)：0.017
第四条边 (2 1)：0.3621

求和：0.4296

剩余点数：2.11

1.6804

是这样的。

统计期望点数是简单的。边数呢？

根号分治.jpg
*/
#include <cstdio>
#include <vector>
#include <algorithm>
#include <cmath>

using namespace std;

vector<int> web[100005];
vector<int> bg[100005];
long double p[100005];
long double nss[100005];
long double s2[100005];

int main()
{
	int n;
	scanf("%d", &n);
	long double sp = 0;
	for(int i=1;i<=n;i++)
	{
		scanf("%Lf", p + i);
		sp += (1 - p[i]);
	}
	long double sum = 0;
	for(int i=2;i<=n;i++)
	{
		int x, y;
		scanf("%d%d", &x, &y);
		x++;
		y++;
		web[x].push_back(y);
		web[y].push_back(x);
		sum += (1 - p[x]) * (1 - p[y]);
	}
	int B = sqrt(n);
	for(int i=1;i<=n;i++)
	{
		for(int j : web[i])
		{
			if(web[j].size() > B)
			{
				bg[i].push_back(j);
				s2[j] += 1 - p[i];
			}
		}
	}
	int q;
	scanf("%d", &q);
	while(q--)
	{
		int a;
		long double v;
		scanf("%d%Lf", &a, &v);
		a++;
		if(web[a].size() <= B)
		{
			for(int x : web[a])
			{
				sum -= (1 - p[a]) * (1 - p[x]);
				if(web[x].size() > B) s2[x] -= 1 - p[a];
			}
			sp -= 1 - p[a];
			p[a] = v;
			for(int x : web[a])
			{
				sum += (1 - p[a]) * (1 - p[x]);
				if(web[x].size() > B) s2[x] += 1 - p[a];
			}
			sp += 1 - p[a];
		}
		else
		{
			sp -= 1 - p[a];
			sum -= s2[a] * (1 - p[a]);
			p[a] = v;
			sum += s2[a] * (1 - p[a]);
			sp += 1 - p[a];
		}
		printf("%.10Lf\n", sp - sum);
	}
	return 0;
}
```
:::