---
title: 题解：CF2108E Spruce Dispute
date: 2026-7-7 20:02:50
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
这个，是不是简单题啊。为什么有人调了两个月。

---

首先你要去把 ABC362F 做了。ABC362F 是这题不让你修改的版本。然后这个的结论就是，以重心为根，保证每一条链的两端都在不同的子树中即可。

那么现在再来考虑。

我们不妨先试一下枚举每一条边。我们考虑删除一条边之后重心会有什么变化？

欸，我们发现！如果删除的一端不是重心，那么由于大小只会减少不会增加，而 $\left\lfloor\dfrac{n}{2}\right\rfloor$ 也没有变化（因为 $n$ 是奇数），所以原本的重心还是重心！而如果删除的一端是重心，那么你就会发现一个子树被拆分成了多个子树，大小还顺便减少了 $1$，最终还是重心！

所以，当 $n$ 是奇数的时候，原本的重心无论删除哪条边都还会是重心。

这样就好办了啊！我们直接求出原本的重心，然后看看删掉哪条边……等等，我们删掉哪条？如果我们按照删掉的边的深度更大的一段来代表这条边，那么我们应该删掉那个节点？

由于最终的权值是所有节点的深度之和，所以我们考虑如何尽量让深度之和减少的幅度尽量少。直觉上我们应该删掉叶子，具体地说是深度最小的叶子。证明？假设删掉的节点子树大小为 $S$，深度为 $d$，那么我们减少的幅度就是 $S+d-1$。然后，如果我们删掉的节点不是叶子，那么随便选一个儿子走下去，$d$ 会增加 $1$ 但是 $S$ 至少会 $-1$。$\square$

那么我们先找到重心，然后以重心为根找到深度最小的叶子删除，然后套用 ABC362F 的方法输出方案即可。

:::info[sub&code]

[sub](https://codeforces.com/contest/2108/submission/381477090)。

```cpp
#include <queue>
#include <stack>
#include <bitset>
#include <cstdio>
#include <vector>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

vector<int> ch[200005];
int fa[200005], dep[200005];
stack<int> stk[200005];
int clr[200005];

int main()
{
	int t;
	scanf("%d", &t);
	while(t--)
	{
		int n;
		scanf("%d", &n);
		for(int i=1;i<=n;i++)
		{
			ch[i].clear();
			fa[i] = 0;
			clr[i] = 0;
			dep[i] = 0;
		}
		for(int i=2;i<=n;i++)
		{
			int u, v;
			scanf("%d%d", &u, &v);
			ch[u].push_back(v);
			ch[v].push_back(u);
		}
		int rt = -U([&](auto &&self, int u, int fa = 0) -> int { int sum = 1, maxn = 0; for(int v : ch[u]) if(v != fa) { int res = self(self, v, u); if(res < 0) return res; maxn = max(maxn, res); sum += res; } if(max(maxn, n - sum) <= n / 2) return -u; else return sum; })(1);
		U([&](auto &&self, int u) -> void { if(fa[u]) ch[u].erase(find(ch[u].begin(), ch[u].end(), fa[u])); for(int v : ch[u]) { dep[v] = dep[u] + 1; fa[v] = u; self(self, v); }})(rt);
		int minn = 0x3f3f3f3f, minval;
		for(int i=1;i<=n;i++)
		{
			if(ch[i].empty() && dep[i] < minn)
			{
				minn = dep[i];
				minval = i;
			}
		}
		printf("%d %d\n", fa[minval], minval);
		for(int x : ch[rt]) U([&](auto &&self, int u) -> void { if(u != minval) stk[x].push(u); for(int v : ch[u]) { self(self, v); }})(x);
		priority_queue<pair<int, int>> pq;
		for(int x : ch[rt])
		{
			pq.push({stk[x].size(), x});
			// printf("pq.push({%d, %d})\n", stk[x].size(), x);
		}
		stk[rt].push(rt);
		pq.push({1, rt});
		for(int i=1;i<=n/2;i++)
		{
			int a = pq.top().second;
			pq.pop();
			int b = pq.top().second;
			pq.pop();
			// printf("a = %d, b = %d, stk[%d].size() = %d, stk[%d].size() = %d\n", a, b, a, stk[a].size(), b, stk[b].size());
			clr[stk[a].top()] = clr[stk[b].top()] = i;
			stk[a].pop(); stk[b].pop();
			pq.push({stk[a].size(), a});
			pq.push({stk[b].size(), b});
		}
		if(fa[minval] > minval) swap(clr[minval], clr[fa[minval]]);
		for(int i=1;i<=n;i++)
		{
			printf("%d%c", clr[i], " \n"[i == n]);
		}
	}
	return 0;
}
```

:::