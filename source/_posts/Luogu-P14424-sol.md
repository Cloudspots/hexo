---
title: 题解：P14424 [JOISC 2014] 邮戳收集 / Collecting Stamps
date: 2026-10-05 09:29:03
updated: 2026-10-07 21:52:56
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P14424 [JOISC 2014] 邮戳收集 / Collecting Stamps

一种比较招笑的 dp 做法。

考虑一个点 $u$ 向右连出 $i$ 条边。换句话说 $u\to u+1$ 和 $u+1\to u$ 的边总共被经过了 $i$ 次（$i$ 一定是奇数）。

$O(n^4)$ 转移是显然的，枚举 $u-1\to u\to u-1$ 的次数 $a$，$u+1\to u\to u+1$ 的次数 $c$，$u-1\to u\to u+1$ 和 $u+1\to u\to u-1$ 的次数 $b$ 即可。枚举 $a,b,c$ 后贡献计算是简单的，分讨 $a=c=0$ 和 $a\neq 0\lor c\neq 0$，在 $a=c=0$ 时再分讨 $b=1$ 或 $b\neq 1$ 即可。

考虑 $g_i(a,b,c)=\begin{cases}v_1&a=c=0,b=1\\\min(v_1,v_2)&a=c=0,b>1\\av_3+cv_4&a\neq 0\lor c\neq 0\end{cases}$，其中 $v_1=U_i+V_i,v_2=D_i+E_i,v_3=U_i+E_i,v_4=V_i+D_i$。那么就有 $f_{i,b+2c}\stackrel{\min}{\gets}f_{i-1,2a+b}+g_i(a,b,c)$。

考虑到 $a=c=0$ 的情况可以暴力转移（总共只有 $O(n^2)$），考虑 $a>0\lor c>0$。此时是 $f_{i,b+2c}\stackrel{\min}{\gets}f_{i-1,2a+b}+av_3+cv_4\quad (a\neq 0\lor c\neq 0)$。

考虑先枚举 $b$，此时 $cv_4$ 对于每个 $a$ 都是相同的。所以 $f_{i,b+2c}=cv_4+\min\limits_a\{f_{i-1,2a+b}+av_3\}$，其中 $a$ 的限制是 $c=0$ 时 $a>0$，$c>0$ 时 $a\ge 0$。这就优化到了 $O(n^3)$。

考虑 $\min\limits_a\{f_{i-1,2a+b}+av_3\}$ 可以直接求（$f_{i-1,2a+b}+av_3=f_{i-1,2a+b}+(2a+b)\dfrac{v_3}{2}-\dfrac{bv_3}{2}$，记录 $f_{i-1,x}+\dfrac{xv_3}{2}$ 的后缀最大值即可。不过 $f$ 实际上是单增的，所以只需要取 $f_{i-1,b}$（$a=0$ 时是 $f_{i-1,b+2}+v_3$）即可。设这个值是 $m$

此时还是 $O(n^3)$，因为对于每个 $i,b$ 都要 $O(n)$ 更新所有 $f$ 值。但是注意到这相当于后缀对斜率相同的一次函数取 $\min$，那么设辅助数组 $g_i$，每次 $g_b\stackrel{\min}{\gets} m$，最后扫一遍并 $g_b\stackrel{\min}{\gets}g_{b-2}+v_4$。然后 $f_{i,j}\stackrel{\min}{\gets}g_j$。

对于 $T$，考虑 $T$ 的贡献可以直接求出，那么每个 $i$ 转移完成后 $f_{i,j}\gets f_{i,j}+jT$ 即可。

最终复杂度是 $O(n^2)$ 的。做完了。注意不要忘了 $a=c=0$ 的特殊处理。

:::info[rec&code]

卡卡常后拿下了最优解，还是比较快的。下面是没卡常的代码和提交记录。

[rec](https://www.luogu.com.cn/record/300645862)。

```cpp
/*

*/
#include <cstdio>
#include <cstring>
#include <algorithm>

using namespace std;

int u[3005], v[3005], d[3005], e[3005];
long long dp[3005][6005];
long long helper[6005];

int main()
{
	int n;
	long long t;
	scanf("%d%lld", &n, &t);
	for(int i=1;i<=n;i++)
	{
		scanf("%d%d%d%d", u + i, v + i, d + i, e + i);
	}
	memset(dp, 0x3f, sizeof dp);
	dp[0][1] = t;
	for(int i=1;i<=n;i++)
	{
		int v1 = u[i] + v[i], v2 = min(u[i] + v[i], d[i] + e[i]), v3 = u[i] + e[i], v4 = v[i] + d[i];
		helper[1] = 0x3f3f3f3f3f3f3f3f;
		for(int b=1;b<=2*n;b+=2)
		{
			dp[i][b] = min(dp[i][b], dp[i-1][b] + (b == 1 ? v1 : v2));
			long long t0 = dp[i-1][b], t1 = dp[i-1][b+2] + v3;
			dp[i][b] = min(dp[i][b], t1);
			helper[b + 2] = t0 + v4;
			// for(int c=1;2*c+b<=2*n;c++) dp[i][2*c+b] = min(dp[i][2*c+b], t0 + c * v4);
		}
		for(int b=3;b<=2*n;b+=2) helper[b] = min(helper[b], helper[b-2] + v4);
		for(int j=1;j<=2*n;j+=2) dp[i][j] = min(dp[i][j], helper[j]);
		for(int j=1;j<=2*n;j+=2)
		{
			dp[i][j] = min(0x3f3f3f3f3f3f3f3fll, dp[i][j] + j * t);
		}
	}
	printf("%lld\n", dp[n][1]);
	return 0;
}
```

:::
