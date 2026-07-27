---
title: 题解：AT_abc441_e [ABC441E] A > B substring
date: 2026-1-19 13:37:54
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
考虑定一求一，枚举左端点。

我们发现一个区间 $[l,r]$ 满足条件等价于 $\mathrm{cntA}_r - \mathrm{cntA}_{l-1} > \mathrm{cntB}_r - \mathrm{cntB}_{l-1}$（其中 $\mathrm{cntA}$ 和 $\mathrm{cntB}$ 分别表示前缀 $\texttt A$ 和 $\texttt B$ 的数量），也就是 $\mathrm{cntA}_r - \mathrm{cntB}_r>\mathrm{cntA}_{l-1}-\mathrm{cntB}_{l-1}$。那我们就用 $S_i$ 来表示 $\mathrm{cntA}_i - \mathrm{cntB}_i$。

注意到 $S_r-S_{l-1}>0$ 等价于 $S_r>S_{l-1}$ 也就是 $S_r\ge S_{l-1}+1$，然而需要满足 $r\ge l$。那么在 $l$ 右移一位的时候删除掉原来的 $l$ 的 $S$ 值，然后累加答案即可。使用树状数组即可，树状数组处理后缀信息和前缀一样是 trivial 的。

我的代码里用的是反过来处理的方式，即左端点从右往左动。也是类似的。

:::info[代码&提交记录]

[submission](https://atcoder.jp/contests/abc441/submissions/72546608)。

```cpp
#include <cstdio>
#include <string>
#include <iostream>
#include <set>

using namespace std;

int amb[500005], xval[500005];

int xvv[1000010];

int qsum(int x)
{
	x = 500005 - x;
	int sum = 0;
	do
	{
		sum += xvv[x];
	} while (x -= x & -x);
	return sum;
}

void qadd(int x, int y)
{
	x = 500005 - x;
	do
	{
		xvv[x] += y;
	} while ((x += x & -x) <= 1000005);
}

int main()
{
	int n;
	scanf("%d", &n);
	string str;
	cin >> str;
	int cc = 0;
	set<int> st;
	for (int i = 0; i < n; i++)
	{
		xval[i] = (str[i] == 'A' ? 1 : (str[i] == 'B' ? -1 : 0));
		if (i == 0) amb[i] = xval[i];
		else amb[i] = amb[i - 1] + xval[i];
	}
	int ygg = 0;
	long long sum = 0;
	for (int i = n - 1; i >= 0; i--)
	{
		if (str[i] == 'A') ygg++;
		if (str[i] == 'B') ygg--;
		qadd(xval[i] - ygg, 1);
		sum += qsum(-ygg + 1);
	}
	printf("%lld\n", sum);
	return 0;
}
```
:::
