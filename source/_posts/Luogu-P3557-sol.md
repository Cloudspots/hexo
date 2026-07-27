---
title: 题解：P3557 [POI 2013] GRA-Tower Defense Game
date: 2025-8-18 15:30:54
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
> 给定一个图，选定不多于 $k$ 个点，使得图中每个点都离某一个选定的点距离不多于 $\bm 2$。无需最小化选点数量。
>
> 保证可以选定不多于 $k$ 个点，使得图中每个点都离某一个选定的点距离不多于 $\bm 1$。

:::warning[这是错误做法]

既然有了后面的保证，那么就考虑后面那个题怎么做？

> 省流：NP 完全的，目前没有发现多项式时间做法。实际上如果你找到了多项式复杂度做法，或者证明了不存在，那么快去领图灵奖吧！

好消息，这个问题是一个经典的问题。坏消息：

![](pVBPTJA.png)

当然，如果你不相信 AI，那么[百度百科](https://baike.baidu.com/item/%E6%94%AF%E9%85%8D%E9%9B%86)：

![](pVBPOL8.png)

:::

那么我们就需要使用下面的条件了。大胆贪心！每次选出一个没有满足条件的点，选择这个点！

这对吗？这能过，实现方法后面讲。这真的对吗？

考虑证明。不妨设我们的解的点集为 $A$，而条件中的问题的答案为 $B$。根据定义，对于任意一个不在 $B$ 中的，邻居中都至少有一个 $B$ 中的点。所以，对于每个 $B$ 中的点，我们都能找到最多一个 $A$ 中的点与之对应（就是相邻点或者自身，唯一性是因为两个 $A$ 中的点距离必然至少为 $3$），所以 $\lvert A\rvert \le \lvert B\rvert \le k$。证毕！

:::info[实现方法]{open}
DFS。从小到大枚举每个点，如果没有被标记过则 dfs（不考虑标记，考虑标记正确性就不对了）将所有与其距离不多于 $2$ 的点标记上并将自身加入答案中。

看起来一个菊花图就能卡掉是吧！实际上菊花图上选任意一个节点都可以完成。你是卡不掉的。

时间复杂度证明就是，每个点最多和被选中的点相邻一次，也就是只会被遍历一次所有邻居，总时间复杂度就是度数之和 $\mathcal O(m)$，加上枚举所有点的复杂度 $\mathcal O(n)$。
:::

:::success[代码&提交记录]
Fun fact：代码和 $k$ 没有关系。

```cpp
#include <cstdio>
#include <vector>

using namespace std;

vector<int> web[500005];

bool vis[500005];

void dfs(int u, int d = 0) // d = depth = 深度
{
	vis[u] = true;
	if (d == 2) return;
	for (int v : web[u])
	{
		dfs(v, d + 1);
	}
}

int main()
{
	int n, m;
	scanf("%d%d%*d", &n, &m); // 冷门小技巧：%*d 可以跳过一个数字，%*c %*s 等同理
	for (int i = 1; i <= m; i++)
	{
		int x, y;
		scanf("%d%d", &x, &y);
		web[x].push_back(y);
		web[y].push_back(x);
	}
	vector<int> ans;
	for (int i = 1; i <= n; i++)
	{
		if (!vis[i])
		{
			ans.push_back(i);
			dfs(i);
		}
	}
	printf("%d\n", ans.size());
	for (int i : ans)
	{
		printf("%d ", i);
	}
	return 0;
}
```

[record](https://www.luogu.com.cn/record/231683098)。
:::