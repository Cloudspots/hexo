---
title: 题解：P10191 [USACO24FEB] Test Tubes S
date: 2026-4-22 14:53:31
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
好玩的题。

设三个容器分别为 $A,B,C$。

手玩一下，发现一种策略如下：

首先把 $A$ 分成两种颜色。一种颜色（$f_1$）放到 $B$ 的末尾，另一种（$f_2$）放到 $C$ 中。

然后把 $B$ 分为两种颜色。一种（$f_3$）放到 $A$ 中，这就是 $A$ 最终的颜色。另一种（$f_4$）放到 $C$ 中，这是 $B$ 最终的颜色，只不过暂存在 $C$ 处。

最后把 $C$ 倒回到 $A$ 或 $B$ 中。

这样可以拿下 $P=2$。大胆猜测只需要卡常即可。

首先如果 $A$ 最终的颜色等于最后剩余的颜色（最后剩余的颜色为 $f_3$），则最后不倒。$B$ 同理，如果最后剩余的颜色为 $f_4$，那么最后一次不倒。

另外，如果 $B$ 最开始开头的颜色为 $f_2$，则把 $B$ 第一个颜色也放到 $C$ 中，这样就可以和 $A$ 放进去的一起移动。

枚举 $f_1,f_2,f_3,f_4$ 即可。$\langle f_1,f_2 \rangle$ 和 $\langle f_3,f_4\rangle$ 都可能为 $\langle \texttt 1,\texttt 2\rangle$ 或 $\langle \texttt 2,\texttt 1\rangle$。

证明比较简单，因为不同颜色必然不能一起移动，可以很容易得到一个下界；然后分析一下原算法，分讨一下发现刚好卡到下界就行了。略去。

:::info[详细证明]

讨论六种情况。分别是：

| $A$ 开头 | $A$ 末尾 | $B$ 开头 | $B$ 末尾 |
|:---|:---|:---|:---|
| $1$ | $2$ | $1$ | $2$ |
| $1$ | $2$ | $1$ | $1$ |
| $1$ | $1$ | $1$ | $1$ |
| $1$ | $2$ | $2$ | $1$ |
| $1$ | $2$ | $2$ | $2$ |
| $1$ | $1$ | $2$ | $2$ |

容易证明所有情况都和这几种情况等价（注意到整体取反和交换 $A,B$ 对答案和此算法的最优结果都没有影响）。

对于第 $1,5$ 种情况之外的所有情况，简单分析一下。除了开头可能不需要移动之外，其它都需要移动至少一次。并且必须移动到 $C$，也就是有至少一个移动了超过一次。然后发现这样分析的最小值和算法的步数刚好相同。

而对于第 $1,5$ 种，还需要证明实际最小值至少比刚刚分析的最小值多 $1$（因为算法给出的就是这个步数）。也就是说，不存在分析的不够紧的界给出的方案数的方案。

这个的意思就是，$C$ 只有一次移出操作。由于最后一个元素都是 $1$，倒数第二个都是 $2$，那么分类讨论一下存入 $C$ 中的是 $1$ 还是 $2$。

这里讨论一下存入 $2$。存入 $1$ 是同理的。

那么对于 $A,B$ 中的 $2$ 和 $1$ 都可以看作直接消失，但是消耗 $1$ 的步数。最终结果是 $A=\texttt 1,B=\texttt 1,C=\texttt 2$（情况 $1$）或 $A=\texttt 1,B=\texttt 2,C=\texttt 2$（情况 $5$）。剩下都是易证的。

:::

时间复杂度 $O(n)$，常数不小。

:::info[sub&code]

[sub](https://www.luogu.com.cn/record/275074721)。

```cpp
#include <cstdio>
#include <string>
#include <iostream>
#include <vector>

using namespace std;

class op
{
public:
	int src, tgt;
};

vector<op> ty(string s, string t, char f1, char f2, char f3, char f4)
{
	/* B store f1, C store f2. Finally A store f3, B store f4. */ // <--- A C-style comment.jpg
															  /* ^^^ A C++-stype comment.mp4 ^^^ */
	string s0 = s, t0 = t, kr;
	vector<op> md;
	if(t0.back() == f2)
	{
		kr += f2;
		md.push_back({2, 3});
		t0.pop_back();
	}
	while(!s0.empty() && !(s0.size() == 1 && s0.back() == f3))
	{
		if(s0.back() == f1)
		{
			if(t0.empty() || t0.back() != f1) t0 += f1;
			md.push_back({1, 2});
		}
		else
		{
			if(kr.empty() || kr.back() != f2) kr += f2;
			md.push_back({1, 3});
		}
		s0.pop_back();
	}
	while(!t0.empty() && !(t0.size() == 1 && t0.back() == f4))	
	{
		if(t0.back() == f3)
		{
			if(s0.empty() || s0.back() != f3) s0 += f3;
			md.push_back({2, 1});
		}
		else
		{
			if(kr.empty() || kr.back() != f4) kr += f4;
			md.push_back({2, 3});
		}
		t0.pop_back();
	}
    while(!kr.empty())
    {
        if(kr.back() == f3) md.push_back({3, 1});
        else md.push_back({3, 2});
        kr.pop_back();
    }
	return md;
}

int main()
{
	int q;
	scanf("%d", &q);
	while(q--)
	{
		int n, p;
		scanf("%d%d", &n, &p);
		string s1, t1;
		cin >> s1 >> t1;
		string s, t;
		for(char ch : s1) if(s.empty() || ch != s.back()) s += ch;
		for(char ch : t1) if(t.empty() || ch != t.back()) t += ch;
		int minn = 0x3f3f3f3f;
		vector<op> method;
		vector<op> a = ty(s, t, '1', '2', '1', '2');
		vector<op> b = ty(s, t, '1', '2', '2', '1');
		vector<op> c = ty(s, t, '2', '1', '1', '2');
		vector<op> d = ty(s, t, '2', '1', '2', '1');
		if(a.size() < minn) { minn = a.size(); method = a; }
		if(b.size() < minn) { minn = b.size(); method = b; }
		if(c.size() < minn) { minn = c.size(); method = c; }
		if(d.size() < minn) { minn = d.size(); method = d; }
		printf("%d\n", minn);
		if(p > 1)
		{
			for(const auto &[x, y] : method)
			{
				printf("%d %d\n", x, y);
			}
		}
	}
	return 0;
}
```
:::