---
title: 题解：P14145 荒谬
date: 2025-10-10 13:28:07
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
构造一个 DAG，距离不等于 $2$ 的点对数量不多于 $n\lceil \log_2n\rceil$。

有一个非常显然的做法，分出一个点作为中转，其余点的一半连到中转点，中转点连到剩下的点。这样就有 $\left\lfloor \dfrac{n-1}{2}\right\rfloor\times \left\lceil\dfrac{n-1}{2}\right\rceil$ 个点对距离为 $2$，可以拿到 $20$ 分。

::anti-ai[赛时想到这就倒闭走人了。]

考虑哪些点距离不为 $2$：与中转点直接相邻的点，和上下两部分的点。

与中转点直接相邻的点个数是 $\mathcal O(n)$ 的，用处不是很大。而上下两部分的点是 $\mathcal O(n^2)$ 的，考虑优化这个。

因为有对称性，并且下面不能连到上面，所以直接考虑一部分。

这样就变成了：有一些点，连一些边，最大化距离为 $2$ 的点对数量。

这不就是原本的题吗？递归下去即可。

那么这样最终的点对数量是多少？$T(n)=T\left(\left\lfloor\dfrac{n-1}{2}\right\rfloor\right)+T\left(\left\lceil\dfrac{n-1}{2}\right\rceil\right)+\left\lfloor\dfrac{n-1}{2}\right\rfloor\times\left\lceil\dfrac{n-1}{2}\right\rceil$。打个表会发现应该是符合条件的。比赛的时候直接交上去就行，但是这里是题解所以需要证明。

我们发现直接证明不是很好算，所以可以考虑有多少个点对距离不是 $2$。显然，没有距离大于二的点对，我们只需要考虑距离为 $1$ 的点对即可（同时，也没有不连通的点对）。每次递归都会造成 $n-1$ 个不连通的点对，而递归的每一层（即，深度相同的递归）总共的点数都不会超过 $n$，递归最多 $\lceil\log_2n\rceil$ 层，所以一共最多 $n\lceil\log_2n\rceil$ 个点对距离为 $1$。

:::info[代码&提交记录]
```cpp
#include <cstdio>

using namespace std;

void doit(int l, int r)
{
    if(r - l <= 0) return;
    int mid = (l + r) / 2;
    for(int i=l;i<=r;i++)
    {
        if(i < mid) printf("%d %d\n", i, mid);
        if(i > mid) printf("%d %d\n", mid, i);
    }
    doit(l, mid - 1);
    doit(mid + 1, r);
}

int sum[2005];

int main()
{
    int n;
    scanf("%d", &n);
    // 不想在递归的时候统计边数，先递推
    for(int i=1;i<=n;i++)
    {
        sum[i] = sum[(i-1)/2] + sum[i/2] + (i - 1); 
    }
    printf("%d\n", sum[n]);
    doit(1, n);
    return 0;
}
```

[rec](https://www.luogu.com.cn/record/239727533)。
:::