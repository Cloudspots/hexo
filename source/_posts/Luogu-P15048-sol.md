---
title: 题解：P15048 [UOI 2022 II Stage] 树 2
date: 2026-10-05 10:44:52
updated: 2026-10-07 21:50:04
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P15048 [UOI 2022 II Stage] 树 2

> 简单题，红！

---

显然答案有单调性。考虑 dp 出最小总代价，查询时二分。设 $f_{i,j,0/1}$ 表示 $i$ 的子树中有 $j$ 个点是白的，$i$ 本身是/不是白的，亮边权值之和最小值。

转移就是树上背包，暴力合并。

关于树上背包的时间复杂度：合并两个背包的复杂度就是其 $\text{size}$ 的乘积。考虑其组合意义，即左边所有点和右边所有点的点对（笛卡尔积）产生 $1$ 的贡献。

注意到所有点对都会产生且仅产生 $1$ 的贡献，具体来讲是在它们的 LCA 处。而若处理第一个子节点时不是继承而是复制也最多对复杂度有 $O(n^2)$ 的贡献。

所以总时间复杂度 $O(n^2+q\log n)$，可以通过。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/301081944)。

```cpp
#include <cstdio>
#include <vector>
#include <cstring>
#include <cassert>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

int tmp[3005][2];
int dp[3005][3005][2];
int sz[3005];
int ax[3005];
vector<pair<int, int>> ch[3005];

int main()
{
	int n, q;
	scanf("%d%d%*d", &n, &q);
	for(int i=2;i<=n;i++)
	{
		int u, v, w;
		scanf("%d%d%d", &u, &v, &w);
		ch[u].push_back({v, w});
		ch[v].push_back({u, w});
	}
	memset(dp, 0x3f, sizeof dp);
	U([&](auto &&self, int u, int fa) -> void
	{
		if(fa) ch[u].erase(find_if(ch[u].begin(), ch[u].end(), [&](const auto &x) { return x.first == fa; }));
		sz[u] = 1;
		int heavy = 0, hval = -1;
		for(auto [v, w] : ch[u])
		{
			self(self, v, u);
			sz[u] += sz[v];
            if(!heavy)
            {
                heavy = v;
                hval = w;
            }
		}
		if(heavy)
		{
			assert(hval > 0);
			dp[u][0][0] = dp[heavy][0][0];
			for(int i=1;i<=sz[heavy] + 1;i++)
			{
				dp[u][i][0] = min(dp[heavy][i][0], dp[heavy][i][1]);
				dp[u][i][1] = min({dp[heavy][i - 1][1] + hval, dp[heavy][i - 1][0], 0x3f3f3f3f});
			}
			sz[u] = sz[heavy] + 1;
			for(auto [v, w] : ch[u])
			{
				if(v == heavy) continue;
				for(int i=0;i<=sz[u]+sz[v];i++) tmp[i][0] = tmp[i][1] = 0x3f3f3f3f;
				for(int i=0;i<=sz[u];i++)
				{
					for(int j=0;j<=sz[v];j++)
					{
						tmp[i+j][0] = min(tmp[i+j][0], dp[u][i][0] + min(dp[v][j][0], dp[v][j][1]));
						tmp[i+j][1] = min({tmp[i+j][1], dp[u][i][1] + dp[v][j][0], dp[u][i][1] + dp[v][j][1] + w});
					}
				}
				for(int i=0;i<=sz[u]+sz[v];i++)
				{
					dp[u][i][0] = tmp[i][0];
					dp[u][i][1] = tmp[i][1];
				}
				sz[u] += sz[v];
			}
		}
		else
		{
			dp[u][0][0] = 0;
			dp[u][1][1] = 0;
		}
	})(1, 0);
	for(int i=0;i<=n;i++)
	{
		// printf("dp[1][%d][0] = %d, dp[1][%d][1] = %d\n", i, dp[1][i][0], i, dp[1][i][1]);
		ax[i] = min(dp[1][i][0], dp[1][i][1]);
	}
	while(q--)
	{
		int x;
		scanf("%d", &x);
		printf("%d ", n - int(upper_bound(ax, ax + n + 1, x) - ax - 1));
	}
	return 0;
}
```

:::
