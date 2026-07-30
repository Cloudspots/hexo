---
title: 题解：CF1450H1 Multithreading (Easy Version) 
tags:
  - Solution
  - Codeforces Problem Solution
categories:
  - Solution
date: 2026-07-16 18:57:14
updated: 2026-07-16 18:57:14
---
> 模拟赛的时候这题数据范围是 $10^7$，需要线性做法。

---

首先我们注意到若相邻的两个字符相同，那么配对它们必然不劣。

这样我们就可以重复删除相邻的相同字符，直到变为形如 $\texttt{wbwb}\dots\texttt{wb}$ 的形式。

我们先考虑如何维护这个过程。首先断环成链。我们考虑不好做的操作其实是头尾相同，因为如果无法这样操作那就可以直接用一个栈做了（遇到一个字符如果和栈顶相同就弹出栈顶，否则压入栈中）。实际上稍加思考可以发现，我们可以不用删除首尾的操作，因为如果除了头尾之外相邻两项都不同，则必然是形如 $\texttt{wbwb}\dots\texttt{wbw}$ 的形式，但是这样长度为奇数，矛盾了。

最后最小操作次数就是栈大小的 $\dfrac{1}{4}$。字符串合法就等价于栈大小是 $4$ 的倍数。

那么现在考虑 $O(n^2)$ 做法。注意到这个栈可以由栈顶元素和栈大小唯一确定，那么把它们和长度一起压入状态中，转移可以做到 $O(1)$。

现在考虑正解。

我们发现“消除相邻两项”是个麻烦的操作。如何量化它？

一种可能就是，给每个元素赋一个权值，然后相邻的相同字符的权值必须互为相反数，其它的权值必须相同。这样所有权值求和，再除以不被消除的元素的相同的权值，就可以得到不被消除的元素个数（也就是栈大小）了。

那么我们考虑给 $\texttt{b}$ 和 $\texttt{w}$ 分别赋上权值 $-1$ 和 $1$，而奇数和偶数位还有权值系数 $-1$ 和 $1$，权值系数和字符权值相乘得到最终权值。这样，相邻的相同位有相同的字符权值和相反的权值系数，抵消了！正确性可以由读者自行证明。

为了便于理解，这里举一个例子：字符串 $\texttt {bbbwwwbw}$：

| 下标 | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ | $8$ | 总和 |
|:---:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:---:|
| 字符 | $\texttt b$ | $\texttt b$ | $\texttt b$ | $\texttt w$ | $\texttt w$ | $\texttt w$ | $\texttt b$ | $\texttt w$ | / |
| 字符权值 | $-1$ | $-1$ | $-1$ | $1$ | $1$ | $1$ | $-1$ | $1$ | / |
| 下标系数 | $-1$ | $1$ | $-1$ | $1$ | $-1$ | $1$ | $-1$ | $1$ | / |
| 权值 | $1$ | $-1$ | $1$ | $1$ | $-1$ | $1$ | $1$ | $1$ | $\bm 4$ |

经过模拟，栈的大小的确是 $4$，可喜可贺！

需要注意的是，如果栈以 $\texttt w$ 开头，则最终得到的权值之和其实是栈的大小的相反数，需要取绝对值。

那么，我们所有确定的位的权值都是确定的，而未确定的位可以是 $-1$ 或 $1$ 并且可以自由控制。那么我们枚举最终的权值之和 $k$，需要满足 $4\mid k$。假设原本的权值之和为 $S$，也就是说我们能够控制的位的权值之和需要是 $k-S$。假设我们能控制 $c$ 个位，则其中需要有 $\dfrac{c+k-S}{2}$ 个位是 $1$，$\dfrac{c-k+S}{2}$ 个位是 $-1$。用组合数算一下就好。

我们得到了式子 $\displaystyle\sum_{4\mid k} \dbinom{c}{\frac{c+k-S}{2}}\dfrac{\lvert k\rvert}{4}$。

考虑这个还是不是很美观，我们考虑换元掉下面的 $\dfrac{c+k-S}{2}$。其实就是在枚举 $1$ 的个数。得到了：

$$\sum_{\frac{2i-c+S}{4}\in \Z}\dbinom{c}{i}\dfrac{\lvert 2i-c+S\rvert}{4} $$

考虑 $t=\dfrac{c-S}{2}$，得到：

$$\sum_{i\equiv t\pmod 2}\dbinom{c}{i}\dfrac{\lvert i-t\rvert}{2} $$

然后考虑方案数。动脑子稍微想想就能知道合法方案是总方案的一半，也就是 $2^{c-1}$。当然也可以代数推导一下，$\displaystyle\sum_{i\equiv t\pmod 2}\dbinom{c}{i}=2^{c-1}$。

做完。复杂度 $O(n)$。UBSan 非常好用。

:::info[sub&code]

[sub](https://codeforces.com/contest/1450/submission/382927924)。

```cpp
#include <cmath>
#include <string>
#include <cstdio>
#include <iostream>
#include <algorithm>

using namespace std;

long long fact[200005], ifact[200005];

long long qpow(long long x, long long y)
{
	long long ans = 1;
	do
	{
		if(y & 1) ans = ans * x % 998244353;
		x = x * x % 998244353;
	} while(y >>= 1);
	return ans;
}

int main()
{
	int n;
	scanf("%d%*d", &n);
	string str;
	cin >> str;
	int s = 0, c = 0, mul = 1;
	for(char ch : str)
	{
		if(ch == 'w') s += mul;
		else if(ch == 'b') s -= mul;
		else c++;
		mul *= -1;
	}
	int t = (c - s) / 2;
	fact[0] = 1;
	for(int i=1;i<=n;i++)
	{
		fact[i] = fact[i-1] * i % 998244353;
	}
	ifact[n] = qpow(fact[n], 998244351);
	for(int i=n-1;i>=0;i--) ifact[i] = ifact[i+1] * (i+1) % 998244353;
	auto comb = [](int x, int y) { return x < y || y < 0 ? 0 : fact[x] * ifact[y] % 998244353 * ifact[x - y] % 998244353; };
	long long sum = 0;
    // printf("s = %d, c = %d, t = %d\n", s, c, t);
	for(int i=(unsigned)t%2;i<=c;i+=2)
	{
		sum = (sum + comb(c, i) * (abs(i - t) % 998244353 * 499122177ll % 998244353) % 998244353) % 998244353;
	}
	printf("%lld\n", sum * qpow(499122177, c - 1) % 998244353);
	return 0;
}
```

:::
