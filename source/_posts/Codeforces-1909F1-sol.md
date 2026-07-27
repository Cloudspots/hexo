---
title: 题解：CF1909F1 Small Permutation Problem (Easy Version)
date: 2026-3-15 21:16:20
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
处理排列的一个方法是，将其转化为二维点集。对于第 $i$ 个元素 $p_i$，有对应点 $(i,p_i)$。这样，每行每列都有且只有一个点。比如，这是排列 $[2,1,5,6,3,4]$ 对应的点集：

![Made by desmos](peVth28.png)

我们发现，$a_i$ 代表左下方的一个正方形内的圆的数量。那么，$a_i-a_{i-1}$ 就代表一个“拐角”形内的圆的数量。

我们发现，一个“拐角”内部最多有两个圆。那么，进行分讨。

- 没有圆（$a_i-a_{i-1}=0$）：总方案数没变。
- 有一个圆（$a_i-a_{i-1}=1$）：这时，有三种情况。  
  第一种情况：
  ![Made by desmos](peVtOP0.png)  
  此时，由于左下方的正方形中占用了 $a_{i-1}$ 个数字，还剩下 $(i-1)-a_{i-1}$ 个可以用，所以方案数的贡献为 $(i-1)-a_{i-1}$。  
  第二种情况：
  ![Made by desmos](peVtvxU.png)  
  和上一个相同。
  第三种情况：
  ![不知道为啥，这个图片的观感就是没那么好](peVtzMF.png)  
  一定有一种情况，贡献为 $1$。  
  所以总贡献（乘积）为 $2((i-1)-a_{i-1})+1$。
- 有两个圆（$a_i-a_{i-1}=2$）：只有一种情况。  
  ![](peVNAG6.png)  
  此时贡献为 $((i-1)-a_{i-1})^2$。

那么，对于所有的贡献作乘积即可。

需要注意的一些点：关于判断无解。

- $a_i<a_{i-1}$ 无解。
- $a_i-a_{i-1}>2$ 无解。
- $a_i>i$ 无解。
- $a_n\neq n$ 无解。

判完就过了。

:::info[sub&code]
[sub](https://codeforces.com/contest/1909/submission/366811827)。

```cpp
#include <cstdio>

using namespace std;

int a[200005];

int main()
{
    int t;
    scanf("%d", &t);
    while (t--)
    {
        int n;
        scanf("%d", &n);
        for (int i = 1; i <= n; i++)
        {
            scanf("%d", a + i);
        }
        long long mul = 1;
        for (int i = 1; i <= n; i++)
        {
            int d = a[i] - a[i - 1];
            if (d < 0 || d > 2 || a[i] > i || i == n && a[i] != n)
            {
                mul = 0;
                break;
            }
            if (d == 0) continue;
            if (d == 1) mul = mul * (2 * ((i - 1) - a[i - 1]) + 1) % 998244353;
            else mul = mul * ((i - 1) - a[i - 1]) % 998244353 * ((i - 1) - a[i - 1]) % 998244353;
        }
        printf("%lld\n", mul);
    }
    return 0;
}
```
:::