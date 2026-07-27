---
title: 题解：P15352 [COCI 2025/2026 #4] 魔术 / Magija
date: 2026-3-23 16:52:56
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
## $56$ 分

注意到对 $[l,l+\text{len}-1]$ 和 $[r,r+\text{len}-1]$ 进行操作相当于对 $l+i$ 和 $r+i$ 进行合并（$1\le i<\text{len}$）。暴力并查集即可。时间复杂度 $O(nm\alpha(n))$。

## $73$ 分

并查集常数小，上面的做法实际上可以拿到 $73$ 分。

## $110$ 分

我们的思想是，一般情况下，很快几乎所有的数字都被合并到一起了。所以我们设定阈值 $B$，同时记录两个变量 $\text{lm},\text{rm}$。对于每次修改操作 $l,r,\text{len}$，如果当前尝试合并的次数 $\le B$ 那么执行朴素算法同时执行 $\text{lm}\gets\min(\text{lm},l),\text{rm}\gets\max(\text{rm},r+\text{len}-1)$，否则只执行后一步。对于查询操作，如果当前尝试合并的次数 $\le B$ 那么执行朴素算法，否则如果询问的 $x\in[\text{lm},\text{rm}]$ 那么答案为 $[\text{lm},\text{rm}]$。否则，答案显然为 $[x,x]$。我们不妨钦定数据是随机的，取 $B=10^7$，于是就通过了此题。

:::info[sub&code]
[sub](https://www.luogu.com.cn/record/271653321)。

```cpp
#include <cstdio>
#include <algorithm>
#include <numeric>

using namespace std;

unsigned fa[200005], rk[200005];
unsigned mn[200005], mx[200005]; // ~3MB in total
unsigned getfa(int x) { while(x != fa[x]) x = fa[x] = fa[fa[x]]; return x; }
void merge(unsigned x, unsigned y)
{
	x = getfa(x); y = getfa(y);
	if(x == y) return;
	if(rk[x] <= rk[y])
	{
		fa[x] = y;
		// rk[y] += !(rk[y] - rk[x]);
		if(rk[x] == rk[y]) rk[y]++;
		if(mn[x] < mn[y]) mn[y] = mn[x];
		if(mx[x] > mx[y]) mx[y] = mx[x];
	}
	else
	{
		if(mn[y] < mn[x]) mn[x] = mn[y];
		if(mx[y] > mx[x]) mx[x] = mx[y];
		fa[y] = x;
	}
}

#ifndef ONLINE_JUDGE
#define getchar_unlocked _getchar_nolock
#endif

unsigned qread()
{
	char ch;
	while((ch = getchar_unlocked()) < '0' || ch > '9');
	unsigned res = 0;
	do
	{
		res = res * 10 + (ch - '0');
	} while((ch = getchar_unlocked()) >= '0' && ch <= '9');
	return res;
}

int main()
{
	// freopen("P15352.in", "r", stdin);
	// freopen("P15352.out", "w", stdout);
	unsigned n, q;
	// scanf("%d%d", &n, &q);
	n = qread(); q = qread();
	iota(fa, fa + n + 5, 0);
	iota(mn, mn + n + 5, 0);
	iota(mx, mx + n + 5, 0);
	int minn = 0x3f3f3f3f, maxn = 0;
    int cnt = 0;
	while(q--)
	{
		unsigned op;
		// scanf("%d", &op);
		op = qread();
		if(op == 1)
		{
			unsigned x = qread();
			if(cnt <= 10000000 || n <= 10000) printf("%u %u\n", mn[getfa(x)], mx[getfa(x)]);
			else
			{
				if(minn <= x && x <= maxn) printf("%u %u\n", minn, maxn);
				else printf("%u %u\n", x, x);
			}
		}
		else
		{
			unsigned l = qread(), r = qread(), len = qread();
			if(l < minn) minn = l;
			if(r + len - 1 > maxn) maxn = r + len - 1;
			if(cnt <= 10000000 || n <= 10000)
			{
				while(len--)
				{
					merge(l++, r++);
                    cnt++;
				}
			}
		}
	}
	return 0;
}
```
:::