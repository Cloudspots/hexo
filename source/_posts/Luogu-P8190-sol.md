---
title: 题解：P8190 [USACO22FEB] Cow Camp G
date: 2026-5-16 16:25:15
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
:::info[闲话]

$T=10^3,K=10^9$ 答案还不到 $600$。就算 $K=10^{18}$，答案也只有约 $815$。所以，事实上这样的策略没什么用。不过，$T=10,K=10^4$ 答案就来到了接近 $10$，所以如果数据点比较少那也是可以的。

观察大样例是更好的办法，万一就算是多测输出也全是 `No` 呢。

:::

---

首先这个样例是拿来搞笑的。$T$ 减少 $1$，最终答案增加 $1$ 即可。

容易发现单次测试结果是二项分布。即，得到 $i$ 的概率是 $\dfrac{\dbinom{T}{i}}{2^T}$。

首先，显然最优策略是，对于每一个“当前剩余可操作次数”都有一个阈值 $g_i$，如果这一次得分 $\ge g_i$ 就停下，否则就继续。显然 $g_1=0$。

我们受到了启发。我们设 $f_i$ 为剩余 $i$ 次操作的最大得分。显然有 $f_1=\dfrac{T}{2}$，而 $f_i=\max\limits_{0\le j\le T} X_j+Y_jf_{i-1}$，其中 $X_j$ 代表 $\ge j$ 分的情况下得分的期望（这样表述可能有些问题，严格来讲还要乘上 $\ge j$ 分的概率。不过也可以认为是，进行一次尝试，如果得分 $<j$ 则令得分为 $0$ 的得分的期望），而 $Y_j$ 代表得分 $<j$ 的概率。

这两者都是好求的，前后缀和即可。

同时，我们发现 $X$ 是单降的，$Y$ 是单增的。这样，随着 $f$ 的增长，$\max$ 对应的 $j$ 也是单调不降的（因为 $X$ 越来越不重要，而 $Y$ 越来越重要）。

双指针能够做到 $O(T+K)$，听说洛谷神机能跑过（为什么数据范围不开到 $K\le 10^{18}$？正解这题最大点只跑了 $5\mathrm{ms}$ 欸）。我没试。我是有素质的小朋友。

我们考虑什么时候进行什么决策。显然，是先有一段进行 $j=1$ 的决策，然后 $j=2$ 更优时立马切换到 $j=2$，然后更优时切换到 $j=3$，以此类推。这里所有段都可以为空。显然 $j=k$ 和 $j=k+1$ 的分界线是一个数，大于这个数就后者更优。二分出这个界。

然后对于每一个 $j$，二分出转移次数即可。至于转移，矩阵快速幂。

时间复杂度 $O(T\log^2 K)$。这题数据范围是拿来搞笑的，还是放暴力过的？

另外还有个事，矩阵快速幂可以用对角化替代，直接浮点数 `pow` 即可。可以少一个 $\log$。我懒得算了，大家加油。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/278094975)。

