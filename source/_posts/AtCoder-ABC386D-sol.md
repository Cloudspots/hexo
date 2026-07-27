---
title: ABC 386 D 题解
date: 2024-12-28 22:04:17
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
题目大意：有一个 $N \times N$ 的网格，每个格子可能是黑色或白色，网格有一些 amazing 的性质：

- 网格的每一行都有一个分界线（可能在最左端或最右端），分界线左边都是黑色，右边都是白色。
- 列同理，分界线上面都是黑色，下面都是白色。

现在，网格中有 $M$ 个格子的状态是已知的，请求出有没有符合条件的网格。

---

前情提要：我们用 $M_b$ 代表已知的黑格数量，$M_w$ 代表已知的白格数量。

我们先分析一下在 $(x,y)$ 点处是黑格能够确定什么信息吧。

首先，根据 $(x,y)$ 为黑，得到 $\forall 1 \le i \le y$，都有 $(x,i)$ 为黑。

然后，如果 $(x,i)$ 为黑，则 $\forall 1 \le j \le x$，都有 $(i,j)$ 为黑。

所以，我们得到 $\forall 1 \le i \le x, 1 \le j \le y$，都有 $(i,j)$ 为黑。

这样，左上角为 $(1,1)$，右下角为 $(x,y)$ 的长方形中的所有方格均为黑色。

相似地，我们可以得到如果 $(x,y)$ 为白，那么左上角 $(x,y)$ 右下角 $(N,N)$ 的长方形中均为白色。

于是，如果无解，那么肯定是有某个方格 $(x,y)$ 由于某个 $(x_1,y_1)$ 为黑色（$x_1 \ge x, y_1 \ge y$）所以为黑，但是又因为某个 $(x_2,y_2)$ 为白色（$x \ge x_2, y \ge y_2$），导致矛盾。

我们容易推出，如果有 $(x_1,y_1)$ 是已知的黑色，$(x_2,y_2)$ 是已知的白色，并且 $x_1 \ge x_2$ 并且 $y_1 \ge y_2$，也就是黑格在白格的右下方（正右方，正下方也可以），则无解。

如果暴力枚举每个黑色和白色，则时间复杂度 $\Theta(M_bM_w)=\mathcal O(M^2)$ 无法承受。

我们可以想到，把所有黑格和白格按照 $x$ 坐标排序，然后枚举每一个白格，这样就可以不用判断地得出哪些黑格的 $x$ 坐标不小于这个白格了。但是怎么判断是否有黑格 $y$ 坐标也不小于这个白格？

显然，有黑格的 $y$ 坐标不小于这个白格，意味着这些黑格的 $y$ 坐标最大值不小于这个白格。于是我们可以用一个最小值数组 $m_{i}$ 代表排序后的第 $i \sim M_b$ 个黑格的 $y$ 坐标的最大值。

小细节：怎么样找出第一个 $x$ 坐标值不小于某个给定的 $x$ 的黑格（当然已经排序）？

第一种方法是二分。非常简单，就不说了。单次时间复杂度 $\Theta(\log n)$，事实上可以“优化”为 $\mathcal O(\log n)$，不过最坏都一样。

第二种方法是用一个指针来记录，因为实际需求是给定的 $x$ 坐标增大（因为白格也排过序），所以这个下标也必然一直增大（至少不会减少），所以就可以从上次的下标开始枚举。单次时间复杂度 $\mathcal O(n)$，但是均摊时间复杂度 $\Theta(1)$，所以总时间复杂度还是 $\mathcal O(n)$（为什么 $n \times \Theta(1) = \mathcal O(n)$？因为可能不会延伸到末尾）。

---

代码很简单，逐部分讲一下吧。

```cpp
#include <cstdio>
#include <algorithm>

using namespace std;

class black
{
public:
	int x, y;
} blacks[200005];
class white
{
public:
	int x, y;
} whites[200005];
int ymax[200005];
```

这里是类（其实除了默认访问权限不同，和结构体是一样的）的定义，黑格和白格。

另外这里还有一个 `ymax` 数组，其实就是我们讲的最小值 $m$ 数组。

```cpp
int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	int bcur = 0, wcur = 0;
	for(int i=1;i<=m;i++)
	{
		int x, y;
		scanf("%d%d", &x, &y);
		getchar();
		char c = getchar();
		if(c == 'B') blacks[++bcur] = {x, y};
		else whites[++wcur] = {x, y};
	}
	sort(blacks + 1, blacks + bcur + 1, [](const black &x, const black &y) { return x.x < y.x; });
	sort(whites + 1, whites + wcur + 1, [](const white &x, const white &y) { return x.x < y.x; });
```

输入&排序，刚才讲的挺清楚的了。这里用到了一个叫做 lambda 表达式的语法，其实可以理解为简单的函数。（其实还是有挺大区别的，但是重点不在这里）

```cpp
for(int i=bcur;i>=1;i--)
{
	if(blacks[i].y > ymax[i+1]) ymax[i] = blacks[i].y;
	else ymax[i] = ymax[i+1];
}
blacks[bcur+1].x = 2147483647;
```

这里就是预处理 $m$ 数组了。后面还有一句代码，是一个小细节，因为如果 $i > M_b$，则由于 `blacks` 是全局的，所以 `blacks[i].x` 是 $0$，导致后面无限循环然后数组越界。一发罚时。

```cpp
int bptr = 0;
for(int i=1;i<=wcur;i++)
{
	while(blacks[bptr].x < whites[i].x)
	{
		bptr++;
	}
	if(ymax[bptr] >= whites[i].y)
	{
		printf("No\n");
		return 0;
	}
}
printf("Yes\n");
return 0;
}
```

`while(blacks[bptr].x < whites[i].x)` 就是刚刚讲的小细节，如果没有则会导致 `blacks[bptr].x == 0`，然后 `bptr` 就飞了。

其余部分说的挺清楚了，这里不再赘述。