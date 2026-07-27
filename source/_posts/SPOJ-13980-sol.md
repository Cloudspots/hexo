---
title: 题解：SP13980 SUDOGOB - Sudoku goblin
date: 2025-3-26 14:20:51
categories:
  - Solution
tags:
  - Solution
  - SPOJ Problem Solution
---
一道 DLX 题目，但是显然地这个蒟蒻不会 DLX。所以考虑纯粹的暴力。

考虑优化。

首先是经典的优化。我们使用回溯解决这道题目。使用三个数组，每个大小为 $9$（更多也行），分别表示行、列、宫（即 $3 \times 3$ 方阵）中有没有出现过 $1 \sim 9$。

具体地，我们使用二进制。对应位为 $1$ 表示出现了某个数字，反之亦然。

考虑进阶优化。显然我们可以先考虑限制比较多，即可能填入的数字数量比较小的空。

具体地，我们假设这个空现在没有填数字（如果有，那么显然只能是 $1$ 种）。

则它会受到行、列和宫的限制。则我们把代表对应行、列、宫的限制数组做二进制按位或运算即可得到总限制，再取反再求二进制中 $1$ 的个数即可得到可能填入的数字数量。

具体地：

```cpp
#include <queue>
#include <utility>
#include <cstdio>
#include <algorithm>

using namespace std;

unsigned countbit(unsigned x) noexcept
{
	unsigned cnt = 0;
	while (x)
	{
		cnt++;
		x -= (x & -x);
	}
	return cnt;
}

int a[15][15];
int b[15][15];
int maxn = -1;
// 我就不用 bitset，你打我噻，你打我噻~
unsigned row[15], col[15], hou[15];
constexpr int grow(int x, int y) noexcept { return x; }
// int krow(int x, int y) { return y - 1; }
constexpr int gcol(int x, int y) noexcept { return y; }
// int kcol(int x, int y) { return x - 1; }
constexpr int ghou(int x, int y) noexcept { return (x - 1) / 3 * 3 + (y - 1) / 3 + 1; }
// int khou(int x, int y) { return (x - 1) % 3 * 3 + (y - 1) % 3; }
constexpr int rval(int x, int y) noexcept { return min(min(x, 10 - x), min(y, 10 - y)) + 5; }

// 自由度
int vval(int x, int y) noexcept { return a[x][y] ? 100 : countbit(~((row[grow(x, y)]) | (col[gcol(x, y)]) | (hou[ghou(x, y)]))); }

pair<int, int> calc()
{
	int minn = 1000, x, y;
	for (int i = 1; i <= 9; i++)
	{
		for (int j = 1; j <= 9; j++)
		{
			if (vval(i, j) < minn)
			{
				minn = vval(i, j);
				x = i;
				y = j;
			}
		}
	}
	return { x, y };
}

int dfs()
{
	int x, y;
	auto res = calc();
	x = res.first;
	y = res.second;
	if (a[x][y])
	{
		copy(&a[0][0], &a[14][15], &b[0][0]);
		return 1;
	}
	int sum = 0;
	for (int i = 9; i >= 1; i--)
	{
		if (row[grow(x, y)] & (1u << (i - 1))) continue;
		if (col[gcol(x, y)] & (1u << (i - 1))) continue;
		if (hou[ghou(x, y)] & (1u << (i - 1))) continue;

		row[grow(x, y)] |= (1u << (i - 1));
		col[gcol(x, y)] |= (1u << (i - 1));
		hou[ghou(x, y)] |= (1u << (i - 1));

		a[x][y] = i;
		sum += dfs();
		a[x][y] = 0;
		row[grow(x, y)] &= ~(1u << (i - 1));
		col[gcol(x, y)] &= ~(1u << (i - 1));
		hou[ghou(x, y)] &= ~(1u << (i - 1));
	}
	return sum;
}

int main()
{
	int t;
	scanf("%d", &t);
	while (t--)
	{
		fill(a[0] + 0, a[14] + 15, 0);
		fill(row, row + 15, 0);
		fill(col, col + 15, 0);
		fill(hou, hou + 15, 0);
		bool flag = false;
		for (int i = 1; i <= 9; i++)
		{
			for (int j = 1; j <= 9; j++)
			{
				scanf("%d", a[i] + j);
				if (a[i][j])
				{
					if (row[grow(i, j)] & (1 << (a[i][j] - 1))) flag = true;
					if (col[gcol(i, j)] & (1 << (a[i][j] - 1))) flag = true;
					if (hou[ghou(i, j)] & (1 << (a[i][j] - 1))) flag = true;
					row[grow(i, j)] |= (1u << (a[i][j] - 1));
					col[gcol(i, j)] |= (1u << (a[i][j] - 1));
					hou[ghou(i, j)] |= (1u << (a[i][j] - 1));
				}
			}
		}
		if (flag) goto ee;
		int d;
		printf("%d\n", d = dfs());
		if (d == 1)
		{
			for (int i = 1; i <= 9; i++)
			{
				for (int j = 1; j <= 9; j++)
				{
					printf("%d%c", b[i][j], " \n"[j == 9]);
				}
			}
		}
		continue;
	ee:
		printf("0\n");
	}
	return 0;
}
```

习题：P1784 数独、P1074 靶形数独。