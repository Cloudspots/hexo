---
title: 题解：AT_abc261_e [ABC261E] Many Operations
date: 2025-5-21 19:02:10
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
注意到各位独立，考虑对于每一位考虑。

问题也就转化为了 $X$ 和 $A_i$ 都是一位二进制整数的情况，这种情况非常简单，我们只需要用 $f_{i,j}$ 表示原本 $X=i$，经过前 $j$ 次操作（即，$1,2,3,\dots,j$）之后变成了什么，其中 $0 \le i \le 1$。转移也非常简单，令 $\operatorname{aox}$ 为当前位运算操作，那么有 $f_{i,j}=f_{i,j-1} \operatorname{aox}A_i$ 即可。

什么你问答案怎么处理？显然 $i=1\dots N$，每一次 $X \gets f_{X,i}$ 即可。

然后做完了。

```cpp
#include <cstdio>

using namespace std;

int f[200005][35][5];

int main()
{
	int n, c;
	scanf("%d%d", &n, &c);
	for (int i = 0; i < 30; i++)
	{
		f[0][i][0] = 0;
		f[0][i][1] = 1;
	}
	for (int i = 1; i <= n; i++)
	{
		int t, a;
		scanf("%d%d", &t, &a);
		for (int j = 0; j < 30; j++)
		{
			int r = a >> j & 1;
			if (t == 1)
			{
				f[i][j][0] = f[i - 1][j][0] & r;
				f[i][j][1] = f[i - 1][j][1] & r;
			}
			if (t == 2)
			{
				f[i][j][0] = f[i - 1][j][0] | r;
				f[i][j][1] = f[i - 1][j][1] | r;
			}
			if (t == 3)
			{
				f[i][j][0] = f[i - 1][j][0] ^ r;
				f[i][j][1] = f[i - 1][j][1] ^ r;
			}
		}
		for (int j = 0; j < 30; j++)
		{
			c = c & (0x7fffffff - (1 << j)) | ((f[i][j][(c >> j) & 1]) << j);
		}
		printf("%d\n", c);
	}
	return 0;
}
```

[sub](https://atcoder.jp/contests/abc261/submissions/66015073)。

考虑优化（常数）。

我们是逐位考虑的，能不能打包到一起？当然是可以的。

我们用 $k_{i,0}$ 表示“开始时全都是 $0$，经过 $i$ 次操作会变成什么样”，$k_{i,1}$ 同理（开始时是 $2^{30}-1$）。

什么你问怎么处理答案？如果 $X$ 的某一位为 $0$ 就用 $k_{i,0}$ 转移，为 $1$ 就用 $k_{i,1}$，然后滚动数组处理 $k$ 即可，只需要两个辅助变量。

至此，我们就是用高超的位运算技巧解决了这题。实际上速度也快了很多。

```cpp
#include <cstdio>

using namespace std;

int main()
{
	int n, c;
	scanf("%d%d", &n, &c);
	int k0 = 0, k1 = 0x7fffffff;
	for (int i = 1; i <= n; i++)
	{
		int t, a;
		scanf("%d%d", &t, &a);
		if (t == 1) { k0 &= a; k1 &= a; }
		if (t == 2) { k0 |= a; k1 |= a; }
		if (t == 3) { k0 ^= a; k1 ^= a; }
		c = (~c & k0) + (c & k1); // 这里 + 改成 | 或者 ^ 也行，毕竟没有交集
		printf("%d\n", c);
	}
	return 0;
}
```

[44ms](https://atcoder.jp/contests/abc261/submissions/66021428)。

显然所有的变量都是非负数，我们可以使用 `unsigned` 代替 `int`，用上卡常小技巧还能再快一截（这个技巧也可以用到快速读入中）。

[37ms](https://atcoder.jp/contests/abc261/submissions/66021470)。