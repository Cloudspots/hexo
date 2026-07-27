---
title: 题解：P5351 Ruri Loves Maschera
date: 2026-5-27 16:54:13
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
奇怪的全局点对路径问题，考虑点分治。

那么只需要考虑跨越点对。怎么做？

首先考虑经典做法，二叉合并，逐子树考虑（二叉合并写多了也要会写容斥！）。

对于每一个新的子树中的点，假设它到分治中心的距离为 $l$，所有边的边权的 $\max$ 为 $v$，那么它可以和前面的子树中所有距离 $\in [R-l,L-l]$ 的点产生贡献。

这个 $\max$ 不好做。主要是产生的贡献不好统计。考虑分成两部分：小于等于和大于。

这样转化为二维平面就可以是一个单点加法，子矩形求和。树套树。总时间复杂度（算上点分治）$O(n\log^3 n)$，[能过](https://www.luogu.com.cn/article/5y1qjiqt)，但是我们考虑更优做法。

还是这个 $\max$ 麻烦。我们考虑另一种做法：按照 $v$ 从小到大排序，这样新遇到的一个点和前面的点的 $\max$ 一定是这个点的 $v$。

这样一个树状数组处理个数就可以了。单点加法区间求和，非常好。

这个做法有一个问题：一个子树可以和它自己产生贡献。解决方法是显然的，我们用容斥即可，把所有子树内部产生的贡献单独计算，并扣除即可。

时间复杂度 $O(n\log^2n)$，只有一个数据结构：树状数组。

:::info[rec&code]
[rec](https://www.luogu.com.cn/record/279547921)。

代码极其丑陋，看之前请先确保自己不会呕吐。

```cpp
#include <cstdio>
#include <vector>
#include <utility>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };
vector<pair<int, int>> web[100005];
bool forbid[100005];
class fenwick { long long st[100005]; public: void vadd(int pos, int val, int n) { pos++; do { st[pos] += val; } while((pos += pos & -pos) <= n); } long long qsum(int pos) { pos++; long long sum = 0; do { sum += st[pos]; } while(pos -= pos & -pos); return sum; } } fw;

int main()
{
	int n, l, r;
	scanf("%d%d%d", &n, &l, &r);
	for(int i=2;i<=n;i++)
	{
		int u, v, w;
		scanf("%d%d%d", &u, &v, &w);
		web[u].push_back({v, w});
		web[v].push_back({u, w});
	}
	auto cent = [](int rt) -> int
	{
		int tot = 0;
		U([&](auto &&self, int u, int fa) -> void { tot++; for(const auto &[v, w] : web[u]) if(v != fa && !forbid[v]) self(self, v, u); })(rt, 0);
		return -U([&](auto &&self, int u, int fa) -> int { int sum = 1, maxn = 0; for(const auto &[v, w] : web[u]) if(v != fa && !forbid[v]) { int res = self(self, v, u); if(res < 0) return res; sum += res; maxn = max(maxn, res); } maxn = max(maxn, tot - sum); if(maxn <= tot / 2) return -u; else return sum; })(rt, 0);
	};
	auto calc = [l, r](int rt, int vlen, int vmax) -> long long
	{
		// printf("[calc] rt = %d, vlen = %d, vmax = %d\n", rt, vlen, vmax);
		vector<pair<int, int>> vpii;
		U([&](auto &&self, int u, int fa, int len, int maxn) -> void { vpii.push_back({maxn, len}); for(const auto &[v, w] : web[u]) if(v != fa && !forbid[v]) self(self, v, u, len + 1, max(maxn, w)); })(rt, 0, vlen, vmax);
		sort(vpii.begin(), vpii.end());
		long long sum = 0;
		for(const auto &[maxn, len] : vpii)
		{
			if(len <= r) sum += maxn * fw.qsum(r - len);
			if(len <= l - 1) sum -= maxn * fw.qsum(l - len - 1);
			fw.vadd(len, 1, 100000);
		}
		for(const auto &[maxn, len] : vpii)
		{
			fw.vadd(len, -1, 100000);
		}
		return sum;
	};
	printf("%lld\n", U([&](auto &&self, int u) -> long long
	{
		u = cent(u);
		long long sum = calc(u, 0, 0);
		forbid[u] = true;
		for(const auto &[v, w] : web[u])
		{
			if(!forbid[v]) sum -= calc(v, 1, w);
		}
		// printf("u = %d, gets %lld\n", u, sum);
		for(const auto &[v, w] : web[u])
		{
			if(!forbid[v]) sum += self(self, v);
		}
		// forbid[u] = false;
		return sum;
	})(1) * 2);
	return 0;
}
```
:::