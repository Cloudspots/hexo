---
title: 题解：P12104 [NERC2024] Managing Cluster
date: 2026-7-14 18:18:02
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
> 模拟赛 T4；LB 的至理名言：简单题，绿！

---

首先最大值是多少肯定是要求的。有一个显然的上界就是最大匹配，感觉十分正确，大胆猜测是正确的（模拟赛需要输出最大值，正确可以拿 $25\%$ 的分，并且给了 checker，赛时还测了一下是对的）。

如何构造方案？

通过手玩几组主要是链的情况发现大致思路：首先从任意一个不满足条件（两边颜色不同）的匹配中的节点对 $(u,v)$ 开始，我们把另一个和 $u$ 相同的节点跟 $v$ 交换，此时 $(u,v)$ 满足了条件。然后，在被交换的匹配（等等，被交换的那个元素必然在一个二元组中吗？待会再考虑这个问题）中，设这个匹配被交换到的元素为 $u'$，另一个为 $v'$，$u'$ 的颜色和 $v$ 原本的颜色相同。把 $v'$ 和跟 $u'$ 颜色相同的节点交换，现在 $(u',v')$ 也满足了条件。然后，再设 $v'$ 是和 $u''$ 发生了交换，于是 $(u'',v'')$ 重复以上操作……做完了！

为什么不会有重复交换：一个节点如果主动发生交换，那么交换完这个二元组就满足条件了，之后显然不会再交换。如果是被交换的，那么我们下一轮就会交换它所在二元组的另一个点，然后这个二元组又满足条件了，所以它仍然不会被重复交换！

那么回收上面的一个问题：如果被交换的节点不在匹配中怎么办？

直接想怎么做其实没什么前途，至少我赛时死磕这个没搞出来，我太菜了（这场按理说四个题都是简单题，为什么连 $300+$ 都没有）。实际上，由于不在匹配中的节点颜色是没有限制的，只是不能交换多次，我们就把所有没在匹配中的节点也两两匹配上，强制一些点颜色相同，这样所有点都在新的匹配当中（只不过新加的点对其实是不相邻的，但是我们无需关心这个），直接套用上面的做法，做完了。

线性。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/285939234)。

```cpp
#include <cstdio>
#include <vector>
#include <cassert>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

int a[200005];
vector<int> web[200005];
int fa[200005];
int minpos[200005];
int dp[200005][2];
int kid[200005];
int ka[100005][2];

int main()
{
	int t;
	scanf("%d", &t);
	while(t--)
	{
		int n;
		scanf("%d", &n);
		for(int i=1;i<=n;i++) ka[i][0] = ka[i][1] = 0;
		n *= 2;
		for(int i=1;i<=n;i++)
		{
			scanf("%d", a + i);
			web[i].clear();
			fa[i] = 0;
			if(ka[a[i]][0] == 0) ka[a[i]][0] = i;
			else ka[a[i]][1] = i;
			kid[i] = 0;
		}
		for(int i=2;i<=n;i++)
		{
			int x, y;
			scanf("%d%d", &x, &y);
			web[x].push_back(y);
			web[y].push_back(x);
		}
		U([&](auto &&self, int u) -> void
		{
			if(fa[u]) web[u].erase(find(web[u].begin(), web[u].end(), fa[u]));
			if(web[u].empty())
			{
				dp[u][0] = 0;
				dp[u][1] = -0x3f3f3f3f;
				return;
			}
			int minn = 0x3f3f3f3f;
			minpos[u] = 0;
			dp[u][0] = dp[u][1] = 0;
			for(int v : web[u])
			{
				fa[v] = u;
				self(self, v);
				dp[u][0] += max(dp[v][0], dp[v][1]);
				if(dp[v][0] >= dp[v][1])
				{
					minn = 0;
					minpos[u] = v;
				}
				else if(dp[v][1] - dp[v][0] < minn)
				{
					minn = dp[v][1] - dp[v][0];
					minpos[u] = v;
				}
			}
			dp[u][1] = dp[u][0] - minn + 1;
		})(1);
		// pair extractor
		vector<pair<int, int>> vpii;
		U([&](auto &&self, int u, int chosen) -> void
		{
			if(!chosen)
			{
				for(int v : web[u])
				{
					self(self, v, dp[v][0] > dp[v][1] ? 0 : 1);
				}
				return;
			}
			vpii.push_back({u, minpos[u]});
			for(int v : web[u])
			{
				self(self, v, dp[v][0] >= dp[v][1] || v == minpos[u] ? 0 : 1);
			}
		})(1, dp[1][0] > dp[1][1] ? 0 : 1);
		for(int i=0;i<(int)vpii.size();i++)
		{
			kid[vpii[i].first] = kid[vpii[i].second] = i + 1;
		}
		vector<int> vp;
		for(int i=1;i<=n;i++) if(!kid[i]) vp.push_back(i);
		for(int i=0;i<vp.size();i+=2) vpii.push_back({vp[i], vp[i+1]});
		for(int i=0;i<(int)vpii.size();i++)
		{
			kid[vpii[i].first] = kid[vpii[i].second] = i + 1;
		}
		// swap(vpii[0], vpii[6]);
		vector<pair<int, int>> ops;
		for(int i=0;i<(int)vpii.size();i++)
		{
			int x = vpii[i].first, y = vpii[i].second;
			// printf("i = %d, (%d, %d)\n", i, x, y);
			while(a[x] != a[y])
			{
				// printf("x = %d, y = %d\n", x, y);
				int z = (x == ka[a[x]][0] ? ka[a[x]][1] : ka[a[x]][0]);
				// printf("has %d, %d\n", y, z);
				ops.push_back({y, z});
				if(z == ka[a[z]][0]) ka[a[z]][0] = y;
				else ka[a[z]][1] = y;
				if(y == ka[a[y]][0]) ka[a[y]][0] = z;
				else ka[a[y]][1] = z;
				swap(a[y], a[z]);
				assert(kid[x]);
				x = z;
				y = (x == vpii[kid[x] - 1].first ? vpii[kid[x] - 1].second : vpii[kid[x] - 1].first);
			}
		}
		printf("%d\n", (int)ops.size());
		for(const auto &[x, y] : ops) printf("%d %d\n", x, y);
	}
	return 0;
}
/*
我三道了

听到没有（没有）

我三道了

yay!!!
*/
```

关于最后几行的注释：唉，不想提了。

:::