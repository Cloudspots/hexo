---
title: 不会全洛谷就我一个人写的 5*5 矩阵吧
date: 2026-7-11 10:03:26
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
大部分题解都提到了 $k=3$ 的时候的维护 $5$ 个量的做法。我模拟赛时用 $5\times 5$ 矩阵过了，但是翻了一下提交记录没看到除我之外用 $5\times 5$ 矩阵过的（甚至最劣解都是 $3\times 3$ 矩阵，非常奇怪，我的 $5\times 5$ 跑得比一些人的 $3\times 3$ 都要快）。

---

默认你们都看过其它题解，提到了设 $f$ 和 $g$ 的 $5\times 5$ 矩阵做法，并且说了为什么难以通过。

当然，$k=1,2$ 的时候只需要 $2\times 2$ 矩阵，可以轻松通过，我们这里只讨论 $k=3$。

我们发现实际上 $5\times 5$ 最大的敌人是……空间。我用的倍增。

$\left\lfloor\log_2(2\times 10^5)\right\rfloor=17$，然后 $\dfrac{17\times (2\times 10^5)\times 2\times 5^2\times 8}{1024^2}\approx 1297$，再加上其它数组，爆炸。

不过我们把它打了出来，然后观察一下每次询问最终乘出的矩阵。我们观察到……第一列和第三列相同，第二列和第四列也相同！

具体证明可以用数学归纳法，非常简单，留作课后练习。

这样我们不存储第三列和第四列（因为它们和第 $1,2$ 列相同），于是每个矩阵只需要 $15$ 个数字就可以存储了。$\left\lfloor\log_2(2\times 10^5)\right\rfloor=17$，然后 $\dfrac{17\times (2\times 10^5)\times 2\times 15\times 8}{1024^2}\approx 778$（我不是故意的），而其它数组都不是很大（最大的是倍增记录父亲的数组，但总大小也不大）。可以通过此题。

最后这个做法不需要任何卡常就可以通过。可喜可贺！

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/284982590)。

