---
title: 题解：CF2028E Alice's Adventures in the Rabbit Hole
date: 2026-3-30 16:27:09
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
先考虑两个人的策略。Alice 显然往孩子走不优（因为最终一定还要重新到达这个点），所以必定往父亲走；而 Queen 一定会把她往孩子的地方拉。并且，一定会拉到子树中拥有深度最小的叶子节点的孩子处。

换句话说，这是一个短链剖分。Alice 向上走是显然的，而 Queen 会拉到当前短链中的子节点。

链上问题就好考虑多了。首先设 $a,b$ 分别为节点 $u$ 的父亲和 $u$ 的短链中的子节点（假设 $u$ 不为叶子节点）。那么概率 $f_u=\dfrac{f_a+f_b}{2}$。

为了方便，我们把除了 $1$ 所在的短链之外所有的短链的头的父节点也加入到这条链中。这样的好处是每个链头的 $f$ 都是已知的。

那么，对于每一个非链头节点，注意到它的值可以表示为 $f_u=w_uf_b+c_u$（$b$ 的含义在上文中说过）。并且，这个 $w_u$ 和 $c_u$ 是可递推的（把 $w_a$ 和 $c_a$ 带入 $f_u$ 的表达式中，进行化简即可。如果 $a$ 是链头则直接使用 $f_a$ 进行推导）。而得到了 $w$ 和 $a$ 之后，因为一直沿着链往下走一定会走到叶子节点，而叶子节点的 $f$ 显然是 $0$，就可以倒推回去得到每一个节点的 $f$ 值。

所以，需要对一条链的头、头的子节点特殊处理。前者是因为 $f$ 已知，后者是因为 $w$ 和 $b$ 的计算方法不同。其它（非叶子）节点的处理方法都是一样的。注意初始化 $f_1=1$。

时间复杂度 $\mathcal O(n)$。

:::info[sub&code]

[sub](https://codeforces.com/contest/2028/submission/368823331)。

```cpp
#include <cstdio>
#include <vector>
#include <algorithm>

using namespace std;

auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

long long weight[200005], bias[200005];
vector<int> ch[200005];
int fa[200005];
int shortest[200005], shortid[200005];
long long f[200005];
vector<int> line[200005];
int lineid[200005];

long long qpow(long long x, long long y)
{
	long long p = x, ans = 1;
	do
	{
		if(y & 1) ans = ans * p % 998244353;
		p = p * p % 998244353;
	} while(y >>= 1);
	return ans;
}

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
			line[i].clear();
		}
		for(int i=2;i<=n;i++)
		{
			int x, y;
			scanf("%d%d", &x, &y);
			ch[x].push_back(y); ch[y].push_back(x);
		}
		auto dfs = U([&](auto self, int u, int ff = 0) -> void
		{
			auto it = find(ch[u].begin(), ch[u].end(), ff);
			if(it != ch[u].end()) ch[u].erase(it);
			fa[u] = ff;
			if(ch[u].empty())
			{
				f[u] = 0;
				shortest[u] = 0;
				shortid[u] = 0;
				return;
			}
			shortest[u] = 0x3f3f3f3f;
			for(int v : ch[u])
			{
				self(self, v, u);
				if(shortest[v] + 1 < shortest[u])
				{
					shortest[u] = shortest[v] + 1;
					shortid[u] = v;
				}
			}
		});
		dfs(1);
		int cur = 0;
		auto splitter = U([&](auto self, int u) -> void
		{
			if(u == 1 || u != shortid[fa[u]])
			{
				lineid[u] = ++cur;
				if(u != 1) line[cur].push_back(fa[u]);
				line[cur].push_back(u);
			}
			else line[lineid[u] = lineid[fa[u]]].push_back(u);
			for(int v : ch[u]) self(self, v);
		});
		splitter(1);
		f[1] = 1;
		for(int i=1;i<=cur;i++)
		{
			// printf("line #%d: ", i);
			// for(int x : line[i]) printf("%d ", x);
			// printf("\n");
			weight[line[i][1]] = 499122177;
			// f(2) = (f(1) + f(3)) / 2 = f(1) / 2 + f(3) / 2
			bias[line[i][1]] = f[line[i][0]] * 499122177 % 998244353;
			for(int j=2;j+1<line[i].size();j++)
			{
				// f(i) = (f(i-1) + f(i+1)) / 2
				//      = (kf(i)+b + f(i+1)) / 2
		//    (2-k)f(i) = b + f(i+1)
				long long divisor = qpow(2-weight[line[i][j-1]] + 998244353, 998244351);
				weight[line[i][j]] = divisor;
				bias[line[i][j]] = bias[line[i][j-1]] * divisor % 998244353;
			}
			f[line[i].back()] = 0;
			if(line[i].size() >= 2)
			{
				for(int j=line[i].size()-2;j>=1;j--)
				{
					f[line[i][j]] = (weight[line[i][j]] * f[line[i][j+1]] + bias[line[i][j]]) % 998244353;
				}
			}
		}
		for(int i=1;i<=n;i++)
		{
			printf("%lld%c", f[i], " \n"[i == n]);
		}
	}
	return 0;
}
/*
短链剖分

对于每一条链，有方程

f(i) = (f(i-1) + f(i+1)) / 2

i 代表深度。f(1) = 1，f(leaf) = 0。

解这个即可。对于每一个 f(i)，求出它关于 f(i+1) 的关系（f(i) = af(i+1)+b）。
*/
```

:::