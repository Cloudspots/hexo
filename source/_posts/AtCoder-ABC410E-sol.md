---
title: 题解：AT_abc410_e [ABC410E] Battles in a Row
date: 2025-6-15 10:07:01
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
这题有一个 $\mathcal O(NM)$ 正解，然而我比较菜所以只想到了 $\mathcal O\left(\dfrac{NHM}{w}\right)$ 的解，也能够过题（[官方题解](https://atcoder.jp/contests/abc410/editorial/13306)中也提到了这种做法）。

我们考虑一个简单的背包问题（会的可以回忆一下解法然后跳过）：

> 有 $n$ 个物品，第 $i$ 个物品有一个重量 $a_i$，可以选任意多个物品（每个物品只能选一次）但是总重量不能够超过背包载重 $m$，对于每种重量 $k(0 \le k \le m)$ 求能否凑出重量恰好为 $k$（不选任何物品也是一种方案）。

方法是，设 $f_{i,j}$ 为考虑到前 $i$ 个物品，$k=j$ 时的答案。状态转移方程是第 $i$ 个物品选或不选的~~量子~~叠加~~态~~，即 $f_{i,j}=\max(f_{i-1,j-a_i}+f_{i-1,j})$（当 $j<a_i$ 时 $f_{i-1,j-a_i}$ 为 $0$）。这样时间复杂度是 $\mathcal O(nm)$，空间复杂度也是。

如果我们需要空间复杂度更优的做法，就可以用滚动数组优化。每次原地进行转移，看上去就是 $f_j=\max(f_j,f_{j-a_i})$，内层循环转移的时候枚举 $j$ 需要从大到小枚举因为这样 $f_{j-a_i}$ 才是上一次的结果。

具体就不细讲了，在 P1048 的题解区讲的很细致了。

**回到这题**。我们同样可以设 $f_{i,j,k}$ 为考虑到前 $i$ 只怪，$\langle H,M\rangle=\langle j,k\rangle$ 的可行性。状态转移方程为 $f_{i,j,k}=\max(f_{i-1,j+A_i,k}+f_{i-1,j,k+B_i})$。

同样使用滚动数组优化，可以做到 $\Theta(HM)$ 空间。时间复杂度是 $\mathcal O(NHM)$，有超时的风险。

但是我们可以把 $f$ 组合考虑——使用 C++ 中的 `bitset`。设 $w$ 为机器字长，则每次转移可以同时考虑 $w$ 个状态，就能够做到 $\mathcal O\left(\dfrac{NHM}{w}\right)$ 的时间复杂度了，可以过题。

丑陋的赛时代码。

```cpp
// 尝试使用 bitset 神力冲过去！/w 万岁！
// I won't TLE! I won't TLE! I won't TLE!!!
#include <cstdio>
#undef L7W_AB
#include <bitset>

using namespace std;

bitset<3005> flag[3005];

int main()
{
	int n, h, m;
	scanf("%d%d%d", &n, &h, &m);
	flag[h][m] = true;
	for (int i = 1; i <= n; i++)
	{
#ifdef L7W_AB
		printf("Monster %d\n", i);
#endif
		int a, b;
		scanf("%d%d", &a, &b);
		bool fg = false;
		for (int j = 0; j <= h; j++)
		{
			flag[j] = j + a <= h ? flag[j + a] | flag[j] >> b : flag[j] >> b;
			if (flag[j].any()) fg = true;
#ifdef L7W_AB
			for (int k = 0; k <= m; k++)
			{
				if (flag[j][k]) printf("(%d, %d)\n", j, k);
			}
#endif
		}
		if (!fg)
		{
			printf("%d\n", i - 1);
			return 0;
		}
	}
	printf("%d\n", n);
	return 0;
}
```

[sub](https://atcoder.jp/contests/abc410/submissions/66758224)。