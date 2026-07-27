---
title: 题解：SP2666 QTREE4 - Query on a tree IV
date: 2026-5-29 19:33:56
categories:
  - Solution
tags:
  - Solution
  - SPOJ Problem Solution
---
> 我在机房并且忘了 SPOJ 账号密码，但是这份代码可以通过 P4115 Qtree4。等我有时间交到 SPOJ 上看看。

点分树（动态点分治）板子。

既然是动态点分治，我们就先思考静态版本（这个是 P2971 ）。给定一些点怎么做？这个有很多种方法（我在 P2971 用的是虚树）。我们考虑点分治做法。

对于每个分支中心和它的各个子节点的子树，我们统计子树中的点到它的距离的最大值 $v$。两棵子树的 $v$ 加起来取最大值，和所有的 $v$ 的最大值再取最大值（当且仅当分治中心本身可用），就是所有跨越路径的最大值。

那么对于一个节点 $u$，设它的上一层的分治中心（即，$u$ 作为分治中心的那一次递归，它的上一层节点。也就是点分树上它的父亲）为 $f_u$。对于每个 $u$ 维护一个数据结构，维护所有当前可用节点到 $f_u$ 的距离。要求支持插入，删除和查询 $\max$，我们用可删堆（实际上只需要支持禁用，启用和查询启用的最大值，所以这样一个线段树也可以）。设为 $H_u$。

同时，在 $u$ 中另外设一个可删除 $Q_u$。它存储它的所有儿子节点的 $H$ 的最大值。同样需要支持求 $\max$，也需要支持求次大值。这个删除最大值即可。一样，只需要支持单点修改，所以线段树也可以。

一个实现细节是，如果 $u$ 本身可用，则需要在 $Q$ 中插入一个 $0$，否则不用。原因上面已经讲过。

最后设一个全局的可删堆 $K$，保存所有 $Q$ 的最大值和次大值之和的最大值。同样只需要支持单点修改，所以线段树也可以。答案就是 $K$ 的最大值。注意有些情况下 $K$ 的最大值可能为负，所以请对 $0$ 取 $\max$。

最后我们用三组（个）堆 $H,Q,K$ 解决了这个问题。时间复杂度 $O((n+q)\log^2 n)$。膜拜 hqk。

需要一定程度的常数优化。

:::info[rec&code]

是 P4115 的。洛谷交不上。