```cpp
/*
样例是拿来搞笑的

你就不考虑样例

考虑暴力。

首先容易发现，得分是一个【二项分布】

然后，对于第 i 次，你有一个值 val[i]，代表

- 如果得分 >= val[i]，就停止
- 否则，就继续。

显然，val 必须是单调不增的。

那么设 f[i] 为最优的 val[i]，g[i] 为最优的期望得分。

边界条件？f[n] = 0, g[n] = n/2.

转移？

如果 f[i] = j, 那么我们有期望得分 [>= j 的概率] * [>= j 的期望分数] + [< j 的概率] * g[i+1]

g[i] = max_j X[j] + Y[j] * g[i+1]. 其中, X[j] 和 Y[j] 是常量。

矩阵说是？

这个讨厌的又有 max 又有 + 又有 * 的式子非常讨厌。

【讨厌的式子非常讨厌】.jpg

还有性质就是说，X 是单调递减的，Y 是单调递增的。

嗯那就是说……这个 max 里面的东西是……单峰的？或者，是凸的？

那你就可以二分出位置了。

然而，更进一步地……最优的 j 随着 g[i+1] 的增长是单调递增的

我们就可以二分出每个 j 接受的转移的 g[i+1] 的最小和最大值。

那这样的话……

嗯太对了。

那这样说矩阵乘法的唯一用处就是辅助进行 dp 了。
*/
#include <cstdio>
#include <algorithm>

using namespace std;


class m2b { public: long double a, b, c, d; m2b(long double _a = 1, long double _b = 0, long double _c = 0, long double _d = 1) : a(_a), b(_b), c(_c), d(_d) {} friend m2b operator*(const m2b &x, const m2b &y) { return {x.a * y.a + x.b * y.c, x.a * y.b + x.b * y.d, x.c * y.a + x.d * y.c, x.c * y.b + x.d * y.d }; }};

m2b qpow(m2b x, unsigned long long y)
{
	m2b ans;
	do
	{
		if(y & 1) ans = ans * x;
		x = x * x;
	} while(y >>= 1);
	return ans;
}
long double kdp(long double X, long double Y, long double g, long long k)
{
	auto res = qpow({1, 0, X, Y}, k);
	// printf("[kdp] X = %.10Lf, Y = %.10Lf, g = %.10Lf, k = %lld. res = {a = %.10Lf, b = %.10Lf, c = %.10Lf, d = %.10Lf}\n", X, Y, g, k, res.a, res.b, res.c, res.d);
	return res.c + res.d * g;
}

long double maxj[1005];
long double X[1005], Y[1005], ls[1005], rs[1005], prs[1005];
long double prob[1005];

int main()
{
	long long t, k;
	scanf("%lld%lld", &t, &k);
	t--;
	prob[0] = 1;
	for(int i=1;i<=t;i++) prob[0] /= 2;
	for(int i=1;i<=t;i++) prob[i] = prob[i-1] * (t - i + 1) / i;
	for(int i=0;i<=t;i++) ls[i] = (i ? ls[i-1] : 0) + prob[i];
	for(int i=t;i>=0;i--) rs[i] = rs[i+1] + prob[i];
	for(int i=t;i>=0;i--) prs[i] = prs[i+1] + i * prob[i];
	for(int i=0;i<=t;i++) X[i] = prs[i];
	for(int i=1;i<=t+1;i++) Y[i] = ls[i-1];
	// printf("X[%d] = %Lf, Y[%d] = %Lf\n", 0, X[0], t+1, Y[t+1]);
	for(int i=1;i<t;i++)
	{
		// 二分出 i 对应的最大值
		long double l = 0, r = t;
		while(r - l > 1e-9)
		{
			long double mid = (l + r) / 2;
			if(X[i] + Y[i] * mid > X[i+1] + Y[i+1] * mid) l = mid;
			else r = mid;
		}
		maxj[i] = l;
		// printf("maxj[%d] = %.10Lf\n", i, maxj[i]);
		// printf("X[%d] = %.10Lf, Y[%d] = %.10Lf\n", i, X[i], i, Y[i]);
	}
	maxj[t] = t + 1;
	long double g = 1.0L * t / 2;
	long long lst = 1;
	for(int i=1;i<=t;i++)
	{
		if(maxj[i] < g) continue;
		if(lst == k) break;
		if(i == t)
		{
			// printf("%d: %d times.\n", i, k - lst);
			g = kdp(X[i], Y[i], g, k - lst);
			continue;
		}
		int l = 0, r = k - lst - 1;
		while(l < r)
		{
			int mid = (l + r + 1) / 2;
			if(kdp(X[i], Y[i], g, mid) <= maxj[i]) l = mid;
			else r = mid - 1;
		}
		l++;
		g = kdp(X[i], Y[i], g, l);
		// printf("%d: %d times. now g = %.10Lf\n", i, l, g);
		lst += l;
	}
	printf("%.10Lf\n", g + 1);
	return 0;
}
```

:::