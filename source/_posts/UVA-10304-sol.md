---
title: 题解：UVA10304 Optimal Binary Search Tree
date: 2025-7-3 14:38:06
categories:
  - Solution
tags:
  - Solution
  - UVA Problem Solution
---
**最优二叉搜索树**问题。

考虑构建二叉搜索树的过程：选一个点，把所有比它小（因为数字有序，就是比它靠左）的点放到它的左子树中，比它大的放到它的右子树中。

发现每个子树必然是整个序列的一个字段（就是连续子序列的意思）。考虑区间 dp。

状态数量是平方级别的。状态转移？

显然如果一个树整体深度增加 $1$（就是对树根增加一个父节点作为新的树根），那么每个节点的深度都会增加 $1$（不包括那个父节点，下同）。所以整体代价增加点权之和。而这个可以前缀和优化（因为是子段）。这都是可以 $\Theta(1)$ 计算的，枚举树根需要线性的时间，所以总时间复杂度是 $\mathcal O(n^3)$ 级别的。

所以难度大概是黄吧？代码实现也没有难度。

```cpp
#include <cstdio>

using namespace std;

int f[255][255];
int a[255];
int s[255];

int main()
{
	int n;
	while (scanf("%d", &n) == 1)
	{
		for (int i = 1; i <= n; i++)
		{
			scanf("%d", a + i);
			s[i] = s[i - 1] + a[i];
		}
		for (int l = 2; l <= n; l++)
		{
			for (int i = 1; i <= n - l + 1; i++)
			{
				int j = i + l - 1;
				f[i][j] = 0x3f3f3f3f;
				// 树根为 k
				for (int k = i; k <= j; k++)
				{
					if (f[i][k - 1] + f[k + 1][j] + s[j] - s[i - 1] - a[k] < f[i][j]) f[i][j] = f[i][k - 1] + f[k + 1][j] + s[j] - s[i - 1] - a[k];
				}
			}
		}
		printf("%d\n", f[1][n]);
	}
	return 0;
}
```

[record](https://www.luogu.com.cn/record/222174172)。