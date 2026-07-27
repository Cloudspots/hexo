---
title: 题解：CF274D Lovely Matrix
date: 2025-4-13 12:54:41
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
看到从小到大，考虑拓扑排序。

节点代表什么？位置。具体来讲，编号为 $i$ 的节点在位置 $j$，说明第 $i$ 列原本在第 $j$ 的位置。

比如 `2 5 4` 这一行，原本的排列是 `2 4 5`，节点排列就是 `1 3 2`。

考虑如何建图。显然我们需要根据节点的小于关系建图。

设 $a$ 为矩阵的一行。若 $a_i < a_j$，则说明第 $i$ 列在原矩阵中必须排在第 $j$ 列之前，即从 $i$ 向 $j$ 连有向边（等于关系不连边，无法保证位置关系）。

这样随随便便就能够把一行的边数卡到 $\Theta(m^2)$（所有值都不同即可）。显然不行（总边数为 $\Theta(nm^2)$）。

考虑优化。我们发现，若存在 $a \to b$ 和 $b \to c$ 的边，则我们也会连上 $a \to c$ 的边，这是多余的。所以，我们可以只连上“相邻”的值，即在原本连边的方法中，加入限制条件“不存在 $a_k$ 满足 $a_i < a_k < a_j$”。

这样随随便便就能够把一行的边数卡到 $\Theta(n^2)$（比如 `1 1 1 1 1 ... 1 2 2 2 2 2 ... 2`）。显然不行。

考虑优化。我们发现建图的时候，相邻两**种**不同节点连上了完全二分图，具体地，若 $a_i$ 和 $a_j$ 有连边，则所有满足 $a_i=a_x$ 和 $a_j=a_y$ 的 $x$ 和 $y$ 都会有连边，形成完全二分图。

> 图的结构很像 MLP。或者说，好像就是 MLP？

如何优化？使用虚拟节点即可。这是完全二分图优化建图的经典技巧。比如从集合 $U$ 中的所有节点都向 $V$ 中的所有节点连边，则新建虚拟节点 $\omega$，把 $U$ 中所有节点向 $\omega$ 连边，然后把 $\omega$ 向 $V$ 中的所有节点连边即可。

最后求出的拓扑序列中去除掉 $w$ 即可。

这只是一行。但是如果有多列，则也非常简单，只需要把图的边合并即可。每次加边都只需要在同一个图上加（虚拟节点除外）。

时间复杂度看上去是 $\mathcal O(nm)$，但是别忘了我们建图的时候对于每一行都需要把所有元素排序分段，排序操作是带一只 $\log$ 的，所以总时间复杂度是 $\mathcal O(nm \log m)$。

代码不长，我只写了【蒜薢的月考成绩】行。

```cpp
#include <stack>
#include <cstdio>
#include <vector>
#include <algorithm>

using namespace std;

class node
{
public:
	int num, id;
} arr[100005];
// 1~m for real nodes(columns), m+1~/ for virtual nodes.
// There are at most m virtual nodes in a column.
// We knew that 1+1=3, so the size of the array is 300005.
vector<int> web[300005];
int ind[300005];

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	int vIa = m;
	for (int i = 1; i <= n; i++)
	{
		int cur = 0;
		for (int j = 1; j <= m; j++)
		{
			scanf("%d", &arr[++cur].num);
			arr[cur].id = j;
			if (arr[cur].num == -1) cur--;
		}
		sort(arr + 1, arr + cur + 1, [](const auto& x, const auto& y) { return x.num < y.num; });
		vector<vector<int>> vv;
		int qwq = -1;
		for (int j = 1; j <= cur; j++)
		{
			auto v = arr[j];
			if (v.num == qwq) vv.back().push_back(v.id);
			else vv.push_back({ v.id });
			qwq = v.num;
		}
		// keai
		for (int j = 0; j + 1 < vv.size(); j++)
		{
			int id = ++vIa;
			for (int v : vv[j])
			{
				web[v].push_back(id);
				ind[id]++;
				// printf("%d -> %d\n", v, id);
			}
			for (int v : vv[j + 1])
			{
				web[id].push_back(v);
				ind[v]++;
				// printf("%d -> %d\n", id, v);
			}
		}
	}
	stack<int> q; // 可爱
	for (int i = 1; i <= vIa; i++)
	{
		if (ind[i] == 0) q.push(i);
	}
	vector<int> ans;
	while (!q.empty())
	{
		int u = q.top();
		q.pop();
		ans.push_back(u);
		for (int v : web[u])
		{
			if (!--ind[v]) q.push(v);
		}
	}
	if (ans.size() != vIa) printf("-1\n");
	else for (int v : ans)
	{
		if(v <= m) printf("%d ", v);
	}
	return 0;
}
```