```cpp
/*
做过，赢赢赢
*/
/*
忘了做法了，输输输

注意到 k <= 3……？

那么你就可以很容易地设出一个 dp 了

然后你用矩阵+倍增优化一下

是不是做完了？？

你就考虑 (min, +) 矩乘

f[i]: 传输到 i 最少时间

[  inf  0   inf     [ f[i-3]      [ f[i-2] 
   inf inf    0       f[i-2]   =    f[i-1]
  a[i] a[i] a[i] ]    f[i-1] ]       f[i]  ]

是不是做完了
*/
/*
假了

对于 k=1, 2 是对的

但是对于 k=3……

被样例 2 hack 飞了

我们需要记录一个暂存点，代表它现在位于这个点的某个邻居上


*/
#include <cstdio>
#include <vector>
#include <algorithm>
#include <cassert>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

long long inf = 0x3f3f3f3f3f3f3f3f;

class matrix
{
public:
	long long a00, a01, a04, a10, a11, a14, a20, a21, a24, a30, a31, a34, a40, a41, a44;
	friend matrix operator*(const matrix &x, const matrix &y)
	{
		return {min({inf, x.a00 + y.a00,x.a01 + y.a10,x.a00 + y.a20,x.a01 + y.a30,x.a04 + y.a40}), min({inf, x.a00 + y.a01,x.a01 + y.a11,x.a00 + y.a21,x.a01 + y.a31,x.a04 + y.a41}), min({inf, x.a00 + y.a04,x.a01 + y.a14,x.a00 + y.a24,x.a01 + y.a34,x.a04 + y.a44}), min({inf, x.a10 + y.a00,x.a11 + y.a10,x.a10 + y.a20,x.a11 + y.a30,x.a14 + y.a40}), min({inf, x.a10 + y.a01,x.a11 + y.a11,x.a10 + y.a21,x.a11 + y.a31,x.a14 + y.a41}), min({inf, x.a10 + y.a04,x.a11 + y.a14,x.a10 + y.a24,x.a11 + y.a34,x.a14 + y.a44}), min({inf, x.a20 + y.a00,x.a21 + y.a10,x.a20 + y.a20,x.a21 + y.a30,x.a24 + y.a40}), min({inf, x.a20 + y.a01,x.a21 + y.a11,x.a20 + y.a21,x.a21 + y.a31,x.a24 + y.a41}), min({inf, x.a20 + y.a04,x.a21 + y.a14,x.a20 + y.a24,x.a21 + y.a34,x.a24 + y.a44}), min({inf, x.a30 + y.a00,x.a31 + y.a10,x.a30 + y.a20,x.a31 + y.a30,x.a34 + y.a40}), min({inf, x.a30 + y.a01,x.a31 + y.a11,x.a30 + y.a21,x.a31 + y.a31,x.a34 + y.a41}), min({inf, x.a30 + y.a04,x.a31 + y.a14,x.a30 + y.a24,x.a31 + y.a34,x.a34 + y.a44}), min({inf, x.a40 + y.a00,x.a41 + y.a10,x.a40 + y.a20,x.a41 + y.a30,x.a44 + y.a40}), min({inf, x.a40 + y.a01,x.a41 + y.a11,x.a40 + y.a21,x.a41 + y.a31,x.a44 + y.a41}), min({inf, x.a40 + y.a04,x.a41 + y.a14,x.a40 + y.a24,x.a41 + y.a34,x.a44 + y.a44})};
	}
} I{0,  inf,  inf,  inf,  0,  inf,  0,  inf,  inf,  inf,  inf,  inf,  inf,  inf,  0};

// class V3
// {
// public:
// 	long long a, b, c;
// 	friend V3 operator*(const matrix &x, const V3 &y)
// 	{
// 		return {min({inf, x.a + y.a, x.b + y.b, x.c + y.c}), min({inf, x.d + y.a, x.e + y.b, x.f + y.c}), min({inf, x.g + y.a, x.h + y.b, x.i + y.c})};
// 	}
// };

matrix nmx[200005];
vector<int> web[200005];
int dep[200005], fa[18][200005];
// t: 从上往下。rt：从下往上。
matrix tfa[18][200005], rtfa[18][200005];
int a[200005], mn[200005];

int main()
{
	int n, q, k; // 你，琦，凯
	scanf("%d%d%d", &n, &q, &k);
	for(int i=1;i<=n;i++)
	{
		scanf("%d", a + i);
		// printf("nmx[%d] = [inf 0 inf\n          inf inf 0\n          %d %d %d]\n", i, a, a, a);
	}
	for(int i=2;i<=n;i++)
	{
		int x, y;
		scanf("%d%d", &x, &y);
		web[x].push_back(y);
		web[y].push_back(x);
	}
	for(int i=1;i<=n;i++)
	{
		mn[i] = 0x3f3f3f3f;
		for(int j : web[i])
		{
			mn[i] = min(mn[i], a[j]);
		}
		if(k == 3) nmx[i] = {inf,  0,  inf,  inf,  mn[i],  inf,  inf,  inf,  inf,  inf,  inf,  0,  a[i],  a[i],  a[i]};
		else if(k == 2) nmx[i] = {inf, 0, inf, a[i], a[i], inf, inf, inf, inf, inf, inf, inf, inf, inf, inf};
		else nmx[i] = {inf,  inf,  inf,  inf,  inf,  inf,  inf,  inf,  inf,  inf,  inf,  inf,  inf,  inf,  a[i]};
	}
	U([&](auto &&self, int u) -> void
	{
		if(fa[0][u]) web[u].erase(find(web[u].begin(), web[u].end(), fa[0][u]));
		tfa[0][u] = nmx[u];
		rtfa[0][u] = nmx[u];
		for(int i=1;(1<<i)<=dep[u];i++)
		{
			fa[i][u] = fa[i-1][fa[i-1][u]];
			tfa[i][u] = tfa[i-1][u] * tfa[i-1][fa[i-1][u]];
			rtfa[i][u] = rtfa[i-1][fa[i-1][u]] * rtfa[i-1][u];
		}
		for(int v : web[u])
		{
			fa[0][v] = u;
			dep[v] = dep[u] + 1;
			self(self, v);
		}
	})(1);
	// // V3 X = nmx[5] * (nmx[3] * (nmx[2] * (nmx[1] * (nmx[9] * (nmx[10] * V3{0, inf, inf})))));
	// V3 X = {0, inf, inf}; printf("[%lld\n %lld\n %lld]\n", X.a, X.b, X.c);
	// X = nmx[10] * X; printf("[%lld\n %lld\n %lld]\n", X.a, X.b, X.c);
	// X = nmx[9] * X; printf("[%lld\n %lld\n %lld]\n", X.a, X.b, X.c);
	// X = nmx[1] * X; printf("[%lld\n %lld\n %lld]\n", X.a, X.b, X.c);
	// X = nmx[2] * X; printf("[%lld\n %lld\n %lld]\n", X.a, X.b, X.c);
	// X = nmx[3] * X; printf("[%lld\n %lld\n %lld]\n", X.a, X.b, X.c);
	// X = nmx[5] * X; printf("[%lld\n %lld\n %lld]\n", X.a, X.b, X.c);
	
	while(q--)
	{
		int s, t;
		scanf("%d%d", &s, &t);
		matrix mull = I, mulr = I;
		for(int i=17;i>=0;i--)
		{
			if(dep[s] - dep[t] >= (1 << i))
			{
				mull = mull * tfa[i][s];
				s = fa[i][s];
			}
			if(dep[t] - dep[s] >= (1 << i))
			{
				mulr = rtfa[i][t] * mulr;
				t = fa[i][t];
			}
		}
		for(int i=17;i>=0;i--)
		{
			if(fa[i][s] != fa[i][t])
			{
				mull = mull * tfa[i][s];
				s = fa[i][s];
				mulr = rtfa[i][t] * mulr;
				t = fa[i][t];
			}
		}
		matrix ans;
		if(s == t)
		{
			ans = mull * nmx[s] * mulr;
		}
		else
		{
			assert(fa[0][s] == fa[0][t]);
			ans = mull * nmx[s] * nmx[fa[0][s]] * nmx[t] * mulr;
		}
		// for(int i=0;i<5;i++)
		// {
		// 	for(int j=0;j<5;j++)
		// 	{
		// 		printf("%lld%c", ans.st[i][j], " \n"[j + 1 == 5]);
		// 	}
		// }
		// printf("ans = [%lld %lld %lld\n       %lld %lld %lld\n       %lld %lld %lld]\n", ans.a, ans.b, ans.c, ans.d, ans.e, ans.f, ans.g, ans.h, ans.i);
		printf("%lld\n", k == 1 ? ans.a44 : (k == 2 ? ans.a10 : ans.a40));
	}
	return 0;
}
// lyj 痛定思痛决定再也不卡空间了，开 1GB（
// 这 1GB 救了我的命啊
```

$33.37\mathrm{s}$，比这个慢的自己好好反省。

:::