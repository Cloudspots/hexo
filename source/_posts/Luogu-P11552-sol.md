---
title: 题解：P11552 [ROIR 2016 Day 1] 太空移民
date: 2025-1-10 22:56:06
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
前言：感谢 @lzx111218 让我找到了这题，可以水一发题解。

update：修正了三处笔误。审核员太勤劳了。

分类讨论。

首先考虑纯数学做法，看看是否可行。

如果全是横着放的，那么一行最多能够放置 $\left\lfloor\dfrac{w}{a+2d}\right\rfloor$ 个，一列最多能够放置 $\left\lfloor\dfrac{h}{b+2d}\right\rfloor$ 个，总共可以放置 $\left\lfloor\dfrac{w}{a+2d}\right\rfloor \times \left\lfloor\dfrac{h}{b+2d}\right\rfloor$ 个，这个值需要 $\ge n$。

如果全是横着放的，那么一行最多能够放置 $\left\lfloor\dfrac{w}{b+2d}\right\rfloor$ 个，一列最多能够放置 $\left\lfloor\dfrac{h}{a+2d}\right\rfloor$ 个，总共可以放置 $\left\lfloor\dfrac{w}{b+2d}\right\rfloor \times \left\lfloor\dfrac{h}{a+2d}\right\rfloor$ 个，这个值需要 $\ge n$。

发现纯数学做法不太好做，但是明显答案含有单调性，考虑二分，显然是二分 $d$，顺便复习一下我 $998244353$ 年没写过的二分。

根据上面的分析，需要满足 $\left\lfloor\dfrac{w}{a+2d}\right\rfloor \times \left\lfloor\dfrac{h}{b+2d}\right\rfloor \ge n$ 或 $\left\lfloor\dfrac{w}{b+2d}\right\rfloor \times \left\lfloor\dfrac{h}{a+2d}\right\rfloor \ge h$，也就是：

$$$$\max\left(
\left\lfloor\dfrac{w}{a+2d}\right\rfloor \times \left\lfloor\dfrac{h}{b+2d}\right\rfloor,
\left\lfloor\dfrac{w}{b+2d}\right\rfloor \times \left\lfloor\dfrac{h}{a+2d}\right\rfloor \right) \ge n$$$$

然后考虑二分上下界。显然下界为 $0$，没那么显然但还是挺显然的，上界为 $\min\left(\dfrac{w}{2},\dfrac{h}{2}\right)$（这是 $a=b=0$ 的情况），但是因为 $d$ 为整数，所以实际上在代码里使用的是 $\left\lfloor\dfrac{\min\left(w,h\right)}{2}\right\rfloor$。

那么套一个二分板子就做完了，耶！

代码很简洁：

```cpp
#include <cstdio>    // 用于输入输出
#include <algorithm> // 用于 max/min

using namespace std;

int main()
{
    long long n, a, b, w, h; // 范围 $10^{18}$，所以需要开 `long long`
    scanf("%lld%lld%lld%lld%lld", &n, &a, &b, &w, &h); // `long long` 的输入需要用 `%lld`
    long long l = 0, r = min(w, h) / 2; // 二分范围
    while (l < r) // l != r 也行
    {
        long long d = (l + r + 1) / 2; // 相信编译器优化，/2 -> >>1 优化是不需要手写的。
        if (
            max(
                (w / (a + 2 * d)) * (h / (b + 2 * d)), 
                (w / (b + 2 * d)) * (h / (a + 2 * d)))
            >= n) l = d; // 二分判断条件
        else r = d - 1;
    }
    printf("%lld\n", l);
    return 0;
}
```