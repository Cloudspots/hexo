---
title: 题解：CF2108D Needle in a Numstack
date: 2026-3-15 17:18:37
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
首先，显然对于一个序列，必然有 $a_i=a_{i+k}$（对于 $b$ 同理，$b_i=b_{i+k}$）。

那么，一个想法是搞出前后 $k$ 个，对比找出不同的，对于不同的二分查找，然后对于二分查找的附近范围暴力查询对比。

但是，如果没有不同的呢？此时显然无法确定……但有一种特殊情况，就是当 $n=2k$ 时，有唯一解。

然后还要注意一下前后 $k$ 个会有错位。另外，“附近”指的是二分到的范围的前 $k$ 个（包括自身）。

另外，二分之后如何做呢？我们知道了前 $k$ 个，就可以知道左边的延伸范围（右端点）的上界（最大值），还有右边的延伸范围（左端点）的下界（最小值）。如果两者相差 $1$（右端点在左端点之后），则有唯一解，否则不唯一。

次数是 $3k+\log_2n$ 级别的。

:::info[sub&code]

[sub](https://codeforces.com/contest/2108/submission/366788299)。

```cpp
#include <cstdio>
#include <algorithm>

using namespace std;

int bgn[55], edn[55], mdl[55];

int main()
{
    int t;
    scanf("%d", &t);
    while (t--)
    {
        int n, k;
        scanf("%d%d", &n, &k);
        if (n == 2 * k)
        {
            printf("! %d %d\n", k, k); fflush(stdout);
            continue;
        }
        for (int i = 1; i <= k; i++)
        {
            printf("? %d\n", i); fflush(stdout);
            scanf("%d", bgn + i);
        }
        for (int i = n - k + 1; i <= n; i++)
        {
            printf("? %d\n", i); fflush(stdout);
            scanf("%d", edn + ((i - 1) % k + 1));
        }
        bool flag = true;
        for (int i = 1; i <= k; i++)
        {
            if (bgn[i] != edn[i]) // 就你了
            {
                flag = false;
                int l = 1, r = (n - i) / k;
                while (l < r)
                {
                    int mid = (l + r) / 2;
                    printf("? %d\n", mid * k + i); fflush(stdout);
                    int val;
                    scanf("%d", &val);
                    if (val == bgn[i]) l = mid + 1;
                    else r = mid;
                }
                // 前 k 个
                int vl = l * k + i;
                for (int j = vl - k + 1; j <= vl; j++)
                {
                    printf("? %d\n", j); fflush(stdout);
                    scanf("%d", mdl + ((j - 1) % k + 1));
                }
                int lmao = min(vl, n - k), rmio = max(vl - k + 1, k + 1);
                for (int j = vl - k + 1; j <= vl; j++)
                {
                    if (mdl[(j - 1) % k + 1] != bgn[(j - 1) % k + 1] && j - 1 < lmao) lmao = j - 1;
                    if (mdl[(j - 1) % k + 1] != edn[(j - 1) % k + 1] && j + 1 > rmio) rmio = j + 1;
                }
                if (lmao == rmio - 1)
                {
                    printf("! %d %d\n", lmao, n - lmao); fflush(stdout);
                }
                else
                {
                    printf("! -1\n"); fflush(stdout);
                }
                break;
            }
        }
        if (flag)
        {
            printf("! -1\n"); fflush(stdout);
        }
    }
    return 0;
}
```

:::