---
title: 题解：P11668 [USACO25JAN] It's Mooin' Time II B
date: 2025-2-4 08:39:57
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
考虑每个数字 $m$ 可以形成多少种不同的 $\text{moo}$。

显然，如果后面有至少两个数字 $o$，则可以形成 $\text{moo}$。

而前面的 $m$ 一定比后面的不劣，因为各个数字的数量单调不增。

所以我们考虑使用一个数组 $f_{i,j}$ 表示位置 $\ge i$ 的数字 $j$ 的数量。

于是我们发现空间复杂度为 $\Theta(N^2)$，无法承受。

考虑类似背包的滚动数组。

首先从后往前扫一遍，得到 $f_{1,x}$，也就是权值数组。

同时维护一个变量 $\text{cnt}$，表示位置 $\ge i$ 的出现次数 $\ge 2$ 的字母的数量，其中 $i$ 是滚动数组过程中当前的 $i$。

由于 $\text{moo}$ 中 $m$ 不能等于 $o$，所以位置为 $i$ 时答案为 $\text{cnt}-f_{i,m}$。

如何维护 $f$？显然从前往后扫，只需要把对应数字出现次数 $-1$ 即可。

如何维护 $\text{cnt}$？初始值直接从 $f$ 中获取，如果维护 $f$ 过程中把某个 $2$ 减到了 $1$，则 $\text{cnt} \gets \text{cnt}-1$。

赛时抽象代码。

```cpp
﻿#include <cstdio>

using namespace std;

int  krnlntos[1000005];
int  ntoskrnl[1000005];
bool snrlntok[1000005];
bool ntslrnko[1000005];

void sotnlnrk(int Int, int iNt, long long &longlong)
{
	int first = ntoskrnl[Int];
	int second = ntoskrnl[Int] += iNt;
	if (first < 2 && second >= 2) longlong++;
	if (first >= 2 && second < 2) longlong--;
	if (second >= 2) snrlntok[Int] = true;
	else snrlntok[Int] = false;
}

int main()
{
	int n;
	scanf("%d", &n);
	long long notsknrl = 0;
	for (int i = 1; i <= n; i++)
	{
		scanf("%d", krnlntos + i);
		sotnlnrk(krnlntos[i], 1, notsknrl);
	}
	long long nlkrosnt = 0;
	for (int i = 1; i <= n; i++)
	{
		sotnlnrk(krnlntos[i], -1, notsknrl);
		if (ntslrnko[krnlntos[i]]) continue;
		ntslrnko[krnlntos[i]] = true;
		nlkrosnt += notsknrl - snrlntok[krnlntos[i]];
	}
	printf("%lld\n", nlkrosnt);
	return 0;
}
```

------

娱乐·闲话：

> 声明：我只公开了这一部分代码，我认为没有人可以从代码中推测出来 USACO 题目。况且我当时想的也不是正解，发完才想到正解。

![](pEZbvKx.png)

![](pEZbXx1.png)

![](pEZbO2R.png)