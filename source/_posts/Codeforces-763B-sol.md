---
title: 题解：CF763B Timofey and rectangles
date: 2026-3-17 17:00:15
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
神秘脑电波题。注意到了边长为奇数，然后猜到了结论结果构造出了 hack……hack 是假的。

首先根据四色定理必然有解。不过这个其实没什么用，因为根据后面的讨论，在本题中也必然有解。但这至少增强了你的信心让你不用担心无解情况。

我们按照左下角顶点的 $x,y$ 坐标奇偶性来分类。

你（其实是我）可能就要说了，我来一个这样的东西你不炸了（两个长方形左下角横纵坐标奇偶性均相同）？

![](peZoPsO.png)

实际上这种情况不可能存在。因为，它们左下角的顶点的 $x$ 坐标的差距正是下面的长方形的高度！这是一个奇数。

同样的，如果是左右边界挨着，而不是上下边界，也有类似的结论。$y$ 坐标奇偶性必然不同。

所以，在边长均为奇数的情况下，两个左下角横纵坐标奇偶性均相同的长方形必不会相邻。

然后横纵坐标奇偶性刚好有 $4$ 种情况。做完了。

> 彩蛋：你（我）兴冲冲写完代码，结果发现判断奇偶性写了一个 `x % 2`。

:::info[sub&code]

[sub](https://codeforces.com/problemset/submission/763/367079267)。

```cpp
#include <cstdio>

using namespace std;

int main()
{
	int n;
	scanf("%d", &n);
	printf("YES\n");
	for(int i=1;i<=n;i++)
	{
		int x1, y1;
		scanf("%d%d%*d%*d", &x1, &y1);
		printf("%d\n", ((x1 % 2 + 2) % 2) * 2 + ((y1 % 2 + 2) % 2) + 1);
	}
	return 0;
}
```
:::