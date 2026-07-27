---
title: 题解：CF1256E Yet Another Division Into Teams
date: 2025-6-21 10:33:35
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
首先显然地有，必然存在最优解满足每组必然是排序后数组的连续的一段。

什么你问为什么？考虑局部调整，如果中间有一个元素 $x$ 在另一组中，那么把这个 $x$ 调整到原本应该在的组中，对于原本的组代价不变，而 $x$ 调整前在的组代价不会增加。重复进行这个操作，显然有限次数后会结束，代价不增。

那么我们就可以先进行一个序的排（升序，记得记录原来的编号），然后呢？

然后显然，如果一个队伍中有 $\ge 6$ 个学生，那么可以分为两组（每组都有 $\ge 3$ 个学生），但是代价不增（设分组的边界为 $a,b$，也就是分成的第一组中最大数为 $a$，第二组中最小数为 $b$，则代价减小了 $b-a \ge 0$），所以必然存在一个最优解满足每个队伍只有 $3\sim 5$ 个人。

这样就可以进行 dp 了。设 $f_i$ 为考虑（排序后）数组前 $i$ 个元素的最小代价，那么我们有 $f_i=\min(f_{i-3}+a_i-a_{i-2}, f_{i-4}+a_i-a_{i-3}, f_{i-5}+a_i-a_{i-4})$。

很不幸，这样仍然无法直接通过。因为 $\min$ 中 $f_{i-k}+a_i-a_{i-k+1}$ 的意义是选择长度为 $k$ 的组，所以这种转移能用当且仅当 $i=k$ 或者 $i-k\ge 3$。

最后就是这题烦人的点。还要输出每个人是在哪一组中。首先根据 dp 转移方程倒序推出排序后每个元素是在第几组（在 dp 过程中也可以，我代码里写的是倒序推理），然后根据元素的原来编号排序回去（用桶数组也可以，反正排序不会 TLE），然后输出即可。

附上一个~~我也不知道能不能~~ [AC](https://codeforces.com/contest/1256/submission/324539660) ~~的~~代码。

```cpp
#include <cstdio>
#include <algorithm>

using namespace std;

class node
{
public:
	int a;
	int id, p;
} a[1000005];
int f[1000005];

int main()
{
	int n;
	scanf("%d", &n);
	for (int i = 1; i <= n; i++)
	{
		scanf("%d", &a[i].a);
		a[i].id = i;
	}
	sort(a + 1, a + n + 1, [](const auto& x, const auto& y) { return x.a < y.a; });
	for (int i = 1; i <= n; i++)
	{
		f[i] = min({
			(i == 3 || i - 3 >= 3) ? f[i - 3] + a[i].a - a[i - 2].a : 0x3f3f3f3f,
			(i == 4 || i - 4 >= 3) ? f[i - 4] + a[i].a - a[i - 3].a : 0x3f3f3f3f,
			(i == 5 || i - 5 >= 3) ? f[i - 5] + a[i].a - a[i - 4].a : 0x3f3f3f3f
			});
	}
	int pos = n, cur = 0;
	while (pos)
	{
		if (f[pos] == (pos >= 3 ? f[pos - 3] + a[pos].a - a[pos - 2].a : 0))
		{
			// printf("pos = %d: - %d\n", pos, 3);
			a[pos].p = a[pos - 1].p = a[pos - 2].p = ++cur;
			pos -= 3;
		}
		else if (f[pos] == (pos >= 4 ? f[pos - 4] + a[pos].a - a[pos - 3].a : 0))
		{
			// printf("pos = %d: - %d\n", pos, 4);
			a[pos].p = a[pos - 1].p = a[pos - 2].p = a[pos - 3].p = ++cur;
			pos -= 4;
		}
		else
		{
			// printf("pos = %d: - %d\n", pos, 5);
			a[pos].p = a[pos - 1].p = a[pos - 2].p = a[pos - 3].p = a[pos - 4].p = ++cur;
			pos -= 5;
		}
	}
	printf("%d %d\n", f[n], cur);
	sort(a + 1, a + n + 1, [](const auto& x, const auto& y) { return x.id < y.id; });
	for (int i = 1; i <= n; i++)
	{
		printf("%d ", a[i].p);
	}
	return 0;
}
```