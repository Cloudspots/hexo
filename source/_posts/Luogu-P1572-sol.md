---
title: P1572 计算分数 题解
date: 2024-2-24 10:47:38
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
这题没那么难，但是有一堆细节。

# 公式

小学五年级下学期数学第一讲：**异分母分数加减法要先通分**。

所以：

$$ \begin{aligned}\frac{a}{b} \pm \frac{c}{d} &= \frac{ad}{bd} \pm \frac{bc}{bd} \\
&= \frac{ad \pm bc}{bd} \end{aligned}$$

# 细节

- 输入的时候不要用 `scanf("%c%d/%d");`。
- 最大公因数计算需要加绝对值，不然会被卡：`-1/2+1/3`。
- 第一个数也要约分：`2/4`。
- 答案如果是整数不用输出 `/1`：`1/2+1/2`。
- 要实时约分，不然会[爆](https://www.luogu.com.cn/discuss/774452)。

# 代码

```cpp
#include <cstdio>
#include <cmath>

using namespace std;

long long gcd(long long x, long long y)
{
    if(y == 0) return abs(x);
    return gcd(y, x%y);
}

int main()
{
    long long a, b, c, d; //a/b c/d
    scanf("%lld/%lld", &c, &d);
    //约分：
    long long gdd = gcd(c, d);
    c/=gdd;
    d/=gdd;
    while(scanf("%lld/%lld", &a, &b) != EOF) //技巧：和P2788类似
    {
        if(op == '-') a = -a;
        // 计算：
        c = c*b + a*d;
        d = b*d;
        //约分：
        gdd = gcd(c, d);
        c/=gdd;
        d/=gdd;
    }
    printf("%lld", c);
    if(d != 1) printf("/%lld", d); //如果是整数
    puts("");
    return 0;
}
```