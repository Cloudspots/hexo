---
title: 题解：P11220 【MX-S4-T4】「yyOI R2」youyou 的三进制数
date: 2026-7-7 19:33:19
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
讲了一下此题，题解以祭之。

---

首先这个完美数列没有什么性质，我们能唯一发现的还算好的性质就是它是可逆的了。换句话说，如果数列 $[x,y]$ 合法，那么 $[y,x]$ 也合法。并且它有局部性，即除了不能重复之外一个数列是否合法只关系到相邻两项，不会关系更多项。

再结合不能重复的要求，后面规定了开头结尾和开头的 $b,c$，交集大小恰好为 $1$ 的要求，容易想到把完美数列转为路径。

那么我们直接建图！

现在，条件就转化为，是否存在一个从 $z$ 出发的路径 $l$，使得每一条 $x\to y$ 的路径都经过且仅经过一个 $l$ 上的点。

无向图连通性，我们考虑圆方树。

我们先考虑 $z$ 在 $x\to y$ 路径（在圆方树上的路径，下同）上。此时显然是可以的，我们只包含 $z$ 一个点即可。

那么如果不是呢？我们先看如果 $z$ 在 $x\to y$ 的某个方点上，但不在 $x\to y$ 路径上。

那么我们直觉上应该是不行的，但是为什么呢？

我们就考虑如果可以，那么假设这条路径上包含 $a,b$ 这两个相邻的点。那么我们设 $x$ 从 $x'$ 进入这个方点，$y$ 从 $y'$ 进入。那么显然我们可以有两条路径 $x'\to a$ 和 $b\to y'$，两者不能相交（因为如果相交了且不是在 $a$ 或 $b$ 处相交，那么设交点为 $c$，我们就可以得到一条路径 $x'\to c\to y'$ 途中没有经过任何一个 $z$ 路径上的店，矛盾了；而如果在 $a$ 或 $b$ 处相交，那显然会有一条路径同时经过了 $a,b$，也矛盾了）。那么，我们构造一条路径 $x'\to a\to b\to y'$，我们上面证明了这是简单路径，但是它经过了两个 $z$ 路径上的点，矛盾了！$\square$

再考虑 $z$ 也不在 $x,y$ 路径的方点上的情况。这种也非常简单，你只需要求 $z$ 到 $x,y$ 路径上遇到的第一个点，用它代替 $z$ 即可。如果是圆点，则合法，否则不合法。

那么合法的 $(x,y,z)$ 必然长这样：$x\leadsto O,y\leadsto O,z\leadsto O$ 三条路径除了在 $O$ 之外互不相交，并且 $O$ 是一个圆点。

显然我们要枚举这个 $O$。我们考虑 $O$ 的所有邻居，它们组成了若干个子树（我们把到父亲的边也看作子树），条件满足的充要条件是 $x,y,z$ 在不同的子树中，但如果某一个点和 $O$ 重合则不算在任何一个子树中（注意，即使 $x=z=O$ 也是合法的，但是 $x=y=z=O$ 不合法，因为 $x\neq y$）。

因为我们要对 $z$ 计数，所以我们枚举 $z$ 所在的子树。我们设所有子树的大小（指圆点个数！）分别为 $s_1,s_2,\dots$。

1. $z$ 在 $i$ 子树（大小为 $s_i$），$x,y$ 都不等于 $O$：此时方案数为 $\displaystyle\left(\sum_{j\neq i} s_j\right)^2-\sum_{j\neq i}s_j^2$。当然，在实际计算的时候，首先我们要注意到 $\displaystyle\sum_{j\neq i}s_j=n-s_i$，然后计算后半部分我们要先算出 $\displaystyle\sum s_j^2$ 然后减掉对应的部分。
2. $z$ 在 $i$ 子树，$x$ 或 $y$ 等于 $O$：此时方案数为 $2\displaystyle\sum_{j\neq i}s_j$，其中乘 $2$ 是因为 $x,y$ 都可以是 $O$。同样，我们注意到 $\displaystyle\sum s_j=n$，然后减去对应值即可。
3. $z=O$，$x\neq O,y\neq O$：此时只要 $x,y$ 在不同子树即可，方案数为 $\displaystyle\left(\sum s\right)^2-\sum s^2$。
4. $z=O$ 并且 $x=O$ 或 $y=O$：此时方案数是 $\displaystyle 2\sum s$。

这些都可以快速计算出来，所以最终时间复杂度为 $O(n)$。做完了。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/284425826)。

写的比较【数据删除】，可能需要捏着鼻子看。

