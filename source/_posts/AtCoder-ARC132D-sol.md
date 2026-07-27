---
title: 题解：AT_arc132_d [ARC132D] Between Two Binary Strings
date: 2026-3-21 11:08:35
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
> 神秘题目在最后坑我一手。

首先一个经典的 trick 是，这个距离函数 $d$ 相当于，首先把两个字符串的 $1$ 的位置存入两个数组 $a,b$（长度需要相同，不然 $1$ 的个数就不同就无解），然后对应项差的绝对值之和（$\displaystyle\sum_{i=1}^m \lvert a_i-b_i\rvert $）就是答案。

为什么？首先显然不会交换相邻两个相同的字符。也就是说，两个 $1$ 之间的位置关系不变（因为，如果有变化，那么唯一的方法就是交换这两个一，然而这一定是不优的）。那么，让两边的 $1$ 对齐的最小距离就是位置之差的绝对值之和。

那么，这个“在中间”的性质是什么呢？很显然，是对于每个 $1$ 的位置 $c_i$，都要满足 $\min(a_i,b_i)\le c_i\le \max(a_i,b_i)$。因为 $\lvert a-c\rvert + \lvert b-c\rvert \ge \lvert a-b\rvert$，而取等的条件就是 $\min(a_i,b_i)\le c_i\le \max(a_i,b_i)$。

然后考虑这个“美丽度”。显然，这个可以转化为最小化“相邻的不同的字符的个数 $k$”，此时美丽度就是 $n+m-1-k$。我们上面都在用 $1$ 的位置进行表述，那么尝试用相同的方法表述美丽度。也就是，表述 $k$。

一般来讲，$k$ 应该是位置数组的极长连续段（值域连续）个数的两倍。因为，对于每一个极长连续段，其左右两边都不存在数字，对应到字符串中就是 $0111\dots 1110$。会有 $2$ 的贡献。

然而，左右两边的字符可能不存在。也就是说，可能是 $111\dots1110$ 或者 $0111\dots 111$ 或者全 $1$。此时不应当统计端点。

那么，我们先不管这个，直接来求解。显然每个 $c$ 的范围互不包含，那么贪心，每次如果能和上一次接上那就直接接上，否则直接跳到右端点。

现在回来考虑边界。左边界的话，使用两次贪心，第一次直接不考虑左边界，第二次 $c_1$ 必须等于 $1$。对于右边界，上面的贪心过程已经保证了右边界尽量大，结束的时候判断一下即可。

对于我的实现方式，全 $0$ 会挂掉，因为表示“上一个 $1$ 的位置”的变量会始终为 $0$（或 $-1$），就在结束的时候认为是 $111...\dots 10$ 的形式。需要特判全零。

时间复杂度 $O(n+m)$。

:::info[sub&code]
[sub](https://atcoder.jp/contests/arc132/submissions/74250112)。

```cpp
/*
这是 ABC 的 D 吧。。

显然距离就是对应 1 的差的绝对值之和

在其之间 就是 在两个对应的 1 之间

每次左右端点都必然增加

贪心即可
*/
#include <cstdio>
#include <string>
#include <iostream>

using namespace std;

int sp[300005], tp[300005];
int l[300005], r[300005];

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	string s, t;
	cin >> s >> t;
	if(m == 0)
	{
		printf("%d\n", n - 1);
		return 0;
	}
	int cur = 0;
	for(int i=0;i<s.size();i++)
	{
		if(s[i] == '1') sp[++cur] = i + 1;
	}
	cur = 0;
	for(int i=0;i<t.size();i++)
	{
		if(t[i] == '1') tp[++cur] = i + 1;
	}
	for(int i=1;i<=m;i++)
	{
		l[i] = min(sp[i], tp[i]);
		r[i] = max(sp[i], tp[i]);
	}
	int lst = -1;
	int sum1 = 0, sum2 = 0;
	for(int i=1;i<=m;i++)
	{
		if(l[i] <= lst + 1 && lst + 1 <= r[i])
		{
			lst++;
		}
		else
		{
			lst = r[i];
			sum1+=2;
			// printf("sum += 2\n");
			if(i == 1) sum1--;
		}
		// printf("lst = %d\n", lst);
	}
	if(lst != n + m) sum1++;
	if(l[1] != 1) sum2 = 0x3f3f3f3f;
	else
	{
		lst = 0;
		for(int i=1;i<=m;i++)
		{
			if(l[i] <= lst + 1 && lst + 1 <= r[i])
			{
				lst++;
			}
			else
			{
				lst = r[i];
				sum2+=2;
				// printf("sum += 2\n");
				// if(i == 1) sum1--;
			}
			// printf("lst = %d\n", lst);
		}
		if(lst != n + m) sum2++;
	}
	printf("%d\n", n + m - 1 - min(sum1, sum2));
	return 0;
}
```
:::