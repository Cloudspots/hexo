---
title: 题解：P10439 [JOIST 2024] 逃生路线 2 / Escape Route 2
tags:
  - Solution
  - Luogu P Problem Solution
categories:
  - Solution
date: 2026-07-17 19:22:31
updated: 2026-07-17 19:22:31
---
> 我的读题能力：
> 
> 1. $M=1$？这不是个内向基环森林？
> 2. 原来是个 DAG。
> 3. 原来是条链啊。

---

考虑到暴力是非常显然的，你只需要每次选择到达时间最短的航班即可。

而这个也是好做的，考虑到一条航班的到达时间是确定的，你甚至可以预处理出坐每条航班之后会坐哪条航班（具体来讲，你先单调队列把所有不好的航班踢掉，然后二分/双指针一下即可）。

唯二的问题就是：

1. 出发的时候乘坐哪条航班？注意我们要最小化的是从出发的时刻开始的总时间，而不是从出发那一天开始的总时间。也就是说，乘坐较晚出发的航班也是有可能更优的。
2. 如何加速暴力的过程？就算我们确定了出发时选择的航班，我们也需要求总时间。

我们先解决第二个问题，看起来更好解决。注意到这个过程十分简单并且可以合并，我们就能考虑倍增。做完了。

然后来解决第一个问题。容易想到暴力枚举，这种方法在对应 $M$ 较小的时候是可行的。而 $M$ 较大呢？如果我们能设计出较为快速的方法（比如 $O(N)$），就可以根号平衡了。

我们考虑 $M$ 较大的时候能否 DP。注意到如果我们把节点设进状态里显然是无法转移的，所以我们的状态中只能有边。

那么设 $f_{i,j}$ 为从节点 $i$ 开始到达编号为 $j$ 的边的最小时间。这个是很好 DP 的。

那这样就可以 $O\left(\sum M\right)$ DP 了。设阈值为 $B$，则 DP 总时间复杂度为 $O\left(\dfrac{(\sum M)^2}{B}\right)$，而 $M$ 较小的时候单次时间复杂度是 $O(B\log N)$，总时间复杂度 $O(QB\log N)$。由于 $N,\sum M$ 同阶，所以取 $B=O\left(\dfrac{N}{\sqrt{Q\log N}}\right)$ 得到时间复杂度 $O\left(N\sqrt{Q\log N}\right)$。

同时，空间复杂度为 $O\left(\dfrac{N^2}{B}\right)=O(N\sqrt{Q\log N})$（再次假设 $N,\sum M$ 同阶），可能有些危险。我们考虑离线询问，这样 DP 的空间只有 $O(N)$（但是倍增有 $O(N\log N)$）。

使用分块可以把复杂度平衡到根号。但是我不想写分块（我最近要写很多分块所以我不想多写一个）。

总时间复杂度 $O(Q+N\sqrt{Q\log N}+N\log N)$（看起来很不优雅但是你稍微想想如果 $N,Q$ 不同阶则这里的每一项都不可忽略），空间复杂度 $O(N\log N)$。

到底是谁在卡常，是不是块长算错了把 $\log$ 放根号外面了。我没卡常就过了（还是最优解 rk2）。复杂度不对就不要说卡常了吧，毕竟还有根号不带 $\log$ 做法。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/286953535)。

