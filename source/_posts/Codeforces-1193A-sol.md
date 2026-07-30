---
title: 题解：CF1193A Amusement Park
tags:
  - Solution
  - Codeforces Problem Solution
categories:
  - Solution
date: 2026-07-24 21:16:23
updated: 2026-07-24 21:16:23
---
> > safe。
>
> dangerous。

---

我们发现这个贡献和没有什么特别值得注意的形式，我们先考虑能不能求方案数。根据直觉，如果我们找到了求方案数的方法，一般我们也能找到求权值和的方法。

然后我们发现其实这个题每个方案都能双射成另一个互补的方案，满足两个方案互为反图。容易发现，这样的方案的权值也是互补的（和为 $m$）。

所以假设方案书为 $c$，则权值之和为 $\dfrac{cm}{2}$。我们只需要求 $c$。

此时原图的方向就没有关系，我们直接考虑无向图，然后定向。

数据范围很小，我们考虑状压。

我们设 $f_S$ 为考虑点集 $S$ 的方案数。如何转移？

直接构造拓扑序没有什么前途，因为可能多个拓扑序对应同一种定向方案。我们需要找到的是一种能够和定向方案形成双射的东西。

我们考虑为什么多个拓扑序会对应同一种定向方案。如果 $u,v$ 没有边，且 $\{u,v\}\cap S=\varnothing$，则 $S\cup \{u\}$ 和 $S\cup \{v\}$ 实际上是等价的。

换句话说，其实拓扑排序过程中的每个时刻，如果我们不是拓展一个点，而是拓展当前能够拓展的所有点，那么就可以对整个图进行分层（同时，每个点所在的层数就是从超级源点到它的最长路长度）。

容易发现，极小的分层方案（没有任何相邻两层之间无边，每一层都是独立集）能够和合法定向方案形成双射（给定了定向方案显然只有唯一的分层方案；而每个分层方案都满足所有边的起点和终点都不在同一层中，有唯一的定向方案；你映射过去再映射回来还是自身）。

那么我们只需要对这个分层方案进行计数即可。好做很多了。

我们就考虑对于每个 $S$ 枚举最后一层 $T$。那么有 $f_S=\displaystyle\sum_{T\subsetneq S\text{ is an independent set}} f_{S\backslash T}$……不对。

我们发现对于一个集合 $T$，如果存在另一个 $T'$ 满足 $T\subsetneq T'\subsetneq S$ 满足 $T'$ 也是个独立集，那么 $f_{S\backslash T'}$ 中会计算一次 $f_{S\backslash T}$，然后你就重复计算了。

同时我们发现，独立集的子集必然也是独立集。也就是说，其实它会计算每个子集。

所以我们要容斥掉，保证每个独立集仅被计算一次。

我们发现限制里面的 $S$ 是独立集很烦啊，我们直接用艾弗森括号放到右边。$f_S=\displaystyle\sum_{T\subsetneq S}f_{S\backslash T}[T\text{ is an independent set}]$。

那么开始容斥，容易发现真实的 $f_S=\displaystyle\sum_{T\subsetneq S}(-1)^{\lvert S\backslash T\rvert+1}f_{S\backslash T}[T\text{ is an independent set}]$。

总时间复杂度 $O(3^n)$，做完了。

:::info[sub&code]

[sub](https://codeforces.com/contest/1193/submission/384083053)。

```cpp
/*

并不是签到题，但还是能做。

（我状压还行吧

可以 3^n

我们对拓扑排序分层

容易发现这样层能和边的顺序形成双射（当然，每一层的所有点之间两两不能有边）

然后对于每个点集

去掉这个点集之后：

- 入度为 0 的点必选
- 其它点可选可不选，但是两两必须无边
*/
#include <queue>
#include <cstdio>
#include <vector>
#include <utility>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

long long f[(1<<18)+5], g[(1<<18)+5];
unsigned to[20], rt[20];
bool vld[(1<<18)+5];
unsigned id[20];

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	for(int i=1;i<=m;i++)
	{
		int u, v;
		scanf("%d%d", &u, &v);
		to[u] |= (1 << (v - 1));
		rt[v] |= (1 << (u - 1));
	}
	f[0] = 1;
	g[0] = 0;
	for(int i=0;i<(1<<n);i++)
	{
		unsigned trt = 0;
		for(int j=0;j<n;j++)
		{
			if(i&(1<<j)) trt |= to[j+1] | rt[j+1];
		}
		vld[i] = (i & trt) == 0;
	}
	for(int i=0;i<(1<<n);i++)
	{
		// printf("i = %u, xs = %u\n", i, xs);
		for(int j=i;j<(1<<n);j=(j+1)|i)
		{
			if(j == i || !vld[i^j]) continue;
			f[j] = (f[j] + f[i] * (__builtin_popcount(j ^ i) % 2 ? 1 : 998244352)) % 998244353;
		}
		// printf("f[%lld] = %lld\n", i, f[i]);
	}
	printf("%lld\n", f[(1<<n)-1] * 499122177 % 998244353 * m % 998244353);
	return 0;
}
```

:::
