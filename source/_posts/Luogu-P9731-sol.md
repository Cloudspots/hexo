---
title: 题解：P9731 [CEOI 2023] Balance
tags:
  - Solution
  - Luogu P Problem Solution
categories:
  - Solution
date: 2026-07-28 15:46:16
updated: 2026-07-28 15:46:16
---
> 先口胡一下，待会儿要讲。

---

显然要考虑一个 $S=2$ 的部分分。每一行都有两个元素……容易想到建图。如何刻画每个颜色在第一列和第二列的出现次数？容易发现对于每一行（每条边），它所连接的两个点都是一个在第一列一个在第二列，正如同定向。

所以我们得到了一个无向图，我们需要对其所有边定向，使得每个点入度和出度的差至多为 $1$（赛时只想到了这）。

我们先不考虑这个麻烦的差 $1$（有些时候这种微小误差其实都是直接考虑没有误差，然后发现直接做有一定的问题，但只是会有小误差，刚好符合题意。比如 Codeforces 上一个构造一个函数的题目，题号忘了）。我们考虑如果要求相等应该怎么做。

显然如果我们要求每个点入度和出度相等，那么我们可以得出一个有解的显然的必要条件——每个点度数都是偶数。

欸这不是欧拉回路的存在条件吗？顺便，如果我们求出了欧拉回路，也就求出了要求每个点入度和出度相等的解！顺着欧拉回路走一遍就行了。

那现在考虑至多差 $1$。我们知道如果所有点度数都是偶数，那么可以实现没有差距的完美的解。所以我们考虑所有度数为奇数的点，如何处理它们呢？

我们先加一个虚点，和所有度数为奇数的点连边（最好不要问我为什么虚点的度数一定是偶数）。这样跑一遍欧拉回路求解，然后把虚点删掉即可。

现在考虑 $S>2$。

这个 $S=2^k$ 看着就很分治。你考虑分治。

注意到只要我们考虑左半部分和右半部分中某个颜色的出现次数之和之差不超过 $1$，并且左半部分和右半部分本身里面这个颜色的出现次数也是合法的（每一列的出现次数差不超过 $1$），整个矩阵就是合法的。

:::info[Proof]

假设某个颜色左半部分出现次数为 $a_{1\dots n}$，右半部分为 $b_{1\dots n}$。我们有条件 $\forall i,j,\lvert a_i-a_j\rvert \le 1,\lvert b_i-b_j\rvert\le 1$，同时 $\lvert \sum a - \sum b\rvert \le 1$。

那么此时如果有 $\exist i,j,a_i-b_j\ge 2$（如果是 $b_j-a_i\ge 2$ 可以交换 $a,b$），那么就有 $\min a\ge a_i-1,\max b\le b_j-1$，但是 $a_i-1\ge b_j-1$，所以对于任意 $i,j$ 都有 $a_i\ge b_j$。

然后你重排一下 $b$ 使原本的 $i,j$ 落到 $1,1$ 的位置，也就是 $a_1-b_1\ge 2$

同时我们发现：

$$\begin{aligned}\sum a-\sum b&=\sum_{i} b_i+(a_i-b_i)-\sum b\\&\ge \sum_{i} b_i+2[i=1]-\sum b\\&=2\end{aligned}$$

矛盾，做完了。

:::

所以我们先把所有处于左半边的数字放在第一列，右半边的数字放在第二列，跑一边上面的改装版欧拉回路，保证两边颜色数量之和差距至多为 $1$。然后左右两边分别分治下去保证组内满足条件，根据上面的定理得出整个矩阵合法。

高度为 $k$ 的矩阵处理的时间复杂度为 $O(k)$，所以总时间复杂度 $T(S)=2T\left(\frac{S}{2}\right)+O(NS)=O(NS\log S)$。

顺便解释一下目前最高赞题解的染色做法。

也是考虑 $S=2$ 怎么做，你考虑左右两边颜色相同的行一定是没用的。而对于每种颜色，假设它在 $a_1,a_2,\dots,a_k$ 行，你对于 $a_1,a_2$ 连边，$a_3,a_4$ 连边，以此类推（如果 $k$ 是奇数则直接忽略 $a_k$，因为可以有 $1$ 的误差）。连的边有两种类型，声明两个行交换状态（交换则交换状态为 $1$，否则为 $0$）相同或不同。

显然每一行度数至多为 $2$。也就是说这个图是若干条链和若干个环。对于链显然可以染色（这里不是相邻的点颜色不同，而是根据边权决定）。而对于环，你考虑它是怎么建出来的，一定是第一行的某个元素连到第二行某个元素，第二行另一个元素连到第三行某个元素，……，最后一行另一个元素连到第一行另一个元素。那么每一次切换列就有一个 $0$ 边，否则是 $1$ 边。显然切换列的次数和总行数的奇偶性是相同的，所以不切换的次数一定是偶数，也就是总边权一定是偶数，必然可以染色。

$S=2$ 你染色一下做完了（由图的特殊性质可以不写 BFS），有时间试试抢最优解。后面分治方法相同。

:::info[染色方法 rec&code]

