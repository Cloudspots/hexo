---
title: 题解：P11669 [USACO25JAN] Cow Checkups B
date: 2025-2-4 09:59:24
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
考虑可爱的区间 DP。

我们注意到，如果我们知道 $l\sim r$ 翻转的结果，那么就可以 $\Theta(1)$ 求出 $l - 1 \sim r + 1$ 的结果。

有两种 dp 方法：

1. $f_{l,r}$ 表示翻转 $l \sim r$ 的结果。
2. $f_{m,r}$ 表示翻转 $m-r \sim m+r$ 的结果。

第一种更简单，第二种和思路更符合。而这个蒟蒻赛时没有想到第一种做法，所以讲第二种。

首先，注意到 $m$ 和 $r$ 可能并非整数，比如 $m=114.5$ 且 $r=14.5$ 的时候 $m-r=100$ 且 $m+r=129$，都为整数，是一种合法的翻转方式。

但同时注意到若 $m-r$ 和 $m+r$ 都为整数，则 $(m-r)+(m+r)=2m$ 也是整数，所以 $m$ 要么是整数，要么是一个整数 $+0.5$，$r$ 同理。

故我们分类讨论。

令不翻转的结果是 $s$，则：

$m$ 为整数的基础情形是 $f_{m,0}=s$。

$m$ 不为整数的基础情形是 $f_{m,0.5}=s+\text{翻转后 m-0.5 是否匹配}+\text{翻转后 m+0.5 是否匹配}-\text{翻转前 m-0.5 是否匹配}-\text{翻转前 m+0.5 是否匹配}$

状态转移方程是 $f_{m,i}=f_{m,i-1}+\text{翻转后 m-i 是否匹配}+\text{翻转后 m+i 是否匹配}-\text{翻转前 m-i 是否匹配}-\text{翻转前 m+i 是否匹配}$。

虽然注意到 $m$ 不为整数的时候的基础情形和状态转移方程非常像，可以直接定义 $f_{m,-0.5}=s$，但是这个人太蒻了考场上没想出来。

同时，由于数组并不支持浮点数下标，所以写代码的时候用两个 dp 数组，一个表示整数，一个表示小数，然而两个维度数字都 $-0.5$。

考场代码非常可爱。

```cpp
﻿// 考虑区间 Dynamic Programming.
// 注意到对于同一个中心，我们可以 O(1) 快速扩展
// 总共有 2n-1 个中心，每个最多能扩展 n 次
// 时间复杂度 O(n^2)
//
// 实现细节：中心可能是小数。
// 所以可以两次区间 DP
#include <cstdio>

using namespace std;

int dp1[7505][3755]; // 其实第二维不需要开这么大，
int dp2[7505][3755]; // 但是不 MLE 就行
int a[7505];
int b[7505];
int cnt[7505];
int exchange(int x, int y)
{
	return int(a[x] == b[y]) + int(a[y] == b[x]) - int(a[x] == b[x]) - int(a[y] == b[y]);
}

int main()
{
	int n;
	scanf("%d", &n);
	int yyy_loves_OI = 0;
	for (int i = 1; i <= n; i++)
	{
		scanf("%d", a + i);
	}
	for (int i = 1; i <= n; i++)
	{
		scanf("%d", b + i);
		yyy_loves_OI += (b[i] == a[i]);
	}
	// ----------Part.1----------
	// 中心为整数时半径可以为 0，此时 l = r
	for (int OoO = 1; OoO <= n; OoO++)
	{
		cnt[dp1[OoO][0] = yyy_loves_OI]++;
		// 枚举半径
		for (int RrR = 1; OoO - RrR >= 1 && OoO + RrR <= n; RrR++)
		{
			// 真的不是压行大师啊呜呜
			cnt[dp1[OoO][RrR] = dp1[OoO][RrR - 1] + exchange(OoO - RrR, OoO + RrR)]++;
		}
	}
	// ----------Part.2----------
	for (int OoO = 1; OoO < n; OoO++)
	{
		cnt[dp2[OoO][0] = yyy_loves_OI + exchange(OoO, OoO + 1)]++;
		for (int RrR = 1; OoO - RrR >= 1 && OoO + RrR + 1 <= n; RrR++)
		{
			// 真的不是压行大师啊呜呜
			cnt[dp2[OoO][RrR] = dp2[OoO][RrR - 1] + exchange(OoO - RrR, OoO + RrR + 1)]++;
		}
	}
	for (int i = 0; i <= n; i++)
	{
		printf("%d\n", cnt[i]);
	}
	return 0;
}
```