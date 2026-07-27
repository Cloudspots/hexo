---
title: 题解：CF1800G Symmetree
date: 2026-4-22 16:24:52
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
这个，是绿吧，没有任何难点。

---

首先我们需要判断两棵有根树是否同构。

这个树哈希即可。哈希方法：

对于每个节点 $u$，有 $f_u=(c+\sum_{v\in\text{ch}_u} f_v)\oplus k$。$c$ 和 $k$ 是参数，可以随机取（但是要全局相同），所有运算在模 $2^{64}$ 意义下进行。

$O(n)$ 算出来之后，我们需要判断一个节点的子节点中是否只有一个元素不同，其余可以两两配对。注意 P1469 的方案不是通用的。

我们存两个变量 $a,b$，对于每一个哈希值，如果 $a,b$ 中有一个和它相同（空值不和任何值相同），则将相同的置空。否则，如果 $a,b$ 中有空值，则存入。如果没有，那就无解。还是线性的。正确性显然。

单组数据复杂度 $O(n)$。

:::info[sub&code]

[sub](https://codeforces.com/contest/1800/submission/372110279)。

```cpp
/*
简单题吧，哈希一下就行了
*/
#include <cstdio>
#include <random>
#include <vector>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; }; // cute U-combinator!

int fa[200005];
vector<int> ch[200005];
unsigned long long hsh[200005];

int main()
{
	int t;
	scanf("%d", &t);
	mt19937_64 mt(random_device{}());
	while(t--)
	{
		int n;
		scanf("%d", &n);
		for(int i=1;i<=n;i++)
		{
			ch[i].clear();
		}
		for(int i=1;i<n;i++)
		{
			int u, v;
			scanf("%d%d", &u, &v);
			ch[u].push_back(v); ch[v].push_back(u);
		}
		unsigned long long hc = mt(); // HACK ME IF YOU CAN
		unsigned long long hv = mt(); // CHALLENGE ACCEPTED
		auto dfs = U([&](auto &&self, int u, int ff = 0) -> void
		{
			if(ff != 0) ch[u].erase(find(ch[u].begin(), ch[u].end(), ff));
			fa[u] = ff;
			hsh[u] = hc;
			for(int v : ch[u])
			{
				self(self, v, u);
				hsh[u] += hsh[v];
			}
			hsh[u] ^= hv;
			// printf("hsh[%d] = %llu\n", u, hsh[u]);
		});	
		dfs(1);
		// printf("yay\n");
		// return 0;
		int u = 1;
		while(!ch[u].empty())
		{
			sort(ch[u].begin(), ch[u].end(), [](int x, int y) { return hsh[x] < hsh[y]; });
			bool f1 = false, f2 = false;
			unsigned long long v1 = 1, v2 = 1, g1 = 1, g2 = 1;
			for(int i=0;i<ch[u].size();i++)
			{
				if(!f1)
				{
					f1 = true;
					v1 = hsh[ch[u][i]];
					g1 = ch[u][i];
				}
				else if(f1 && v1 == hsh[ch[u][i]]) f1 = false;
				else if(f2 && v2 == hsh[ch[u][i]]) f2 = false;
				else if(!f2)
				{
					f2 = true;
					v2 = hsh[ch[u][i]];
					g2 = ch[u][i];
				}
				else goto fse;
			}
			if(f1 && f2) goto fse;
			if(ch[u].size() % 2) u = (f1 ? g1 : g2);
			else if(f1 || f2) goto fse;
			else break;
		}
		printf("YeS\n");
		continue;
		fse:
		printf("nO\n");
	}
	return 0;
}
```
:::