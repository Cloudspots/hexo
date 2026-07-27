---
title: 题解：AT_joi2023ho_d キャットエクササイズ (Cat Exercise)
date: 2026-7-14 15:14:58
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
> ABC435F 是这题第五档部分分。Japanese Copy Japanese!

---

我们先考虑链的情况。嗯……这就是笛卡尔树上里根最远的点，而边权是两个点在原树上的距离。

那么回到原题……树上笛卡尔树（具体来讲，每次找到树上的最大值 $x$，然后删除 $x$ 之后找到分裂出的所有子树的最大值，都连为 $x$ 的子节点；然后对于每个子节点再删除，找到原本的子树分裂出的孙树的最大值，连为子节点，……）。

这个怎么建？你总不能暴力吧？

我们从值域考虑。

从大到小我们知道是不好做的。那从小到大呢？

注意到一个废话：删除一个节点之后，分裂出的所有子树和原本的节点都是相邻的。

虽然这是一句废话，但是当我们从小到大枚举结点的时候就有用了起来。

我们每遇到一个节点 $u$，就枚举其所有邻居 $v$。如果之前遇到过 $v$ 就说明 $P_v<P_u$。此时，把 $v$ 所在的树的根节点设为 $u$ 的子节点即可。

使用并查集维护所有树。最后最慢的是排序，总时间复杂度 $O(n\log n)$。

:::info[sub&code]

[sub](https://atcoder.jp/contests/joi2023ho/submissions/77479896)。

```cpp
#include <cstdio>
#include <vector>
#include <cassert>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

int val[200005];
int fa[25][200005];
int dep[200005];
vector<int> ch[200005];
vector<int> vch[200005];
int vfa[200005];
class ufs
{
public:
	int _fa[200005];
	int _rk[200005];
	int st[200005];
	ufs()
	{
		for(int i=0;i<200005;i++) _fa[i] = st[i] = i;
	}
	int getfa(int x) { while(x != _fa[x]) x = _fa[x] = _fa[_fa[x]]; return x; }
	void merge(int x, int y) { x = getfa(x); y = getfa(y); if(x == y) return; if(_rk[x] < _rk[y]) _fa[x] = y; else if(_rk[y] < _rk[x]) _fa[y] = x; else { _fa[x] = y; _rk[y]++; } }
} uf;

int main()
{
	// freopen("liyunqi.ans", "wb", stderr); // Lucky you!
	int n;
	scanf("%d", &n);
	for(int i=1;i<=n;i++)
	{
		scanf("%d", val + i);
	}
	for(int i=2;i<=n;i++)
	{
		int a, b;
		scanf("%d%d", &a, &b);
		ch[a].push_back(b);
		ch[b].push_back(a);
	}
	U([&](auto &&self, int u) -> void
	{
		// if(fa[u]) ch[u].erase(find(ch[u].begin(), ch[u].end(), fa[u]));
		for(int v : ch[u])
		{
			if(v == fa[0][u]) continue;
			fa[0][v] = u;
			self(self, v);
		}
	})(1);
	vector<int> vt;
	for(int i=1;i<=n;i++) vt.push_back(i);
	sort(vt.begin(), vt.end(), [](int x, int y) { return val[x] < val[y]; });
	for(int x : vt)
	{
		for(int v : ch[x])
		{
			if(val[v] < val[x])
			{
				// printf("%d --\\ %d\n", x, uf.st[uf.getfa(v)]);
				vch[x].push_back(uf.st[uf.getfa(v)]);
				uf.merge(x, v);
				assert(uf.getfa(x) == uf.getfa(v));
				uf.st[uf.getfa(x)] = x;
			}
		}
	}
	long long maxn = 0;
	U([&](auto &&self, int u) -> void
	{
		if(fa[0][u]) ch[u].erase(find(ch[u].begin(), ch[u].end(), fa[0][u]));
		for(int i=1;(1<<i)<=dep[u];i++)
		{
			fa[i][u] = fa[i-1][fa[i-1][u]];
		}
		for(int v : ch[u])
		{
			dep[v] = dep[u] + 1;
			self(self, v);
		}
	})(1);
	auto LCA = [](int x, int y)
	{
		for(int i=20;i>=0;i--)
		{
			if(dep[x] >= dep[y] + (1 << i)) x = fa[i][x];
			if(dep[y] >= dep[x] + (1 << i)) y = fa[i][y];
		}
		for(int i=20;i>=0;i--)
		{
			if(fa[i][x] != fa[i][y])
			{
				x = fa[i][x];
				y = fa[i][y];
			}
		}
		return x == y ? x : fa[0][x];
	};
	auto dist = [LCA](int x, int y) { return dep[x] + dep[y] - 2 * dep[LCA(x, y)]; };
	U([&](auto &&self, int u, long long s) -> void
	{
		maxn = max(maxn, s);
		for(int v : vch[u])
		{
			// printf("%d --- %d\n", u, v);
			self(self, v, s + dist(u, v));
		}
	})(vt.back(), 0);
	printf("%lld\n", maxn);
	return 0;
}
```

:::