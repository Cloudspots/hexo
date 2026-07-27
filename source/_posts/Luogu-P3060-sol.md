---
title: 题解：P3060 [USACO12NOV] Balanced Trees G
date: 2026-5-30 11:37:44
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
奇怪的全局点对信息，甚至无根，信息看起来就很可以拼接，点分治。

我们考虑两个字符串拼起来拼成一个合法括号序列，同时求出它的深度。并且，第一个字符串还是从后往前获取的。

我们先解决第一个字符串，看起来更加困难。这个应该比较经典，这里手推一边。

考虑转化为折线。要求这条线始终不位于 $x$ 轴之下。

那么既然我们是从右往左获取的，我们就向下平移，使右端点贴到 $x$ 轴上。此时，左端点不会位于 $x$ 轴上方（因为平移之前在 $x$ 轴上）。

我们不妨设一个虚拟的 $x$ 轴，称之为 $x'$。它平移之前和 $x$ 轴重合，但是平移的时候和折线一起平移。那么我们平移之后的条件还是，整条折线都不位于 $x'$ 下方。

考虑这个 $x'$ 的 $y$ 坐标。它就是平移之后的折线的左端点的 $y$ 坐标。

换句话说，设 $k$ 为平移之后的折线的左端点的 $y$ 坐标，$m$ 为平移之后的折线的所有点的 $y$ 坐标的最小值，那么要求 $m\ge k$（其实 $m\le k$ 是必然的，所以也就等价于 $m=k$）。

这些都是好处理的。

同时对于实现，由于我们从右往左获知字符串，所以折线的所有上/下都要取反（因为左右取反了）。当然我们也可以不取反，而是把 $m$ 定义为最大值。我就没有取反。

这还没完。我们还需要统计最大深度。这个比较简单，你考虑一下这个折线，那就是所有的 $y$ 的最大值，再减去最左边的点的 $y$ 坐标。

说起来复杂，其实很简单。核心就是这几个式子：

- 设 $c_1,c_2,\dots,c_k$ 为整个括号序列的逆序串的权值，如果为 $\texttt ($ 则 $1$，否则为 $-1$。
- 设 $S_i=\displaystyle\sum_{j=0}^i c_j$，$S_0=0$。
- 设 $M=\max S,m=\min S$。
- 如果 $S_k=M$，则这个串可以作为合法括号序列的前缀，否则不行。
- $S_k-m$ 为最大深度。当然，仅当 $S_k=M$ 时有效，所以就是 $M-m$

而对于右边的正向统计，这个就非常简单了。略去。

那么正式开始点分治！对于每个子节点，先统计这个子节点对于前面节点的答案，然后插入之。用一个数组或哈希表存储，对于每个可能的最终深度（指 $S_k$），其最大深度的最大值即可。

但也有可能后面的到前面的，所以对于子节点列表逆序再来一遍。注意清空。

用数组的话时间复杂度 $O(n\log n)$。我用的哈希表，但是因为值域太小（$\le n$）所以应该卡不了。

:::info[rec&code]
[rec](https://www.luogu.com.cn/record/279871269)。

```cpp
#include <stack>
#include <queue>
#include <cstdio>
#include <vector>
#include <utility>
#include <algorithm>
#include <unordered_map>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };
vector<int> web[40005];
int val[40005];
bool forbids[40005];

int main()
{
	int n;
	scanf("%d", &n);
	for(int i=2;i<=n;i++)
	{
		int x;
		scanf("%d", &x);
		web[i].push_back(x);
		web[x].push_back(i);
	}
	for(int i=1;i<=n;i++)
	{
		while(getchar() != '\n');
		val[i] = (getchar() == '(' ? 1 : -1);
	}
	auto cent = [](int rt) -> int
	{
		int tot = 0;
		U([&](auto &&self, int u, int ff) -> void { tot++; for(int v : web[u]) if(v != ff && !forbids[v]) self(self, v, u); })(rt, 0);
		return -U([&](auto &&self, int u, int ff) -> int { int sum = 1, maxn = 0; for(int v : web[u]) if(v != ff && !forbids[v]) { int res = self(self, v, u); if(res < 0) return res; sum += res; maxn = max(maxn, res); } maxn = max(maxn, tot - sum); if(maxn <= tot / 2) return -u; else return sum; })(rt, 0);
	};
	unordered_map<int, int> um;
	auto vins = U([&](auto &&self, int u, int vim, int maxn, int minn, int fa) -> void { vim += val[u]; maxn = max(maxn, vim); minn = min(minn, vim); if(vim == maxn) { /*printf("[vins] u = %d, um[%d] <--- %d\n", u, vim, vim-minn);*/ um[vim] = max(um[vim], vim-minn); } for(int v : web[u]) if(v != fa && !forbids[v]) self(self, v, vim, maxn, minn, u); });
	auto vuqa = U([&](auto &&self, int u, int vim, int maxn, int fa) -> long long { vim += val[u]; maxn = max(maxn, vim); /*printf("[vuqa] u = %d, vim = %d, maxn = %d\n", u, vim, maxn);*/ long long ans = 0; if(um.count(-vim)) ans = max(um[-vim], maxn - vim); for(int v : web[u]) if(v != fa && !forbids[v]) ans = max(ans, self(self, v, vim, maxn, u)); return ans; });
	printf("%lld\n", U([&](auto &&self, int u) -> long long
	{
		u = cent(u);
		long long maxn = 0;
		forbids[u] = true;
		// printf("u = %d\n", u);
		for(int v : web[u])
		{
			if(forbids[v]) continue;
			// printf("v = %d, gets %lld\n", v, vuqa(v, 0, 0, u));
			maxn = max(maxn, vuqa(v, 0, 0, u));
			vins(v, val[u], max(0, val[u]), min(0, val[u]), u);
		}
		um.clear();
		reverse(web[u].begin(), web[u].end());
		for(int v : web[u])
		{
			if(forbids[v]) continue;
			maxn = max(maxn, vuqa(v, 0, 0, u));
			vins(v, val[u], max(0, val[u]), min(0, val[u]), u);
		}
		um.clear();
		// printf("%d: %lld\n", u, maxn);
		for(int v : web[u])
		{
			if(!forbids[v]) maxn = max(maxn, self(self, v));
		}
		return maxn;
	})(1));
	return 0;
}
```
:::