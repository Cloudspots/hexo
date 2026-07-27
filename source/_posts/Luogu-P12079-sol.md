---
title: 题解：P12079 [OOI 2025] Card Flip
date: 2026-7-13 15:26:16
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
首先，我们把题目转化一下，对于双面牌分两种情况讨论：

- $a<b$：此时相当于两张牌 $a$ 和 $b$，但是删除 $a$ 的时候可以选择是否顺带删除 $b$。
- $a>b$：此时翻转 $a$ 之后立马会面对 $b$，$b$ 成为了新的最小值，所以相当于两张 $a$，但是删掉一张的时候可以顺便带走另一张。

那么现在就相当于，我们有 $N=2n+m$ 张牌，值从小到大。每个人从小到大删掉一张牌。而有一些牌对删掉前面的一张的时候可以顺带删掉另一张（不删也可以），最后一次取牌的人获胜（注意这里不是取走最后一张牌，因为最后一张牌可能已经被顺带删除了，对应原博弈中没有翻转的情况）。

我们就考虑按照牌从小到大来考虑。最开始我们只遇到了单张牌，也就是无法连带删除其他牌的牌。直到第一次遇到能连带其他牌的牌的时候，假设 A 拿到了这一张牌，那么它能够连带删除的另一张牌在要拿的时候是否存在就是由 A 决定的。

所以每张牌有四种可能状态：

- Alice 拿到。
- Bob 拿到。
- Alice 可以控制谁拿到。
- Bob 可以控制谁拿到。

等等……这有个问题。如果一张牌被提前删除了，它应该算是谁拿到的呢？

我们来看看获胜条件，然后就能得出结果：拿到它的人和拿到它的上一张牌的人相同。

我们考虑如何转移。首先，如果它不能被连带删除，那么就由它的上一张牌决定——如果上一张牌是 Alice 拿到，那么它是 Bob 拿到；如果上一张牌是 Bob，它就是 Alice；否则如果被 Alice/Bob 控制，它仍然被 Alice/Bob 控制。

如果它可以被连带删除，事情就有些变化了。有三种情况：

1. 能删除它的那张牌是 Alice/Bob 拿到，或被 Alice/Bob 控制的。而它的上一张牌是被 Alice 或 Bob 拿到而非控制的。这种情况很好处理，它是谁拿到仍然是由 Alice/Bob 控制的。
2. 能删除它的那张牌是 Alice/Bob 拿到或者控制，而它的上一张牌是同一个人控制的。这种情况也很好处理——Alice/Bob 掌控了大局，此时仍然被控制。
3. 能删除它的那张牌是 Alice/Bob 拿到或者控制，但它的上一张牌是另一个人控制的。此时需要仔细考虑，下文会讲。

情况 $1,2$ 都很好处理，情况 $3$ 怎么做？

我们先来看两个例子（数字代表牌的编号，编号相同的牌可以连带删除另一张）：

- $1\ 2\ 2\ \color{red}1$：此时稍微思考可以发现，如果 Alice 连带删除了后面的红色 $\color{red}1$，则 Bob 可以一次删掉两个 $2$，后面的 $\color{red}1$ 就归 Bob 了（还记得我们上面关于被删除的牌的归属问题的定义吗？如果不记得了，快回去看看）。如果不连带删除，那么 Bob 也不连带删除，然后还是归 Bob。但是，Bob 也可以反着来让牌必然归属于 Alice。所以，这张牌时由**它前面的牌的掌控者** Bob 所掌控的。
- $3\ 1\ 2\ 1\ \color{red}2$：此时 Bob 如果连删，Alice 就也连删导致牌归属 Alice（最后一张牌 $\color{red}2$ 的主人等于倒数第二张牌的主人，也就是倒数第三张的主人 Alice）。如果不连删，Alice 也不连删导致牌还是归于 Alice。Alice 也可以反过来导致牌归属于 Bob。所以最后一张牌是由**能删除它的牌的掌控者** Alice 所掌控的。

所以其实不是必然的。需要更多条件的判断。

这个时候就要用到 Alice 和 Bob 做决定的顺序。如果是 Alice 先做的决定，Bob 就可以无视 Alice 的决定来覆盖 Alice 的结果（Alice 删牌的时候那张牌还没有真正属于 Alice），导致 Bob 掌控此牌。但如果 Bob 先做决定，Alice 就可以覆盖之。

所以实际上是，Alice 和 Bob 中**决定对应的牌是否连删的时间较晚**的人能够获得这张牌的控制权。

那我们再计一个值 $t_i$ 代表如果 $i$ 是被某个人控制的，那么这个人最晚做决定的时间。这个转移也是好处理的，不能被连带删除就等于上一张牌，能被连带删除的情况 $1$ 相当于能连删它的牌的时间，情况 $2$ 相当于两者的时间的 $\max$，情况 $3$ 就相当于最后获得这张牌的人做决定的时间，也就等于两者时间的 $\max$。

