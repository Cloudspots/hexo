---
title: 题解：P3279 [SCOI2013] 密码
date: 2026-10-08 14:21:45
updated: 2026-10-08 14:21:45
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P3279 [SCOI2013] 密码

> 简单题，这能有紫？？
>
> 不过这个做法的证明其实比较困难。

---

首先 Manacher 只依赖字符的比较相等或不等。换句话说 Manacher 也可以做成交互，给定一个函数判断两个字符是否相等。

那么考虑 Manacher 的过程。不妨模拟 Manacher，从左往右考虑每个位置，模拟 Manacher 的扩展过程。由于我们知道要扩展多少步，所以扩展时用到的所有比较的结果也是可以推断出的。

这样我们就得到了 Manacher 在目标字符串中每一次比较的结果。那么建图，对于两个相同的位置缩成一个点，从左到右每个位置（因为是字典序），如果这个位置所在的相等连通块已经确定了就直接跳过，否则寻找最小可能的字符（即其所有确定了的邻居的 $\text{mex}$）。

为什么这样是对的？

事实上这个贪心对于一般图是错的（如果是对的那我就解决了图染色我就去领图灵奖了我还来这打什么 OI）。一个反例是 $1\neq 2,2\neq 3,3\neq 1,4\neq 5,3\neq 6,4\neq 6,5\neq 6$，字符集大小 $\Sigma=3$。此时会把 $1,2,3,4,5$ 染色为 $\texttt{abcab}$，然后 $6$ 就炸了。但是实际上存在一个解 $\texttt{abcacb}$。

但是这个题的图有很好的性质。首先这个图等价于对于所有回文暴力连边（回文半径之内相同，比回文半径恰好多 $1$ 不同）。那么推一下回文（回文的性质过于优秀）可以发现，若对于每一个等价类我们使用其中的最小下标代表它，那么将等价类从小到大排序后，每个等价类的所有下标比它小的邻居（缩点后的图上的，所以连边意味着不等）一定构成一个团！

接下来的论证就很简单了。如果图有大小 $>26$ 的团显然无解，但是题目保证了有解。那么对于一个等价类，其前驱（邻居中下标比它小的）的个数就不会超过 $25$（因为它的前驱是个团，加上它也是个团）。所以必然不会炸。贪心是对的。

时间复杂度 $O(n)$。这题 $\Sigma$ 只有 $26$ 所以求 $\text{mex}$ 可以直接用 bitmask 然后算 $\text{lowbit}$。对于字符集大小比较大可以计数排序（值域实际上不会超过邻居个数，否则对 $\text{mex}$ 没有贡献，所以计数排序即可）然后算 $\text{mex}$，一样可以做到线性。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/301875106)。

```cpp
#include <cstdio>
#include <vector>
#include <utility>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

int qx[200005];
vector<pair<int, int>> web[100005];
int vid[100005];
vector<int> nweb[100005];
char vans[100005];

int main()
{
	int n;
	scanf("%d", &n);
	for(int i=1;i<=n;i++)
	{
		scanf("%d", qx + (2 * i - 1));
	}
	for(int i=1;i<n;i++)
	{
		scanf("%d", qx + 2 * i);
	}
	int maxr = 0, mxpos = 0;
	for(int i=1;i<2*n;i++)
	{
		int px;
		if(i > maxr) px = 1;
		else px = min(maxr - i, qx[2 * mxpos - i]);
		if(i > maxr || px == maxr - i)
		{
			int maxo = (max(i, maxr) + 1) / 2;
			while((px += 2) <= qx[i])
			{
				web[maxo].push_back({i - maxo - 1, 0});
				web[i - maxo - 1].push_back({maxo, 0});
				maxo++;
			}
			if(i - maxo - 1 >= 0 && maxo < n)
			{
				web[maxo].push_back({i - maxo - 1, 1});
				web[i - maxo - 1].push_back({maxo, 1});
			}
			// if(maxo * 2 > maxr)
			// {
				maxr = maxo * 2;
				mxpos = i;
			// }
		}
	}
	// for(int i=0;i<n;i++)
	// {
	// 	for(const auto &[j, w] : web[i])
	// 	{
	// 		printf("%d --%d-- %d\n", i, w, j);
	// 	}
	// }
	int cur = 0;
	for(int i=0;i<n;i++)
	{
		if(!vid[i])
		{
			cur++;
			U([&](auto &&self, int u) -> void { vid[u] = cur; for(const auto &[v, w] : web[u]) if(w == 0 && !vid[v]) self(self, v); })(i);
		}
	}
	for(int i=0;i<n;i++)
	{
		for(const auto &[v, w] : web[i])
		{
			if(w == 1) nweb[vid[i]].push_back(vid[v]);
		}
	}
	for(int i=0;i<n;i++)
	{
		if(vans[vid[i]])
		{
			putchar(vans[vid[i]]);
			continue;
		}
		unsigned vmsk = (1 << 26) - 1;
		for(int v : nweb[vid[i]])
		{
			if(vans[v]) vmsk &= ~((1u << (vans[v] - 'a')));
		}
		vans[vid[i]] = 'a' + __lg(vmsk & -vmsk);
		putchar(vans[vid[i]]);
	}
	return 0;
}
```

:::
