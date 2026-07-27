---
title: 树状数组做区间加法区间查询的技巧，及二维树状数组
date: 2025-10-15 16:09:45
categories:
  - Algorithm & Theory
tags: []
---
现在只是写写。等树状数组的文章完工后会把这篇文章合并进去。

## 树状数组做区间加法区间查询

区间加法单点查询？显然可以改为前缀加法单点查询。

做差分即可。

对于区间加法区间查询？先改为前缀加法前缀查询。

做差分：对 $1\sim y$ 加 $x$，只需要对 $d_1$ 加 $x$，$d_{y+1}$ 减 $x$ 即可。

然而求和还是要依赖原数组 $a$。如果用 $d$ 的话，需要利用 $a_i=\displaystyle\sum_{j=1}^i d_j$ 来做，结果就是 $\displaystyle\sum_{i=1}^k (k-i+1)d_i$。看上去做不了。

实际上呢？

容易发现 $\displaystyle\sum_{i=1}^k(k-i+1)d_i=\left(k\sum_{i=1}^k d_i\right)-\sum_{i=1}^k (i-1)d_i$。我们只需要用两个树状数组分别记录 $d_i$ 和 $(i-1)d_i$ 即可。时间复杂度和线段树一样，都是 $\mathcal O(\log n)$ 的。

利用哈希表可以用这个做出一个区间加法区间查询的“动态开点树状数组”，只不过常数很大就是了。对于一些问题可以不写动态开点线段树。

::anti-ai[Magic!]

