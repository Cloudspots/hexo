---
title: 题解：P6662 [POI 2019/2020 R1] Przedszkole / 幼儿园
date: 2026-10-23 23:08:48
updated: 2026-10-23 23:08:48
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P6662 [POI 2019/2020 R1] Przedszkole / 幼儿园

This is the graph coloring counting problem, a classical #P-hard problem. There are three subtasks (excluding brute force), and three solutions.

## Subtask $2$

$n \le 15$.

Obviously, at most $n$ colors are used, which is much smaller than $k\le 10^9$. Let $f_c$ be the number of ways of using exactly $c$ colors (all used); then the contribution of such colorings to the final answer is $f_c\dbinom{k}{c}$. Thus we only need to calculate $f_{1\dots n}$.

A coloring is valid if and only if, for each color $c$, the vertices of color $c$ form an independent set. Let $g_{c,S}$ be the number of ways to color the vertex set $S$ with exactly $c$ colors (all used). Then $g_{c,S}=\displaystyle\sum_{T\subsetneq S} [S\setminus T\text{ is an independent set}]g_{c-1,T}$.

This can be calculated directly in $O(n3^n+m2^n)$ time, with $O(n)$ per query, so the total time complexity is $O(n3^n+m2^n+qn)$, fast enough. And we can use set power series to optimize it to $O(n^3 2^n+qn)$, not essential.

## Subtask $3$

We can use the inclusion-exclusion principle to solve this subtask. Let $f_{k,S}$ be the number of colorings that use exactly $k$ colors (all used) and in which every edge in $S$ has endpoints of the same color ($S\subseteq E$). Then the number of valid colorings with exactly $k$ colors is $\displaystyle\sum_{S\subseteq E} (-1)^{\lvert S\rvert} f_{k,S}$.

Enumerate $S$. For each edge set $S$, let $p$ be the number of connected components when considering only the edges in $S$. It seemed like $f_{k,S}=k^p$? Actually no, because we may use only $k-1$ or fewer colors, so we define $g_{k,S}=k^p$ which is similar to $f$ but uses at most $k$ colors. Converting $g$ to $f$ is trivial - just use binomial inversion.

This can be solved in $O(m2^m\alpha(n)+qm)$ time. This is not very fast, so several optimizations are needed; please refer to the code.

## Subtask $4$

This is very simple. The whole graph consists of several cycles. Obviously, the number of $k$-colorings of a single cycle with $n$ vertices is $(k-1)^n+(-1)^n(k-1)$. So we can solve this in $O(nq)$, fast enough.

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/305115258).