```cpp
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#include <cmath>
#include <queue>
#include <cstdio>
#include <vector>
#include <utility>
#include <algorithm>

using namespace std;

class arp
{
public:
	int a, b, id, to, tv;
} apt[100005];

vector<arp> lne[100005];
long long rpt[20][100005];
int rto[20][100005];
long long dp[100005];

vector<pair<int, int>> qry[100005];
long long ans[300005];
long long pd[100005];

int main()
{
	int n, t;
	scanf("%d%d", &n, &t);
	int cur = 0;
	for(int i=1;i<n;i++)
	{
		int m;
		scanf("%d", &m);
		while(m--)
		{
			int a, b;
			scanf("%d%d", &a, &b);
			lne[i].push_back({a, b});
		}
		sort(lne[i].begin(), lne[i].end(), [](const auto &x, const auto &y) { return x.a < y.a; });
		deque<pair<int, int>> zq;
		for(const auto &[x, y, _, __, ___] : lne[i])
		{
			while(!zq.empty() && y <= zq.back().second) zq.pop_back();
			zq.push_back({x, y});
		}
		lne[i].clear();
		for(const auto &[x, y] : zq)
		{
			arp g = {x, y, ++cur};
			lne[i].push_back(apt[cur] = g);
		}
	}
	// link
	for(int i=1;i+1<n;i++)
	{
		for(auto &[a, b, _, vt, v] : lne[i])
		{
			auto it = lower_bound(lne[i+1].begin(), lne[i+1].end(), arp{b}, [](const auto &x, const auto &y) { return x.a < y.a; });
			if(it == lne[i+1].end())
			{
				vt = lne[i+1][0].id;
				v = 0;
			}
			else
			{
				vt = it->id;
				v = int(it - lne[i+1].begin());
			}
			apt[_] = {a, b, _, vt, v};
		}
	}
	// binary lifting
	auto gvt = [t](int a, int b) { return a <= b ? b - a : b + t - a; };
	for(int i=0;i<=16;i++)
	{
		if(i == 0)
		{
			for(int j=1;j<=cur;j++)
			{
				rpt[0][j] = gvt(apt[j].b, apt[apt[j].to].a) + apt[j].b - apt[j].a;
				rto[0][j] = apt[j].to;
			}
		}
		else
		{
			for(int j=1;j<=cur;j++)
			{
				if((rto[i][j] = rto[i-1][rto[i-1][j]])) // SYSCALL G++ DISABLE WARNING ON P10439.吹泡泡 LINE #84
				{
					rpt[i][j] = rpt[i-1][j] + rpt[i-1][rto[i-1][j]];
				}
			}
		}
	}
	auto wt = [](int id, int st) -> pair<int, long long>
	{
		long long sum = 0;
		for(int i=0;i<=16;i++)
		{
			if(st&(1<<i))
			{
				sum += rpt[i][id];
				id = rto[i][id];
			}
		}
		return {id, sum};
	};
	int q;
	scanf("%d", &q);
	int b = int(1.0 * (n / sqrt(q * log(n) / log(2)) + 0.5));
	for(int i=1;i<=q;i++)
	{
		int x, y;
		scanf("%d%d", &x, &y);
		qry[x].push_back({y, i});
	}
	for(int i=1;i<n;i++)
	{
		if(lne[i].size() <= b) // brute force
		{
			for(const auto &[j, id] : qry[i])
			{
				ans[id] = 0x3f3f3f3f3f3f3f3f;
				for(int _pi=0;_pi<lne[i].size();_pi++)
				{
					int pi = lne[i][_pi].id;
					auto [x, y] = wt(pi, j - i - 1);
					ans[id] = min(ans[id], y + apt[x].b - apt[x].a);
				}
			}
		}
		else
		{
			for(int j=1;j<=cur;j++) dp[j] = 0x3f3f3f3f3f3f3f3f;
			for(int _j=0;_j<lne[i].size();_j++)
			{
				dp[lne[i][_j].id] = lne[i][_j].b - lne[i][_j].a;
			}
			for(int j=i;j<n;j++)
			{
				pd[j+1] = 0x3f3f3f3f3f3f3f3f;
				for(int _k=0;_k<lne[j].size();_k++)
				{
					pd[j+1] = min(pd[j+1], dp[lne[j][_k].id]);
					if(lne[j][_k].to) dp[lne[j][_k].to] = min(dp[lne[j][_k].to], dp[lne[j][_k].id] + gvt(lne[j][_k].b, apt[lne[j][_k].to].a) + apt[lne[j][_k].to].b - apt[lne[j][_k].to].a);
				}
				// printf("i = %d, pd[%d] = %lld\n", i, j + 1, pd[j+1]);
			}
			for(const auto &[j, id] : qry[i]) ans[id] = pd[j];
		}
	}
	for(int i=1;i<=q;i++)
	{
		printf("%lld\n", ans[i]);
	}
	return 0;
}
```

:::
