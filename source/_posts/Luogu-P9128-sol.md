---
title: 题解：P9128 [USACO23FEB] Fertilizing Pastures G
date: 2026-5-16 15:50:45
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
显然先考虑 $T=0$。

这个“步数最小”没有任何用，只是规定了必须 DFS。

显然考虑如果我们一棵子树拖延了 $1$ 单位时间，那么它的贡献会增加子树内所有节点的权值之和。

DFS 唯一要考虑的就是子节点的遍历顺序。我们考虑最优的遍历顺序，那显然要先考虑一种顺序的权值。

- 首先有子树内部的权值，也就是 $\displaystyle\sum_v f_v$（因为这是树形 dp，显然 $v$ 是指 $u$ 的子节点）。这个是不变的。
- 然后有前面的子树让后面的子树拖延的权值。也就是 $\displaystyle\sum_{i=0}^{\lvert v\rvert-1} (P_{i-1}+2i+1)S_{v_i}$，其中 $P_i=\displaystyle\sum_j^i s_{v_j}$，其中 $s_k$ 是 $k$ 的子树大小的两倍，而 $S_j$ 为 $j$ 的子树权值和。
  - 我们把它拆开。首先，括号里的 $+1$ 直接提出去，变成 $\sum S_v$。然后这个 $2i$ 我们合并到 $P$ 中，令所有 $s$ 加 $2$ 即可。

那就是，我们要最小化 $\displaystyle\sum_{i=0}^{\lvert v\rvert - 1} P_{i-1}S_{v_i}$。

这个看起来很可做，但是瞪一会儿可能没什么头绪。你能够发现，可以看作一项求前面项的贡献，也可以看作前面的项给后面的项提供贡献。同时，**贡献具有局部性**，并且是有规律的。此时可以考虑 Exchange Argument。

我们不妨设这个 $s$ 为 $X$，$S$ 为 $Y$。那么如果我们有两个元素 $(X_1,Y_1)$ 和 $(X_2,Y_2)$，前者放在后者之间则会多出 $X_1Y_2$ 的贡献，否则会多出 $X_2Y_1$ 的贡献。如果前者放在后者之前是最优解，则必然需要满足 $X_1Y_1\le X_2Y_1$，也就是 $\dfrac{X_1}{Y_1}\le \dfrac{X_2}{Y_2}$。

我们按照 $\dfrac{X}{Y}$ 从小到大排序即可。

做完了，时间复杂度 $O(n\log n)$。

接下来考虑 $T=1$。此时只有一条链不会被走，就是从某个叶子节点回到根节点的路径。是哪个叶子节点？显然，是最深的。注意可能有多个。

我们接着考虑 dp 出一个 $g$，满足在总步数最小的情况下，某个节点的子树的最小权值之和。

这个 $g$ 和 $f$ 的转移几乎一样。只是，需要有一个子节点，它包含当前子树中深度最大的叶子，并且它需要最后被遍历。

你光凭直觉都能感觉到，最后遍历一个节点等价于直接在原本的最优顺序中去掉这个节点再加到最后。事实上也是，用 Exchange Argument 依然可以证明。

不能暴力，因为可能有很多都是可能的最后一个节点（最大值不唯一）。但是这些贡献是容易快速计算的，预处理前缀和即可。

注意还需要用被替换节点的 $g$ 代替 $f$。

时间复杂度没变，还是 $O(n\log n)$。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/278005147)。

```cpp
/*
T=0:

考虑如果我拖延了 1 单位时间，则消耗的代价就要加上这个子树内所有权值之和。

转化为如下问题：你有一个二元组序列 (x1, y1), (x2, y2), ..., (xn, yn)，重排之

使得 sum(yi * sumprexi) 最小。

考虑局部调整。

x | a b
y | c d

=> 多出 ad 的贡献。

反过来，多出 bc 的贡献。

所以有 ad <= bc, 换句话说，a/c <= b/d。

按照 x/y 从小到大排序即可。

样例正确。

T=1:

停留在哪个节点 有限制。必须是深度最大的节点。

dp 出【需要回来的代价】和【不需要回来的代价】。
*/
#include <cstdio>
#include <vector>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

int p[200005];
long long a[200005];
vector<int> ch[200005];
unsigned __int128 x[200005], y[200005], dp[200005], dp2[200005];
int dep[200005];

int main()
{
	int n, t;
	scanf("%d%d", &n, &t);
	for(int i=2;i<=n;i++)
	{
		scanf("%d%lld", p + i, a + i);
		ch[p[i]].push_back(i);
	}
	U([&](auto &&self, int u) -> void
	{
		if(ch[u].empty())
		{
			y[u] = a[u];
			dp[u] = dp2[u] = 0;
			return;
		}
		y[u] = a[u];
		int mxdep = 0;
		for(int v : ch[u])
		{
			self(self, v);
			mxdep = max(mxdep, dep[v]);
			x[v] += 2;
			x[u] += x[v];
			y[u] += y[v];
			dp[u] += dp[v] + y[v];
		}
		dep[u] = mxdep + 1;
		sort(ch[u].begin(), ch[u].end(), [&](int a, int b) { return x[a] * y[b] < x[b] * y[a]; });
		vector<unsigned __int128> lsx, rsy; // wait, rsy? It means right sum of y
		for(int i=0;i<ch[u].size();i++)
		{
			// printf("ch[%d][%d] = %d\n", u, i, ch[u][i]);
			dp[u] += (i ? lsx.back() : 0) * y[ch[u][i]];
			lsx.push_back((i ? lsx.back() : 0) + x[ch[u][i]]);
		}
		for(int i=ch[u].size()-1;i>=0;i--)
		{
			rsy.push_back((rsy.empty() ? 0 : rsy.back()) + y[ch[u][i]]);
		}
		reverse(rsy.begin(), rsy.end());
		// 删掉一个点能够造成什么影响？
		// 那当然是，
		// 1) 它自身贡献重新计算 2) 后面所有元素贡献减少 x[i]
		// 没啦！
		dp2[u] = (unsigned __int128)0-1;
		for(int i=0;i<ch[u].size();i++)
		{
			if(dep[ch[u][i]] == mxdep) dp2[u] = min(dp2[u], dp[u] - (i ? lsx[i-1] : 0) * y[ch[u][i]] + (lsx.back() - x[ch[u][i]]) * y[ch[u][i]] - (i == ch[u].size() - 1 ? 0 : rsy[i+1]) * x[ch[u][i]] - dp[ch[u][i]] + dp2[ch[u][i]]);
		}
		// printf("dep[%d] = %d\n", u, dep[u]);
	})(1);
	// printf("%d %llu\n", 2 * n - 2, (unsigned long long)dp[1]);
	// printf("%llu\n", (unsigned long long)dp2[1]);
	if(t == 0) printf("%d %llu\n", 2 * n - 2, (unsigned long long)dp[1]);
	else printf("%d %llu\n", 2 * n - 2 - dep[1], (unsigned long long)dp2[1]);
	return 0;
}
```

:::