:::info[模版题 [P3372](https://www.luogu.com.cn/problem/P3372) 的代码]
```cpp
// 神秘的树状数组 Mysterious BIT Trick
#include <cstdio>

using namespace std;

long long bt[100005];
long long bb[100005];
const auto lb = [](unsigned long long x) { return x & -x; };

void addid(int n, int x, long long y)
{
    do
    {
        bt[x] += y;
    } while ((x += lb(x)) <= n);
}
long long sumid(int x)
{
    long long sum = 0;
    do
    {
        sum += bt[x];
    } while (x -= lb(x));
    return sum;
}
void addd(int n, int x, long long y)
{
    do
    {
        bb[x] += y;
    } while ((x += lb(x)) <= n);
}
long long sumd(int x)
{
    long long sum = 0;
    do
    {
        sum += bb[x];
    } while (x -= lb(x));
    return sum;
}

long long a[100005];

int main()
{
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; i++)
    {
        scanf("%lld", a + i);
        addid(n, i, (a[i] - a[i - 1]) * (i - 1));
        addd(n, i, (a[i] - a[i - 1]));
    }
    while (m--)
    {
        int op, x, y;
        scanf("%d%d%d", &op, &x, &y);
        if (op == 1)
        {
            long long k;
            scanf("%lld", &k);
            addid(n, x, k * (x - 1));
            addid(n, y + 1, -k * y);
            addd(n, x, k);
            addd(n, y + 1, -k);
        }
        else printf("%lld\n", (y * sumd(y) - sumid(y)) - ((x - 1) * sumd(x - 1) - sumid(x - 1)));
    }
    return 0;
}
```
:::

## 二维树状数组

单点加法，子矩阵求和。

虽然四分树复杂度是假的，但是类似四分树的二维树状数组时间复杂度是正确的。

不难猜测，二维树状数组 $b_{i,j}$ 代表 $\displaystyle\sum_{x=i-\mathrm{lowbit}(i)+1}^{i}\sum_{y=j-\mathrm{lowbit}(j)+1}^{j}a_{i,j}$。那么，先考虑怎么子矩阵求和。

显然转化为一个左上角的矩阵的问题，也就是矩阵的一个顶点是 $(1,1)$。

容易发现，固定 $i$ 之后，树状数组 $b_{i,j}$ 就相当于 $\displaystyle\sum_{x=i-\mathrm{lowbit}(i)+1}^{i}a_{i,\cdot}$ 的树状数组。也就是说，这类似于树状数组套树状数组。因此，我们可以仿照一维树状数组的方式，这样求和。

```cpp
long long sum(unsigned long long x, unsigned long long y)
{
  long long sum = 0;
	for (unsigned long long i = x; i > 0; i -= lb(i))
	{
		for (unsigned long long j = y; j > 0; j -= lb(j))
		{
			sum += bt[i][j];
		}
	}
	return sum;
}
```

单点修改也很简单，按照上面的原理，这样就可以实现单点修改了。

```cpp
void add(unsigned long long n, unsigned long long x, unsigned long long y, long long val)
{
	for (unsigned long long i = x; i <= n; i += lb(i))
	{
		for (unsigned long long j = y; j <= n; j += lb(j))
		{
			bt[i][j] += val;
		}
	}
}
```

:::info[模版题 [LOJ #133](https://loj.ac/p/133) 代码]

```cpp
#include <cstdio>

using namespace std;

long long bt[5000][5000];
const auto lb = [](unsigned long long x) { return x & -x; };
void add(unsigned long long n, unsigned long long m, unsigned long long x, unsigned long long y, long long val)
{
	for (unsigned long long i = x; i <= n; i += lb(i))
	{
		for (unsigned long long j = y; j <= m; j += lb(j))
		{
			bt[i][j] += val;
		}
	}
}
long long sum(unsigned long long x, unsigned long long y)
{
	long long sum = 0;
	for (unsigned long long i = x; i > 0; i -= lb(i))
	{
		for (unsigned long long j = y; j > 0; j -= lb(j))
		{
			sum += bt[i][j];
		}
	}
	return sum;
}

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	int op, x0, y0;
	while(scanf("%d%d%d", &op, &x0, &y0) == 3)
	{
		if (op == 1)
		{
			long long k;
			scanf("%lld", &k);
			add(n, m, x0, y0, k);
		}
		else
		{
			int x1, y1;
			scanf("%d%d", &x1, &y1);
			printf("%lld\n", sum(x1, y1) - sum(x0 - 1, y1) - sum(x1, y0 - 1) + sum(x0 - 1, y0 - 1));
		}
	}
	return 0;
}
```

:::

## 二维树状数组做子矩阵加法子矩阵查询

依旧推式子。定义 $d_{i,j}=a_{i,j}-a_{i-1,j}-a_{i,j-1}+a_{i-1,j-1}$。

则 $\displaystyle\sum_{i=1}^{x}\sum_{j=1}^{y}a_i=\displaystyle\sum_{i=1}^x\sum_{j=1}^y\sum_{i'=1}^i\sum_{j'=1}^j d_{i,j}=\displaystyle\sum_{i=1}^x\sum_{j=1}^y (x-i+1)(y-j+1)d_{i,j}=\displaystyle\sum_{i=1}^x\sum_{j=1}^y\left(xyd_{i,j}-y(i-1)d_{i,j}-x(j-1)d_{i,j}+(i-1)(j-1)d_{i,j}\right)$。

开四个树状数组分别维护 $d_{i,j}$，$(i-1)d_{i,j}$，$(j-1)d_{i,j}$ 和 $(i-1)(j-1)d_{i,j}$ 即可。

:::info[模版题 [LOJ #135](https://loj.ac/p/135) 代码]

我草，WA 了好久都在瞪下面的树状数组，结果是上面的一个 $2050$ 打成了 $205$。

```cpp
#include <cstdio>
#include <type_traits>
using namespace std;

long long bt[2050][2050], ibt[2050][2050], jbt[2050][2050], ijbt[2050][2050];
const auto lb = [](long long x) { return x & -x; };
void add(long long n, long long m, long long x, long long y, long long val)
{
	for (long long i = x; i <= n; i += lb(i))
	{
		for (long long j = y; j <= m; j += lb(j))
		{
			bt[i][j] += val;
			ibt[i][j] += (x - 1) * val;
			jbt[i][j] += (y - 1) * val;
			ijbt[i][j] += (x - 1) * (y - 1) * val;
		}
	}
}
long long sum(long long x, long long y)
{
	long long sum = 0;
	for (long long i = x; i > 0; i -= lb(i))
	{
		for (long long j = y; j > 0; j -= lb(j))
		{
			sum += x * y * bt[i][j] - x * jbt[i][j] - y * ibt[i][j] + ijbt[i][j];
		}
	}
	return sum;
}

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	int op, x0, y0, x1, y1;
	while(scanf("%d%d%d%d%d", &op, &x0, &y0, &x1, &y1) == 5)
	{
		if (op == 1)
		{
			long long k;
			scanf("%lld", &k);
			add(n, m, x1 + 1, y1 + 1, k);
			add(n, m, x1 + 1, y0, -k);
			add(n, m, x0, y1 + 1, -k);
			add(n, m, x0, y0, k);
		}
		else
		{
			// int x1, y1;
			// scanf("%d%d", &x1, &y1);
			printf("%lld\n", sum(x1, y1) - sum(x0 - 1, y1) - sum(x1, y0 - 1) + sum(x0 - 1, y0 - 1));
		}
	}
	return 0;
}
```

:::

## 例题

异或的性质也很好，树状数组可以维护。

::::info[[CF341D](https://www.luogu.com.cn/problem/CF341D)]

:::info[分析]

依旧推式子。$\oplus$ 表示异或。$d_{i,j}=a_{i,j}\oplus a_{i-1,j}\oplus a_{i,j-1}\oplus a_{i-1,j-1}$，容易验证 $a_{i,j}=\displaystyle\bigoplus_{x=1}^i\bigoplus_{y=1}^jd_{x,y}$。

那么 $\displaystyle\bigoplus_{x=1}^i\bigoplus_{y=1}^j a_{x,y}$ 中，$d_{x,y}$ 会被异或 $(i-x+1)(j-y+1)$ 次。也就是说，当且仅当 $i$ 与 $x$ 模 $2$ 同余且 $j$ 与 $y$ 模 $2$ 同余，$d_{x,y}$ 才会被成功统计（不然是偶数就异或成 $0$ 了）。

开四个二维树状数组即可。修改只需要修改到四个点，直接分讨即可。

:::

:::info[代码]

```cpp
#include <cstdio>

using namespace std;

unsigned long long bt00[1005][1005], bt01[1005][1005], bt10[1005][1005], bt11[1005][1005];

const auto lb = [](unsigned long long x) { return x & -x; };

unsigned long long query(unsigned long long x, unsigned long long y)
{
	auto bt = (x & 1) ? ((y & 1) ? bt11 : bt10) : ((y & 1) ? bt01 : bt00);
	unsigned long long xorsum = 0;
	for (unsigned long long i = x; i; i -= lb(i))
	{
		for (unsigned long long j = y; j; j -= lb(j))
		{
			xorsum ^= bt[i][j];
		}
	}
	return xorsum;
}
void add(unsigned long long n, unsigned long long x, unsigned long long y, unsigned long long k)
{
	auto bt = (x & 1) ? ((y & 1) ? bt11 : bt10) : ((y & 1) ? bt01 : bt00);
	for (unsigned long long i = x; i <= n; i += lb(i))
	{
		for (unsigned long long j = y; j <= n; j += lb(j))
		{
			bt[i][j] ^= k;
		}
	}
}

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	for (int i = 1; i <= m; i++)
	{
		int op, x0, y0, x1, y1;
		scanf("%d%d%d%d%d", &op, &x0, &y0, &x1, &y1);
		if (op == 1) printf("%llu\n", query(x1, y1) ^ query(x0 - 1, y1) ^ query(x1, y0 - 1) ^ query(x0 - 1, y0 - 1));
		else
		{
			unsigned long long k;
			scanf("%llu", &k);
			add(n, x0, y0, k);
			add(n, x0, y1 + 1, k);
			add(n, x1 + 1, y0, k);
			add(n, x1 + 1, y1 + 1, k);
		}
	}
	return 0;
}
```

:::

::::