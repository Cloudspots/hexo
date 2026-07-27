---
title: 题解：P14005 棋盘游戏
date: 2025-9-9 15:57:15
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
突然发现洛谷题目 id 突破了 $14000$。

显然，我们在同一个位置运用两种变换，可以让下面的图形中所有的格子反转，不妨记为图形“吅”：

![](pVRMesI.png)

（拜谢 desmos，下同）

上下运用我们造出来的图形吅就可以造出来图形“田”：

![](pVRMueP.png)

运用一次“田”，再运用一次原本的两个图形中的任何一个，就可以让一个格子反转，其它格子不变。

所以，如果原本的黑格在 $(x,y)$，那么我们可以先把 $(x,y)$ 颜色反转使其变白，然后将所有应当为黑格的格子反转变黑。这样，就构造出了一组解。

因此，所有 $(x,y)$ 都是解，只要 $x,y$ 都是整数。

选手代码和 spj 代码比谁长度短了属于是。

```cpp
#include <cstdio>
using namespace std;
int main()
{
    printf("114 -514\n");
    return 0;
}
```