[rec](https://www.luogu.com.cn/record/279793392)。

```cpp
#include <queue>
#include <bitset>
#include <cstdio>
#include <vector>
#include <utility>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };
class delheap { priority_queue<int> has, del; bool modified = false; int secmax = 0; void maintain() { while(!del.empty() && has.top() == del.top()) { has.pop(); del.pop(); } } public: void insert(int x) { modified = true; has.push(x); } void erase(int x) { modified = true; del.push(x); } int qmax() { maintain(); return has.top(); } int qmps() { int t = qmax(); if(!modified) return t + secmax; modified = false; erase(t); secmax = qmax(); insert(t); return t + secmax; } };
delheap chxs[100005], gmr[100005], gans;
vector<pair<unsigned, int>> web[100005];
unsigned decfa[100005];
bitset<100005> stat;
unsigned dep[100005];
unsigned fa[20][100005];
int fv[20][100005]; // \uparrow

#ifndef __linux__
#define getchar_unlocked _getchar_nolock
#endif

char ibf[50000005];
unsigned li = 0;

int qread()
{
	int ans = 0, fw = 1;
	char ch;
	while((ch = ibf[li++]) < '0' || ch > '9') if(ch == '-') fw = -1;
	do
	{
		ans = ans * 10 + (ch - '0');
	} while((ch = ibf[li++]) >= '0' && ch <= '9');
	return ans * fw;
}
unsigned uqread()
{
	unsigned ans = 0;
	char ch;
	while((ch = ibf[li++]) < '0' || ch > '9');
	do
	{
		ans = ans * 10 + (ch - '0');
	} while((ch = ibf[li++]) >= '0' && ch <= '9');
	return ans;
}

int main()
{
	fread(ibf, 1, sizeof ibf, stdin);
	unsigned n = uqread();
	for(unsigned i=1;i<n;i++)
	{
		unsigned u, v;
		int w;
		u = uqread(); v = uqread(); w = qread();
		web[u].push_back({v, w});
		web[v].push_back({u, w});
	}
	auto cent = [](unsigned rt) -> int
	{
		unsigned tot = 0;
		U([&](auto &&self, unsigned u, unsigned ff) -> void { tot++; for(const auto &[v, w] : web[u]) if(v != ff && !stat[v]) self(self, v, u); })(rt, 0);
		return -U([&](auto &&self, unsigned u, unsigned ff) -> int { unsigned sum = 1, maxn = 0; for(const auto &[v, w] : web[u]) if(v != ff && !stat[v]) { int res = self(self, v, u); if(res < 0) return res; sum += (unsigned)res; maxn = max(maxn, (unsigned)res); } maxn = max(maxn, tot - sum); /*printf("[cent lambda 2] u = %d, sum = %d, maxn = %d\n", u, sum, maxn);*/ if(maxn <= tot / 2) return -u; else return sum; })(rt, 0);
	};
	U([&](auto &&self, unsigned u) -> void
	{
		// printf("fa[%d][%u] = %u, fv[%d][%u] = %d\n", 0, u, fa[0][u], 0, u, fv[0][u]);
		for(unsigned i=1;(1u<<i)<=dep[u];i++)
		{
			fa[i][u] = fa[i-1][fa[i-1][u]];
			fv[i][u] = fv[i-1][u] + fv[i-1][fa[i-1][u]];
			// printf("fa[%d][%u] = %u, fv[%d][%u] = %d\n", i, u, fa[i][u], i, u, fv[i][u]);
		}
		for(const auto &[v, w] : web[u])
		{
			if(v != fa[0][u])
			{
				dep[v] = dep[u] + 1;
				fa[0][v] = u;
				fv[0][v] = w;
				self(self, v);
			}
		}
	})(1);
	auto qsum = [](unsigned u, unsigned v) -> int
	{
		int sum = 0;
		for(int i=16;i>=0;i--)
		{
			if(dep[u] >= dep[v] + (1u << i))
			{
				sum += fv[i][u];
				u = fa[i][u];
			}
			else if(dep[v] >= dep[u] + (1u << i))
			{
				sum += fv[i][v];
				v = fa[i][v];
			}
			if(u == v) break;
		}
		if(u == v) return sum;
		for(int i=16;i>=0;i--)
		{
			if(fa[i][u] != fa[i][v])
			{
				sum += fv[i][u] + fv[i][v];
				u = fa[i][u];
				v = fa[i][v];
			}
		}
		return sum + fv[0][u] + fv[0][v];
	};
	U([&](auto &&self, unsigned u, unsigned ffa) -> unsigned
	{
		u = cent(u);
		// printf("[dfs] u = %d, ffa = %d\n", u, ffa);
		gmr[u].insert(-0x3f3f3f3f);
		if(ffa) U([&](auto &&sel, unsigned x, unsigned ff) -> void { gmr[u].insert(qsum(x, ffa)); for(const auto &[y, w] : web[x]) if(y != ff && !stat[y]) sel(sel, y, x); })(u, 0);
		stat[u] = true;
		chxs[u].insert(-0x3f3f3f3f);
		chxs[u].insert(0);
		for(const auto &[v, w] : web[u])
		{
			if(!stat[v])
			{
				unsigned res = self(self, v, u);
				// decch[u].push_back(res);
				decfa[res] = u;
				chxs[u].insert(gmr[res].qmax());
			}
		}
		// printf("chxs[%u]:    ", u); chxs[u].print(); printf("\n");
		// printf("gmr[%u]:     ", u); gmr[u].print(); printf("\n");
		gans.insert(chxs[u].qmps());
		return u;
	})(1, 0);
	// printf("qsum(4, 2) = %d\n", qsum(4, 2));
	unsigned q = uqread();
	unsigned cnt = n;
	while(q--)
	{
		char op;
		while((op = ibf[li++]) != 'A' && op != 'C');
		// op = getchar_unlocked();
		if(op == 'A')
		{
			if(!cnt) puts("They have disappeared.");
			else printf("%d\n", max(0, gans.qmax()));
		}
		else
		{
			unsigned u;
			u = uqread();
			if(stat[u])
			{
				cnt--;
				unsigned x = u;
				while(x)
				{
					if(decfa[x])
					{
						int yy = chxs[decfa[x]].qmps();
						int xx = gmr[x].qmax();
						gmr[x].erase(qsum(u, decfa[x]));
						if(xx != gmr[x].qmax())
						{
							chxs[decfa[x]].erase(xx);
							chxs[decfa[x]].insert(gmr[x].qmax());
						}
						if(yy != chxs[decfa[x]].qmps())
						{
							gans.erase(yy);
							gans.insert(chxs[decfa[x]].qmps());
						}
					}
					x = decfa[x];
				}
				stat[u] = false;
				int xx = chxs[u].qmps();
				chxs[u].erase(0);
				if(chxs[u].qmps() != xx)
				{
					gans.erase(xx);
					gans.insert(chxs[u].qmps());
				}
			}
			else
			{
				cnt++;
				unsigned x = u;
				while(x)
				{
					if(decfa[x])
					{
						int yy = chxs[decfa[x]].qmps();
						int xx = gmr[x].qmax();
						gmr[x].insert(qsum(u, decfa[x]));
						if(xx != gmr[x].qmax())
						{
							chxs[decfa[x]].erase(xx);
							chxs[decfa[x]].insert(gmr[x].qmax());
						}
						if(yy != chxs[decfa[x]].qmps())
						{
							gans.erase(yy);
							gans.insert(chxs[decfa[x]].qmps());
						}
					}
					x = decfa[x];
				}
				stat[u] = true;
				int xx = chxs[u].qmps();
				chxs[u].insert(0);
				if(chxs[u].qmps() != xx)
				{
					gans.erase(xx);
					gans.insert(chxs[u].qmps());
				}
			}
		}
	}
	return 0;
}
```

:::