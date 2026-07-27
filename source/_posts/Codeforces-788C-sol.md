---
title: 题解：CF788C The Great Mixing
date: 2025-8-5 17:52:35
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
在 $a$ 中选出一些数字（可以重复选也可以不选），平均数为 $n$。

平均数不好处理，总和好处理啊！平均数和总和之间唯一好做转换的数字就是 $0$。所以将元素全部减去 $n$，结果要求平均数为 $0$，也就是总和为 $0$。

然后考虑到 $k$ 比较大，可以进行去重。所以现在 $k$ 是 $1001$ 的范围。

是一个好像是背包 dp 的东西。但是我们怎么辨别是无解，还是有解但是解很大呢？很显然，当所有值都是正/负的时候是无解的。如果不是，那么选出一正一负两个数字 $x,-y$，取 $y$ 个 $x$ 和 $x$ 个 $-y$ 就可以凑出 $0$，所以必然有解。

同时可以得到，解是 $\mathcal O(V)$ 范围的。这样就可以放心大胆地背包 DP 了……吗？

得到的数字可能是 $\mathcal O(V^2)$ 范围的！暴力 dp 复杂度是 $\mathcal O(V^4)$ 的！

这时候就需要用到一个 trick：如果 DP 的结果是 $0/1$，可以考虑用数字代替。具体地，我们这里使用 $f_{i}$ 表示至少需要多少个数字才能够凑出 $i$（或者凑不出，为 $-1$）。

但是，怎么转移？要知道我们这里的值有正有负，怎么转移呢？这个图貌似都不是一个 DAG。

我们之前说过了解是 $\mathcal O(V)$ 范围的，所以可以直接正推（从已知状态推未知状态，也就是 bfs 了 $\mathcal O(V)$ 层）$\mathcal O(V)$ 层。总时间复杂度就是 $\mathcal O(V^3)$。

能不能进一步优化？实际上只需要使用 $[-V,V]$ 的节点。这是因为，我们在加加减减的某个过程中如果得到了正数，则后面参与加减的数字中必然还有负数（不然一定得不到 $0$），然后直接加上那个负数。如果得到了负数同理。显然永远不会造成不在 $[-V,V]$ 的情况。

由于 $k=\mathcal O(V^2)$，这已经是最优时间复杂度了。输入都需要这么多。

:::success[代码&提交记录]
```cpp
#include <cstdio>
#include <queue>
#include <cstring>

using namespace std;

int fffff[2010];
bool flaggggg[2010];
int a[1005];

int main()
{
    memset(fffff, 0x3f, sizeof fffff);
    int *f = fffff + 1005;
    bool *flag = flaggggg + 1005;
    int n, k;
    scanf("%d%d", &n, &k);
    for(int i=1;i<=k;i++)
    {
        int x;
        scanf("%d", &x);
        flag[x - n] = true;
    }
    int cur = 0;
    for(int i=-1001;i<=1001;i++)
    {
        if(flag[i]) a[++cur] = i;
    }
    k = cur;
    queue<int> q;
    for(int i=1;i<=k;i++)
    {
        q.push(a[i]);
        f[a[i]] = 1;
    }
    while(!q.empty())
    {
        int u = q.front();
        q.pop();
        if(u == 0)
        {
            printf("%d\n", f[u]);
            return 0;
        }
        for(int i=1;i<=n;i++)
        {
            if(u + a[i] >= -1001 && u + a[i] <= 1001)
            {
                if(f[u] + 1 < f[u+a[i]])
                {
                    f[u+a[i]] = f[u] + 1;
                    q.push(u + a[i]);
                }
            }
        }
    }
    printf("-1\n");
    return 0;
}
```

[sub](https://codeforces.com/contest/788/submission/332482828)。
:::