```cpp
#include <cstdio>
#include <vector>
#include <bitset>
#include <chrono>
#include <algorithm>
#ifdef LB_IS_DEBUGGING
#include <signal.h>
#define __debugbreak() raise(SIGTRAP)
#endif

using namespace std;

vector<unsigned> web[100005];
unsigned deg[100005];
unsigned gid[100005];
unsigned sz[100005];
bitset<100005> vis;
unsigned long long pans[100005][30];
unsigned long long pq[100005][30];
unsigned long long kv[(1<<15)+5], kg[(1<<15)+5], tp[(1<<15)+5];
unsigned bk[30];
unsigned long long fact[100005], ifact[100005];
unsigned rv[100005];

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

class dsu
{
public:
	int fa[100005], rk[100005];
	int getfa(int x) { while(x != fa[x]) x = fa[x] = fa[fa[x]]; return x; }
	unsigned merge(int x, int y) { if((x = getfa(x)) == (y = getfa(y))) return 0; if(rk[x] < rk[y]) fa[x] = y; else if(rk[x] > rk[y]) fa[y] = x; else { fa[x] = y; rk[y]++; } return 1; }
} ds;

char ibf[100000005];
unsigned li = 0;
unsigned qread() { unsigned res = 0; char ch; while((ch = ibf[li++]) < '0' || ch > '9'); do { res = res * 10 + ch - '0'; } while((ch = ibf[li++]) >= '0' && ch <= '9'); return res; }

int main()
{
	auto bgn = chrono::high_resolution_clock::now();
	// freopen("prz.in", "r", stdin);
	// freopen("prz.out", "w", stdout);
	fread(ibf, 1, sizeof ibf, stdin);
	int n, m, q;
	n = qread(); m = qread(); q = qread();
	// scanf("%d%d%d", &n, &m, &q);
	auto qpow = [](unsigned long long x, unsigned long long y) -> unsigned long long { unsigned long long ans = 1; do { if(y & 1) ans = ans * x % 1000000007; x = x * x % 1000000007; } while(y >>= 1); return ans; };
	fact[0] = 1;
	for(int i=1;i<=n;i++) fact[i] = fact[i-1] * i % 1000000007;
	ifact[n] = qpow(fact[n], 1000000005);
	for(int i=n-1;i>=0;i--) ifact[i] = ifact[i+1] * (i+1) % 1000000007;
	auto comb = [](int x, int y) { return x < y || y < 0 ? 0 : fact[x] * ifact[y] % 1000000007 * ifact[x-y] % 1000000007; };
	for(int i=1;i<=m;i++)
	{
		int u, v;
		// scanf("%d%d", &u, &v);
		u = qread(); v = qread();
		deg[u]++;
		deg[v]++;
		web[u].push_back(v);
		web[v].push_back(u);
	}
	int fg = true;
	for(int i=1;i<=n;i++) if(deg[i] != 2) fg = false;
	int cur = 0;
	unsigned pc1 = 0;
#ifndef TEST3
	if(fg)
	{
		for(int i=1;i<=n;i++)
		{
			if(vis[i]) continue;
			vector<int> vt;
			U([&](auto &&self, int u) -> void
			{
				vis[u] = true; vt.push_back(u);
				for(int v : web[u])
				{
					if(!vis[v])
					{
						self(self, v);
					}
				}
			})(i);
			sz[++cur] = vt.size();
		}
		while(q--)
		{
			int c;
			// scanf("%d", &c);
			c = qread();
			unsigned long long mul = 1;
			for(int i=1;i<=cur;i++)
			{
				mul = mul * (qpow(c-1, sz[i]) + qpow(1000000006, sz[i]) * (c - 1) % 1000000007) % 1000000007;
			}
			printf("%llu\n", mul);
		}
		// fprintf(stderr, "Time: %llu ms\n", chrono::duration_cast<chrono::milliseconds>(chrono::high_resolution_clock::now() - bgn).count());
		return 0;
	}
	if(n <= 15)
	{
		for(int i=1;i<=n;i++)
		{
			if(vis[i]) continue;
			vector<int> vt;
			int cttt = 0;
			U([&](auto &&self, int u) -> void
			{
				vis[u] = true; vt.push_back(u);
				for(int v : web[u])
				{
					cttt++;
					if(!vis[v])
					{
						self(self, v);
					}
				}
			})(i);
			if(vt.size() == 1)
			{
				pc1++;
				continue;
			}
			cur++;
			sz[cur] = vt.size();
			if(cttt == 2 * sz[cur] - 2)
			{
				pans[cur][0] = 1;
				// for(unsigned j=1;j<=24;j++)
				// {
				// 	pans[cur][j] = j * qpow(j-1, sz[cur]-1) % 1000000007;
				// }
				continue;
			}
			for(int i=0;i<vt.size();i++)
			{
				gid[vt[i]] = i;
				bk[i] = 0;
			}
			for(int x : vt)
			{
				for(int y : web[x])
				{
					bk[gid[x]] |= (1u << gid[y]);
				}
			}
			for(unsigned msk=0;msk<(1<<vt.size());msk++)
			{
				bool fg = true;
				for(int j=0;j<vt.size();j++)
				{
					if((msk & (1 << j)) && (msk & bk[j])) fg = false;
				}
				kv[msk] = (int)fg;
				kg[msk] = 0;
			}
			kg[0] = 1;
			for(unsigned j=1;j<=16;j++)
			{
				for(unsigned x=0;x<(1<<vt.size());x++)
				{
					tp[x] = 0;
					for(unsigned y=x;y;y=(y-1)&x)
					{
						tp[x] = (tp[x] + kv[y] * kg[x^y]) % 1000000007;
					}
				}
				for(unsigned x=0;x<(1<<vt.size());x++)
				{
					kg[x] = tp[x];
				}
				pans[cur][j] = kg[(1<<vt.size()) - 1];
			}
		}
	}
	else
#endif
	{
		for(unsigned y = 1; y <= 24; y++)
		{
			for(unsigned x = 1; x <= 24; x++)
			{
				pq[y][x] = qpow(x, y);
			}
		}
		for(int i=1;i<=n;i++)
		{
			if(vis[i]) continue;
			vector<int> vt;
			vector<pair<int, int>> es;
			int cttt = 0;
			U([&](auto &&self, int u) -> void
			{
				vis[u] = true; vt.push_back(u);
				for(int v : web[u])
				{
					cttt++;
					if(u < v) es.push_back({u, v});
					if(!vis[v])
					{
						self(self, v);
					}
				}
			})(i);
			if(vt.size() == 1)
			{
				pc1++;
				continue;
			}
			cur++;
			sz[cur] = vt.size();
			// printf("cur = %d, sz = %d, cttt = %d\n", cur, sz[cur], cttt);
			if(cttt == 2 * sz[cur] - 2)
			{
				pans[cur][0] = 1;
				continue;
			}
			for(int i=0;i<vt.size();i++)
			{
				gid[vt[i]] = i;
			}
			for(auto &[x, y] : es)
			{
				x = gid[x];
				y = gid[y];
			}
			for(int ms=0;ms<(1<<es.size());ms++)
			{
				for(int j=0;j<vt.size();j++)
				{
					ds.fa[j] = j;
					ds.rk[j] = 0;
				}
				int cp = vt.size();
				for(int j=es.size()-1;j>=0;j--)
				{
					if(ms&(1<<j))
					{
						int x = ds.getfa(es[j].first), y = ds.getfa(es[j].second);
						if(ds.merge(x, y)) cp--;
					}
				}
				unsigned long long kv = (__builtin_popcount(ms) & 1) ? 1000000006 : 1;
				for(int j=1;j<=24;j++)
				{
					// if(pq[cp][j] && j == 2) __debugbreak();
					pans[cur][j] = (pans[cur][j] + kv * pq[cp][j]) % 1000000007;
				}
			}
			for(int j=24;j>=1;j--)
			{
				for(int k=1;k<j;k++)
				{
					pans[cur][j] = (pans[cur][j] + (j % 2 == k % 2 ? 1 : 1000000006) * comb(j, k) % 1000000007 * pans[cur][k]) % 1000000007;
				}
			}
			// for(int j=1;j<=24;j++)
			// {
			// 	printf("pans[%d][%d] = %llu\n", cur, j, pans[cur][j]);
			// }
		}
		// fprintf(stderr, "finished.\n");
		fprintf(stderr, "Time: %lu ms\n", chrono::duration_cast<chrono::milliseconds>(chrono::high_resolution_clock::now() - bgn).count());
	}
	for(unsigned i=1;i<=n;i++) rv[i] = qpow(i, 1000000005);
	while(q--)
	{
		int c;
		// scanf("%d", &c);
		c = qread();
		unsigned long long mul = qpow(c, pc1);
		for(int i=1;i<=cur;i++)
		{
			// if(sz[i] == 1) continue;
			if(pans[i][0])
			{
				mul = mul * c % 1000000007 * qpow(c-1, sz[i] - 1) % 1000000007;
				continue;
			}
			unsigned long long sum = 0;
			unsigned long long pvz = 1;
			for(int j=1;j<=sz[i] && j<=c;j++)
			{
				pvz = pvz * (c - j + 1) % 1000000007 * rv[j] % 1000000007;
				// printf("pans[%d][%d] = %llu, comb(%d, %d) = %llu\n", i, j, pans[i][j], c, j, pvz);
				sum += pans[i][j] * pvz % 1000000007;
			}
			mul = mul * (sum % 1000000007) % 1000000007;
		}
		printf("%llu\n", mul);
	}
	fprintf(stderr, "Total time: %lu ms\n", chrono::duration_cast<chrono::milliseconds>(chrono::high_resolution_clock::now() - bgn).count());
	return 0;
}
// 来点私货：不会有哪个审核员要求我加入中文翻译吧。:)

```

:::
