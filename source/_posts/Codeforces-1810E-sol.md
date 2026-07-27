---
title: 题解：CF1810E Monsters
date: 2026-3-26 15:43:37
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
首先有一个显然的解法，对于每条边，按照 $\max(a_u,a_v)$ 从小到大排序，依次判断是否可以合并，如果可以就拿并查集合并。

这样只会把 `Yes` 判成 `No`。

增加试验次数，前几次排序，后几次 shuffle，获得了 WA on $52$ 的好成绩。

注意到 hack 数据形如 $\overbrace{0,0,0,\dots,0}^{\frac{n}{2}\text{\space\text{个}}},\dfrac{n}{2},\dfrac{n}{2}-1,\dfrac{n}{2}-2,\dots,1$。比如 $n=10$ 的时候是 $0,0,0,0,0,5,4,3,2,1$，边就是一条链。我们的算法在从小到大排序的时候，第一次会愉快地将 $\left[1,\dfrac{n}{2}\right]$ 合并，第二轮只能合并 $\dfrac{n}{2}$ 和 $\dfrac{n}{2}+1$，第三轮只能合并 $\dfrac{n}{2}+1$ 和 $\dfrac{n}{2}+2$……而后面的随机化则收效甚微。

那么，我们在排序的时候，奇数次从小到大排序（正常排序），偶数次从大到小排序就能过了。

另外，其实 test $52$ 是倒数第二个 test。

:::info[sub&code]
[sub](https://codeforces.com/contest/1810/submission/368229333)。

```cpp
/*

*/
#include <cstdio>
#include <stack>
#include <iostream>
#include <algorithm>
#include <bitset>
#include <numeric>
#include <vector>
#include <random>

using namespace std;

int fa[200005], sz[200005];
bool hp[200005];
int getfa(int x) { while(x != fa[x]) x = fa[x] = fa[fa[x]]; return x; }
void merge(int x, int y)
{
	x = getfa(x); y = getfa(y); if(x == y) return;
	if(sz[x] <= sz[y])
	{
		fa[x] = y;
		sz[y] += sz[x];
		hp[y] |= hp[x];
	}
	else
	{
		fa[y] = x;
		sz[x] += sz[y];
		hp[x] |= hp[y];
	}
}
int a[200005];

int main()
{
	int t;
	scanf("%d", &t);
	constexpr int T = -1;
	for(int id=1;id<=t;id++)
	{
		int n, m;
		scanf("%d%d", &n, &m);
		iota(fa, fa + n + 5, 0);
		fill(sz, sz + n + 5, 1);
		if(id == T) printf("%d-%d", n, m);
		bool flag = false;
		for(int i=1;i<=n;i++)
		{
			scanf("%d", a + i);
			if(!a[i]) flag = true;
			hp[i] = false;
			if(!a[i]) hp[i] = true;
			if(id == T) printf("-%d", a[i]);
		}
		class edge
		{
		public:
			int u, v, w;
		};
		vector<edge> vt;
		for(int i=1;i<=m;i++)
		{
			int u, v;
			scanf("%d%d", &u, &v);
			if(id == T) printf("-%d-%d", u, v);
			// if(a[u] + 1 >= a[v]) web[u].push_back(v);
			// if(a[v] + 1 >= a[u]) web[v].push_back(u);
			vt.push_back({u, v, max(a[u], a[v])});
		}
		if(!flag)
		{
			printf("No\n");
			continue;
		}
		mt19937_64 mt(random_device{}());
		for(int i=1;i<=50;i++)
		{
			shuffle(vt.begin(), vt.end(), mt);
			if(i <= 20)
			{
				if(i % 2 == 1) sort(vt.begin(), vt.end(), [](const auto &x, const auto &y) { return x.w < y.w || x.w == y.w && min(a[x.u], a[x.v]) < min(a[y.u], a[y.v]); });
				else sort(vt.begin(), vt.end(), [](const auto &x, const auto &y) { return x.w > y.w || x.w == y.w && min(a[x.u], a[x.v]) < min(a[y.u], a[y.v]); });
			}
			for(const auto &[u, v, w] : vt)
			{
				// printf("%d, %d, %d\n", u, v, w);
				// printf("sz[%d] = %d, sz[%d] = %d\n", u, sz[u], v, sz[v]);
				if(hp[getfa(u)] && sz[getfa(u)] >= w || hp[getfa(v)] && sz[getfa(v)] >= w)
				{
					// printf("successfully merged %d and %d\n", u, v);
					merge(u, v);
					// printf("now size[%d] = %d\n", getfa(u), sz[getfa(u)]);
				}
			}
		}
		int cnt = 0;
		for(int i=1;i<=n;i++)
		{
			if(i == getfa(i)) cnt++;
		}
		// if(t == 1 && a[1] == 0 && a[2] == 0 && a[3] == 0 && a[4] == 0 && a[5] == 0 && cnt > 1) printf("%d---%d---%d---", a[n/2], a[n/2+1], a[n/2-1]);
		printf(cnt == 1 ? "yEs\n" : "nO\n");
	}
	return 0;
}
```
:::

> 你为什么要用错解冲过去？做不出来，急了。