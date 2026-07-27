---
title: 题解：AT_abc447_f [ABC447F] Centipede Graph
date: 2026-3-1 16:30:27
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
> 数据结构学傻了 be like：。

这个“毛毛虫”有什么性质？我们为了便于讨论，定义其“躯干”为中间的一条，也就是度数 $>1$ 的节点。同时，定义其长度为其躯干的节点个数，也就是总点数乘 $\dfrac{1}{3}$。

那么，除非这个“毛毛虫”长度为 $1$，否则躯干的端点度数都应当为 $3$，而中间的点（躯干上除了端点之外的点）的度数都应当为 $4$。

因为是树上，可能还会连接其它的边，也就是说应该是端点度数 $\ge 3$，中间点度数 $\ge 4$。

然后你会发现这个东西基本是可合并的。只需要有两条链，一个端点重合，重合的那个端点和两条链的中间点度数 $\ge 4$，两条链的端点去掉中间重合的点度数 $\ge 3$ 即可。

考虑点分治。

需要考虑一些细节。

1. 点分中心度数 $\le 2$ 时，不可以统计子树答案，不然会爆炸。
2. 点分中心度数 $=3$ 时，各个子树是独立的。
3. 点分中心度数 $\ge 4$ 时，各个子树并不是独立的。
4. 同时，不能用容斥统计答案（因为是最值），必须使用二叉合并，也就是对于每个子树统计一次答案（利用之前的子树的信息），统计完再把这个子树加进去。不能边统计边加。
5. 我们说过了，如果长度为 $1$ 那么不满足上面的性质。但是，长度为 $1$ 就说明整条毛毛虫是一条长为 $3$ 的链，因为树的点数至少为 $3$ 所以必然存在这样的链。所以，如果点分治无法统计出合法答案，那么实际上的答案为 $1$。

:::info[code&submission]

[submission](https://atcoder.jp/contests/abc447/submissions/73703467)。

```cpp
/*
一条树链 其中左右端点度数 >= 3，中间的度数 >= 4

『在最高点统计』

LCA。

分治。

对，点分治！但是你只能二叉合并。

这根本不是个问题！
*/
#include <cstdio>
#include <vector>
#include <algorithm>

using namespace std;

int fa[200005];
int deg[200005];
vector<int> ch[200005], near[200005];

void dfs(int u, int ffa = 0)
{
	auto it = find(ch[u].begin(), ch[u].end(), ffa);
	if (it != ch[u].end())
	{
		ch[u].erase(it);
	}
	fa[u] = ffa;
	for (int v : ch[u]) dfs(v, u);
}

bool mark[200005];
int get_cent(int u)
{
	while (fa[u] && !mark[fa[u]]) u = fa[u];
	int total_sz = 0;
	auto calc_totalsz = [&](auto self, int u) -> void { total_sz++; for (int v : ch[u]) if(!mark[v]) self(self, v); };
	calc_totalsz(calc_totalsz, u);
	auto get_cent = [&](auto self, int u) -> int { int sum = 1, maxn = 0; for (int v : ch[u]) if(!mark[v]) { int res = self(self, v); if (res < 0) return res; sum += res; if (res > maxn) maxn = res; } if (total_sz - sum > maxn) maxn = total_sz - sum; if (maxn <= total_sz / 2) return -u; return sum; };
	return -get_cent(get_cent, u);
}

int solve(int u)
{
	u = get_cent(u);
	//printf("u = %d\n", u);
	mark[u] = true;
	int l3 = -0x3f3f3f3f, maxn = 1;
	if (deg[u] >= 3) l3 = 0;
	for (int v : near[u])
	{
		if (!mark[v])
		{
			auto cal_it = [&](auto self, int u, int len, int lst) -> void
				{
					if (deg[u] >= 3 && len + l3 + 1 > maxn) maxn = len + l3 + 1;
					//if (deg[u] >= 3 && len > l3) l3 = len;
					if (deg[u] >= 4)
					{
						for (int v : near[u])
						{
							if (!mark[v] && v != lst) self(self, v, len + 1, u);
						}
					}
				};
			cal_it(cal_it, v, 1, u);
			if (deg[u] >= 4)
			{
				auto update_it = [&](auto self, int u, int len, int lst) -> void
					{
						//if (deg[u] >= 3 && len + l3 > maxn) maxn = len + l3;
						if (deg[u] >= 3 && len > l3) l3 = len;
						if (deg[u] >= 4)
						{
							for (int v : near[u])
							{
								if (!mark[v] && v != lst) self(self, v, len + 1, u);
							}
						}
					};
				update_it(update_it, v, 1, u);
			}
		}
	}
	for (int v : near[u])
	{
		if (!mark[v])
		{
			int res = solve(v);
			if (res > maxn) maxn = res;
		}
	}
	return maxn;
}

int main()
{
	int t;
	scanf("%d", &t);
	while (t--)
	{
		int n;
		scanf("%d", &n);
		for (int i = 1; i <= n; i++)
		{
			deg[i] = 0;
			ch[i].clear();
			near[i].clear();
			fa[i] = 0;
			mark[i] = false;
		}
		for (int i = 2; i <= n; i++)
		{
			int u, v;
			scanf("%d%d", &u, &v);
			ch[u].push_back(v);
			ch[v].push_back(u);
			near[u].push_back(v);
			near[v].push_back(u);
			deg[u]++; deg[v]++;
		}
		dfs(1);
		printf("%d\n", solve(1));
	}
	return 0;
}
```

笑点解析：这个【】拼尽全力无法做出 G 遗憾离场。

笑点解析 $2$：这个【】每次求重心都是直接忽略点分治的 `mark` 的，并且没有判断子树根节点是否有 `mark`。

:::