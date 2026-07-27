---
title: 人类的智慧是无！穷！无！尽！的！！！
date: 2025-2-16 12:29:46
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
经过[实测](https://www.luogu.com.cn/record/203294382)，zak 的[题解](https://www.luogu.com.cn/article/plgjnc09)的[代码](https://www.luogu.com.cn/record/59735277)在 hack 之后（添加了 $8$ 个数据点）已经无法 AC，然而人类的智慧就到此为止了吗？？

# Part 1

显然，我们可以猜到，我们使用 $(x+1)(y+1)$ 排序可以取得更好的效果。同时，我们向后计算 $600$ 个点。并且随机角度 $\theta$ 取 $[0,1]$。

总的来说，算法步骤：

1. 随机选取角度 $\theta$。
2. 把所有点旋转 $\theta$ 弧度。
3. 按照 $(x+1)(y+1)$ 排序。
4. 每个点取向后 $600$ 个点计算答案。

[aclink](https://www.luogu.com.cn/record/203294301)。

# Part 2

根据数学直觉，乘上一个随机数，再平移一个随机数，然后按照 zak 的方法算，会有更好的效果。

[ACLink](https://www.luogu.com.cn/record/203345391)。