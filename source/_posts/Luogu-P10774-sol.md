---
title: 题解：P10774 BZOJ3563 DZY Loves Chinese
date: 2024-7-15 17:26:31
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
~~审题很重要，我们要善于抓住题目中的关键点。~~

关键点在于：

> 为了强制在线，每次的 $\bm k$ 与 $c_1,c_2,\dots,c_k$ 均需异或之前回答为连通的个数。

第一眼看到就是，$k$ 是可以直接通过这一行有几个数得知的，怎么异或都没用。

然后看到，异或的不是其他，正式异或之前回答为连通的个数，设为 $S_i$ 吧，疑惑后的 $k$ 设为 $k_0$。

于是我们有：

$$ k \oplus S_i = k_0 $$

（$\oplus$ 为异或）

通过经验可得，异或的逆运算为异或，但是我就没有这样的经验，怎么办呢？

$$ k \oplus S_i = k_0 $$
$$ k \oplus S_i \oplus k_0 = k_0 \oplus k_0$$
$$ k \oplus k_0 \oplus S_i \oplus S_i= 0 \oplus S_i $$
$$ k \oplus k_0 = S_i $$

而 $k$ 和 $k_0$ 是已知的，所以直接异或就可以求出 $S_i$。

而回来关注 $S_i$ 是什么，是第 $1$ 次到第 $i-1$ 次询问中，答案为 `Connected` 的个数。

如果把 `Connected` 看做 $1$，`Disconnected` 看做 $0$，则 $S_i$ 就是 $1$ 到 $i-1$ 的前缀和。

一个差分就可以搞定。

然而现在还有个问题，我们知道的 $S_i$ 中，$i$ 的最大值是 $Q$，所以我们知道的前缀和的范围只到 $Q-1$，不包括最后一问，所以最后一问我们没办法求出。

但是求一次的时间复杂度是 $O(n+m)$ 的（洪水填充 + 判断），所以可以直接求。

时间复杂度：

- 输入：$O(m)$。
- 处理第 $1$ 到 $Q-1$ 问：$O(Q)$。
- 处理最后一问：$O(n+m)$。
- 总：$O(n+m+Q)$。

### Code：
```cpp
#include <cstdio>
#include <vector>

using namespace std;

vector<pair<int, int>> web[100005];

int funny[100005], c[500005];
bool canuse[500005], vis[100005];

void dfs(int u)
{
	vis[u] = true;
	for (pair<int, int> line : web[u])
	{
		if (canuse[line.second] && !vis[line.first]) dfs(line.first);
	}
}

bool check(int n)
{
	int k = c[0];
	for (int i = 1; i <= k; i++)
	{
		canuse[c[i]] = false;
	}
	dfs(1);
	for (int i = 1; i <= n; i++)
	{
		if (!vis[i]) return false;
	}
	return true;
}

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	for (int i = 1; i <= m; i++)
	{
		int u, v;
		scanf("%d%d", &u, &v);
		web[u].push_back({ v, i });
		web[v].push_back({ u, i });
		canuse[i] = true;
	}
	int q;
	scanf("%d", &q);
	for (int i = 1; i <= q; i++)
	{
		int cnt = 0;
		do
		{
			scanf("%d", c + cnt++);
		} while (getchar() == ' ');
		int k = cnt - 1;
		int k0 = c[0];
		int Si = k ^ k0; //不是硅啊awa
		funny[i - 1] = Si;
		for (int i = 0; i < cnt; i++)
		{
			c[i] ^= Si;
		}
	}
	for (int i = 1; i < q; i++)
	{
		if (funny[i] > funny[i - 1]) printf("Connected\n");
		else printf("Disconnected\n");
	}
	if (check(n)) printf("Connected\n");
	else printf("Disconnected\n");
	return 0;
}
```