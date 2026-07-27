---
title: 题解：P10090 [ROIR 2022 Day 2] 幼儿园的新年
date: 2025-1-16 12:07:36
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
首先我们忽略 $x+y \neq 0$ 的条件，因为在任何情况下这种情况都有且只有一种，所以我们只需要把最终答案减去 $1$ 即可。

首先考虑确定了 $x$，有多少个 $y$。

显然有 $x \le x+y \le x+b$，而 $x+y \equiv 0 \pmod n$，所以一共有 $\left\lfloor\dfrac{x+b}{n}\right\rfloor - \left\lceil\dfrac{x}{n}\right\rceil + 1$ 种。

我们成功把时间复杂度优化为了 $\Theta(\sum a)$。考虑优化。

我们发现一件事情：

$$\begin{aligned}
&\left\lfloor\dfrac{x+b}{n}\right\rfloor - \left\lceil\dfrac{x}{n}\right\rceil + 1\\
=&\left\lfloor\dfrac{x}{n}+\left\lfloor\dfrac{b}{n}\right\rfloor+\dfrac{b \bmod n}{n}\right\rfloor - \left\lfloor\dfrac{x+n-1}{n}\right\rfloor + 1\\
=&\left\lfloor\dfrac{x}{n}+\dfrac{b \bmod n}{n}\right\rfloor - \left\lfloor\dfrac{x-1}{n}\right\rfloor + \left\lfloor\dfrac{b}{n}\right\rfloor\\
=&\left(\left\lfloor\dfrac{x+b \bmod n}{n}\right\rfloor - \left\lfloor\dfrac{x-1}{n}\right\rfloor\right) + \left\lfloor\dfrac{b}{n}\right\rfloor
\end{aligned}$$

显然，最右边的 $\left\lfloor \dfrac{b}{n} \right\rfloor$ 是一个常数，而 $b \bmod n$ 也是一个常数。

**注意：我在验证式子有没有推错的时候用了 `(x-1)/n` 来计算 $\bm{\left\lfloor\dfrac{x-1}{n}\right\rfloor}$，结果寄了（可以想想为什么）。**

我们采用换元法，令 $z = x-1$，则原式转化为 $\left(\left\lfloor\dfrac{z+(1+b \bmod n)}{n}\right\rfloor - \left\lfloor\dfrac{z}{n}\right\rfloor\right) + \left\lfloor\dfrac{b}{n}\right\rfloor$，$z$ 满足 $-1 \le z < a$。

现在问题转化为，有多少个 $-1 \le z < a$，满足 $z \bmod n \ge n - b \bmod n - 1$。因为如果满足，则原式左边的括号中是 $1$，否则是 $0$。

为了方便，令 $m = n - b \bmod n - 1$。

若 $0 \le x < n$，则有 $n - m$ 个满足条件的 $z$。

显然，一共有 $\left\lfloor\dfrac{a}{n}\right\rfloor$ 组完整的 $0 \le z \bmod n < n$。

在剩下的 $z$ 中，都是 $n\left\lfloor\dfrac{a}{n}\right\rfloor \le z < a$ 的，也就是 $0 \le z \bmod n < a \bmod n$。除了一个特殊情况就是 $z=-1$，对应 $x=0$，特判即可。

所以，如果 $a \bmod n \le m$，那么没有满足条件的。否则，有 $a \bmod n - m$ 个。

然后我们就可以 $\Theta(1)$ 回答单次询问了。

容易理解的代码：

```cpp
#include <cstdio>

using namespace std;

int main()
{
	int t;
	scanf("%d", &t);
	while (t--)
	{
		long long n, a, b;
		scanf("%lld%lld%lld", &n, &a, &b);
		long long m = n - b % n - 1;
		long long sum =
			a * (b / n) + // 每一个 x 都有 b / n，除了 x=0，特判
			(a / n) * (n - m) +
			(a % n <= m ? 0 : a % n - m) +
			b / n // x = 0 (z = -1), (b / n) - (0 / n) + 1 - 1
			;
		printf("%lld\n", sum);
	}
	return 0;
}
```

> 我用 Github Pages 建了个网站，域名为 <https://cloudspots.github.io/>，还没想好要在网站里放什么，大家有什么意见吗？
>
> 这无关内容不算大量吧。