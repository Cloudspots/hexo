---
title: 题解：P1312 [NOIP 2011 提高组] Mayan 游戏
date: 2025-3-26 16:58:39
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
首先一看，这题显然是搜索题。

为什么呢？首先进行分析。容易注意到通常情况下向右移动永远可以和向左移动替换，而字典序显然更小，于是可以只枚举向右移动。但是有特例就是左边没有元素，此时只能左移。

设 $r$ 为行数（在本题 $=7$），$c$ 为列数（在本题 $=5$）。直接爆搜时间复杂度是 $\mathcal O((rc)^n \times krc) = \mathcal O(k(rc)^{n+1})$，其中 $k$ 是平均情况下一次消除所需要的消除轮数，应当接近于 $1$。取 $k=1$，则时间复杂度计算结果在本题低达 $1,838,265,625$，而爆搜实际上应当跑不满，所以应当能过。

代码：

```cpp
#include <cstdio>
#include <cstdlib>
#include <algorithm>

using namespace std;

int a[10][10][10];

constexpr int r = 7, c = 5; // 使用 constexpr 声明编译期常量。通常情况下不劣于 const，但是功能相似。

// 下落
// 保证严格 O(rc)
// 唉唉唉 cache 不太友好
void qwqdown(int id)
{
	// 枚举每一列，在单独的列上下落
	for (int i = 1; i <= c; i++)
	{
		int cur = r;
		for (int j = r; j >= 1; j--)
		{
			if (a[id][j][i]) swap(a[id][j][i], a[id][cur][i]);
			if (a[id][cur][i]) cur--;
		}
	}
}

// 消除
// 大概 O(krc)
void tmp(int id)
{
	auto a = ::a[id];
	int cnt = 0;
	do
	{
		cnt = 0;
		bool** t = new bool*[r + 5];
		for (int i = 1; i <= r; i++)
		{
			t[i] = new bool[c + 5];
			for (int j = 1; j <= c; j++)
			{
				if (!a[i][j])
				{
					t[i][j] = false;
					continue;
				}
				if (i >= 3 && a[i][j] == a[i - 1][j] && a[i][j] == a[i - 2][j] ||
					i >= 2 && i <= r - 1 && a[i][j] == a[i - 1][j] && a[i][j] == a[i + 1][j] ||
					i <= r - 2 && a[i][j] == a[i + 1][j] && a[i][j] == a[i + 2][j] ||
					j >= 3 && a[i][j] == a[i][j - 1] && a[i][j] == a[i][j - 2] ||
					j >= 2 && j <= c - 1 && a[i][j] == a[i][j - 1] && a[i][j] == a[i][j + 1] ||
					j <= c - 2 && a[i][j] == a[i][j + 1] && a[i][j] == a[i][j + 2]
					) t[i][j] = true;
				else t[i][j] = false;
			}
		}
		for (int i = 1; i <= r; i++)
		{
			for (int j = 1; j <= c; j++)
			{
				if ((cnt += t[i][j]) * t[i][j]) a[i][j] = 0;
			}
			delete[] t[i];
		}
		delete[] t;
		qwqdown(id);
	} while (cnt);
}

class step
{
public:
	int x, y, f;
	step() {}
	step(int x, int y, int f) { this->x = x; this->y = y; this->f = f; }
	friend bool operator==(const step& x, const step& y) { return x.x == y.x && x.y == y.y && x.f == y.f; }
} steps[10];

void dfs(int n, int id)
{
	auto a = ::a[id];
	if (id > n)
	{
		// a = ::a[n];
		for (int i = 1; i <= c; i++)
		{
			if (a[r][i]) return;
		}
		for (int i = 1; i <= n; i++)
		{
			printf("%d %d %d\n", steps[i].x, steps[i].y, steps[i].f);
		}
		exit(0);
	}
	for (int j = 1; j <= c; j++)
	{
		for (int i = r; i >= 1; i--)
		{
			if (a[i][j] == 0) continue;
			auto b = ::a[id + 1];
			if (j != c)
			{
				copy(a[0], a[9] + 10, b[0]);
				swap(b[i][j], b[i][j + 1]);
				steps[id] = { j-1, r - i, 1 };
				if (b[i][j] == 0) qwqdown(id + 1);
				tmp(id + 1);
				dfs(n, id + 1);
			}

			if (j != 1)
			{
				if (a[i][j - 1]) continue;
				copy(a[0], a[9] + 10, b[0]);
				swap(b[i][j], b[i][j - 1]);
				steps[id] = { j-1, r - i, -1 };
				if (b[i][j] == 0) qwqdown(id + 1);
				tmp(id + 1);
				dfs(n, id + 1);
			}
		}
	}
}

int main()
{
	int n;
	scanf("%d", &n);
	for (int i = 1; i <= c; i++)
	{
		for (int j = 1;; j++)
		{
			scanf("%d", a[1][r - j + 1] + i);
			if (a[1][r - j + 1][i] == 0) break;
		}
	}
	dfs(n, 1);
	printf("-1\n");
	return 0;
}
// manim puzzle（幻视）
// 3B1B：我做的 python lib 不是用来玩的啊……等等……damn
```