$O(n\log n)$，最慢的是排序。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/285639693)。

```cpp
/*
首先把问题转化为，有 2n+m 个位置，然后对于每张卡牌：

- 如果是单面：在位置 c 上一张。
- 如果 b > a：在位置 a 上一张，a + 0.114514 一张。
- 如果 b < a：a 一张，b 一张。

然后排序，还原为 2n+m 个位置。

此时，从右往左。每遇到一张卡牌，可以选择：

- 删除这张卡牌。
- 删除和这张卡牌编号相同的所有卡牌（包括自身）。

注意到：

Observation 1. 一张卡牌如果执行了操作 1 并且有另一张卡牌，则另一张卡牌相当于单面牌。

从左往右不好做，考虑从右往左。

对于每张卡牌，记录：

enum
{
	这张牌由 Alice 取走。
	由 Bob 取走。
	Alice 可以决定由谁取走。
	Bob 可以决定由谁取走。
}
*/
#include <cstdio>
#include <algorithm>

using namespace std;

class cp
{
public:
	int val, id;
	enum
	{
		Alice, 
		Bob, 
		AloveB, // Alice: 礼貌你吗
		BloveA, // Bob: 你【】吗
		UKE
	} tp;
	int kp;
} cd[1500005];
int a[500005], b[500005], c[500005];
int kid[1000005];

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	for(int i=1;i<=n;i++)
	{
		scanf("%d", a + i);
	}
	for(int i=1;i<=n;i++)
	{
		scanf("%d", b + i);
	}
	for(int i=1;i<=m;i++)
	{
		scanf("%d", c + i);
	}
	int cur = 0;
	for(int i=1;i<=n;i++)
	{
		if(a[i] < b[i])
		{
			cd[++cur] = {a[i], i, cp::UKE, 0};
			cd[++cur] = {b[i], i, cp::UKE, 0};
		}
		else
		{
			cd[++cur] = {a[i], i, cp::UKE, 0};
			cd[++cur] = {a[i], i, cp::UKE, 0};
		}
	}
	for(int i=1;i<=m;i++) cd[++cur] = {c[i], i + n, cp::UKE, 0};
	sort(cd + 1, cd + cur + 1, [](const auto &x, const auto &y) { return x.val > y.val; });
	for(int i=1;i<=cur;i++) if(!kid[cd[i].id]) kid[cd[i].id] = i;
	for(int i=cur;i>=1;i--)
	{
		// printf("card[%d].id = %d\n", i, cd[i].id);
		if(cd[i].tp != cp::UKE)
		{
			if((cd[i+1].tp == cp::AloveB || cd[i+1].tp == cp::BloveA) && cd[i+1].kp < cd[i].kp)
			{
				cd[i].tp = cd[i+1].tp;
				cd[i].kp = cd[i+1].kp;
			}
			// printf("cd[%d] = {tp = %s, kp = %d}\n", i, cd[i].tp == cp::Alice ? "Alice" : (cd[i].tp == cp::Bob ? "Bob" : (cd[i].tp == cp::AloveB ? "AloveB" : (cd[i].tp == cp::BloveA ? "BloveA" : "UKE"))), cd[i].kp);
			continue;
		}
		if(i == cur) cd[i].tp = cp::Alice;
		else if(cd[i+1].tp == cp::Alice) cd[i].tp = cp::Bob;
		else if(cd[i+1].tp == cp::Bob) cd[i].tp = cp::Alice;
		else
		{
			cd[i].tp = cd[i+1].tp;
			cd[i].kp = cd[i+1].kp;
		}
		// printf("cd[%d] = {tp = %s, kp = %d}\n", i, cd[i].tp == cp::Alice ? "Alice" : (cd[i].tp == cp::Bob ? "Bob" : (cd[i].tp == cp::AloveB ? "AloveB" : (cd[i].tp == cp::BloveA ? "BloveA" : "UKE"))), cd[i].kp);
		if(kid[cd[i].id] != i)
		{
			// printf("=> control %d\n", kid[cd[i].id]);
			if(cd[i].tp == cp::Alice || cd[i].tp == cp::AloveB)
			{
				cd[kid[cd[i].id]].tp = cp::AloveB;
				cd[kid[cd[i].id]].kp = i;
			}
			else
			{
				cd[kid[cd[i].id]].tp = cp::BloveA;
				cd[kid[cd[i].id]].kp = i;
			}
		}
	}
	printf(cd[1].tp == cp::Alice || cd[1].tp == cp::AloveB ? "First\n" : "Second\n");
	return 0;
}
// 胜负已定。
// srds，这个洛谷 UID 包含字符串 9, 05, 110, 91, 054, 10, 4 的入把最小看成最大虚空调试一万年是 hyw
```

:::