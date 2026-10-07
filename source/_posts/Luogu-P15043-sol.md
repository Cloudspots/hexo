---
title: 题解：P15043 [UOI 2022 II Stage] 图
date: 2026-10-05 10:11:39
updated: 2026-10-07 21:52:52
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P15043 [UOI 2022 II Stage] 图

简单题。

考虑到这是一棵基环树。

首先考虑树内的贡献，此时是（带权）直径，dp 一下就可以解决。

考虑跨树贡献。

显然假设两棵树分别为 $T_1,T_2$，根节点（在环上的点）分别为 $r_1,r_2$，那么就是 $T_1$ 中到 $r_1$ 的最远距离，$T_2$ 中到 $r_2$ 的最远距离和 $r_1,r_2$ 在环上的最短距离三者之和。

每一棵树的到根最远距离是好求的。对于环，考虑将环复制粘贴一份，断环成链。距离用前缀和算，为了保证是环上最短距离，距离不能大于环上边权之和的一半。

写出式子 $s_r-s_l+v_r+v_l$，$v$ 到根是最远距离。我们枚举 $r$，此时 $l$ 有一个生效区间，也即这是滑动窗口中 $v_l-s_l$ 的最大值。单调队列即可。

时间复杂度 $O(n)$。

:::info[rec&code]

激情卡常后抢到最优解。卡常后能跑到 $<200\mathrm{ms}$。下面是没有卡常的代码&提交记录。

[rec](https://www.luogu.com.cn/record/300850882)。

```cpp
// 给定一个基环树，求最短路最大值
#include <queue>
#include <cstdio>
#include <vector>
#include <bitset>
#include <cassert>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };
vector<pair<int, int>> web[200005];
bitset<200005> vis;
bitset<200005> sky;
long long val[200005];
long long psum[400005];

int main()
{
	int n;
	scanf("%d%*d", &n);
	for(int i=1;i<=n;i++)
	{
		int u, v, w;
		scanf("%d%d%d", &u, &v, &w);
		web[u].push_back({v, w});
		web[v].push_back({u, w});
	}
	vector<pair<int, int>> pth, cyc;
	bool _res = U([&](auto &&self, int u, int fa) -> bool
	{
		vis[u] = true;
		sky[u] = true;
		// pth.push_back(u);
		for(auto [v, w] : web[u])
		{
			if(vis[v])
			{
				if(sky[v] && v != fa)
				{
					cyc.push_back({u, w});
					do
					{
						cyc.push_back(pth.back());
						pth.pop_back();
					} while(pth.back().first != v);
					cyc.push_back(pth.back());
					return true;
				}
			}
			else
			{
				pth.push_back({u, w});
				if(self(self, v, u)) return true;
				pth.pop_back();
			}
		}
		sky[u] = false;
		return false;
	})(1, 0);
	reverse(cyc.begin(), cyc.end());
	assert(_res);
	// printf("cyc: "); for(auto [x, w] : cyc) printf("%d ", x); printf("\n");
	sky.reset();
	for(auto [x, _] : cyc) sky[x] = true;
	vis.reset();
	auto longest = U([&](auto &&self, int u, int fa = 0) -> long long { long long maxn = 0; for(auto [v, w] : web[u]) if(!sky[v] && v != fa) maxn = max(maxn, self(self, v, u) + w); return maxn; });
	long long maxn = 0, vsum = 0;
	for(auto [x, w] : cyc)
	{
		vsum += w;
		val[x] = longest(x);
		maxn = max(maxn, U([&](auto &&self, int u, int fa) -> pair<long long, long long> { long long mx = 1, vlen = 0, vlen2 = 0; for(auto [v, w] : web[u]) if(!sky[v] && v != fa) { auto res = self(self, v, u); mx = max(mx, res.first); res.second += w; if(res.second > vlen) { vlen2 = vlen; vlen = res.second; } else if(res.second > vlen2) vlen2 = res.second; } mx = max(mx, vlen + vlen2); return {mx, vlen}; })(x, 0).first);
		// printf("val[%d] = %lld\n", x, val[x]);
	}
	vector<pair<int, int>> cys = cyc;
	for(auto x : cyc) cys.push_back(x);
	deque<int> q;
	for(int i=0;i<cys.size();i++)
	{
		if(i) psum[i] = psum[i-1] + cys[i-1].second;
		while(!q.empty() && psum[i] - psum[q.front()] > vsum / 2) q.pop_front();
		if(!q.empty())
		{
			maxn = max(maxn, val[cys[i].first] + val[cys[q.front()].first] + psum[i] - psum[q.front()]);
			// printf("i = %d, get %lld\n", i, val[cys[i].first] + val[cys[q.front()].first] + psum[i] - psum[q.front()]);
		}
		while(!q.empty() && val[cys[q.back()].first] - psum[q.back()] <= val[cys[i].first] - psum[i]) q.pop_back();
		q.push_back(i);
	}
	printf("%lld\n", maxn);
	return 0;
}
// 诅咒发力：
// 无法在 40min 内通过 T1
// 今日战绩
// 1h 通过 T1
// :(
```

:::
