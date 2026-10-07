---
title: 题解：P15093 [UOI 2025 II Stage] Odd Rows
date: 2026-09-26 14:28:41
updated: 2026-09-26 19:16:53
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P15093 [UOI 2025 II Stage] Odd Rows

这题黄吧。

---

首先容易发现这样一个显然的性质：若 $1$ 个数最小值为 $m$，最大值为 $M$，则：

1. $m\equiv M\pmod 2$。
2. $x$ 可以取到当且仅当 $x\equiv m\pmod 2\land x\in [m,M]$。

证明是显然的，略去。

那么我们考虑 dp，$\text{vmin}_i$ 表示前 $i$ 行能够组合出的 $1$ 的个数的最小值，而 $\text{vmax}_i$ 表示最大值。转移分讨一下即可。答案为 $\text{vmax}_n$。

构造也是显然的，这种平凡的 dp 要给出构造基本上都是从后往前。这里维护一个 $\text{val}$ 表示当前 $1$ 的个数。

时间复杂度 $O(nm)$。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/299278925)。

```cpp
#include <cstdio>
#include <vector>
#include <cassert>
#include <algorithm>

using namespace std;

int vmin[1000005], vmax[1000005];
int vval[1000005];
int p[1000005];
int a[1000005];
vector<char> ans[1000005];

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	vmin[0] = vmax[0] = 0;
	for(int i=1;i<=n;i++) ans[i].resize(m+1);
	for(int i=1;i<=m;i++)
	{
		scanf("%d", a + i);
		// 分讨。。
		// 对于 min：先判是否是 0/1
		if(vmin[i-1] <= a[i] && a[i] <= vmax[i-1]) vmin[i] = (a[i] ^ vmin[i-1]) & 1;
		else
		{
			// 不是 0/1.分讨两种情况
			if(a[i] < vmin[i-1]) vmin[i] = vmin[i-1] - a[i];
			else vmin[i] = a[i] - vmax[i-1];
		}
		// 对于 max：
		if(n - vmax[i-1] <= a[i] && a[i] <= n - vmin[i-1]) vmax[i] = n - ((n ^ a[i] ^ vmax[i-1]) & 1);
		else
		{
			if(a[i] < n - vmax[i-1]) vmax[i] = vmax[i-1] + a[i];
			else vmax[i] = vmax[i] = 2*n - (vmin[i-1] + a[i]);
		}
		assert((vmin[i] & 1) == (vmax[i] & 1));
		// printf("vmin[%d] = %d, vmax[%d] = %d\n", i, vmin[i], i, vmax[i]);
	}
	printf("%d\n", vmax[m]);
	// construct?
	vval[m] = vmax[m];
	for(int i=1;i<=vmax[m];i++) ans[i][m] = 1;
	for(int i=m;i>=2;i--)
	{
		int kmin = max(0, vval[i] + a[i] - n), kmax = min(vval[i], a[i]);
		int gmin = vval[i] + a[i] - 2 * kmax, gmax = vval[i] + a[i] - 2 * kmin;
		int rmin = max(gmin, vmin[i-1]), rmax = min(gmax, vmax[i-1]);
		assert(rmin <= rmax);
		vval[i-1] = rmin;
		assert((gmin & 1) == (vmin[i-1] & 1) && (gmax & 1) == (vmax[i-1] & 1));
		assert((rmin & 1) == (rmax & 1));
		int vk = (vval[i] + a[i] - vval[i-1]) / 2;
		assert(vk <= vval[i]);
		int cnt = vk;
		for(int j=1;j<=n;j++) ans[j][i-1] = ans[j][i];
		for(int j=1;j<=n;j++)
		{
			if(!cnt) break;
			if(ans[j][i])
			{
				cnt--;
				ans[j][i-1] = 0;
			}
		}
		cnt = a[i] - vk;
		for(int j=n;j>=1;j--)
		{
			if(!cnt) break;
			if(!ans[j][i])
			{
				cnt--;
				ans[j][i-1] = 1;
			}
		}
	}
	for(int i=1;i<=n;i++)
	{
		for(int j=1;j<=m;j++)
		{
			printf("%d%c", ans[i][j] ^ ans[i][j-1], " \n"[j == m]);
		}
	}
	return 0;
}
```

:::
