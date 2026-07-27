---
title: 题解：B4398 [蓝桥杯青少年组国赛 2025] 第三题
date: 2025-8-29 19:43:21
categories:
  - Solution
tags:
  - Solution
  - Luogu B Problem Solution
---
看起来挺难是不是？首先我们知道这里子序列等价于子集（可重集）。

完全平方数的性质：质因子分解后，每个指数都是偶数。即 $\displaystyle n\text{ 为完全平方数}\iff n=\prod_{p\in \mathbb P} p^{\alpha_p},\forall p\in \mathbb P,\alpha_p\equiv 0\pmod 2$。

两个元素的乘积为完全平方数又等价于他们质因子分解中每个指数的奇偶性都相同。也就是说，将指数模二之后相同。

这样我们就可以把每个数字变为其指数模二之后的数字，然后求众数（出现次数最多的数字）。

转换代码：

```cpp
int qaq(int x)
{
    int res = 1;
    for (int i = 2; i * i <= x; i++)
    {
        if (x % i == 0)
        {
            int cnt = 0;
            while (x % i == 0)
            {
                x /= i;
                cnt++;
            }
            if (cnt & 1) res *= i;
        }
    }
    return res * x;
}
```

计数因为值域比较大（不过 $10^7$ 也不会爆炸），可以使用 `unordered_map`。

[记录](https://www.luogu.com.cn/record/233753583)。