```cpp
#include <stack>
#include <cstdio>
#include <vector>
#include <cassert>
#include <numeric>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

vector<int> web[300005];

unsigned wss[300005];
unsigned p3[15];
int dfn[300005], low[300005];
int vccid[300005];
vector<int> vcc[300005];

vector<int> ch[600005];
int sz[600005];
int fa[600005];
int ndfn[600005], mdfn[600005];
int rdfn[600005];
long long val[600005];

int main()
{
	int n, w;
	scanf("%d%d", &n, &w);
	{
		wss[1] = 1;
		for(int i=2;i<=n;i++)
		{
			wss[i] = wss[i/3] + 1;
		}
		p3[0] = 1;
		for(int i=1;i<=12;i++)
		{
			p3[i] = p3[i-1] * 3;
		}
		for(int i=0;i<=n;i++)
		{
			if(i)
			{
				web[i].push_back(i / 3);
				web[i / 3].push_back(i);
			}
			if(i%3!=0 && i <= w)
			{
				int j = i / 3 + i % 3 * p3[wss[i] - 1];
				if(i != j && j <= n)
				{
					web[i].push_back(j);
					web[j].push_back(i);
				}
			}
		}
	} // init
	int vccnt = 0;
	stack<int> stk;
	U([&](auto &&self, int u) -> void
	{
		static int ddfn = 0; // EVIL BHY
		dfn[u] = low[u] = ++ddfn;
		stk.push(u);
		for(int v : web[u])
		{
			if(!dfn[v])
			{
				self(self, v);
				if(low[v] < low[u]) low[u] = low[v];
				if(low[v] >= dfn[u])
				{
					vccnt++;
					int k;
					do
					{
						k = stk.top();
						stk.pop();
						vcc[vccnt].push_back(k);
					} while(k != v);
					vcc[vccnt].push_back(u);
				}
			}
			else if(dfn[v] < low[u]) low[u] = dfn[v];
		}
	})(0);
	for(int i=1;i<=vccnt;i++)
	{
		for(int j : vcc[i])
		{
			ch[i + n].push_back(j);
			ch[j].push_back(i + n);
		}
	}
	fa[0] = -1;
	U([&](auto &&self, int u) -> void
	{
		static int ddfn = 0;
		ndfn[u] = mdfn[u] = ++ddfn;
		// printf("ndfn[%d] = %d\n", u, ndfn[u]);
		if(fa[u] != -1) ch[u].erase(find(ch[u].begin(), ch[u].end(), fa[u]));
		sz[u] = int(u <= n);
		for(int v : ch[u])
		{
			// printf("%d --- %d\n", u, v);
			fa[v] = u;
			self(self, v);
			sz[u] += sz[v];
			mdfn[u] = max(mdfn[u], mdfn[v]);
		}
		// printf("sz[%d] = %d\n", u, sz[u]);
	})(0);
	assert(sz[0] == n + 1);
	U([&](auto &&self, int u) -> void
	{
		if(fa[u] == -1) // root
		{
			long long sumsq = 0;
			for(int v : ch[u]) sumsq += 1ll * sz[v] * sz[v];
			for(int v : ch[u])
			{
				// printf("(%d) ((size = %d)) --- %d (size = %d)\n", u, sz[u], v, sz[v]);
				long long vv = 1ll * (n - sz[v]) * (n - sz[v]) - (sumsq - 1ll * sz[v] * sz[v]) + (n - sz[v]) * 2;
				val[ndfn[v]] += vv;
				val[mdfn[v] + 1] -= vv;
				// val[ndfn[u]] += vv; val[ndfn[u] + 1] -= vv;
				// printf("u = %d, %d ~ %d, %d += %lld\n", u, ndfn[v], mdfn[v], ndfn[u], vv);
			}
			long long vv = 1ll * n * n - sumsq + n * 2;
			val[ndfn[u]] += vv;
			val[ndfn[u] + 1] -= vv;
		}
		else if(u <= n)
		{
			long long sumsq = 0;
			for(int v : ch[u]) sumsq += 1ll * sz[v] * sz[v];
			sumsq += 1ll * (n + 1 - sz[u]) * (n + 1 - sz[u]);
			for(int v : ch[u])
			{
				// printf("(%d) ((size = %d)) --- %d (size = %d)\n", u, sz[u], v, sz[v]);
				long long vv = 1ll * (n - sz[v]) * (n - sz[v]) - (sumsq - 1ll * sz[v] * sz[v]) + (n - sz[v]) * 2;
				val[ndfn[v]] += vv;
				val[mdfn[v] + 1] -= vv;
				// val[ndfn[u]] += vv; val[ndfn[u] + 1] -= vv;
				// printf("u = %d, %d ~ %d, %d += %lld\n", u, ndfn[v], mdfn[v], ndfn[u], vv);
			}
			// fa
			long long vv = 1ll * (sz[u] - 1) * (sz[u] - 1) - (sumsq - 1ll * (n + 1 - sz[u]) * (n + 1 - sz[u])) + (sz[u] - 1) * 2;
			val[1] += vv;
			val[ndfn[u]] -= vv;
			val[mdfn[u] + 1] += vv;
			// val[ndfn[u]] += vv; val[ndfn[u] + 1] -= vv;
			// printf("u = %d, %d ~ %d, %d ~ inf, %d += %lld\n", u, 1, ndfn[u] - 1, mdfn[u] + 1, ndfn[u], vv);
			vv = 1ll * n * n - sumsq + n * 2;
			val[ndfn[u]] += vv;
			val[ndfn[u] + 1] -= vv;
		}
		for(int v : ch[u])
		{
			self(self, v);
		}
	})(0);
	for(int i=1;i<=n+vccnt;i++) val[i+1] += val[i];
	for(int i=0;i<=n;i++)
	{
		printf("%lld\n", val[ndfn[i]]);
	}
	return 0;
}
```

欢迎来抢 P11218 最优解。

:::