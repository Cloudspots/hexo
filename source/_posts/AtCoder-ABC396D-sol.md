---
title: 题解：AT_abc396_d [ABC396D] Minimum XOR Path
date: 2025-3-13 20:27:53
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
抽象的题目。

考虑爆搜。剪枝都不用。

但是我们觉得 DFS 太简单了，所以打算写个 BFS 版本的爆搜。

同样是遍历解答树，只是使用 BFS 序遍历。

注意这里不能用类似 DFS 记忆化的东西，因为就算 $x<y$，也不一定满足 $x \operatorname{xor} z < y \operatorname{xor} z$。

代码：

```cpp
// 草，C 都能写炸
// 不管了，先写 D
// 爆搜显然吧，希望不会掉分。
#include <queue>
#include <tuple>
#include <cstdio>
#include <vector>
#include <utility>
#include <cstring>

using namespace std;

unsigned long long dist[10005][15];
bool vis[10005][15];
vector<pair<int, unsigned long long>> web[15];

int main()
{
	memset(dist, 0x3f, sizeof dist);
	int n, m;
	scanf("%d%d", &n, &m);
	for (int i = 1; i <= m; i++)
	{
		int u, v;
		unsigned long long w;
		scanf("%d%d%llu", &u, &v, &w);
		web[u].push_back({ v, w });
		web[v].push_back({ u, w });
	}
	// 如何 DP？
	// 显然 BFS
	// 类似 SPFA……
	queue<tuple<int, int, unsigned long long>> q;
	q.push({ 1, 1, 0 });
	dist[1][1] = 0;
	unsigned long long maxn = 0xffffffffffffffff;
	while (!q.empty())
	{
		tuple<int, int, unsigned long long> uk = q.front();
		q.pop();
		pair<int, int> u = { get<0>(uk), get<1>(uk) };
		unsigned long long w = get<2>(uk);
		if (u.second == n && w < maxn) maxn = w;
		for (pair<int, unsigned long long> vk : web[u.second])
		{
			if (u.first & (1 << (vk.first - 1))) continue;
			tuple<int, int, unsigned long long> v = { u.first | (1 << (vk.first - 1)), vk.first, w ^ vk.second };
			q.push(v);
		}
	}
	printf("%llu\n", maxn);
	return 0;
}
```