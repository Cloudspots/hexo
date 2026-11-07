---
title: 题解：P15508 [CEOI 2012] 网络 / Network
date: 2026-11-06 23:19:29
updated: 2026-11-06 23:19:29
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P15508 [CEOI 2012] 网络 / Network

> > 快读题。
>
> 这又是什么题目分类啊。

---

首先第一问可以直接 Tarjan……这样还是太邪恶了，考虑一下图的性质。

引理 $1$：图中每个环都没有弦。证明显然。

性质 $1$：图中每条边至多属于一个有向环，换句话说图是有向仙人掌。由引理 $1$ 显然。

性质 $2$：图按照强连通分量缩点后是树。这是显然的。

现在第一问直接统计子树权值和（一个节点权值就是强连通分量大小）即可。

考虑第二问。

观察样例，猜测只能从后代向祖先连边。

证明显然，如果连接横叉边，则 LCA 到终点会有两条简单路径。

考虑目标图满足什么性质。显然整个图强连通，换句话说每条边属于且仅属于一个简单环。

考虑对于所有非根节点，它和父节点连边一定是合法的。然而观察样例发现这不够优秀，实际上可以继续往上连。

那么考虑在树上 dfs，对于每个节点先遍历所有子节点，如果它到父节点的边还没有被覆盖（还不在环上），则一直往上只到遇到不能继续往上的情况（即 $x$ 到父节点 $\text{fa}_x$ 的边在原图中的终点 $v$ 和 $\text{fa}_x$ 到 $\text{fa}_{\text{fa}_x}$ 的边在原图上的起点 $u$ 不同，或者 $x$ 到 $\text{fa}_x$ 已被覆盖）。

正确性是显然的。

时间复杂度 $O(n)$。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/308474748)。

```cpp
// 2h 才过掉 T1，这也太拉了
// 鉴定为：有向仙人掌。
/*
XS-X Party of Spirits
*/
#include <stack>
#include <cstdio>
#include <vector>
#include <bitset>
#include <cassert>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

vector<int> web[100005];
int dfn[100005], low[100005];
int sccnt;
vector<int> scc[100005];
int sccid[100005];
bitset<100005> instk;
class iedge { public: int u, v, xu, xv; };
vector<iedge> ch[100005];
bitset<100005> NightWarden; // Warden: ??? / NW-X ADOFAI vs. Minecraft
iedge fa[100005];
int sz[100005];

char ibf[100000005];
unsigned li = 0;
unsigned qread() { unsigned res = 0; char ch; while((ch = ibf[li++]) < '0' || ch > '9'); do { res = res * 10 + ch - '0'; } while((ch = ibf[li++]) >= '0' && ch <= '9'); return res; }

int main()
{
	fread(ibf, 1, sizeof ibf, stdin);
	int n, m, r;
	// scanf("%d%d%d", &n, &m, &r);
	n = qread(); m = qread(); r = qread();
	for(int i=1;i<=m;i++)
	{
		int u, v;
		// scanf("%d%d", &u, &v);
		u = qread(); v = qread();
		web[u].push_back(v);
	}
	int ddfn = 0;
	stack<int> stk;
	U([&](auto &&self, int u) -> void
	{
		dfn[u] = low[u] = ++ddfn;
		instk[u] = true;
		stk.push(u);
		for(int v : web[u])
		{
			if(!dfn[v])
			{
				self(self, v);
				low[u] = min(low[u], low[v]);
			}
			else if(instk[v]) low[u] = min(low[u], dfn[v]);
		}
		if(dfn[u] == low[u])
		{
			sccnt++;
			int x;
			do
			{
				x = stk.top();
				stk.pop();
				instk[x] = false;
				scc[sccnt].push_back(x);
				sccid[x] = sccnt;
			} while(x != u);
		}
	})(r);
	assert(stk.empty());
	for(int i=1;i<=n;i++)
	{
		for(int j : web[i])
		{
			if(sccid[i] != sccid[j]) ch[sccid[i]].push_back({sccid[i], sccid[j], i, j});
		}
	}
	int met = 0;
	U([&](auto &&self, int u) -> void { met++; sz[u] = scc[u].size(); for(const auto &e : ch[u]) { fa[e.v] = {e.v, e.u, e.xv, e.xu}; self(self, e.v); sz[u] += sz[e.v]; } })(sccid[r]);
	assert(met == sccnt);
	for(int i=1;i<=n;i++) printf("%d%c", sz[sccid[i]], " \n"[i == n]); // 40pts
	vector<pair<int, int>> ans;
	U([&](auto &&self, int u) -> void
	{
		for(const auto &e : ch[u])
		{
			self(self, e.v);
		}
			// if(u == 7916) __debugbreak();
		if(u != sccid[r] && !NightWarden[u])
		{
			int lst = fa[u].xu, x = fa[u].xv;
			while(sccid[x] != sccid[r] && fa[sccid[x]].xu == x && !NightWarden[sccid[x]])
			{
				NightWarden[sccid[x]] = true;
				lst = x;
				x = fa[sccid[x]].xv;
			}
			ans.push_back({fa[u].xu, x});
		}
	})(sccid[r]);
	// printf("0\n"); return 0;
	printf("%d\n", (int)ans.size());
	for(const auto &[u, v] : ans) printf("%d %d\n", u, v);
	return 0;
}
```

:::
