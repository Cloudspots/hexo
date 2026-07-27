---
title: 题解：CF225C Barcode
date: 2025-5-22 20:58:02
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
首先因为每一列颜色都要相同，所以都改为 `.` 或 `#` 都会产生代价（可能都不为 0，可能有一个是 0）。

所以，问题就转化为，求一个 01 数列，其中第 $i$ 个元素若是 $0$ 就会产生 $a_{i,0}$ 的代价，若是 $1$ 则产生 $a_{i,1}$ 的代价，满足任意极长的颜色相同的子串（连续）的长度都属于 $[x,y]$，最小化代价。

考虑 dp。

显然地，我们可以令 $f_{i,j,k}$ 代表考虑前 $i$ 个项，而最后一个元素相同（都为 $k$）的极长子串长度为 $j$，其中 $j \le y$（不一定要 $\ge x$）的序列的最小代价。

那么考虑转移。显然地，对于每一个状态我们都可以考虑两种情况：

- 在序列最后邪恶地打断这个子串。由 $f_{i-1,j,k}$ 转移到 $f_{i,1,1-k}$，代价为 $a_{i,1-k}$，其中 $j \ge x$。
- 在序列最后善良地加上一个相同的元素。由 $f_{i-1,j-1,k}$ 转移到 $f_{i,j,k}$，代价为 $a_{i,k}$，其中 $j\le y$。

边界条件在 $f_{0,j,k}$ 时不好考虑，但是 $f_{1,j,k}$ 时容易考虑：$f_{1,1,k}=a_{1,k}$。容易发现 $j\le i$，故不需要考虑更多元素了。

做完了？

我们注意到状态数是 $\Theta(n^2)$ 的，而转移是 $\mathcal O(n)$ 的，炸。当然解法也很简单，对于每个 $f_{i,\cdot,k}$ 处理出当 $j\ge x$ 时的 $\min$ 即可。

做完了。

什么你问答案是多少？显然地就是所有 $f_{m,j,k}$ 的最小值，其中 $x \le j \le y$。

注意列数是 $m$，~~我们要的是一个数*列*~~ 我们是把每一列压缩成了一个元素（因为列元素相同），所以元素个数是列数。

嗯可以开一个滚动数组压空间。可以做到 $\Theta(m)$ 的空间复杂度。

代码：

```cpp
// 多学习，少魔怔
#include <cmath>
#include <cstdio>
#include <cstring>

using namespace std;

// 然后滚动数组。
int f[1005][5];
int a[1005][5];
int jx[1005][5];

int main()
{
	int n, m, x, y;
	scanf("%d%d%d%d", &n, &m, &x, &y);
	for (int i = 1; i <= n; i++)
	{
		while (getchar() != '\n'); // 我一直在用的一个去除矩阵末尾换行的方法，\r\n 或者 \n 均适用。
		for (int j = 1; j <= m; j++)
		{
			a[j][getchar() == '#' ? 1 : 0]++;
		}
	}
	f[1][0] = a[1][0]; f[1][1] = a[1][1];
	memset(jx, 0x66, sizeof jx); // 0x66 就是用来玩的 :)，0x66666666 也是相当大的一个值了，但是对于 int 不会溢出。
	if (1 >= x) jx[1][0] = a[1][0];
	if (1 >= x) jx[1][1] = a[1][1];
	for (int i = 2; i <= m; i++)
	{
		for (int j = min(i, y); j >= 1; j--)
		{
			for (int k = 0; k <= 1; k++)
			{
				if (j == 1) f[j][k] = jx[i - 1][1 - k] + a[i][k]; // 特有转移
				else f[j][k] = f[j - 1][k] + a[i][k];
				if (j >= x && f[j][k] < jx[i][k]) jx[i][k] = f[j][k];
			}
		}
	}
	int minn = 2147483647;
	// 这题没有保证 y <= m，很难绷。甚至有 y=7, m=5 的点。
	for (int i = x; i <= y && i <= m; i++)
	{
		if (f[i][0] < minn) minn = f[i][0];
		if (f[i][1] < minn) minn = f[i][1];
	}
	printf("%d\n", minn);
	return 0;
}
```

bonus time:

![](pEzn810.png)

然后发现这一段其实没用。