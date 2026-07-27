---
title: 题解：P13976 数列分块入门 1
date: 2025-9-12 10:42:31
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
树状数组板子题。

好吧开玩笑的，这题是分块入门，我们用分块做。

---

什么是分块？

分块是一种**思想**，但不是一种算法。算法是基于方法的，方法又是基于思想的。

正如其名，分块就是把数列分成若干个块，然后计算答案。如何计算？如果区间问题的区间在块内则使用一种方法计算，如果不在一个块之内（块间）则使用另一种方法。通常来讲，这个另一种方法是处理最左边的块的一部分、最右边的块的一部分和中间的块。

我们来看这题。

::anti-ai[但我还是想写树状数组啊啊啊啊啊啊！！]

首先看区间加法。考虑块内如何处理。可能不是很好处理，因为是一个规模变为块长 $L$，但是和原问题一模一样的问题。可以考虑暴力修改。

使用类似的方法处理掉块间的左右两边的不完整的块，对于中间的块，直接处理太笨了，可以打标记。

标记不必在某个时刻下传到一个块内的所有数字，可以永久化。修改的时候当它不存在，而查询的时候加上查询的数字所在的块的大小即可。

查询时间复杂度是 $\Theta(1)$，块内修改是 $\mathcal O(L)$，块间修改是 $\mathcal O\left(L+\dfrac{n}{L}\right)$，最多是 $\mathcal O\left(L+\dfrac{n}{L}\right)$。这个东西的最小值显然是 $L=\sqrt{n}$ 时的 $\mathcal O(\sqrt{n})$。如果 $n$ 不是完全平方数也可以取 $\left\lfloor\sqrt{n}\right\rfloor$ 或 $\left\lceil\sqrt{n}\right\rceil$，对时间复杂度没有影响。通常取向下取整，因为比较简单。

总时间复杂度是 $\mathcal O(n\sqrt{n})$ 的。记得开 `long long`。

另一件事情是，尽管保证了 $a_i$ 在 `long long` 范围内，直接写代码仍然可能出现 ub。初始 $a_i=-2^{63}$，然后对整块加上 $2^{63}-1$，然后对块内的一个 $a_i$ 单独加上 $-1$，此时实际的值是 $-2$，存储的标记是 $2^{63}-1$，存储的 $a_i$ 是 $-2^{63}-1$，溢出了，但是通常不会影响结果。要解决这个问题，我们可以假装值对 $2^{64}$ 取模，然后输出的时候如果大于等于 $2^{63}$ 就转换回去。通常来讲，不做这样的处理也不会影响结果，故我们在 OI 中通常不会对于这样“不会影响结果的溢出”做特殊处理，毕竟看的是输出结果对不对，对了但是有 ub 也是算对的。下面的代码中没有进行处理。

代码：

```cpp
#include <cstdio>
#include <cmath>

using namespace std;

long long a[300005], tag[550];

int main()
{
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++)
    {
        scanf("%lld", a + i);
    }
    int blksz = sqrt(n); // blksz = BLocKSiZe = Block Size = 块长
    for (int i = 1; i <= n; i++)
    {
        int opt, l, r;
        long long c;
        scanf("%d%d%d%lld", &opt, &l, &r, &c);
        if (opt == 1) printf("%lld\n", a[r] + tag[(r + blksz - 1) / blksz]);
        else
        {
            // 处理修改
            int lid = (l + blksz - 1) / blksz;
            int rid = (r + blksz - 1) / blksz;
            if (lid == rid) // 块内暴力修改
            {
                for (int j = l; j <= r; j++)
                {
                    a[j] += c;
                }
            }
            else // 块间修改
            {
                // 左右两边暴力修改
                for (int j = l; j <= lid * blksz; j++)
                {
                    a[j] += c;
                }
                for (int j = (rid - 1) * blksz + 1; j <= r; j++)
                {
                    a[j] += c;
                }
                // 中间暴力打标记
                for (int j = lid + 1; j < rid; j++)
                {
                    tag[j] += c;
                }
            }
        }
    }
    return 0;
}
// 总结：分块是暴力。
```

[record](https://www.luogu.com.cn/record/235072388)。

彩蛋：既然没法很好处理块内数据，为什么我们不考虑……对每个块再次分块，然后再次分块，以此类推，直到块长变为 $1$ 呢？实际上这样是可以的，你会发现这成为了一个树的形状。这个东西稍加优化并作用在值域上可以变成 van Emde Boas 树，做到 $\mathcal O(\log \log V)$ 的很多操作（插入删除查找前驱后继），还能支持卫星数据。我并不会这玩意儿，OI 中也不考。