---
title: 题解：CF1896F Bracket Xoring
tags:
  - Solution
  - Codeforces Problem Solution
categories:
  - Solution
date: 2026-07-17 18:58:41
updated: 2026-07-17 18:58:41
---
> 模拟赛的时候给了 $s_{2i}=s_{2i+1}$ 部分分。

---

首先我们稍微思考一下，一次操作能够造成什么影响。容易发现如果我们假设 $\texttt (=\texttt0$ 且 $\texttt )=\texttt1$，那么就相当于原串异或括号串再异或 $M$，其中 $M=\texttt{101010\dots}$。

我们考虑一类特殊的字符串，满足 $\forall i\in [1,n),s_{2i}=s_{2i+1}$。显然，我们需要先关注 $s_1,s_{2n}$，这俩没有限制。

但是，容易发现若 $s_1\neq s_{2n}$ 则显然无解。

我们先考虑 $s_1=s_{2n}=\texttt1$。此时，我们注意到 $s\oplus M$ 是形如这样的串：

$$ \texttt{0x}_1\overline{\texttt x_1}\texttt x_2\overline{\texttt x_2}\texttt x_3\overline{\texttt x_3}\texttt{\dots 1} $$

我们发现这个串一定是合法括号串！

换句话说，对于这样的字符串，我们可以一次操作就清零！

那么考虑 $s_1=s_{2n}=0$。我们注意到使用 $\texttt{010101\dots}$（对应括号串 $\texttt{()()()\dots}$）可以翻转整个字符串，转化为 $s_1=s_{2n}=1$ 的情况。

那么现在考虑无特殊性质。

考虑转化为上面的特殊性质。

对于原本的字符串，考虑所有 $s_{2i}$ 与 $s_{2i+1}$。如果它们本来就是相同的，我们可以在这放一个 $\texttt{()}$。否则，我们应该放一个 $\texttt{((}$ 或 $\texttt{))}$。

那么我们考虑从从前往后扫，边扫边构造。如果是相同的，显然我们放一个 $\texttt{()}$。否则，如果可以我们就放一个 $\texttt{))}$，否则 $\texttt{((}$。

这样是否是合法的？

注意到只要不同的 $s_{2i}$ 和 $s_{2i+1}$ 对数是偶数我们这样做就是合法的。不同的对数？显然用 $\texttt 1$ 的个数来刻画。这也就等价于 $s_{2\dots 2n-1}$ 中 $\texttt 1$ 的个数是偶数。

我们上面说过 $s_1=s_{2n}$，所以也就等价于 $s$ 中 $\texttt 1$ 的个数是偶数。

而考虑如果个数是奇数，显然是无解的——两个数字异或的 $\operatorname{popcount}$ 的奇偶性就是两个数字的 $\operatorname{popcount}$ 的奇偶性。而 $M$ 的 $\operatorname{popcount}$ 和括号序列一样都是 $n$，所以操作必然不会改变 $\operatorname{popcount}(s)$ 的奇偶性。然而 $\operatorname{popcount}(0)=0$ 是偶数，所以 $s$ 中必须有偶数个 $1$，否则无解。

这样就就成功用一次操作把有解的一般串转化为了特殊性质串，然后套用特殊性质串的 $\le 2$ 次操作做法。

时间复杂度 $O(n)$。

:::info[sub&code]

[sub](https://codeforces.com/contest/1896/submission/383134828)。

```cpp
#include <cstdio>
#include <string>
#include <iostream>
#include <algorithm>

using namespace std;

int main()
{
	int t;
	scanf("%d", &t);
	while(t--)
	{
		int n;
		scanf("%d", &n);
		string str;
		cin >> str;
		if(str[0] != str.back())
		{
			printf("-1\n");
			continue;
		}
		int cnt = 0;
		for(char ch : str) if(ch == '1') cnt ^= 1;
		if(cnt)
		{
			printf("-1\n");
			continue;
		}
		if(str[0] == '1') printf("3\n");
		else printf("2\n");
		string r;
		str[0] ^= 1;
		str.back() ^= 1;
		for(int i=1;i<n;i++)
		{
			if(str[2*i-1] == str[2*i])
			{
				r += "()";
				// str[2*i-1] ^= 1;
				// str[2*i] ^= 1;
			}
			else
			{
				if(cnt)
				{
					r += "))";
					str[2*i-1] ^= 1;
					cnt--;
				}
				else
				{
					r += "((";
					str[2*i] ^= 1;
					cnt++;
				}
			}
		}
		printf("(%s)\n", r.c_str());
		if(str[0] == '0')
		{
			for(char &ch : str) ch ^= 1;
			for(int i=1;i<=n;i++) printf("()");
			printf("\n");
		}
		for(int i=0;i<2*n;i++)
		{
			putchar(((str[i] == '0') ^ (1 ^ i & 1)) ? '(' : ')');
		}
		printf("\n");
	}
	return 0;
}
```

:::
