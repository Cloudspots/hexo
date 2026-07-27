---
title: 题解：AT_abc410_c [ABC410C] Rotatable Array
date: 2025-6-15 09:21:45
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
题目简述：给定一个长为 $N$ 的数列 $A$，初始时 $A_i=i$，$Q$ 次操作，每次操作查询/修改某个元素或给定 $k$，把数列变为 $(A_{1+k},A_{2+k},A_{3+k},\dots,A_{n+k})$（越界则循环访问，即 $A_{n+m}$ 其实是 $A_m$）。

解法其实也很简单。显然最后一个操作比较麻烦。容易观察到其实就是访问 $A_i$ 的时候实际访问了 $A_{i+k}$，并且能够叠加（就是说，如果有一些这样的操作，参数分别为 $k_1,k_2,\dots,k_m$，那么相当于一次操作，参数为 $k_1+k_2+\dots+k_m$）。

这样就做完啦！维护一个数字 $o$（offset 的首字母，偏移），初始为 $0$，每次移位就把 $o$ 加上 $k$。那么查询或修改就直接把下标加上 $o$ 再对 $N$ 取模（特别地，如果结果是 $0$ 则再变为 $N$）然后直接访问即可。

但是直到这里还有一个小细节：每次对 $o$ 加上 $k$，$k$ 最多是 $10^9$，最多有 $3 \times 10^5$ 次操作（参见数据范围），那么 $k$ 最多可以达到 $3 \times 10^{14}$，超过了 `int` 能够表示的范围，需要使用 `long long`。如果不用，那么也可以对 $n$ 取模，因为移位 $n$ 位相当于没有操作。

代码（非赛时代码，赛时大脑爆炸写出了抽象代码但是能够过题）：

```cpp
#include <cstdio>

using namespace std;

int a[1000005];

int main()
{
	int n, q;
	scanf("%d%d", &n, &q);
	int o = 0;
	for (int i = 1; i <= n; i++)
	{
		a[i] = i;
	}
	for (int i = 1; i <= q; i++)
	{
		int op;
		scanf("%d", &op);
		if (op == 1)
		{
			int p, x;
			scanf("%d%d", &p, &x);
			// 原本是 (p+o)%n，但是如果结果是 0 则变为 n
			// 可以表达为 (p+o-1)%n+1。证明是，如果 p+o 模 n
			// 不为 0，则 (p+o-1)%n 就相当于 (p+o)%n+1，再 -1 得到结果
			// 如果为 0，那么 (p+o-1)%n 就相当于 (n-1)%n，也就是 n-1，最后 +1 得出 n。
			p = (p + o - 1) % n + 1;
			a[p] = x;
		}
		if (op == 2)
		{
			int p;
			scanf("%d", &p);
			p = (p + o - 1) % n + 1;
			printf("%d\n", a[p]);
		}
		if (op == 3)
		{
			int k;
			scanf("%d", &k);
			o = (o + k) % n;
		}
	}
	return 0;
}
```