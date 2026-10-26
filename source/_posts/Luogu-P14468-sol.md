---
title: '题解：P14468 [COCI 2025/2026 #1] 和谐 / Harmonija'
date: 2026-10-10 19:05:32
updated: 2026-10-10 19:05:32
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P14468 [COCI 2025/2026 #1] 和谐 / Harmonija

> 简单题，秒掉了，但是用题解纪念一下我逝去的 rating。

---

暴力就是 dp。设 $f_{i,j}$ 为考虑 $s_{1\dots i}$，红蓝差为 $j$ 的最小代价。$j\in [-2,2]$。

考虑 dp 可以转化为 $(\max,+)$ 矩阵形式。

$$ \begin{bmatrix}+\infty&c_u&+\infty&+\infty&+\infty\\p_u&+\infty&c_u&+\infty&+\infty\\+\infty&p_u&+\infty&c_u&+\infty\\+\infty&+\infty&p_u&+\infty&c_u\\+\infty&+\infty&+\infty&p_u&+\infty\end{bmatrix}\begin{bmatrix}f_{i-1,-2}\\f_{i-1,-1}\\f_{i-1,0}\\f_{i-1,1}\\f_{i-1,2}\end{bmatrix}=\begin{bmatrix}f_{i,-2}\\f_{i,-1}\\f_{i,0}\\f_{i,1}\\f_{i,2}\end{bmatrix}$$

直接倍增或树剖即可。时间复杂度 $O((n+q)\log n)$（树剖可以做到 $O(n+q\log n)$）。带一个 $5^3=125$ 的常数。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/302257257)。

```cpp
/*
T3 <<<<<<<<<<<<<< T2
*/
/*
一眼 (max, +) 矩阵！

等等，是吗？

显然是！

暴力：f_{i,-2~2}

所以

[ -inf c    -inf -inf -inf  [ f_{-2}   = [ f_{-2}
  p    -inf c    -inf -inf    f_{-1}       f_{-1}
  -inf p    -inf c    -inf    f_{0}        f_{0}
  -inf -inf p    -inf c       f_{1}        f_{1}
  -inf -inf -inf p    -inf ]  f_{2}  ]     f_{2}  ]

对对就是这样。

5*5，应该不会炸吧……

来每日倍增一下。
*/
#include <cstdio>
#include <vector>
#include <cstring>
#include <algorithm>
#ifdef LB_IS_TIMING
#include <chrono>
#endif

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

class mp5matrix
{
public:
	long long val[5][5];
	friend mp5matrix operator*(const mp5matrix &x, const mp5matrix &y)
	{
		mp5matrix res;
		memset(&res, -0x3f, sizeof res);
		for(int i=0;i<5;i++)
		{
			for(int k=0;k<5;k++)
			{
				for(int j=0;j<5;j++)
				{
					res.val[i][j] = max(res.val[i][j], x.val[i][k] + y.val[k][j]);
				}
			}
		}
		return res;
	};
} tofa[20][100005], afot[20][100005]; // 763 MB

int c[100005], p[100005];
vector<int> ch[100005];
int fa[20][100005];
int dep[100005];

int main()
{
#ifdef LB_IS_TIMING
	auto bgn = chrono::high_resolution_clock::now();
#endif
	int n, q;
	scanf("%d%d", &n, &q);
	for(int i=1;i<=n;i++)
	{
		scanf("%d", c + i);
	}
	for(int i=1;i<=n;i++)
	{
		scanf("%d", p + i);
	}
	for(int i=2;i<=n;i++)
	{
		int x, y;
		scanf("%d%d", &x, &y);
		ch[x].push_back(y);
		ch[y].push_back(x);
	}
	dep[1] = 1;
	U([&](auto &&self, int u) -> void
	{
		if(fa[0][u]) ch[u].erase(find(ch[u].begin(), ch[u].end(), fa[0][u]));
		mp5matrix vm; memset(&vm, -0x3f, sizeof vm);
		vm.val[0][1] = vm.val[1][2] = vm.val[2][3] = vm.val[3][4] = p[u];
		vm.val[1][0] = vm.val[2][1] = vm.val[3][2] = vm.val[4][3] = c[u];
		tofa[0][u] = afot[0][u] = vm;
		for(int i=1;(1<<i)<=dep[u];i++)
		{
			tofa[i][u] = tofa[i-1][u] * tofa[i-1][fa[i-1][u]];
			afot[i][u] = afot[i-1][fa[i-1][u]] * afot[i-1][u];
			fa[i][u] = fa[i-1][fa[i-1][u]];
		}
		for(int v : ch[u])
		{
			dep[v] = dep[u] + 1;
			fa[0][v] = u;
			self(self, v);
		}
	})(1);
	auto LCA = [](int x, int y) { for(int i=16;i>=0;i--) { if(dep[x] >= dep[y] + (1 << i)) x = fa[i][x]; if(dep[y] >= dep[x] + (1 << i)) y = fa[i][y]; } for(int i=16;i>=0;i--) if(fa[i][x] != fa[i][y]) { x = fa[i][x]; y = fa[i][y]; } return x == y ? x : fa[0][x]; };
	auto multofa = [](int x, int len) { mp5matrix res; memset(&res, -0x3f, sizeof res); res.val[0][0] = res.val[1][1] = res.val[2][2] = res.val[3][3] = res.val[4][4] = 0; if(len == 0) return res; for(int i=16;i>=0;i--) if(len&(1<<i)) { res = res * tofa[i][x]; x = fa[i][x]; } return res; };
	auto mulafto = [](int x, int len) { mp5matrix res; memset(&res, -0x3f, sizeof res); res.val[0][0] = res.val[1][1] = res.val[2][2] = res.val[3][3] = res.val[4][4] = 0; if(len == 0) return res; for(int i=16;i>=0;i--) if(len&(1<<i)) { res = afot[i][x] * res; x = fa[i][x]; } return res; };
	while(q--)
	{
		int u, v;
		scanf("%d%d", &u, &v);
		if(u == v)
		{
			printf("%d\n", max(p[u], c[u]));
			continue;
		}
		int w = LCA(u, v);
		int d1 = dep[u] - dep[w], d2 = dep[v] - dep[w];
		mp5matrix mv = multofa(v, d2) * tofa[0][w] * mulafto(u, d1);
		printf("%lld\n", max({mv.val[0][2], mv.val[1][2], mv.val[2][2], mv.val[3][2], mv.val[4][2]}));
	}
#ifdef LB_IS_TIMING
	fprintf(stderr, "Time: %llu ms\n", chrono::duration_cast<chrono::milliseconds>(chrono::high_resolution_clock::now() - bgn).count());
#endif
	return 0;
}
```

:::
