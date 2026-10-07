---
title: 题解：P17270 [eJOI 2026] Increasing Split
date: 2026-10-05 10:33:19
updated: 2026-10-07 21:52:09
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P17270 [eJOI 2026] Increasing Split

考虑若 $i<j,a_i\ge a_j$，则 $i,j$ 不能被同一个人选。

同时容易发现这是充要条件。

那么首先，若 $i<j<k,a_i\ge a_j\ge a_k$ 则无解（判断是容易的，枚举 $j$）。同时，直接连边的边数就是 $O(n^2)$ 的，会炸。不妨枚举 $j$，设严格前缀最大值构成数组 $s$，则每次是一个点给 $s$ 中的一个区间连边。

这是好做的，我们只需要给 $s$ 区间内连表示相同的边，然后随便找一个区间内的点连上表示不同的边即可。而 $s$ 中所有区间取并集再连边。这样就可以拥有 $O(n)$ 条边（但是同时拥有了表示相同和表示不同的边）。

考虑染色。对于每一个连通块，考虑两种颜色点数分别为 $x,y$，那么相当于 Boris 在这个连通块中可以拿到 $x$ 或 $y$ 个点。这是背包。不妨 $x<y$，那么先给它 $x$ 个点，然后可以自由选择要不要 $y-x$ 个点。

考虑这个背包模型是，$0-1$ 背包，同时重量总和不超过 $n$，换句话说重量种类数为 $O(\sqrt n)$。直接二进制分组多重背包加 `bitset` 可以做到 $O\left(\dfrac{n\sqrt n\log n}{\omega}\right)$。

考虑二进制分组时分出来的重量比原重量大的继续参与后续二进制分组，就得到了一种种类数同样为 $O(\sqrt n)$，但是每种物品不超过两个的等价背包模型。换句话说只有 $O(\sqrt n)$ 个物品。直接暴力做到 $O\left(\dfrac{n\sqrt n}\omega\right)$，可以通过。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/300759626)。

```cpp
#include <vector>
#include <bitset>
#include <cassert>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

vector<pair<int, bool>> web[400005];
int vmin[400005];
int a[400005];
int lval[400005];
int ps[400005];
int cnt[400005];
bitset<400005> vis;

vector<bool> increasing_split(vector<int> _a)
{
	int n = _a.size();
	for(int i=1;i<=n;i++) a[i] = _a[i-1];
	vmin[n+1] = 0x3f3f3f3f;
	for(int i=n;i>=1;i--) vmin[i] = min(a[i], vmin[i+1]);
	int vmax = a[1];
	int cur = 0;
	lval[++cur] = 1;
	for(int i=2;i<=n;i++)
	{
		if(a[i] <= vmax && a[i] >= vmin[i+1]) return vector<bool>(n+1, false);
		if(a[i] > vmax)
		{
			vmax = a[i];
			lval[++cur] = i;
		}
	}
	int pc = 0, rv = 0;
	for(int i=1;i<=n;i++)
	{
		while(rv < cur && lval[rv + 1] <= i) rv++;
		if(lval[rv] == i) continue;
		while(pc <= cur && a[lval[pc]] < a[i]) pc++;
		assert(pc <= rv);
		web[i].push_back({lval[rv], 1});
		web[lval[rv]].push_back({i, 1});
		ps[pc]++; ps[rv]--;
		// printf("%d -> [%d, %d]\n", i, lval[pc], lval[rv]);
	}
	for(int i=1;i<=cur;i++) ps[i] += ps[i-1];
	for(int i=1;i<cur;i++)
	{
		if(ps[i])
		{
			web[lval[i]].push_back({lval[i+1], 0});
			web[lval[i+1]].push_back({lval[i], 0});
		}
	}
	int off = 0;
	for(int i=1;i<=n;i++)
	{
		if(!vis[i])
		{
			auto [x0, x1] = U([&](auto &&self, int u) -> pair<int, int> { int s0 = 1, s1 = 0; vis[u] = true; for(auto [v, w] : web[u]) if(!vis[v]) { auto res = self(self, v); if(w) { s0 += res.second; s1 += res.first; } else { s0 += res.first; s1 += res.second; } } return {s0, s1}; })(i);
			// printf("i = %d, x0 = %d, x1 = %d\n", i, x0, x1);
			cnt[abs(x0 - x1)]++;
			off += min(x0, x1);
		}
	}
	bitset<400005> bs;
	bs[0] = 1;
	for(int i=1;i<=n;i++)
	{
		if(cnt[i] > 2)
		{
			int ci = cnt[i];
			cnt[i] = 0;
			int vj=1;
			while(true)
			{
				if(2*vj > ci)
				{
					// if(2 * vj > ci + 1)
					// {
						// printf("split to: %d\n", ci - vj + 1);
						cnt[i*(ci-vj+1)]++;
					// }
					break;
				}
				// printf("pslit to: %d\n", vj);
				cnt[i*vj]++;
				vj *= 2;
			}
		}
		// printf("cnt[%d] = %d\n", i, cnt[i]);
		while(cnt[i]--)
		{
			bs |= (bs << i);
		}
	}
	// printf("off = %d\n", off);
	vector<bool> res(n+1, false);
	for(int i=off;i<=n;i++)
	{
		res[i] = bs[i-off];
	}
	return res;
}
```

:::