[rec](https://www.luogu.com.cn/record/289213895)，目前最优解。

```cpp
#include <queue>
#include <bitset>
#include <cstdio>
#include <vector>
#include <cassert>
#include <algorithm>
#include <unordered_set>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

vector<unsigned> clr[100005];
unsigned lp[300005], rp[300005];
bitset<300005> lv, rv;
unsigned gr[300005];
bitset<300005> vis;

char ibf[100000005];
unsigned li = 0;
unsigned qread()
{
	unsigned res = 0;
	char ch;
	while((ch = ibf[li++]) < '0' || ch > '9');
	do
	{
		res = res * 10 + (ch ^ '0');
	} while((ch = ibf[li++]) >= '0' && ch <= '9');
	return res;
}

int main()
{
	fread(ibf, 1, sizeof ibf, stdin);
	unsigned n, s, t;
	// scanf("%u%u%u", &n, &s, &t);
	n = qread(); s = qread(); qread();
	for(unsigned i=1;i<=n;i++)
	{
		clr[i].resize(s + 5);
		for(unsigned j=1;j<=s;j++)
		{
			// scanf("%u", &clr[i][j]);
			clr[i][j] = qread();
		}
	}
	auto ss2 = [](const vector<pair<unsigned, unsigned>> &ipt) -> vector<unsigned char>
	{
		unsigned n = ipt.size();
		for(unsigned i=1;i<=n;i++)
		{
			lp[i] = rp[i] = lv[i] = rv[i] = 0;
			gr[ipt[i-1].first] = gr[ipt[i-1].second] = 0;
		}
		auto adde = [](unsigned x, unsigned y, unsigned v)
		{
			// printf("%u --- %u, val = %u\n", x, y, v);
			if(!lp[x])
			{
				lp[x] = y;
				lv[x] = v;
			}
			else
			{
				rp[x] = y;
				rv[x] = v;
			}
			if(!lp[y])
			{
				lp[y] = x;
				lv[y] = v;
			}
			else
			{
				rp[y] = x;
				rv[y] = v;
			}
		};
		for(unsigned i=0;i<n;i++)
		{
			if(ipt[i].first == ipt[i].second) continue;
			if(gr[ipt[i].first])
			{
				adde(gr[ipt[i].first], i + 1, ipt[gr[ipt[i].first] - 1].first == ipt[i].first);
				gr[ipt[i].first] = 0;
			}
			else gr[ipt[i].first] = i + 1;
			if(gr[ipt[i].second])
			{
				adde(gr[ipt[i].second], i + 1, ipt[gr[ipt[i].second] - 1].second == ipt[i].second);
				gr[ipt[i].second] = 0;
			}
			else gr[ipt[i].second] = i + 1;
		}
		for(unsigned i=1;i<=n;i++) vis[i] = false;
		vector<unsigned char> res(n);
		for(unsigned i=1;i<=n;i++)
		{
			if(vis[i]) continue;
			if(!lp[i] && !rp[i]) continue;
			if(!lp[i] || !rp[i])
			{
				unsigned x = lp[i] ^ rp[i], lst = i;
				res[x - 1] = lv[i] ^ rv[i];
				vis[i] = true;
				while(x)
				{
					vis[x] = true;
					if(lp[x] == lst)
					{
						if(!rp[x])
						{
							x = 0;
							break;
						}
						lst = x;
						res[rp[x]-1] = res[x - 1] ^ rv[x];
						x = rp[x];
					}
					else if(lp[x])
					{
						lst = x;
						res[lp[x]-1] = res[x - 1] ^ lv[x];
						x = lp[x];
					}
					else break;
				}
			}
			else
			{
				unsigned lx = lp[i], rx = rp[i], lstx = i, rstx = i;
				res[lx - 1] = lv[i]; res[rx - 1] = rv[i];
				vis[i] = true;
				while(rx != i)
				{
					vis[rx] = true;
					if(lp[rx] == lstx)
					{
						if(!rp[rx])
						{
							rx = 0;
							break;
						}
						lstx = rx;
						res[rp[rx]-1] = res[rx - 1] ^ rv[rx];
						rx = rp[rx];
					}
					else if(lp[rx])
					{
						lstx = rx;
						res[lp[rx]-1] = res[rx - 1] ^ lv[rx];
						rx = lp[rx];
					}
					else break;
				}
				if(!rx)
				{
					// printf("!\n");
					// printf("%u -> %u\n", i, lx);
					while(lx)
					{
						vis[lx] = true;
						if(lp[lx] == rstx)
						{
							if(!rp[lx])
							{
								lx = 0;
								break;
							}
							rstx = lx;
							res[rp[lx]-1] = res[lx - 1] ^ rv[lx];
							lx = rp[lx];
						}
						else if(lp[lx])
						{
							rstx = lx;
							res[lp[lx]-1] = res[lx - 1] ^ lv[lx];
							lx = lp[lx];
						}
						else break;
					}					
				}
				else
				{
					assert(rx == i);
				}
			}
		}
		return res;
	};
	// divide & conquer
	U([&](auto &&self, unsigned l, unsigned r) -> void
	{
		vector<pair<unsigned, unsigned>> cons;
		for(unsigned i=1;i<=n;i++)
		{
			for(unsigned j=l;j<=(l+r)/2;j++)
			{
				cons.push_back({clr[i][j], clr[i][j+(r-l+1)/2]});
			}
		}
		auto res = ss2(cons);
		unsigned cur = 0;
		for(unsigned i=1;i<=n;i++)
		{
			for(unsigned j=l;j<=(l+r)/2;j++)
			{
				if(res[cur++]) swap(clr[i][j], clr[i][j+(r-l+1)/2]);
			}
		}
		if(l + 1 != r)
		{
			self(self, l, (l + r) / 2);
			self(self, (l + r) / 2 + 1, r);
		}
	})(1, s);
	for(unsigned i=1;i<=n;i++)
	{
		for(unsigned j=1;j<=s;j++)
		{
			printf("%u%c", clr[i][j], " \n"[j == s]);
		}
	}
	return 0;
}
```

:::
