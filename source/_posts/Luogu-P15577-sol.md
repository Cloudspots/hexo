---
title: 题解：P15577 [USACO26FEB] Picking Flowers G
date: 2026-3-13 21:13:17
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
注意到一个事实，如果对于某个目标农场不存在一条在原图上合法的路径，那么再把一个点变成花田也必然不存在合法路径。

同时，进一步地，如果对于某个目标农场存在合法路径，那么把这条路径上的任何一个点变成花田也必然合法。

那么，我们就是要求原图上所有可能的合法路径的并集。

第一遍 BFS，求出距离 $d$。第二遍 01-BFS，求出在 BFS 分层图上，能够经过的最大花田数量 $c$。然后，建一个图，如果两个节点 $u,v$ 满足有 $u$ 和 $v$ 的连边并且满足 $d_u+1=d_v$ 并且 $c_u+[v\text{ is a flower field}]=c_v$（通俗来讲，就是 $u$ 对于 $v$ 的 $c$ 数组有贡献），那么建一条 $v\to u$ 的边。

那么，显然新图中任何一条 $u\to 1$ 的路径，如果满足 $c_u=K$，都一定是原图上的合法路径。并且原图上的合法路径一定会出现在新图上（所有边反转）。为什么要反转？为了便于最后一遍 BFS。

换句话说，新图就是原图的最优路径 BFS 分层图。

最后一次 BFS，以所有存在合法路径的目标农场为起点 BFS。这次 BFS 中经过的所有节点都是答案。

复杂度线性。

:::info[代码&提交记录]

[rec](https://www.luogu.com.cn/record/266688743)。

```cpp
#include <cstdio>
#include <queue>
#include <vector>

using namespace std;

int dist[1000005];
int mxcnt[1000005];
bool istarget[1000005], isflower[1000005];
vector<int> web[1000005];
vector<int> frm[1000005];
bool awa[1000005];

int main()
{
	int t;
	scanf("%d", &t);
	while(t--)
	{
		int n, m, k, l;
		scanf("%d%d%d%d", &n, &m, &k, &l);
		for(int i=1;i<=n;i++)
		{
			web[i].clear(); frm[i].clear();
			istarget[i] = false; isflower[i] = false; awa[i] = false;
			dist[i] = 0x3f3f3f3f; mxcnt[i] = -0x3f3f3f3f;
		}
		dist[1] = 0;
		mxcnt[1] = 0;
		for(int i=1;i<=k;i++)
		{
			int s;
			scanf("%d", &s);
			isflower[s] = true;
		}
		for(int i=1;i<=l;i++)
		{
			int s;
			scanf("%d", &s);
			istarget[s] = true;
		}
		for(int i=1;i<=m;i++)
		{
			int u, v;
			scanf("%d%d", &u, &v);
			web[u].push_back(v);
			web[v].push_back(u);
		}
		queue<int> q;
		q.push(1);
		while(!q.empty())
		{
			int u = q.front();
			q.pop();
			for(int v : web[u])
			{
				if(dist[u] + 1 < dist[v])
				{
					dist[v] = dist[u] + 1;
					q.push(v);
				}
			}
		}
		class _
		{
		public:
			int u;
			int mc;
		};
		deque<_> dq;
		dq.push_back({1, 0});
		while(!dq.empty())
		{
			auto [u, mc] = dq.front();
			dq.pop_front();
			if(mc != mxcnt[u]) continue;
			// printf("mxcnt[%d] = %d\n", u, mc);
			for(int v : web[u])
			{
				if(dist[u] + 1 == dist[v] && mxcnt[u] + int(isflower[v]) > mxcnt[v])
				{
					if(isflower[v])
					{
						mxcnt[v] = mxcnt[u] + 1;
						dq.push_front({v, mxcnt[v]});
					}
					else
					{
						mxcnt[v] = mxcnt[u];
						dq.push_back({v, mxcnt[v]});
					}
				}
			}
		}
		for(int u=1;u<=n;u++)
		{
			for(int v : web[u])
			{
				if(dist[u] + 1 == dist[v] && mxcnt[u] + int(isflower[v]) == mxcnt[v]) frm[v].push_back(u);
			}
		}
		for(int i=1;i<=n;i++)
		{
			if(istarget[i] && mxcnt[i] == k)
			{
				awa[i] = true;
				q.push(i);
			}
		}
		while(!q.empty())
		{
			int u = q.front();
			q.pop();
			for(int v : frm[u])
			{
				if(awa[v]) continue;
				awa[v] = true;
				q.push(v);
			}
		}
		for(int i=2;i<=n;i++)
		{
			printf("%d", awa[i] ? 1 : 0);
		}
		printf("\n");
	}
	return 0;
}
```

:::